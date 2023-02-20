from pathlib import Path
import os, re


""" FileWalker:
Contains methods to navigate
files and use them to process
required data
"""
class FileWalker:

  """Get unique file path:
  Checks if path exists, if so
  += " ({count})" to the path
  until it doesn't.
  """
  def get_unique_file_path(self, path):
    path_without_extension = self.get_path_without_extension(path)
    path_extension = self.get_path_extension(path)
    count = 1

    while os.path.exists(path):
      path = f"{path_without_extension} ({count}).{path_extension}"
      count += 1

    return self.get_path_without_extension(path)


  """ Get path without extension:
  Returns entire file path excluding
  the file extension.
  """
  def get_path_without_extension(self, path):
    return os.path.splitext(path)[0]


  """ Determine extension
  Function to determine the
  extension of a file path.
  """
  def get_path_extension(self, path):
    return os.path.splitext(path)[1].replace('.', '')


  """ Determines file name
  Takes string of file name
  and returns with extension
  removed from the string
  """
  def remove_extension(self, file_name):
    return re.sub(r'\.\w{2,4}$', '', os.path.basename(file_name))


  """ Determines file name
  Takes string of file name
  and returns with suffix
  removed from the string
  """
  def remove_suffix_data(self, file_name):
    """
    Removes potential attributes one by one
    from the end of the string if found. ex:
    "video.eng.forced.01.srt" ⟶ "video"
    """
    output_name = self.remove_extension(file_name) #ext
    output_name = re.sub(r'\.[0-9]{2,3}', '', output_name) #count
    output_name = re.sub(r'\.(default|forced|sdh|hearing-impaired)', '', output_name) #track flags
    output_name = re.sub(r'\.[a-zA-Z]{2}', '', output_name) #language

    return output_name


  """ Get suffix details
  Returns dictionary of the
  suffix data included in
  the file name
  """
  def get_presets_from_suffix(self, file_name):
    # Determine suffix string
    video_name = self.remove_suffix_data(file_name)
    suffix = file_name.replace(video_name, "")
    suffix = self.remove_extension(suffix)

    # Initialize suffix data
    suffix_data = {
      "is_default_track": bool(re.search(r'\.default($|\.)', suffix)),
      "is_forced_track": bool(re.search(r'\.forced($|\.)', suffix)),
      "is_hearing_impaired": bool(re.search(r'\.(sdh|hearing-impaired)($|\.)', suffix)),
    }

    # Update language code & count
    language_code = re.search(r'(?<=\.)[a-z]{2}($|\.)', suffix)
    language_count = re.search(r'(?<=\.)[0-9]{2,3}$', suffix)
    suffix_data["language_code"] = language_code.group(0) if language_code else None
    suffix_data["language_count"] = language_count.group(0) if language_count else None

    return suffix_data


  """ Get file paths
  Gets file paths of video
  and subtitle files to use
  in batch process.
  """
  def get_file_paths(
    self,
    current_directory,
    current_subdirectory,
    current_file,
    video_files,
    subtitle_files
  ):
    # Identify path and type of file
    file_path = current_directory / current_subdirectory / current_file
    file_type = current_file.split(".")[-1].lower()

    # Usable video file types
    video_file_types = [
      "avi",
      "m4v",
      "mkv",
      "mov",
      "mp4",
      "mpg",
      "mpeg",
      "ogg",
      "ogm",
      "webm",
      "wmv",
    ]

    # Usable subtitle file types
    subtitle_file_types = [
      "ass",
      "idx",
      "pgs",
      "smi",
      "srt",
      "ssa",
      "sub",
      "sup",
      "vtt"
    ]

    # Determine if file has a video-related extention
    if file_type in video_file_types:
      video_files.append(file_path)

    # Determine if file has a subtitle-related extension
    elif file_type in subtitle_file_types:
      subtitle_files.append(file_path)

    return [video_files, subtitle_files]


  """ Check file warnings:
  Checks if any missing file
  or missing subtitle warning
  messages should show.
  """
  def check_file_warnings(
    self,
    is_only_video_files,
    skipped_directories,
    skipped_subtitles
  ):

    # Initialize warning
    warning = None

    # Determines whether to use singular or plural tense
    def get_pluralization(singular, plural, variable):
      return singular if variable == 1 else plural

    # If there are skipped directories
    if skipped_directories:

      # Skipped directories warning
      was_or_were = get_pluralization("was", "were", skipped_directories)
      directory_or_directories = get_pluralization(
        "directory",
        "directories",
        skipped_directories
      )

      # If option to remove subtitles is selected
      if is_only_video_files:
        warning = (
          f"{skipped_directories} {directory_or_directories}"
          f" had no video files and {was_or_were} not processed."
        )
      else:
        warning = (
          f"{skipped_directories} {directory_or_directories} had no"
          f" video and/or subtitle files and {was_or_were} not processed."
        )

    # If there are skipped subtitles
    if skipped_subtitles and not is_only_video_files:
      was_or_were = get_pluralization("was", "were", skipped_subtitles)
      file_or_files = get_pluralization("file", "files", skipped_subtitles)

      if skipped_directories:
        warning = (
          f"{skipped_directories} {directory_or_directories} and "
          f"{skipped_subtitles} subtitle {file_or_files} were not processed."
        )
      else:
        warning = (
          f"{skipped_subtitles} subtitle {file_or_files} "
          f"{was_or_were} not processed."
        )

    return warning


  """Get files:
  returns tuples of matches
  including video and subtitle
  absolute paths
  """
  def get_files(
    self,
    directory,
    is_only_video_files
  ):

    # Directories (and only directories) to look for videos in
    video_directories = list(
        filter(os.path.isdir, os.listdir(Path().absolute() / directory))
    )

    # Include current directory
    video_directories.insert(0, "")

    # Initializing variables
    included_files = [] # (video, subtitle) tuple list
    skipped_directories = 0
    skipped_subtitles = 0
    warning = None

    # Create comparable root path
    root_directory_path = os.path.normpath(directory)

    # Iterate through each video folder
    for subdirectory in video_directories:
      current_directory = Path().absolute() / directory / subdirectory

      # Iterate though subdirectories
      for current_subdirectory, _, files in os.walk(current_directory):

        # Create comparable paths
        current_directory_path = os.path.normpath(current_subdirectory)
        is_not_root_directory = current_directory_path != root_directory_path

        # Initialize video & subtitle variables
        video_files = []
        subtitle_files = []

        for current_file in files:
          [video_files, subtitle_files] = self.get_file_paths(
            current_directory,
            current_subdirectory,
            current_file,
            video_files,
            subtitle_files
          )

        # If only one video, set it as "the" video file
        video_file = None
        if len(video_files) == 1:
          video_file = video_files[0]

        # If no subtitle (while merging) and/or video files
        is_invalid_subtitles = (
          len(subtitle_files) == 0 and not is_only_video_files and is_not_root_directory
        )
        is_invalid_videos = len(video_files) == 0 and is_not_root_directory

        if is_invalid_subtitles or is_invalid_videos:
          skipped_directories += 1

        # If more than one video, match with subtitles by names
        elif len(video_files) > 1 and not is_only_video_files:
          """
          Sorting these by length (reverse order)
          to solve edge cases such as:
          episode.avi | episode part 2.avi
          episode.srt | episode part 2.srt
          """
          # convert to strings
          video_files = [str(video) for video in video_files]

          # sort strings
          video_files = sorted(video_files, key=len, reverse=True)

          # convert back to paths
          video_files = [Path(video) for video in video_files]

          # Keep track of processed videos to see if dir is used
          videos_processed = 0

          # Iterate through videos and look for matching subtitles
          for video in video_files:

            # Exact file name of video without extension
            video_name = self.remove_extension(video)

            # List of subtitles that include the video name in their name
            matching_subtitles = [
                subtitle_file
                for subtitle_file in subtitle_files
                if video_name in self.remove_suffix_data(subtitle_file)
            ]

            # If there are matching subtitle files
            if len(matching_subtitles):

              # Remove matching subtitles from subtitle_files list
              subtitle_files = [
                  subtitle_file
                  for subtitle_file in subtitle_files
                  if subtitle_file not in matching_subtitles
              ]

              # Add video and matching subtitle file to list
              included_files.append((video, matching_subtitles))

              # Update processed video count
              videos_processed += 1

          # If no videos were processed, update skip directory count
          if videos_processed == 0:
            skipped_directories += 1

          # If there are still subtitle files, update skipped_subtitles count
          elif len(subtitle_files):
            skipped_subtitles += len(subtitle_files)

        # If user is removing/extracting subtitles, just get (all) videos
        elif len(video_files) and is_only_video_files:
          for video in video_files:
            included_files.append((video, None))

        # If only one video, add video with all subtitles
        elif video_file is not None and len(subtitle_files) >= 1:
          included_files.append((video_file, subtitle_files))

        # Otherwise skip directory and provide warning about it
        elif is_only_video_files and is_not_root_directory:
          skipped_directories += 1

        # Check if any directories were skipped
        warning = self.check_file_warnings(
          is_only_video_files,
          skipped_directories,
          skipped_subtitles
        )

    # Prepare valid files and warning message (or None if none)
    file_data = {"files": included_files, "warning": warning}

    # Return tuples of files
    return file_data
