# MKVToolNix Batch Tool

[![Build](https://img.shields.io/badge/build-passing-%2357a9a9?color=bf7e45&style=for-the-badge)](https://github.com/iPzard/mkvtoolnix-batch-tool#readme)
[![License](https://img.shields.io/github/license/iPzard/mkvtoolnix-batch-tool?color=bf7e45&style=for-the-badge)](https://github.com/iPzard/mkvtoolnix-batch-tool/blob/master/LICENSE)
[![Github All Releases](https://img.shields.io/github/downloads/iPzard/mkvtoolnix-batch-tool/total.svg?color=bf7e45&style=for-the-badge)](https://github.com/iPzard/mkvtoolnix-batch-tool#readme)

> Batch video and subtitle processing program to help you add (merge) or remove subtitles from your video library. Allows you to process a directory, and/or all of its subdirectories, in a single batch.
> <br><br>

<p align="center">
  <img src="https://user-images.githubusercontent.com/8584126/108663926-81612880-7486-11eb-87d4-23bb3f821f16.gif" />
</p>
<br>

## 💾 Downloads
MKVToolNix Batch Tool works on Windows 32-bit (x86) and Windows 64-bit (x64) operating systems, see the project's [releases&nbsp;page](https://github.com/iPzard/mkvtoolnix-batch-tool/releases) for download links.
<br><br>

## 🔨 Merging subtitles
When there's only one video file per subdirectory, all subtitle files in that same subdirectory will be merged into the video, regardless of the subtitle file's name. However, when there are multiple videos in a subdirectory, videos will only be merged with subtitle files that contain the video's full name within <i>(or as)</i> the subtitle file name, less the extension.\
\
The language of each subtitle file is determined automatically by parsing through text in the files as they're being merged, the language that matches your <b>Default language track</b> from the settings page <i>(defaults to English)</i> will be set as the default subtitle track on your merged video(s).<br><br>

**Example (e.g., movies):**

<pre>
  <code>
    📂Movies
    ┣ 📂Resident Evil (2002)
    ┃ ┣ 📺Resident Evil (2002) [1080p].mp4
    ┃ ┣ 📜Resident Evil (2002) [1080p] English.srt
    ┃ ┣ 📜Resident Evil (2002) [1080p] Spanish.srt
    ┃ ┗ 📜Subtitles French.srt 👈 <b>when only 1 video, all subtitles regardless of name, are merged</b>
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

**Example (e.g., TV show):**

<pre>
  <code>
    📂Some TV Show
    ┣ 📂Season 01
    ┃ ┣ 📺Some TV Show S01E01.mp4
    ┃ ┣ 📜Some TV Show S01E01 English.srt 👈 <b>with multiple videos, subtitle file name must include video's</b>
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
    ┃ ┗ 🎨Some TV Show Poster.png 👈 <b>extra non-video, non-subtitle files may exist</b>
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
    ┃ ┣ 📜Some TV Show S02E04 Part 2 English.srt 👈 <b>This will only merge with "Part 2", as expected</b>
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

**Example (e.g., TV show):**

<pre>
  <code>
    📂Some TV Show
    ┣ 📂Season 01
    ┃ ┣ 📺Some TV Show S01E01.mp4
    ┃ ┣ 📺Some TV Show S01E02.avi
    ┃ ┣ 📺Some TV Show S01E03.ogm
    ┃ ┣ 📺Some TV Show S01E04.mp4
    ┃ ┣ 📺Some TV Show S01E05.avi
    ┃ ┗ 🎨Some TV Show Poster.png 👈 <b>extra non-video, non-subtitle files may exist</b>
    ┣ 📂Season 02
    ┃ ┣ 📺Some TV Show S02E01.mkv
    ┃ ┣ 📺Some TV Show S02E02.mp4
    ┃ ┣ 📺Some TV Show S02E03.avi
    ┃ ┣ 📺Some TV Show S02E04.avi
    ┃ ┗ 📺Some TV Show S02E04 Part 2.avi
  </code>
</pre>
<br>

## 🗃️ Supported files
The following file types are supported.

**Video**:
- _AVI_, _M4V_, _MKV_, _MOV_, _MP4_, _MPG_, _MPEG_, _OGG_, _OGM_, _WEBM_, _WMV_

**Subtitle**:
- _ASS_, _PGS_, _SRT_, _SSA_, _SUP_
<br><br>

## 🙏 Attribution
- MKV batch processing is powered by [MKVToolNix](https://gitlab.com/mbunkus/mkvtoolnix)
- SVG icons used are from [Font Awesome](https://fontawesome.com)
<br><br>

## 🦟 Software bugs
Bugs reported on the project's [issues page](https://github.com/iPzard/mkvtoolnix-batch-tool/issues) will be exterminated as quickly as possible, be sure to include steps to reproduce so they can be spotted easily.
<br><br>

## 🏷️ License
GPLv2 © [iPzard](https://github.com/iPzard/mkvtoolnix-batch-tool/blob/master/LICENSE)
