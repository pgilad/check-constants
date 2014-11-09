#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');
var checkConstants = require('../index');
var logSymbols = require('log-symbols');
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

function run(contents, params) {
    params = params || {};
    var options = {
        // Get the list of numbers to ignore
        ignore: program.disableIgnore ? [] : program.ignore,
        enforceConst: program.enforceConst,
        file: params.file
    };
    var output;
    try {
        output = checkConstants.inspect(contents, options);
    } catch (e) {
        console.log(logSymbols.error, e.toString());
        process.exit(1);
    }
    //no errors
    if (!output.length) {
        console.log(logSymbols.success, 'No problems');
        process.exit(0);
    }
    //get reporter name
    var log = checkConstants.log;
    var reporter = program.reporter && program.reporter.toLowerCase() || 'table';
    var reporterFunc = log.reporters[reporter] || log.reporters.table;
    reporterFunc(output);
    process.exit(1);
}

//assume any unconsumed option is a file path
var filePath = program.args;
if (filePath && filePath.length) {
    return run(fs.readFileSync(path.resolve(process.cwd(), filePath[0]), 'utf8'), {
        file: filePath[0]
    });
}

var stdin = process.stdin;
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
