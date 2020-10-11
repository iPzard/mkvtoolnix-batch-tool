import os
from resources.modules import filewalker
from resources.modules import mkvtoolnix

"""
Instantiating classes.
"""
FileWalker = filewalker.FileWalker()
MKVToolNix = mkvtoolnix.MKVToolNix()


import sys
from flask import Flask, request

app = Flask(__name__)

"""
--------------------------- REST CALLS -----------------------------
"""


""" Request merge batch:
Merges batch of video/subtitles
files using user-provided options.
"""
@app.route('/merge_batch', methods=['POST'])
def merge_batch():
  request_data = request.data.decode()
  batch = FileWalker.get_files(request_data)

  # Iterate through array of tuples and merge
  for video_path, subtitle_path in batch:
    output_path = f"{os.path.splitext(video_path)[0]}.mkv"
    MKVToolNix.add_subtitle(video_path, output_path, subtitle_path)

  return "done"


"""
--------------------------------------------------------------------
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
Start flask microservice server:
Uses a random port between 3000
and 3999.
"""
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=port)



#abosolute_directory_path = Path().absolute() # will likely be removed
#FileWalker.get_files(f"{abosolute_directory_path/'coverage'}")
#MKVToolNix.add_subtitle("../../coverage/Prometheus.mp4", "../../coverage/Prometheus.mkv", "../../coverage/Prometheus.srt")
#MKVToolNix.remove_subtitle("../../coverage/Prometheus.mkv", "../../coverage/Prometheus1.mkv")