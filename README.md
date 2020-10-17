# MKVToolNix Batch Tool
> An MKVToolNix powered, batch subtitle processing tool to merge subtitle files into videos or remove them from videos.

![electron_react_python](https://user-images.githubusercontent.com/8584126/95290114-59e42900-0821-11eb-8e43-a708959e8449.gif)

## Supported file types

**Video:** .avi, .m4v, .mkv, .mov, .mp4, .mpg, .mpeg, .ogg, .ogm, .webm, .wmv
**Subtitle:** .ass, .pgs, .srt, .ssa, .sup

## 🛠️ Merging subtitles
Ensure the video and subtitle files are arranged similar to the structure below, in this case you would select the `Movies` directory when choosing a source directory in the application. When merging each subdirectory must contain only one **video** file and one **subtitle** file, otherwise the directory will be skipped. Subdirectories may contain other non-video, non-subtitle files, which will be ignored.<br><br>

📂Movies
 ┣ 📂Resident Evil (2002) 👈 only one video, and one subtitle file per sub directory.
 ┃ ┣ 📺Resident Evil (2002) [1080p].mp4
 ┃ ┗ 📜Resident Evil (2002) [1080p].srt
 ┣ 📂Resident Evil Afterlife (2010)
 ┃ ┣ 📺Resident Evil Afterlife (2010) [1080p].avi
 ┃ ┣ 📜Resident Evil Afterlife (2010) [1080p].ass
 ┃ ┗ 🎨Movie poster.png 👈 extra non-video, non-subtitle files may exist.
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

<br>

## ⚙️ Config

Before starting Electron, you <em>**must**</em> build Python and React using the scripts below.

**Electron:** Electron's `main.js`, `preload.js`, and `renderer.js` files can be found in the project's root directory.

**React:** React files can be found in the `./src/` folder, the custom toolbar is in `./src/components/toolbar`.

**Python:** Python scripts can be created in the `./app.py` file and used on events via [REST](https://developer.mozilla.org/en-US/docs/Glossary/REST) calls.

<br>

## 📜 Scripts

**Build Documentation:**
```bash
yarn run build:docs
```

**Build Python & React:**
```bash
yarn run build:all
```

**Build Python:**
```bash
yarn run build:python
```

**Build React:**
```bash
yarn run build:react
```

**Start Electron:**
```bash
yarn run start
```
<br>

## 📦 Packaging

**Windows:**
```bash
yarn run build:package:windows
```

**MacOS:**
```bash
yarn run build:package:mac
```
<br>

## 🐱‍👓 Docs
Code documentation for this template, created with [JSDoc](https://github.com/jsdoc/jsdoc), can be found here:<br>
[Electron, React, & Python Template](https://ipzard.github.io/electron-react-python-template/)

<br>

## 🏷️ License
MIT © [iPzard](https://github.com/iPzard/electron-react-python-template/blob/master/LICENSE)