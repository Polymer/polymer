/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

suite('resolvePath', function() {
  var work = document.createElement('div');
  var resolver, apResolver, dirname;

  suiteSetup(function() {
    wrap(document.body).appendChild(work);
    Polymer('x-resolve');
    Polymer('x-resolve-ap');
    work.innerHTML = '<polymer-element name="x-resolve"></polymer-element><polymer-element name="x-resolve-ap" assetpath="foo/bar/baz/"></polymer-element>';
    CustomElements.takeRecords(work);
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
