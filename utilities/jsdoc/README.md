# daybrush-jsdoc-template
[![npm package](https://img.shields.io/npm/v/daybrush-jsdoc-template.svg)](https://www.npmjs.com/package/daybrush-jsdoc-template) [![license](https://img.shields.io/npm/l/daybrush-jsdoc-template.svg)](LICENSE.md)

**daybrush-jsdoc-template** is a template based on the [**docdash**](https://github.com/clenemt/docdash) template.

* [Demo](http://daybrush.github.io/scenejs/release/latest/doc/)

## Install

```bash
$ npm install daybrush-jsdoc-template
```

## Usage
Clone repository to your designated `jsdoc` template directory, then:

```bash
$ jsdoc entry-file.js -t path/to/daybrush-jsdoc-template
```

### scene.js
```bash
$  jsdoc ./outjs ./README.md -d doc -t ./node_modules/daybrush-jsdoc-template
```

## Usage (npm)
In your projects `package.json` file add a new script:

```json
"script": {
  "generate-docs": "node_modules/.bin/jsdoc -c jsdoc.json"
}
```

In your `jsdoc.json` file, add a template option.

```json
"opts": {
  "template": "node_modules/daybrush-jsdoc-template"
}
```
