# MKVToolNix Batch Tool
> Batch video and subtitle processing program to help you add (merge) or remove subtitles from your video library. Allows you to process a directory, and/or all of its subdirectories, in a single batch.
<br><br>

<p align="center">
  <img src="https://user-images.githubusercontent.com/8584126/97789453-d991b900-1b7d-11eb-8ff3-be2a67cb159b.gif" />
</p>
<br>

## 💾 Downloads
MKVToolNix Batch Tool works on Windows 32-bit (x86) and Windows 64-bit (x64) operating systems, see the project's [releases&nbsp;page](https://github.com/iPzard/mkvtoolnix-batch-tool/releases) for download links.
<br><br>

## 🔨 Merging subtitles
MKVToolNix Batch Tool is equipped to understanding your intentions; you may have a folder of movies, each in their own subdirectory containing the movie and its subtitles file(s), or you may have the season(s) of a TV show, with a directory/directories containing several episodes and their matching subtitles files.<br><br>

When there's only one video file in a directory, all subtitle files in that same directory will be merged into the video, regardless of the subtitle file name. However, when there are multiple videos in a directory, they will only be merged with subtitle files that contain their full name within (or as) their name.<br><br>

Directories containing no video files, no subtitle files, or multiple video files with subtitle files that don't have matching names, will be skipped. Non-video, non-subtitle files in directories <i>(e.g., movie poster jpg file)</i> may be included and will be ignored.<br><br>

 The language of each subtitle file is determined automatically by parsing through text in the files, the language that matches your <b>Default language track</b> from the settings page (defaults to English) will be set as the default subtitle track on your merged videos.<br><br>

**Example (e.g., movies):**
<pre>
  <code>
    📂Movies
    ┣ 📂Resident Evil (2002) 👈 <b>only one video, and at least one subtitle file per sub directory</b>
    ┃ ┣ 📺Resident Evil (2002) [1080p].mp4
    ┃ ┣ 📜Resident Evil (2002) [1080p] English.srt
    ┃ ┣ 📜Resident Evil (2002) [1080p] Spanish.srt
    ┃ ┗ 📜Subtitles French.srt 👈 <b>when only 1 video, all subtitles regardless of name are merged</b>
    ┣ 📂Resident Evil Afterlife (2010)
    ┃ ┣ 📺Resident Evil Afterlife (2010) [1080p].avi
    ┃ ┗ 📜Resident Evil Afterlife (2010) [1080p].pgs 👈 <b>language is (always) determined automatically</b>
    ┣ 📂Resident Evil Apocalypse (2004)
    ┃ ┣ 📺Resident Evil Apocalypse (2004) [1080p].mkv
    ┃ ┣ 📜Resident Evil Apocalypse (2004) [1080p].ass
    ┃ ┣ 📜Resident Evil Apocalypse (2004) [1080p] German.srt
    ┃ ┗ 🎨Movie poster.png 👈 <b>extra non-video, non-subtitle files may exist</b>
    ┣ 📂Resident Evil Extinction (2007)
    ┃ ┣ 📺Resident Evil Apocalypse (2004) [1080p].wmv
    ┃ ┗ 📜Resident Evil Apocalypse (2004) [1080p].ssa
    ┣ 📂Resident Evil Retribution (2012)
    ┃ ┣ 📺Resident Evil Retribution (2012) [1080p].ogg
    ┃ ┣ 📜Resident Evil Retribution (2012) [1080p] English.sup
    ┃ ┣ 📜Resident Evil Retribution (2012) [1080p] Italian.sup
    ┃ ┣ 📜Resident Evil Retribution (2012) [1080p] Japanese.sup
    ┃ ┗ 📜Resident Evil Retribution (2012) [1080p] Russian.sup
    ┣ 📂Resident Evil The Final Chapter (2016)
    ┃ ┣ 📺Resident Evil The Final Chapter (2016) [1080p].ogm
    ┃ ┣ 📜Resident Evil The Final Chapter (2016) [1080p] Dutch.srt
    ┃ ┣ 📜Resident Evil The Final Chapter (2016) [1080p] Swedish.srt
    ┃ ┗ 📜Resident Evil The Final Chapter (2016) [1080p] Portuguese.srt
  </code>
</pre>
<br>

