# Electron, React & Python Template
> A reusable Electron template that uses a React front-end with Redux & Redux Toolkit, and is integrated with Python/Flask for microservices.

![electron_react_python](https://user-images.githubusercontent.com/8584126/95290114-59e42900-0821-11eb-8e43-a708959e8449.gif)

## 🛠️ Setup
Ensure you have [Node](https://nodejs.org/en/download/) and [Python](https://www.python.org/downloads/) installed, then clone this repository. After it's cloned, navigate to the project's root directory on your computer and
:

**Install Python dependencies:**
```bash
pip3 install -r requirements.txt
```

**Install Node dependencies:**
```bash
yarn install
```

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