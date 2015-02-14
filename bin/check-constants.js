#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');

var glob = require('glob');
var logSymbols = require('log-symbols');
var logSymbols = require('log-symbols');
var mapAsync = require('map-async');
var program = require('commander');
var stdin = require('get-stdin');

var checkConstants = require('../index');
process.title = 'check-constants';

var messages = {
    ok: 'No problems found',
    noFiles: 'No files passed for checking. See --help for examples.'
};

function list(val) {
    return val.split(',').map(parseFloat);
}

function cleanStr(str) {
    return str.toLowerCase().trim();
}

program
    .description('Find numbers and strings that should be extracted to a var or const statement')
    .version(require(path.resolve(__dirname, '../package.json')).version)
    .usage('[options] <file ...>')
    .option('-e, --enforce-const', 'require literals to be defined using const')
    .option('-i, --ignore <numbers>', 'list numbers to ignore (default: 0,1)', list)
    .option('-I, --disable-ignore', 'disables the ignore list')
    .option('-s, --strings', 'check strings as well')
    .option('-m, --min-length [minLength]', 'minimum length of strings to be checked (default: 0)', parseInt)
    .option('-r, --reporter [reporter]', 'specify the reporter to use [table|json] (default: table)', cleanStr, 'table')
    .on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ check-constants js/**/*.js');
        console.log('    $ check-constants index.js');
        console.log('    $ check-constants index.js public/index.js');
        console.log('    $ check-constants --reporter json index.js');
        console.log('    $ cat index.js | check-constants');
        console.log('');
    })
    .parse(process.argv);

function run(contents, params) {
    params = params || {};
    var options = {
        // Get the list of numbers to ignore
        ignore: program.disableIgnore ? [] : program.ignore,
        enforceConst: program.enforceConst,
        file: params.file,
        strings: program.strings,
        minLength: program.minLength
    };
    var output;
    try {
        output = checkConstants.inspect(contents, options);
    } catch (e) {
        console.log(logSymbols.error, e.toString());
        return false;
    }
    //no errors
    if (!output.length) {
        return true;
    }
    //get reporter name
    var log = checkConstants.log;
    var reporterFunc = log.reporters[program.reporter] || log.reporters.table;
    reporterFunc(output);
    return false;
}

function readFiles(files) {
    // Get all of the files, and globs of files
    files = files.reduce(function (newFiles, file) {
        return newFiles.concat(glob(file, {
            sync: true,
            nodir: true,
            cwd: process.cwd()
        }));
    }, []);

    if (!files || !files.length) {
        console.log(logSymbols.warning, messages.noFiles);
        return process.exit(0);
    }

    // Async read all of the given files
    mapAsync(files, function (file, cb) {
        fs.readFile(path.resolve(process.cwd(), file), 'utf8', cb);
    }, function (err, results) {
        if (err) {
            console.log(err);
            return process.exit(1);
        }
        var errors = results.map(function (contents, i) {
            return run(contents, {
                file: files[i]
            });
        }).filter(function (item) {
            return !item;
        });

        var filesScannedMsg;
        var msg;

        if (files.length > 1) {
            filesScannedMsg = 'Scanned a total of ' + files.length + ' files.';
        } else {
            filesScannedMsg = 'Scanned 1 file.';
        }

        if (!errors.length) {
            msg = filesScannedMsg + ' ' + messages.ok;
            console.log('\n' + logSymbols.success, msg);
            return process.exit(0);
        }
        msg = filesScannedMsg + ' ' + errors.length + ' contained extractable constants.';
        console.log('\n' + logSymbols.warning, msg);
        process.exit(1);
    });
}

if (!process.stdin.isTTY) {
    return stdin(function (contents) {
        if (run(contents)) {
            console.log(logSymbols.success, messages.ok);
            return process.exit(0);
        }
        process.exit(1);
    });
}
if (!program.args.length) {
    program.help();
    return;
}
readFiles(program.args);
