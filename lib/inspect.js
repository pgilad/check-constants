'use strict';
var rocambole = require('rocambole');
var defaults = require('lodash.defaults');
var contains = require('lodash.contains');

function parseContents(contents) {
    if (!contents) {
        return null;
    }
    var ast;
    try {
        ast = rocambole.parse(contents, {
            tolerant: true,
            loc: true
        });
    } catch (e) {
        throw new Error('Error parsing contents', e);
    }
    return ast;
}

function checkAst(ast, options) {
    var ignoredTypes = ['ObjectExpression', 'Property'];
    var enforceConst = options.enforceConst;
    var checkStrings = options.strings;
    var ignore = options.ignore;
    var errors = [];

    rocambole.moonwalk(ast, function (node) {
        var nodeType = typeof node.value;
        if (nodeType !== 'number') {
            if (!checkStrings) {
                return;
            }
            if (checkStrings && nodeType !== 'string') {
                return;
            }
        }
        //skip ignored numbers
        if (contains(ignore, node.value)) {
            return;
        }
        var parent = node.parent.parent;
        //skip ignore types
        if (contains(ignoredTypes, parent.type)) {
            return;
        }
        //skip variable declaration unless
        if (!enforceConst && parent.type === 'VariableDeclaration') {
            return;
        }
        if (parent.left && parent.left.type === 'MemberExpression') {
            return;
        }
        //if enforceConst
        if (enforceConst && parent.kind === 'const') {
            return;
        }
        errors.push({
            file: options.file,
            code: node.parent.toString(),
            value: node.value,
            loc: node.loc
        });
    });
    return errors;
}

function inspect(contents, params) {
    var options = defaults(params || {}, {
        strings: false,
        enforceConst: false,
        ignore: [0, 1],
        file: undefined
    });
    var ast = parseContents(contents);
    return checkAst(ast, options);
}

module.exports = inspect;
