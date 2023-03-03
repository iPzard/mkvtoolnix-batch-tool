# MKVToolNix Batch Tool

[![Build](https://img.shields.io/badge/build-passing-%23bf7e45?style=for-the-badge)](https://github.com/iPzard/mkvtoolnix-batch-tool#readme)
[![License](https://img.shields.io/github/license/iPzard/mkvtoolnix-batch-tool?color=bf7e45&style=for-the-badge)](https://github.com/iPzard/mkvtoolnix-batch-tool/blob/master/LICENSE)
[![Github All Releases](https://img.shields.io/github/downloads/iPzard/mkvtoolnix-batch-tool/total.svg?color=bf7e45&style=for-the-badge)](https://github.com/iPzard/mkvtoolnix-batch-tool/releases)

> Batch video and subtitle processing program to help you add (merge) or remove subtitles from your video library. Allows you to process a directory, and/or all of its subdirectories, in a single batch.
> <br><br>

<p align="center">
  <img src="https://user-images.githubusercontent.com/8584126/219522181-3630c16c-67db-448d-b466-482f0017d94a.gif" />
</p>
<br>

## 💾 Downloads
MKVToolNix Batch Tool works on Windows 32-bit (x86) and Windows 64-bit (x64) operating systems, see the project's [releases&nbsp;page](https://github.com/iPzard/mkvtoolnix-batch-tool/releases) for download links.
<br><br>

## 🔨 Merging subtitles
When there's only one video file per subdirectory, all subtitle files in that same subdirectory will be merged into the video, regardless of the subtitle file's name.

However, when there are multiple videos in a subdirectory, videos will only be merged with subtitle files that contain the video's full name within <i>(or as)</i> the subtitle file name, less the file extension and overrides <i>(if included)</i>.

The language of each subtitle file is determined automatically by parsing through text in the files as they're being merged. If set, languages matching your <b>Default language track</b> in the settings page will be set as the default subtitle track on your merged video(s).

You also have the option to override these settings for individual subtitle files by updating in the subtitle file name(s) as shown in the override examples below.<br><br>


**Example (e.g., movies):**

<pre>
  <code>
    📂Movies
    ┣ 📂Resident Evil (2002)
    ┃ ┣ 📺Resident Evil (2002) [1080p].mp4
    ┃ ┣ 📜Resident Evil (2002) [1080p].en.srt
    ┃ ┣ 📜Resident Evil (2002) [1080p].es.srt
    ┃ ┗ 📜Subtitles French.srt 👈 <b>when only 1 video, all subtitles regardless of name, are merged</b>
    ┣ 📂Resident Evil Afterlife (2010)
    ┃ ┣ 📺Resident Evil Afterlife (2010) [1080p].avi
    ┃ ┗ 📜Resident Evil Afterlife (2010) [1080p].pgs 👈 <b>language is always determined automatically</b>
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
    ┃ ┣ 📜Resident Evil Retribution (2012) [1080p].en.srt
    ┃ ┣ 📜Resident Evil Retribution (2012) [1080p] Italian.srt
    ┃ ┣ 📜Resident Evil Retribution (2012) [1080p] Japanese.srt
    ┃ ┗ 📜Resident Evil Retribution (2012) [1080p] Russian.srt
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
    ┃ ┣ 📜Some TV Show S01E01.en.srt 👈 <b>with multiple videos, subtitle name must include video's</b>
    ┃ ┣ 📜Some TV Show S01E01.es.srt
    ┃ ┣ 📺Some TV Show S01E02.avi
    ┃ ┣ 📜Some TV Show S01E02.en.srt
    ┃ ┣ 📜Some TV Show S01E02.es.srt
    ┃ ┣ 📺Some TV Show S01E03.ogm
    ┃ ┣ 📜Some TV Show S01E03.en.srt
    ┃ ┣ 📜Some TV Show S01E03.es.srt
    ┃ ┣ 📺Some TV Show S01E04.mp4
    ┃ ┣ 📜Some TV Show S01E04.en.srt
    ┃ ┣ 📜Some TV Show S01E04.es.srt
    ┃ ┣ 📺Some TV Show S01E05.avi
    ┃ ┣ 📜Some TV Show S01E05.en.srt
    ┃ ┣ 📜Some TV Show S01E05.es.srt
    ┃ ┗ 🎨Some TV Show Poster.png 👈 <b>extra non-video, non-subtitle files may exist</b>
    ┣ 📂Season 02
    ┃ ┣ 📺Some TV Show S02E01.mkv
    ┃ ┣ 📜Some TV Show S02E01.en.srt
    ┃ ┣ 📜Some TV Show S02E01.es.srt
    ┃ ┣ 📺Some TV Show S02E02.mp4
    ┃ ┣ 📜Some TV Show S02E02.en.srt
    ┃ ┣ 📜Some TV Show S02E02.es.srt
    ┃ ┣ 📺Some TV Show S02E03.avi
    ┃ ┣ 📜Some TV Show S02E03.en.srt
    ┃ ┣ 📜Some TV Show S02E03.es.srt
    ┃ ┣ 📺Some TV Show S02E04.avi
    ┃ ┣ 📜Some TV Show S02E04.en.srt
    ┃ ┣ 📜Some TV Show S02E04.es.srt
    ┃ ┣ 📺Some TV Show S02E04 Part 2.avi
    ┃ ┣ 📜Some TV Show S02E04 Part 2.en.srt 👈 <b>This will only merge with "Part 2", as expected</b>
    ┃ ┗ 📜Some TV Show S02E04 Part 2.es.srt
  </code>
</pre>
<br>

**Example (e.g., overrides):**
<pre>
  <code>
    📂Movies
    ┣ 📂Resident Evil (2002)
    ┃ ┣ 📺Resident Evil (2002) [1080p].mp4
    ┃ ┣ 📜Resident Evil (2002) [1080p].sdh.srt 👈 <b>Set hearing impaired</b>
    ┃ ┣ 📜Resident Evil (2002) [1080p].hearing-impaired.srt 👈 <b>Set hearing impaired (alt option)</b>
    ┃ ┣ 📜Resident Evil (2002) [1080p].forced.srt 👈 <b>Set forced track</b>
    ┃ ┣ 📜Resident Evil (2002) [1080p].default.srt 👈 <b>Set default track</b>
    ┃ ┗ 📜Subtitles Evil (2002) [1080p].nl.srt 👈 <b>Override language using a supported language code</b>
    ┃ ┗ 📜Subtitles Evil (2002) [1080p].default.forced.sdh.es.srt 👈 <b>Set multiple overrides</b>
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
- _ASS_, _IDX_, _PGS_, _SMI_, _SRT_, _SSA_, _SUB_, _SUP_, _VTT_
<br><br>

## 🙏 Attribution
- MKV batch processing is powered by [MKVToolNix](https://gitlab.com/mbunkus/mkvtoolnix)
- SVG icons used are from [Font Awesome](https://fontawesome.com)
<br><br>

## 🐱‍👤 Develop
Code documentation for this project, created with [JSDoc](https://github.com/jsdoc/jsdoc), can be found here:<br>
[MKVToolNix Batch Tool](https://ipzard.github.io/mkvtoolnix-batch-tool)
<br><br>
For documentation on how this project uses Electron, React, and Python together, see:<br>[Electron, React & Python](https://github.com/iPzard/electron-react-python-template#readme)
<br><br>

## 🦟 Software bugs
Bugs reported on the project's [issues page](https://github.com/iPzard/mkvtoolnix-batch-tool/issues) will be exterminated as quickly as possible, be sure to include steps to reproduce and your `error.log` file in `%APPDATA%/MKVToolNix Batch Tool/`. You can also see the developer console data by enabling debug mode on the settings page.
<br><br>

## 🐱‍💻 Contribute
Contributions are welcomed! If you see an [open issue](https://github.com/iPzard/mkvtoolnix-batch-tool/issues) you want to fix, here's how to contribute:
<br>

1. Fork the repo.
2. Create a feature branch.
3. Make your changes locally.
3. Create a pull request.
<br><br>

## 🏷️ License
GPLv2 © [iPzard](https://github.com/iPzard/mkvtoolnix-batch-tool/blob/master/LICENSE)
