# MKVToolNix Batch Tool
> Batch video and subtitle processing tool to help you add (merge) or remove subtitles from your video library. Allows you to process all of a folder's subdirectories in a single batch.
<br><br>

![mkvtoolnix-batch-tool](https://user-images.githubusercontent.com/8584126/96355280-c0c0d800-1094-11eb-9694-b404d82ccc80.gif)

## 💾 Downloads
MKVToolNix Batch Tool is powered by MKVToolNix, and is therefore limited to Windows.

**Windows:**
* [win32-x64](https://drive.google.com/file/d/1SrbuFV7aqoBbFk3EmdRn6Vqac5q6T0Hn/view?usp=sharing)
<br>

## 🔨 Merging subtitles
When merging subtitles, each subdirectory ***must*** contain one video file and one subtitle file, otherwise the directory will be skipped. Other non-video, non-subtitle files, may be included and will be ignored.<br><br>

<pre>
  <code>
    📂Movies
    ┣ 📂Resident Evil (2002) 👈 <b>only one video, and one subtitle file per sub directory</b>
    ┃ ┣ 📺Resident Evil (2002) [1080p].mp4
    ┃ ┗ 📜Resident Evil (2002) [1080p].srt
    ┣ 📂Resident Evil Afterlife (2010)
    ┃ ┣ 📺Resident Evil Afterlife (2010) [1080p].avi
    ┃ ┣ 📜Resident Evil Afterlife (2010) [1080p].ass
    ┃ ┗ 🎨Movie poster.png 👈 <b>extra non-video, non-subtitle files may exist</b>
    ┣ 📂Resident Evil Apocalypse (2004)
    ┃ ┣ 📺Resident Evil Apocalypse (2004) [1080p].mkv
    ┃ ┗ 📜Resident Evil Apocalypse (2004) [1080p].pgs
    ┣ 📂Resident Evil Extinction (2007)
    ┃ ┣ 📺Resident Evil Apocalypse (2004) [1080p].wmv
    ┃ ┗ 📜Resident Evil Apocalypse (2004) [1080p].ssa
    ┣ 📂Resident Evil Retribution (2012)
    ┃ ┣ 📺Resident Evil Retribution (2012) [1080p].ogg
    ┃ ┗ 📜Resident Evil Retribution (2012) [1080p].sup
    ┣ 📂Resident Evil The Final Chapter (2016)
    ┃ ┣ 📺Resident Evil The Final Chapter (2016) [1080p].ogm
    ┃ ┗ 📜Resident Evil The Final Chapter (2016) [1080p].srt
  </code>
</pre>
<br>

## 🪓 Removing subtitles
When removing subtitles, each subdirectory ***must*** contain one video file, otherwise the directory will be skipped. Other non-video, may be included and will be ignored.<br><br>

<pre>
  <code>
    📂Movies
    ┣ 📂Resident Evil (2002) 👈 <b>only one video file per sub directory</b>
    ┃ ┗ 📺Resident Evil (2002) [1080p].mp4
    ┣ 📂Resident Evil Afterlife (2010)
    ┃ ┣ 📺Resident Evil Afterlife (2010) [1080p].avi
    ┃ ┗ 🎨Movie poster.png 👈 <b>extra non-video files may exist</b>
    ┣ 📂Resident Evil Apocalypse (2004)
    ┃ ┣ 📺Resident Evil Apocalypse (2004) [1080p].mkv
    ┃ ┗ 📜Resident Evil Apocalypse (2004) [1080p].srt 👈 <b>extra non-video files may exist</b>
    ┣ 📂Resident Evil Extinction (2007)
    ┃ ┗ 📺Resident Evil Apocalypse (2004) [1080p].wmv
    ┣ 📂Resident Evil Retribution (2012)
    ┃ ┗ 📺Resident Evil Retribution (2012) [1080p].ogg
    ┣ 📂Resident Evil The Final Chapter (2016)
    ┃ ┗ 📺Resident Evil The Final Chapter (2016) [1080p].ogm
  </code>
</pre>
<br>

## ⚙️ Settings
![mkvtoolnix-batch-tool-settings](https://user-images.githubusercontent.com/8584126/96355382-f74b2280-1095-11eb-9436-e68df7eb466f.png)

**Remove existing subtitles from video before merging new ones**
* Excludes any existing, non hard-coded subtitles that are already on video.
<br>

**Remove old video and subtitle files from source directory when finished**
* Deletes old video and subtitle files from each sub directory after processing them.
<br>

**Mark subtitles as "default track" so they play automatically**
* Automatically enables the subtitle track when starting your video.
<br>

**Remove known advertisements from subtitles before merging**
* Removes spam such as "advertise here" and alike from subtitle files before merging.
<br><br>

## 🗃️ File types
The following file types are supported.

**Video**:
* *AVI*, *M4V*, *MKV*, *MOV*, *MP4*, *MPG*, *MPEG*, *OGG*, *OGM*, *WEBM*, *WMV*

**Subtitle**:
* *ASS*, *PGS*, *SRT*, *SSA*, *SUP*
<br>

## 🙏 Attribution
* MKV batch processing is powered by [MKVToolNix](https://gitlab.com/mbunkus/mkvtoolnix)
* SVG icons used are from [Font Awesome](https://fontawesome.com)
<br>

## 🏷️ License
GPLv2 © [iPzard](https://github.com/iPzard/mkvtoolnix-batch-tool/blob/master/LICENSE)