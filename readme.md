# check-constants
> Find numbers that should be extracted to a var or const statement

[![NPM Version](http://img.shields.io/npm/v/check-constants.svg?style=flat)](https://npmjs.org/package/check-constants)
[![NPM Downloads](http://img.shields.io/npm/dm/check-constants.svg?style=flat)](https://npmjs.org/package/check-constants)
[![Build Status](http://img.shields.io/travis/pgilad/check-constants.svg?style=flat)](https://travis-ci.org/pgilad/check-constants)

## WORK-IN-PROGRESS

This project is a simplified version of [buddy.js](https://github.com/danielstjules/buddy.js).
I really loved it, but found the Promise structure and over-complicated code too much for my needs.

Also this project parses the code using Esprima and not UglifyJs.

## Usage

### Programmatic

```bash
$ npm install --save-dev check-constants
```

```js
var fs = require('fs');
var checkConstants = require('check-constants');

var contents = fs.readFileSync('./contents.js', 'utf8');
var errors = checkConstants(contents);
// -> errors will contain possible variables that need extraction
```

### Command Line

```bash
$ npm install -g check-constants
```

## The Output
*TBD*

## API
*TBD*

## License
Copyright (©) 2014 Gilad Peleg. Licensed under the MIT license.
