# check-constants
> Find numbers that should be extracted to a var or const statement

[![NPM Version](http://img.shields.io/npm/v/check-constants.svg?style=flat)](https://npmjs.org/package/check-constants)
[![NPM Downloads](http://img.shields.io/npm/dm/check-constants.svg?style=flat)](https://npmjs.org/package/check-constants)
[![Build Status](http://img.shields.io/travis/pgilad/check-constants.svg?style=flat)](https://travis-ci.org/pgilad/check-constants)

This project is a simplified version of [buddy.js](https://github.com/danielstjules/buddy.js).
I initially really liked that project, but found the Promise based and over-complicated code too much for my needs.

Also this project parses the code using Esprima
 (actually [Rocambole](https://github.com/millermedeiros/rocambole)) and not UglifyJs.

**This is a work in progress. Expect possible breaking changes until it reaches version 1.0**

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

```bash
# Just regular
$ check-constants --file file.js

# pipe a file
$ cat file.js | check-constants

# Format output to json
$ check-constants --file file.js --format json

# Use a json file to set your options
$ check-constants --file file.js --options check-constants.json

# Check the current version of the cli app
$ check-constants --version
```

## The Output
```js
[{
    "code": "i = i + 2",
    "value": 2,
    "loc": {
        "start": {
            "line": 5,
            "column": 28
            },
        "end": {
            "line": 5,
            "column": 29
            }
        }
}]
```

## API

### enforceConst

Type: `Boolean`

Default: `false`

Whether to force variable declarations to be defined with `const`

### ignored

Type: `Array`

Default: `[0, 1]`

What numbers should be ignored. By default only [0, 1] are ignored.

## License
Copyright © 2014 Gilad Peleg. Licensed under the MIT license.
