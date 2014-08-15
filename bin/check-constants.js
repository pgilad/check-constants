#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var stdin = process.stdin;

var program = require('commander');
var Table = require('cli-table');
var checkConstants = require('../index');
process.title = 'check-constants';

function list(val) {
    return val.split(',').map(parseFloat);
}

program
    .description('Find numbers that should be extracted to a var or const statement')
    .version(require('../package.json').version)
    .usage('[options] <file>')
    .option('-e, --enforce-const', 'require literals to be defined using const')
    .option('-i, --ignore <numbers>', 'list numbers to ignore (default: 0,1)', list)
    .option('-I, --disable-ignore', 'disables the ignore list')
    .option('-r, --reporter [table|json]', 'specify the reporter to use (default: table)')
    .parse(process.argv);

function outputJSON(output) {
    console.log(JSON.stringify(output) + '\n');
    process.exit(1);
}

function outputTable(output) {
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
    console.log(table.toString());
    process.exit(1);
}

function run(contents) {
    var options = {
        // Get the list of numbers to ignore
        ignore: program.disableIgnore ? [] : program.ignore,
        enforceConst: program.enforceConst
    };
    var output;
    try {
        output = checkConstants(contents, options);
    } catch (e) {
        console.error('There was an error processing the JS.\n' + e.toString() + '\n');
        return;
    }
    if (!output.length) {
        console.log('There are no constants that need extraction.\n');
        process.exit(0);
    }
    if (program.reporter && program.reporter.toLowerCase() === 'json') {
        return outputJSON(output);
    }
    outputTable(output);
}
//assume any unconsumed option is a filepath
var filePath = program.args;
if (filePath && filePath.length) {
    return run(fs.readFileSync(path.resolve(process.cwd(), filePath[0]), 'utf8'));
}

//get data from stream
stdin.setEncoding('utf8');
if (process.stdin.isTTY) {
    return program.help();
}
var data = [];
stdin.on('data', function (chunk) {
    data.push(chunk);
}).on('end', function () {
    data = data.join();
    run(data);
});
