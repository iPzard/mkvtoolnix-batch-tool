import chardet, ffmpeg, json, os, re, subprocess
from langdetect import detect
from . import filewalker

FileWalker = filewalker.FileWalker()

""" MKVToolNix:
Wrapper for MKVToolNix to allow
control via Python functions
"""
class MKVToolNix:

  """Run OS command
  Function to merge video and
  subtitle file(s) into an MKV
  """
  def run_os_command(self, os_command):
    subprocess.call(os_command, shell=True)

  """FFmpeg probe hi-jack
  Customized arguments to Popen to
  prevent console flashes after
  compiled with PyInstaller
  """
  def ffmpeg_probe(self, video_input_path):
      command = ['ffprobe', '-show_format', '-show_streams', '-of', 'json']
      command += [video_input_path]

      process = subprocess.Popen(
        command,
        shell=True,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
      )
      out, err = process.communicate()
      if process.returncode != 0:
          raise Exception(f"ffprobe error: {err}")

      return json.loads(out.decode('utf-8'))

  """FFmpeg run hi-jack
  Uses argument compiler from
  library but alternate sub-
  process method to run command
  to prevent console flashes.
  """
  def ffmpeg_run(self, stream):
    os_command = ffmpeg.compile(stream, 'ffmpeg', overwrite_output=True)

    return self.run_os_command(os_command)

  """Add subtitle
  Function to merge video and
  subtitle file(s) into an MKV
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
      List of incompatible but convertible
      extensions, new extensions must also
      be added to the `subtitle_file_types`
      list in ./filewalker.py
      """
      incompatible_convertible_extensions = ['smi'] # can add more if requests come in

      # Determine extension to check compatibility
      subtitle_extension = FileWalker.get_path_extension(subtitle_input_path)

      # If incompatible but convertible extension
      if subtitle_extension in incompatible_convertible_extensions:

        # try converting the file to `.srt`
        try:
          converted_subtitle_input_path = f"{subtitle_input_path}.srt"
          stream = ffmpeg.input(subtitle_input_path)
          stream = ffmpeg.output(stream, converted_subtitle_input_path)
          ffmpeg.run(stream, overwrite_output=True, quiet=True)

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
    self.run_os_command(os_command)

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

    # Length of lines to sniff for language detection
    line_sniff_count = 100

    # Sniff out subtitle language
    with open(subtitle_input_path, "r", encoding="utf8", errors="replace") as file:

      # Determine extension of subtitle file
      subtitle_extension = FileWalker.get_path_extension(subtitle_input_path)

      """ Handle .ass files
      These extensions have a config
      section at the top which should be
      ignored when determining language
      """
      if subtitle_extension == 'ass':

        # Gets sniffed lines of "Dialogue" display text
        subtitle_dialogue_lines = [
          line.split('}')[1] for line in file.readlines() if "Dialogue:" in line
        ][:line_sniff_count]

        # text sample if .ass subtitle file
        text_sample = "".join(subtitle_dialogue_lines)

      else:
        # text for non .ass subtitle files
        text_sample = "".join(file.readlines())

      """ Handle .idx files
      These extensions use image-based
      subtitles and have the language
      set within the file's configuration
      options.
      """
      if subtitle_extension == 'idx':
        for line in file:
          if 'id:' in line: # find ID (lang) setting
            iso_639_1_code = re.sub('id:\s*|,(.*)', '', line)

      else:
        """
        Remove new lines and lines that
        start with numbers, then split
        into an evaluation list.
        """
        text_sample = re.sub(
          '\n|^[0-9].*', '', text_sample, flags=re.MULTILINE
        ).split(' ', line_sniff_count)[:line_sniff_count]
        iso_639_1_code_list = []

        # Detected ISO 639-1 code, use und if undetermined
        for word in text_sample:
          try:
            # Add detected language ISO code to list
            iso_639_1_code_list.append(detect(word))
            pass

          # If word language cannot be detected, skip
          except:
            pass

        """ Set ISO-639-1 code:
        Sets to most frequently occuring
        ISO code in the list of translated
        words, this minimizes incorrect
        interpretations.
        """
        iso_639_1_code = max(
          set(iso_639_1_code_list),
          key = iso_639_1_code_list.count
        )

        # Default to "und"
        if iso_639_1_code is None:
          iso_639_1_code = "und"

    # Simplify ISO to base (e.g., 'zh-TW' = 'zh')
    iso_code = iso_639_1_code[0] + iso_639_1_code[1]

    # ISO 639-1 to ISO 639-2 language code map
    language_map = self.get_supported_languages()

    # Return ISO 639-2 code or "und"/"Undetermined" if unsupported
    language_code = (
      language_map[iso_code]["key"] if iso_code in language_map else "und"
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
    self.run_os_command(os_command)


  """ Extract subtitles
  Function to extract existing
  subtitles from videos
  """
  def extract_subtitles(self, video_input_path, subtitle_output_directory):
    if subtitle_output_directory is None:
      subtitle_output_directory = os.path.dirname(video_input_path)

    probe = self.ffmpeg_probe(video_input_path)

    subtitle_streams = [stream for stream in probe['streams'] if stream['codec_type'] == 'subtitle']
    print(subtitle_streams)

    # Keep track of the number of streams extracted for each language
    lang_counts = {}

    for stream in subtitle_streams:
      # Set the language code and subtitle type based on the subtitle stream tags
      tags = stream.get('tags', {})
      language_code = tags.get('language', 'und')
      subtitle_type = tags.get('title', 'default')

      # Increment the stream count for this language
      lang_counts[language_code] = lang_counts.get(language_code, 0) + 1
      lang_count_curr = f"{lang_counts[language_code]:02}"

      # Map the subtitle type to the appropriate subtitle file suffix
      type_map = {'forced': 'forced', 'SDH': 'sdh'}
      type = type_map.get(subtitle_type, '')

      # Configure suffix and extension
      suffix = ".".join(filter(None, [language_code, lang_count_curr, type]))
      extension = 'srt'

      # Set the output file name
      output_file = os.path.join(
        subtitle_output_directory,
        f"{os.path.splitext(os.path.basename(video_input_path))[0]}.{suffix}.{extension}"
      )

      # Extract the subtitle stream
      stream = ffmpeg.input(video_input_path)
      stream = ffmpeg.output(stream, output_file, **{'c:s': 'srt', 'map': f'0:s:{stream["index"]}?'})

      self.ffmpeg_run(stream)



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


  """ Supported languages:
  Returns a map of MKVToolNix
  supported languages.
  """
  def get_supported_languages(self):
    return {
      'aa': { 'key': 'aar', 'text': 'Afar' },
      'ab': { 'key': 'abk', 'text': 'Abkhazian' },
      'ae': { 'key': 'ave', 'text': 'Avestan' },
      'af': { 'key': 'afr', 'text': 'Afrikaans' },
      'ak': { 'key': 'aka', 'text': 'Akan' },
      'am': { 'key': 'amh', 'text': 'Amharic' },
      'an': { 'key': 'arg', 'text': 'Aragonese' },
      'ar': { 'key': 'ara', 'text': 'Arabic' },
      'as': { 'key': 'asm', 'text': 'Assamese' },
      'av': { 'key': 'ava', 'text': 'Avaric' },
      'ay': { 'key': 'aym', 'text': 'Aymara' },
      'az': { 'key': 'aze', 'text': 'Azerbaijani' },
      'ba': { 'key': 'bak', 'text': 'Bashkir' },
      'be': { 'key': 'bel', 'text': 'Belarusian' },
      'bg': { 'key': 'bul', 'text': 'Bulgarian' },
      'bh': { 'key': 'bih', 'text': 'Bihari languages' },
      'bi': { 'key': 'bis', 'text': 'Bislama' },
      'bm': { 'key': 'bam', 'text': 'Bambara' },
      'bn': { 'key': 'ben', 'text': 'Bengali' },
      'bo': { 'key': 'tib', 'text': 'Tibetan' },
      'br': { 'key': 'bre', 'text': 'Breton' },
      'bs': { 'key': 'bos', 'text': 'Bosnian' },
      'ca': { 'key': 'cat', 'text': 'Catalan; Valencian' },
      'ce': { 'key': 'che', 'text': 'Chechen' },
      'ch': { 'key': 'cha', 'text': 'Chamorro' },
      'co': { 'key': 'cos', 'text': 'Corsican' },
      'cr': { 'key': 'cre', 'text': 'Cree' },
      'cs': { 'key': 'cze', 'text': 'Czech' },
      'cu': { 'key': 'chu', 'text': 'Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic' },
      'cv': { 'key': 'chv', 'text': 'Chuvash' },
      'cy': { 'key': 'wel', 'text': 'Welsh' },
      'da': { 'key': 'dan', 'text': 'Danish' },
      'de': { 'key': 'ger', 'text': 'German' },
      'dv': { 'key': 'div', 'text': 'Divehi; Dhivehi; Maldivian' },
      'dz': { 'key': 'dzo', 'text': 'Dzongkha' },
      'ee': { 'key': 'ewe', 'text': 'Ewe' },
      'el': { 'key': 'gre', 'text': 'Greek, Modern (1453-)' },
      'en': { 'key': 'eng', 'text': 'English' },
      'eo': { 'key': 'epo', 'text': 'Esperanto' },
      'es': { 'key': 'spa', 'text': 'Spanish; Castilian' },
      'et': { 'key': 'est', 'text': 'Estonian' },
      'eu': { 'key': 'baq', 'text': 'Basque' },
      'fa': { 'key': 'per', 'text': 'Persian' },
      'ff': { 'key': 'ful', 'text': 'Fulah' },
      'fi': { 'key': 'fin', 'text': 'Finnish' },
      'fj': { 'key': 'fij', 'text': 'Fijian' },
      'fo': { 'key': 'fao', 'text': 'Faroese' },
      'fr': { 'key': 'fre', 'text': 'French' },
      'fy': { 'key': 'fry', 'text': 'Western Frisian' },
      'ga': { 'key': 'gle', 'text': 'Irish' },
      'gd': { 'key': 'gla', 'text': 'Gaelic; Scottish Gaelic' },
      'gl': { 'key': 'glg', 'text': 'Galician' },
      'gn': { 'key': 'grn', 'text': 'Guarani' },
      'gu': { 'key': 'guj', 'text': 'Gujarati' },
      'gv': { 'key': 'glv', 'text': 'Manx' },
      'ha': { 'key': 'hau', 'text': 'Hausa' },
      'hi': { 'key': 'hin', 'text': 'Hindi' },
      'ho': { 'key': 'hmo', 'text': 'Hiri Motu' },
      'hr': { 'key': 'hrv', 'text': 'Croatian' },
      'ht': { 'key': 'hat', 'text': 'Haitian; Haitian Creole' },
      'hu': { 'key': 'hun', 'text': 'Hungarian' },
      'hy': { 'key': 'arm', 'text': 'Armenian' },
      'hz': { 'key': 'her', 'text': 'Herero' },
      'ia': { 'key': 'ina', 'text': 'Interlingua (International Auxiliary Language Association)' },
      'id': { 'key': 'ind', 'text': 'Indonesian' },
      'ie': { 'key': 'ile', 'text': 'Interlingue; Occidental' },
      'ig': { 'key': 'ibo', 'text': 'Igbo' },
      'ii': { 'key': 'iii', 'text': 'Sichuan Yi; Nuosu' },
      'ik': { 'key': 'ipk', 'text': 'Inupiaq' },
      'io': { 'key': 'ido', 'text': 'Ido' },
      'is': { 'key': 'ice', 'text': 'Icelandic' },
      'it': { 'key': 'ita', 'text': 'Italian' },
      'iu': { 'key': 'iku', 'text': 'Inuktitut' },
      'iw': { 'key': 'heb', 'text': 'Hebrew' },
      'ja': { 'key': 'jpn', 'text': 'Japanese' },
      'jv': { 'key': 'jav', 'text': 'Javanese' },
      'ka': { 'key': 'geo', 'text': 'Georgian' },
      'kg': { 'key': 'kon', 'text': 'Kongo' },
      'ki': { 'key': 'kik', 'text': 'Kikuyu; Gikuyu' },
      'kj': { 'key': 'kua', 'text': 'Kuanyama; Kwanyama' },
      'kk': { 'key': 'kaz', 'text': 'Kazakh' },
      'kl': { 'key': 'kal', 'text': 'kalaallisut; Greenlandic' },
      'km': { 'key': 'khm', 'text': 'Central khmer' },
      'kn': { 'key': 'kan', 'text': 'Kannada' },
      'ko': { 'key': 'kor', 'text': 'Korean' },
      'kr': { 'key': 'kau', 'text': 'Kanuri' },
      'ks': { 'key': 'kas', 'text': 'Kashmiri' },
      'ku': { 'key': 'kur', 'text': 'Kurdish' },
      'kv': { 'key': 'kom', 'text': 'Komi' },
      'kw': { 'key': 'cor', 'text': 'Cornish' },
      'ky': { 'key': 'kir', 'text': 'kirghiz; Kyrgyz' },
      'la': { 'key': 'lat', 'text': 'Latin' },
      'lb': { 'key': 'ltz', 'text': 'Luxembourgish; Letzeburgesch' },
      'lg': { 'key': 'lug', 'text': 'Ganda' },
      'li': { 'key': 'lim', 'text': 'Limburgan; Limburger; Limburgish' },
      'ln': { 'key': 'lin', 'text': 'Lingala' },
      'lo': { 'key': 'lao', 'text': 'Lao' },
      'lt': { 'key': 'lit', 'text': 'Lithuanian' },
      'lu': { 'key': 'lub', 'text': 'Luba-katanga' },
      'lv': { 'key': 'lav', 'text': 'Latvian' },
      'mg': { 'key': 'mlg', 'text': 'Malagasy' },
      'mh': { 'key': 'mah', 'text': 'Marshallese' },
      'mi': { 'key': 'mao', 'text': 'Maori' },
      'mk': { 'key': 'mac', 'text': 'Macedonian' },
      'ml': { 'key': 'mal', 'text': 'Malayalam' },
      'mn': { 'key': 'mon', 'text': 'Mongolian' },
      'mr': { 'key': 'mar', 'text': 'Marathi' },
      'ms': { 'key': 'may', 'text': 'Malay' },
      'mt': { 'key': 'mlt', 'text': 'Maltese' },
      'my': { 'key': 'bur', 'text': 'Burmese' },
      'na': { 'key': 'nau', 'text': 'Nauru' },
      'nb': { 'key': 'nob', 'text': 'Bokmål, Norwegian; Norwegian Bokmål' },
      'nd': { 'key': 'nde', 'text': 'Ndebele, North; North Ndebele' },
      'ne': { 'key': 'nep', 'text': 'Nepali' },
      'ng': { 'key': 'ndo', 'text': 'Ndonga' },
      'nl': { 'key': 'dut', 'text': 'Dutch; Flemish' },
      'nn': { 'key': 'nno', 'text': 'Norwegian Nynorsk; Nynorsk, Norwegian' },
      'no': { 'key': 'nor', 'text': 'Norwegian' },
      'nr': { 'key': 'nbl', 'text': 'Ndebele, South; South Ndebele' },
      'nv': { 'key': 'nav', 'text': 'Navajo; Navaho' },
      'ny': { 'key': 'nya', 'text': 'Chichewa; Chewa; Nyanja' },
      'oc': { 'key': 'oci', 'text': 'Occitan (post 1500); Provençal' },
      'oj': { 'key': 'oji', 'text': 'Ojibwa' },
      'om': { 'key': 'orm', 'text': 'Oromo' },
      'or': { 'key': 'ori', 'text': 'Oriya' },
      'os': { 'key': 'oss', 'text': 'Ossetian; Ossetic' },
      'pa': { 'key': 'pan', 'text': 'Panjabi; Punjabi' },
      'pi': { 'key': 'pli', 'text': 'Pali' },
      'pl': { 'key': 'pol', 'text': 'Polish' },
      'ps': { 'key': 'pus', 'text': 'Pushto; Pashto' },
      'pt': { 'key': 'por', 'text': 'Portuguese' },
      'qu': { 'key': 'que', 'text': 'Quechua' },
      'rm': { 'key': 'roh', 'text': 'Romansh' },
      'rn': { 'key': 'run', 'text': 'Rundi' },
      'ro': { 'key': 'rum', 'text': 'Romanian; Moldavian; Moldovan' },
      'ru': { 'key': 'rus', 'text': 'Russian' },
      'rw': { 'key': 'kin', 'text': 'kinyarwanda' },
      'sa': { 'key': 'san', 'text': 'Sanskrit' },
      'sc': { 'key': 'srd', 'text': 'Sardinian' },
      'sd': { 'key': 'snd', 'text': 'Sindhi' },
      'se': { 'key': 'sme', 'text': 'Northern Sami' },
      'sg': { 'key': 'sag', 'text': 'Sango' },
      'si': { 'key': 'sin', 'text': 'Sinhala; Sinhalese' },
      'sk': { 'key': 'slo', 'text': 'Slovak' },
      'sl': { 'key': 'slv', 'text': 'Slovenian' },
      'sm': { 'key': 'smo', 'text': 'Samoan' },
      'sn': { 'key': 'sna', 'text': 'Shona' },
      'so': { 'key': 'som', 'text': 'Somali' },
      'sq': { 'key': 'alb', 'text': 'Albanian' },
      'sr': { 'key': 'srp', 'text': 'Serbian' },
      'ss': { 'key': 'ssw', 'text': 'Swati' },
      'st': { 'key': 'sot', 'text': 'Sotho, Southern' },
      'su': { 'key': 'sun', 'text': 'Sundanese' },
      'sv': { 'key': 'swe', 'text': 'Swedish' },
      'sw': { 'key': 'swa', 'text': 'Swahili' },
      'ta': { 'key': 'tam', 'text': 'Tamil' },
      'te': { 'key': 'tel', 'text': 'Telugu' },
      'tg': { 'key': 'tgk', 'text': 'Tajik' },
      'th': { 'key': 'tha', 'text': 'Thai' },
      'ti': { 'key': 'tir', 'text': 'Tigrinya' },
      'tk': { 'key': 'tuk', 'text': 'Turkmen' },
      'tl': { 'key': 'tgl', 'text': 'Tagalog' },
      'tn': { 'key': 'tsn', 'text': 'Tswana' },
      'to': { 'key': 'ton', 'text': 'Tonga (Tonga Islands)' },
      'tr': { 'key': 'tur', 'text': 'Turkish' },
      'ts': { 'key': 'tso', 'text': 'Tsonga' },
      'tt': { 'key': 'tat', 'text': 'Tatar' },
      'tw': { 'key': 'twi', 'text': 'Twi' },
      'ty': { 'key': 'tah', 'text': 'Tahitian' },
      'ug': { 'key': 'uig', 'text': 'Uighur; Uyghur' },
      'uk': { 'key': 'ukr', 'text': 'Ukrainian' },
      'ur': { 'key': 'urd', 'text': 'Urdu' },
      'uz': { 'key': 'uzb', 'text': 'Uzbek' },
      've': { 'key': 'ven', 'text': 'Venda' },
      'vi': { 'key': 'vie', 'text': 'Vietnamese' },
      'vo': { 'key': 'vol', 'text': 'Volapük' },
      'wa': { 'key': 'wln', 'text': 'Walloon' },
      'wo': { 'key': 'wol', 'text': 'Wolof' },
      'xh': { 'key': 'xho', 'text': 'Xhosa' },
      'yi': { 'key': 'yid', 'text': 'Yiddish' },
      'yo': { 'key': 'yor', 'text': 'Yoruba' },
      'za': { 'key': 'zha', 'text': 'Zhuang; Chuang' },
      'zh': { 'key': 'chi', 'text': 'Chinese' },
      'zu': { 'key': 'zul', 'text': 'Zulu' },
    }
