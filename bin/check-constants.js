#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var yargs = require('yargs');
var Table = require('cli-table');
var stdin = process.stdin;
var stdout = process.stdout;
var stderr = process.stderr;
var argv = yargs.argv;

yargs
    .describe('file', 'A JavaScript file')
    .describe('options', 'An optional JSON file containing all options')
    .describe('version', 'Show current version')
    .describe('format', 'How to format results. --format=json for json')
    .usage('Usage: check-constants --file [index.js]\nPipe usage: cat [file] | check-constants');

process.title = 'check-constants';
var checkConstants = require('../index');

function run(contents) {
    var options = {};
    if (argv.options) {
        options = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), argv.options), 'utf8'));
    }

    var output;
    try {
        output = checkConstants(contents, options);
    } catch (e) {
        stderr.write('There was an error processing the JS.\n' + e.toString() + '\n');
        return;
    }

    if (argv.format && argv.format.toLowerCase() === 'json') {
        stdout.write(JSON.stringify(output) + '\n');
    } else {
        if (!output.length) {
            stdout.write('There are no constants that need extraction.\n');
        } else {
            var table = new Table({
                head: ['Number', 'Code', 'Line', 'Start Column', 'End Column']
            });
            output.forEach(function (err) {
                table.push([
                    err.value,
                    err.code,
                    err.loc.start.line,
                    err.loc.start.column,
                    err.loc.end.column
                ]);
            });
            stdout.write(table.toString());
        }
    }
}

if (argv.version) {
    stdout.write(require('../package.json').version);
    return;
}

if (argv.file) {
    var contents = fs.readFileSync(path.resolve(process.cwd(), argv.file), 'utf8');
    run(contents);
    return;
}

stdin.setEncoding('utf8');
if (process.stdin.isTTY) {
    yargs.showHelp();
    return;
}

var data = [];
stdin.on('data', function (chunk) {
    data.push(chunk);
});

stdin.on('end', function () {
    data = data.join();
    run(data);
});