**Example (e.g., TV shows):**
<pre>
  <code>
    📂Some TV Show
    ┣ 📂Season 01 👈 <b>only one video, and at least one subtitle file per sub directory</b>
    ┃ ┣ 📺Some TV Show S01E01.mp4
    ┃ ┣ 📜Some TV Show S01E01 English.srt
    ┃ ┣ 📜Some TV Show S01E01 Spanish.srt
    ┃ ┣ 📺Some TV Show S01E02.avi
    ┃ ┣ 📜Some TV Show S01E02 English.srt
    ┃ ┣ 📜Some TV Show S01E02 Spanish.srt
    ┃ ┣ 📺Some TV Show S01E03.ogm
    ┃ ┣ 📜Some TV Show S01E03 English.srt
    ┃ ┣ 📜Some TV Show S01E03 Spanish.srt
    ┃ ┣ 📺Some TV Show S01E04.mp4
    ┃ ┣ 📜Some TV Show S01E04 English.srt
    ┃ ┣ 📜Some TV Show S01E04 Spanish.srt
    ┃ ┣ 📺Some TV Show S01E05.avi
    ┃ ┣ 📜Some TV Show S01E05 English.srt
    ┃ ┣ 📜Some TV Show S01E05 Spanish.srt
    ┣ 📂Season 02
    ┃ ┣ 📺Some TV Show S02E01.mkv
    ┃ ┣ 📜Some TV Show S02E01 English.srt
    ┃ ┣ 📜Some TV Show S02E01 Spanish.srt
    ┃ ┣ 📺Some TV Show S02E02.mp4
    ┃ ┣ 📜Some TV Show S02E02 English.srt
    ┃ ┣ 📜Some TV Show S02E02 Spanish.srt
    ┃ ┣ 📺Some TV Show S02E03.avi
    ┃ ┣ 📜Some TV Show S02E03 English.srt
    ┃ ┣ 📜Some TV Show S02E03 Spanish.srt
    ┃ ┣ 📺Some TV Show S02E04.avi
    ┃ ┣ 📜Some TV Show S02E04 English.srt
    ┃ ┣ 📜Some TV Show S02E04 Spanish.srt
    ┃ ┣ 📺Some TV Show S02E04 Part 2.avi
    ┃ ┣ 📜Some TV Show S02E04 Part 2 English.srt 👈 <b>This will only merge with "Part 2" as expected.</b>
    ┃ ┗ 📜Some TV Show S02E04 Part 2 Spanish.srt
  </code>
</pre>
<br>

## 🪓 Removing subtitles
When removing subtitles, each directory and/or subdirectory contain at least one video file will be processed, others will be skipped. Other non-video files may be included and will be ignored.<br><br>

**Example (e.g., movies):**
<pre>
  <code>
    📂Movies
    ┣ 📂Resident Evil (2002)
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

**Example (e.g., TV shows):**
<pre>
  <code>
    📂Some TV Show
    ┣ 📂Season 01
    ┃ ┣ 📺Some TV Show S01E01.mp4
    ┃ ┣ 📺Some TV Show S01E02.avi
    ┃ ┣ 📺Some TV Show S01E03.ogm
    ┃ ┣ 📺Some TV Show S01E04.mp4
    ┃ ┣ 📺Some TV Show S01E05.avi
    ┃ ┗ 🎨Some TV Show.jpg 👈 <b>extra non-video files may exist</b>
    ┣ 📂Season 02
    ┃ ┣ 📺Some TV Show S02E01.mkv
    ┃ ┣ 📺Some TV Show S02E02.mp4
    ┃ ┣ 📺Some TV Show S02E03.avi
    ┃ ┣ 📺Some TV Show S02E04.avi
    ┃ ┣ 📺Some TV Show S02E04 Part 2.avi
  </code>
</pre>
<br>

## 🗃️ Supported files
The following file types are supported.

**Video**:
* *AVI*, *M4V*, *MKV*, *MOV*, *MP4*, *MPG*, *MPEG*, *OGG*, *OGM*, *WEBM*, *WMV*

**Subtitle**:
* *ASS*, *PGS*, *SRT*, *SSA*, *SUP*
<br>

## 🦟 Software bugs
Bugs reported on the project's [issues page](https://github.com/iPzard/mkvtoolnix-batch-tool/issues) will be exterminated as quickly as possible, be sure to include steps to reproduce so they can be spotted easily.
<br><br><br>

## 🙏 Attribution
* MKV batch processing is powered by [MKVToolNix](https://gitlab.com/mbunkus/mkvtoolnix)
* SVG icons used are from [Font Awesome](https://fontawesome.com)
<br>

## 🏷️ License
GPLv2 © [iPzard](https://github.com/iPzard/mkvtoolnix-batch-tool/blob/master/LICENSE)