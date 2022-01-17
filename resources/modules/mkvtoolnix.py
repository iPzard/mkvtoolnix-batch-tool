import chardet, ffmpeg, os, re, subprocess
from textblob import TextBlob
from . import filewalker

FileWalker = filewalker.FileWalker()

""" MKVToolNix:
Wrapper for MKVToolNix to allow
control via Python functions
"""
class MKVToolNix:

  """Add subtitle
  Function to merge video and
  subtitle file(s) into an MKV
  """
  """
  TODO: issue #37
  include attachments here
  """
  def add_subtitles(
    self,
    is_remove_ads,
    is_remove_existing_subtitles,
    subtitle_input_paths,
    default_language_track,
    video_input_path,
    video_output_path,
  ):

    # MKVToolNix command to use
    mkvtoolnix = os.path.abspath("resources/mkvtoolnix")
    mkv_command = f"cd {mkvtoolnix} && mkvmerge -o"

    # Video file input and output paths
    video_path_info = f'"{video_output_path}" "{video_input_path}"'

    # Update video path info to remove existing subs, if user selected option
    if is_remove_existing_subtitles:
      video_path_info = (
        f'"{video_output_path}" --no-subtitles "{video_input_path}"'
      )

    # Keep track of subtitle options
    subtitle_options = []
    converted_input_paths_to_remove = []
    
    # Iterate through subtitle paths and generate option commands
    for index, subtitle_input_path in enumerate(subtitle_input_paths):

      """
      List of incompatible but convertable 
      extensions, new extensions must also 
      be added to the `subtitle_file_types`
      list in ./filewalker.py
      """
      incompatible_convertable_extensions = ['smi'] # can add more if requests come in

      # Determine extension to check compatibility
      subtitle_extension = FileWalker.get_path_extension(subtitle_input_path)
      
      # If incompatible but convertable extension
      if subtitle_extension in incompatible_convertable_extensions:
        
        # try converting the file to `.srt`
        try:
          converted_subtitle_input_path = f"{subtitle_input_path}.srt"
          stream = ffmpeg.input(subtitle_input_path)
          stream = ffmpeg.output(stream, converted_subtitle_input_path)
          ffmpeg.run(stream)

          # Update input path and push to paths to remove
          subtitle_input_path = converted_subtitle_input_path
          converted_input_paths_to_remove.append(subtitle_input_path)

        # If issue(s) with converting, continue with original file
        except:
          pass

      # Determine subtitle language, use und if undetermined
      try:
        subtitle_language_info = self.determine_language(subtitle_input_path)
      except:
        subtitle_language_info = {
          "language": "Undetermined",
          "language_code": "und",
        }
      subtitle_language_code = subtitle_language_info["language_code"]
      subtitle_language = subtitle_language_info["language"]
      is_default_language_track = subtitle_language is default_language_track

      # Determine if subtitles should play automatically (is default track)
      default_track_setting = (
        " --default-track 0:true" if is_default_language_track else ""
      )

      # Subtitle language, track name, and path
      subtitle_track_count = f"0{index + 1}" if index < 9 else index + 1
      subtitle_language_setting = f"--language 0:{subtitle_language_code}"
      subtitle_track_settings = (
        f"--track-name 0:{subtitle_track_count}{default_track_setting}"
      )

      subtitle_input_path_quoted = (
        f'"{subtitle_input_path}"'  # Wrap in quotes for spaces in dir names
      )

      # If user wants advertisements removed from subtitle files
      if is_remove_ads:
        self.remove_subtitles_ads(subtitle_input_path)

      subtitle_options.append(
        " ".join(
          [
            subtitle_language_setting,
            subtitle_track_settings,
            subtitle_input_path_quoted,
          ]
        )
      )

    # Combine subtitle options into command
    subtitle_commands = " ".join(subtitle_options)

    
    """
    TODO: issue #37
    attachment_commands = 
    """

    
    """
    TODO: issue #37
    include attachment_commands in os_command
    """
    # Finalized command for OS
    os_command = " ".join([mkv_command, video_path_info, subtitle_commands])

    # Use command in system
    subprocess.call(os_command, shell=True)

    # Delete any converted input paths that may exist
    if len(converted_input_paths_to_remove):
      for converted_input_path in converted_input_paths_to_remove:
        os.remove(converted_input_path)


  """ Determine language
  Function to parse text and
  determine subtitle language
  """
  def determine_language(self, subtitle_input_path):

    # Ensure UTF-8 encoding
    self.ensure_utf8_encoding(subtitle_input_path)

    # Sniff out subtitle language in first 10 lines
    with open(subtitle_input_path, "r", encoding="utf8", errors="replace") as file:
      
      # Determine extension of subtitle file
      subtitle_extension = FileWalker.get_path_extension(subtitle_input_path)
      
      """ Handle .ass files
      These extensions have a config
      section at the top which should be 
      ignored when determining language
      """
      if subtitle_extension == 'ass':

        # Gets first 10 lines of "Dialogue" display text
        subtitle_dialogue_lines = [
          line.split('}')[1] for line in file.readlines() if "Dialogue:" in line
        ][:10] # We just need the first 10 lines

        # text sample if .ass subtitle file
        text_sample = "".join(subtitle_dialogue_lines)

      else:
        # text for non .ass subtitle files
        text_sample = "".join([file.readline() for _ in range(10)])
      
    # Detected ISO 639-1 code, use und if undetermined
    try:
      # remove new lines and lines that start with numbers
      text_sample = re.sub('\n|^[0-9].*', '', text_sample, flags=re.MULTILINE)
      iso_639_1_code = TextBlob(text_sample).detect_language()
    except:
      iso_639_1_code = "und"

    # Simplify ISO to base (e.g., 'zh-TW' = 'zh')
    iso_code = iso_639_1_code[0] + iso_639_1_code[1]

    # ISO 639-1 to ISO 639-2 language code map
    language_map = {
      "ar": {"code": "ara", "text": "Arabic"},
      "zh": {"code": "chi", "text": "Chinese"},
      "nl": {"code": "dut", "text": "Dutch"},
      "en": {"code": "eng", "text": "English"},
      "es": {"code": "spa", "text": "Spanish"},
      "fr": {"code": "fre", "text": "French"},
      "de": {"code": "ger", "text": "German"},
      "it": {"code": "ita", "text": "Italian"},
      "ja": {"code": "jpn", "text": "Japanese"},
      "pt": {"code": "por", "text": "Portuguese"},
      "ru": {"code": "rus", "text": "Russian"},
      "sv": {"code": "swe", "text": "Swedish"},
    }

    # Return ISO 639-2 code or "und"/"Undetermined" if unsupported
    language_code = (
      language_map[iso_code]["code"] if iso_code in language_map else "und"
    )
    language = (
      language_map[iso_code]["text"]
      if iso_code in language_map
      else "Undetermined"
    )
    
    # Return language and ISO 639-2 code
    return {"language": language, "language_code": language_code}


  """ Ensure UTF-8
  Function to ensure encoding
  is compatible with MKVToolNix
  """
  def ensure_utf8_encoding(self, subtitle_input_path):

    # Sniff out encoding method in first 10 lines
    with open(subtitle_input_path, "rb") as f:
      rawdata = b"".join([f.readline() for _ in range(10)])

    # Encoding method and method whitelist
    encoding_method = chardet.detect(rawdata)["encoding"]
    encoding_method_whitelist = ["ascii", "ISO-8859-9", "utf8", "Windows-1252"]


    # If encoding method will cause issues, convert it to utf-8
    if encoding_method not in encoding_method_whitelist:

      # Read the "old" file's content
      with open(subtitle_input_path, encoding=encoding_method) as subtitle_file:
        subtitle_text = subtitle_file.read()

      # Convert to utf-8 and write to file
      with open(
        subtitle_input_path, "w", encoding="utf8", errors="replace"
      ) as subtitle_file:
        subtitle_file.write(subtitle_text)

      subtitle_file.close()


  """ Remove subtitles
  Function to create new MKV
  which excludes all existing
  subtitles
  """
  def remove_subtitles(self, video_input_path, video_output_path):

    # MKVToolNix command to use
    mkvtoolnix = os.path.abspath("resources/mkvtoolnix")
    mkv_command = f"cd {mkvtoolnix} && mkvmerge -o"

    # Video file input path, option(s), and output path
    video_info = f'"{video_output_path}" --no-subtitles "{video_input_path}"'

    # Finalized command for OS
    os_command = " ".join([mkv_command, video_info])

    # Run command
    subprocess.call(os_command, shell=True)


  """ Remove subtitle ads:
  Function to remove common
  advertisements from subtitle
  files
  """
  def remove_subtitles_ads(self, subtitle_input_path):

    # Common (fractional) advertisement text
    ad_text = ["mkv player", "opensubtitles", "yify"]

    # Read the "old" file's content, it's converted to utf8 by this point
    with open(
      subtitle_input_path, encoding="utf8", errors="replace"
    ) as subtitle_file:
      subtitle_text = subtitle_file.readlines()

    # Iterate through lines and remove lines that contain ads
    with open(
      subtitle_input_path, "w", encoding="utf8", errors="replace"
    ) as subtitle_file:

      # Check each line
      for line in subtitle_text:
        line_text = line.lower()

        # Against each ad text
        for text in ad_text:

          # Remove lines that contain ad text
          if text in line_text:
            line = "\n"

        # Write potentially modified line to file
        subtitle_file.write(line)

    # Close file
    subtitle_file.close()
