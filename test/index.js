"use strict";

var test = require('tape');
var dustjs = require('dustjs-linkedin');
var messages = require('dust-message-helper');

test('Does helper load?', function (t) {
    require('../index')(function(locality, bundle, cont) {
    }).registerWith(dustjs);

    t.equal(typeof dustjs.helpers.useContent, 'function', 'Helper loaded');
    t.end();
});

test('Does loader work?', function (t) {
    require('../index')(function(context, bundle, cont) {
        t.same(context.options.option, true);
        t.pass('loader got called');
        if (bundle == 'test') {
            cont(null, {"hello": "world"});
        } else {
            cont(null, {"hello": "this morning!"});
        }
    }).registerWith(dustjs);

    messages.registerWith(dustjs);

    t.test('does loader get called?', function (t) {
        dustjs.loadSource(dustjs.compile('{@useContent bundle="test"}{@message key="hello" /}{/useContent}', 'test'));
        dustjs.render('test', dustjs.context({}, { option: true }), function (err, out) {
            t.equal(out, "world");
            t.pass("loader is called");
            t.end();
        });
    });

    t.test('do nested helpers work?', function (t) {
        dustjs.loadSource(dustjs.compile('{@useContent bundle="test"}{@useContent bundle="test2"}{@message key="hello" /}{/useContent}{/useContent}', 'nested'));
        dustjs.render('nested', dustjs.context({}, { option: true }), function (err, out) {
            t.equal(out, "this morning!");
            t.end();
        });
    });
});

test('bundle annotation', function (t) {
    require('../index')(function(context, bundle, cont) {
        t.same(context.options.option, true);
        t.pass('loader got called');
        if (bundle == 'test') {
            cont(null, {"hello": "world"});
        } else {
            cont(null, {"hello": "this morning!"});
        }
    }).registerWith(dustjs);

    messages.registerWith(dustjs);

    dustjs.helpers.wompwomp = function (chunk, context, blocks, params) {
        return chunk.map(function (chunk) {
            chunk.end(context.get('intl.bundle'));
        });
    }

    t.test('does loader get called?', function (t) {
        dustjs.loadSource(dustjs.compile('{@useContent bundle="test"}{@wompwomp/}{/useContent}', 'test'));
        dustjs.render('test', dustjs.context({}, { option: true }), function (err, out) {
            t.error(err);
            t.equal(out, "test");
            t.end();
        });
    });
});
