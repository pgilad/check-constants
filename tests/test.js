'use strict';
var expect = require('expect.js');
var fs = require('fs');
var checkConstants = require('../index');

describe('check-constants', function () {
    it('parse a file without constants', function () {
        var contents = fs.readFileSync('./tests/fixtures/empty.js').toString();
        var errors = checkConstants.inspect(contents);
        expect(errors).to.be.an('array');
        expect(errors).to.be.empty();
    });

    it('parse a file with basic constants', function () {
        var contents = fs.readFileSync('./tests/fixtures/basic.js').toString();
        var errors = checkConstants.inspect(contents);
        expect(errors).to.not.be.empty();
        expect(errors).to.have.property(0);
        var first = errors[0];
        expect(first.value).to.be.a('number');
        expect(first.value).to.equal(9.99);
        expect(first.code).to.match(/\d+/);
        expect(first).to.have.property('loc');
        expect(first.loc.start.line).to.equal(3);
        expect(first.loc.end.line).to.equal(3);
        expect(first.loc.start.column).to.equal(31);
        expect(first.loc.end.column).to.equal(35);
        var second = errors[1];
        expect(second.value).to.be.a('number');
        expect(second.value).to.equal(0.13);
        expect(second.code).to.match(/\d+/);
        expect(second).to.have.property('loc');
        expect(second.loc.start.line).to.equal(4);
        expect(second.loc.end.line).to.equal(4);
        expect(second.loc.start.column).to.equal(36);
        expect(second.loc.end.column).to.equal(40);
    });

    it('parse a corrected file with constants', function () {
        var contents = fs.readFileSync('./tests/fixtures/corrected.js').toString();
        var errors = checkConstants.inspect(contents);
        expect(errors).to.be.empty();
    });

    it('parse a corrected file with vars but not constants', function () {
        var contents = fs.readFileSync('./tests/fixtures/consts.js').toString();
        var errors = checkConstants.inspect(contents, {
            enforceConst: true
        });
        expect(errors).to.not.be.empty();
        expect(errors).to.have.length(1);
        expect(errors[0].value).to.equal(9.99);
    });

    it('deal with default ignored numbers', function () {
        var contents = fs.readFileSync('./tests/fixtures/ignored.js').toString();
        var errors = checkConstants.inspect(contents);
        expect(errors).to.not.be.empty();
        expect(errors).to.have.length(1);
        expect(errors[0].value).to.equal(0.13);
    });

    it('deal with custom ignored numbers', function () {
        var contents = fs.readFileSync('./tests/fixtures/ignored.js').toString();
        var errors = checkConstants.inspect(contents, {
            ignore: [0, 1, 0.13]
        });
        expect(errors).to.be.empty();
    });

    it('parse a complex case', function () {
        var contents = fs.readFileSync('./tests/fixtures/complex.js').toString();
        var errors = checkConstants.inspect(contents);
        expect(errors).to.not.be.empty();
        expect(errors).to.have.length(1);
        expect(errors[0].value).to.equal(2);
    });
});
