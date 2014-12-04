'use strict';
var expect = require('expect.js');
var fs = require('fs');
var checkConstants = require('../index');

describe('check-constants - strings', function () {
    it('parse a file with basic string constant', function () {
        var contents = fs.readFileSync('./tests/fixtures/empty.js').toString();
        var errors = checkConstants.inspect(contents, {
            strings: true
        });
        expect(errors).to.be.an('array');
        expect(errors).to.not.be.empty();
        expect(errors[0].value).to.equal('true');
    });

    it('should not trigger errors on a correct file', function () {
        var contents = fs.readFileSync('./tests/fixtures/corrected.js').toString();
        var errors = checkConstants.inspect(contents, {
            strings: true
        });
        expect(errors).to.be.empty();
    });

    it('should handle some basic examples', function () {
        var contents = fs.readFileSync('./tests/fixtures/strings.js').toString();
        var errors = checkConstants.inspect(contents, {
            strings: true
        });
        expect(errors).to.not.be.empty();
        expect(errors[0].loc.start.line).to.equal(1);
        expect(errors[0].loc.end.line).to.equal(1);
        expect(errors[0].loc.start.column).to.equal(8);
        expect(errors[0].loc.end.column).to.equal(12);
        expect(errors[0].value).to.equal('fs');
        expect(errors[1].loc.start.line).to.equal(2);
        expect(errors[1].loc.end.line).to.equal(2);
        expect(errors[1].loc.start.column).to.equal(12);
        expect(errors[1].loc.end.column).to.equal(38);
        expect(errors[1].value).to.equal('Current memory usage: %s');
    });
});
