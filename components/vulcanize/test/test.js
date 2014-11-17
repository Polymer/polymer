/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// jshint node: true
var assert = require('assert');
var path = require('path');

assert.AssertionError.prototype.showDiff = true;

suite('constants', function() {
  var constants = require('../lib/constants.js');

  suite('URLs', function() {

    test('absolute urls', function() {
      var abs = constants.ABS_URL;

      assert(abs.test('data:charset=utf8,'), 'data urls');
      assert(abs.test('http://foo.com'), 'http');
      assert(abs.test('https://foo.com'), 'https');
      assert(abs.test('mailto:foo@bar.com'), 'mailto');
      assert(abs.test('//foo.com'), 'protocol-free');
      assert(abs.test('/components/'), '/');
      assert(!abs.test('../foo/bar.html'), '../');
      assert(!abs.test('bar.html'), 'sibling dependency');
    });

    test('remote absolute urls', function() {
      var rabs = constants.REMOTE_ABS_URL;

      assert(rabs.test('http://foo.com'), 'http');
      assert(rabs.test('https://foo.com'), 'https');
      assert(rabs.test('//foo.com'), 'protocol-free');
      assert(!rabs.test('../foo/bar.html'), '../');
      assert(!rabs.test('bar.html'), 'sibling dependency');
      assert(!rabs.test('/components/'), '/');
    });

    test('CSS URLs', function() {
      var url = constants.URL;

      assert('url(foo.html)'.match(url), 'naked');
      assert('url(\'foo.html\')'.match(url), 'single quote');
      assert('url("foo.html")'.match(url), 'double quote');
    });

  });

  test('Polymer Invocation', function() {
    var polymer = constants.POLYMER_INVOCATION;

    function test(invocation, msg) {
      var matches = polymer.exec(invocation);
      assert(matches, 'polymer invocation found', msg);
    }

    test('Polymer(\'core-input\', {})', 'full');
    test('Polymer(\'core-input\')', 'name-only');
    test('Polymer()', 'none');
    test('Polymer({})', 'object-only');
    test('Polymer(p)', 'indirect');
  });

});

suite('Path Resolver', function() {
  var pathresolver = require('../lib/pathresolver.js');
  var inputPath = '/foo/bar/my-element';
  var outputPath = '/foo/bar';

  test('Rewrite URLs', function() {
    var css = [
      'x-element {',
      '  background-image: url(foo.jpg);',
      '}',
      'x-bar {',
      '  background-image: url(data:xxxxx);',
      '}',
      'x-quuz {',
      '  background-image: url(\'https://foo.bar/baz.jpg\');',
      '}',
    ].join('\n');

    var expected = [
      'x-element {',
      '  background-image: url("my-element/foo.jpg");',
      '}',
      'x-bar {',
      '  background-image: url("data:xxxxx");',
      '}',
      'x-quuz {',
      '  background-image: url("https://foo.bar/baz.jpg");',
      '}',
    ].join('\n');

    var actual = pathresolver.rewriteURL(inputPath, outputPath, css);
    assert.equal(actual, expected);
  });

  test('Rewrite Paths', function() {
    function testPath(val, expected, abs, msg) {
      var actual = pathresolver.rewriteRelPath(inputPath, outputPath, val, abs);
      assert.equal(actual, expected, msg);
    }

    testPath('biz.jpg', 'my-element/biz.jpg', null, 'local');
    testPath('http://foo/biz.jpg', 'http://foo/biz.jpg', null, 'remote');
    testPath('biz.jpg', 'bar/my-element/biz.jpg', '/foo/', 'build path');
  });

  test('Resolve Paths', function() {
    var html = [
      '<link rel="import" href="../polymer/polymer.html">',
      '<link rel="stylesheet" href="my-element.css">',
      '<polymer-element name="my-element">',
      '<template>',
      '<style>:host { background-image: url(background.svg); }</style>',
      '<script>Polymer()</script>',
      '</template>',
      '</polymer-element>'
    ].join('\n');

    var expected = [
      '<html><head><link rel="import" href="polymer/polymer.html">',
      '<link rel="stylesheet" href="my-element/my-element.css">',
      '</head><body><polymer-element name="my-element" assetpath="my-element/">',
      '<template>',
      '<style>:host { background-image: url("my-element/background.svg"); }</style>',
      '<script>Polymer()</script>',
      '</template>',
      '</polymer-element></body></html>'
    ].join('\n');

    var expected2 = [
      '<html><head><link rel="import" href="/bar/polymer/polymer.html">',
      '<link rel="stylesheet" href="/bar/my-element/my-element.css">',
      '</head><body><polymer-element name="my-element" assetpath="/bar/my-element/">',
      '<template>',
      '<style>:host { background-image: url("/bar/my-element/background.svg"); }</style>',
      '<script>Polymer()</script>',
      '</template>',
      '</polymer-element></body></html>'
    ].join('\n');

    var actual;
    var whacko = require('whacko');
    var $ = whacko.load(html);

    pathresolver.resolvePaths($, inputPath, outputPath);

    actual = $.html();
    assert.equal(actual, expected, 'relative');

    $ = whacko.load(html);

    pathresolver.resolvePaths($, inputPath, outputPath, '/foo');

    actual = $.html();
    assert.equal(actual, expected2, 'absolute');
  });

});

