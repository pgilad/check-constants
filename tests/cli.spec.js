var path = require('path');
var util = require('util');

var expect = require('expect.js');
var binPath = path.resolve(__dirname, '..', 'bin', 'check-constants.js');

var getFixturePath = function (file) {
    return path.join('./tests/fixtures/', file);
};


var testCli = function (files, cb) {
    var consoleLog = console.log;
    var processExit = process.exit;
    var log = '';
    var args = files.map(getFixturePath);
    process.argv = ['node', binPath].concat(args);

    console.log = function () {
        var output = util.format.apply(util.format, arguments);
        log += require('chalk').stripColor(output) + '\n';
    };

    process.exit = function (code) {
        process.exit = processExit;
        console.log = consoleLog;
        delete require.cache[require.resolve('../bin/check-constants')];
        cb(code, log.split('\n'));
    };
    require('../bin/check-constants');
};

describe('check cli', function () {
    describe('multiple files', function () {
        it('Should parse multiple files', function (done) {
            testCli(['basic.js', 'consts.js'], function (code, log) {
                expect(code).to.eql(1);
                expect(log).to.eql([
                    '',
                    'tests/fixtures/basic.js',
                    '  line 3  col 31  9.99  subtotal + 9.99',
                    '  line 4  col 36  0.13  beforeTax * 0.13',
                    '',
                    ' ✖ 2 problems',
                    '',
                    '⚠ Scanned a total of 2 files. 1 contained extractable constants.',
                    ''
                ]);
                done();
            });
        });

        it('Check cli glob', function (done) {
            testCli(['{basic,complex}.js'], function (code, log) {
                expect(code).to.eql(1);
                expect(log).to.eql([
                    '',
                    'tests/fixtures/basic.js',
                    '  line 3  col 31  9.99  subtotal + 9.99',
                    '  line 4  col 36  0.13  beforeTax * 0.13',
                    '',
                    ' ✖ 2 problems',
                    '',
                    'tests/fixtures/complex.js',
                    '  line 5  col 28  2  i += 2',
                    '',
                    ' ✖ 1 problem',
                    '',
                    '⚠ Scanned a total of 2 files. 2 contained extractable constants.',
                    ''
                ]);
                done();
            });
        });

        it('should get no error code if no todos or fixmes are found', function (done) {
            testCli(['empty.js'], function (code, log) {
                expect(code).to.eql(0);
                expect(log).to.eql([
                    '',
                    '✔ Scanned 1 file. No problems found',
                    ''
                ]);
                done();
            });
        });
    });
});
