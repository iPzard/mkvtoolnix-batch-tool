from pathlib import Path
import os
import re


""" FileWalker:
Contains methods to navigate
files and use them to process
required data
"""
class FileWalker:

  """Get files:
  returns tuples of matches
  including video and subtitle
  absolute paths
  """
  def get_files(self, directory, is_remove_subtitles):

    # Directories (and only directories) to look for videos in
    video_directories = list(
        filter(os.path.isdir, os.listdir(Path().absolute() / directory))
    )

    # Include current directory
    video_directories.insert(0, "")  # todo .append('') instead?

    # Storage for (video, subtitle) tuples
    included_files = []

    # Keep track of skipped directories & subtitle files
    skipped_directories = 0
    skipped_subtitles = 0

    # Initialize warning
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
        video_file = None

        for file in files:

          # Identify path and type of file
          file_path = current_directory / current_subdirectory / file
          file_type = file.split(".")[-1].lower()

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
            "pgs", 
            "smi", 
            "srt", 
            "ssa", 
            "sup"
          ]

          # Determine if file has a video-related extention
          if file_type in video_file_types:
            video_files.append(file_path)

          # Determine if file has a subtitle-related extension
          elif file_type in subtitle_file_types:
            subtitle_files.append(file_path)

        # If only one video, set it as "the" video file
        if len(video_files) == 1:
          video_file = video_files[0]

        # If no subtitle (while merging) and/or video files
        invalid_subtitles = (
            len(subtitle_files) == 0 and not is_remove_subtitles and is_not_root_directory
        )
        invalid_videos = len(video_files) == 0 and is_not_root_directory
        if invalid_subtitles or invalid_videos:
          skipped_directories += 1

        # If more than one video, match with subtitles by names
        elif len(video_files) > 1 and not is_remove_subtitles:

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

          # Helper method to retreive file name without extension
          def remove_extension(file_name):
            return re.sub(r'\.\w{2,4}$', '', os.path.basename(file_name))

          # Iterate through videos and look for matching subtitles
          for video in video_files:

            # Exact file name of video without extension
            video_name = remove_extension(video)

            # List of subtitles that include the video name in their name
            matching_subtitles = [
                subtitle_file
                for subtitle_file in subtitle_files
                if video_name in remove_extension(subtitle_file)
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

        # If user is removing subtitles, just get (all) videos
        elif len(video_files) and is_remove_subtitles:
          for video in video_files:
            included_files.append((video, None))

        # If only one video, add video with all subtitles
        elif video_file is not None and len(subtitle_files) >= 1:
          included_files.append((video_file, subtitle_files))

        # Otherwise skip directory and provide warning about it
        elif is_remove_subtitles and is_not_root_directory:
          skipped_directories += 1

        # Check if any directories were skipped
        if skipped_directories:
          directory_was_if_plural = "was" if skipped_directories == 1 else "were"
          directory_if_plural = (
              "directory" if skipped_directories == 1 else "directories"
          )

          if is_remove_subtitles:
            warning = f"{skipped_directories} {directory_if_plural} had no video files and {directory_was_if_plural} not processed."
          else:
            warning = f"{skipped_directories} {directory_if_plural} had no videos and/or subtitle files and {directory_was_if_plural} not processed."

        # if there are skipped subtitles, provide a warning
        if skipped_subtitles and not is_remove_subtitles:
          subtitle_was_if_plural = "was" if skipped_subtitles == 1 else "were"
          subtitle_if_plural = "file" if skipped_subtitles == 1 else "files"

          if skipped_directories:
            warning = f"{skipped_directories} {directory_if_plural} and {skipped_subtitles} subtitle {subtitle_if_plural} were not processed."
          else:
            warning = f"{skipped_subtitles} subtitle {subtitle_if_plural} {subtitle_was_if_plural} not processed."

    # Prepare valid files and warning message (or None if none)
    file_data = {"files": included_files, "warning": warning}

    # Return tuples of files
    return file_data