suite('Utils', function() {
  var constants = require('../lib/constants.js');
  var utils = require('../lib/utils.js');

  test('getTextContent', function() {
    var whacko = require('whacko');
    var divEl = whacko('<div>some text!</div>');
    assert.equal(utils.getTextContent(divEl), 'some text!', 'a textnode child');
    var blankEl = whacko('<div></div>');
    assert.equal(utils.getTextContent(blankEl), '', 'no textnode children');
  });

  test('setTextContent', function() {
    var whacko = require('whacko');
    var divEl = whacko('<div></div>');
    utils.setTextContent(divEl, 'some text!');
    assert.equal(utils.getTextContent(divEl), 'some text!', 'create text node');
    utils.setTextContent(divEl, 'some text 2!');
    assert.equal(utils.getTextContent(divEl), 'some text 2!', 'override text node');
  });

  test('unixPath', function() {
    var pp = ['foo', 'bar', 'baz'];
    var p = pp.join('/');
    var actual = utils.unixPath(p);
    assert.equal(actual, p, 'started unix');
    var p2 = pp.join('\\');
    actual = utils.unixPath(p2, '\\');
    assert.equal(actual, p, 'windows path');
  });

  test('escapeForRegExp', function() {
    var actual = utils.escapeForRegExp('foo-bar');
    assert.equal(actual, 'foo\\-bar', 'element name');
    actual = utils.escapeForRegExp('foo/bar/baz');
    assert.equal(actual, 'foo\\/bar\\/baz', 'absolute path');
  });

  test('Polymer Invocation', function() {
    var polymer = constants.POLYMER_INVOCATION;

    function test(invocation, expected, msg) {
      var matches = polymer.exec(invocation);
      assert(matches, 'polymer invocation found');
      var replacement = utils.processPolymerInvocation('core-input', matches);
      var actual = invocation.replace(matches[0], replacement);
      assert.strictEqual(actual, expected, msg);
    }

    test('Polymer(\'core-input\', {})', 'Polymer(\'core-input\', {})', 'full');
    test('Polymer(\'core-input\')', 'Polymer(\'core-input\')', 'name-only');
    test('Polymer()', 'Polymer(\'core-input\')', 'none');
    test('Polymer({})', 'Polymer(\'core-input\',{})', 'object-only');
    test('Polymer(p)', 'Polymer(\'core-input\',p)', 'indirect');

  });

  test('#82', function() {
    var constants = require('../lib/constants.js');
    var whacko = require('whacko');
    var $ = whacko.load('<polymer-element name="paper-button-base"><script>(function(){ Polymer(p);}()</script></polymer-element>');
    $(constants.JS_INLINE).each(function() {
      var el = $(this);
      var content = utils.getTextContent(el);
      assert(content);
      var parentElement = el.closest('polymer-element').get(0);
      if (parentElement) {
        var match = constants.POLYMER_INVOCATION.exec(content);
        var elementName = $(parentElement).attr('name');
        if (match) {
          var invocation = utils.processPolymerInvocation(elementName, match);
          content = content.replace(match[0], invocation);
          utils.setTextContent(el, content);
        }
      }
      assert.equal(utils.getTextContent(el), '(function(){ Polymer(\'paper-button-base\',p);}()');
    });
  });


});

