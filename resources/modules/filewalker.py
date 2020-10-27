from pathlib import Path
import os


''' FileWalker:
Contains methods to navigate
files and use them to process
required data
'''
class FileWalker:

  ''' Get files:
  returns tuples of matches
  including video and subtitle
  absolute paths
  '''
  def get_files(self, directory, is_remove_subtitless):

    # Directories to search
    video_directories = os.listdir(directory)

    # Storage for (video, subtitle) tuples
    included_files = []

    # Keep track of skipped_count directories
    skipped_count = 0

    # Initialize warning
    warning = None

    # Iterate through each video folder
    for subdirectory in video_directories:
      current_directory = Path().absolute()/directory/subdirectory

      print('test')
      # Iterate though subdirectories
      for current_subdirectory, _, files in os.walk(current_directory):

        # Initialize video & subtitle variables
        video_files = []
        subtitle_files = []
        video_file = None

        for file in files:

          # Identify path and type of file
          file_path = current_directory/current_subdirectory/file
          file_type = file.split('.')[-1].lower()

          # Identify acceptable video & subtitle file extensions
          video_file_types = ['avi', 'm4v', 'mkv', 'mov', 'mp4', 'mpg', 'mpeg', 'ogg', 'ogm', 'webm', 'wmv']
          subtitle_file_types = ['ass', 'pgs', 'srt', 'ssa', 'sup']

          # Determine if file has a video-related extention
          if file_type in video_file_types:
            video_files.append(file_path)

          # Determine if file has a subtitle-related extension
          elif file_type in subtitle_file_types:
            subtitle_files.append(file_path)



        # Make sure there's only one video file
        if len(video_files) == 1:
          video_file = video_files[0]

        # Plural and non-plural definitions for warning messages
        was_if_plural = 'was' if skipped_count is 0 else 'were'
        directory_if_plural = 'directory' if skipped_count is 0 else 'directories'

        # If user is removing subtitles, only get videos
        if video_file is not None and is_remove_subtitless:
          included_files.append((video_file, None))

        # If there are both video and a subtitle files, add them to list
        elif video_file is not None and len(subtitle_files) >= 1:
          included_files.append((video_file, subtitle_files))

        # Otherwise skip directory and provide warning about it
        elif is_remove_subtitless:
          skipped_count += 1
          warning = f'{skipped_count} sub {directory_if_plural} had more or less than one video file and {was_if_plural} not processed.'

        # If merging subtitles
        else:
          skipped_count += 1
          warning = f'{skipped_count} sub {directory_if_plural} had more or less than one video and/or subtitle file and {was_if_plural} not processed.'

    # Prepare valid files and warning message (or None if none)
    file_data = {
      "files": included_files,
      "warning": warning
    }

    # Return tuples of files
    return file_data
