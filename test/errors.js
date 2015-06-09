"use strict";

var test = require('tap').test;
var dustjs = require('dustjs-linkedin');
var helper = require('../');

test('arity check', function (t) {
    t.throws(function () {
        helper(function() {
        })
    }, { name: 'TypeError' });

    t.end();
});

test('type check', function (t) {
    t.throws(function () {
        helper("String");
    }, { name: 'TypeError' });

    t.end();
});