suite('Optparser', function() {
  var path = require('path');
  var optParser = require('../lib/optparser.js');
  var constants = require('../lib/constants.js');
  var ABS_URL = constants.ABS_URL;
  var REMOTE_ABS_URL = constants.REMOTE_ABS_URL;

  function optParserTest(fn, opts, skipFail) {
    if (typeof opts === 'undefined') {
      opts = {input: path.resolve('index.html')};
    }
    optParser.processOptions(opts, function(err, options) {
      if (!skipFail) {
        assert.equal(err, null);
      }
      fn(err, options);
    });
  }

  test('Error on no input', function(done) {
    optParserTest(function(err, options) {
      assert.equal(err, 'No input file given!');
      done();
    }, null, true);
  });

  test('Defaults', function(done) {
    optParserTest(function(err, options) {
      assert.equal(options.input, path.resolve('index.html'));
      assert.equal(options.output, path.resolve('vulcanized.html'));
      assert.equal(options.outputDir, path.dirname(path.resolve('vulcanized.html')));
      assert(!options.csp);
      assert(!options.abspath);
      assert.deepEqual(options.excludes, {imports:[ABS_URL], scripts:[ABS_URL], styles:[ABS_URL]});
      done();
    });
  });

  test('CSP', function(done) {
    optParserTest(function(err, options) {
      assert.equal(options.csp, path.resolve('vulcanized.js'));
      done();
    }, {input: 'index.html', csp: true});
  });

  test('output', function(done) {
    optParserTest(function(err, options) {
      assert.equal(options.output, path.resolve('build.html'));
      assert.equal(options.csp, path.resolve('build.js'));
      done();
    }, {input: path.resolve('index.html'), output: path.resolve('build.html'), csp: true});
  });

  test('abspath', function(done) {
    optParserTest(function(err, options) {
      assert.equal(options.abspath, path.resolve('../'));
      assert.deepEqual(options.excludes, {imports:[REMOTE_ABS_URL], scripts:[REMOTE_ABS_URL], styles:[REMOTE_ABS_URL]});
      done();
    }, {input: path.resolve('index.html'), abspath: path.resolve('../')});
  });

  test('excludes', function(done) {
    var excludes = {
      imports: [
        '.*'
      ]
    };
    var expected = [/.*/, ABS_URL];

    optParserTest(function(err, options) {
      assert.deepEqual(options.excludes.imports, expected);
      done();
    }, {input: path.resolve('index.html'), excludes: excludes});

  });

  test('config file', function(done) {
    optParserTest(function(err, options) {
      assert.equal(options.input, path.resolve('index.html'));
      assert.equal(options.output, path.resolve('build.html'));
      assert.equal(options.csp, path.resolve('build.js'));
      assert(!options.abspath);
      assert.deepEqual(options.excludes, {imports:[/.*/, ABS_URL], scripts:[ABS_URL], styles:[ABS_URL]});
done();
    }, {config: path.resolve('test/config.json'), input: path.resolve('index.html'), output: path.resolve('build.html'), csp: true});
  });

  test('report broken config file', function(done) {
    optParserTest(function(err, options) {
      assert.equal(err, 'Malformed config JSON!');
      done();
    }, {config: path.resolve('test/broken_config.json')}, true);
  });

});

