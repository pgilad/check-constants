# check-constants
> Find numbers that should be extracted to a var or const statement

[![NPM Version](http://img.shields.io/npm/v/check-constants.svg?style=flat)](https://npmjs.org/package/check-constants)
[![NPM Downloads](http://img.shields.io/npm/dm/check-constants.svg?style=flat)](https://npmjs.org/package/check-constants)
[![Build Status](http://img.shields.io/travis/pgilad/check-constants.svg?style=flat)](https://travis-ci.org/pgilad/check-constants)

## WORK-IN-PROGRESS

This project is a simplified version of [buddy.js](https://github.com/danielstjules/buddy.js).
I really loved it, but found the Promise structure and over-complicated code too much for my needs.

Also this project parses the code using Esprima and not UglifyJs.

## Install

Install with [npm](https://npmjs.org/package/check-constants)

```bash
$ npm install --save check-constants
```

## Usage

```js
var contents = fs.readFileSync('./contents.js').toString();
var errors = checkConstants(contents);
// -> errors will contain possible variables that need extraction
```

## CLI
*TBD*

## API
*TBD*

## License
Copyright (©) 2014 Gilad Peleg. Licensed under the MIT license.
