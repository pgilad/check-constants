var table = require('text-table');
var chalk = require('chalk');
var logSymbols = require('log-symbols');

function outputFooter(results) {
    var total = results.length;
    var msg = total + ' problem' + (total === 1 ? '' : 's');
    console.log('\n', logSymbols.error, msg);
}

function outputJSON(results) {
    console.log(JSON.stringify(results, null, 2));
    outputFooter(results);
}

function outputTable(results) {
    var headers = [];
    var prevfile;
    var t = table(results.map(function (el, i) {
        var line = ['',
            chalk.gray('line ' + el.loc.start.line),
            chalk.gray('col ' + el.loc.start.column),
            el.value,
            chalk.cyan(el.code)
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
    outputFooter(results);
}

exports.reporters = {
    json: outputJSON,
    table: outputTable
};
