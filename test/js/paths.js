/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('resolvePath', function() {
  var assert = chai.assert;

  var work = document.createElement('div');
  var a = document.createElement('a');
  var resolver, apResolver;

  function dirname(levels) {
    levels = levels || 1;
    var pp = location.href.split('/');
    for (var i = 0; i < levels; i++) {
      pp.pop();
    }
    return pp.join('/');
  }

  // resolvePath may not remove '../', pass through an anchor to clean
  function urlResolve(resolver, path) {
    var junkyPath = resolver.resolvePath(path);
    a.href = junkyPath;
    // magical url voodoo
    return a.href;
  }

  suiteSetup(function() {
    wrap(document.body).appendChild(work);
    Polymer('x-resolve');
    Polymer('x-resolve-ap');
    work.innerHTML = '<polymer-element name="x-resolve"></polymer-element><polymer-element name="x-resolve-ap" assetpath="foo/bar/baz/"></polymer-element>';
    CustomElements.takeRecords();
    resolver = document.createElement('x-resolve');
    apResolver = document.createElement('x-resolve-ap');
  });

  suiteTeardown(function() {
    wrap(document.body).removeChild(work);
  });

  test('relative path', function() {
    assert.equal(urlResolve(resolver, 'foo.js'), dirname() + '/foo.js');
    assert.equal(urlResolve(resolver, 'bar/baz'), dirname() + '/bar/baz');
  });

  test('absolute path', function() {
    assert.equal(resolver.resolvePath('http://example.com/bar'), 'http://example.com/bar');
  });

  test('assetpath relative path', function() {
    assert.equal(urlResolve(apResolver, 'foo.js'), dirname() + '/foo/bar/baz/foo.js');
    assert.equal(urlResolve(apResolver, 'bar/baz'), dirname() + '/foo/bar/baz/bar/baz');
    assert.equal(urlResolve(apResolver, '../test/foo'), dirname() + '/foo/bar/test/foo');
  });

  test('assetpath absolute path', function() {
    assert.equal(urlResolve(apResolver, 'http://example.com/bar'), 'http://example.com/bar');
  });

});

htmlSuite('resolvePath - imports', function() {
  htmlTest('html/resolvePath.html');
});
