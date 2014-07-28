#!/usr/bin/env node

'use strict';
var fs = require('fs');
var checkConstants = require('../index');
var input = process.argv[2];

function getStdin(cb) {
    var ret = '';

    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function (data) {
        ret += data;
    });

    process.stdin.on('end', function () {
        cb(ret);
    });
}

if (process.argv.indexOf('-h') !== -1 || process.argv.indexOf('--help') !== -1) {
    console.log('check-constants <input file> > <output file>');
    console.log('or');
    console.log('cat <input file> | check-constants > <output file>');
    return;
}

if (process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1) {
    console.log(require('../package.json').version);
    return;
}

if (input) {
    process.stdout.write(checkConstants(fs.readFileSync(input, 'utf8')));
    return;
}

getStdin(function (data) {
    process.stdout.write(checkConstants(data));
});
