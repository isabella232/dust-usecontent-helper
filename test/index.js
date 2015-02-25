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

test('Does loader get called?', function (t) {
    require('../index')(function(locality, bundle, cont) {
        t.pass('loader got called');
        cont(null, {"hello": "world"});
    }).registerWith(dustjs);

    messages.registerWith(dustjs);

    dustjs.loadSource(dustjs.compile('{@useContent bundle="test"}{@message key="hello" /}{/useContent}', 'test'));
    dustjs.render('test', {}, function (err, out) {
        t.equal(out, "world");
        t.pass("loader is called");
        t.end();
    });
});
