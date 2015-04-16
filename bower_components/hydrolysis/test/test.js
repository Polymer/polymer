/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// jshint node:true
var assert = require('chai').assert;
var path = require('path');

suite('Loader', function() {
  var loader = require('../lib/loader/file-loader.js');
  var l;

  beforeEach(function() {
    l = new loader();
  });

  test('api', function() {
    assert.ok(l.addResolver);
    assert.ok(l.request);
    assert.ok(l.requests);
  });

  test('request returns a promise', function() {
    if (!global.Promise) {
      return;
    }
    var p = l.request('/');
    assert.instanceOf(p, Promise);
  });

  test('request promises are deduplicated', function() {
    var p = l.request('/');
    var p2 = l.request('/');
    assert.equal(p, p2);
    assert.equal(Object.keys(l.requests).length, 1);
  });

  test('Null Resolver', function(done) {
    l.request('/').then(function() {
      throw 'should not get here';
    }, function(err) {
      assert.equal(err, 'no resolver found');
      done();
    });
  });

  suite('Filesystem Resolver', function() {
    var fsResolver = require('../lib/loader/fs-resolver.js');

    test('fs api', function() {
      var fs = new fsResolver({});
      assert.ok(fs.accept);
    });

    test('absolute url', function(done) {
      var fs = new fsResolver({
        root: path.join(__dirname, '..')
      });
      l.addResolver(fs);
      l.request('/test/static/xhr-text.txt').then(function(content) {
        assert.equal(content.trim(), 'Hello!');
      }).then(done, done);
    });

    test('host', function(done) {
      var fs = new fsResolver({
        host: 'www.example.com',
        root: path.join(__dirname, '..')
      });
      l.addResolver(fs);
      l.request('http://www.example.com/test/static/xhr-text.txt').then(function(content) {
        assert.equal(content.trim(), 'Hello!');
      }).then(done, done);
    });

    test('basepath', function(done) {
      var fs = new fsResolver({
        host: 'www.example.com',
        basePath: '/components'
      });

      l.addResolver(fs);
      l.request('http://www.example.com/components/test/static/xhr-text.txt').then(function(content) {
        assert.equal(content.trim(), 'Hello!');
      }).then(done, done);
    });

    test('root', function(done) {
      var fs = new fsResolver({
        host: 'www.example.com',
        basePath: '/components',
        root: 'test/static/'
      });

      l.addResolver(fs);
      l.request('http://www.example.com/components/xhr-text.txt').then(function(content) {
        assert.equal(content.trim(), 'Hello!');
      }).then(done, done);
    });
  });

  suite('Noop Resolver', function() {
    var NoopResolver = require('../lib/loader/noop-resolver.js');

    test('loader api', function() {
      var noop = new NoopResolver();
      assert.ok(noop.accept);
    });

    test('accepts a string', function() {
      var noop = new NoopResolver("foo");
      var actual = noop.accept('foo', {resolve:function(){}});
      assert.isTrue(actual);
    });

    test('accepts a regex', function() {
      var noop = new NoopResolver(/./);
      var actual = noop.accept('foo', {resolve:function(){}});
      assert.isTrue(actual);
    });

    test('returns empty string for accepted urls', function(done) {
      var noop = new NoopResolver(/./);
      l.addResolver(noop);
      l.request('anything').then(function(content) {
        assert.equal('', content);
      }).then(done, done);
    });

  });

});
