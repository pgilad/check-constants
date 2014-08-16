#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');
var chalk = require('chalk');
var table = require('text-table');
var logSymbols = require('log-symbols');
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

function outputFooter(output) {
    var total = output.length;
    var msg = total + ' problem' + (total === 1 ? '' : 's');
    console.log('\n', logSymbols.error, msg);
}

function outputJSON(output) {
    console.log(JSON.stringify(output, null, 2));
    outputFooter(output);
    process.exit(1);
}

function outputTable(output) {
    var headers = [];
    var prevfile;
    var t = table(output.map(function (el, i) {
        var line = ['',
            chalk.gray('line ' + el.loc.start.line),
            chalk.gray('col ' + el.loc.start.column),
            el.value,
            chalk.cyan('code ' + el.code)
        ];
        if (el.file !== prevfile) {
            headers[i] = el.file;
        }
        prevfile = el.file;
        return line;
    }, {
        stringLength: function (str) {
            return chalk.stripColor(str).length;
        }
    }));

    //set filename headers
    t = t.split('\n').map(function (el, i) {
        return headers[i] ? '\n' + chalk.underline(headers[i]) + '\n' + el : el;
    }).join('\n');
    console.log(t);
    outputFooter(output);
    process.exit(1);
}

var reporters = {
    json: outputJSON,
    table: outputTable
};

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
        output = checkConstants(contents, options);
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
    var reporter = program.reporter && program.reporter.toLowerCase();
    var reporterFunc = reporters[reporter || 'table'] || reporters.table;
    reporterFunc(output);
}

//assume any unconsumed option is a filepath
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
