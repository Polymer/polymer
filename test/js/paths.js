/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('resolvePath', function() {
  var assert = chai.assert;

  var work = document.createElement('div');
  var resolver, apResolver, dirname;

  suiteSetup(function() {
    wrap(document.body).appendChild(work);
    Polymer('x-resolve');
    Polymer('x-resolve-ap');
    work.innerHTML = '<polymer-element name="x-resolve"></polymer-element><polymer-element name="x-resolve-ap" assetpath="foo/bar/baz/"></polymer-element>';
    CustomElements.takeRecords();
    resolver = document.createElement('x-resolve');
    apResolver = document.createElement('x-resolve-ap');
    dirname = location.href.split('/').slice(0, -1).join('/') + '/';
  });

  suiteTeardown(function() {
    wrap(document.body).removeChild(work);
  });

  test('relative path', function() {
    assert.equal(resolver.resolvePath('foo.js'), dirname + 'foo.js');
    assert.equal(resolver.resolvePath('bar/baz'), dirname + 'bar/baz');
  });

  test('absolute path', function() {
    assert.equal(resolver.resolvePath('http://example.com/bar'), 'http://example.com/bar');
  });

  test('supplied base', function() {
    assert.equal(resolver.resolvePath('foo', 'http://example.com'), 'http://example.com/foo');
  });

  test('assetpath relative path', function() {
    assert.equal(apResolver.resolvePath('foo.js'), dirname + 'foo/bar/baz/foo.js');
    assert.equal(apResolver.resolvePath('bar/baz'), dirname + 'foo/bar/baz/bar/baz');
    assert.equal(apResolver.resolvePath('../test/foo'), dirname + 'foo/bar/test/foo');
  });

  test('assetpath absolute path', function() {
    assert.equal(apResolver.resolvePath('http://example.com/bar'), 'http://example.com/bar');
  });

  test('assetpah supplied base', function() {
    assert.equal(apResolver.resolvePath('foo', 'http://example.com'), 'http://example.com/foo');
  });

});

htmlSuite('resolvePath - imports', function() {
  htmlTest('html/resolvePath.html');
});
