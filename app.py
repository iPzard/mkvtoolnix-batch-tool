import sys, os
from pathlib import PurePath
from resources.modules import filewalker
from resources.modules import mkvtoolnix
from flask import Flask, jsonify, request


"""
--------------------------- INSTANTIATION --------------------------
"""

FileWalker = filewalker.FileWalker()
MKVToolNix = mkvtoolnix.MKVToolNix()
app = Flask(__name__)


"""
--------------------------- REST CALLS -----------------------------
"""

""" Request merge batch:
Merges batch of video/subtitles
files using user-provided options.
"""
@app.route('/process_batch', methods=['POST'])
def process_batch():

  # REST call request body
  input_directory = request.json['input']
  output_directory = request.json['output']
  settings = request.json['settings']

  # User settings from request body
  is_default_track = settings['isDefaultTrack']
  is_remove_ads = settings['isRemoveAds']
  is_remove_existing_subtitles = settings['isRemoveExistingSubtitles']
  is_remove_old = settings['isRemoveOld']
  is_remove_subtitles = settings['isRemoveSubtitles']
  is_same_as_source = settings['isSameAsSource']
  language = settings['language']

  # Get batch of files to process
  batch_data = FileWalker.get_files(input_directory, is_remove_subtitles)
  batch = batch_data['files']
  warning = batch_data['warning']

  # Iterate through array of tuples and merge
  for video_input_path, subtitle_input_path in batch:
    video_name = PurePath(video_input_path).stem
    video_output_path = original_output_path = os.path.join(output_directory, f'{video_name}')
    video_output_extension = '.mkv'

    # If output is "same as source"
    if is_same_as_source:

      # Update paths to match current video source directory
      video_output_path = original_output_path = os.path.splitext(video_input_path)[0]

    # Prevent duplicate file names by adding (#) to name
    count = 1
    while os.path.exists(video_output_path + video_output_extension):
      video_output_path = f'{original_output_path} ({count})'
      count += 1

    # Once final video path is determined, add its extension
    video_output_path += video_output_extension

    # If "remove" subtitles
    if is_remove_subtitles:
      MKVToolNix.remove_subtitle(video_input_path, video_output_path)

    # If "merge" subtitles
    else:
      subtitle_language = language['key']
      subtitle_track_name = language['text']

      # Process batch
      MKVToolNix.add_subtitle(
        is_default_track,
        is_remove_ads,
        is_remove_existing_subtitles,
        subtitle_input_path,
        subtitle_language,
        subtitle_track_name,
        video_input_path,
        video_output_path,
      )

    # If remove old, delete original files and directory (if empty after)
    if is_remove_old:
      video_directory = PurePath(video_input_path).parent
      os.remove(subtitle_input_path)
      os.remove(video_input_path)

      # Delete video directory if it's now empty
      if not os.listdir(video_directory):
        os.rmdir(video_directory)

  status = 'Batch complete'
  error = 'No valid subdirectories were found in the selected directory.' if len(batch) == 0 else None

  if error is not None:
    status = 'Error'

  elif warning is not None:
    status = 'Warning'

  return jsonify({
    "status": status,
    "warning": warning,
    "error": error
  })


"""
------------------------- FLASK SETTINGS ---------------------------
"""

""" Shutdown Flask:
Generic function to shutdown
Flask when Electron app closes.
"""
@app.route('/quit')
def quit():
  shutdown = request.environ.get('werkzeug.server.shutdown')
  shutdown()

  return


""" Get Flask port:
Accepts port as system argument
e.g., `start app.exe 3000`
"""
port = sys.argv[1]


"""
Start Flask microservice server:
Uses a random port between 3000
and 3999.
"""
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=port)