suite('Vulcan', function() {
  var vulcan = require('../lib/vulcan.js');
  var outputPath = path.resolve('test/html/actual.html');
  var inputPath = path.resolve('test/html/default.html');

  test('set options', function(done) {
    var options = {
      input: 'index.html'
    };
    vulcan.setOptions(options, done);
  });

  function process(options, fn) {
    var outputs = Object.create(null);
    options.outputSrc = function(name, data, eop) {
      if (!data) {
        throw new Error("Writing empty data");
      }
      outputs[name] = data;
    };
    vulcan.setOptions(options, function(err) {
      assert(!err);
      vulcan.processDocument();
      Object.keys(outputs).forEach(function(o) {
        assert.equal(typeof outputs[o], 'string', 'all buffers are closed');
      });
      fn(outputs);
    });
  }

  test('defaults', function(done) {
    var getTextContent = require('../lib/utils.js').getTextContent;

    process({input: inputPath, output: outputPath}, function(outputs) {
      assert.equal(Object.keys(outputs).length, 1);
      var vulcanized = outputs[outputPath];
      assert(vulcanized);
      var $ = require('whacko').load(vulcanized);
      assert.equal($('body > div[hidden]').length, 1, 'only one div[hidden]');
      assert.equal($('head > link[rel="import"]:not([href^="http://"])').length, 0, 'all relative imports removed');
      assert.equal($('polymer-element').length, 1, 'imports were deduplicated');
      assert.equal($('polymer-element').attr('noscript'), null, 'noscript removed');
      assert.equal(getTextContent($('polymer-element > script')), 'Polymer(\'my-element\');', 'polymer script included');
      assert.equal($('polymer-element > template > link').length, 0, 'external styles removed');
      assert.equal($('polymer-element > template > style').length, 1, 'styles inlined');
      assert.equal($('polymer-element > template > svg > *').length, 6, 'svg children propery nested');
      assert.equal($('polymer-element').attr('assetpath'), 'imports/', 'assetpath set');
      done();
    });
  });

  test('CSP', function(done) {

    process({input: inputPath, output: outputPath, csp: true}, function(outputs) {
      assert.equal(Object.keys(outputs).length, 2);
      var vulcanized = outputs[outputPath];
      var vulcanizedJS = outputs[path.resolve(outputPath, '../actual.js')];
      assert(vulcanized);
      assert(vulcanizedJS);
      var $ = require('whacko').load(vulcanized);
      assert($('body > script[src="actual.js"]'), 'vulcanized script in body');
      assert.equal($('body script:not([src])').length, 0, 'inline scripts removed');
      assert.equal(vulcanizedJS, 'Polymer(\'my-element\');', 'csp element script');
      done();
    });
  });

  test('exclude', function(done) {

    var i = 3;
    function reallyDone() {
      if (--i === 0) {
        done();
      }
    }

    process({input: inputPath, output: outputPath, excludes: {imports: ['simple-import']}}, function(outputs) {
      var vulcanized = outputs[outputPath];
      assert(vulcanized);
      var $ = require('whacko').load(vulcanized);
      assert.equal($('head > link[href="imports/simple-import.html"]').length, 0, 'import excluded');
      assert.equal($('head > link[rel="stylesheet"][href="imports/simple-style.css"]').length, 0, 'import content excluded');
      assert.equal($('head > link[href="http://example.com/foo/bar.html"]').length, 1, 'external import is not excluded');
      reallyDone();
    });

    process({input: inputPath, output: outputPath, excludes: {styles: ['simple-style']}}, function(outputs) {
      var vulcanized = outputs[outputPath];
      assert(vulcanized);
      var $ = require('whacko').load(vulcanized);
      assert.equal($('polymer-element[name="my-element"] > template > link[href="imports/simple-style.css"]').length, 1, 'style excluded');
      reallyDone();
    });

    process({input: inputPath, output: outputPath, excludes: {imports: ['simple-import']}, 'strip-excludes': false}, function(outputs) {
      var vulcanized = outputs[outputPath];
      assert(vulcanized);
      var $ = require('whacko').load(vulcanized);
      assert.equal($('link[href="imports/simple-import.html"]').length, 1, 'excluded import not stripped');
      reallyDone();
    });
  });

});
