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
    var ignoredTypes = ['ObjectExpression'];
    var enforceConst = options.enforceConst;
    var ignored = options.ignored;
    var errors = [];

    rocambole.moonwalk(ast, function (node) {
        //only validate numbers
        if (typeof node.value !== 'number') {
            return;
        }
        //skip ignored numbers
        if (contains(ignored, node.value)) {
            return;
        }
        var parent = node.parent.parent;
        //skip ignored types
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
            code: node.parent.toString(),
            value: node.value,
            loc: node.loc
        });
    });
    return errors;
}

function checkConstants(contents, options) {
    //set default options
    options = defaults(options || {}, {
        enforceConst: false,
        ignored: [0, 1]
    });
    //parse ast tree
    var ast = parseContents(contents);
    //check tree for constants
    return checkAst(ast, options);
}

module.exports = module.checkConstants = checkConstants;
module.parseContents = parseContents;
