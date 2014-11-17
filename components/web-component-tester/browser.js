;(function(){

// CommonJS require()

function require(p){
    var path = require.resolve(p)
      , mod = require.modules[path];
    if (!mod) throw new Error('failed to require "' + p + '"');
    if (!mod.exports) {
      mod.exports = {};
      mod.call(mod.exports, mod, mod.exports, require.relative(path));
    }
    return mod.exports;
  }

require.modules = {};

require.resolve = function (path){
    var orig = path
      , reg = path + '.js'
      , index = path + '/index.js';
    return require.modules[reg] && reg
      || require.modules[index] && index
      || orig;
  };

require.register = function (path, fn){
    require.modules[path] = fn;
  };

require.relative = function (parent) {
    return function(p){
      if ('.' != p.charAt(0)) return require(p);

      var path = parent.split('/')
        , segs = p.split('/');
      path.pop();

      for (var i = 0; i < segs.length; i++) {
        var seg = segs[i];
        if ('..' == seg) path.pop();
        else if ('.' != seg) path.push(seg);
      }

      return require(path.join('/'));
    };
  };


require.register("browser/debug.js", function(module, exports, require){

module.exports = function(type){
  return function(){
  }
};

}); // module: browser/debug.js

require.register("browser/diff.js", function(module, exports, require){
/* See LICENSE file for terms of use */

/*
 * Text diff implementation.
 *
 * This library supports the following APIS:
 * JsDiff.diffChars: Character by character diff
 * JsDiff.diffWords: Word (as defined by \b regex) diff which ignores whitespace
 * JsDiff.diffLines: Line based diff
 *
 * JsDiff.diffCss: Diff targeted at CSS content
 *
 * These methods are based on the implementation proposed in
 * "An O(ND) Difference Algorithm and its Variations" (Myers, 1986).
 * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927
 */
var JsDiff = (function() {
  /*jshint maxparams: 5*/
  function clonePath(path) {
    return { newPos: path.newPos, components: path.components.slice(0) };
  }
  function removeEmpty(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  }
  function escapeHTML(s) {
    var n = s;
    n = n.replace(/&/g, '&amp;');
    n = n.replace(/</g, '&lt;');
    n = n.replace(/>/g, '&gt;');
    n = n.replace(/"/g, '&quot;');

    return n;
  }

  var Diff = function(ignoreWhitespace) {
    this.ignoreWhitespace = ignoreWhitespace;
  };
  Diff.prototype = {
      diff: function(oldString, newString) {
        // Handle the identity case (this is due to unrolling editLength == 0
        if (newString === oldString) {
          return [{ value: newString }];
        }
        if (!newString) {
          return [{ value: oldString, removed: true }];
        }
        if (!oldString) {
          return [{ value: newString, added: true }];
        }

        newString = this.tokenize(newString);
        oldString = this.tokenize(oldString);

        var newLen = newString.length, oldLen = oldString.length;
        var maxEditLength = newLen + oldLen;
        var bestPath = [{ newPos: -1, components: [] }];

        // Seed editLength = 0
        var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
        if (bestPath[0].newPos+1 >= newLen && oldPos+1 >= oldLen) {
          return bestPath[0].components;
        }

        for (var editLength = 1; editLength <= maxEditLength; editLength++) {
          for (var diagonalPath = -1*editLength; diagonalPath <= editLength; diagonalPath+=2) {
            var basePath;
            var addPath = bestPath[diagonalPath-1],
                removePath = bestPath[diagonalPath+1];
            oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
            if (addPath) {
              // No one else is going to attempt to use this value, clear it
              bestPath[diagonalPath-1] = undefined;
            }

            var canAdd = addPath && addPath.newPos+1 < newLen;
            var canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
            if (!canAdd && !canRemove) {
              bestPath[diagonalPath] = undefined;
              continue;
            }

            // Select the diagonal that we want to branch from. We select the prior
            // path whose position in the new string is the farthest from the origin
            // and does not pass the bounds of the diff graph
            if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
              basePath = clonePath(removePath);
              this.pushComponent(basePath.components, oldString[oldPos], undefined, true);
            } else {
              basePath = clonePath(addPath);
              basePath.newPos++;
              this.pushComponent(basePath.components, newString[basePath.newPos], true, undefined);
            }

            var oldPos = this.extractCommon(basePath, newString, oldString, diagonalPath);

            if (basePath.newPos+1 >= newLen && oldPos+1 >= oldLen) {
              return basePath.components;
            } else {
              bestPath[diagonalPath] = basePath;
            }
          }
        }
      },

      pushComponent: function(components, value, added, removed) {
        var last = components[components.length-1];
        if (last && last.added === added && last.removed === removed) {
          // We need to clone here as the component clone operation is just
          // as shallow array clone
          components[components.length-1] =
            {value: this.join(last.value, value), added: added, removed: removed };
        } else {
          components.push({value: value, added: added, removed: removed });
        }
      },
      extractCommon: function(basePath, newString, oldString, diagonalPath) {
        var newLen = newString.length,
            oldLen = oldString.length,
            newPos = basePath.newPos,
            oldPos = newPos - diagonalPath;
        while (newPos+1 < newLen && oldPos+1 < oldLen && this.equals(newString[newPos+1], oldString[oldPos+1])) {
          newPos++;
          oldPos++;

          this.pushComponent(basePath.components, newString[newPos], undefined, undefined);
        }
        basePath.newPos = newPos;
        return oldPos;
      },

      equals: function(left, right) {
        var reWhitespace = /\S/;
        if (this.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right)) {
          return true;
        } else {
          return left === right;
        }
      },
      join: function(left, right) {
        return left + right;
      },
      tokenize: function(value) {
        return value;
      }
  };

  var CharDiff = new Diff();

  var WordDiff = new Diff(true);
  var WordWithSpaceDiff = new Diff();
  WordDiff.tokenize = WordWithSpaceDiff.tokenize = function(value) {
    return removeEmpty(value.split(/(\s+|\b)/));
  };

  var CssDiff = new Diff(true);
  CssDiff.tokenize = function(value) {
    return removeEmpty(value.split(/([{}:;,]|\s+)/));
  };

  var LineDiff = new Diff();
  LineDiff.tokenize = function(value) {
    return value.split(/^/m);
  };

  return {
    Diff: Diff,

    diffChars: function(oldStr, newStr) { return CharDiff.diff(oldStr, newStr); },
    diffWords: function(oldStr, newStr) { return WordDiff.diff(oldStr, newStr); },
    diffWordsWithSpace: function(oldStr, newStr) { return WordWithSpaceDiff.diff(oldStr, newStr); },
    diffLines: function(oldStr, newStr) { return LineDiff.diff(oldStr, newStr); },

    diffCss: function(oldStr, newStr) { return CssDiff.diff(oldStr, newStr); },

    createPatch: function(fileName, oldStr, newStr, oldHeader, newHeader) {
      var ret = [];

      ret.push('Index: ' + fileName);
      ret.push('===================================================================');
      ret.push('--- ' + fileName + (typeof oldHeader === 'undefined' ? '' : '\t' + oldHeader));
      ret.push('+++ ' + fileName + (typeof newHeader === 'undefined' ? '' : '\t' + newHeader));

      var diff = LineDiff.diff(oldStr, newStr);
      if (!diff[diff.length-1].value) {
        diff.pop();   // Remove trailing newline add
      }
      diff.push({value: '', lines: []});   // Append an empty value to make cleanup easier

      function contextLines(lines) {
        return lines.map(function(entry) { return ' ' + entry; });
      }
      function eofNL(curRange, i, current) {
        var last = diff[diff.length-2],
            isLast = i === diff.length-2,
            isLastOfType = i === diff.length-3 && (current.added !== last.added || current.removed !== last.removed);

        // Figure out if this is the last line for the given file and missing NL
        if (!/\n$/.test(current.value) && (isLast || isLastOfType)) {
          curRange.push('\\ No newline at end of file');
        }
      }

      var oldRangeStart = 0, newRangeStart = 0, curRange = [],
          oldLine = 1, newLine = 1;
      for (var i = 0; i < diff.length; i++) {
        var current = diff[i],
            lines = current.lines || current.value.replace(/\n$/, '').split('\n');
        current.lines = lines;

        if (current.added || current.removed) {
          if (!oldRangeStart) {
            var prev = diff[i-1];
            oldRangeStart = oldLine;
            newRangeStart = newLine;

            if (prev) {
              curRange = contextLines(prev.lines.slice(-4));
              oldRangeStart -= curRange.length;
              newRangeStart -= curRange.length;
            }
          }
          curRange.push.apply(curRange, lines.map(function(entry) { return (current.added?'+':'-') + entry; }));
          eofNL(curRange, i, current);

          if (current.added) {
            newLine += lines.length;
          } else {
            oldLine += lines.length;
          }
        } else {
          if (oldRangeStart) {
            // Close out any changes that have been output (or join overlapping)
            if (lines.length <= 8 && i < diff.length-2) {
              // Overlapping
              curRange.push.apply(curRange, contextLines(lines));
            } else {
              // end the range and output
              var contextSize = Math.min(lines.length, 4);
              ret.push(
                  '@@ -' + oldRangeStart + ',' + (oldLine-oldRangeStart+contextSize)
                  + ' +' + newRangeStart + ',' + (newLine-newRangeStart+contextSize)
                  + ' @@');
              ret.push.apply(ret, curRange);
              ret.push.apply(ret, contextLines(lines.slice(0, contextSize)));
              if (lines.length <= 4) {
                eofNL(ret, i, current);
              }

              oldRangeStart = 0;  newRangeStart = 0; curRange = [];
            }
          }
          oldLine += lines.length;
          newLine += lines.length;
        }
      }

      return ret.join('\n') + '\n';
    },

    applyPatch: function(oldStr, uniDiff) {
      var diffstr = uniDiff.split('\n');
      var diff = [];
      var remEOFNL = false,
          addEOFNL = false;

      for (var i = (diffstr[0][0]==='I'?4:0); i < diffstr.length; i++) {
        if(diffstr[i][0] === '@') {
          var meh = diffstr[i].split(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/);
          diff.unshift({
            start:meh[3],
            oldlength:meh[2],
            oldlines:[],
            newlength:meh[4],
            newlines:[]
          });
        } else if(diffstr[i][0] === '+') {
          diff[0].newlines.push(diffstr[i].substr(1));
        } else if(diffstr[i][0] === '-') {
          diff[0].oldlines.push(diffstr[i].substr(1));
        } else if(diffstr[i][0] === ' ') {
          diff[0].newlines.push(diffstr[i].substr(1));
          diff[0].oldlines.push(diffstr[i].substr(1));
        } else if(diffstr[i][0] === '\\') {
          if (diffstr[i-1][0] === '+') {
            remEOFNL = true;
          } else if(diffstr[i-1][0] === '-') {
            addEOFNL = true;
          }
        }
      }

      var str = oldStr.split('\n');
      for (var i = diff.length - 1; i >= 0; i--) {
        var d = diff[i];
        for (var j = 0; j < d.oldlength; j++) {
          if(str[d.start-1+j] !== d.oldlines[j]) {
            return false;
          }
        }
        Array.prototype.splice.apply(str,[d.start-1,+d.oldlength].concat(d.newlines));
      }

      if (remEOFNL) {
        while (!str[str.length-1]) {
          str.pop();
        }
      } else if (addEOFNL) {
        str.push('');
      }
      return str.join('\n');
    },

    convertChangesToXML: function(changes){
      var ret = [];
      for ( var i = 0; i < changes.length; i++) {
        var change = changes[i];
        if (change.added) {
          ret.push('<ins>');
        } else if (change.removed) {
          ret.push('<del>');
        }

        ret.push(escapeHTML(change.value));

        if (change.added) {
          ret.push('</ins>');
        } else if (change.removed) {
          ret.push('</del>');
        }
      }
      return ret.join('');
    },

    // See: http://code.google.com/p/google-diff-match-patch/wiki/API
    convertChangesToDMP: function(changes){
      var ret = [], change;
      for ( var i = 0; i < changes.length; i++) {
        change = changes[i];
        ret.push([(change.added ? 1 : change.removed ? -1 : 0), change.value]);
      }
      return ret;
    }
  };
})();

if (typeof module !== 'undefined') {
    module.exports = JsDiff;
}

}); // module: browser/diff.js

require.register("browser/events.js", function(module, exports, require){

/**
 * Module exports.
 */

exports.EventEmitter = EventEmitter;

/**
 * Check if `obj` is an array.
 */

function isArray(obj) {
  return '[object Array]' == {}.toString.call(obj);
}

/**
 * Event emitter constructor.
 *
 * @api public
 */

function EventEmitter(){};

/**
 * Adds a listener.
 *
 * @api public
 */

EventEmitter.prototype.on = function (name, fn) {
  if (!this.$events) {
    this.$events = {};
  }

  if (!this.$events[name]) {
    this.$events[name] = fn;
  } else if (isArray(this.$events[name])) {
    this.$events[name].push(fn);
  } else {
    this.$events[name] = [this.$events[name], fn];
  }

  return this;
};

EventEmitter.prototype.addListener = EventEmitter.prototype.on;

/**
 * Adds a volatile listener.
 *
 * @api public
 */

EventEmitter.prototype.once = function (name, fn) {
  var self = this;

  function on () {
    self.removeListener(name, on);
    fn.apply(this, arguments);
  };

  on.listener = fn;
  this.on(name, on);

  return this;
};

/**
 * Removes a listener.
 *
 * @api public
 */

EventEmitter.prototype.removeListener = function (name, fn) {
  if (this.$events && this.$events[name]) {
    var list = this.$events[name];

    if (isArray(list)) {
      var pos = -1;

      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
          pos = i;
          break;
        }
      }

      if (pos < 0) {
        return this;
      }

      list.splice(pos, 1);

      if (!list.length) {
        delete this.$events[name];
      }
    } else if (list === fn || (list.listener && list.listener === fn)) {
      delete this.$events[name];
    }
  }

  return this;
};

/**
 * Removes all listeners for an event.
 *
 * @api public
 */

EventEmitter.prototype.removeAllListeners = function (name) {
  if (name === undefined) {
    this.$events = {};
    return this;
  }

  if (this.$events && this.$events[name]) {
    this.$events[name] = null;
  }

  return this;
};

/**
 * Gets all listeners for a certain event.
 *
 * @api public
 */

EventEmitter.prototype.listeners = function (name) {
  if (!this.$events) {
    this.$events = {};
  }

  if (!this.$events[name]) {
    this.$events[name] = [];
  }

  if (!isArray(this.$events[name])) {
    this.$events[name] = [this.$events[name]];
  }

  return this.$events[name];
};

/**
 * Emits an event.
 *
 * @api public
 */

EventEmitter.prototype.emit = function (name) {
  if (!this.$events) {
    return false;
  }

  var handler = this.$events[name];

  if (!handler) {
    return false;
  }

  var args = [].slice.call(arguments, 1);

  if ('function' == typeof handler) {
    handler.apply(this, args);
  } else if (isArray(handler)) {
    var listeners = handler.slice();

    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
  } else {
    return false;
  }

  return true;
};
}); // module: browser/events.js

require.register("browser/fs.js", function(module, exports, require){

}); // module: browser/fs.js

require.register("browser/path.js", function(module, exports, require){

}); // module: browser/path.js

require.register("browser/progress.js", function(module, exports, require){
/**
 * Expose `Progress`.
 */

module.exports = Progress;

/**
 * Initialize a new `Progress` indicator.
 */

function Progress() {
  this.percent = 0;
  this.size(0);
  this.fontSize(11);
  this.font('helvetica, arial, sans-serif');
}

/**
 * Set progress size to `n`.
 *
 * @param {Number} n
 * @return {Progress} for chaining
 * @api public
 */

Progress.prototype.size = function(n){
  this._size = n;
  return this;
};

/**
 * Set text to `str`.
 *
 * @param {String} str
 * @return {Progress} for chaining
 * @api public
 */

Progress.prototype.text = function(str){
  this._text = str;
  return this;
};

/**
 * Set font size to `n`.
 *
 * @param {Number} n
 * @return {Progress} for chaining
 * @api public
 */

Progress.prototype.fontSize = function(n){
  this._fontSize = n;
  return this;
};

/**
 * Set font `family`.
 *
 * @param {String} family
 * @return {Progress} for chaining
 */

Progress.prototype.font = function(family){
  this._font = family;
  return this;
};

/**
 * Update percentage to `n`.
 *
 * @param {Number} n
 * @return {Progress} for chaining
 */

Progress.prototype.update = function(n){
  this.percent = n;
  return this;
};

/**
 * Draw on `ctx`.
 *
 * @param {CanvasRenderingContext2d} ctx
 * @return {Progress} for chaining
 */

Progress.prototype.draw = function(ctx){
  try {
    var percent = Math.min(this.percent, 100)
      , size = this._size
      , half = size / 2
      , x = half
      , y = half
      , rad = half - 1
      , fontSize = this._fontSize;
  
    ctx.font = fontSize + 'px ' + this._font;
  
    var angle = Math.PI * 2 * (percent / 100);
    ctx.clearRect(0, 0, size, size);
  
    // outer circle
    ctx.strokeStyle = '#9f9f9f';
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, angle, false);
    ctx.stroke();
  
    // inner circle
    ctx.strokeStyle = '#eee';
    ctx.beginPath();
    ctx.arc(x, y, rad - 1, 0, angle, true);
    ctx.stroke();
  
    // text
    var text = this._text || (percent | 0) + '%'
      , w = ctx.measureText(text).width;
  
    ctx.fillText(
        text
      , x - w / 2 + 1
      , y + fontSize / 2 - 1);
  } catch (ex) {} //don't fail if we can't render progress
  return this;
};

}); // module: browser/progress.js

require.register("browser/tty.js", function(module, exports, require){

exports.isatty = function(){
  return true;
};

exports.getWindowSize = function(){
  if ('innerHeight' in global) {
    return [global.innerHeight, global.innerWidth];
  } else {
    // In a Web Worker, the DOM Window is not available.
    return [640, 480];
  }
};

}); // module: browser/tty.js

require.register("context.js", function(module, exports, require){

/**
 * Expose `Context`.
 */

module.exports = Context;

/**
 * Initialize a new `Context`.
 *
 * @api private
 */

function Context(){}

/**
 * Set or get the context `Runnable` to `runnable`.
 *
 * @param {Runnable} runnable
 * @return {Context}
 * @api private
 */

Context.prototype.runnable = function(runnable){
  if (0 == arguments.length) return this._runnable;
  this.test = this._runnable = runnable;
  return this;
};

/**
 * Set test timeout `ms`.
 *
 * @param {Number} ms
 * @return {Context} self
 * @api private
 */

Context.prototype.timeout = function(ms){
  if (arguments.length === 0) return this.runnable().timeout();
  this.runnable().timeout(ms);
  return this;
};

/**
 * Set test timeout `enabled`.
 *
 * @param {Boolean} enabled
 * @return {Context} self
 * @api private
 */

Context.prototype.enableTimeouts = function (enabled) {
  this.runnable().enableTimeouts(enabled);
  return this;
};


/**
 * Set test slowness threshold `ms`.
 *
 * @param {Number} ms
 * @return {Context} self
 * @api private
 */

Context.prototype.slow = function(ms){
  this.runnable().slow(ms);
  return this;
};

/**
 * Inspect the context void of `._runnable`.
 *
 * @return {String}
 * @api private
 */

Context.prototype.inspect = function(){
  return JSON.stringify(this, function(key, val){
    if ('_runnable' == key) return;
    if ('test' == key) return;
    return val;
  }, 2);
};

}); // module: context.js

require.register("hook.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Runnable = require('./runnable');

/**
 * Expose `Hook`.
 */

module.exports = Hook;

/**
 * Initialize a new `Hook` with the given `title` and callback `fn`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api private
 */

function Hook(title, fn) {
  Runnable.call(this, title, fn);
  this.type = 'hook';
}

/**
 * Inherit from `Runnable.prototype`.
 */

function F(){};
F.prototype = Runnable.prototype;
Hook.prototype = new F;
Hook.prototype.constructor = Hook;


/**
 * Get or set the test `err`.
 *
 * @param {Error} err
 * @return {Error}
 * @api public
 */

Hook.prototype.error = function(err){
  if (0 == arguments.length) {
    var err = this._error;
    this._error = null;
    return err;
  }

  this._error = err;
};

}); // module: hook.js

require.register("interfaces/bdd.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test')
  , utils = require('../utils');

/**
 * BDD-style interface:
 *
 *      describe('Array', function(){
 *        describe('#indexOf()', function(){
 *          it('should return -1 when not present', function(){
 *
 *          });
 *
 *          it('should return the index when present', function(){
 *
 *          });
 *        });
 *      });
 *
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context, file, mocha){

    /**
     * Execute before running tests.
     */

    context.before = function(name, fn){
      suites[0].beforeAll(name, fn);
    };

    /**
     * Execute after running tests.
     */

    context.after = function(name, fn){
      suites[0].afterAll(name, fn);
    };

    /**
     * Execute before each test case.
     */

    context.beforeEach = function(name, fn){
      suites[0].beforeEach(name, fn);
    };

    /**
     * Execute after each test case.
     */

    context.afterEach = function(name, fn){
      suites[0].afterEach(name, fn);
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */

    context.describe = context.context = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suite.file = file;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
      return suite;
    };

    /**
     * Pending describe.
     */

    context.xdescribe =
    context.xcontext =
    context.describe.skip = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suite.pending = true;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
    };

    /**
     * Exclusive suite.
     */

    context.describe.only = function(title, fn){
      var suite = context.describe(title, fn);
      mocha.grep(suite.fullTitle());
      return suite;
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.it = context.specify = function(title, fn){
      var suite = suites[0];
      if (suite.pending) var fn = null;
      var test = new Test(title, fn);
      test.file = file;
      suite.addTest(test);
      return test;
    };

    /**
     * Exclusive test-case.
     */

    context.it.only = function(title, fn){
      var test = context.it(title, fn);
      var reString = '^' + utils.escapeRegexp(test.fullTitle()) + '$';
      mocha.grep(new RegExp(reString));
      return test;
    };

    /**
     * Pending test case.
     */

    context.xit =
    context.xspecify =
    context.it.skip = function(title){
      context.it(title);
    };
  });
};

}); // module: interfaces/bdd.js

require.register("interfaces/exports.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test');

/**
 * TDD-style interface:
 *
 *     exports.Array = {
 *       '#indexOf()': {
 *         'should return -1 when the value is not present': function(){
 *
 *         },
 *
 *         'should return the correct index when the value is present': function(){
 *
 *         }
 *       }
 *     };
 *
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('require', visit);

  function visit(obj, file) {
    var suite;
    for (var key in obj) {
      if ('function' == typeof obj[key]) {
        var fn = obj[key];
        switch (key) {
          case 'before':
            suites[0].beforeAll(fn);
            break;
          case 'after':
            suites[0].afterAll(fn);
            break;
          case 'beforeEach':
            suites[0].beforeEach(fn);
            break;
          case 'afterEach':
            suites[0].afterEach(fn);
            break;
          default:
            var test = new Test(key, fn);
            test.file = file;
            suites[0].addTest(test);
        }
      } else {
        var suite = Suite.create(suites[0], key);
        suites.unshift(suite);
        visit(obj[key]);
        suites.shift();
      }
    }
  }
};

}); // module: interfaces/exports.js

require.register("interfaces/index.js", function(module, exports, require){

exports.bdd = require('./bdd');
exports.tdd = require('./tdd');
exports.qunit = require('./qunit');
exports.exports = require('./exports');

}); // module: interfaces/index.js

require.register("interfaces/qunit.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test')
  , utils = require('../utils');

/**
 * QUnit-style interface:
 *
 *     suite('Array');
 *
 *     test('#length', function(){
 *       var arr = [1,2,3];
 *       ok(arr.length == 3);
 *     });
 *
 *     test('#indexOf()', function(){
 *       var arr = [1,2,3];
 *       ok(arr.indexOf(1) == 0);
 *       ok(arr.indexOf(2) == 1);
 *       ok(arr.indexOf(3) == 2);
 *     });
 *
 *     suite('String');
 *
 *     test('#length', function(){
 *       ok('foo'.length == 3);
 *     });
 *
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context, file, mocha){

    /**
     * Execute before running tests.
     */

    context.before = function(name, fn){
      suites[0].beforeAll(name, fn);
    };

    /**
     * Execute after running tests.
     */

    context.after = function(name, fn){
      suites[0].afterAll(name, fn);
    };

    /**
     * Execute before each test case.
     */

    context.beforeEach = function(name, fn){
      suites[0].beforeEach(name, fn);
    };

    /**
     * Execute after each test case.
     */

    context.afterEach = function(name, fn){
      suites[0].afterEach(name, fn);
    };

    /**
     * Describe a "suite" with the given `title`.
     */

    context.suite = function(title){
      if (suites.length > 1) suites.shift();
      var suite = Suite.create(suites[0], title);
      suite.file = file;
      suites.unshift(suite);
      return suite;
    };

    /**
     * Exclusive test-case.
     */

    context.suite.only = function(title, fn){
      var suite = context.suite(title, fn);
      mocha.grep(suite.fullTitle());
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.test = function(title, fn){
      var test = new Test(title, fn);
      test.file = file;
      suites[0].addTest(test);
      return test;
    };

    /**
     * Exclusive test-case.
     */

    context.test.only = function(title, fn){
      var test = context.test(title, fn);
      var reString = '^' + utils.escapeRegexp(test.fullTitle()) + '$';
      mocha.grep(new RegExp(reString));
    };

    /**
     * Pending test case.
     */

    context.test.skip = function(title){
      context.test(title);
    };
  });
};

}); // module: interfaces/qunit.js

require.register("interfaces/tdd.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test')
  , utils = require('../utils');;

/**
 * TDD-style interface:
 *
 *      suite('Array', function(){
 *        suite('#indexOf()', function(){
 *          suiteSetup(function(){
 *
 *          });
 *
 *          test('should return -1 when not present', function(){
 *
 *          });
 *
 *          test('should return the index when present', function(){
 *
 *          });
 *
 *          suiteTeardown(function(){
 *
 *          });
 *        });
 *      });
 *
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context, file, mocha){

    /**
     * Execute before each test case.
     */

    context.setup = function(name, fn){
      suites[0].beforeEach(name, fn);
    };

    /**
     * Execute after each test case.
     */

    context.teardown = function(name, fn){
      suites[0].afterEach(name, fn);
    };

    /**
     * Execute before the suite.
     */

    context.suiteSetup = function(name, fn){
      suites[0].beforeAll(name, fn);
    };

    /**
     * Execute after the suite.
     */

    context.suiteTeardown = function(name, fn){
      suites[0].afterAll(name, fn);
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */

    context.suite = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suite.file = file;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
      return suite;
    };

    /**
     * Pending suite.
     */
    context.suite.skip = function(title, fn) {
      var suite = Suite.create(suites[0], title);
      suite.pending = true;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
    };

    /**
     * Exclusive test-case.
     */

    context.suite.only = function(title, fn){
      var suite = context.suite(title, fn);
      mocha.grep(suite.fullTitle());
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.test = function(title, fn){
      var suite = suites[0];
      if (suite.pending) var fn = null;
      var test = new Test(title, fn);
      test.file = file;
      suite.addTest(test);
      return test;
    };

    /**
     * Exclusive test-case.
     */

    context.test.only = function(title, fn){
      var test = context.test(title, fn);
      var reString = '^' + utils.escapeRegexp(test.fullTitle()) + '$';
      mocha.grep(new RegExp(reString));
    };

    /**
     * Pending test case.
     */

    context.test.skip = function(title){
      context.test(title);
    };
  });
};

}); // module: interfaces/tdd.js

require.register("mocha.js", function(module, exports, require){
/*!
 * mocha
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = require('browser/path')
  , utils = require('./utils');

/**
 * Expose `Mocha`.
 */

exports = module.exports = Mocha;

/**
 * To require local UIs and reporters when running in node.
 */

if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
  var join = path.join
    , cwd = process.cwd();
  module.paths.push(cwd, join(cwd, 'node_modules'));
}

/**
 * Expose internals.
 */

exports.utils = utils;
exports.interfaces = require('./interfaces');
exports.reporters = require('./reporters');
exports.Runnable = require('./runnable');
exports.Context = require('./context');
exports.Runner = require('./runner');
exports.Suite = require('./suite');
exports.Hook = require('./hook');
exports.Test = require('./test');

/**
 * Return image `name` path.
 *
 * @param {String} name
 * @return {String}
 * @api private
 */

function image(name) {
  return __dirname + '/../images/' + name + '.png';
}

/**
 * Setup mocha with `options`.
 *
 * Options:
 *
 *   - `ui` name "bdd", "tdd", "exports" etc
 *   - `reporter` reporter instance, defaults to `mocha.reporters.spec`
 *   - `globals` array of accepted globals
 *   - `timeout` timeout in milliseconds
 *   - `bail` bail on the first test failure
 *   - `slow` milliseconds to wait before considering a test slow
 *   - `ignoreLeaks` ignore global leaks
 *   - `grep` string or regexp to filter tests with
 *
 * @param {Object} options
 * @api public
 */

function Mocha(options) {
  options = options || {};
  this.files = [];
  this.options = options;
  this.grep(options.grep);
  this.suite = new exports.Suite('', new exports.Context);
  this.ui(options.ui);
  this.bail(options.bail);
  this.reporter(options.reporter);
  if (null != options.timeout) this.timeout(options.timeout);
  this.useColors(options.useColors)
  if (options.enableTimeouts !== null) this.enableTimeouts(options.enableTimeouts);
  if (options.slow) this.slow(options.slow);

  this.suite.on('pre-require', function (context) {
    exports.afterEach = context.afterEach || context.teardown;
    exports.after = context.after || context.suiteTeardown;
    exports.beforeEach = context.beforeEach || context.setup;
    exports.before = context.before || context.suiteSetup;
    exports.describe = context.describe || context.suite;
    exports.it = context.it || context.test;
    exports.setup = context.setup || context.beforeEach;
    exports.suiteSetup = context.suiteSetup || context.before;
    exports.suiteTeardown = context.suiteTeardown || context.after;
    exports.suite = context.suite || context.describe;
    exports.teardown = context.teardown || context.afterEach;
    exports.test = context.test || context.it;
  });
}

/**
 * Enable or disable bailing on the first failure.
 *
 * @param {Boolean} [bail]
 * @api public
 */

Mocha.prototype.bail = function(bail){
  if (0 == arguments.length) bail = true;
  this.suite.bail(bail);
  return this;
};

/**
 * Add test `file`.
 *
 * @param {String} file
 * @api public
 */

Mocha.prototype.addFile = function(file){
  this.files.push(file);
  return this;
};

/**
 * Set reporter to `reporter`, defaults to "spec".
 *
 * @param {String|Function} reporter name or constructor
 * @api public
 */

Mocha.prototype.reporter = function(reporter){
  if ('function' == typeof reporter) {
    this._reporter = reporter;
  } else {
    reporter = reporter || 'spec';
    var _reporter;
    try { _reporter = require('./reporters/' + reporter); } catch (err) {};
    if (!_reporter) try { _reporter = require(reporter); } catch (err) {};
    if (!_reporter && reporter === 'teamcity')
      console.warn('The Teamcity reporter was moved to a package named ' +
        'mocha-teamcity-reporter ' +
        '(https://npmjs.org/package/mocha-teamcity-reporter).');
    if (!_reporter) throw new Error('invalid reporter "' + reporter + '"');
    this._reporter = _reporter;
  }
  return this;
};

/**
 * Set test UI `name`, defaults to "bdd".
 *
 * @param {String} bdd
 * @api public
 */

Mocha.prototype.ui = function(name){
  name = name || 'bdd';
  this._ui = exports.interfaces[name];
  if (!this._ui) try { this._ui = require(name); } catch (err) {};
  if (!this._ui) throw new Error('invalid interface "' + name + '"');
  this._ui = this._ui(this.suite);
  return this;
};

/**
 * Load registered files.
 *
 * @api private
 */

Mocha.prototype.loadFiles = function(fn){
  var self = this;
  var suite = this.suite;
  var pending = this.files.length;
  this.files.forEach(function(file){
    file = path.resolve(file);
    suite.emit('pre-require', global, file, self);
    suite.emit('require', require(file), file, self);
    suite.emit('post-require', global, file, self);
    --pending || (fn && fn());
  });
};

/**
 * Enable growl support.
 *
 * @api private
 */

Mocha.prototype._growl = function(runner, reporter) {
  var notify = require('growl');

  runner.on('end', function(){
    var stats = reporter.stats;
    if (stats.failures) {
      var msg = stats.failures + ' of ' + runner.total + ' tests failed';
      notify(msg, { name: 'mocha', title: 'Failed', image: image('error') });
    } else {
      notify(stats.passes + ' tests passed in ' + stats.duration + 'ms', {
          name: 'mocha'
        , title: 'Passed'
        , image: image('ok')
      });
    }
  });
};

/**
 * Add regexp to grep, if `re` is a string it is escaped.
 *
 * @param {RegExp|String} re
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.grep = function(re){
  this.options.grep = 'string' == typeof re
    ? new RegExp(utils.escapeRegexp(re))
    : re;
  return this;
};

/**
 * Invert `.grep()` matches.
 *
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.invert = function(){
  this.options.invert = true;
  return this;
};

/**
 * Ignore global leaks.
 *
 * @param {Boolean} ignore
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.ignoreLeaks = function(ignore){
  this.options.ignoreLeaks = !!ignore;
  return this;
};

/**
 * Enable global leak checking.
 *
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.checkLeaks = function(){
  this.options.ignoreLeaks = false;
  return this;
};

/**
 * Enable growl support.
 *
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.growl = function(){
  this.options.growl = true;
  return this;
};

/**
 * Ignore `globals` array or string.
 *
 * @param {Array|String} globals
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.globals = function(globals){
  this.options.globals = (this.options.globals || []).concat(globals);
  return this;
};

/**
 * Emit color output.
 *
 * @param {Boolean} colors
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.useColors = function(colors){
  this.options.useColors = arguments.length && colors != undefined
    ? colors
    : true;
  return this;
};

/**
 * Use inline diffs rather than +/-.
 *
 * @param {Boolean} inlineDiffs
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.useInlineDiffs = function(inlineDiffs) {
  this.options.useInlineDiffs = arguments.length && inlineDiffs != undefined
  ? inlineDiffs
  : false;
  return this;
};

/**
 * Set the timeout in milliseconds.
 *
 * @param {Number} timeout
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.timeout = function(timeout){
  this.suite.timeout(timeout);
  return this;
};

/**
 * Set slowness threshold in milliseconds.
 *
 * @param {Number} slow
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.slow = function(slow){
  this.suite.slow(slow);
  return this;
};

/**
 * Enable timeouts.
 *
 * @param {Boolean} enabled
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.enableTimeouts = function(enabled) {
  this.suite.enableTimeouts(arguments.length && enabled !== undefined
    ? enabled
    : true);
  return this
};

/**
 * Makes all tests async (accepting a callback)
 *
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.asyncOnly = function(){
  this.options.asyncOnly = true;
  return this;
};

/**
 * Run tests and invoke `fn()` when complete.
 *
 * @param {Function} fn
 * @return {Runner}
 * @api public
 */

Mocha.prototype.run = function(fn){
  if (this.files.length) this.loadFiles();
  var suite = this.suite;
  var options = this.options;
  options.files = this.files;
  var runner = new exports.Runner(suite);
  var reporter = new this._reporter(runner, options);
  runner.ignoreLeaks = false !== options.ignoreLeaks;
  runner.asyncOnly = options.asyncOnly;
  if (options.grep) runner.grep(options.grep, options.invert);
  if (options.globals) runner.globals(options.globals);
  if (options.growl) this._growl(runner, reporter);
  exports.reporters.Base.useColors = options.useColors;
  exports.reporters.Base.inlineDiffs = options.useInlineDiffs;
  return runner.run(fn);
};

}); // module: mocha.js

require.register("ms.js", function(module, exports, require){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long ? longFormat(val) : shortFormat(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 's':
      return n * s;
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function shortFormat(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function longFormat(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

}); // module: ms.js

require.register("reporters/base.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var tty = require('browser/tty')
  , diff = require('browser/diff')
  , ms = require('../ms')
  , utils = require('../utils');

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date
  , setTimeout = global.setTimeout
  , setInterval = global.setInterval
  , clearTimeout = global.clearTimeout
  , clearInterval = global.clearInterval;

/**
 * Check if both stdio streams are associated with a tty.
 */

var isatty = tty.isatty(1) && tty.isatty(2);

/**
 * Expose `Base`.
 */

exports = module.exports = Base;

/**
 * Enable coloring by default.
 */

exports.useColors = isatty || (process.env.MOCHA_COLORS !== undefined);

/**
 * Inline diffs instead of +/-
 */

exports.inlineDiffs = false;

/**
 * Default color map.
 */

exports.colors = {
    'pass': 90
  , 'fail': 31
  , 'bright pass': 92
  , 'bright fail': 91
  , 'bright yellow': 93
  , 'pending': 36
  , 'suite': 0
  , 'error title': 0
  , 'error message': 31
  , 'error stack': 90
  , 'checkmark': 32
  , 'fast': 90
  , 'medium': 33
  , 'slow': 31
  , 'green': 32
  , 'light': 90
  , 'diff gutter': 90
  , 'diff added': 42
  , 'diff removed': 41
};

/**
 * Default symbol map.
 */

exports.symbols = {
  ok: '✓',
  err: '✖',
  dot: '․'
};

// With node.js on Windows: use symbols available in terminal default fonts
if ('win32' == process.platform) {
  exports.symbols.ok = '\u221A';
  exports.symbols.err = '\u00D7';
  exports.symbols.dot = '.';
}

/**
 * Color `str` with the given `type`,
 * allowing colors to be disabled,
 * as well as user-defined color
 * schemes.
 *
 * @param {String} type
 * @param {String} str
 * @return {String}
 * @api private
 */

var color = exports.color = function(type, str) {
  if (!exports.useColors) return str;
  return '\u001b[' + exports.colors[type] + 'm' + str + '\u001b[0m';
};

/**
 * Expose term window size, with some
 * defaults for when stderr is not a tty.
 */

exports.window = {
  width: isatty
    ? process.stdout.getWindowSize
      ? process.stdout.getWindowSize(1)[0]
      : tty.getWindowSize()[1]
    : 75
};

/**
 * Expose some basic cursor interactions
 * that are common among reporters.
 */

exports.cursor = {
  hide: function(){
    isatty && process.stdout.write('\u001b[?25l');
  },

  show: function(){
    isatty && process.stdout.write('\u001b[?25h');
  },

  deleteLine: function(){
    isatty && process.stdout.write('\u001b[2K');
  },

  beginningOfLine: function(){
    isatty && process.stdout.write('\u001b[0G');
  },

  CR: function(){
    if (isatty) {
      exports.cursor.deleteLine();
      exports.cursor.beginningOfLine();
    } else {
      process.stdout.write('\r');
    }
  }
};

/**
 * Outut the given `failures` as a list.
 *
 * @param {Array} failures
 * @api public
 */

exports.list = function(failures){
  console.error();
  failures.forEach(function(test, i){
    // format
    var fmt = color('error title', '  %s) %s:\n')
      + color('error message', '     %s')
      + color('error stack', '\n%s\n');

    // msg
    var err = test.err
      , message = err.message || ''
      , stack = err.stack || message
      , index = stack.indexOf(message) + message.length
      , msg = stack.slice(0, index)
      , actual = err.actual
      , expected = err.expected
      , escape = true;

    // uncaught
    if (err.uncaught) {
      msg = 'Uncaught ' + msg;
    }

    // explicitly show diff
    if (err.showDiff && sameType(actual, expected)) {
      escape = false;
      err.actual = actual = utils.stringify(actual);
      err.expected = expected = utils.stringify(expected);
    }

    // actual / expected diff
    if ('string' == typeof actual && 'string' == typeof expected) {
      fmt = color('error title', '  %s) %s:\n%s') + color('error stack', '\n%s\n');
      var match = message.match(/^([^:]+): expected/);
      msg = '\n      ' + color('error message', match ? match[1] : msg);

      if (exports.inlineDiffs) {
        msg += inlineDiff(err, escape);
      } else {
        msg += unifiedDiff(err, escape);
      }
    }

    // indent stack trace without msg
    stack = stack.slice(index ? index + 1 : index)
      .replace(/^/gm, '  ');

    console.error(fmt, (i + 1), test.fullTitle(), msg, stack);
  });
};

/**
 * Initialize a new `Base` reporter.
 *
 * All other reporters generally
 * inherit from this reporter, providing
 * stats such as test duration, number
 * of tests passed / failed etc.
 *
 * @param {Runner} runner
 * @api public
 */

function Base(runner) {
  var self = this
    , stats = this.stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 }
    , failures = this.failures = [];

  if (!runner) return;
  this.runner = runner;

  runner.stats = stats;

  runner.on('start', function(){
    stats.start = new Date;
  });

  runner.on('suite', function(suite){
    stats.suites = stats.suites || 0;
    suite.root || stats.suites++;
  });

  runner.on('test end', function(test){
    stats.tests = stats.tests || 0;
    stats.tests++;
  });

  runner.on('pass', function(test){
    stats.passes = stats.passes || 0;

    var medium = test.slow() / 2;
    test.speed = test.duration > test.slow()
      ? 'slow'
      : test.duration > medium
        ? 'medium'
        : 'fast';

    stats.passes++;
  });

  runner.on('fail', function(test, err){
    stats.failures = stats.failures || 0;
    stats.failures++;
    test.err = err;
    failures.push(test);
  });

  runner.on('end', function(){
    stats.end = new Date;
    stats.duration = new Date - stats.start;
  });

  runner.on('pending', function(){
    stats.pending++;
  });
}

/**
 * Output common epilogue used by many of
 * the bundled reporters.
 *
 * @api public
 */

Base.prototype.epilogue = function(){
  var stats = this.stats;
  var tests;
  var fmt;

  console.log();

  // passes
  fmt = color('bright pass', ' ')
    + color('green', ' %d passing')
    + color('light', ' (%s)');

  console.log(fmt,
    stats.passes || 0,
    ms(stats.duration));

  // pending
  if (stats.pending) {
    fmt = color('pending', ' ')
      + color('pending', ' %d pending');

    console.log(fmt, stats.pending);
  }

  // failures
  if (stats.failures) {
    fmt = color('fail', '  %d failing');

    console.error(fmt,
      stats.failures);

    Base.list(this.failures);
    console.error();
  }

  console.log();
};

/**
 * Pad the given `str` to `len`.
 *
 * @param {String} str
 * @param {String} len
 * @return {String}
 * @api private
 */

function pad(str, len) {
  str = String(str);
  return Array(len - str.length + 1).join(' ') + str;
}


/**
 * Returns an inline diff between 2 strings with coloured ANSI output
 *
 * @param {Error} Error with actual/expected
 * @return {String} Diff
 * @api private
 */

function inlineDiff(err, escape) {
  var msg = errorDiff(err, 'WordsWithSpace', escape);

  // linenos
  var lines = msg.split('\n');
  if (lines.length > 4) {
    var width = String(lines.length).length;
    msg = lines.map(function(str, i){
      return pad(++i, width) + ' |' + ' ' + str;
    }).join('\n');
  }

  // legend
  msg = '\n'
    + color('diff removed', 'actual')
    + ' '
    + color('diff added', 'expected')
    + '\n\n'
    + msg
    + '\n';

  // indent
  msg = msg.replace(/^/gm, '      ');
  return msg;
}

/**
 * Returns a unified diff between 2 strings
 *
 * @param {Error} Error with actual/expected
 * @return {String} Diff
 * @api private
 */

function unifiedDiff(err, escape) {
  var indent = '      ';
  function cleanUp(line) {
    if (escape) {
      line = escapeInvisibles(line);
    }
    if (line[0] === '+') return indent + colorLines('diff added', line);
    if (line[0] === '-') return indent + colorLines('diff removed', line);
    if (line.match(/\@\@/)) return null;
    if (line.match(/\\ No newline/)) return null;
    else return indent + line;
  }
  function notBlank(line) {
    return line != null;
  }
  msg = diff.createPatch('string', err.actual, err.expected);
  var lines = msg.split('\n').splice(4);
  return '\n      '
         + colorLines('diff added',   '+ expected') + ' '
         + colorLines('diff removed', '- actual')
         + '\n\n'
         + lines.map(cleanUp).filter(notBlank).join('\n');
}

/**
 * Return a character diff for `err`.
 *
 * @param {Error} err
 * @return {String}
 * @api private
 */

function errorDiff(err, type, escape) {
  var actual   = escape ? escapeInvisibles(err.actual)   : err.actual;
  var expected = escape ? escapeInvisibles(err.expected) : err.expected;
  return diff['diff' + type](actual, expected).map(function(str){
    if (str.added) return colorLines('diff added', str.value);
    if (str.removed) return colorLines('diff removed', str.value);
    return str.value;
  }).join('');
}

/**
 * Returns a string with all invisible characters in plain text
 *
 * @param {String} line
 * @return {String}
 * @api private
 */
function escapeInvisibles(line) {
    return line.replace(/\t/g, '<tab>')
               .replace(/\r/g, '<CR>')
               .replace(/\n/g, '<LF>\n');
}

/**
 * Color lines for `str`, using the color `name`.
 *
 * @param {String} name
 * @param {String} str
 * @return {String}
 * @api private
 */

function colorLines(name, str) {
  return str.split('\n').map(function(str){
    return color(name, str);
  }).join('\n');
}

/**
 * Check that a / b have the same type.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Boolean}
 * @api private
 */

function sameType(a, b) {
  a = Object.prototype.toString.call(a);
  b = Object.prototype.toString.call(b);
  return a == b;
}

}); // module: reporters/base.js

require.register("reporters/doc.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils');

/**
 * Expose `Doc`.
 */

exports = module.exports = Doc;

/**
 * Initialize a new `Doc` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Doc(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , indents = 2;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on('suite', function(suite){
    if (suite.root) return;
    ++indents;
    console.log('%s<section class="suite">', indent());
    ++indents;
    console.log('%s<h1>%s</h1>', indent(), utils.escape(suite.title));
    console.log('%s<dl>', indent());
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    console.log('%s</dl>', indent());
    --indents;
    console.log('%s</section>', indent());
    --indents;
  });

  runner.on('pass', function(test){
    console.log('%s  <dt>%s</dt>', indent(), utils.escape(test.title));
    var code = utils.escape(utils.clean(test.fn.toString()));
    console.log('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);
  });

  runner.on('fail', function(test, err){
    console.log('%s  <dt class="error">%s</dt>', indent(), utils.escape(test.title));
    var code = utils.escape(utils.clean(test.fn.toString()));
    console.log('%s  <dd class="error"><pre><code>%s</code></pre></dd>', indent(), code);
    console.log('%s  <dd class="error">%s</dd>', indent(), utils.escape(err));
  });
}

}); // module: reporters/doc.js

require.register("reporters/dot.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color;

/**
 * Expose `Dot`.
 */

exports = module.exports = Dot;

/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Dot(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , width = Base.window.width * .75 | 0
    , n = -1;

  runner.on('start', function(){
    process.stdout.write('\n  ');
  });

  runner.on('pending', function(test){
    if (++n % width == 0) process.stdout.write('\n  ');
    process.stdout.write(color('pending', Base.symbols.dot));
  });

  runner.on('pass', function(test){
    if (++n % width == 0) process.stdout.write('\n  ');
    if ('slow' == test.speed) {
      process.stdout.write(color('bright yellow', Base.symbols.dot));
    } else {
      process.stdout.write(color(test.speed, Base.symbols.dot));
    }
  });

  runner.on('fail', function(test, err){
    if (++n % width == 0) process.stdout.write('\n  ');
    process.stdout.write(color('fail', Base.symbols.dot));
  });

  runner.on('end', function(){
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

function F(){};
F.prototype = Base.prototype;
Dot.prototype = new F;
Dot.prototype.constructor = Dot;


}); // module: reporters/dot.js

require.register("reporters/html-cov.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var JSONCov = require('./json-cov')
  , fs = require('browser/fs');

/**
 * Expose `HTMLCov`.
 */

exports = module.exports = HTMLCov;

/**
 * Initialize a new `JsCoverage` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function HTMLCov(runner) {
  var jade = require('jade')
    , file = __dirname + '/templates/coverage.jade'
    , str = fs.readFileSync(file, 'utf8')
    , fn = jade.compile(str, { filename: file })
    , self = this;

  JSONCov.call(this, runner, false);

  runner.on('end', function(){
    process.stdout.write(fn({
        cov: self.cov
      , coverageClass: coverageClass
    }));
  });
}

/**
 * Return coverage class for `n`.
 *
 * @return {String}
 * @api private
 */

function coverageClass(n) {
  if (n >= 75) return 'high';
  if (n >= 50) return 'medium';
  if (n >= 25) return 'low';
  return 'terrible';
}
}); // module: reporters/html-cov.js

require.register("reporters/html.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils')
  , Progress = require('../browser/progress')
  , escape = utils.escape;

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date
  , setTimeout = global.setTimeout
  , setInterval = global.setInterval
  , clearTimeout = global.clearTimeout
  , clearInterval = global.clearInterval;

/**
 * Expose `HTML`.
 */

exports = module.exports = HTML;

/**
 * Stats template.
 */

var statsTemplate = '<ul id="mocha-stats">'
  + '<li class="progress"><canvas width="40" height="40"></canvas></li>'
  + '<li class="passes"><a href="#">passes:</a> <em>0</em></li>'
  + '<li class="failures"><a href="#">failures:</a> <em>0</em></li>'
  + '<li class="duration">duration: <em>0</em>s</li>'
  + '</ul>';

/**
 * Initialize a new `HTML` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function HTML(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , stat = fragment(statsTemplate)
    , items = stat.getElementsByTagName('li')
    , passes = items[1].getElementsByTagName('em')[0]
    , passesLink = items[1].getElementsByTagName('a')[0]
    , failures = items[2].getElementsByTagName('em')[0]
    , failuresLink = items[2].getElementsByTagName('a')[0]
    , duration = items[3].getElementsByTagName('em')[0]
    , canvas = stat.getElementsByTagName('canvas')[0]
    , report = fragment('<ul id="mocha-report"></ul>')
    , stack = [report]
    , progress
    , ctx
    , root = document.getElementById('mocha');

  if (canvas.getContext) {
    var ratio = window.devicePixelRatio || 1;
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
    canvas.width *= ratio;
    canvas.height *= ratio;
    ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    progress = new Progress;
  }

  if (!root) return error('#mocha div missing, add it to your document');

  // pass toggle
  on(passesLink, 'click', function(){
    unhide();
    var name = /pass/.test(report.className) ? '' : ' pass';
    report.className = report.className.replace(/fail|pass/g, '') + name;
    if (report.className.trim()) hideSuitesWithout('test pass');
  });

  // failure toggle
  on(failuresLink, 'click', function(){
    unhide();
    var name = /fail/.test(report.className) ? '' : ' fail';
    report.className = report.className.replace(/fail|pass/g, '') + name;
    if (report.className.trim()) hideSuitesWithout('test fail');
  });

  root.appendChild(stat);
  root.appendChild(report);

  if (progress) progress.size(40);

  runner.on('suite', function(suite){
    if (suite.root) return;

    // suite
    var url = self.suiteURL(suite);
    var el = fragment('<li class="suite"><h1><a href="%s">%s</a></h1></li>', url, escape(suite.title));

    // container
    stack[0].appendChild(el);
    stack.unshift(document.createElement('ul'));
    el.appendChild(stack[0]);
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    stack.shift();
  });

  runner.on('fail', function(test, err){
    if ('hook' == test.type) runner.emit('test end', test);
  });

  runner.on('test end', function(test){
    // TODO: add to stats
    var percent = stats.tests / this.total * 100 | 0;
    if (progress) progress.update(percent).draw(ctx);

    // update stats
    var ms = new Date - stats.start;
    text(passes, stats.passes);
    text(failures, stats.failures);
    text(duration, (ms / 1000).toFixed(2));

    // test
    if ('passed' == test.state) {
      var url = self.testURL(test);
      var el = fragment('<li class="test pass %e"><h2>%e<span class="duration">%ems</span> <a href="%s" class="replay">‣</a></h2></li>', test.speed, test.title, test.duration, url);
    } else if (test.pending) {
      var el = fragment('<li class="test pass pending"><h2>%e</h2></li>', test.title);
    } else {
      var el = fragment('<li class="test fail"><h2>%e <a href="?grep=%e" class="replay">‣</a></h2></li>', test.title, encodeURIComponent(test.fullTitle()));
      var str = test.err.stack || test.err.toString();

      // FF / Opera do not add the message
      if (!~str.indexOf(test.err.message)) {
        str = test.err.message + '\n' + str;
      }

      // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
      // check for the result of the stringifying.
      if ('[object Error]' == str) str = test.err.message;

      // Safari doesn't give you a stack. Let's at least provide a source line.
      if (!test.err.stack && test.err.sourceURL && test.err.line !== undefined) {
        str += "\n(" + test.err.sourceURL + ":" + test.err.line + ")";
      }

      el.appendChild(fragment('<pre class="error">%e</pre>', str));
    }

    // toggle code
    // TODO: defer
    if (!test.pending) {
      var h2 = el.getElementsByTagName('h2')[0];

      on(h2, 'click', function(){
        pre.style.display = 'none' == pre.style.display
          ? 'block'
          : 'none';
      });

      var pre = fragment('<pre><code>%e</code></pre>', utils.clean(test.fn.toString()));
      el.appendChild(pre);
      pre.style.display = 'none';
    }

    // Don't call .appendChild if #mocha-report was already .shift()'ed off the stack.
    if (stack[0]) stack[0].appendChild(el);
  });
}

/**
 * Provide suite URL
 *
 * @param {Object} [suite]
 */

HTML.prototype.suiteURL = function(suite){
  return '?grep=' + encodeURIComponent(suite.fullTitle());
};

/**
 * Provide test URL
 *
 * @param {Object} [test]
 */

HTML.prototype.testURL = function(test){
  return '?grep=' + encodeURIComponent(test.fullTitle());
};

/**
 * Display error `msg`.
 */

function error(msg) {
  document.body.appendChild(fragment('<div id="mocha-error">%s</div>', msg));
}

/**
 * Return a DOM fragment from `html`.
 */

function fragment(html) {
  var args = arguments
    , div = document.createElement('div')
    , i = 1;

  div.innerHTML = html.replace(/%([se])/g, function(_, type){
    switch (type) {
      case 's': return String(args[i++]);
      case 'e': return escape(args[i++]);
    }
  });

  return div.firstChild;
}

/**
 * Check for suites that do not have elements
 * with `classname`, and hide them.
 */

function hideSuitesWithout(classname) {
  var suites = document.getElementsByClassName('suite');
  for (var i = 0; i < suites.length; i++) {
    var els = suites[i].getElementsByClassName(classname);
    if (0 == els.length) suites[i].className += ' hidden';
  }
}

/**
 * Unhide .hidden suites.
 */

function unhide() {
  var els = document.getElementsByClassName('suite hidden');
  for (var i = 0; i < els.length; ++i) {
    els[i].className = els[i].className.replace('suite hidden', 'suite');
  }
}

/**
 * Set `el` text to `str`.
 */

function text(el, str) {
  if (el.textContent) {
    el.textContent = str;
  } else {
    el.innerText = str;
  }
}

/**
 * Listen on `event` with callback `fn`.
 */

function on(el, event, fn) {
  if (el.addEventListener) {
    el.addEventListener(event, fn, false);
  } else {
    el.attachEvent('on' + event, fn);
  }
}

}); // module: reporters/html.js

require.register("reporters/index.js", function(module, exports, require){

exports.Base = require('./base');
exports.Dot = require('./dot');
exports.Doc = require('./doc');
exports.TAP = require('./tap');
exports.JSON = require('./json');
exports.HTML = require('./html');
exports.List = require('./list');
exports.Min = require('./min');
exports.Spec = require('./spec');
exports.Nyan = require('./nyan');
exports.XUnit = require('./xunit');
exports.Markdown = require('./markdown');
exports.Progress = require('./progress');
exports.Landing = require('./landing');
exports.JSONCov = require('./json-cov');
exports.HTMLCov = require('./html-cov');
exports.JSONStream = require('./json-stream');

}); // module: reporters/index.js

require.register("reporters/json-cov.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `JSONCov`.
 */

exports = module.exports = JSONCov;

/**
 * Initialize a new `JsCoverage` reporter.
 *
 * @param {Runner} runner
 * @param {Boolean} output
 * @api public
 */

function JSONCov(runner, output) {
  var self = this
    , output = 1 == arguments.length ? true : output;

  Base.call(this, runner);

  var tests = []
    , failures = []
    , passes = [];

  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    passes.push(test);
  });

  runner.on('fail', function(test){
    failures.push(test);
  });

  runner.on('end', function(){
    var cov = global._$jscoverage || {};
    var result = self.cov = map(cov);
    result.stats = self.stats;
    result.tests = tests.map(clean);
    result.failures = failures.map(clean);
    result.passes = passes.map(clean);
    if (!output) return;
    process.stdout.write(JSON.stringify(result, null, 2 ));
  });
}

/**
 * Map jscoverage data to a JSON structure
 * suitable for reporting.
 *
 * @param {Object} cov
 * @return {Object}
 * @api private
 */

function map(cov) {
  var ret = {
      instrumentation: 'node-jscoverage'
    , sloc: 0
    , hits: 0
    , misses: 0
    , coverage: 0
    , files: []
  };

  for (var filename in cov) {
    var data = coverage(filename, cov[filename]);
    ret.files.push(data);
    ret.hits += data.hits;
    ret.misses += data.misses;
    ret.sloc += data.sloc;
  }

  ret.files.sort(function(a, b) {
    return a.filename.localeCompare(b.filename);
  });

  if (ret.sloc > 0) {
    ret.coverage = (ret.hits / ret.sloc) * 100;
  }

  return ret;
};

/**
 * Map jscoverage data for a single source file
 * to a JSON structure suitable for reporting.
 *
 * @param {String} filename name of the source file
 * @param {Object} data jscoverage coverage data
 * @return {Object}
 * @api private
 */

function coverage(filename, data) {
  var ret = {
    filename: filename,
    coverage: 0,
    hits: 0,
    misses: 0,
    sloc: 0,
    source: {}
  };

  data.source.forEach(function(line, num){
    num++;

    if (data[num] === 0) {
      ret.misses++;
      ret.sloc++;
    } else if (data[num] !== undefined) {
      ret.hits++;
      ret.sloc++;
    }

    ret.source[num] = {
        source: line
      , coverage: data[num] === undefined
        ? ''
        : data[num]
    };
  });

  ret.coverage = ret.hits / ret.sloc * 100;

  return ret;
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
  return {
      title: test.title
    , fullTitle: test.fullTitle()
    , duration: test.duration
  }
}

}); // module: reporters/json-cov.js

require.register("reporters/json-stream.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color;

/**
 * Expose `List`.
 */

exports = module.exports = List;

/**
 * Initialize a new `List` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function List(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total;

  runner.on('start', function(){
    console.log(JSON.stringify(['start', { total: total }]));
  });

  runner.on('pass', function(test){
    console.log(JSON.stringify(['pass', clean(test)]));
  });

  runner.on('fail', function(test, err){
    console.log(JSON.stringify(['fail', clean(test)]));
  });

  runner.on('end', function(){
    process.stdout.write(JSON.stringify(['end', self.stats]));
  });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
  return {
      title: test.title
    , fullTitle: test.fullTitle()
    , duration: test.duration
  }
}
}); // module: reporters/json-stream.js

require.register("reporters/json.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `JSON`.
 */

exports = module.exports = JSONReporter;

/**
 * Initialize a new `JSON` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function JSONReporter(runner) {
  var self = this;
  Base.call(this, runner);

  var tests = []
    , failures = []
    , passes = [];

  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    passes.push(test);
  });

  runner.on('fail', function(test, err){
    failures.push(test);
    if (err === Object(err)) {
      test.errMsg = err.message;
      test.errStack = err.stack;
    }
  });

  runner.on('end', function(){
    var obj = {
      stats: self.stats,
      tests: tests.map(clean),
      failures: failures.map(clean),
      passes: passes.map(clean)
    };
    runner.testResults = obj;

    process.stdout.write(JSON.stringify(obj, null, 2));
  });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    err: test.err,
    errStack: test.err.stack,
    errMessage: test.err.message
  }
}

}); // module: reporters/json.js

require.register("reporters/landing.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `Landing`.
 */

exports = module.exports = Landing;

/**
 * Airplane color.
 */

Base.colors.plane = 0;

/**
 * Airplane crash color.
 */

Base.colors['plane crash'] = 31;

/**
 * Runway color.
 */

Base.colors.runway = 90;

/**
 * Initialize a new `Landing` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Landing(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , width = Base.window.width * .75 | 0
    , total = runner.total
    , stream = process.stdout
    , plane = color('plane', '✈')
    , crashed = -1
    , n = 0;

  function runway() {
    var buf = Array(width).join('-');
    return '  ' + color('runway', buf);
  }

  runner.on('start', function(){
    stream.write('\n  ');
    cursor.hide();
  });

  runner.on('test end', function(test){
    // check if the plane crashed
    var col = -1 == crashed
      ? width * ++n / total | 0
      : crashed;

    // show the crash
    if ('failed' == test.state) {
      plane = color('plane crash', '✈');
      crashed = col;
    }

    // render landing strip
    stream.write('\u001b[4F\n\n');
    stream.write(runway());
    stream.write('\n  ');
    stream.write(color('runway', Array(col).join('⋅')));
    stream.write(plane)
    stream.write(color('runway', Array(width - col).join('⋅') + '\n'));
    stream.write(runway());
    stream.write('\u001b[0m');
  });

  runner.on('end', function(){
    cursor.show();
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

function F(){};
F.prototype = Base.prototype;
Landing.prototype = new F;
Landing.prototype.constructor = Landing;

}); // module: reporters/landing.js

require.register("reporters/list.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `List`.
 */

exports = module.exports = List;

/**
 * Initialize a new `List` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function List(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , n = 0;

  runner.on('start', function(){
    console.log();
  });

  runner.on('test', function(test){
    process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));
  });

  runner.on('pending', function(test){
    var fmt = color('checkmark', '  -')
      + color('pending', ' %s');
    console.log(fmt, test.fullTitle());
  });

  runner.on('pass', function(test){
    var fmt = color('checkmark', '  '+Base.symbols.dot)
      + color('pass', ' %s: ')
      + color(test.speed, '%dms');
    cursor.CR();
    console.log(fmt, test.fullTitle(), test.duration);
  });

  runner.on('fail', function(test, err){
    cursor.CR();
    console.log(color('fail', '  %d) %s'), ++n, test.fullTitle());
  });

  runner.on('end', self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */

function F(){};
F.prototype = Base.prototype;
List.prototype = new F;
List.prototype.constructor = List;


}); // module: reporters/list.js

require.register("reporters/markdown.js", function(module, exports, require){
/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils');

/**
 * Expose `Markdown`.
 */

exports = module.exports = Markdown;

/**
 * Initialize a new `Markdown` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Markdown(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , level = 0
    , buf = '';

  function title(str) {
    return Array(level).join('#') + ' ' + str;
  }

  function indent() {
    return Array(level).join('  ');
  }

  function mapTOC(suite, obj) {
    var ret = obj;
    obj = obj[suite.title] = obj[suite.title] || { suite: suite };
    suite.suites.forEach(function(suite){
      mapTOC(suite, obj);
    });
    return ret;
  }

  function stringifyTOC(obj, level) {
    ++level;
    var buf = '';
    var link;
    for (var key in obj) {
      if ('suite' == key) continue;
      if (key) link = ' - [' + key + '](#' + utils.slug(obj[key].suite.fullTitle()) + ')\n';
      if (key) buf += Array(level).join('  ') + link;
      buf += stringifyTOC(obj[key], level);
    }
    --level;
    return buf;
  }

  function generateTOC(suite) {
    var obj = mapTOC(suite, {});
    return stringifyTOC(obj, 0);
  }

  generateTOC(runner.suite);

  runner.on('suite', function(suite){
    ++level;
    var slug = utils.slug(suite.fullTitle());
    buf += '<a name="' + slug + '"></a>' + '\n';
    buf += title(suite.title) + '\n';
  });

  runner.on('suite end', function(suite){
    --level;
  });

  runner.on('pass', function(test){
    var code = utils.clean(test.fn.toString());
    buf += test.title + '.\n';
    buf += '\n```js\n';
    buf += code + '\n';
    buf += '```\n\n';
  });

  runner.on('end', function(){
    process.stdout.write('# TOC\n');
    process.stdout.write(generateTOC(runner.suite));
    process.stdout.write(buf);
  });
}
}); // module: reporters/markdown.js

require.register("reporters/min.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `Min`.
 */

exports = module.exports = Min;

/**
 * Initialize a new `Min` minimal test reporter (best used with --watch).
 *
 * @param {Runner} runner
 * @api public
 */

function Min(runner) {
  Base.call(this, runner);

  runner.on('start', function(){
    // clear screen
    process.stdout.write('\u001b[2J');
    // set cursor position
    process.stdout.write('\u001b[1;3H');
  });

  runner.on('end', this.epilogue.bind(this));
}

/**
 * Inherit from `Base.prototype`.
 */

function F(){};
F.prototype = Base.prototype;
Min.prototype = new F;
Min.prototype.constructor = Min;


}); // module: reporters/min.js

require.register("reporters/nyan.js", function(module, exports, require){
/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color;

/**
 * Expose `Dot`.
 */

exports = module.exports = NyanCat;

/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function NyanCat(runner) {
  Base.call(this, runner);
  var self = this
    , stats = this.stats
    , width = Base.window.width * .75 | 0
    , rainbowColors = this.rainbowColors = self.generateColors()
    , colorIndex = this.colorIndex = 0
    , numerOfLines = this.numberOfLines = 4
    , trajectories = this.trajectories = [[], [], [], []]
    , nyanCatWidth = this.nyanCatWidth = 11
    , trajectoryWidthMax = this.trajectoryWidthMax = (width - nyanCatWidth)
    , scoreboardWidth = this.scoreboardWidth = 5
    , tick = this.tick = 0
    , n = 0;

  runner.on('start', function(){
    Base.cursor.hide();
    self.draw();
  });

  runner.on('pending', function(test){
    self.draw();
  });

  runner.on('pass', function(test){
    self.draw();
  });

  runner.on('fail', function(test, err){
    self.draw();
  });

  runner.on('end', function(){
    Base.cursor.show();
    for (var i = 0; i < self.numberOfLines; i++) write('\n');
    self.epilogue();
  });
}

/**
 * Draw the nyan cat
 *
 * @api private
 */

NyanCat.prototype.draw = function(){
  this.appendRainbow();
  this.drawScoreboard();
  this.drawRainbow();
  this.drawNyanCat();
  this.tick = !this.tick;
};

/**
 * Draw the "scoreboard" showing the number
 * of passes, failures and pending tests.
 *
 * @api private
 */

NyanCat.prototype.drawScoreboard = function(){
  var stats = this.stats;
  var colors = Base.colors;

  function draw(color, n) {
    write(' ');
    write('\u001b[' + color + 'm' + n + '\u001b[0m');
    write('\n');
  }

  draw(colors.green, stats.passes);
  draw(colors.fail, stats.failures);
  draw(colors.pending, stats.pending);
  write('\n');

  this.cursorUp(this.numberOfLines);
};

/**
 * Append the rainbow.
 *
 * @api private
 */

NyanCat.prototype.appendRainbow = function(){
  var segment = this.tick ? '_' : '-';
  var rainbowified = this.rainbowify(segment);

  for (var index = 0; index < this.numberOfLines; index++) {
    var trajectory = this.trajectories[index];
    if (trajectory.length >= this.trajectoryWidthMax) trajectory.shift();
    trajectory.push(rainbowified);
  }
};

/**
 * Draw the rainbow.
 *
 * @api private
 */

NyanCat.prototype.drawRainbow = function(){
  var self = this;

  this.trajectories.forEach(function(line, index) {
    write('\u001b[' + self.scoreboardWidth + 'C');
    write(line.join(''));
    write('\n');
  });

  this.cursorUp(this.numberOfLines);
};

/**
 * Draw the nyan cat
 *
 * @api private
 */

NyanCat.prototype.drawNyanCat = function() {
  var self = this;
  var startWidth = this.scoreboardWidth + this.trajectories[0].length;
  var color = '\u001b[' + startWidth + 'C';
  var padding = '';

  write(color);
  write('_,------,');
  write('\n');

  write(color);
  padding = self.tick ? '  ' : '   ';
  write('_|' + padding + '/\\_/\\ ');
  write('\n');

  write(color);
  padding = self.tick ? '_' : '__';
  var tail = self.tick ? '~' : '^';
  var face;
  write(tail + '|' + padding + this.face() + ' ');
  write('\n');

  write(color);
  padding = self.tick ? ' ' : '  ';
  write(padding + '""  "" ');
  write('\n');

  this.cursorUp(this.numberOfLines);
};

/**
 * Draw nyan cat face.
 *
 * @return {String}
 * @api private
 */

NyanCat.prototype.face = function() {
  var stats = this.stats;
  if (stats.failures) {
    return '( x .x)';
  } else if (stats.pending) {
    return '( o .o)';
  } else if(stats.passes) {
    return '( ^ .^)';
  } else {
    return '( - .-)';
  }
}

/**
 * Move cursor up `n`.
 *
 * @param {Number} n
 * @api private
 */

NyanCat.prototype.cursorUp = function(n) {
  write('\u001b[' + n + 'A');
};

/**
 * Move cursor down `n`.
 *
 * @param {Number} n
 * @api private
 */

NyanCat.prototype.cursorDown = function(n) {
  write('\u001b[' + n + 'B');
};

/**
 * Generate rainbow colors.
 *
 * @return {Array}
 * @api private
 */

NyanCat.prototype.generateColors = function(){
  var colors = [];

  for (var i = 0; i < (6 * 7); i++) {
    var pi3 = Math.floor(Math.PI / 3);
    var n = (i * (1.0 / 6));
    var r = Math.floor(3 * Math.sin(n) + 3);
    var g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
    var b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
    colors.push(36 * r + 6 * g + b + 16);
  }

  return colors;
};

/**
 * Apply rainbow to the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

NyanCat.prototype.rainbowify = function(str){
  var color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];
  this.colorIndex += 1;
  return '\u001b[38;5;' + color + 'm' + str + '\u001b[0m';
};

/**
 * Stdout helper.
 */

function write(string) {
  process.stdout.write(string);
}

/**
 * Inherit from `Base.prototype`.
 */

function F(){};
F.prototype = Base.prototype;
NyanCat.prototype = new F;
NyanCat.prototype.constructor = NyanCat;


}); // module: reporters/nyan.js

require.register("reporters/progress.js", function(module, exports, require){
/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `Progress`.
 */

exports = module.exports = Progress;

/**
 * General progress bar color.
 */

Base.colors.progress = 90;

/**
 * Initialize a new `Progress` bar test reporter.
 *
 * @param {Runner} runner
 * @param {Object} options
 * @api public
 */

function Progress(runner, options) {
  Base.call(this, runner);

  var self = this
    , options = options || {}
    , stats = this.stats
    , width = Base.window.width * .50 | 0
    , total = runner.total
    , complete = 0
    , max = Math.max
    , lastN = -1;

  // default chars
  options.open = options.open || '[';
  options.complete = options.complete || '▬';
  options.incomplete = options.incomplete || Base.symbols.dot;
  options.close = options.close || ']';
  options.verbose = false;

  // tests started
  runner.on('start', function(){
    console.log();
    cursor.hide();
  });

  // tests complete
  runner.on('test end', function(){
    complete++;
    var incomplete = total - complete
      , percent = complete / total
      , n = width * percent | 0
      , i = width - n;

    if (lastN === n && !options.verbose) {
      // Don't re-render the line if it hasn't changed
      return;
    }
    lastN = n;

    cursor.CR();
    process.stdout.write('\u001b[J');
    process.stdout.write(color('progress', '  ' + options.open));
    process.stdout.write(Array(n).join(options.complete));
    process.stdout.write(Array(i).join(options.incomplete));
    process.stdout.write(color('progress', options.close));
    if (options.verbose) {
      process.stdout.write(color('progress', ' ' + complete + ' of ' + total));
    }
  });

  // tests are complete, output some stats
  // and the failures if any
  runner.on('end', function(){
    cursor.show();
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

function F(){};
F.prototype = Base.prototype;
Progress.prototype = new F;
Progress.prototype.constructor = Progress;


}); // module: reporters/progress.js

require.register("reporters/spec.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `Spec`.
 */

exports = module.exports = Spec;

/**
 * Initialize a new `Spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Spec(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , indents = 0
    , n = 0;

  function indent() {
    return Array(indents).join('  ')
  }

  runner.on('start', function(){
    console.log();
  });

  runner.on('suite', function(suite){
    ++indents;
    console.log(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on('suite end', function(suite){
    --indents;
    if (1 == indents) console.log();
  });

  runner.on('pending', function(test){
    var fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', function(test){
    if ('fast' == test.speed) {
      var fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s ');
      cursor.CR();
      console.log(fmt, test.title);
    } else {
      var fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s ')
        + color(test.speed, '(%dms)');
      cursor.CR();
      console.log(fmt, test.title, test.duration);
    }
  });

  runner.on('fail', function(test, err){
    cursor.CR();
    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
  });

  runner.on('end', self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */

function F(){};
F.prototype = Base.prototype;
Spec.prototype = new F;
Spec.prototype.constructor = Spec;


}); // module: reporters/spec.js

require.register("reporters/tap.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `TAP`.
 */

exports = module.exports = TAP;

/**
 * Initialize a new `TAP` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function TAP(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , n = 1
    , passes = 0
    , failures = 0;

  runner.on('start', function(){
    var total = runner.grepTotal(runner.suite);
    console.log('%d..%d', 1, total);
  });

  runner.on('test end', function(){
    ++n;
  });

  runner.on('pending', function(test){
    console.log('ok %d %s # SKIP -', n, title(test));
  });

  runner.on('pass', function(test){
    passes++;
    console.log('ok %d %s', n, title(test));
  });

  runner.on('fail', function(test, err){
    failures++;
    console.log('not ok %d %s', n, title(test));
    if (err.stack) console.log(err.stack.replace(/^/gm, '  '));
  });

  runner.on('end', function(){
    console.log('# tests ' + (passes + failures));
    console.log('# pass ' + passes);
    console.log('# fail ' + failures);
  });
}

/**
 * Return a TAP-safe title of `test`
 *
 * @param {Object} test
 * @return {String}
 * @api private
 */

function title(test) {
  return test.fullTitle().replace(/#/g, '');
}

}); // module: reporters/tap.js

require.register("reporters/xunit.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils')
  , escape = utils.escape;

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date
  , setTimeout = global.setTimeout
  , setInterval = global.setInterval
  , clearTimeout = global.clearTimeout
  , clearInterval = global.clearInterval;

/**
 * Expose `XUnit`.
 */

exports = module.exports = XUnit;

/**
 * Initialize a new `XUnit` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function XUnit(runner) {
  Base.call(this, runner);
  var stats = this.stats
    , tests = []
    , self = this;

  runner.on('pending', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    tests.push(test);
  });

  runner.on('fail', function(test){
    tests.push(test);
  });

  runner.on('end', function(){
    console.log(tag('testsuite', {
        name: 'Mocha Tests'
      , tests: stats.tests
      , failures: stats.failures
      , errors: stats.failures
      , skipped: stats.tests - stats.failures - stats.passes
      , timestamp: (new Date).toUTCString()
      , time: (stats.duration / 1000) || 0
    }, false));

    tests.forEach(test);
    console.log('</testsuite>');
  });
}

/**
 * Inherit from `Base.prototype`.
 */

function F(){};
F.prototype = Base.prototype;
XUnit.prototype = new F;
XUnit.prototype.constructor = XUnit;


/**
 * Output tag for the given `test.`
 */

function test(test) {
  var attrs = {
      classname: test.parent.fullTitle()
    , name: test.title
    , time: (test.duration / 1000) || 0
  };

  if ('failed' == test.state) {
    var err = test.err;
    console.log(tag('testcase', attrs, false, tag('failure', {}, false, cdata(escape(err.message) + "\n" + err.stack))));
  } else if (test.pending) {
    console.log(tag('testcase', attrs, false, tag('skipped', {}, true)));
  } else {
    console.log(tag('testcase', attrs, true) );
  }
}

/**
 * HTML tag helper.
 */

function tag(name, attrs, close, content) {
  var end = close ? '/>' : '>'
    , pairs = []
    , tag;

  for (var key in attrs) {
    pairs.push(key + '="' + escape(attrs[key]) + '"');
  }

  tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;
  if (content) tag += content + '</' + name + end;
  return tag;
}

/**
 * Return cdata escaped CDATA `str`.
 */

function cdata(str) {
  return '<![CDATA[' + escape(str) + ']]>';
}

}); // module: reporters/xunit.js

require.register("runnable.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var EventEmitter = require('browser/events').EventEmitter
  , debug = require('browser/debug')('mocha:runnable')
  , milliseconds = require('./ms');

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date
  , setTimeout = global.setTimeout
  , setInterval = global.setInterval
  , clearTimeout = global.clearTimeout
  , clearInterval = global.clearInterval;

/**
 * Object#toString().
 */

var toString = Object.prototype.toString;

/**
 * Expose `Runnable`.
 */

module.exports = Runnable;

/**
 * Initialize a new `Runnable` with the given `title` and callback `fn`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api private
 */

function Runnable(title, fn) {
  this.title = title;
  this.fn = fn;
  this.async = fn && fn.length;
  this.sync = ! this.async;
  this._timeout = 2000;
  this._slow = 75;
  this._enableTimeouts = true;
  this.timedOut = false;
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

function F(){};
F.prototype = EventEmitter.prototype;
Runnable.prototype = new F;
Runnable.prototype.constructor = Runnable;


/**
 * Set & get timeout `ms`.
 *
 * @param {Number|String} ms
 * @return {Runnable|Number} ms or self
 * @api private
 */

Runnable.prototype.timeout = function(ms){
  if (0 == arguments.length) return this._timeout;
  if ('string' == typeof ms) ms = milliseconds(ms);
  debug('timeout %d', ms);
  this._timeout = ms;
  if (this.timer) this.resetTimeout();
  return this;
};

/**
 * Set & get slow `ms`.
 *
 * @param {Number|String} ms
 * @return {Runnable|Number} ms or self
 * @api private
 */

Runnable.prototype.slow = function(ms){
  if (0 === arguments.length) return this._slow;
  if ('string' == typeof ms) ms = milliseconds(ms);
  debug('timeout %d', ms);
  this._slow = ms;
  return this;
};

/**
 * Set and & get timeout `enabled`.
 *
 * @param {Boolean} enabled
 * @return {Runnable|Boolean} enabled or self
 * @api private
 */

Runnable.prototype.enableTimeouts = function(enabled){
  if (arguments.length === 0) return this._enableTimeouts;
  debug('enableTimeouts %s', enabled);
  this._enableTimeouts = enabled;
  return this;
};

/**
 * Return the full title generated by recursively
 * concatenating the parent's full title.
 *
 * @return {String}
 * @api public
 */

Runnable.prototype.fullTitle = function(){
  return this.parent.fullTitle() + ' ' + this.title;
};

/**
 * Clear the timeout.
 *
 * @api private
 */

Runnable.prototype.clearTimeout = function(){
  clearTimeout(this.timer);
};

/**
 * Inspect the runnable void of private properties.
 *
 * @return {String}
 * @api private
 */

Runnable.prototype.inspect = function(){
  return JSON.stringify(this, function(key, val){
    if ('_' == key[0]) return;
    if ('parent' == key) return '#<Suite>';
    if ('ctx' == key) return '#<Context>';
    return val;
  }, 2);
};

/**
 * Reset the timeout.
 *
 * @api private
 */

Runnable.prototype.resetTimeout = function(){
  var self = this;
  var ms = this.timeout() || 1e9;

  if (!this._enableTimeouts) return;
  this.clearTimeout();
  this.timer = setTimeout(function(){
    self.callback(new Error('timeout of ' + ms + 'ms exceeded'));
    self.timedOut = true;
  }, ms);
};

/**
 * Whitelist these globals for this test run
 *
 * @api private
 */
Runnable.prototype.globals = function(arr){
  var self = this;
  this._allowedGlobals = arr;
};

/**
 * Run the test and invoke `fn(err)`.
 *
 * @param {Function} fn
 * @api private
 */

Runnable.prototype.run = function(fn){
  var self = this
    , start = new Date
    , ctx = this.ctx
    , finished
    , emitted;

  // Some times the ctx exists but it is not runnable
  if (ctx && ctx.runnable) ctx.runnable(this);

  // called multiple times
  function multiple(err) {
    if (emitted) return;
    emitted = true;
    self.emit('error', err || new Error('done() called multiple times'));
  }

  // finished
  function done(err) {
    var ms = self.timeout();
    if (self.timedOut) return;
    if (finished) return multiple(err);
    self.clearTimeout();
    self.duration = new Date - start;
    finished = true;
    if (!err && self.duration > ms && self._enableTimeouts) err = new Error('timeout of ' + ms + 'ms exceeded');
    fn(err);
  }

  // for .resetTimeout()
  this.callback = done;

  // explicit async with `done` argument
  if (this.async) {
    this.resetTimeout();

    try {
      this.fn.call(ctx, function(err){
        if (err instanceof Error || toString.call(err) === "[object Error]") return done(err);
        if (null != err) {
          if (Object.prototype.toString.call(err) === '[object Object]') {
            return done(new Error('done() invoked with non-Error: ' + JSON.stringify(err)));
          } else {
            return done(new Error('done() invoked with non-Error: ' + err));
          }
        }
        done();
      });
    } catch (err) {
      done(err);
    }
    return;
  }

  if (this.asyncOnly) {
    return done(new Error('--async-only option in use without declaring `done()`'));
  }

  // sync or promise-returning
  try {
    if (this.pending) {
      done();
    } else {
      callFn(this.fn);
    }
  } catch (err) {
    done(err);
  }

  function callFn(fn) {
    var result = fn.call(ctx);
    if (result && typeof result.then === 'function') {
      self.resetTimeout();
      result
        .then(function() {
          done()
        },
        function(reason) {
          done(reason || new Error('Promise rejected with no or falsy reason'))
        });
    } else {
      done();
    }
  }
};

}); // module: runnable.js

require.register("runner.js", function(module, exports, require){
/**
 * Module dependencies.
 */

var EventEmitter = require('browser/events').EventEmitter
  , debug = require('browser/debug')('mocha:runner')
  , Test = require('./test')
  , utils = require('./utils')
  , filter = utils.filter
  , keys = utils.keys;

/**
 * Non-enumerable globals.
 */

var globals = [
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'XMLHttpRequest',
  'Date'
];

/**
 * Expose `Runner`.
 */

module.exports = Runner;

/**
 * Initialize a `Runner` for the given `suite`.
 *
 * Events:
 *
 *   - `start`  execution started
 *   - `end`  execution complete
 *   - `suite`  (suite) test suite execution started
 *   - `suite end`  (suite) all tests (and sub-suites) have finished
 *   - `test`  (test) test execution started
 *   - `test end`  (test) test completed
 *   - `hook`  (hook) hook execution started
 *   - `hook end`  (hook) hook complete
 *   - `pass`  (test) test passed
 *   - `fail`  (test, err) test failed
 *   - `pending`  (test) test pending
 *
 * @api public
 */

function Runner(suite) {
  var self = this;
  this._globals = [];
  this._abort = false;
  this.suite = suite;
  this.total = suite.total();
  this.failures = 0;
  this.on('test end', function(test){ self.checkGlobals(test); });
  this.on('hook end', function(hook){ self.checkGlobals(hook); });
  this.grep(/.*/);
  this.globals(this.globalProps().concat(extraGlobals()));
}

/**
 * Wrapper for setImmediate, process.nextTick, or browser polyfill.
 *
 * @param {Function} fn
 * @api private
 */

Runner.immediately = global.setImmediate || process.nextTick;

/**
 * Inherit from `EventEmitter.prototype`.
 */

function F(){};
F.prototype = EventEmitter.prototype;
Runner.prototype = new F;
Runner.prototype.constructor = Runner;


/**
 * Run tests with full titles matching `re`. Updates runner.total
 * with number of tests matched.
 *
 * @param {RegExp} re
 * @param {Boolean} invert
 * @return {Runner} for chaining
 * @api public
 */

Runner.prototype.grep = function(re, invert){
  debug('grep %s', re);
  this._grep = re;
  this._invert = invert;
  this.total = this.grepTotal(this.suite);
  return this;
};

/**
 * Returns the number of tests matching the grep search for the
 * given suite.
 *
 * @param {Suite} suite
 * @return {Number}
 * @api public
 */

Runner.prototype.grepTotal = function(suite) {
  var self = this;
  var total = 0;

  suite.eachTest(function(test){
    var match = self._grep.test(test.fullTitle());
    if (self._invert) match = !match;
    if (match) total++;
  });

  return total;
};

/**
 * Return a list of global properties.
 *
 * @return {Array}
 * @api private
 */

Runner.prototype.globalProps = function() {
  var props = utils.keys(global);

  // non-enumerables
  for (var i = 0; i < globals.length; ++i) {
    if (~utils.indexOf(props, globals[i])) continue;
    props.push(globals[i]);
  }

  return props;
};

/**
 * Allow the given `arr` of globals.
 *
 * @param {Array} arr
 * @return {Runner} for chaining
 * @api public
 */

Runner.prototype.globals = function(arr){
  if (0 == arguments.length) return this._globals;
  debug('globals %j', arr);
  this._globals = this._globals.concat(arr);
  return this;
};

/**
 * Check for global variable leaks.
 *
 * @api private
 */

Runner.prototype.checkGlobals = function(test){
  if (this.ignoreLeaks) return;
  var ok = this._globals;

  var globals = this.globalProps();
  var leaks;

  if (test) {
    ok = ok.concat(test._allowedGlobals || []);
  }

  if(this.prevGlobalsLength == globals.length) return;
  this.prevGlobalsLength = globals.length;

  leaks = filterLeaks(ok, globals);
  this._globals = this._globals.concat(leaks);

  if (leaks.length > 1) {
    this.fail(test, new Error('global leaks detected: ' + leaks.join(', ') + ''));
  } else if (leaks.length) {
    this.fail(test, new Error('global leak detected: ' + leaks[0]));
  }
};

/**
 * Fail the given `test`.
 *
 * @param {Test} test
 * @param {Error} err
 * @api private
 */

Runner.prototype.fail = function(test, err){
  ++this.failures;
  test.state = 'failed';

  if ('string' == typeof err) {
    err = new Error('the string "' + err + '" was thrown, throw an Error :)');
  }

  this.emit('fail', test, err);
};

/**
 * Fail the given `hook` with `err`.
 *
 * Hook failures work in the following pattern:
 * - If bail, then exit
 * - Failed `before` hook skips all tests in a suite and subsuites,
 *   but jumps to corresponding `after` hook
 * - Failed `before each` hook skips remaining tests in a
 *   suite and jumps to corresponding `after each` hook,
 *   which is run only once
 * - Failed `after` hook does not alter
 *   execution order
 * - Failed `after each` hook skips remaining tests in a
 *   suite and subsuites, but executes other `after each`
 *   hooks
 *
 * @param {Hook} hook
 * @param {Error} err
 * @api private
 */

Runner.prototype.failHook = function(hook, err){
  this.fail(hook, err);
  if (this.suite.bail()) {
    this.emit('end');
  }
};

/**
 * Run hook `name` callbacks and then invoke `fn()`.
 *
 * @param {String} name
 * @param {Function} function
 * @api private
 */

Runner.prototype.hook = function(name, fn){
  var suite = this.suite
    , hooks = suite['_' + name]
    , self = this
    , timer;

  function next(i) {
    var hook = hooks[i];
    if (!hook) return fn();
    if (self.failures && suite.bail()) return fn();
    self.currentRunnable = hook;

    hook.ctx.currentTest = self.test;

    self.emit('hook', hook);

    hook.on('error', function(err){
      self.failHook(hook, err);
    });

    hook.run(function(err){
      hook.removeAllListeners('error');
      var testError = hook.error();
      if (testError) self.fail(self.test, testError);
      if (err) {
        self.failHook(hook, err);

        // stop executing hooks, notify callee of hook err
        return fn(err);
      }
      self.emit('hook end', hook);
      delete hook.ctx.currentTest;
      next(++i);
    });
  }

  Runner.immediately(function(){
    next(0);
  });
};

/**
 * Run hook `name` for the given array of `suites`
 * in order, and callback `fn(err, errSuite)`.
 *
 * @param {String} name
 * @param {Array} suites
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hooks = function(name, suites, fn){
  var self = this
    , orig = this.suite;

  function next(suite) {
    self.suite = suite;

    if (!suite) {
      self.suite = orig;
      return fn();
    }

    self.hook(name, function(err){
      if (err) {
        var errSuite = self.suite;
        self.suite = orig;
        return fn(err, errSuite);
      }

      next(suites.pop());
    });
  }

  next(suites.pop());
};

/**
 * Run hooks from the top level down.
 *
 * @param {String} name
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hookUp = function(name, fn){
  var suites = [this.suite].concat(this.parents()).reverse();
  this.hooks(name, suites, fn);
};

/**
 * Run hooks from the bottom up.
 *
 * @param {String} name
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hookDown = function(name, fn){
  var suites = [this.suite].concat(this.parents());
  this.hooks(name, suites, fn);
};

/**
 * Return an array of parent Suites from
 * closest to furthest.
 *
 * @return {Array}
 * @api private
 */

Runner.prototype.parents = function(){
  var suite = this.suite
    , suites = [];
  while (suite = suite.parent) suites.push(suite);
  return suites;
};

/**
 * Run the current test and callback `fn(err)`.
 *
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runTest = function(fn){
  var test = this.test
    , self = this;

  if (this.asyncOnly) test.asyncOnly = true;

  try {
    test.on('error', function(err){
      self.fail(test, err);
    });
    test.run(fn);
  } catch (err) {
    fn(err);
  }
};

/**
 * Run tests in the given `suite` and invoke
 * the callback `fn()` when complete.
 *
 * @param {Suite} suite
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runTests = function(suite, fn){
  var self = this
    , tests = suite.tests.slice()
    , test;


  function hookErr(err, errSuite, after) {
    // before/after Each hook for errSuite failed:
    var orig = self.suite;

    // for failed 'after each' hook start from errSuite parent,
    // otherwise start from errSuite itself
    self.suite = after ? errSuite.parent : errSuite;

    if (self.suite) {
      // call hookUp afterEach
      self.hookUp('afterEach', function(err2, errSuite2) {
        self.suite = orig;
        // some hooks may fail even now
        if (err2) return hookErr(err2, errSuite2, true);
        // report error suite
        fn(errSuite);
      });
    } else {
      // there is no need calling other 'after each' hooks
      self.suite = orig;
      fn(errSuite);
    }
  }

  function next(err, errSuite) {
    // if we bail after first err
    if (self.failures && suite._bail) return fn();

    if (self._abort) return fn();

    if (err) return hookErr(err, errSuite, true);

    // next test
    test = tests.shift();

    // all done
    if (!test) return fn();

    // grep
    var match = self._grep.test(test.fullTitle());
    if (self._invert) match = !match;
    if (!match) return next();

    // pending
    if (test.pending) {
      self.emit('pending', test);
      self.emit('test end', test);
      return next();
    }

    // execute test and hook(s)
    self.emit('test', self.test = test);
    self.hookDown('beforeEach', function(err, errSuite){

      if (err) return hookErr(err, errSuite, false);

      self.currentRunnable = self.test;
      self.runTest(function(err){
        test = self.test;

        if (err) {
          self.fail(test, err);
          self.emit('test end', test);
          return self.hookUp('afterEach', next);
        }

        test.state = 'passed';
        self.emit('pass', test);
        self.emit('test end', test);
        self.hookUp('afterEach', next);
      });
    });
  }

  this.next = next;
  next();
};

/**
 * Run the given `suite` and invoke the
 * callback `fn()` when complete.
 *
 * @param {Suite} suite
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runSuite = function(suite, fn){
  var total = this.grepTotal(suite)
    , self = this
    , i = 0;

  debug('run suite %s', suite.fullTitle());

  if (!total) return fn();

  this.emit('suite', this.suite = suite);

  function next(errSuite) {
    if (errSuite) {
      // current suite failed on a hook from errSuite
      if (errSuite == suite) {
        // if errSuite is current suite
        // continue to the next sibling suite
        return done();
      } else {
        // errSuite is among the parents of current suite
        // stop execution of errSuite and all sub-suites
        return done(errSuite);
      }
    }

    if (self._abort) return done();

    var curr = suite.suites[i++];
    if (!curr) return done();
    self.runSuite(curr, next);
  }

  function done(errSuite) {
    self.suite = suite;
    self.hook('afterAll', function(){
      self.emit('suite end', suite);
      fn(errSuite);
    });
  }

  this.hook('beforeAll', function(err){
    if (err) return done();
    self.runTests(suite, next);
  });
};

/**
 * Handle uncaught exceptions.
 *
 * @param {Error} err
 * @api private
 */

Runner.prototype.uncaught = function(err){
  if (err) {
    debug('uncaught exception %s', err.message);
  } else {
    debug('uncaught undefined exception');
    err = new Error('Catched undefined error, did you throw without specifying what?');
  }
  
  var runnable = this.currentRunnable;
  if (!runnable || 'failed' == runnable.state) return;
  runnable.clearTimeout();
  err.uncaught = true;
  this.fail(runnable, err);

  // recover from test
  if ('test' == runnable.type) {
    this.emit('test end', runnable);
    this.hookUp('afterEach', this.next);
    return;
  }

  // bail on hooks
  this.emit('end');
};

/**
 * Run the root suite and invoke `fn(failures)`
 * on completion.
 *
 * @param {Function} fn
 * @return {Runner} for chaining
 * @api public
 */

Runner.prototype.run = function(fn){
  var self = this
    , fn = fn || function(){};

  function uncaught(err){
    self.uncaught(err);
  }

  debug('start');

  // callback
  this.on('end', function(){
    debug('end');
    process.removeListener('uncaughtException', uncaught);
    fn(self.failures);
  });

  // run suites
  this.emit('start');
  this.runSuite(this.suite, function(){
    debug('finished running');
    self.emit('end');
  });

  // uncaught exception
  process.on('uncaughtException', uncaught);

  return this;
};

/**
 * Cleanly abort execution
 *
 * @return {Runner} for chaining
 * @api public
 */
Runner.prototype.abort = function(){
  debug('aborting');
  this._abort = true;
}

/**
 * Filter leaks with the given globals flagged as `ok`.
 *
 * @param {Array} ok
 * @param {Array} globals
 * @return {Array}
 * @api private
 */

function filterLeaks(ok, globals) {
  return filter(globals, function(key){
    // Firefox and Chrome exposes iframes as index inside the window object
    if (/^d+/.test(key)) return false;

    // in firefox
    // if runner runs in an iframe, this iframe's window.getInterface method not init at first
    // it is assigned in some seconds
    if (global.navigator && /^getInterface/.test(key)) return false;

    // an iframe could be approached by window[iframeIndex]
    // in ie6,7,8 and opera, iframeIndex is enumerable, this could cause leak
    if (global.navigator && /^\d+/.test(key)) return false;

    // Opera and IE expose global variables for HTML element IDs (issue #243)
    if (/^mocha-/.test(key)) return false;

    var matched = filter(ok, function(ok){
      if (~ok.indexOf('*')) return 0 == key.indexOf(ok.split('*')[0]);
      return key == ok;
    });
    return matched.length == 0 && (!global.navigator || 'onerror' !== key);
  });
}

/**
 * Array of globals dependent on the environment.
 *
 * @return {Array}
 * @api private
 */

 function extraGlobals() {
  if (typeof(process) === 'object' &&
      typeof(process.version) === 'string') {

    var nodeVersion = process.version.split('.').reduce(function(a, v) {
      return a << 8 | v;
    });

    // 'errno' was renamed to process._errno in v0.9.11.

    if (nodeVersion < 0x00090B) {
      return ['errno'];
    }
  }

  return [];
 }

}); // module: runner.js

require.register("suite.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var EventEmitter = require('browser/events').EventEmitter
  , debug = require('browser/debug')('mocha:suite')
  , milliseconds = require('./ms')
  , utils = require('./utils')
  , Hook = require('./hook');

/**
 * Expose `Suite`.
 */

exports = module.exports = Suite;

/**
 * Create a new `Suite` with the given `title`
 * and parent `Suite`. When a suite with the
 * same title is already present, that suite
 * is returned to provide nicer reporter
 * and more flexible meta-testing.
 *
 * @param {Suite} parent
 * @param {String} title
 * @return {Suite}
 * @api public
 */

exports.create = function(parent, title){
  var suite = new Suite(title, parent.ctx);
  suite.parent = parent;
  if (parent.pending) suite.pending = true;
  title = suite.fullTitle();
  parent.addSuite(suite);
  return suite;
};

/**
 * Initialize a new `Suite` with the given
 * `title` and `ctx`.
 *
 * @param {String} title
 * @param {Context} ctx
 * @api private
 */

function Suite(title, parentContext) {
  this.title = title;
  var context = function() {};
  context.prototype = parentContext;
  this.ctx = new context();
  this.suites = [];
  this.tests = [];
  this.pending = false;
  this._beforeEach = [];
  this._beforeAll = [];
  this._afterEach = [];
  this._afterAll = [];
  this.root = !title;
  this._timeout = 2000;
  this._enableTimeouts = true;
  this._slow = 75;
  this._bail = false;
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

function F(){};
F.prototype = EventEmitter.prototype;
Suite.prototype = new F;
Suite.prototype.constructor = Suite;


/**
 * Return a clone of this `Suite`.
 *
 * @return {Suite}
 * @api private
 */

Suite.prototype.clone = function(){
  var suite = new Suite(this.title);
  debug('clone');
  suite.ctx = this.ctx;
  suite.timeout(this.timeout());
  suite.enableTimeouts(this.enableTimeouts());
  suite.slow(this.slow());
  suite.bail(this.bail());
  return suite;
};

/**
 * Set timeout `ms` or short-hand such as "2s".
 *
 * @param {Number|String} ms
 * @return {Suite|Number} for chaining
 * @api private
 */

Suite.prototype.timeout = function(ms){
  if (0 == arguments.length) return this._timeout;
  if ('string' == typeof ms) ms = milliseconds(ms);
  debug('timeout %d', ms);
  this._timeout = parseInt(ms, 10);
  return this;
};

/**
  * Set timeout `enabled`.
  *
  * @param {Boolean} enabled
  * @return {Suite|Boolean} self or enabled
  * @api private
  */

Suite.prototype.enableTimeouts = function(enabled){
  if (arguments.length === 0) return this._enableTimeouts;
  debug('enableTimeouts %s', enabled);
  this._enableTimeouts = enabled;
  return this;
}

/**
 * Set slow `ms` or short-hand such as "2s".
 *
 * @param {Number|String} ms
 * @return {Suite|Number} for chaining
 * @api private
 */

Suite.prototype.slow = function(ms){
  if (0 === arguments.length) return this._slow;
  if ('string' == typeof ms) ms = milliseconds(ms);
  debug('slow %d', ms);
  this._slow = ms;
  return this;
};

/**
 * Sets whether to bail after first error.
 *
 * @parma {Boolean} bail
 * @return {Suite|Number} for chaining
 * @api private
 */

Suite.prototype.bail = function(bail){
  if (0 == arguments.length) return this._bail;
  debug('bail %s', bail);
  this._bail = bail;
  return this;
};

/**
 * Run `fn(test[, done])` before running tests.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.beforeAll = function(title, fn){
  if (this.pending) return this;
  if ('function' === typeof title) {
    fn = title;
    title = fn.name;
  }
  title = '"before all" hook' + (title ? ': ' + title : '');

  var hook = new Hook(title, fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  hook.enableTimeouts(this.enableTimeouts());
  hook.slow(this.slow());
  hook.ctx = this.ctx;
  this._beforeAll.push(hook);
  this.emit('beforeAll', hook);
  return this;
};

/**
 * Run `fn(test[, done])` after running tests.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.afterAll = function(title, fn){
  if (this.pending) return this;
  if ('function' === typeof title) {
    fn = title;
    title = fn.name;
  }
  title = '"after all" hook' + (title ? ': ' + title : '');

  var hook = new Hook(title, fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  hook.enableTimeouts(this.enableTimeouts());
  hook.slow(this.slow());
  hook.ctx = this.ctx;
  this._afterAll.push(hook);
  this.emit('afterAll', hook);
  return this;
};

/**
 * Run `fn(test[, done])` before each test case.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.beforeEach = function(title, fn){
  if (this.pending) return this;
  if ('function' === typeof title) {
    fn = title;
    title = fn.name;
  }
  title = '"before each" hook' + (title ? ': ' + title : '');

  var hook = new Hook(title, fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  hook.enableTimeouts(this.enableTimeouts());
  hook.slow(this.slow());
  hook.ctx = this.ctx;
  this._beforeEach.push(hook);
  this.emit('beforeEach', hook);
  return this;
};

/**
 * Run `fn(test[, done])` after each test case.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.afterEach = function(title, fn){
  if (this.pending) return this;
  if ('function' === typeof title) {
    fn = title;
    title = fn.name;
  }
  title = '"after each" hook' + (title ? ': ' + title : '');

  var hook = new Hook(title, fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  hook.enableTimeouts(this.enableTimeouts());
  hook.slow(this.slow());
  hook.ctx = this.ctx;
  this._afterEach.push(hook);
  this.emit('afterEach', hook);
  return this;
};

/**
 * Add a test `suite`.
 *
 * @param {Suite} suite
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.addSuite = function(suite){
  suite.parent = this;
  suite.timeout(this.timeout());
  suite.enableTimeouts(this.enableTimeouts());
  suite.slow(this.slow());
  suite.bail(this.bail());
  this.suites.push(suite);
  this.emit('suite', suite);
  return this;
};

/**
 * Add a `test` to this suite.
 *
 * @param {Test} test
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.addTest = function(test){
  test.parent = this;
  test.timeout(this.timeout());
  test.enableTimeouts(this.enableTimeouts());
  test.slow(this.slow());
  test.ctx = this.ctx;
  this.tests.push(test);
  this.emit('test', test);
  return this;
};

/**
 * Return the full title generated by recursively
 * concatenating the parent's full title.
 *
 * @return {String}
 * @api public
 */

Suite.prototype.fullTitle = function(){
  if (this.parent) {
    var full = this.parent.fullTitle();
    if (full) return full + ' ' + this.title;
  }
  return this.title;
};

/**
 * Return the total number of tests.
 *
 * @return {Number}
 * @api public
 */

Suite.prototype.total = function(){
  return utils.reduce(this.suites, function(sum, suite){
    return sum + suite.total();
  }, 0) + this.tests.length;
};

/**
 * Iterates through each suite recursively to find
 * all tests. Applies a function in the format
 * `fn(test)`.
 *
 * @param {Function} fn
 * @return {Suite}
 * @api private
 */

Suite.prototype.eachTest = function(fn){
  utils.forEach(this.tests, fn);
  utils.forEach(this.suites, function(suite){
    suite.eachTest(fn);
  });
  return this;
};

}); // module: suite.js

require.register("test.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Runnable = require('./runnable');

/**
 * Expose `Test`.
 */

module.exports = Test;

/**
 * Initialize a new `Test` with the given `title` and callback `fn`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api private
 */

function Test(title, fn) {
  Runnable.call(this, title, fn);
  this.pending = !fn;
  this.type = 'test';
}

/**
 * Inherit from `Runnable.prototype`.
 */

function F(){};
F.prototype = Runnable.prototype;
Test.prototype = new F;
Test.prototype.constructor = Test;


}); // module: test.js

require.register("utils.js", function(module, exports, require){
/**
 * Module dependencies.
 */

var fs = require('browser/fs')
  , path = require('browser/path')
  , join = path.join
  , debug = require('browser/debug')('mocha:watch');

/**
 * Ignored directories.
 */

var ignore = ['node_modules', '.git'];

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 * @api private
 */

exports.escape = function(html){
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Array#forEach (<=IE8)
 *
 * @param {Array} array
 * @param {Function} fn
 * @param {Object} scope
 * @api private
 */

exports.forEach = function(arr, fn, scope){
  for (var i = 0, l = arr.length; i < l; i++)
    fn.call(scope, arr[i], i);
};

/**
 * Array#map (<=IE8)
 *
 * @param {Array} array
 * @param {Function} fn
 * @param {Object} scope
 * @api private
 */

exports.map = function(arr, fn, scope){
  var result = [];
  for (var i = 0, l = arr.length; i < l; i++)
    result.push(fn.call(scope, arr[i], i));
  return result;
};

/**
 * Array#indexOf (<=IE8)
 *
 * @parma {Array} arr
 * @param {Object} obj to find index of
 * @param {Number} start
 * @api private
 */

exports.indexOf = function(arr, obj, start){
  for (var i = start || 0, l = arr.length; i < l; i++) {
    if (arr[i] === obj)
      return i;
  }
  return -1;
};

/**
 * Array#reduce (<=IE8)
 *
 * @param {Array} array
 * @param {Function} fn
 * @param {Object} initial value
 * @api private
 */

exports.reduce = function(arr, fn, val){
  var rval = val;

  for (var i = 0, l = arr.length; i < l; i++) {
    rval = fn(rval, arr[i], i, arr);
  }

  return rval;
};

/**
 * Array#filter (<=IE8)
 *
 * @param {Array} array
 * @param {Function} fn
 * @api private
 */

exports.filter = function(arr, fn){
  var ret = [];

  for (var i = 0, l = arr.length; i < l; i++) {
    var val = arr[i];
    if (fn(val, i, arr)) ret.push(val);
  }

  return ret;
};

/**
 * Object.keys (<=IE8)
 *
 * @param {Object} obj
 * @return {Array} keys
 * @api private
 */

exports.keys = Object.keys || function(obj) {
  var keys = []
    , has = Object.prototype.hasOwnProperty // for `window` on <=IE8

  for (var key in obj) {
    if (has.call(obj, key)) {
      keys.push(key);
    }
  }

  return keys;
};

/**
 * Watch the given `files` for changes
 * and invoke `fn(file)` on modification.
 *
 * @param {Array} files
 * @param {Function} fn
 * @api private
 */

exports.watch = function(files, fn){
  var options = { interval: 100 };
  files.forEach(function(file){
    debug('file %s', file);
    fs.watchFile(file, options, function(curr, prev){
      if (prev.mtime < curr.mtime) fn(file);
    });
  });
};

/**
 * Ignored files.
 */

function ignored(path){
  return !~ignore.indexOf(path);
}

/**
 * Lookup files in the given `dir`.
 *
 * @return {Array}
 * @api private
 */

exports.files = function(dir, ext, ret){
  ret = ret || [];
  ext = ext || ['js'];

  var re = new RegExp('\\.(' + ext.join('|') + ')$');

  fs.readdirSync(dir)
  .filter(ignored)
  .forEach(function(path){
    path = join(dir, path);
    if (fs.statSync(path).isDirectory()) {
      exports.files(path, ext, ret);
    } else if (path.match(re)) {
      ret.push(path);
    }
  });

  return ret;
};

/**
 * Compute a slug from the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.slug = function(str){
  return str
    .toLowerCase()
    .replace(/ +/g, '-')
    .replace(/[^-\w]/g, '');
};

/**
 * Strip the function definition from `str`,
 * and re-indent for pre whitespace.
 */

exports.clean = function(str) {
  str = str
    .replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '')
    .replace(/^function *\(.*\) *{|\(.*\) *=> *{?/, '')
    .replace(/\s+\}$/, '');

  var spaces = str.match(/^\n?( *)/)[1].length
    , tabs = str.match(/^\n?(\t*)/)[1].length
    , re = new RegExp('^\n?' + (tabs ? '\t' : ' ') + '{' + (tabs ? tabs : spaces) + '}', 'gm');

  str = str.replace(re, '');

  return exports.trim(str);
};

/**
 * Escape regular expression characters in `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.escapeRegexp = function(str){
  return str.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};

/**
 * Trim the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.trim = function(str){
  return str.replace(/^\s+|\s+$/g, '');
};

/**
 * Parse the given `qs`.
 *
 * @param {String} qs
 * @return {Object}
 * @api private
 */

exports.parseQuery = function(qs){
  return exports.reduce(qs.replace('?', '').split('&'), function(obj, pair){
    var i = pair.indexOf('=')
      , key = pair.slice(0, i)
      , val = pair.slice(++i);

    obj[key] = decodeURIComponent(val);
    return obj;
  }, {});
};

/**
 * Highlight the given string of `js`.
 *
 * @param {String} js
 * @return {String}
 * @api private
 */

function highlight(js) {
  return js
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
    .replace(/('.*?')/gm, '<span class="string">$1</span>')
    .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
    .replace(/(\d+)/gm, '<span class="number">$1</span>')
    .replace(/\bnew[ \t]+(\w+)/gm, '<span class="keyword">new</span> <span class="init">$1</span>')
    .replace(/\b(function|new|throw|return|var|if|else)\b/gm, '<span class="keyword">$1</span>')
}

/**
 * Highlight the contents of tag `name`.
 *
 * @param {String} name
 * @api private
 */

exports.highlightTags = function(name) {
  var code = document.getElementsByTagName(name);
  for (var i = 0, len = code.length; i < len; ++i) {
    code[i].innerHTML = highlight(code[i].innerHTML);
  }
};


/**
 * Stringify `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

exports.stringify = function(obj) {
  if (obj instanceof RegExp) return obj.toString();
  return JSON.stringify(exports.canonicalize(obj), null, 2).replace(/,(\n|$)/g, '$1');
}

/**
 * Return a new object that has the keys in sorted order.
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

exports.canonicalize = function(obj, stack) {
   stack = stack || [];

   if (exports.indexOf(stack, obj) !== -1) return '[Circular]';

   var canonicalizedObj;

   if ({}.toString.call(obj) === '[object Array]') {
     stack.push(obj);
     canonicalizedObj = exports.map(obj, function(item) {
       return exports.canonicalize(item, stack);
     });
     stack.pop();
   } else if (typeof obj === 'object' && obj !== null) {
     stack.push(obj);
     canonicalizedObj = {};
     exports.forEach(exports.keys(obj).sort(), function(key) {
       canonicalizedObj[key] = exports.canonicalize(obj[key], stack);
     });
     stack.pop();
   } else {
     canonicalizedObj = obj;
   }

   return canonicalizedObj;
 }

}); // module: utils.js
// The global object is "self" in Web Workers.
var global = (function() { return this; })();

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date;
var setTimeout = global.setTimeout;
var setInterval = global.setInterval;
var clearTimeout = global.clearTimeout;
var clearInterval = global.clearInterval;

/**
 * Node shims.
 *
 * These are meant only to allow
 * mocha.js to run untouched, not
 * to allow running node code in
 * the browser.
 */

var process = {};
process.exit = function(status){};
process.stdout = {};

var uncaughtExceptionHandlers = [];

var originalOnerrorHandler = global.onerror;

/**
 * Remove uncaughtException listener.
 * Revert to original onerror handler if previously defined.
 */

process.removeListener = function(e, fn){
  if ('uncaughtException' == e) {
    if (originalOnerrorHandler) {
      global.onerror = originalOnerrorHandler;
    } else {
      global.onerror = function() {};
    }
    var i = Mocha.utils.indexOf(uncaughtExceptionHandlers, fn);
    if (i != -1) { uncaughtExceptionHandlers.splice(i, 1); }
  }
};

/**
 * Implements uncaughtException listener.
 */

process.on = function(e, fn){
  if ('uncaughtException' == e) {
    global.onerror = function(err, url, line){
      fn(new Error(err + ' (' + url + ':' + line + ')'));
      return true;
    };
    uncaughtExceptionHandlers.push(fn);
  }
};

/**
 * Expose mocha.
 */

var Mocha = global.Mocha = require('mocha'),
    mocha = global.mocha = new Mocha({ reporter: 'html' });

// The BDD UI is registered by default, but no UI will be functional in the
// browser without an explicit call to the overridden `mocha.ui` (see below).
// Ensure that this default UI does not expose its methods to the global scope.
mocha.suite.removeAllListeners('pre-require');

var immediateQueue = []
  , immediateTimeout;

function timeslice() {
  var immediateStart = new Date().getTime();
  while (immediateQueue.length && (new Date().getTime() - immediateStart) < 100) {
    immediateQueue.shift()();
  }
  if (immediateQueue.length) {
    immediateTimeout = setTimeout(timeslice, 0);
  } else {
    immediateTimeout = null;
  }
}

/**
 * High-performance override of Runner.immediately.
 */

Mocha.Runner.immediately = function(callback) {
  immediateQueue.push(callback);
  if (!immediateTimeout) {
    immediateTimeout = setTimeout(timeslice, 0);
  }
};

/**
 * Function to allow assertion libraries to throw errors directly into mocha.
 * This is useful when running tests in a browser because window.onerror will
 * only receive the 'message' attribute of the Error.
 */
mocha.throwError = function(err) {
  Mocha.utils.forEach(uncaughtExceptionHandlers, function (fn) {
    fn(err);
  });
  throw err;
};

/**
 * Override ui to ensure that the ui functions are initialized.
 * Normally this would happen in Mocha.prototype.loadFiles.
 */

mocha.ui = function(ui){
  Mocha.prototype.ui.call(this, ui);
  this.suite.emit('pre-require', global, null, this);
  return this;
};

/**
 * Setup mocha with the given setting options.
 */

mocha.setup = function(opts){
  if ('string' == typeof opts) opts = { ui: opts };
  for (var opt in opts) this[opt](opts[opt]);
  return this;
};

/**
 * Run mocha, returning the Runner.
 */

mocha.run = function(fn){
  var options = mocha.options;
  mocha.globals('location');

  var query = Mocha.utils.parseQuery(global.location.search || '');
  if (query.grep) mocha.grep(query.grep);
  if (query.invert) mocha.invert();

  return Mocha.prototype.run.call(mocha, function(err){
    // The DOM Document is not available in Web Workers.
    if (global.document) {
      Mocha.utils.highlightTags('code');
    }
    if (fn) fn(err);
  });
};

/**
 * Expose the process shim.
 */

Mocha.process = process;
})();
(function() {
var style = document.createElement('style');
style.textContent = '@charset "utf-8";\n\nbody {\n  margin:0;\n}\n\n#mocha {\n  font: 20px/1.5 "Helvetica Neue", Helvetica, Arial, sans-serif;\n  margin: 60px 50px;\n}\n\n#mocha ul,\n#mocha li {\n  margin: 0;\n  padding: 0;\n}\n\n#mocha ul {\n  list-style: none;\n}\n\n#mocha h1,\n#mocha h2 {\n  margin: 0;\n}\n\n#mocha h1 {\n  margin-top: 15px;\n  font-size: 1em;\n  font-weight: 200;\n}\n\n#mocha h1 a {\n  text-decoration: none;\n  color: inherit;\n}\n\n#mocha h1 a:hover {\n  text-decoration: underline;\n}\n\n#mocha .suite .suite h1 {\n  margin-top: 0;\n  font-size: .8em;\n}\n\n#mocha .hidden {\n  display: none;\n}\n\n#mocha h2 {\n  font-size: 12px;\n  font-weight: normal;\n  cursor: pointer;\n}\n\n#mocha .suite {\n  margin-left: 15px;\n}\n\n#mocha .test {\n  margin-left: 15px;\n  overflow: hidden;\n}\n\n#mocha .test.pending:hover h2::after {\n  content: \'(pending)\';\n  font-family: arial, sans-serif;\n}\n\n#mocha .test.pass.medium .duration {\n  background: #c09853;\n}\n\n#mocha .test.pass.slow .duration {\n  background: #b94a48;\n}\n\n#mocha .test.pass::before {\n  content: \'✓\';\n  font-size: 12px;\n  display: block;\n  float: left;\n  margin-right: 5px;\n  color: #00d6b2;\n}\n\n#mocha .test.pass .duration {\n  font-size: 9px;\n  margin-left: 5px;\n  padding: 2px 5px;\n  color: #fff;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.2);\n  -moz-box-shadow: inset 0 1px 1px rgba(0,0,0,.2);\n  box-shadow: inset 0 1px 1px rgba(0,0,0,.2);\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  -ms-border-radius: 5px;\n  -o-border-radius: 5px;\n  border-radius: 5px;\n}\n\n#mocha .test.pass.fast .duration {\n  display: none;\n}\n\n#mocha .test.pending {\n  color: #0b97c4;\n}\n\n#mocha .test.pending::before {\n  content: \'◦\';\n  color: #0b97c4;\n}\n\n#mocha .test.fail {\n  color: #c00;\n}\n\n#mocha .test.fail pre {\n  color: black;\n}\n\n#mocha .test.fail::before {\n  content: \'✖\';\n  font-size: 12px;\n  display: block;\n  float: left;\n  margin-right: 5px;\n  color: #c00;\n}\n\n#mocha .test pre.error {\n  color: #c00;\n  max-height: 300px;\n  overflow: auto;\n}\n\n/**\n * (1): approximate for browsers not supporting calc\n * (2): 42 = 2*15 + 2*10 + 2*1 (padding + margin + border)\n *      ^^ seriously\n */\n#mocha .test pre {\n  display: block;\n  float: left;\n  clear: left;\n  font: 12px/1.5 monaco, monospace;\n  margin: 5px;\n  padding: 15px;\n  border: 1px solid #eee;\n  max-width: 85%; /*(1)*/\n  max-width: calc(100% - 42px); /*(2)*/\n  word-wrap: break-word;\n  border-bottom-color: #ddd;\n  -webkit-border-radius: 3px;\n  -webkit-box-shadow: 0 1px 3px #eee;\n  -moz-border-radius: 3px;\n  -moz-box-shadow: 0 1px 3px #eee;\n  border-radius: 3px;\n}\n\n#mocha .test h2 {\n  position: relative;\n}\n\n#mocha .test a.replay {\n  position: absolute;\n  top: 3px;\n  right: 0;\n  text-decoration: none;\n  vertical-align: middle;\n  display: block;\n  width: 15px;\n  height: 15px;\n  line-height: 15px;\n  text-align: center;\n  background: #eee;\n  font-size: 15px;\n  -moz-border-radius: 15px;\n  border-radius: 15px;\n  -webkit-transition: opacity 200ms;\n  -moz-transition: opacity 200ms;\n  transition: opacity 200ms;\n  opacity: 0.3;\n  color: #888;\n}\n\n#mocha .test:hover a.replay {\n  opacity: 1;\n}\n\n#mocha-report.pass .test.fail {\n  display: none;\n}\n\n#mocha-report.fail .test.pass {\n  display: none;\n}\n\n#mocha-report.pending .test.pass,\n#mocha-report.pending .test.fail {\n  display: none;\n}\n#mocha-report.pending .test.pass.pending {\n  display: block;\n}\n\n#mocha-error {\n  color: #c00;\n  font-size: 1.5em;\n  font-weight: 100;\n  letter-spacing: 1px;\n}\n\n#mocha-stats {\n  position: fixed;\n  top: 15px;\n  right: 10px;\n  font-size: 12px;\n  margin: 0;\n  color: #888;\n  z-index: 1;\n}\n\n#mocha-stats .progress {\n  float: right;\n  padding-top: 0;\n}\n\n#mocha-stats em {\n  color: black;\n}\n\n#mocha-stats a {\n  text-decoration: none;\n  color: inherit;\n}\n\n#mocha-stats a:hover {\n  border-bottom: 1px solid #eee;\n}\n\n#mocha-stats li {\n  display: inline-block;\n  margin: 0 5px;\n  list-style: none;\n  padding-top: 11px;\n}\n\n#mocha-stats canvas {\n  width: 40px;\n  height: 40px;\n}\n\n#mocha code .comment { color: #ddd; }\n#mocha code .init { color: #2f6fad; }\n#mocha code .string { color: #5890ad; }\n#mocha code .keyword { color: #8a6343; }\n#mocha code .number { color: #2f6fad; }\n\n@media screen and (max-device-width: 480px) {\n  #mocha {\n    margin: 60px 0px;\n  }\n\n  #mocha #stats {\n    position: absolute;\n  }\n}\n';
document.head.appendChild(style);
})();
// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
//
// This code may only be used under the BSD style license found at polymer.github.io/LICENSE.txt
// The complete set of authors may be found at polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also subject to
// an additional IP rights grant found at polymer.github.io/PATENTS.txt
(function(scope) {
'use strict';

function parse(stack) {
  var rawLines = stack.split('\n');

  var stackyLines = compact(rawLines.map(parseStackyLine));
  if (stackyLines.length === rawLines.length) return stackyLines;

  var v8Lines = compact(rawLines.map(parseV8Line));
  if (v8Lines.length > 0) return v8Lines;

  var geckoLines = compact(rawLines.map(parseGeckoLine));
  if (geckoLines.length > 0) return geckoLines;

  throw new Error('Unknown stack format: ' + stack);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack
var GECKO_LINE = /^(?:([^@]*)@)?(.*?):(\d+)(?::(\d+))?$/;

function parseGeckoLine(line) {
  var match = line.match(GECKO_LINE);
  if (!match) return null;
  return {
    method:   match[1] || '',
    location: match[2] || '',
    line:     parseInt(match[3]) || 0,
    column:   parseInt(match[4]) || 0,
  };
}

// https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
var V8_OUTER1 = /^\s*(eval )?at (.*) \((.*)\)$/;
var V8_OUTER2 = /^\s*at()() (\S+)$/;
var V8_INNER  = /^\(?([^\(]+):(\d+):(\d+)\)?$/;

function parseV8Line(line) {
  var outer = line.match(V8_OUTER1) || line.match(V8_OUTER2);
  if (!outer) return null;
  var inner = outer[3].match(V8_INNER);
  if (!inner) return null;

  var method = outer[2] || '';
  if (outer[1]) method = 'eval at ' + method;
  return {
    method:   method,
    location: inner[1] || '',
    line:     parseInt(inner[2]) || 0,
    column:   parseInt(inner[3]) || 0,
  };
}

// Stacky.formatting.pretty

var STACKY_LINE = /^\s*(.+) at (.+):(\d+):(\d+)$/;

function parseStackyLine(line) {
  var match = line.match(STACKY_LINE);
  if (!match) return null;
  return {
    method:   match[1] || '',
    location: match[2] || '',
    line:     parseInt(match[3]) || 0,
    column:   parseInt(match[4]) || 0,
  };
}

// Helpers

function compact(array) {
  var result = [];
  array.forEach(function(value) {
    if (value) {
      result.push(value);
    }
  });
  return result;
}

scope.parse           = parse;
scope.parseGeckoLine  = parseGeckoLine;
scope.parseV8Line     = parseV8Line;
scope.parseStackyLine = parseStackyLine;
})(typeof module !== 'undefined' ? module.exports : (this.Stacky = this.Stacky || {}));

// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
//
// This code may only be used under the BSD style license found at polymer.github.io/LICENSE.txt
// The complete set of authors may be found at polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also subject to
// an additional IP rights grant found at polymer.github.io/PATENTS.txt
(function(scope) {
'use strict';

var parse = scope.parse || require('./parsing').parse;

scope.defaults = {
  // Methods are aligned up to this much padding.
  maxMethodPadding: 40,
  // A string to prefix each line with.
  indent: '',
  // A string to show for stack lines that are missing a method.
  methodPlaceholder: '<unknown>',
  // A list of Strings/RegExps that will be stripped from `location` values on
  // each line (via `String#replace`).
  locationStrip: [],
  // A list of Strings/RegExps that indicate that a line is *not* important, and
  // should be styled as such.
  unimportantLocation: [],
  // A filter function to completely remove lines
  filter: function() { return false; },
  // styles are functions that take a string and return that string when styled.
  styles: {
    method:      passthrough,
    location:    passthrough,
    line:        passthrough,
    column:      passthrough,
    unimportant: passthrough,
  },
};

// For Stacky-in-Node, we default to colored stacks.
if (typeof require === 'function') {
  var chalk = require('chalk');

  scope.defaults.styles = {
    method:      chalk.magenta,
    location:    chalk.blue,
    line:        chalk.cyan,
    column:      chalk.cyan,
    unimportant: chalk.dim,
  };
}

function pretty(stackOrParsed, options) {
  options = mergeDefaults(options || {}, scope.defaults);
  var lines = Array.isArray(stackOrParsed) ? stackOrParsed : parse(stackOrParsed);
  lines = clean(lines, options);

  var padSize = methodPadding(lines, options);
  var parts = lines.map(function(line) {
    var method   = line.method || options.methodPlaceholder;
    var pad      = options.indent + padding(padSize - method.length);
    var location = [
      options.styles.location(line.location),
      options.styles.line(line.line),
      options.styles.column(line.column),
    ].join(':');

    var text = pad + options.styles.method(method) + ' at ' + location;
    if (!line.important) {
      text = options.styles.unimportant(text);
    }
    return text;
  });

  return parts.join('\n');
}

function clean(lines, options) {
  var result = [];
  for (var i = 0, line; line = lines[i]; i++) {
    if (options.filter(line)) continue;
    line.location  = cleanLocation(line.location, options);
    line.important = isImportant(line, options);
    result.push(line);
  }

  return result;
}

// Utility

function passthrough(string) {
  return string;
}

function mergeDefaults(options, defaults) {
  var result = Object.create(defaults);
  Object.keys(options).forEach(function(key) {
    var value = options[key];
    if (typeof value === 'object' && !Array.isArray(value)) {
      value = mergeDefaults(value, defaults[key]);
    }
    result[key] = value;
  });
  return result;
}

function methodPadding(lines, options) {
  var size = options.methodPlaceholder.length;
  for (var i = 0, line; line = lines[i]; i++) {
    size = Math.min(options.maxMethodPadding, Math.max(size, line.method.length));
  }
  return size;
}

function padding(length) {
  var result = '';
  for (var i = 0; i < length; i++) {
    result = result + ' ';
  }
  return result;
}

function cleanLocation(location, options) {
  if (options.locationStrip) {
    for (var i = 0, matcher; matcher = options.locationStrip[i]; i++) {
      location = location.replace(matcher, '');
    }
  }

  return location;
}

function isImportant(line, options) {
  if (options.unimportantLocation) {
    for (var i = 0, matcher; matcher = options.unimportantLocation[i]; i++) {
      if (line.location.match(matcher)) return false;
    }
  }

  return true;
}

scope.clean  = clean;
scope.pretty = pretty;
})(typeof module !== 'undefined' ? module.exports : (this.Stacky = this.Stacky || {}));


// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
//
// This code may only be used under the BSD style license found at polymer.github.io/LICENSE.txt
// The complete set of authors may be found at polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also subject to
// an additional IP rights grant found at polymer.github.io/PATENTS.txt
(function(scope) {
'use strict';

var parse  = scope.parse  || require('./parsing').parse;
var pretty = scope.pretty || require('./formatting').pretty;

function normalize(error, prettyOptions) {
  if (error.parsedStack) return error;
  var message = error.message || error.description || error || '<unknown error>';
  var parsedStack = [];
  try {
    parsedStack = parse(error.stack || error.toString());
  } catch (error) {
    // Ah well.
  }

  if (parsedStack.length === 0 && error.fileName) {
    parsedStack.push({
      method:   '',
      location: error.fileName,
      line:     error.lineNumber,
      column:   error.columnNumber,
    });
  }

  var prettyStack = message;
  if (parsedStack.length > 0) {
    prettyStack = prettyStack + '\n' + pretty(parsedStack, prettyOptions);
  }

  return {
    message:     message,
    stack:       prettyStack,
    parsedStack: parsedStack,
  };
}

scope.normalize = normalize;
})(typeof module !== 'undefined' ? module.exports : (this.Stacky = this.Stacky || {}));


/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
/**
 * @fileoverview
 *
 * Your entry point into `web-component-tester`'s environment and configuration.
 */
(function() {

var WCT = window.WCT = {
  reporters: {},
};

// Configuration

/** By default, we wait for any web component frameworks to load. */
WCT.waitForFrameworks = true;

/** How many `.html` suites that can be concurrently loaded & run. */
WCT.numConcurrentSuites = 1;

// Helpers

// Evaluated in mocha/run.js.
WCT._suitesToLoad = [];
WCT._dependencies = [];

// Used to share data between subSuites on client and reporters on server
WCT.share = {};

/**
 * Loads suites of tests, supporting `.js` as well as `.html` files.
 *
 * @param {!Array.<string>} files The files to load.
 */
WCT.loadSuites = function loadSuites(files) {
  files.forEach(function(file) {
    if (file.slice(-3) === '.js') {
      WCT._dependencies.push(file);
    } else if (file.slice(-5) === '.html') {
      WCT._suitesToLoad.push(file);
    } else {
      throw new Error('Unknown resource type: ' + file);
    }
  });
};

})();

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
(function() {

WCT.util = {};

/**
 * @param {function()} callback A function to call when the active web component
 *     frameworks have loaded.
 */
WCT.util.whenFrameworksReady = function(callback) {
  WCT.util.debug(window.location.pathname, 'WCT.util.whenFrameworksReady');
  var done = function() {
    WCT.util.debug(window.location.pathname, 'WCT.util.whenFrameworksReady done');
    callback();
  };

  function importsReady() {
    window.removeEventListener('HTMLImportsLoaded', importsReady);
    WCT.util.debug(window.location.pathname, 'HTMLImportsLoaded');

    if (window.Polymer && Polymer.whenReady) {
      Polymer.whenReady(function() {
        WCT.util.debug(window.location.pathname, 'polymer-ready');
        done();
      });
    } else {
      done();
    }
  }

  // All our supported framework configurations depend on imports.
  if (!window.HTMLImports) {
    done();
  } else if (HTMLImports.ready) {
    importsReady();
  } else {
    window.addEventListener('HTMLImportsLoaded', importsReady);
  }
};

/**
 * @param {number} count
 * @param {string} kind
 * @return {string} '<count> <kind> tests' or '<count> <kind> test'.
 */
WCT.util.pluralizedStat = function pluralizedStat(count, kind) {
  if (count === 1) {
    return count + ' ' + kind + ' test';
  } else {
    return count + ' ' + kind + ' tests';
  }
};

/**
 * @param {string} path The URI of the script to load.
 * @param {function} done
 */
WCT.util.loadScript = function loadScript(path, done) {
  var script = document.createElement('script');
  script.src = path + '?' + Math.random();
  script.onload = done.bind(null, null);
  script.onerror = done.bind(null, 'Failed to load script ' + script.src);
  document.head.appendChild(script);
};

/**
 * @param {...*} var_args Logs values to the console when `WCT.debug` is true.
 */
WCT.util.debug = function debug(var_args) {
  if (!WCT.debug) return;
  console.debug.apply(console, arguments);
};

// URL Processing

/**
 * @param {string} opt_query A query string to parse.
 * @return {!Object.<string, !Array.<string>>} All params on the URL's query.
 */
WCT.util.getParams = function getParams(opt_query) {
  var query = opt_query || window.location.search;
  if (query.substring(0, 1) === '?') {
    query = query.substring(1);
  }
  // python's SimpleHTTPServer tacks a `/` on the end of query strings :(
  if (query.slice(-1) === '/') {
    query = query.substring(0, query.length - 1);
  }
  if (query === '') return {};

  var result = {};
  query.split('&').forEach(function(part) {
    var pair = part.split('=');
    if (pair.length !== 2) {
      console.warn('Invalid URL query part:', part);
      return;
    }
    var key   = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);

    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(value);
  });

  return result;
};

/**
 * @param {string} param The param to return a value for.
 * @return {?string} The first value for `param`, if found.
 */
WCT.util.getParam = function getParam(param) {
  var params = WCT.util.getParams();
  return params[param] ? params[param][0] : null;
};

/**
 * @param {!Object.<string, !Array.<string>>} params
 * @return {string} `params` encoded as a URI query.
 */
WCT.util.paramsToQuery = function paramsToQuery(params) {
  var pairs = [];
  Object.keys(params).forEach(function(key) {
    params[key].forEach(function(value) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
  });
  return '?' + pairs.join('&');
};

/** @return {string} `location` relative to the current window. */
WCT.util.relativeLocation = function relativeLocation(location) {
  var path = location.pathname;
  var basePath = window.location.pathname.match(/^.*\//)[0];
  if (path.indexOf(basePath) === 0) {
    path = path.substring(basePath.length);
  }
  return path;
};

/**
 * Like `async.parallelLimit`, but our own so that we don't force a dependency
 * on downstream code.
 *
 * @param {!Array.<function(function(*))>} runners Runners that call their given
 *     Node-style callback when done.
 * @param {number|function(*)} limit Maximum number of concurrent runners.
 *     (optional).
 * @param {?function(*)} done Callback that should be triggered once all runners
 *     have completed, or encountered an error.
 */
WCT.util.parallel = function parallel(runners, limit, done) {
  if (typeof limit !== 'number') {
    done  = limit;
    limit = 0;
  }
  if (!runners.length) return done();

  var called    = false;
  var total     = runners.length;
  var numActive = 0;
  var numDone   = 0;

  function runnerDone(error) {
    if (called) return;
    numDone = numDone + 1;
    numActive = numActive - 1;

    if (error || numDone >= total) {
      called = true;
      done(error);
    } else {
      runOne();
    }
  }

  function runOne() {
    if (limit && numActive >= limit) return;
    if (!runners.length) return;
    numActive = numActive + 1;
    runners.shift()(runnerDone);
  }
  runners.forEach(runOne);
};

})();

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
(function() {

WCT.CLISocket = CLISocket;

var SOCKETIO_ENDPOINT = window.location.protocol + '//' + window.location.host;
var SOCKETIO_LIBRARY  = SOCKETIO_ENDPOINT + '/socket.io/socket.io.js';

/**
 * A socket for communication between the CLI and browser runners.
 *
 * @param {string} browserId An ID generated by the CLI runner.
 * @param {!io.Socket} socket The socket.io `Socket` to communicate over.
 */
function CLISocket(browserId, socket) {
  this.browserId = browserId;
  this.socket    = socket;
}

/**
 * @param {!Mocha.Runner} runner The Mocha `Runner` to observe, reporting
 *     interesting events back to the CLI runner.
 */
CLISocket.prototype.observe = function observe(runner) {
  this.emitEvent('browser-start', {
    url: window.location.toString(),
  });

  // We only emit a subset of events that we care about, and follow a more
  // general event format that is hopefully applicable to test runners beyond
  // mocha.
  //
  // For all possible mocha events, see:
  // https://github.com/visionmedia/mocha/blob/master/lib/runner.js#L36
  runner.on('test', function(test) {
    this.emitEvent('test-start', {test: getTitles(test)});
  }.bind(this));

  runner.on('test end', function(test) {
    this.emitEvent('test-end', {
      state:    getState(test),
      test:     getTitles(test),
      duration: test.duration,
      error:    test.err,
    });
  }.bind(this));

  runner.on('subSuite start', function(subSuite) {
    this.emitEvent('sub-suite-start', subSuite.share);
  }.bind(this));

  runner.on('subSuite end', function(subSuite) {
    this.emitEvent('sub-suite-end', subSuite.share);
  }.bind(this));

  runner.on('end', function() {
    this.emitEvent('browser-end');
  }.bind(this));
};

/**
 * @param {string} event The name of the event to fire.
 * @param {*} data Additional data to pass with the event.
 */
CLISocket.prototype.emitEvent = function emitEvent(event, data) {
  this.socket.emit('client-event', {
    browserId: this.browserId,
    event:     event,
    data:      data,
  });
};

/**
 * Builds a `CLISocket` if we are within a CLI-run environment; short-circuits
 * otherwise.
 *
 * @param {function(*, CLISocket)} done Node-style callback.
 */
CLISocket.init = function init(done) {
  var browserId = WCT.util.getParam('cli_browser_id');
  if (!browserId) return done();

  WCT.util.loadScript(SOCKETIO_LIBRARY, function(error) {
    if (error) return done(error);

    var socket = io(SOCKETIO_ENDPOINT);
    socket.on('error', function(error) {
      socket.off();
      done(error);
    });

    socket.on('connect', function() {
      socket.off();
      done(null, new CLISocket(browserId, socket));
    });
  });
};

// Misc Utility

/**
 * @param {!Mocha.Runnable} runnable The test or suite to extract titles from.
 * @return {!Array.<string>} The titles of the runnable and its parents.
 */
function getTitles(runnable) {
  var titles = [];
  while (runnable && !runnable.root && runnable.title) {
    titles.unshift(runnable.title);
    runnable = runnable.parent;
  }
  return titles;
}

/**
 * @param {!Mocha.Runnable} runnable
 * @return {string}
 */
function getState(runnable) {
  if (runnable.state === 'passed') {
    return 'passing';
  } else if (runnable.state == 'failed') {
    return 'failing';
  } else if (runnable.pending) {
    return 'pending';
  } else {
    return 'unknown';
  }
}

})();

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
(function() {

// TODO(thedeeno): Consider renaming subsuite. IIRC, subSuite is entirely
// distinct from mocha suite, which tripped me up badly when trying to add
// plugin support. Perhaps something like 'batch', or 'bundle'. Something that
// has no mocha correlate. This may also eliminate the need for root/non-root
// suite distinctions.

/**
 * A Mocha suite (or suites) run within a child iframe, but reported as if they
 * are part of the current context.
 */
function SubSuite(url, parentScope) {
  var params = WCT.util.getParams(parentScope.location.search);
  delete params.cli_browser_id;
  params.bust = [Math.random()];

  this.url         = url + WCT.util.paramsToQuery(params);
  this.parentScope = parentScope;

  this.state = 'initializing';
}
WCT.SubSuite = SubSuite;

// SubSuites get a pretty generous load timeout by default.
SubSuite.loadTimeout = 30000;

// We can't maintain properties on iframe elements in Firefox/Safari/???, so we
// track subSuites by URL.
SubSuite._byUrl = {};

/**
 * @return {SubSuite} The `SubSuite` that was registered for this window.
 */
SubSuite.current = function() {
  return SubSuite.get(window);
};

/**
 * @param {!Window} target A window to find the SubSuite of.
 * @param {boolean} traversal Whether this is a traversal from a child window.
 * @return {SubSuite} The `SubSuite` that was registered for `target`.
 */
SubSuite.get = function(target, traversal) {
  var subSuite = SubSuite._byUrl[target.location.href];
  if (subSuite) return subSuite;
  if (window.parent === window) {
    if (traversal) {
      // I really hope there's no legit case for this. Infinite reloads are no good.
      console.warn('Subsuite loaded but was never registered. This most likely is due to wonky history behavior. Reloading...');
      window.location.reload();
    } else {
      return null;
    }
  }
  // Otherwise, traverse.
  return window.parent.WCT.SubSuite.get(target, true);
};

/**
 * Hangs a reference to the SubSuite's iframe-local wct object
 *
 * TODO(thedeeno): This method is odd to document so the achitecture might need
 * a little rework here. Maybe another named concept? Seeing WCT everywhere is
 * pretty confusing. Also, I don't think we need the parentScope.WCT; to limit
 * confusion I didn't include it.
 *
 * @param {object} wct The SubSuite's iframe-local wct object
 */
SubSuite.prototype.prepare = function(wct) {
  this.share = wct.share;
};

/**
 * Loads and runs the subsuite.
 *
 * @param {function} done Node-style callback.
 */
SubSuite.prototype.run = function(done) {
  WCT.util.debug('SubSuite#run', this.url);
  this.state = 'loading';
  this.onRunComplete = done;

  this.iframe = document.createElement('iframe');
  this.iframe.src = this.url;
  this.iframe.classList.add('subsuite');

  var container = document.getElementById('subsuites');
  if (!container) {
    container = document.createElement('div');
    container.id = 'subsuites';
    document.body.appendChild(container);
  }
  container.appendChild(this.iframe);

  // let the iframe expand the URL for us.
  this.url = this.iframe.src;
  SubSuite._byUrl[this.url] = this;

  this.timeoutId = setTimeout(
      this.loaded.bind(this, new Error('Timed out loading ' + this.url)), SubSuite.loadTimeout);

  this.iframe.addEventListener('error',
      this.loaded.bind(this, new Error('Failed to load document ' + this.url)));

  this.iframe.contentWindow.addEventListener('DOMContentLoaded', this.loaded.bind(this, null));
};

/**
 * Called when the sub suite's iframe has loaded (or errored during load).
 *
 * @param {*} error The error that occured, if any.
 */
SubSuite.prototype.loaded = function(error) {
  WCT.util.debug('SubSuite#loaded', this.url, error);
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
  }
  if (error) {
    this.signalRunComplete(error);
    this.done();
  }
};

/** Called when the sub suite's tests are complete, so that it can clean up. */
SubSuite.prototype.done = function done() {
  WCT.util.debug('SubSuite#done', this.url, arguments);

  this.signalRunComplete();

  if (!this.iframe) return;
  this.iframe.parentNode.removeChild(this.iframe);
};

SubSuite.prototype.signalRunComplete = function signalRunComplete(error) {
  if (!this.onRunComplete) return;
  this.state = 'complete';
  this.onRunComplete(error);
  this.onRunComplete = null;
};

})();

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
(function() {

// polymer-test-tools (and Polymer/tools) support HTML tests where each file is
// expected to call `done()`, which posts a message to the parent window.
window.addEventListener('message', function(event) {
  if (!event.data || (event.data !== 'ok' && !event.data.error)) return;
  var subSuite = WCT.SubSuite.get(event.source);
  if (!subSuite) return;

  // The name of the suite as exposed to the user.
  var path = WCT.util.relativeLocation(event.source.location);
  var parentRunner = subSuite.parentScope.WCT._multiRunner;
  parentRunner.emitOutOfBandTest('page-wide tests via global done()', event.data.error, path, true);

  subSuite.done();
});

// Attempt to ensure that we complete a test suite if it is interrupted by a
// document unload.
window.addEventListener('unload', function(event) {
  // Mocha's hook queue is asynchronous; but we want synchronous behavior if
  // we've gotten to the point of unloading the document.
  Mocha.Runner.immediately = function(callback) { callback(); };
});

})();

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
(function() {

/**
 * Runs `stepFn`, catching any error and passing it to `callback` (Node-style).
 * Otherwise, calls `callback` with no arguments on success.
 *
 * @param {function()} callback
 * @param {function()} stepFn
 */
window.safeStep = function safeStep(callback, stepFn) {
  var err;
  try {
    stepFn();
  } catch (error) {
    err = error;
  }
  callback(err);
};

/**
 * Runs your test at declaration time (before Mocha has begun tests). Handy for
 * when you need to test document initialization.
 *
 * Be aware that any errors thrown asynchronously cannot be tied to your test.
 * You may want to catch them and pass them to the done event, instead. See
 * `safeStep`.
 *
 * @param {string} name The name of the test.
 * @param {function(?function())} testFn The test function. If an argument is
 *     accepted, the test will be treated as async, just like Mocha tests.
 */
window.testImmediate = function testImmediate(name, testFn) {
  if (testFn.length > 0) {
    return testImmediateAsync(name, testFn);
  }

  var err;
  try {
    testFn();
  } catch (error) {
    err = error;
  }

  test(name, function(done) {
    done(err);
  });
};

/**
 * An async-only variant of `testImmediate`.
 *
 * @param {string} name
 * @param {function(?function())} testFn
 */
window.testImmediateAsync = function testImmediateAsync(name, testFn) {
  var testComplete = false;
  var err;

  test(name, function(done) {
    var intervalId = setInterval(function() {
      if (!testComplete) return;
      clearInterval(intervalId);
      done(err);
    }, 10);
  });

  try {
    testFn(function(error) {
      if (error) err = error;
      testComplete = true;
    });
  } catch (error) {
    err = error;
  }
};

/**
 * Triggers a flush of any pending events, observations, etc and calls you back
 * after they have been processed.
 *
 * @param {function()} callback
 */
window.flush = function flush(callback) {
  // Ideally, this function would be a call to Polymer.flush, but that doesn't
  // support a callback yet (https://github.com/Polymer/polymer-dev/issues/115),
  // ...and there's cross-browser flakiness to deal with.

  // Make sure that we're invoking the callback with no arguments so that the
  // caller can pass Mocha callbacks, etc.
  var done = function done() { callback(); };

  // Because endOfMicrotask is flaky for IE, we perform microtask checkpoints
  // ourselves (https://github.com/Polymer/polymer-dev/issues/114):
  var isIE = navigator.appName == 'Microsoft Internet Explorer';
  if (isIE && window.Platform && window.Platform.performMicrotaskCheckpoint) {
    var reallyDone = done;
    done = function doneIE() {
      Platform.performMicrotaskCheckpoint();
      setTimeout(reallyDone, 0);
    };
  }

  // Everyone else gets a regular flush.
  var scope = window.Polymer || window.WebComponents;
  if (scope && scope.flush) {
    scope.flush();
  }

  // Ensure that we are creating a new _task_ to allow all active microtasks to
  // finish (the code you're testing may be using endOfMicrotask, too).
  setTimeout(done, 0);
};

/**
 * Advances a single animation frame.
 *
 * Calls `flush`, `requestAnimationFrame`, `flush`, and `callback` sequentially
 * @param {function()} callback
 */
window.animationFrameFlush = function animationFrameFlush(callback) {
  flush(function() {
    requestAnimationFrame(function() {
      flush(callback);
    });
  });
};

/**
 * DEPRECATED: Use `flush`.
 * @param {function} callback
 */
window.asyncPlatformFlush = function asyncPlatformFlush(callback) {
  console.warn('asyncPlatformFlush is deprecated in favor of the more terse flush()');
  return window.flush(callback);
};

/**
 *
 */
window.waitFor = function waitFor(fn, next, intervalOrMutationEl, timeout, timeoutTime) {
  timeoutTime = timeoutTime || Date.now() + (timeout || 1000);
  intervalOrMutationEl = intervalOrMutationEl || 32;
  try {
    fn();
  } catch (e) {
    if (Date.now() > timeoutTime) {
      throw e;
    } else {
      if (isNaN(intervalOrMutationEl)) {
        intervalOrMutationEl.onMutation(intervalOrMutationEl, function() {
          waitFor(fn, next, intervalOrMutationEl, timeout, timeoutTime);
        });
      } else {
        setTimeout(function() {
          waitFor(fn, next, intervalOrMutationEl, timeout, timeoutTime);
        }, intervalOrMutationEl);
      }
      return;
    }
  }
  next();
};

})();

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
(function() {

WCT.MultiRunner = MultiRunner;

var STACKY_CONFIG = {
  indent: '  ',
  locationStrip: [
    /^https?:\/\/[^\/]+/,
    /\?[\d\.]+$/,
  ],
  filter: function(line) {
    return line.location.match(/web-component-tester\/browser.js/);
  },
};

// https://github.com/visionmedia/mocha/blob/master/lib/runner.js#L36-46
var MOCHA_EVENTS = [
  'start',
  'end',
  'suite',
  'suite end',
  'test',
  'test end',
  'hook',
  'hook end',
  'pass',
  'fail',
  'pending',
];

// Until a suite has loaded, we assume this many tests in it.
var ESTIMATED_TESTS_PER_SUITE = 3;

/**
 * A Mocha-like runner that combines the output of multiple Mocha suites.
 *
 * @param {number} numSuites The number of suites that will be run, in order to
 *     estimate the total number of tests that will be performed.
 * @param {!Array.<!Mocha.reporters.Base>} reporters The set of reporters that
 *     should receive the unified event stream.
 */
function MultiRunner(numSuites, reporters) {
  this.reporters = reporters.map(function(reporter) {
    return new reporter(this);
  }.bind(this));

  this.total = numSuites * ESTIMATED_TESTS_PER_SUITE;
  // Mocha reporters assume a stream of events, so we have to be careful to only
  // report on one runner at a time...
  this.currentRunner = null;
  // ...while we buffer events for any other active runners.
  this.pendingEvents = [];

  this.emit('start');
}
// Mocha doesn't expose its `EventEmitter` shim directly, so:
MultiRunner.prototype = Object.create(Object.getPrototypeOf(Mocha.Runner.prototype));

/**
 * @return {!Mocha.reporters.Base} A reporter-like "class" for each child suite
 *     that should be passed to `mocha.run`.
 */
MultiRunner.prototype.childReporter = function childReporter(name) {
  // The reporter is used as a constructor, so we can't depend on `this` being
  // properly bound.
  var self = this;
  function reporter(runner) {
    runner.name = name;
    self.bindChildRunner(runner);
  }
  reporter.title = name;
  return reporter;
};

/** Must be called once all runners have finished. */
MultiRunner.prototype.done = function done() {
  this.complete = true;
  this.emit('end');
  this.flushPendingEvents();
};

/**
 * Emit a top level test that is not part of any suite managed by this runner.
 *
 * Helpful for reporting on global errors, loading issues, etc.
 *
 * @param {string} title The title of the test.
 * @param {*} opt_error An error associated with this test. If falsy, test is
 *     considered to be passing.
 * @param {string} opt_suiteTitle Title for the suite that's wrapping the test.
 * @param {?boolean} opt_estimated If this test was included in the original
 *     estimate of `numSuites`.
 */
MultiRunner.prototype.emitOutOfBandTest = function emitOutOfBandTest(title, opt_error, opt_suiteTitle, opt_estimated) {
  WCT.util.debug('MultiRunner#emitOutOfBandTest(', arguments, ')');
  var root = new Mocha.Suite();
  root.title = opt_suiteTitle;
  var test = new Mocha.Test(title, function() {
  });
  test.parent = root;
  test.state  = opt_error ? 'failed' : 'passed';
  test.err    = opt_error;

  if (!opt_estimated) {
    this.total = this.total + ESTIMATED_TESTS_PER_SUITE;
  }

  var runner = {total: 1};
  this.proxyEvent('start', runner);
  this.proxyEvent('suite', runner, root);
  this.proxyEvent('test', runner, test);
  if (opt_error) {
    this.proxyEvent('fail', runner, test, opt_error);
  } else {
    this.proxyEvent('pass', runner, test);
  }
  this.proxyEvent('test end', runner, test);
  this.proxyEvent('suite end', runner, root);
  this.proxyEvent('end', runner);
};

// Internal Interface

/** @param {!Mocha.runners.Base} runner The runner to listen to events for. */
MultiRunner.prototype.bindChildRunner = function bindChildRunner(runner) {
  MOCHA_EVENTS.forEach(function(eventName) {
    runner.on(eventName, this.proxyEvent.bind(this, eventName, runner));
  }.bind(this));
};

/**
 * Evaluates an event fired by `runner`, proxying it forward or buffering it.
 *
 * @param {string} eventName
 * @param {!Mocha.runners.Base} runner The runner that emitted this event.
 * @param {...*} var_args Any additional data passed as part of the event.
 */
MultiRunner.prototype.proxyEvent = function proxyEvent(eventName, runner, var_args) {
  var extraArgs = Array.prototype.slice.call(arguments, 2);
  if (this.complete) {
    console.warn('out of order Mocha event for ' + runner.name + ':', eventName, extraArgs);
    return;
  }

  if (this.currentRunner && runner !== this.currentRunner) {
    this.pendingEvents.push(arguments);
    return;
  }
  WCT.util.debug('MultiRunner#proxyEvent(', arguments, ')');

  // This appears to be a Mocha bug: Tests failed by passing an error to their
  // done function don't set `err` properly.
  //
  // TODO(nevir): Track down.
  if (eventName === 'fail' && !extraArgs[0].err) {
    extraArgs[0].err = extraArgs[1];
  }

  if (eventName === 'start') {
    this.onRunnerStart(runner);
  } else if (eventName === 'end') {
    this.onRunnerEnd(runner);
  } else {
    this.cleanEvent(eventName, runner, extraArgs);
    this.emit.apply(this, [eventName].concat(extraArgs));
  }
};

/**
 * Cleans or modifies an event if needed.
 *
 * @param {string} eventName
 * @param {!Mocha.runners.Base} runner The runner that emitted this event.
 * @param {!Array.<*>} extraArgs
 */
MultiRunner.prototype.cleanEvent = function cleanEvent(eventName, runner, extraArgs) {
  // Suite hierarchy
  if (extraArgs[0]) {
    extraArgs[0] = this.showRootSuite(extraArgs[0]);
  }

  // Normalize errors
  if (eventName === 'fail') {
    extraArgs[1] = Stacky.normalize(extraArgs[1], STACKY_CONFIG);
  }
  if (extraArgs[0] && extraArgs[0].err) {
    extraArgs[0].err = Stacky.normalize(extraArgs[0].err, STACKY_CONFIG);
  }
};

/**
 * We like to show the root suite's title, which requires a little bit of
 * trickery in the suite hierarchy.
 *
 * @param {!Mocha.Runnable} node
 */
MultiRunner.prototype.showRootSuite = function showRootSuite(node) {
  var leaf = node = Object.create(node);
  while (node && !node.root) {
    var wrappedParent = Object.create(node.parent);
    node.parent = wrappedParent;
    node = wrappedParent;
  }
  node.root = false;

  return leaf;
};

/** @param {!Mocha.runners.Base} runner */
MultiRunner.prototype.onRunnerStart = function onRunnerStart(runner) {
  WCT.util.debug('MultiRunner#onRunnerStart:', runner.name);
  this.total = this.total - ESTIMATED_TESTS_PER_SUITE + runner.total;
  this.currentRunner = runner;
};

/** @param {!Mocha.runners.Base} runner */
MultiRunner.prototype.onRunnerEnd = function onRunnerEnd(runner) {
  WCT.util.debug('MultiRunner#onRunnerEnd:', runner.name);
  this.currentRunner = null;
  this.flushPendingEvents();
};

/**
 * Flushes any buffered events and runs them through `proxyEvent`. This will
 * loop until all buffered runners are complete, or we have run out of buffered
 * events.
 */
MultiRunner.prototype.flushPendingEvents = function flushPendingEvents() {
  var events = this.pendingEvents;
  this.pendingEvents = [];
  events.forEach(function(eventArgs) {
    this.proxyEvent.apply(this, eventArgs);
  }.bind(this));
};

})();

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
/**
 * @fileoverview
 *
 * Runs all tests described by this document, after giving the document a chance
 * to load.
 *
 * If `WCT.waitForFrameworks` is true (the default), we will also wait for any
 * present web component frameworks to have fully initialized as well.
 */
(function() {

// We do a bit of our own grep processing to speed things up.
var grep = WCT.util.getParam('grep');

// environment.js is optional; we need to take a look at our script's URL in
// order to determine how (or not) to load it.
var prefix  = window.WCTPrefix;
var loadEnv = !window.WCTSkipEnvironment;

var scripts = document.querySelectorAll('script[src*="browser.js"]');
if (scripts.length !== 1 && !prefix) {
  throw new Error('Unable to detect root URL for WCT. Please set WCTPrefix before including browser.js');
}
if (scripts[0]) {
  var thisScript = scripts[0].src;
  prefix  = thisScript.substring(0, thisScript.indexOf('browser.js'));
  // You can tack ?skipEnv onto the browser URL to skip the default environment.
  loadEnv = thisScript.indexOf('skipEnv') === -1;
}
if (loadEnv) {
  // Synchronous load so that we can guarantee it is set up for early tests.
  document.write('<script src="' + prefix + 'environment.js"></script>'); // jshint ignore:line
}

// Give any scripts on the page a chance to twiddle the environment.
document.addEventListener('DOMContentLoaded', function() {
  WCT.util.debug('run stage: DOMContentLoaded');
  var subSuite = WCT.SubSuite.current();
  if (subSuite) {
    WCT.util.debug('run stage: subsuite');
    // Give the subsuite time to complete its load (see `SubSuite.load`).
    setTimeout(runSubSuite.bind(null, subSuite), 0);
    return;
  }

  // Before anything else, we need to ensure our communication channel with the
  // CLI runner is established (if we're running in that context). Less
  // buffering to deal with.
  WCT.CLISocket.init(function(error, socket) {
    WCT.util.debug('run stage: WCT.CLISocket.init done', error);
    if (error) throw error;
    var subsuites = WCT._suitesToLoad;
    if (grep) {
      var cleanSubsuites = [];
      for (var i = 0, subsuite; subsuite = subsuites[i]; i++) {
        if (subsuite.indexOf(grep) === 0) {
          cleanSubsuites.push(subsuite);
        }
      }
      subsuites = cleanSubsuites;
    }

    var runner = newMultiSuiteRunner(subsuites, determineReporters(socket));

    loadDependencies(runner, function(error) {
      WCT.util.debug('run stage: loadDependencies done', error);
      if (error) throw error;

      runMultiSuite(runner, subsuites);
    });
  });
});

/**
 * Loads any dependencies of the _current_ suite (e.g. `.js` sources).
 *
 * @param {!WCT.MultiRunner} runner The runner where errors should be reported.
 * @param {function} done A node style callback.
 */
function loadDependencies(runner, done) {
  WCT.util.debug('loadDependencies:', WCT._dependencies);

  function onError(event) {
    runner.emitOutOfBandTest('Test Suite Initialization', event.error);
  }
  window.addEventListener('error', onError);

  var loaders = WCT._dependencies.map(function(file) {
    // We only support `.js` dependencies for now.
    return WCT.util.loadScript.bind(WCT.util, file);
  });

  WCT.util.parallel(loaders, function(error) {
    window.removeEventListener('error', onError);
    done(error);
  });
}

/**
 * @param {!WCT.SubSuite} subSuite The `SubSuite` for this frame, that `mocha`
 *     should be run for.
 */
function runSubSuite(subSuite) {
  WCT.util.debug('runSubSuite', window.location.pathname);
  // Not very pretty.
  var parentWCT = subSuite.parentScope.WCT;
  subSuite.prepare(WCT);

  var suiteName = parentWCT.util.relativeLocation(window.location);
  var reporter  = parentWCT._multiRunner.childReporter(suiteName);
  runMocha(reporter, subSuite.done.bind(subSuite));
}

/**
 * @param {!Array.<string>} subsuites The subsuites that will be run.
 * @param {!Array.<!Mocha.reporters.Base>} reporters The reporters that should
 *     consume the output of this `MultiRunner`.
 * @return {!WCT.MultiRunner} The runner for our root suite.
 */
function newMultiSuiteRunner(subsuites, reporters) {
  WCT.util.debug('newMultiSuiteRunner', window.location.pathname);
  WCT._multiRunner = new WCT.MultiRunner(subsuites.length + 1, reporters);
  return WCT._multiRunner;
}

/**
 * @param {!WCT.MultiRunner} The runner built via `newMultiSuiteRunner`.
 * @param {!Array.<string>} subsuites The subsuites to run.
 */
function runMultiSuite(runner, subsuites) {
  WCT.util.debug('runMultiSuite', window.location.pathname);
  var rootName = WCT.util.relativeLocation(window.location);

  var suiteRunners = [
    // Run the local tests (if any) first, not stopping on error;
    runMocha.bind(null, runner.childReporter(rootName)),
  ];

  // As well as any sub suites. Again, don't stop on error.
  subsuites.forEach(function(file) {
    suiteRunners.push(function(next) {
      var subSuite = new WCT.SubSuite(file, window);
      runner.emit('subSuite start', subSuite);
      subSuite.run(function(error) {
        runner.emit('subSuite end', subSuite);

        if (error) runner.emitOutOfBandTest(file, error);
        next();
      });
    });
  });

  WCT.util.parallel(suiteRunners, WCT.numConcurrentSuites, function(error) {
    WCT.util.debug('runMultiSuite done', error);
    runner.done();
  });
}

/**
 * Kicks off a mocha run, waiting for frameworks to load if necessary.
 *
 * @param {!Mocha.reporters.Base} reporter The reporter to pass to `mocha.run`.
 * @param {function} done A callback fired, _no error is passed_.
 */
function runMocha(reporter, done, waited) {
  if (WCT.waitForFrameworks && !waited) {
    WCT.util.whenFrameworksReady(runMocha.bind(null, reporter, done, true));
    return;
  }
  WCT.util.debug('runMocha', window.location.pathname);

  mocha.reporter(reporter);
  mocha.suite.title = reporter.title;
  mocha.grep(grep);

  // We can't use `mocha.run` because it bashes over grep, invert, and friends.
  // See https://github.com/visionmedia/mocha/blob/master/support/tail.js#L137
  var runner = Mocha.prototype.run.call(mocha, function(error) {
    Mocha.utils.highlightTags('code');
    done();  // We ignore the Mocha failure count.
  });

  // Mocha's default `onerror` handling strips the stack (to support really old
  // browsers). We upgrade this to get better stacks for async errors.
  //
  // TODO(nevir): Can we expand support to other browsers?
  if (navigator.userAgent.match(/chrome/i)) {
    window.onerror = null;
    window.addEventListener('error', function(event) {
      if (!event.error) return;
      if (event.error.ignore) return;
      runner.uncaught(event.error);
    });
  }
}

/**
 * Figure out which reporters should be used for the current `window`.
 *
 * @param {WCT.CLISocket} socket The CLI socket, if present.
 */
function determineReporters(socket) {
  var reporters = [
    WCT.reporters.Title,
    WCT.reporters.Console,
  ];

  if (socket) {
    reporters.push(function(runner) {
      socket.observe(runner);
    });
  }

  if (WCT._suitesToLoad.length > 0 || WCT._dependencies.length > 0) {
    reporters.push(WCT.reporters.HTML);
  }

  return reporters;
}

})();

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
/**
 * @fileoverview
 *
 * Provides automatic configuration of Mocha by stubbing out potential Mocha
 * methods, and configuring Mocha appropriately once you call them.
 *
 * Just call `suite`, `describe`, etc normally, and everything should Just Work.
 */
(function() {

// Mocha global helpers, broken out by testing method.
var MOCHA_EXPORTS = {
  // https://github.com/visionmedia/mocha/blob/master/lib/interfaces/tdd.js
  tdd: [
    'setup',
    'teardown',
    'suiteSetup',
    'suiteTeardown',
    'suite',
    'test',
  ],
  // https://github.com/visionmedia/mocha/blob/master/lib/interfaces/tdd.js
  bdd: [
    'before',
    'after',
    'beforeEach',
    'afterEach',
    'describe',
    'xdescribe',
    'xcontext',
    'it',
    'xit',
    'xspecify',
  ],
};

// We expose all Mocha methods up front, configuring and running mocha
// automatically when you call them.
//
// The assumption is that it is a one-off (sub-)suite of tests being run.
Object.keys(MOCHA_EXPORTS).forEach(function(ui) {
  MOCHA_EXPORTS[ui].forEach(function(key) {
    window[key] = function wrappedMochaFunction() {
      WCT.setupMocha(ui);
      if (!window[key] || window[key] === wrappedMochaFunction) {
        throw new Error('Expected mocha.setup to define ' + key);
      }
      window[key].apply(window, arguments);
    };
  });
});

/**
 * @param {string} ui Sets up mocha to run `ui`-style tests.
 */
WCT.setupMocha = function setupMocha(ui) {
  if (WCT._mochaUI && WCT._mochaUI === ui) return;
  if (WCT._mochaUI && WCT._mochaUI !== ui) {
    throw new Error('Mixing ' + WCT._mochaUI + ' and ' + ui + ' Mocha styles is not supported.');
  }
  mocha.setup({ui: ui, timeout: 60 * 1000});  // Note that the reporter is configured in run.js.
  WCT.mochaIsSetup = true;
};

})();

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
(function() {

WCT.reporters.Console = Console;

// We capture console events when running tests; so make sure we have a
// reference to the original one.
var console = window.console;

var FONT = ';font: normal 13px "Roboto", "Helvetica Neue", "Helvetica", sans-serif;';
var STYLES = {
  plain:   FONT,
  suite:   'color: #5c6bc0' + FONT,
  test:    FONT,
  passing: 'color: #259b24' + FONT,
  pending: 'color: #e65100' + FONT,
  failing: 'color: #c41411' + FONT,
  stack:   'color: #c41411',
  results: FONT + 'font-size: 16px',
};

// I don't think we can feature detect this one...
var userAgent = navigator.userAgent.toLowerCase();
var CAN_STYLE_LOG   = userAgent.match('firefox') || userAgent.match('webkit');
var CAN_STYLE_GROUP = userAgent.match('webkit');
// Track the indent for faked `console.group`
var logIndent = '';

function log(text, style) {
  text = text.split('\n').map(function(l) { return logIndent + l; }).join('\n');
  if (CAN_STYLE_LOG) {
    console.log('%c' + text, STYLES[style] || STYLES.plain);
  } else {
    console.log(text);
  }
}

function logGroup(text, style) {
  if (CAN_STYLE_GROUP) {
    console.group('%c' + text, STYLES[style] || STYLES.plain);
  } else if (console.group) {
    console.group(text);
  } else {
    logIndent = logIndent + '  ';
    log(text, style);
  }
}

function logGroupEnd() {
  if (console.groupEnd) {
    console.groupEnd();
  } else {
    logIndent = logIndent.substr(0, logIndent.length - 2);
  }
}

function logException(error) {
  log(error.stack || error.message || error, 'stack');
}

/**
 * A Mocha reporter that logs results out to the web `console`.
 *
 * @param {!Mocha.Runner} runner The runner that is being reported on.
 */
function Console(runner) {
  Mocha.reporters.Base.call(this, runner);

  runner.on('suite', function(suite) {
    if (suite.root) return;
    logGroup(suite.title, 'suite');
  }.bind(this));

  runner.on('suite end', function(suite) {
    if (suite.root) return;
    logGroupEnd();
  }.bind(this));

  runner.on('test', function(test) {
    logGroup(test.title, 'test');
  }.bind(this));

  runner.on('pending', function(test) {
    logGroup(test.title, 'pending');
  }.bind(this));

  runner.on('fail', function(test, error) {
    logException(error);
  }.bind(this));

  runner.on('test end', function(test) {
    logGroupEnd();
  }.bind(this));

  runner.on('end', this.logSummary.bind(this));
}
Console.prototype = Object.create(Mocha.reporters.Base.prototype);

/** Prints out a final summary of test results. */
Console.prototype.logSummary = function logSummary() {
  logGroup('Test Results', 'results');

  if (this.stats.failures > 0) {
    log(WCT.util.pluralizedStat(this.stats.failures, 'failing'), 'failing');
  }
  if (this.stats.pending > 0) {
    log(WCT.util.pluralizedStat(this.stats.pending, 'pending'), 'pending');
  }
  log(WCT.util.pluralizedStat(this.stats.passes, 'passing'));

  if (!this.stats.failures) {
    log('test suite passed', 'passing');
  }
  log('Evaluated ' + this.stats.tests + ' tests in ' + this.stats.duration + 'ms.');
  logGroupEnd();
};

})();

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
(function() {

WCT.reporters.HTML = HTML;

/**
 * WCT-specific behavior on top of Mocha's default HTML reporter.
 *
 * @param {!Mocha.Runner} runner The runner that is being reported on.
 */
function HTML(runner) {
  var output = document.createElement('div');
  output.id = 'mocha';
  document.body.appendChild(output);

  runner.on('suite', function(test) {
    this.total = runner.total;
  }.bind(this));

  Mocha.reporters.HTML.call(this, runner);
}
HTML.prototype = Object.create(Mocha.reporters.HTML.prototype);

})();

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
(function() {

WCT.reporters.Title = Title;

var ARC_OFFSET = 0; // start at the right.
var ARC_WIDTH  = 6;

/**
 * A Mocha reporter that updates the document's title and favicon with
 * at-a-glance stats.
 *
 * @param {!Mocha.Runner} runner The runner that is being reported on.
 */
function Title(runner) {
  Mocha.reporters.Base.call(this, runner);

  runner.on('test end', this.report.bind(this));
}

/** Reports current stats via the page title and favicon. */
Title.prototype.report = function report() {
  this.updateTitle();
  this.updateFavicon();
};

/** Updates the document title with a summary of current stats. */
Title.prototype.updateTitle = function updateTitle() {
  if (this.stats.failures > 0) {
    document.title = WCT.util.pluralizedStat(this.stats.failures, 'failing');
  } else {
    document.title = WCT.util.pluralizedStat(this.stats.passes, 'passing');
  }
};

/**
 * Draws an arc for the favicon status, relative to the total number of tests.
 *
 * @param {!CanvasRenderingContext2D} context
 * @param {number} total
 * @param {number} start
 * @param {number} length
 * @param {string} color
 */
function drawFaviconArc(context, total, start, length, color) {
  var arcStart = ARC_OFFSET + Math.PI * 2 * (start / total);
  var arcEnd   = ARC_OFFSET + Math.PI * 2 * ((start + length) / total);

  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth   = ARC_WIDTH;
  context.arc(16, 16, 16 - ARC_WIDTH / 2, arcStart, arcEnd);
  context.stroke();
}

/** Updates the document's favicon w/ a summary of current stats. */
Title.prototype.updateFavicon = function updateFavicon() {
  var canvas = document.createElement('canvas');
  canvas.height = canvas.width = 32;
  var context = canvas.getContext('2d');

  var passing = this.stats.passes;
  var pending = this.stats.pending;
  var failing = this.stats.failures;
  var total   = Math.max(this.runner.total, passing + pending + failing);
  drawFaviconArc(context, total, 0,                 passing, '#0e9c57');
  drawFaviconArc(context, total, passing,           pending, '#f3b300');
  drawFaviconArc(context, total, pending + passing, failing, '#ff5621');

  this.setFavicon(canvas.toDataURL());
};

/** Sets the current favicon by URL. */
Title.prototype.setFavicon = function setFavicon(url) {
  var current = document.head.querySelector('link[rel="icon"]');
  if (current) {
    document.head.removeChild(current);
  }

  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/x-icon';
  link.href = url;
  link.setAttribute('sizes', '32x32');
  document.head.appendChild(link);
};

})();

(function() {
var style = document.createElement('style');
style.textContent = '/**\n * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.\n * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\n * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\n * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\n * Code distributed by Google as part of the polymer project is also\n * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\n */\nhtml, body {\n  height: 100%;\n  width:  100%;\n}\n\n#mocha, #subsuites {\n  height: 100%;\n  position: absolute;\n  top: 0;\n  width: 50%;\n}\n\n#mocha {\n  box-sizing: border-box;\n  margin: 0 !important;\n  overflow-y: auto;\n  padding: 60px 50px;\n  right: 0;\n}\n\n#subsuites {\n  -ms-flex-direction: column;\n  -webkit-flex-direction: column;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  flex-direction: column;\n  left: 0;\n}\n\n#subsuites .subsuite {\n  border: 0;\n  width: 100%;\n  height: 100%;\n}\n\n#mocha .test.pass .duration {\n  color: #555;\n}\n';
document.head.appendChild(style);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vY2hhLmpzIiwibW9jaGEuY3NzIiwicGFyc2luZy5qcyIsImZvcm1hdHRpbmcuanMiLCJub3JtYWxpemF0aW9uLmpzIiwiaW5kZXguanMiLCJ1dGlsLmpzIiwiY2xpc29ja2V0LmpzIiwic3Vic3VpdGUuanMiLCJlbnZpcm9ubWVudC9jb21wYXRhYmlsaXR5LmpzIiwiZW52aXJvbm1lbnQvaGVscGVycy5qcyIsIm1vY2hhL211bHRpcnVubmVyLmpzIiwibW9jaGEvcnVuLmpzIiwibW9jaGEvc2V0dXAuanMiLCJyZXBvcnRlcnMvY29uc29sZS5qcyIsInJlcG9ydGVycy9odG1sLmpzIiwicmVwb3J0ZXJzL3RpdGxlLmpzIiwicmVwb3J0ZXJzL2h0bWwuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOTFMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDclBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIjsoZnVuY3Rpb24oKXtcblxuLy8gQ29tbW9uSlMgcmVxdWlyZSgpXG5cbmZ1bmN0aW9uIHJlcXVpcmUocCl7XG4gICAgdmFyIHBhdGggPSByZXF1aXJlLnJlc29sdmUocClcbiAgICAgICwgbW9kID0gcmVxdWlyZS5tb2R1bGVzW3BhdGhdO1xuICAgIGlmICghbW9kKSB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWxlZCB0byByZXF1aXJlIFwiJyArIHAgKyAnXCInKTtcbiAgICBpZiAoIW1vZC5leHBvcnRzKSB7XG4gICAgICBtb2QuZXhwb3J0cyA9IHt9O1xuICAgICAgbW9kLmNhbGwobW9kLmV4cG9ydHMsIG1vZCwgbW9kLmV4cG9ydHMsIHJlcXVpcmUucmVsYXRpdmUocGF0aCkpO1xuICAgIH1cbiAgICByZXR1cm4gbW9kLmV4cG9ydHM7XG4gIH1cblxucmVxdWlyZS5tb2R1bGVzID0ge307XG5cbnJlcXVpcmUucmVzb2x2ZSA9IGZ1bmN0aW9uIChwYXRoKXtcbiAgICB2YXIgb3JpZyA9IHBhdGhcbiAgICAgICwgcmVnID0gcGF0aCArICcuanMnXG4gICAgICAsIGluZGV4ID0gcGF0aCArICcvaW5kZXguanMnO1xuICAgIHJldHVybiByZXF1aXJlLm1vZHVsZXNbcmVnXSAmJiByZWdcbiAgICAgIHx8IHJlcXVpcmUubW9kdWxlc1tpbmRleF0gJiYgaW5kZXhcbiAgICAgIHx8IG9yaWc7XG4gIH07XG5cbnJlcXVpcmUucmVnaXN0ZXIgPSBmdW5jdGlvbiAocGF0aCwgZm4pe1xuICAgIHJlcXVpcmUubW9kdWxlc1twYXRoXSA9IGZuO1xuICB9O1xuXG5yZXF1aXJlLnJlbGF0aXZlID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgIHJldHVybiBmdW5jdGlvbihwKXtcbiAgICAgIGlmICgnLicgIT0gcC5jaGFyQXQoMCkpIHJldHVybiByZXF1aXJlKHApO1xuXG4gICAgICB2YXIgcGF0aCA9IHBhcmVudC5zcGxpdCgnLycpXG4gICAgICAgICwgc2VncyA9IHAuc3BsaXQoJy8nKTtcbiAgICAgIHBhdGgucG9wKCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2Vncy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc2VnID0gc2Vnc1tpXTtcbiAgICAgICAgaWYgKCcuLicgPT0gc2VnKSBwYXRoLnBvcCgpO1xuICAgICAgICBlbHNlIGlmICgnLicgIT0gc2VnKSBwYXRoLnB1c2goc2VnKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcXVpcmUocGF0aC5qb2luKCcvJykpO1xuICAgIH07XG4gIH07XG5cblxucmVxdWlyZS5yZWdpc3RlcihcImJyb3dzZXIvZGVidWcuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0eXBlKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gIH1cbn07XG5cbn0pOyAvLyBtb2R1bGU6IGJyb3dzZXIvZGVidWcuanNcblxucmVxdWlyZS5yZWdpc3RlcihcImJyb3dzZXIvZGlmZi5qc1wiLCBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUpe1xuLyogU2VlIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMgb2YgdXNlICovXG5cbi8qXG4gKiBUZXh0IGRpZmYgaW1wbGVtZW50YXRpb24uXG4gKlxuICogVGhpcyBsaWJyYXJ5IHN1cHBvcnRzIHRoZSBmb2xsb3dpbmcgQVBJUzpcbiAqIEpzRGlmZi5kaWZmQ2hhcnM6IENoYXJhY3RlciBieSBjaGFyYWN0ZXIgZGlmZlxuICogSnNEaWZmLmRpZmZXb3JkczogV29yZCAoYXMgZGVmaW5lZCBieSBcXGIgcmVnZXgpIGRpZmYgd2hpY2ggaWdub3JlcyB3aGl0ZXNwYWNlXG4gKiBKc0RpZmYuZGlmZkxpbmVzOiBMaW5lIGJhc2VkIGRpZmZcbiAqXG4gKiBKc0RpZmYuZGlmZkNzczogRGlmZiB0YXJnZXRlZCBhdCBDU1MgY29udGVudFxuICpcbiAqIFRoZXNlIG1ldGhvZHMgYXJlIGJhc2VkIG9uIHRoZSBpbXBsZW1lbnRhdGlvbiBwcm9wb3NlZCBpblxuICogXCJBbiBPKE5EKSBEaWZmZXJlbmNlIEFsZ29yaXRobSBhbmQgaXRzIFZhcmlhdGlvbnNcIiAoTXllcnMsIDE5ODYpLlxuICogaHR0cDovL2NpdGVzZWVyeC5pc3QucHN1LmVkdS92aWV3ZG9jL3N1bW1hcnk/ZG9pPTEwLjEuMS40LjY5MjdcbiAqL1xudmFyIEpzRGlmZiA9IChmdW5jdGlvbigpIHtcbiAgLypqc2hpbnQgbWF4cGFyYW1zOiA1Ki9cbiAgZnVuY3Rpb24gY2xvbmVQYXRoKHBhdGgpIHtcbiAgICByZXR1cm4geyBuZXdQb3M6IHBhdGgubmV3UG9zLCBjb21wb25lbnRzOiBwYXRoLmNvbXBvbmVudHMuc2xpY2UoMCkgfTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVFbXB0eShhcnJheSkge1xuICAgIHZhciByZXQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYXJyYXlbaV0pIHtcbiAgICAgICAgcmV0LnB1c2goYXJyYXlbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG4gIGZ1bmN0aW9uIGVzY2FwZUhUTUwocykge1xuICAgIHZhciBuID0gcztcbiAgICBuID0gbi5yZXBsYWNlKC8mL2csICcmYW1wOycpO1xuICAgIG4gPSBuLnJlcGxhY2UoLzwvZywgJyZsdDsnKTtcbiAgICBuID0gbi5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG4gICAgbiA9IG4ucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuXG4gICAgcmV0dXJuIG47XG4gIH1cblxuICB2YXIgRGlmZiA9IGZ1bmN0aW9uKGlnbm9yZVdoaXRlc3BhY2UpIHtcbiAgICB0aGlzLmlnbm9yZVdoaXRlc3BhY2UgPSBpZ25vcmVXaGl0ZXNwYWNlO1xuICB9O1xuICBEaWZmLnByb3RvdHlwZSA9IHtcbiAgICAgIGRpZmY6IGZ1bmN0aW9uKG9sZFN0cmluZywgbmV3U3RyaW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSB0aGUgaWRlbnRpdHkgY2FzZSAodGhpcyBpcyBkdWUgdG8gdW5yb2xsaW5nIGVkaXRMZW5ndGggPT0gMFxuICAgICAgICBpZiAobmV3U3RyaW5nID09PSBvbGRTdHJpbmcpIHtcbiAgICAgICAgICByZXR1cm4gW3sgdmFsdWU6IG5ld1N0cmluZyB9XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW5ld1N0cmluZykge1xuICAgICAgICAgIHJldHVybiBbeyB2YWx1ZTogb2xkU3RyaW5nLCByZW1vdmVkOiB0cnVlIH1dO1xuICAgICAgICB9XG4gICAgICAgIGlmICghb2xkU3RyaW5nKSB7XG4gICAgICAgICAgcmV0dXJuIFt7IHZhbHVlOiBuZXdTdHJpbmcsIGFkZGVkOiB0cnVlIH1dO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3RyaW5nID0gdGhpcy50b2tlbml6ZShuZXdTdHJpbmcpO1xuICAgICAgICBvbGRTdHJpbmcgPSB0aGlzLnRva2VuaXplKG9sZFN0cmluZyk7XG5cbiAgICAgICAgdmFyIG5ld0xlbiA9IG5ld1N0cmluZy5sZW5ndGgsIG9sZExlbiA9IG9sZFN0cmluZy5sZW5ndGg7XG4gICAgICAgIHZhciBtYXhFZGl0TGVuZ3RoID0gbmV3TGVuICsgb2xkTGVuO1xuICAgICAgICB2YXIgYmVzdFBhdGggPSBbeyBuZXdQb3M6IC0xLCBjb21wb25lbnRzOiBbXSB9XTtcblxuICAgICAgICAvLyBTZWVkIGVkaXRMZW5ndGggPSAwXG4gICAgICAgIHZhciBvbGRQb3MgPSB0aGlzLmV4dHJhY3RDb21tb24oYmVzdFBhdGhbMF0sIG5ld1N0cmluZywgb2xkU3RyaW5nLCAwKTtcbiAgICAgICAgaWYgKGJlc3RQYXRoWzBdLm5ld1BvcysxID49IG5ld0xlbiAmJiBvbGRQb3MrMSA+PSBvbGRMZW4pIHtcbiAgICAgICAgICByZXR1cm4gYmVzdFBhdGhbMF0uY29tcG9uZW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGVkaXRMZW5ndGggPSAxOyBlZGl0TGVuZ3RoIDw9IG1heEVkaXRMZW5ndGg7IGVkaXRMZW5ndGgrKykge1xuICAgICAgICAgIGZvciAodmFyIGRpYWdvbmFsUGF0aCA9IC0xKmVkaXRMZW5ndGg7IGRpYWdvbmFsUGF0aCA8PSBlZGl0TGVuZ3RoOyBkaWFnb25hbFBhdGgrPTIpIHtcbiAgICAgICAgICAgIHZhciBiYXNlUGF0aDtcbiAgICAgICAgICAgIHZhciBhZGRQYXRoID0gYmVzdFBhdGhbZGlhZ29uYWxQYXRoLTFdLFxuICAgICAgICAgICAgICAgIHJlbW92ZVBhdGggPSBiZXN0UGF0aFtkaWFnb25hbFBhdGgrMV07XG4gICAgICAgICAgICBvbGRQb3MgPSAocmVtb3ZlUGF0aCA/IHJlbW92ZVBhdGgubmV3UG9zIDogMCkgLSBkaWFnb25hbFBhdGg7XG4gICAgICAgICAgICBpZiAoYWRkUGF0aCkge1xuICAgICAgICAgICAgICAvLyBObyBvbmUgZWxzZSBpcyBnb2luZyB0byBhdHRlbXB0IHRvIHVzZSB0aGlzIHZhbHVlLCBjbGVhciBpdFxuICAgICAgICAgICAgICBiZXN0UGF0aFtkaWFnb25hbFBhdGgtMV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjYW5BZGQgPSBhZGRQYXRoICYmIGFkZFBhdGgubmV3UG9zKzEgPCBuZXdMZW47XG4gICAgICAgICAgICB2YXIgY2FuUmVtb3ZlID0gcmVtb3ZlUGF0aCAmJiAwIDw9IG9sZFBvcyAmJiBvbGRQb3MgPCBvbGRMZW47XG4gICAgICAgICAgICBpZiAoIWNhbkFkZCAmJiAhY2FuUmVtb3ZlKSB7XG4gICAgICAgICAgICAgIGJlc3RQYXRoW2RpYWdvbmFsUGF0aF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWxlY3QgdGhlIGRpYWdvbmFsIHRoYXQgd2Ugd2FudCB0byBicmFuY2ggZnJvbS4gV2Ugc2VsZWN0IHRoZSBwcmlvclxuICAgICAgICAgICAgLy8gcGF0aCB3aG9zZSBwb3NpdGlvbiBpbiB0aGUgbmV3IHN0cmluZyBpcyB0aGUgZmFydGhlc3QgZnJvbSB0aGUgb3JpZ2luXG4gICAgICAgICAgICAvLyBhbmQgZG9lcyBub3QgcGFzcyB0aGUgYm91bmRzIG9mIHRoZSBkaWZmIGdyYXBoXG4gICAgICAgICAgICBpZiAoIWNhbkFkZCB8fCAoY2FuUmVtb3ZlICYmIGFkZFBhdGgubmV3UG9zIDwgcmVtb3ZlUGF0aC5uZXdQb3MpKSB7XG4gICAgICAgICAgICAgIGJhc2VQYXRoID0gY2xvbmVQYXRoKHJlbW92ZVBhdGgpO1xuICAgICAgICAgICAgICB0aGlzLnB1c2hDb21wb25lbnQoYmFzZVBhdGguY29tcG9uZW50cywgb2xkU3RyaW5nW29sZFBvc10sIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBiYXNlUGF0aCA9IGNsb25lUGF0aChhZGRQYXRoKTtcbiAgICAgICAgICAgICAgYmFzZVBhdGgubmV3UG9zKys7XG4gICAgICAgICAgICAgIHRoaXMucHVzaENvbXBvbmVudChiYXNlUGF0aC5jb21wb25lbnRzLCBuZXdTdHJpbmdbYmFzZVBhdGgubmV3UG9zXSwgdHJ1ZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG9sZFBvcyA9IHRoaXMuZXh0cmFjdENvbW1vbihiYXNlUGF0aCwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIGRpYWdvbmFsUGF0aCk7XG5cbiAgICAgICAgICAgIGlmIChiYXNlUGF0aC5uZXdQb3MrMSA+PSBuZXdMZW4gJiYgb2xkUG9zKzEgPj0gb2xkTGVuKSB7XG4gICAgICAgICAgICAgIHJldHVybiBiYXNlUGF0aC5jb21wb25lbnRzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoXSA9IGJhc2VQYXRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgcHVzaENvbXBvbmVudDogZnVuY3Rpb24oY29tcG9uZW50cywgdmFsdWUsIGFkZGVkLCByZW1vdmVkKSB7XG4gICAgICAgIHZhciBsYXN0ID0gY29tcG9uZW50c1tjb21wb25lbnRzLmxlbmd0aC0xXTtcbiAgICAgICAgaWYgKGxhc3QgJiYgbGFzdC5hZGRlZCA9PT0gYWRkZWQgJiYgbGFzdC5yZW1vdmVkID09PSByZW1vdmVkKSB7XG4gICAgICAgICAgLy8gV2UgbmVlZCB0byBjbG9uZSBoZXJlIGFzIHRoZSBjb21wb25lbnQgY2xvbmUgb3BlcmF0aW9uIGlzIGp1c3RcbiAgICAgICAgICAvLyBhcyBzaGFsbG93IGFycmF5IGNsb25lXG4gICAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRzLmxlbmd0aC0xXSA9XG4gICAgICAgICAgICB7dmFsdWU6IHRoaXMuam9pbihsYXN0LnZhbHVlLCB2YWx1ZSksIGFkZGVkOiBhZGRlZCwgcmVtb3ZlZDogcmVtb3ZlZCB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbXBvbmVudHMucHVzaCh7dmFsdWU6IHZhbHVlLCBhZGRlZDogYWRkZWQsIHJlbW92ZWQ6IHJlbW92ZWQgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBleHRyYWN0Q29tbW9uOiBmdW5jdGlvbihiYXNlUGF0aCwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIGRpYWdvbmFsUGF0aCkge1xuICAgICAgICB2YXIgbmV3TGVuID0gbmV3U3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICAgIG9sZExlbiA9IG9sZFN0cmluZy5sZW5ndGgsXG4gICAgICAgICAgICBuZXdQb3MgPSBiYXNlUGF0aC5uZXdQb3MsXG4gICAgICAgICAgICBvbGRQb3MgPSBuZXdQb3MgLSBkaWFnb25hbFBhdGg7XG4gICAgICAgIHdoaWxlIChuZXdQb3MrMSA8IG5ld0xlbiAmJiBvbGRQb3MrMSA8IG9sZExlbiAmJiB0aGlzLmVxdWFscyhuZXdTdHJpbmdbbmV3UG9zKzFdLCBvbGRTdHJpbmdbb2xkUG9zKzFdKSkge1xuICAgICAgICAgIG5ld1BvcysrO1xuICAgICAgICAgIG9sZFBvcysrO1xuXG4gICAgICAgICAgdGhpcy5wdXNoQ29tcG9uZW50KGJhc2VQYXRoLmNvbXBvbmVudHMsIG5ld1N0cmluZ1tuZXdQb3NdLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICAgICAgYmFzZVBhdGgubmV3UG9zID0gbmV3UG9zO1xuICAgICAgICByZXR1cm4gb2xkUG9zO1xuICAgICAgfSxcblxuICAgICAgZXF1YWxzOiBmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgICB2YXIgcmVXaGl0ZXNwYWNlID0gL1xcUy87XG4gICAgICAgIGlmICh0aGlzLmlnbm9yZVdoaXRlc3BhY2UgJiYgIXJlV2hpdGVzcGFjZS50ZXN0KGxlZnQpICYmICFyZVdoaXRlc3BhY2UudGVzdChyaWdodCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQ7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBqb2luOiBmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgICByZXR1cm4gbGVmdCArIHJpZ2h0O1xuICAgICAgfSxcbiAgICAgIHRva2VuaXplOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gIH07XG5cbiAgdmFyIENoYXJEaWZmID0gbmV3IERpZmYoKTtcblxuICB2YXIgV29yZERpZmYgPSBuZXcgRGlmZih0cnVlKTtcbiAgdmFyIFdvcmRXaXRoU3BhY2VEaWZmID0gbmV3IERpZmYoKTtcbiAgV29yZERpZmYudG9rZW5pemUgPSBXb3JkV2l0aFNwYWNlRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHJlbW92ZUVtcHR5KHZhbHVlLnNwbGl0KC8oXFxzK3xcXGIpLykpO1xuICB9O1xuXG4gIHZhciBDc3NEaWZmID0gbmV3IERpZmYodHJ1ZSk7XG4gIENzc0RpZmYudG9rZW5pemUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiByZW1vdmVFbXB0eSh2YWx1ZS5zcGxpdCgvKFt7fTo7LF18XFxzKykvKSk7XG4gIH07XG5cbiAgdmFyIExpbmVEaWZmID0gbmV3IERpZmYoKTtcbiAgTGluZURpZmYudG9rZW5pemUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdCgvXi9tKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIERpZmY6IERpZmYsXG5cbiAgICBkaWZmQ2hhcnM6IGZ1bmN0aW9uKG9sZFN0ciwgbmV3U3RyKSB7IHJldHVybiBDaGFyRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyKTsgfSxcbiAgICBkaWZmV29yZHM6IGZ1bmN0aW9uKG9sZFN0ciwgbmV3U3RyKSB7IHJldHVybiBXb3JkRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyKTsgfSxcbiAgICBkaWZmV29yZHNXaXRoU3BhY2U6IGZ1bmN0aW9uKG9sZFN0ciwgbmV3U3RyKSB7IHJldHVybiBXb3JkV2l0aFNwYWNlRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyKTsgfSxcbiAgICBkaWZmTGluZXM6IGZ1bmN0aW9uKG9sZFN0ciwgbmV3U3RyKSB7IHJldHVybiBMaW5lRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyKTsgfSxcblxuICAgIGRpZmZDc3M6IGZ1bmN0aW9uKG9sZFN0ciwgbmV3U3RyKSB7IHJldHVybiBDc3NEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIpOyB9LFxuXG4gICAgY3JlYXRlUGF0Y2g6IGZ1bmN0aW9uKGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIpIHtcbiAgICAgIHZhciByZXQgPSBbXTtcblxuICAgICAgcmV0LnB1c2goJ0luZGV4OiAnICsgZmlsZU5hbWUpO1xuICAgICAgcmV0LnB1c2goJz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0nKTtcbiAgICAgIHJldC5wdXNoKCctLS0gJyArIGZpbGVOYW1lICsgKHR5cGVvZiBvbGRIZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJycgOiAnXFx0JyArIG9sZEhlYWRlcikpO1xuICAgICAgcmV0LnB1c2goJysrKyAnICsgZmlsZU5hbWUgKyAodHlwZW9mIG5ld0hlYWRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6ICdcXHQnICsgbmV3SGVhZGVyKSk7XG5cbiAgICAgIHZhciBkaWZmID0gTGluZURpZmYuZGlmZihvbGRTdHIsIG5ld1N0cik7XG4gICAgICBpZiAoIWRpZmZbZGlmZi5sZW5ndGgtMV0udmFsdWUpIHtcbiAgICAgICAgZGlmZi5wb3AoKTsgICAvLyBSZW1vdmUgdHJhaWxpbmcgbmV3bGluZSBhZGRcbiAgICAgIH1cbiAgICAgIGRpZmYucHVzaCh7dmFsdWU6ICcnLCBsaW5lczogW119KTsgICAvLyBBcHBlbmQgYW4gZW1wdHkgdmFsdWUgdG8gbWFrZSBjbGVhbnVwIGVhc2llclxuXG4gICAgICBmdW5jdGlvbiBjb250ZXh0TGluZXMobGluZXMpIHtcbiAgICAgICAgcmV0dXJuIGxpbmVzLm1hcChmdW5jdGlvbihlbnRyeSkgeyByZXR1cm4gJyAnICsgZW50cnk7IH0pO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gZW9mTkwoY3VyUmFuZ2UsIGksIGN1cnJlbnQpIHtcbiAgICAgICAgdmFyIGxhc3QgPSBkaWZmW2RpZmYubGVuZ3RoLTJdLFxuICAgICAgICAgICAgaXNMYXN0ID0gaSA9PT0gZGlmZi5sZW5ndGgtMixcbiAgICAgICAgICAgIGlzTGFzdE9mVHlwZSA9IGkgPT09IGRpZmYubGVuZ3RoLTMgJiYgKGN1cnJlbnQuYWRkZWQgIT09IGxhc3QuYWRkZWQgfHwgY3VycmVudC5yZW1vdmVkICE9PSBsYXN0LnJlbW92ZWQpO1xuXG4gICAgICAgIC8vIEZpZ3VyZSBvdXQgaWYgdGhpcyBpcyB0aGUgbGFzdCBsaW5lIGZvciB0aGUgZ2l2ZW4gZmlsZSBhbmQgbWlzc2luZyBOTFxuICAgICAgICBpZiAoIS9cXG4kLy50ZXN0KGN1cnJlbnQudmFsdWUpICYmIChpc0xhc3QgfHwgaXNMYXN0T2ZUeXBlKSkge1xuICAgICAgICAgIGN1clJhbmdlLnB1c2goJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBvbGRSYW5nZVN0YXJ0ID0gMCwgbmV3UmFuZ2VTdGFydCA9IDAsIGN1clJhbmdlID0gW10sXG4gICAgICAgICAgb2xkTGluZSA9IDEsIG5ld0xpbmUgPSAxO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaWZmLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gZGlmZltpXSxcbiAgICAgICAgICAgIGxpbmVzID0gY3VycmVudC5saW5lcyB8fCBjdXJyZW50LnZhbHVlLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpO1xuICAgICAgICBjdXJyZW50LmxpbmVzID0gbGluZXM7XG5cbiAgICAgICAgaWYgKGN1cnJlbnQuYWRkZWQgfHwgY3VycmVudC5yZW1vdmVkKSB7XG4gICAgICAgICAgaWYgKCFvbGRSYW5nZVN0YXJ0KSB7XG4gICAgICAgICAgICB2YXIgcHJldiA9IGRpZmZbaS0xXTtcbiAgICAgICAgICAgIG9sZFJhbmdlU3RhcnQgPSBvbGRMaW5lO1xuICAgICAgICAgICAgbmV3UmFuZ2VTdGFydCA9IG5ld0xpbmU7XG5cbiAgICAgICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgICAgIGN1clJhbmdlID0gY29udGV4dExpbmVzKHByZXYubGluZXMuc2xpY2UoLTQpKTtcbiAgICAgICAgICAgICAgb2xkUmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgICAgICAgIG5ld1JhbmdlU3RhcnQgLT0gY3VyUmFuZ2UubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJSYW5nZS5wdXNoLmFwcGx5KGN1clJhbmdlLCBsaW5lcy5tYXAoZnVuY3Rpb24oZW50cnkpIHsgcmV0dXJuIChjdXJyZW50LmFkZGVkPycrJzonLScpICsgZW50cnk7IH0pKTtcbiAgICAgICAgICBlb2ZOTChjdXJSYW5nZSwgaSwgY3VycmVudCk7XG5cbiAgICAgICAgICBpZiAoY3VycmVudC5hZGRlZCkge1xuICAgICAgICAgICAgbmV3TGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9sZExpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob2xkUmFuZ2VTdGFydCkge1xuICAgICAgICAgICAgLy8gQ2xvc2Ugb3V0IGFueSBjaGFuZ2VzIHRoYXQgaGF2ZSBiZWVuIG91dHB1dCAob3Igam9pbiBvdmVybGFwcGluZylcbiAgICAgICAgICAgIGlmIChsaW5lcy5sZW5ndGggPD0gOCAmJiBpIDwgZGlmZi5sZW5ndGgtMikge1xuICAgICAgICAgICAgICAvLyBPdmVybGFwcGluZ1xuICAgICAgICAgICAgICBjdXJSYW5nZS5wdXNoLmFwcGx5KGN1clJhbmdlLCBjb250ZXh0TGluZXMobGluZXMpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGVuZCB0aGUgcmFuZ2UgYW5kIG91dHB1dFxuICAgICAgICAgICAgICB2YXIgY29udGV4dFNpemUgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIDQpO1xuICAgICAgICAgICAgICByZXQucHVzaChcbiAgICAgICAgICAgICAgICAgICdAQCAtJyArIG9sZFJhbmdlU3RhcnQgKyAnLCcgKyAob2xkTGluZS1vbGRSYW5nZVN0YXJ0K2NvbnRleHRTaXplKVxuICAgICAgICAgICAgICAgICAgKyAnICsnICsgbmV3UmFuZ2VTdGFydCArICcsJyArIChuZXdMaW5lLW5ld1JhbmdlU3RhcnQrY29udGV4dFNpemUpXG4gICAgICAgICAgICAgICAgICArICcgQEAnKTtcbiAgICAgICAgICAgICAgcmV0LnB1c2guYXBwbHkocmV0LCBjdXJSYW5nZSk7XG4gICAgICAgICAgICAgIHJldC5wdXNoLmFwcGx5KHJldCwgY29udGV4dExpbmVzKGxpbmVzLnNsaWNlKDAsIGNvbnRleHRTaXplKSkpO1xuICAgICAgICAgICAgICBpZiAobGluZXMubGVuZ3RoIDw9IDQpIHtcbiAgICAgICAgICAgICAgICBlb2ZOTChyZXQsIGksIGN1cnJlbnQpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgb2xkUmFuZ2VTdGFydCA9IDA7ICBuZXdSYW5nZVN0YXJ0ID0gMDsgY3VyUmFuZ2UgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgb2xkTGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICAgICAgbmV3TGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJldC5qb2luKCdcXG4nKSArICdcXG4nO1xuICAgIH0sXG5cbiAgICBhcHBseVBhdGNoOiBmdW5jdGlvbihvbGRTdHIsIHVuaURpZmYpIHtcbiAgICAgIHZhciBkaWZmc3RyID0gdW5pRGlmZi5zcGxpdCgnXFxuJyk7XG4gICAgICB2YXIgZGlmZiA9IFtdO1xuICAgICAgdmFyIHJlbUVPRk5MID0gZmFsc2UsXG4gICAgICAgICAgYWRkRU9GTkwgPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIgaSA9IChkaWZmc3RyWzBdWzBdPT09J0knPzQ6MCk7IGkgPCBkaWZmc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmKGRpZmZzdHJbaV1bMF0gPT09ICdAJykge1xuICAgICAgICAgIHZhciBtZWggPSBkaWZmc3RyW2ldLnNwbGl0KC9AQCAtKFxcZCspLChcXGQrKSBcXCsoXFxkKyksKFxcZCspIEBALyk7XG4gICAgICAgICAgZGlmZi51bnNoaWZ0KHtcbiAgICAgICAgICAgIHN0YXJ0Om1laFszXSxcbiAgICAgICAgICAgIG9sZGxlbmd0aDptZWhbMl0sXG4gICAgICAgICAgICBvbGRsaW5lczpbXSxcbiAgICAgICAgICAgIG5ld2xlbmd0aDptZWhbNF0sXG4gICAgICAgICAgICBuZXdsaW5lczpbXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYoZGlmZnN0cltpXVswXSA9PT0gJysnKSB7XG4gICAgICAgICAgZGlmZlswXS5uZXdsaW5lcy5wdXNoKGRpZmZzdHJbaV0uc3Vic3RyKDEpKTtcbiAgICAgICAgfSBlbHNlIGlmKGRpZmZzdHJbaV1bMF0gPT09ICctJykge1xuICAgICAgICAgIGRpZmZbMF0ub2xkbGluZXMucHVzaChkaWZmc3RyW2ldLnN1YnN0cigxKSk7XG4gICAgICAgIH0gZWxzZSBpZihkaWZmc3RyW2ldWzBdID09PSAnICcpIHtcbiAgICAgICAgICBkaWZmWzBdLm5ld2xpbmVzLnB1c2goZGlmZnN0cltpXS5zdWJzdHIoMSkpO1xuICAgICAgICAgIGRpZmZbMF0ub2xkbGluZXMucHVzaChkaWZmc3RyW2ldLnN1YnN0cigxKSk7XG4gICAgICAgIH0gZWxzZSBpZihkaWZmc3RyW2ldWzBdID09PSAnXFxcXCcpIHtcbiAgICAgICAgICBpZiAoZGlmZnN0cltpLTFdWzBdID09PSAnKycpIHtcbiAgICAgICAgICAgIHJlbUVPRk5MID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYoZGlmZnN0cltpLTFdWzBdID09PSAnLScpIHtcbiAgICAgICAgICAgIGFkZEVPRk5MID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHN0ciA9IG9sZFN0ci5zcGxpdCgnXFxuJyk7XG4gICAgICBmb3IgKHZhciBpID0gZGlmZi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB2YXIgZCA9IGRpZmZbaV07XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZC5vbGRsZW5ndGg7IGorKykge1xuICAgICAgICAgIGlmKHN0cltkLnN0YXJ0LTEral0gIT09IGQub2xkbGluZXNbal0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShzdHIsW2Quc3RhcnQtMSwrZC5vbGRsZW5ndGhdLmNvbmNhdChkLm5ld2xpbmVzKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZW1FT0ZOTCkge1xuICAgICAgICB3aGlsZSAoIXN0cltzdHIubGVuZ3RoLTFdKSB7XG4gICAgICAgICAgc3RyLnBvcCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGFkZEVPRk5MKSB7XG4gICAgICAgIHN0ci5wdXNoKCcnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHIuam9pbignXFxuJyk7XG4gICAgfSxcblxuICAgIGNvbnZlcnRDaGFuZ2VzVG9YTUw6IGZ1bmN0aW9uKGNoYW5nZXMpe1xuICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgY2hhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hhbmdlID0gY2hhbmdlc1tpXTtcbiAgICAgICAgaWYgKGNoYW5nZS5hZGRlZCkge1xuICAgICAgICAgIHJldC5wdXNoKCc8aW5zPicpO1xuICAgICAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICAgICAgcmV0LnB1c2goJzxkZWw+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXQucHVzaChlc2NhcGVIVE1MKGNoYW5nZS52YWx1ZSkpO1xuXG4gICAgICAgIGlmIChjaGFuZ2UuYWRkZWQpIHtcbiAgICAgICAgICByZXQucHVzaCgnPC9pbnM+Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgICAgICByZXQucHVzaCgnPC9kZWw+Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQuam9pbignJyk7XG4gICAgfSxcblxuICAgIC8vIFNlZTogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL2dvb2dsZS1kaWZmLW1hdGNoLXBhdGNoL3dpa2kvQVBJXG4gICAgY29udmVydENoYW5nZXNUb0RNUDogZnVuY3Rpb24oY2hhbmdlcyl7XG4gICAgICB2YXIgcmV0ID0gW10sIGNoYW5nZTtcbiAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGNoYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2hhbmdlID0gY2hhbmdlc1tpXTtcbiAgICAgICAgcmV0LnB1c2goWyhjaGFuZ2UuYWRkZWQgPyAxIDogY2hhbmdlLnJlbW92ZWQgPyAtMSA6IDApLCBjaGFuZ2UudmFsdWVdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICB9O1xufSkoKTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBKc0RpZmY7XG59XG5cbn0pOyAvLyBtb2R1bGU6IGJyb3dzZXIvZGlmZi5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwiYnJvd3Nlci9ldmVudHMuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xuXG5leHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBhcnJheS5cbiAqL1xuXG5mdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICByZXR1cm4gJ1tvYmplY3QgQXJyYXldJyA9PSB7fS50b1N0cmluZy5jYWxsKG9iaik7XG59XG5cbi8qKlxuICogRXZlbnQgZW1pdHRlciBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpe307XG5cbi8qKlxuICogQWRkcyBhIGxpc3RlbmVyLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChuYW1lLCBmbikge1xuICBpZiAoIXRoaXMuJGV2ZW50cykge1xuICAgIHRoaXMuJGV2ZW50cyA9IHt9O1xuICB9XG5cbiAgaWYgKCF0aGlzLiRldmVudHNbbmFtZV0pIHtcbiAgICB0aGlzLiRldmVudHNbbmFtZV0gPSBmbjtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuJGV2ZW50c1tuYW1lXSkpIHtcbiAgICB0aGlzLiRldmVudHNbbmFtZV0ucHVzaChmbik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy4kZXZlbnRzW25hbWVdID0gW3RoaXMuJGV2ZW50c1tuYW1lXSwgZm5dO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbjtcblxuLyoqXG4gKiBBZGRzIGEgdm9sYXRpbGUgbGlzdGVuZXIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiAobmFtZSwgZm4pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGZ1bmN0aW9uIG9uICgpIHtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKG5hbWUsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIG9uLmxpc3RlbmVyID0gZm47XG4gIHRoaXMub24obmFtZSwgb24pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgbGlzdGVuZXIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKG5hbWUsIGZuKSB7XG4gIGlmICh0aGlzLiRldmVudHMgJiYgdGhpcy4kZXZlbnRzW25hbWVdKSB7XG4gICAgdmFyIGxpc3QgPSB0aGlzLiRldmVudHNbbmFtZV07XG5cbiAgICBpZiAoaXNBcnJheShsaXN0KSkge1xuICAgICAgdmFyIHBvcyA9IC0xO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChsaXN0W2ldID09PSBmbiB8fCAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBmbikpIHtcbiAgICAgICAgICBwb3MgPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwb3MgPCAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBsaXN0LnNwbGljZShwb3MsIDEpO1xuXG4gICAgICBpZiAoIWxpc3QubGVuZ3RoKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLiRldmVudHNbbmFtZV07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChsaXN0ID09PSBmbiB8fCAobGlzdC5saXN0ZW5lciAmJiBsaXN0Lmxpc3RlbmVyID09PSBmbikpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLiRldmVudHNbbmFtZV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycyBmb3IgYW4gZXZlbnQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGlmIChuYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLiRldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGlmICh0aGlzLiRldmVudHMgJiYgdGhpcy4kZXZlbnRzW25hbWVdKSB7XG4gICAgdGhpcy4kZXZlbnRzW25hbWVdID0gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBHZXRzIGFsbCBsaXN0ZW5lcnMgZm9yIGEgY2VydGFpbiBldmVudC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgaWYgKCF0aGlzLiRldmVudHMpIHtcbiAgICB0aGlzLiRldmVudHMgPSB7fTtcbiAgfVxuXG4gIGlmICghdGhpcy4kZXZlbnRzW25hbWVdKSB7XG4gICAgdGhpcy4kZXZlbnRzW25hbWVdID0gW107XG4gIH1cblxuICBpZiAoIWlzQXJyYXkodGhpcy4kZXZlbnRzW25hbWVdKSkge1xuICAgIHRoaXMuJGV2ZW50c1tuYW1lXSA9IFt0aGlzLiRldmVudHNbbmFtZV1dO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuJGV2ZW50c1tuYW1lXTtcbn07XG5cbi8qKlxuICogRW1pdHMgYW4gZXZlbnQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICBpZiAoIXRoaXMuJGV2ZW50cykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBoYW5kbGVyID0gdGhpcy4kZXZlbnRzW25hbWVdO1xuXG4gIGlmICghaGFuZGxlcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBoYW5kbGVyKSB7XG4gICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgdmFyIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG59KTsgLy8gbW9kdWxlOiBicm93c2VyL2V2ZW50cy5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwiYnJvd3Nlci9mcy5qc1wiLCBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUpe1xuXG59KTsgLy8gbW9kdWxlOiBicm93c2VyL2ZzLmpzXG5cbnJlcXVpcmUucmVnaXN0ZXIoXCJicm93c2VyL3BhdGguanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxufSk7IC8vIG1vZHVsZTogYnJvd3Nlci9wYXRoLmpzXG5cbnJlcXVpcmUucmVnaXN0ZXIoXCJicm93c2VyL3Byb2dyZXNzLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG4vKipcbiAqIEV4cG9zZSBgUHJvZ3Jlc3NgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvZ3Jlc3M7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUHJvZ3Jlc3NgIGluZGljYXRvci5cbiAqL1xuXG5mdW5jdGlvbiBQcm9ncmVzcygpIHtcbiAgdGhpcy5wZXJjZW50ID0gMDtcbiAgdGhpcy5zaXplKDApO1xuICB0aGlzLmZvbnRTaXplKDExKTtcbiAgdGhpcy5mb250KCdoZWx2ZXRpY2EsIGFyaWFsLCBzYW5zLXNlcmlmJyk7XG59XG5cbi8qKlxuICogU2V0IHByb2dyZXNzIHNpemUgdG8gYG5gLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gKiBAcmV0dXJuIHtQcm9ncmVzc30gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblByb2dyZXNzLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24obil7XG4gIHRoaXMuX3NpemUgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRleHQgdG8gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7UHJvZ3Jlc3N9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Qcm9ncmVzcy5wcm90b3R5cGUudGV4dCA9IGZ1bmN0aW9uKHN0cil7XG4gIHRoaXMuX3RleHQgPSBzdHI7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgZm9udCBzaXplIHRvIGBuYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gblxuICogQHJldHVybiB7UHJvZ3Jlc3N9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Qcm9ncmVzcy5wcm90b3R5cGUuZm9udFNpemUgPSBmdW5jdGlvbihuKXtcbiAgdGhpcy5fZm9udFNpemUgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IGZvbnQgYGZhbWlseWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZhbWlseVxuICogQHJldHVybiB7UHJvZ3Jlc3N9IGZvciBjaGFpbmluZ1xuICovXG5cblByb2dyZXNzLnByb3RvdHlwZS5mb250ID0gZnVuY3Rpb24oZmFtaWx5KXtcbiAgdGhpcy5fZm9udCA9IGZhbWlseTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFVwZGF0ZSBwZXJjZW50YWdlIHRvIGBuYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gblxuICogQHJldHVybiB7UHJvZ3Jlc3N9IGZvciBjaGFpbmluZ1xuICovXG5cblByb2dyZXNzLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihuKXtcbiAgdGhpcy5wZXJjZW50ID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIERyYXcgb24gYGN0eGAuXG4gKlxuICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MmR9IGN0eFxuICogQHJldHVybiB7UHJvZ3Jlc3N9IGZvciBjaGFpbmluZ1xuICovXG5cblByb2dyZXNzLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KXtcbiAgdHJ5IHtcbiAgICB2YXIgcGVyY2VudCA9IE1hdGgubWluKHRoaXMucGVyY2VudCwgMTAwKVxuICAgICAgLCBzaXplID0gdGhpcy5fc2l6ZVxuICAgICAgLCBoYWxmID0gc2l6ZSAvIDJcbiAgICAgICwgeCA9IGhhbGZcbiAgICAgICwgeSA9IGhhbGZcbiAgICAgICwgcmFkID0gaGFsZiAtIDFcbiAgICAgICwgZm9udFNpemUgPSB0aGlzLl9mb250U2l6ZTtcbiAgXG4gICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCAnICsgdGhpcy5fZm9udDtcbiAgXG4gICAgdmFyIGFuZ2xlID0gTWF0aC5QSSAqIDIgKiAocGVyY2VudCAvIDEwMCk7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBzaXplLCBzaXplKTtcbiAgXG4gICAgLy8gb3V0ZXIgY2lyY2xlXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gJyM5ZjlmOWYnO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguYXJjKHgsIHksIHJhZCwgMCwgYW5nbGUsIGZhbHNlKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIFxuICAgIC8vIGlubmVyIGNpcmNsZVxuICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjZWVlJztcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmFyYyh4LCB5LCByYWQgLSAxLCAwLCBhbmdsZSwgdHJ1ZSk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICBcbiAgICAvLyB0ZXh0XG4gICAgdmFyIHRleHQgPSB0aGlzLl90ZXh0IHx8IChwZXJjZW50IHwgMCkgKyAnJSdcbiAgICAgICwgdyA9IGN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aDtcbiAgXG4gICAgY3R4LmZpbGxUZXh0KFxuICAgICAgICB0ZXh0XG4gICAgICAsIHggLSB3IC8gMiArIDFcbiAgICAgICwgeSArIGZvbnRTaXplIC8gMiAtIDEpO1xuICB9IGNhdGNoIChleCkge30gLy9kb24ndCBmYWlsIGlmIHdlIGNhbid0IHJlbmRlciBwcm9ncmVzc1xuICByZXR1cm4gdGhpcztcbn07XG5cbn0pOyAvLyBtb2R1bGU6IGJyb3dzZXIvcHJvZ3Jlc3MuanNcblxucmVxdWlyZS5yZWdpc3RlcihcImJyb3dzZXIvdHR5LmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG5cbmV4cG9ydHMuaXNhdHR5ID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnRzLmdldFdpbmRvd1NpemUgPSBmdW5jdGlvbigpe1xuICBpZiAoJ2lubmVySGVpZ2h0JyBpbiBnbG9iYWwpIHtcbiAgICByZXR1cm4gW2dsb2JhbC5pbm5lckhlaWdodCwgZ2xvYmFsLmlubmVyV2lkdGhdO1xuICB9IGVsc2Uge1xuICAgIC8vIEluIGEgV2ViIFdvcmtlciwgdGhlIERPTSBXaW5kb3cgaXMgbm90IGF2YWlsYWJsZS5cbiAgICByZXR1cm4gWzY0MCwgNDgwXTtcbiAgfVxufTtcblxufSk7IC8vIG1vZHVsZTogYnJvd3Nlci90dHkuanNcblxucmVxdWlyZS5yZWdpc3RlcihcImNvbnRleHQuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxuLyoqXG4gKiBFeHBvc2UgYENvbnRleHRgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGV4dDtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBDb250ZXh0YC5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBDb250ZXh0KCl7fVxuXG4vKipcbiAqIFNldCBvciBnZXQgdGhlIGNvbnRleHQgYFJ1bm5hYmxlYCB0byBgcnVubmFibGVgLlxuICpcbiAqIEBwYXJhbSB7UnVubmFibGV9IHJ1bm5hYmxlXG4gKiBAcmV0dXJuIHtDb250ZXh0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29udGV4dC5wcm90b3R5cGUucnVubmFibGUgPSBmdW5jdGlvbihydW5uYWJsZSl7XG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLl9ydW5uYWJsZTtcbiAgdGhpcy50ZXN0ID0gdGhpcy5fcnVubmFibGUgPSBydW5uYWJsZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0ZXN0IHRpbWVvdXQgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge0NvbnRleHR9IHNlbGZcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbnRleHQucHJvdG90eXBlLnRpbWVvdXQgPSBmdW5jdGlvbihtcyl7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5ydW5uYWJsZSgpLnRpbWVvdXQoKTtcbiAgdGhpcy5ydW5uYWJsZSgpLnRpbWVvdXQobXMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRlc3QgdGltZW91dCBgZW5hYmxlZGAuXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSBlbmFibGVkXG4gKiBAcmV0dXJuIHtDb250ZXh0fSBzZWxmXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db250ZXh0LnByb3RvdHlwZS5lbmFibGVUaW1lb3V0cyA9IGZ1bmN0aW9uIChlbmFibGVkKSB7XG4gIHRoaXMucnVubmFibGUoKS5lbmFibGVUaW1lb3V0cyhlbmFibGVkKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogU2V0IHRlc3Qgc2xvd25lc3MgdGhyZXNob2xkIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtDb250ZXh0fSBzZWxmXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db250ZXh0LnByb3RvdHlwZS5zbG93ID0gZnVuY3Rpb24obXMpe1xuICB0aGlzLnJ1bm5hYmxlKCkuc2xvdyhtcyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJbnNwZWN0IHRoZSBjb250ZXh0IHZvaWQgb2YgYC5fcnVubmFibGVgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbnRleHQucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcywgZnVuY3Rpb24oa2V5LCB2YWwpe1xuICAgIGlmICgnX3J1bm5hYmxlJyA9PSBrZXkpIHJldHVybjtcbiAgICBpZiAoJ3Rlc3QnID09IGtleSkgcmV0dXJuO1xuICAgIHJldHVybiB2YWw7XG4gIH0sIDIpO1xufTtcblxufSk7IC8vIG1vZHVsZTogY29udGV4dC5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwiaG9vay5qc1wiLCBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUpe1xuXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIFJ1bm5hYmxlID0gcmVxdWlyZSgnLi9ydW5uYWJsZScpO1xuXG4vKipcbiAqIEV4cG9zZSBgSG9va2AuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBIb29rO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEhvb2tgIHdpdGggdGhlIGdpdmVuIGB0aXRsZWAgYW5kIGNhbGxiYWNrIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gSG9vayh0aXRsZSwgZm4pIHtcbiAgUnVubmFibGUuY2FsbCh0aGlzLCB0aXRsZSwgZm4pO1xuICB0aGlzLnR5cGUgPSAnaG9vayc7XG59XG5cbi8qKlxuICogSW5oZXJpdCBmcm9tIGBSdW5uYWJsZS5wcm90b3R5cGVgLlxuICovXG5cbmZ1bmN0aW9uIEYoKXt9O1xuRi5wcm90b3R5cGUgPSBSdW5uYWJsZS5wcm90b3R5cGU7XG5Ib29rLnByb3RvdHlwZSA9IG5ldyBGO1xuSG9vay5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBIb29rO1xuXG5cbi8qKlxuICogR2V0IG9yIHNldCB0aGUgdGVzdCBgZXJyYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEByZXR1cm4ge0Vycm9yfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Ib29rLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uKGVycil7XG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB2YXIgZXJyID0gdGhpcy5fZXJyb3I7XG4gICAgdGhpcy5fZXJyb3IgPSBudWxsO1xuICAgIHJldHVybiBlcnI7XG4gIH1cblxuICB0aGlzLl9lcnJvciA9IGVycjtcbn07XG5cbn0pOyAvLyBtb2R1bGU6IGhvb2suanNcblxucmVxdWlyZS5yZWdpc3RlcihcImludGVyZmFjZXMvYmRkLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgU3VpdGUgPSByZXF1aXJlKCcuLi9zdWl0ZScpXG4gICwgVGVzdCA9IHJlcXVpcmUoJy4uL3Rlc3QnKVxuICAsIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBCREQtc3R5bGUgaW50ZXJmYWNlOlxuICpcbiAqICAgICAgZGVzY3JpYmUoJ0FycmF5JywgZnVuY3Rpb24oKXtcbiAqICAgICAgICBkZXNjcmliZSgnI2luZGV4T2YoKScsIGZ1bmN0aW9uKCl7XG4gKiAgICAgICAgICBpdCgnc2hvdWxkIHJldHVybiAtMSB3aGVuIG5vdCBwcmVzZW50JywgZnVuY3Rpb24oKXtcbiAqXG4gKiAgICAgICAgICB9KTtcbiAqXG4gKiAgICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgaW5kZXggd2hlbiBwcmVzZW50JywgZnVuY3Rpb24oKXtcbiAqXG4gKiAgICAgICAgICB9KTtcbiAqICAgICAgICB9KTtcbiAqICAgICAgfSk7XG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3VpdGUpe1xuICB2YXIgc3VpdGVzID0gW3N1aXRlXTtcblxuICBzdWl0ZS5vbigncHJlLXJlcXVpcmUnLCBmdW5jdGlvbihjb250ZXh0LCBmaWxlLCBtb2NoYSl7XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGJlZm9yZSBydW5uaW5nIHRlc3RzLlxuICAgICAqL1xuXG4gICAgY29udGV4dC5iZWZvcmUgPSBmdW5jdGlvbihuYW1lLCBmbil7XG4gICAgICBzdWl0ZXNbMF0uYmVmb3JlQWxsKG5hbWUsIGZuKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBhZnRlciBydW5uaW5nIHRlc3RzLlxuICAgICAqL1xuXG4gICAgY29udGV4dC5hZnRlciA9IGZ1bmN0aW9uKG5hbWUsIGZuKXtcbiAgICAgIHN1aXRlc1swXS5hZnRlckFsbChuYW1lLCBmbik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgYmVmb3JlIGVhY2ggdGVzdCBjYXNlLlxuICAgICAqL1xuXG4gICAgY29udGV4dC5iZWZvcmVFYWNoID0gZnVuY3Rpb24obmFtZSwgZm4pe1xuICAgICAgc3VpdGVzWzBdLmJlZm9yZUVhY2gobmFtZSwgZm4pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGFmdGVyIGVhY2ggdGVzdCBjYXNlLlxuICAgICAqL1xuXG4gICAgY29udGV4dC5hZnRlckVhY2ggPSBmdW5jdGlvbihuYW1lLCBmbil7XG4gICAgICBzdWl0ZXNbMF0uYWZ0ZXJFYWNoKG5hbWUsIGZuKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVzY3JpYmUgYSBcInN1aXRlXCIgd2l0aCB0aGUgZ2l2ZW4gYHRpdGxlYFxuICAgICAqIGFuZCBjYWxsYmFjayBgZm5gIGNvbnRhaW5pbmcgbmVzdGVkIHN1aXRlc1xuICAgICAqIGFuZC9vciB0ZXN0cy5cbiAgICAgKi9cblxuICAgIGNvbnRleHQuZGVzY3JpYmUgPSBjb250ZXh0LmNvbnRleHQgPSBmdW5jdGlvbih0aXRsZSwgZm4pe1xuICAgICAgdmFyIHN1aXRlID0gU3VpdGUuY3JlYXRlKHN1aXRlc1swXSwgdGl0bGUpO1xuICAgICAgc3VpdGUuZmlsZSA9IGZpbGU7XG4gICAgICBzdWl0ZXMudW5zaGlmdChzdWl0ZSk7XG4gICAgICBmbi5jYWxsKHN1aXRlKTtcbiAgICAgIHN1aXRlcy5zaGlmdCgpO1xuICAgICAgcmV0dXJuIHN1aXRlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQZW5kaW5nIGRlc2NyaWJlLlxuICAgICAqL1xuXG4gICAgY29udGV4dC54ZGVzY3JpYmUgPVxuICAgIGNvbnRleHQueGNvbnRleHQgPVxuICAgIGNvbnRleHQuZGVzY3JpYmUuc2tpcCA9IGZ1bmN0aW9uKHRpdGxlLCBmbil7XG4gICAgICB2YXIgc3VpdGUgPSBTdWl0ZS5jcmVhdGUoc3VpdGVzWzBdLCB0aXRsZSk7XG4gICAgICBzdWl0ZS5wZW5kaW5nID0gdHJ1ZTtcbiAgICAgIHN1aXRlcy51bnNoaWZ0KHN1aXRlKTtcbiAgICAgIGZuLmNhbGwoc3VpdGUpO1xuICAgICAgc3VpdGVzLnNoaWZ0KCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4Y2x1c2l2ZSBzdWl0ZS5cbiAgICAgKi9cblxuICAgIGNvbnRleHQuZGVzY3JpYmUub25seSA9IGZ1bmN0aW9uKHRpdGxlLCBmbil7XG4gICAgICB2YXIgc3VpdGUgPSBjb250ZXh0LmRlc2NyaWJlKHRpdGxlLCBmbik7XG4gICAgICBtb2NoYS5ncmVwKHN1aXRlLmZ1bGxUaXRsZSgpKTtcbiAgICAgIHJldHVybiBzdWl0ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVzY3JpYmUgYSBzcGVjaWZpY2F0aW9uIG9yIHRlc3QtY2FzZVxuICAgICAqIHdpdGggdGhlIGdpdmVuIGB0aXRsZWAgYW5kIGNhbGxiYWNrIGBmbmBcbiAgICAgKiBhY3RpbmcgYXMgYSB0aHVuay5cbiAgICAgKi9cblxuICAgIGNvbnRleHQuaXQgPSBjb250ZXh0LnNwZWNpZnkgPSBmdW5jdGlvbih0aXRsZSwgZm4pe1xuICAgICAgdmFyIHN1aXRlID0gc3VpdGVzWzBdO1xuICAgICAgaWYgKHN1aXRlLnBlbmRpbmcpIHZhciBmbiA9IG51bGw7XG4gICAgICB2YXIgdGVzdCA9IG5ldyBUZXN0KHRpdGxlLCBmbik7XG4gICAgICB0ZXN0LmZpbGUgPSBmaWxlO1xuICAgICAgc3VpdGUuYWRkVGVzdCh0ZXN0KTtcbiAgICAgIHJldHVybiB0ZXN0O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeGNsdXNpdmUgdGVzdC1jYXNlLlxuICAgICAqL1xuXG4gICAgY29udGV4dC5pdC5vbmx5ID0gZnVuY3Rpb24odGl0bGUsIGZuKXtcbiAgICAgIHZhciB0ZXN0ID0gY29udGV4dC5pdCh0aXRsZSwgZm4pO1xuICAgICAgdmFyIHJlU3RyaW5nID0gJ14nICsgdXRpbHMuZXNjYXBlUmVnZXhwKHRlc3QuZnVsbFRpdGxlKCkpICsgJyQnO1xuICAgICAgbW9jaGEuZ3JlcChuZXcgUmVnRXhwKHJlU3RyaW5nKSk7XG4gICAgICByZXR1cm4gdGVzdDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUGVuZGluZyB0ZXN0IGNhc2UuXG4gICAgICovXG5cbiAgICBjb250ZXh0LnhpdCA9XG4gICAgY29udGV4dC54c3BlY2lmeSA9XG4gICAgY29udGV4dC5pdC5za2lwID0gZnVuY3Rpb24odGl0bGUpe1xuICAgICAgY29udGV4dC5pdCh0aXRsZSk7XG4gICAgfTtcbiAgfSk7XG59O1xuXG59KTsgLy8gbW9kdWxlOiBpbnRlcmZhY2VzL2JkZC5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwiaW50ZXJmYWNlcy9leHBvcnRzLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgU3VpdGUgPSByZXF1aXJlKCcuLi9zdWl0ZScpXG4gICwgVGVzdCA9IHJlcXVpcmUoJy4uL3Rlc3QnKTtcblxuLyoqXG4gKiBUREQtc3R5bGUgaW50ZXJmYWNlOlxuICpcbiAqICAgICBleHBvcnRzLkFycmF5ID0ge1xuICogICAgICAgJyNpbmRleE9mKCknOiB7XG4gKiAgICAgICAgICdzaG91bGQgcmV0dXJuIC0xIHdoZW4gdGhlIHZhbHVlIGlzIG5vdCBwcmVzZW50JzogZnVuY3Rpb24oKXtcbiAqXG4gKiAgICAgICAgIH0sXG4gKlxuICogICAgICAgICAnc2hvdWxkIHJldHVybiB0aGUgY29ycmVjdCBpbmRleCB3aGVuIHRoZSB2YWx1ZSBpcyBwcmVzZW50JzogZnVuY3Rpb24oKXtcbiAqXG4gKiAgICAgICAgIH1cbiAqICAgICAgIH1cbiAqICAgICB9O1xuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN1aXRlKXtcbiAgdmFyIHN1aXRlcyA9IFtzdWl0ZV07XG5cbiAgc3VpdGUub24oJ3JlcXVpcmUnLCB2aXNpdCk7XG5cbiAgZnVuY3Rpb24gdmlzaXQob2JqLCBmaWxlKSB7XG4gICAgdmFyIHN1aXRlO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBvYmpba2V5XSkge1xuICAgICAgICB2YXIgZm4gPSBvYmpba2V5XTtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICBjYXNlICdiZWZvcmUnOlxuICAgICAgICAgICAgc3VpdGVzWzBdLmJlZm9yZUFsbChmbik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhZnRlcic6XG4gICAgICAgICAgICBzdWl0ZXNbMF0uYWZ0ZXJBbGwoZm4pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYmVmb3JlRWFjaCc6XG4gICAgICAgICAgICBzdWl0ZXNbMF0uYmVmb3JlRWFjaChmbik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhZnRlckVhY2gnOlxuICAgICAgICAgICAgc3VpdGVzWzBdLmFmdGVyRWFjaChmbik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFyIHRlc3QgPSBuZXcgVGVzdChrZXksIGZuKTtcbiAgICAgICAgICAgIHRlc3QuZmlsZSA9IGZpbGU7XG4gICAgICAgICAgICBzdWl0ZXNbMF0uYWRkVGVzdCh0ZXN0KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHN1aXRlID0gU3VpdGUuY3JlYXRlKHN1aXRlc1swXSwga2V5KTtcbiAgICAgICAgc3VpdGVzLnVuc2hpZnQoc3VpdGUpO1xuICAgICAgICB2aXNpdChvYmpba2V5XSk7XG4gICAgICAgIHN1aXRlcy5zaGlmdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxufSk7IC8vIG1vZHVsZTogaW50ZXJmYWNlcy9leHBvcnRzLmpzXG5cbnJlcXVpcmUucmVnaXN0ZXIoXCJpbnRlcmZhY2VzL2luZGV4LmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG5cbmV4cG9ydHMuYmRkID0gcmVxdWlyZSgnLi9iZGQnKTtcbmV4cG9ydHMudGRkID0gcmVxdWlyZSgnLi90ZGQnKTtcbmV4cG9ydHMucXVuaXQgPSByZXF1aXJlKCcuL3F1bml0Jyk7XG5leHBvcnRzLmV4cG9ydHMgPSByZXF1aXJlKCcuL2V4cG9ydHMnKTtcblxufSk7IC8vIG1vZHVsZTogaW50ZXJmYWNlcy9pbmRleC5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwiaW50ZXJmYWNlcy9xdW5pdC5qc1wiLCBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUpe1xuXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIFN1aXRlID0gcmVxdWlyZSgnLi4vc3VpdGUnKVxuICAsIFRlc3QgPSByZXF1aXJlKCcuLi90ZXN0JylcbiAgLCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogUVVuaXQtc3R5bGUgaW50ZXJmYWNlOlxuICpcbiAqICAgICBzdWl0ZSgnQXJyYXknKTtcbiAqXG4gKiAgICAgdGVzdCgnI2xlbmd0aCcsIGZ1bmN0aW9uKCl7XG4gKiAgICAgICB2YXIgYXJyID0gWzEsMiwzXTtcbiAqICAgICAgIG9rKGFyci5sZW5ndGggPT0gMyk7XG4gKiAgICAgfSk7XG4gKlxuICogICAgIHRlc3QoJyNpbmRleE9mKCknLCBmdW5jdGlvbigpe1xuICogICAgICAgdmFyIGFyciA9IFsxLDIsM107XG4gKiAgICAgICBvayhhcnIuaW5kZXhPZigxKSA9PSAwKTtcbiAqICAgICAgIG9rKGFyci5pbmRleE9mKDIpID09IDEpO1xuICogICAgICAgb2soYXJyLmluZGV4T2YoMykgPT0gMik7XG4gKiAgICAgfSk7XG4gKlxuICogICAgIHN1aXRlKCdTdHJpbmcnKTtcbiAqXG4gKiAgICAgdGVzdCgnI2xlbmd0aCcsIGZ1bmN0aW9uKCl7XG4gKiAgICAgICBvaygnZm9vJy5sZW5ndGggPT0gMyk7XG4gKiAgICAgfSk7XG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3VpdGUpe1xuICB2YXIgc3VpdGVzID0gW3N1aXRlXTtcblxuICBzdWl0ZS5vbigncHJlLXJlcXVpcmUnLCBmdW5jdGlvbihjb250ZXh0LCBmaWxlLCBtb2NoYSl7XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGJlZm9yZSBydW5uaW5nIHRlc3RzLlxuICAgICAqL1xuXG4gICAgY29udGV4dC5iZWZvcmUgPSBmdW5jdGlvbihuYW1lLCBmbil7XG4gICAgICBzdWl0ZXNbMF0uYmVmb3JlQWxsKG5hbWUsIGZuKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBhZnRlciBydW5uaW5nIHRlc3RzLlxuICAgICAqL1xuXG4gICAgY29udGV4dC5hZnRlciA9IGZ1bmN0aW9uKG5hbWUsIGZuKXtcbiAgICAgIHN1aXRlc1swXS5hZnRlckFsbChuYW1lLCBmbik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgYmVmb3JlIGVhY2ggdGVzdCBjYXNlLlxuICAgICAqL1xuXG4gICAgY29udGV4dC5iZWZvcmVFYWNoID0gZnVuY3Rpb24obmFtZSwgZm4pe1xuICAgICAgc3VpdGVzWzBdLmJlZm9yZUVhY2gobmFtZSwgZm4pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGFmdGVyIGVhY2ggdGVzdCBjYXNlLlxuICAgICAqL1xuXG4gICAgY29udGV4dC5hZnRlckVhY2ggPSBmdW5jdGlvbihuYW1lLCBmbil7XG4gICAgICBzdWl0ZXNbMF0uYWZ0ZXJFYWNoKG5hbWUsIGZuKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVzY3JpYmUgYSBcInN1aXRlXCIgd2l0aCB0aGUgZ2l2ZW4gYHRpdGxlYC5cbiAgICAgKi9cblxuICAgIGNvbnRleHQuc3VpdGUgPSBmdW5jdGlvbih0aXRsZSl7XG4gICAgICBpZiAoc3VpdGVzLmxlbmd0aCA+IDEpIHN1aXRlcy5zaGlmdCgpO1xuICAgICAgdmFyIHN1aXRlID0gU3VpdGUuY3JlYXRlKHN1aXRlc1swXSwgdGl0bGUpO1xuICAgICAgc3VpdGUuZmlsZSA9IGZpbGU7XG4gICAgICBzdWl0ZXMudW5zaGlmdChzdWl0ZSk7XG4gICAgICByZXR1cm4gc3VpdGU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4Y2x1c2l2ZSB0ZXN0LWNhc2UuXG4gICAgICovXG5cbiAgICBjb250ZXh0LnN1aXRlLm9ubHkgPSBmdW5jdGlvbih0aXRsZSwgZm4pe1xuICAgICAgdmFyIHN1aXRlID0gY29udGV4dC5zdWl0ZSh0aXRsZSwgZm4pO1xuICAgICAgbW9jaGEuZ3JlcChzdWl0ZS5mdWxsVGl0bGUoKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlc2NyaWJlIGEgc3BlY2lmaWNhdGlvbiBvciB0ZXN0LWNhc2VcbiAgICAgKiB3aXRoIHRoZSBnaXZlbiBgdGl0bGVgIGFuZCBjYWxsYmFjayBgZm5gXG4gICAgICogYWN0aW5nIGFzIGEgdGh1bmsuXG4gICAgICovXG5cbiAgICBjb250ZXh0LnRlc3QgPSBmdW5jdGlvbih0aXRsZSwgZm4pe1xuICAgICAgdmFyIHRlc3QgPSBuZXcgVGVzdCh0aXRsZSwgZm4pO1xuICAgICAgdGVzdC5maWxlID0gZmlsZTtcbiAgICAgIHN1aXRlc1swXS5hZGRUZXN0KHRlc3QpO1xuICAgICAgcmV0dXJuIHRlc3Q7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4Y2x1c2l2ZSB0ZXN0LWNhc2UuXG4gICAgICovXG5cbiAgICBjb250ZXh0LnRlc3Qub25seSA9IGZ1bmN0aW9uKHRpdGxlLCBmbil7XG4gICAgICB2YXIgdGVzdCA9IGNvbnRleHQudGVzdCh0aXRsZSwgZm4pO1xuICAgICAgdmFyIHJlU3RyaW5nID0gJ14nICsgdXRpbHMuZXNjYXBlUmVnZXhwKHRlc3QuZnVsbFRpdGxlKCkpICsgJyQnO1xuICAgICAgbW9jaGEuZ3JlcChuZXcgUmVnRXhwKHJlU3RyaW5nKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFBlbmRpbmcgdGVzdCBjYXNlLlxuICAgICAqL1xuXG4gICAgY29udGV4dC50ZXN0LnNraXAgPSBmdW5jdGlvbih0aXRsZSl7XG4gICAgICBjb250ZXh0LnRlc3QodGl0bGUpO1xuICAgIH07XG4gIH0pO1xufTtcblxufSk7IC8vIG1vZHVsZTogaW50ZXJmYWNlcy9xdW5pdC5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwiaW50ZXJmYWNlcy90ZGQuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBTdWl0ZSA9IHJlcXVpcmUoJy4uL3N1aXRlJylcbiAgLCBUZXN0ID0gcmVxdWlyZSgnLi4vdGVzdCcpXG4gICwgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpOztcblxuLyoqXG4gKiBUREQtc3R5bGUgaW50ZXJmYWNlOlxuICpcbiAqICAgICAgc3VpdGUoJ0FycmF5JywgZnVuY3Rpb24oKXtcbiAqICAgICAgICBzdWl0ZSgnI2luZGV4T2YoKScsIGZ1bmN0aW9uKCl7XG4gKiAgICAgICAgICBzdWl0ZVNldHVwKGZ1bmN0aW9uKCl7XG4gKlxuICogICAgICAgICAgfSk7XG4gKlxuICogICAgICAgICAgdGVzdCgnc2hvdWxkIHJldHVybiAtMSB3aGVuIG5vdCBwcmVzZW50JywgZnVuY3Rpb24oKXtcbiAqXG4gKiAgICAgICAgICB9KTtcbiAqXG4gKiAgICAgICAgICB0ZXN0KCdzaG91bGQgcmV0dXJuIHRoZSBpbmRleCB3aGVuIHByZXNlbnQnLCBmdW5jdGlvbigpe1xuICpcbiAqICAgICAgICAgIH0pO1xuICpcbiAqICAgICAgICAgIHN1aXRlVGVhcmRvd24oZnVuY3Rpb24oKXtcbiAqXG4gKiAgICAgICAgICB9KTtcbiAqICAgICAgICB9KTtcbiAqICAgICAgfSk7XG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3VpdGUpe1xuICB2YXIgc3VpdGVzID0gW3N1aXRlXTtcblxuICBzdWl0ZS5vbigncHJlLXJlcXVpcmUnLCBmdW5jdGlvbihjb250ZXh0LCBmaWxlLCBtb2NoYSl7XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGJlZm9yZSBlYWNoIHRlc3QgY2FzZS5cbiAgICAgKi9cblxuICAgIGNvbnRleHQuc2V0dXAgPSBmdW5jdGlvbihuYW1lLCBmbil7XG4gICAgICBzdWl0ZXNbMF0uYmVmb3JlRWFjaChuYW1lLCBmbik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgYWZ0ZXIgZWFjaCB0ZXN0IGNhc2UuXG4gICAgICovXG5cbiAgICBjb250ZXh0LnRlYXJkb3duID0gZnVuY3Rpb24obmFtZSwgZm4pe1xuICAgICAgc3VpdGVzWzBdLmFmdGVyRWFjaChuYW1lLCBmbik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgYmVmb3JlIHRoZSBzdWl0ZS5cbiAgICAgKi9cblxuICAgIGNvbnRleHQuc3VpdGVTZXR1cCA9IGZ1bmN0aW9uKG5hbWUsIGZuKXtcbiAgICAgIHN1aXRlc1swXS5iZWZvcmVBbGwobmFtZSwgZm4pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGFmdGVyIHRoZSBzdWl0ZS5cbiAgICAgKi9cblxuICAgIGNvbnRleHQuc3VpdGVUZWFyZG93biA9IGZ1bmN0aW9uKG5hbWUsIGZuKXtcbiAgICAgIHN1aXRlc1swXS5hZnRlckFsbChuYW1lLCBmbik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlc2NyaWJlIGEgXCJzdWl0ZVwiIHdpdGggdGhlIGdpdmVuIGB0aXRsZWBcbiAgICAgKiBhbmQgY2FsbGJhY2sgYGZuYCBjb250YWluaW5nIG5lc3RlZCBzdWl0ZXNcbiAgICAgKiBhbmQvb3IgdGVzdHMuXG4gICAgICovXG5cbiAgICBjb250ZXh0LnN1aXRlID0gZnVuY3Rpb24odGl0bGUsIGZuKXtcbiAgICAgIHZhciBzdWl0ZSA9IFN1aXRlLmNyZWF0ZShzdWl0ZXNbMF0sIHRpdGxlKTtcbiAgICAgIHN1aXRlLmZpbGUgPSBmaWxlO1xuICAgICAgc3VpdGVzLnVuc2hpZnQoc3VpdGUpO1xuICAgICAgZm4uY2FsbChzdWl0ZSk7XG4gICAgICBzdWl0ZXMuc2hpZnQoKTtcbiAgICAgIHJldHVybiBzdWl0ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUGVuZGluZyBzdWl0ZS5cbiAgICAgKi9cbiAgICBjb250ZXh0LnN1aXRlLnNraXAgPSBmdW5jdGlvbih0aXRsZSwgZm4pIHtcbiAgICAgIHZhciBzdWl0ZSA9IFN1aXRlLmNyZWF0ZShzdWl0ZXNbMF0sIHRpdGxlKTtcbiAgICAgIHN1aXRlLnBlbmRpbmcgPSB0cnVlO1xuICAgICAgc3VpdGVzLnVuc2hpZnQoc3VpdGUpO1xuICAgICAgZm4uY2FsbChzdWl0ZSk7XG4gICAgICBzdWl0ZXMuc2hpZnQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXhjbHVzaXZlIHRlc3QtY2FzZS5cbiAgICAgKi9cblxuICAgIGNvbnRleHQuc3VpdGUub25seSA9IGZ1bmN0aW9uKHRpdGxlLCBmbil7XG4gICAgICB2YXIgc3VpdGUgPSBjb250ZXh0LnN1aXRlKHRpdGxlLCBmbik7XG4gICAgICBtb2NoYS5ncmVwKHN1aXRlLmZ1bGxUaXRsZSgpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVzY3JpYmUgYSBzcGVjaWZpY2F0aW9uIG9yIHRlc3QtY2FzZVxuICAgICAqIHdpdGggdGhlIGdpdmVuIGB0aXRsZWAgYW5kIGNhbGxiYWNrIGBmbmBcbiAgICAgKiBhY3RpbmcgYXMgYSB0aHVuay5cbiAgICAgKi9cblxuICAgIGNvbnRleHQudGVzdCA9IGZ1bmN0aW9uKHRpdGxlLCBmbil7XG4gICAgICB2YXIgc3VpdGUgPSBzdWl0ZXNbMF07XG4gICAgICBpZiAoc3VpdGUucGVuZGluZykgdmFyIGZuID0gbnVsbDtcbiAgICAgIHZhciB0ZXN0ID0gbmV3IFRlc3QodGl0bGUsIGZuKTtcbiAgICAgIHRlc3QuZmlsZSA9IGZpbGU7XG4gICAgICBzdWl0ZS5hZGRUZXN0KHRlc3QpO1xuICAgICAgcmV0dXJuIHRlc3Q7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4Y2x1c2l2ZSB0ZXN0LWNhc2UuXG4gICAgICovXG5cbiAgICBjb250ZXh0LnRlc3Qub25seSA9IGZ1bmN0aW9uKHRpdGxlLCBmbil7XG4gICAgICB2YXIgdGVzdCA9IGNvbnRleHQudGVzdCh0aXRsZSwgZm4pO1xuICAgICAgdmFyIHJlU3RyaW5nID0gJ14nICsgdXRpbHMuZXNjYXBlUmVnZXhwKHRlc3QuZnVsbFRpdGxlKCkpICsgJyQnO1xuICAgICAgbW9jaGEuZ3JlcChuZXcgUmVnRXhwKHJlU3RyaW5nKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFBlbmRpbmcgdGVzdCBjYXNlLlxuICAgICAqL1xuXG4gICAgY29udGV4dC50ZXN0LnNraXAgPSBmdW5jdGlvbih0aXRsZSl7XG4gICAgICBjb250ZXh0LnRlc3QodGl0bGUpO1xuICAgIH07XG4gIH0pO1xufTtcblxufSk7IC8vIG1vZHVsZTogaW50ZXJmYWNlcy90ZGQuanNcblxucmVxdWlyZS5yZWdpc3RlcihcIm1vY2hhLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG4vKiFcbiAqIG1vY2hhXG4gKiBDb3B5cmlnaHQoYykgMjAxMSBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBwYXRoID0gcmVxdWlyZSgnYnJvd3Nlci9wYXRoJylcbiAgLCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuLyoqXG4gKiBFeHBvc2UgYE1vY2hhYC5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBNb2NoYTtcblxuLyoqXG4gKiBUbyByZXF1aXJlIGxvY2FsIFVJcyBhbmQgcmVwb3J0ZXJzIHdoZW4gcnVubmluZyBpbiBub2RlLlxuICovXG5cbmlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MuY3dkID09PSAnZnVuY3Rpb24nKSB7XG4gIHZhciBqb2luID0gcGF0aC5qb2luXG4gICAgLCBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuICBtb2R1bGUucGF0aHMucHVzaChjd2QsIGpvaW4oY3dkLCAnbm9kZV9tb2R1bGVzJykpO1xufVxuXG4vKipcbiAqIEV4cG9zZSBpbnRlcm5hbHMuXG4gKi9cblxuZXhwb3J0cy51dGlscyA9IHV0aWxzO1xuZXhwb3J0cy5pbnRlcmZhY2VzID0gcmVxdWlyZSgnLi9pbnRlcmZhY2VzJyk7XG5leHBvcnRzLnJlcG9ydGVycyA9IHJlcXVpcmUoJy4vcmVwb3J0ZXJzJyk7XG5leHBvcnRzLlJ1bm5hYmxlID0gcmVxdWlyZSgnLi9ydW5uYWJsZScpO1xuZXhwb3J0cy5Db250ZXh0ID0gcmVxdWlyZSgnLi9jb250ZXh0Jyk7XG5leHBvcnRzLlJ1bm5lciA9IHJlcXVpcmUoJy4vcnVubmVyJyk7XG5leHBvcnRzLlN1aXRlID0gcmVxdWlyZSgnLi9zdWl0ZScpO1xuZXhwb3J0cy5Ib29rID0gcmVxdWlyZSgnLi9ob29rJyk7XG5leHBvcnRzLlRlc3QgPSByZXF1aXJlKCcuL3Rlc3QnKTtcblxuLyoqXG4gKiBSZXR1cm4gaW1hZ2UgYG5hbWVgIHBhdGguXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGltYWdlKG5hbWUpIHtcbiAgcmV0dXJuIF9fZGlybmFtZSArICcvLi4vaW1hZ2VzLycgKyBuYW1lICsgJy5wbmcnO1xufVxuXG4vKipcbiAqIFNldHVwIG1vY2hhIHdpdGggYG9wdGlvbnNgLlxuICpcbiAqIE9wdGlvbnM6XG4gKlxuICogICAtIGB1aWAgbmFtZSBcImJkZFwiLCBcInRkZFwiLCBcImV4cG9ydHNcIiBldGNcbiAqICAgLSBgcmVwb3J0ZXJgIHJlcG9ydGVyIGluc3RhbmNlLCBkZWZhdWx0cyB0byBgbW9jaGEucmVwb3J0ZXJzLnNwZWNgXG4gKiAgIC0gYGdsb2JhbHNgIGFycmF5IG9mIGFjY2VwdGVkIGdsb2JhbHNcbiAqICAgLSBgdGltZW91dGAgdGltZW91dCBpbiBtaWxsaXNlY29uZHNcbiAqICAgLSBgYmFpbGAgYmFpbCBvbiB0aGUgZmlyc3QgdGVzdCBmYWlsdXJlXG4gKiAgIC0gYHNsb3dgIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBjb25zaWRlcmluZyBhIHRlc3Qgc2xvd1xuICogICAtIGBpZ25vcmVMZWFrc2AgaWdub3JlIGdsb2JhbCBsZWFrc1xuICogICAtIGBncmVwYCBzdHJpbmcgb3IgcmVnZXhwIHRvIGZpbHRlciB0ZXN0cyB3aXRoXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gTW9jaGEob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdGhpcy5maWxlcyA9IFtdO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB0aGlzLmdyZXAob3B0aW9ucy5ncmVwKTtcbiAgdGhpcy5zdWl0ZSA9IG5ldyBleHBvcnRzLlN1aXRlKCcnLCBuZXcgZXhwb3J0cy5Db250ZXh0KTtcbiAgdGhpcy51aShvcHRpb25zLnVpKTtcbiAgdGhpcy5iYWlsKG9wdGlvbnMuYmFpbCk7XG4gIHRoaXMucmVwb3J0ZXIob3B0aW9ucy5yZXBvcnRlcik7XG4gIGlmIChudWxsICE9IG9wdGlvbnMudGltZW91dCkgdGhpcy50aW1lb3V0KG9wdGlvbnMudGltZW91dCk7XG4gIHRoaXMudXNlQ29sb3JzKG9wdGlvbnMudXNlQ29sb3JzKVxuICBpZiAob3B0aW9ucy5lbmFibGVUaW1lb3V0cyAhPT0gbnVsbCkgdGhpcy5lbmFibGVUaW1lb3V0cyhvcHRpb25zLmVuYWJsZVRpbWVvdXRzKTtcbiAgaWYgKG9wdGlvbnMuc2xvdykgdGhpcy5zbG93KG9wdGlvbnMuc2xvdyk7XG5cbiAgdGhpcy5zdWl0ZS5vbigncHJlLXJlcXVpcmUnLCBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIGV4cG9ydHMuYWZ0ZXJFYWNoID0gY29udGV4dC5hZnRlckVhY2ggfHwgY29udGV4dC50ZWFyZG93bjtcbiAgICBleHBvcnRzLmFmdGVyID0gY29udGV4dC5hZnRlciB8fCBjb250ZXh0LnN1aXRlVGVhcmRvd247XG4gICAgZXhwb3J0cy5iZWZvcmVFYWNoID0gY29udGV4dC5iZWZvcmVFYWNoIHx8IGNvbnRleHQuc2V0dXA7XG4gICAgZXhwb3J0cy5iZWZvcmUgPSBjb250ZXh0LmJlZm9yZSB8fCBjb250ZXh0LnN1aXRlU2V0dXA7XG4gICAgZXhwb3J0cy5kZXNjcmliZSA9IGNvbnRleHQuZGVzY3JpYmUgfHwgY29udGV4dC5zdWl0ZTtcbiAgICBleHBvcnRzLml0ID0gY29udGV4dC5pdCB8fCBjb250ZXh0LnRlc3Q7XG4gICAgZXhwb3J0cy5zZXR1cCA9IGNvbnRleHQuc2V0dXAgfHwgY29udGV4dC5iZWZvcmVFYWNoO1xuICAgIGV4cG9ydHMuc3VpdGVTZXR1cCA9IGNvbnRleHQuc3VpdGVTZXR1cCB8fCBjb250ZXh0LmJlZm9yZTtcbiAgICBleHBvcnRzLnN1aXRlVGVhcmRvd24gPSBjb250ZXh0LnN1aXRlVGVhcmRvd24gfHwgY29udGV4dC5hZnRlcjtcbiAgICBleHBvcnRzLnN1aXRlID0gY29udGV4dC5zdWl0ZSB8fCBjb250ZXh0LmRlc2NyaWJlO1xuICAgIGV4cG9ydHMudGVhcmRvd24gPSBjb250ZXh0LnRlYXJkb3duIHx8IGNvbnRleHQuYWZ0ZXJFYWNoO1xuICAgIGV4cG9ydHMudGVzdCA9IGNvbnRleHQudGVzdCB8fCBjb250ZXh0Lml0O1xuICB9KTtcbn1cblxuLyoqXG4gKiBFbmFibGUgb3IgZGlzYWJsZSBiYWlsaW5nIG9uIHRoZSBmaXJzdCBmYWlsdXJlLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2JhaWxdXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbk1vY2hhLnByb3RvdHlwZS5iYWlsID0gZnVuY3Rpb24oYmFpbCl7XG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIGJhaWwgPSB0cnVlO1xuICB0aGlzLnN1aXRlLmJhaWwoYmFpbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgdGVzdCBgZmlsZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuTW9jaGEucHJvdG90eXBlLmFkZEZpbGUgPSBmdW5jdGlvbihmaWxlKXtcbiAgdGhpcy5maWxlcy5wdXNoKGZpbGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHJlcG9ydGVyIHRvIGByZXBvcnRlcmAsIGRlZmF1bHRzIHRvIFwic3BlY1wiLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSByZXBvcnRlciBuYW1lIG9yIGNvbnN0cnVjdG9yXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbk1vY2hhLnByb3RvdHlwZS5yZXBvcnRlciA9IGZ1bmN0aW9uKHJlcG9ydGVyKXtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHJlcG9ydGVyKSB7XG4gICAgdGhpcy5fcmVwb3J0ZXIgPSByZXBvcnRlcjtcbiAgfSBlbHNlIHtcbiAgICByZXBvcnRlciA9IHJlcG9ydGVyIHx8ICdzcGVjJztcbiAgICB2YXIgX3JlcG9ydGVyO1xuICAgIHRyeSB7IF9yZXBvcnRlciA9IHJlcXVpcmUoJy4vcmVwb3J0ZXJzLycgKyByZXBvcnRlcik7IH0gY2F0Y2ggKGVycikge307XG4gICAgaWYgKCFfcmVwb3J0ZXIpIHRyeSB7IF9yZXBvcnRlciA9IHJlcXVpcmUocmVwb3J0ZXIpOyB9IGNhdGNoIChlcnIpIHt9O1xuICAgIGlmICghX3JlcG9ydGVyICYmIHJlcG9ydGVyID09PSAndGVhbWNpdHknKVxuICAgICAgY29uc29sZS53YXJuKCdUaGUgVGVhbWNpdHkgcmVwb3J0ZXIgd2FzIG1vdmVkIHRvIGEgcGFja2FnZSBuYW1lZCAnICtcbiAgICAgICAgJ21vY2hhLXRlYW1jaXR5LXJlcG9ydGVyICcgK1xuICAgICAgICAnKGh0dHBzOi8vbnBtanMub3JnL3BhY2thZ2UvbW9jaGEtdGVhbWNpdHktcmVwb3J0ZXIpLicpO1xuICAgIGlmICghX3JlcG9ydGVyKSB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcmVwb3J0ZXIgXCInICsgcmVwb3J0ZXIgKyAnXCInKTtcbiAgICB0aGlzLl9yZXBvcnRlciA9IF9yZXBvcnRlcjtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRlc3QgVUkgYG5hbWVgLCBkZWZhdWx0cyB0byBcImJkZFwiLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBiZGRcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuTW9jaGEucHJvdG90eXBlLnVpID0gZnVuY3Rpb24obmFtZSl7XG4gIG5hbWUgPSBuYW1lIHx8ICdiZGQnO1xuICB0aGlzLl91aSA9IGV4cG9ydHMuaW50ZXJmYWNlc1tuYW1lXTtcbiAgaWYgKCF0aGlzLl91aSkgdHJ5IHsgdGhpcy5fdWkgPSByZXF1aXJlKG5hbWUpOyB9IGNhdGNoIChlcnIpIHt9O1xuICBpZiAoIXRoaXMuX3VpKSB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgaW50ZXJmYWNlIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgdGhpcy5fdWkgPSB0aGlzLl91aSh0aGlzLnN1aXRlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIExvYWQgcmVnaXN0ZXJlZCBmaWxlcy5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Nb2NoYS5wcm90b3R5cGUubG9hZEZpbGVzID0gZnVuY3Rpb24oZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBzdWl0ZSA9IHRoaXMuc3VpdGU7XG4gIHZhciBwZW5kaW5nID0gdGhpcy5maWxlcy5sZW5ndGg7XG4gIHRoaXMuZmlsZXMuZm9yRWFjaChmdW5jdGlvbihmaWxlKXtcbiAgICBmaWxlID0gcGF0aC5yZXNvbHZlKGZpbGUpO1xuICAgIHN1aXRlLmVtaXQoJ3ByZS1yZXF1aXJlJywgZ2xvYmFsLCBmaWxlLCBzZWxmKTtcbiAgICBzdWl0ZS5lbWl0KCdyZXF1aXJlJywgcmVxdWlyZShmaWxlKSwgZmlsZSwgc2VsZik7XG4gICAgc3VpdGUuZW1pdCgncG9zdC1yZXF1aXJlJywgZ2xvYmFsLCBmaWxlLCBzZWxmKTtcbiAgICAtLXBlbmRpbmcgfHwgKGZuICYmIGZuKCkpO1xuICB9KTtcbn07XG5cbi8qKlxuICogRW5hYmxlIGdyb3dsIHN1cHBvcnQuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuTW9jaGEucHJvdG90eXBlLl9ncm93bCA9IGZ1bmN0aW9uKHJ1bm5lciwgcmVwb3J0ZXIpIHtcbiAgdmFyIG5vdGlmeSA9IHJlcXVpcmUoJ2dyb3dsJyk7XG5cbiAgcnVubmVyLm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuICAgIHZhciBzdGF0cyA9IHJlcG9ydGVyLnN0YXRzO1xuICAgIGlmIChzdGF0cy5mYWlsdXJlcykge1xuICAgICAgdmFyIG1zZyA9IHN0YXRzLmZhaWx1cmVzICsgJyBvZiAnICsgcnVubmVyLnRvdGFsICsgJyB0ZXN0cyBmYWlsZWQnO1xuICAgICAgbm90aWZ5KG1zZywgeyBuYW1lOiAnbW9jaGEnLCB0aXRsZTogJ0ZhaWxlZCcsIGltYWdlOiBpbWFnZSgnZXJyb3InKSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm90aWZ5KHN0YXRzLnBhc3NlcyArICcgdGVzdHMgcGFzc2VkIGluICcgKyBzdGF0cy5kdXJhdGlvbiArICdtcycsIHtcbiAgICAgICAgICBuYW1lOiAnbW9jaGEnXG4gICAgICAgICwgdGl0bGU6ICdQYXNzZWQnXG4gICAgICAgICwgaW1hZ2U6IGltYWdlKCdvaycpXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBBZGQgcmVnZXhwIHRvIGdyZXAsIGlmIGByZWAgaXMgYSBzdHJpbmcgaXQgaXMgZXNjYXBlZC5cbiAqXG4gKiBAcGFyYW0ge1JlZ0V4cHxTdHJpbmd9IHJlXG4gKiBAcmV0dXJuIHtNb2NoYX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuTW9jaGEucHJvdG90eXBlLmdyZXAgPSBmdW5jdGlvbihyZSl7XG4gIHRoaXMub3B0aW9ucy5ncmVwID0gJ3N0cmluZycgPT0gdHlwZW9mIHJlXG4gICAgPyBuZXcgUmVnRXhwKHV0aWxzLmVzY2FwZVJlZ2V4cChyZSkpXG4gICAgOiByZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEludmVydCBgLmdyZXAoKWAgbWF0Y2hlcy5cbiAqXG4gKiBAcmV0dXJuIHtNb2NoYX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuTW9jaGEucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMub3B0aW9ucy5pbnZlcnQgPSB0cnVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSWdub3JlIGdsb2JhbCBsZWFrcy5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlnbm9yZVxuICogQHJldHVybiB7TW9jaGF9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbk1vY2hhLnByb3RvdHlwZS5pZ25vcmVMZWFrcyA9IGZ1bmN0aW9uKGlnbm9yZSl7XG4gIHRoaXMub3B0aW9ucy5pZ25vcmVMZWFrcyA9ICEhaWdub3JlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW5hYmxlIGdsb2JhbCBsZWFrIGNoZWNraW5nLlxuICpcbiAqIEByZXR1cm4ge01vY2hhfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Nb2NoYS5wcm90b3R5cGUuY2hlY2tMZWFrcyA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMub3B0aW9ucy5pZ25vcmVMZWFrcyA9IGZhbHNlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW5hYmxlIGdyb3dsIHN1cHBvcnQuXG4gKlxuICogQHJldHVybiB7TW9jaGF9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbk1vY2hhLnByb3RvdHlwZS5ncm93bCA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMub3B0aW9ucy5ncm93bCA9IHRydWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJZ25vcmUgYGdsb2JhbHNgIGFycmF5IG9yIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fFN0cmluZ30gZ2xvYmFsc1xuICogQHJldHVybiB7TW9jaGF9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbk1vY2hhLnByb3RvdHlwZS5nbG9iYWxzID0gZnVuY3Rpb24oZ2xvYmFscyl7XG4gIHRoaXMub3B0aW9ucy5nbG9iYWxzID0gKHRoaXMub3B0aW9ucy5nbG9iYWxzIHx8IFtdKS5jb25jYXQoZ2xvYmFscyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGNvbG9yIG91dHB1dC5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNvbG9yc1xuICogQHJldHVybiB7TW9jaGF9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbk1vY2hhLnByb3RvdHlwZS51c2VDb2xvcnMgPSBmdW5jdGlvbihjb2xvcnMpe1xuICB0aGlzLm9wdGlvbnMudXNlQ29sb3JzID0gYXJndW1lbnRzLmxlbmd0aCAmJiBjb2xvcnMgIT0gdW5kZWZpbmVkXG4gICAgPyBjb2xvcnNcbiAgICA6IHRydWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBVc2UgaW5saW5lIGRpZmZzIHJhdGhlciB0aGFuICsvLS5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlubGluZURpZmZzXG4gKiBAcmV0dXJuIHtNb2NoYX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuTW9jaGEucHJvdG90eXBlLnVzZUlubGluZURpZmZzID0gZnVuY3Rpb24oaW5saW5lRGlmZnMpIHtcbiAgdGhpcy5vcHRpb25zLnVzZUlubGluZURpZmZzID0gYXJndW1lbnRzLmxlbmd0aCAmJiBpbmxpbmVEaWZmcyAhPSB1bmRlZmluZWRcbiAgPyBpbmxpbmVEaWZmc1xuICA6IGZhbHNlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZW91dFxuICogQHJldHVybiB7TW9jaGF9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbk1vY2hhLnByb3RvdHlwZS50aW1lb3V0ID0gZnVuY3Rpb24odGltZW91dCl7XG4gIHRoaXMuc3VpdGUudGltZW91dCh0aW1lb3V0KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBzbG93bmVzcyB0aHJlc2hvbGQgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzbG93XG4gKiBAcmV0dXJuIHtNb2NoYX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuTW9jaGEucHJvdG90eXBlLnNsb3cgPSBmdW5jdGlvbihzbG93KXtcbiAgdGhpcy5zdWl0ZS5zbG93KHNsb3cpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW5hYmxlIHRpbWVvdXRzLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZW5hYmxlZFxuICogQHJldHVybiB7TW9jaGF9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbk1vY2hhLnByb3RvdHlwZS5lbmFibGVUaW1lb3V0cyA9IGZ1bmN0aW9uKGVuYWJsZWQpIHtcbiAgdGhpcy5zdWl0ZS5lbmFibGVUaW1lb3V0cyhhcmd1bWVudHMubGVuZ3RoICYmIGVuYWJsZWQgIT09IHVuZGVmaW5lZFxuICAgID8gZW5hYmxlZFxuICAgIDogdHJ1ZSk7XG4gIHJldHVybiB0aGlzXG59O1xuXG4vKipcbiAqIE1ha2VzIGFsbCB0ZXN0cyBhc3luYyAoYWNjZXB0aW5nIGEgY2FsbGJhY2spXG4gKlxuICogQHJldHVybiB7TW9jaGF9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbk1vY2hhLnByb3RvdHlwZS5hc3luY09ubHkgPSBmdW5jdGlvbigpe1xuICB0aGlzLm9wdGlvbnMuYXN5bmNPbmx5ID0gdHJ1ZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJ1biB0ZXN0cyBhbmQgaW52b2tlIGBmbigpYCB3aGVuIGNvbXBsZXRlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSdW5uZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbk1vY2hhLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbihmbil7XG4gIGlmICh0aGlzLmZpbGVzLmxlbmd0aCkgdGhpcy5sb2FkRmlsZXMoKTtcbiAgdmFyIHN1aXRlID0gdGhpcy5zdWl0ZTtcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gIG9wdGlvbnMuZmlsZXMgPSB0aGlzLmZpbGVzO1xuICB2YXIgcnVubmVyID0gbmV3IGV4cG9ydHMuUnVubmVyKHN1aXRlKTtcbiAgdmFyIHJlcG9ydGVyID0gbmV3IHRoaXMuX3JlcG9ydGVyKHJ1bm5lciwgb3B0aW9ucyk7XG4gIHJ1bm5lci5pZ25vcmVMZWFrcyA9IGZhbHNlICE9PSBvcHRpb25zLmlnbm9yZUxlYWtzO1xuICBydW5uZXIuYXN5bmNPbmx5ID0gb3B0aW9ucy5hc3luY09ubHk7XG4gIGlmIChvcHRpb25zLmdyZXApIHJ1bm5lci5ncmVwKG9wdGlvbnMuZ3JlcCwgb3B0aW9ucy5pbnZlcnQpO1xuICBpZiAob3B0aW9ucy5nbG9iYWxzKSBydW5uZXIuZ2xvYmFscyhvcHRpb25zLmdsb2JhbHMpO1xuICBpZiAob3B0aW9ucy5ncm93bCkgdGhpcy5fZ3Jvd2wocnVubmVyLCByZXBvcnRlcik7XG4gIGV4cG9ydHMucmVwb3J0ZXJzLkJhc2UudXNlQ29sb3JzID0gb3B0aW9ucy51c2VDb2xvcnM7XG4gIGV4cG9ydHMucmVwb3J0ZXJzLkJhc2UuaW5saW5lRGlmZnMgPSBvcHRpb25zLnVzZUlubGluZURpZmZzO1xuICByZXR1cm4gcnVubmVyLnJ1bihmbik7XG59O1xuXG59KTsgLy8gbW9kdWxlOiBtb2NoYS5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwibXMuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcbi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgeSA9IGQgKiAzNjUuMjU7XG5cbi8qKlxuICogUGFyc2Ugb3IgZm9ybWF0IHRoZSBnaXZlbiBgdmFsYC5cbiAqXG4gKiBPcHRpb25zOlxuICpcbiAqICAtIGBsb25nYCB2ZXJib3NlIGZvcm1hdHRpbmcgW2ZhbHNlXVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gdmFsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfE51bWJlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwsIG9wdGlvbnMpe1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2YWwpIHJldHVybiBwYXJzZSh2YWwpO1xuICByZXR1cm4gb3B0aW9ucy5sb25nID8gbG9uZ0Zvcm1hdCh2YWwpIDogc2hvcnRGb3JtYXQodmFsKTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIGFuZCByZXR1cm4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICB2YXIgbWF0Y2ggPSAvXigoPzpcXGQrKT9cXC4/XFxkKykgKihtc3xzZWNvbmRzP3xzfG1pbnV0ZXM/fG18aG91cnM/fGh8ZGF5cz98ZHx5ZWFycz98eSk/JC9pLmV4ZWMoc3RyKTtcbiAgaWYgKCFtYXRjaCkgcmV0dXJuO1xuICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICB2YXIgdHlwZSA9IChtYXRjaFsyXSB8fCAnbXMnKS50b0xvd2VyQ2FzZSgpO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICd5ZWFycyc6XG4gICAgY2FzZSAneWVhcic6XG4gICAgY2FzZSAneSc6XG4gICAgICByZXR1cm4gbiAqIHk7XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZDtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnbWludXRlJzpcbiAgICBjYXNlICdtJzpcbiAgICAgIHJldHVybiBuICogbTtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdzZWNvbmQnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21zJzpcbiAgICAgIHJldHVybiBuO1xuICB9XG59XG5cbi8qKlxuICogU2hvcnQgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2hvcnRGb3JtYXQobXMpIHtcbiAgaWYgKG1zID49IGQpIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gZCkgKyAnZCc7XG4gIGlmIChtcyA+PSBoKSByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGgpICsgJ2gnO1xuICBpZiAobXMgPj0gbSkgcmV0dXJuIE1hdGgucm91bmQobXMgLyBtKSArICdtJztcbiAgaWYgKG1zID49IHMpIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gcykgKyAncyc7XG4gIHJldHVybiBtcyArICdtcyc7XG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb25nRm9ybWF0KG1zKSB7XG4gIHJldHVybiBwbHVyYWwobXMsIGQsICdkYXknKVxuICAgIHx8IHBsdXJhbChtcywgaCwgJ2hvdXInKVxuICAgIHx8IHBsdXJhbChtcywgbSwgJ21pbnV0ZScpXG4gICAgfHwgcGx1cmFsKG1zLCBzLCAnc2Vjb25kJylcbiAgICB8fCBtcyArICcgbXMnO1xufVxuXG4vKipcbiAqIFBsdXJhbGl6YXRpb24gaGVscGVyLlxuICovXG5cbmZ1bmN0aW9uIHBsdXJhbChtcywgbiwgbmFtZSkge1xuICBpZiAobXMgPCBuKSByZXR1cm47XG4gIGlmIChtcyA8IG4gKiAxLjUpIHJldHVybiBNYXRoLmZsb29yKG1zIC8gbikgKyAnICcgKyBuYW1lO1xuICByZXR1cm4gTWF0aC5jZWlsKG1zIC8gbikgKyAnICcgKyBuYW1lICsgJ3MnO1xufVxuXG59KTsgLy8gbW9kdWxlOiBtcy5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwicmVwb3J0ZXJzL2Jhc2UuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciB0dHkgPSByZXF1aXJlKCdicm93c2VyL3R0eScpXG4gICwgZGlmZiA9IHJlcXVpcmUoJ2Jyb3dzZXIvZGlmZicpXG4gICwgbXMgPSByZXF1aXJlKCcuLi9tcycpXG4gICwgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIFNhdmUgdGltZXIgcmVmZXJlbmNlcyB0byBhdm9pZCBTaW5vbiBpbnRlcmZlcmluZyAoc2VlIEdILTIzNykuXG4gKi9cblxudmFyIERhdGUgPSBnbG9iYWwuRGF0ZVxuICAsIHNldFRpbWVvdXQgPSBnbG9iYWwuc2V0VGltZW91dFxuICAsIHNldEludGVydmFsID0gZ2xvYmFsLnNldEludGVydmFsXG4gICwgY2xlYXJUaW1lb3V0ID0gZ2xvYmFsLmNsZWFyVGltZW91dFxuICAsIGNsZWFySW50ZXJ2YWwgPSBnbG9iYWwuY2xlYXJJbnRlcnZhbDtcblxuLyoqXG4gKiBDaGVjayBpZiBib3RoIHN0ZGlvIHN0cmVhbXMgYXJlIGFzc29jaWF0ZWQgd2l0aCBhIHR0eS5cbiAqL1xuXG52YXIgaXNhdHR5ID0gdHR5LmlzYXR0eSgxKSAmJiB0dHkuaXNhdHR5KDIpO1xuXG4vKipcbiAqIEV4cG9zZSBgQmFzZWAuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gQmFzZTtcblxuLyoqXG4gKiBFbmFibGUgY29sb3JpbmcgYnkgZGVmYXVsdC5cbiAqL1xuXG5leHBvcnRzLnVzZUNvbG9ycyA9IGlzYXR0eSB8fCAocHJvY2Vzcy5lbnYuTU9DSEFfQ09MT1JTICE9PSB1bmRlZmluZWQpO1xuXG4vKipcbiAqIElubGluZSBkaWZmcyBpbnN0ZWFkIG9mICsvLVxuICovXG5cbmV4cG9ydHMuaW5saW5lRGlmZnMgPSBmYWxzZTtcblxuLyoqXG4gKiBEZWZhdWx0IGNvbG9yIG1hcC5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IHtcbiAgICAncGFzcyc6IDkwXG4gICwgJ2ZhaWwnOiAzMVxuICAsICdicmlnaHQgcGFzcyc6IDkyXG4gICwgJ2JyaWdodCBmYWlsJzogOTFcbiAgLCAnYnJpZ2h0IHllbGxvdyc6IDkzXG4gICwgJ3BlbmRpbmcnOiAzNlxuICAsICdzdWl0ZSc6IDBcbiAgLCAnZXJyb3IgdGl0bGUnOiAwXG4gICwgJ2Vycm9yIG1lc3NhZ2UnOiAzMVxuICAsICdlcnJvciBzdGFjayc6IDkwXG4gICwgJ2NoZWNrbWFyayc6IDMyXG4gICwgJ2Zhc3QnOiA5MFxuICAsICdtZWRpdW0nOiAzM1xuICAsICdzbG93JzogMzFcbiAgLCAnZ3JlZW4nOiAzMlxuICAsICdsaWdodCc6IDkwXG4gICwgJ2RpZmYgZ3V0dGVyJzogOTBcbiAgLCAnZGlmZiBhZGRlZCc6IDQyXG4gICwgJ2RpZmYgcmVtb3ZlZCc6IDQxXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc3ltYm9sIG1hcC5cbiAqL1xuXG5leHBvcnRzLnN5bWJvbHMgPSB7XG4gIG9rOiAn4pyTJyxcbiAgZXJyOiAn4pyWJyxcbiAgZG90OiAn4oCkJ1xufTtcblxuLy8gV2l0aCBub2RlLmpzIG9uIFdpbmRvd3M6IHVzZSBzeW1ib2xzIGF2YWlsYWJsZSBpbiB0ZXJtaW5hbCBkZWZhdWx0IGZvbnRzXG5pZiAoJ3dpbjMyJyA9PSBwcm9jZXNzLnBsYXRmb3JtKSB7XG4gIGV4cG9ydHMuc3ltYm9scy5vayA9ICdcXHUyMjFBJztcbiAgZXhwb3J0cy5zeW1ib2xzLmVyciA9ICdcXHUwMEQ3JztcbiAgZXhwb3J0cy5zeW1ib2xzLmRvdCA9ICcuJztcbn1cblxuLyoqXG4gKiBDb2xvciBgc3RyYCB3aXRoIHRoZSBnaXZlbiBgdHlwZWAsXG4gKiBhbGxvd2luZyBjb2xvcnMgdG8gYmUgZGlzYWJsZWQsXG4gKiBhcyB3ZWxsIGFzIHVzZXItZGVmaW5lZCBjb2xvclxuICogc2NoZW1lcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIGNvbG9yID0gZXhwb3J0cy5jb2xvciA9IGZ1bmN0aW9uKHR5cGUsIHN0cikge1xuICBpZiAoIWV4cG9ydHMudXNlQ29sb3JzKSByZXR1cm4gc3RyO1xuICByZXR1cm4gJ1xcdTAwMWJbJyArIGV4cG9ydHMuY29sb3JzW3R5cGVdICsgJ20nICsgc3RyICsgJ1xcdTAwMWJbMG0nO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgdGVybSB3aW5kb3cgc2l6ZSwgd2l0aCBzb21lXG4gKiBkZWZhdWx0cyBmb3Igd2hlbiBzdGRlcnIgaXMgbm90IGEgdHR5LlxuICovXG5cbmV4cG9ydHMud2luZG93ID0ge1xuICB3aWR0aDogaXNhdHR5XG4gICAgPyBwcm9jZXNzLnN0ZG91dC5nZXRXaW5kb3dTaXplXG4gICAgICA/IHByb2Nlc3Muc3Rkb3V0LmdldFdpbmRvd1NpemUoMSlbMF1cbiAgICAgIDogdHR5LmdldFdpbmRvd1NpemUoKVsxXVxuICAgIDogNzVcbn07XG5cbi8qKlxuICogRXhwb3NlIHNvbWUgYmFzaWMgY3Vyc29yIGludGVyYWN0aW9uc1xuICogdGhhdCBhcmUgY29tbW9uIGFtb25nIHJlcG9ydGVycy5cbiAqL1xuXG5leHBvcnRzLmN1cnNvciA9IHtcbiAgaGlkZTogZnVuY3Rpb24oKXtcbiAgICBpc2F0dHkgJiYgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcdTAwMWJbPzI1bCcpO1xuICB9LFxuXG4gIHNob3c6IGZ1bmN0aW9uKCl7XG4gICAgaXNhdHR5ICYmIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXHUwMDFiWz8yNWgnKTtcbiAgfSxcblxuICBkZWxldGVMaW5lOiBmdW5jdGlvbigpe1xuICAgIGlzYXR0eSAmJiBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFx1MDAxYlsySycpO1xuICB9LFxuXG4gIGJlZ2lubmluZ09mTGluZTogZnVuY3Rpb24oKXtcbiAgICBpc2F0dHkgJiYgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcdTAwMWJbMEcnKTtcbiAgfSxcblxuICBDUjogZnVuY3Rpb24oKXtcbiAgICBpZiAoaXNhdHR5KSB7XG4gICAgICBleHBvcnRzLmN1cnNvci5kZWxldGVMaW5lKCk7XG4gICAgICBleHBvcnRzLmN1cnNvci5iZWdpbm5pbmdPZkxpbmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xccicpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBPdXR1dCB0aGUgZ2l2ZW4gYGZhaWx1cmVzYCBhcyBhIGxpc3QuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZmFpbHVyZXNcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5saXN0ID0gZnVuY3Rpb24oZmFpbHVyZXMpe1xuICBjb25zb2xlLmVycm9yKCk7XG4gIGZhaWx1cmVzLmZvckVhY2goZnVuY3Rpb24odGVzdCwgaSl7XG4gICAgLy8gZm9ybWF0XG4gICAgdmFyIGZtdCA9IGNvbG9yKCdlcnJvciB0aXRsZScsICcgICVzKSAlczpcXG4nKVxuICAgICAgKyBjb2xvcignZXJyb3IgbWVzc2FnZScsICcgICAgICVzJylcbiAgICAgICsgY29sb3IoJ2Vycm9yIHN0YWNrJywgJ1xcbiVzXFxuJyk7XG5cbiAgICAvLyBtc2dcbiAgICB2YXIgZXJyID0gdGVzdC5lcnJcbiAgICAgICwgbWVzc2FnZSA9IGVyci5tZXNzYWdlIHx8ICcnXG4gICAgICAsIHN0YWNrID0gZXJyLnN0YWNrIHx8IG1lc3NhZ2VcbiAgICAgICwgaW5kZXggPSBzdGFjay5pbmRleE9mKG1lc3NhZ2UpICsgbWVzc2FnZS5sZW5ndGhcbiAgICAgICwgbXNnID0gc3RhY2suc2xpY2UoMCwgaW5kZXgpXG4gICAgICAsIGFjdHVhbCA9IGVyci5hY3R1YWxcbiAgICAgICwgZXhwZWN0ZWQgPSBlcnIuZXhwZWN0ZWRcbiAgICAgICwgZXNjYXBlID0gdHJ1ZTtcblxuICAgIC8vIHVuY2F1Z2h0XG4gICAgaWYgKGVyci51bmNhdWdodCkge1xuICAgICAgbXNnID0gJ1VuY2F1Z2h0ICcgKyBtc2c7XG4gICAgfVxuXG4gICAgLy8gZXhwbGljaXRseSBzaG93IGRpZmZcbiAgICBpZiAoZXJyLnNob3dEaWZmICYmIHNhbWVUeXBlKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgIGVyci5hY3R1YWwgPSBhY3R1YWwgPSB1dGlscy5zdHJpbmdpZnkoYWN0dWFsKTtcbiAgICAgIGVyci5leHBlY3RlZCA9IGV4cGVjdGVkID0gdXRpbHMuc3RyaW5naWZ5KGV4cGVjdGVkKTtcbiAgICB9XG5cbiAgICAvLyBhY3R1YWwgLyBleHBlY3RlZCBkaWZmXG4gICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBhY3R1YWwgJiYgJ3N0cmluZycgPT0gdHlwZW9mIGV4cGVjdGVkKSB7XG4gICAgICBmbXQgPSBjb2xvcignZXJyb3IgdGl0bGUnLCAnICAlcykgJXM6XFxuJXMnKSArIGNvbG9yKCdlcnJvciBzdGFjaycsICdcXG4lc1xcbicpO1xuICAgICAgdmFyIG1hdGNoID0gbWVzc2FnZS5tYXRjaCgvXihbXjpdKyk6IGV4cGVjdGVkLyk7XG4gICAgICBtc2cgPSAnXFxuICAgICAgJyArIGNvbG9yKCdlcnJvciBtZXNzYWdlJywgbWF0Y2ggPyBtYXRjaFsxXSA6IG1zZyk7XG5cbiAgICAgIGlmIChleHBvcnRzLmlubGluZURpZmZzKSB7XG4gICAgICAgIG1zZyArPSBpbmxpbmVEaWZmKGVyciwgZXNjYXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1zZyArPSB1bmlmaWVkRGlmZihlcnIsIGVzY2FwZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaW5kZW50IHN0YWNrIHRyYWNlIHdpdGhvdXQgbXNnXG4gICAgc3RhY2sgPSBzdGFjay5zbGljZShpbmRleCA/IGluZGV4ICsgMSA6IGluZGV4KVxuICAgICAgLnJlcGxhY2UoL14vZ20sICcgICcpO1xuXG4gICAgY29uc29sZS5lcnJvcihmbXQsIChpICsgMSksIHRlc3QuZnVsbFRpdGxlKCksIG1zZywgc3RhY2spO1xuICB9KTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgQmFzZWAgcmVwb3J0ZXIuXG4gKlxuICogQWxsIG90aGVyIHJlcG9ydGVycyBnZW5lcmFsbHlcbiAqIGluaGVyaXQgZnJvbSB0aGlzIHJlcG9ydGVyLCBwcm92aWRpbmdcbiAqIHN0YXRzIHN1Y2ggYXMgdGVzdCBkdXJhdGlvbiwgbnVtYmVyXG4gKiBvZiB0ZXN0cyBwYXNzZWQgLyBmYWlsZWQgZXRjLlxuICpcbiAqIEBwYXJhbSB7UnVubmVyfSBydW5uZXJcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gQmFzZShydW5uZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCBzdGF0cyA9IHRoaXMuc3RhdHMgPSB7IHN1aXRlczogMCwgdGVzdHM6IDAsIHBhc3NlczogMCwgcGVuZGluZzogMCwgZmFpbHVyZXM6IDAgfVxuICAgICwgZmFpbHVyZXMgPSB0aGlzLmZhaWx1cmVzID0gW107XG5cbiAgaWYgKCFydW5uZXIpIHJldHVybjtcbiAgdGhpcy5ydW5uZXIgPSBydW5uZXI7XG5cbiAgcnVubmVyLnN0YXRzID0gc3RhdHM7XG5cbiAgcnVubmVyLm9uKCdzdGFydCcsIGZ1bmN0aW9uKCl7XG4gICAgc3RhdHMuc3RhcnQgPSBuZXcgRGF0ZTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdzdWl0ZScsIGZ1bmN0aW9uKHN1aXRlKXtcbiAgICBzdGF0cy5zdWl0ZXMgPSBzdGF0cy5zdWl0ZXMgfHwgMDtcbiAgICBzdWl0ZS5yb290IHx8IHN0YXRzLnN1aXRlcysrO1xuICB9KTtcblxuICBydW5uZXIub24oJ3Rlc3QgZW5kJywgZnVuY3Rpb24odGVzdCl7XG4gICAgc3RhdHMudGVzdHMgPSBzdGF0cy50ZXN0cyB8fCAwO1xuICAgIHN0YXRzLnRlc3RzKys7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbigncGFzcycsIGZ1bmN0aW9uKHRlc3Qpe1xuICAgIHN0YXRzLnBhc3NlcyA9IHN0YXRzLnBhc3NlcyB8fCAwO1xuXG4gICAgdmFyIG1lZGl1bSA9IHRlc3Quc2xvdygpIC8gMjtcbiAgICB0ZXN0LnNwZWVkID0gdGVzdC5kdXJhdGlvbiA+IHRlc3Quc2xvdygpXG4gICAgICA/ICdzbG93J1xuICAgICAgOiB0ZXN0LmR1cmF0aW9uID4gbWVkaXVtXG4gICAgICAgID8gJ21lZGl1bSdcbiAgICAgICAgOiAnZmFzdCc7XG5cbiAgICBzdGF0cy5wYXNzZXMrKztcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdmYWlsJywgZnVuY3Rpb24odGVzdCwgZXJyKXtcbiAgICBzdGF0cy5mYWlsdXJlcyA9IHN0YXRzLmZhaWx1cmVzIHx8IDA7XG4gICAgc3RhdHMuZmFpbHVyZXMrKztcbiAgICB0ZXN0LmVyciA9IGVycjtcbiAgICBmYWlsdXJlcy5wdXNoKHRlc3QpO1xuICB9KTtcblxuICBydW5uZXIub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgc3RhdHMuZW5kID0gbmV3IERhdGU7XG4gICAgc3RhdHMuZHVyYXRpb24gPSBuZXcgRGF0ZSAtIHN0YXRzLnN0YXJ0O1xuICB9KTtcblxuICBydW5uZXIub24oJ3BlbmRpbmcnLCBmdW5jdGlvbigpe1xuICAgIHN0YXRzLnBlbmRpbmcrKztcbiAgfSk7XG59XG5cbi8qKlxuICogT3V0cHV0IGNvbW1vbiBlcGlsb2d1ZSB1c2VkIGJ5IG1hbnkgb2ZcbiAqIHRoZSBidW5kbGVkIHJlcG9ydGVycy5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkJhc2UucHJvdG90eXBlLmVwaWxvZ3VlID0gZnVuY3Rpb24oKXtcbiAgdmFyIHN0YXRzID0gdGhpcy5zdGF0cztcbiAgdmFyIHRlc3RzO1xuICB2YXIgZm10O1xuXG4gIGNvbnNvbGUubG9nKCk7XG5cbiAgLy8gcGFzc2VzXG4gIGZtdCA9IGNvbG9yKCdicmlnaHQgcGFzcycsICcgJylcbiAgICArIGNvbG9yKCdncmVlbicsICcgJWQgcGFzc2luZycpXG4gICAgKyBjb2xvcignbGlnaHQnLCAnICglcyknKTtcblxuICBjb25zb2xlLmxvZyhmbXQsXG4gICAgc3RhdHMucGFzc2VzIHx8IDAsXG4gICAgbXMoc3RhdHMuZHVyYXRpb24pKTtcblxuICAvLyBwZW5kaW5nXG4gIGlmIChzdGF0cy5wZW5kaW5nKSB7XG4gICAgZm10ID0gY29sb3IoJ3BlbmRpbmcnLCAnICcpXG4gICAgICArIGNvbG9yKCdwZW5kaW5nJywgJyAlZCBwZW5kaW5nJyk7XG5cbiAgICBjb25zb2xlLmxvZyhmbXQsIHN0YXRzLnBlbmRpbmcpO1xuICB9XG5cbiAgLy8gZmFpbHVyZXNcbiAgaWYgKHN0YXRzLmZhaWx1cmVzKSB7XG4gICAgZm10ID0gY29sb3IoJ2ZhaWwnLCAnICAlZCBmYWlsaW5nJyk7XG5cbiAgICBjb25zb2xlLmVycm9yKGZtdCxcbiAgICAgIHN0YXRzLmZhaWx1cmVzKTtcblxuICAgIEJhc2UubGlzdCh0aGlzLmZhaWx1cmVzKTtcbiAgICBjb25zb2xlLmVycm9yKCk7XG4gIH1cblxuICBjb25zb2xlLmxvZygpO1xufTtcblxuLyoqXG4gKiBQYWQgdGhlIGdpdmVuIGBzdHJgIHRvIGBsZW5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBsZW5cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhZChzdHIsIGxlbikge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgcmV0dXJuIEFycmF5KGxlbiAtIHN0ci5sZW5ndGggKyAxKS5qb2luKCcgJykgKyBzdHI7XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGlubGluZSBkaWZmIGJldHdlZW4gMiBzdHJpbmdzIHdpdGggY29sb3VyZWQgQU5TSSBvdXRwdXRcbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBFcnJvciB3aXRoIGFjdHVhbC9leHBlY3RlZFxuICogQHJldHVybiB7U3RyaW5nfSBEaWZmXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpbmxpbmVEaWZmKGVyciwgZXNjYXBlKSB7XG4gIHZhciBtc2cgPSBlcnJvckRpZmYoZXJyLCAnV29yZHNXaXRoU3BhY2UnLCBlc2NhcGUpO1xuXG4gIC8vIGxpbmVub3NcbiAgdmFyIGxpbmVzID0gbXNnLnNwbGl0KCdcXG4nKTtcbiAgaWYgKGxpbmVzLmxlbmd0aCA+IDQpIHtcbiAgICB2YXIgd2lkdGggPSBTdHJpbmcobGluZXMubGVuZ3RoKS5sZW5ndGg7XG4gICAgbXNnID0gbGluZXMubWFwKGZ1bmN0aW9uKHN0ciwgaSl7XG4gICAgICByZXR1cm4gcGFkKCsraSwgd2lkdGgpICsgJyB8JyArICcgJyArIHN0cjtcbiAgICB9KS5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIC8vIGxlZ2VuZFxuICBtc2cgPSAnXFxuJ1xuICAgICsgY29sb3IoJ2RpZmYgcmVtb3ZlZCcsICdhY3R1YWwnKVxuICAgICsgJyAnXG4gICAgKyBjb2xvcignZGlmZiBhZGRlZCcsICdleHBlY3RlZCcpXG4gICAgKyAnXFxuXFxuJ1xuICAgICsgbXNnXG4gICAgKyAnXFxuJztcblxuICAvLyBpbmRlbnRcbiAgbXNnID0gbXNnLnJlcGxhY2UoL14vZ20sICcgICAgICAnKTtcbiAgcmV0dXJuIG1zZztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgdW5pZmllZCBkaWZmIGJldHdlZW4gMiBzdHJpbmdzXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gRXJyb3Igd2l0aCBhY3R1YWwvZXhwZWN0ZWRcbiAqIEByZXR1cm4ge1N0cmluZ30gRGlmZlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdW5pZmllZERpZmYoZXJyLCBlc2NhcGUpIHtcbiAgdmFyIGluZGVudCA9ICcgICAgICAnO1xuICBmdW5jdGlvbiBjbGVhblVwKGxpbmUpIHtcbiAgICBpZiAoZXNjYXBlKSB7XG4gICAgICBsaW5lID0gZXNjYXBlSW52aXNpYmxlcyhsaW5lKTtcbiAgICB9XG4gICAgaWYgKGxpbmVbMF0gPT09ICcrJykgcmV0dXJuIGluZGVudCArIGNvbG9yTGluZXMoJ2RpZmYgYWRkZWQnLCBsaW5lKTtcbiAgICBpZiAobGluZVswXSA9PT0gJy0nKSByZXR1cm4gaW5kZW50ICsgY29sb3JMaW5lcygnZGlmZiByZW1vdmVkJywgbGluZSk7XG4gICAgaWYgKGxpbmUubWF0Y2goL1xcQFxcQC8pKSByZXR1cm4gbnVsbDtcbiAgICBpZiAobGluZS5tYXRjaCgvXFxcXCBObyBuZXdsaW5lLykpIHJldHVybiBudWxsO1xuICAgIGVsc2UgcmV0dXJuIGluZGVudCArIGxpbmU7XG4gIH1cbiAgZnVuY3Rpb24gbm90QmxhbmsobGluZSkge1xuICAgIHJldHVybiBsaW5lICE9IG51bGw7XG4gIH1cbiAgbXNnID0gZGlmZi5jcmVhdGVQYXRjaCgnc3RyaW5nJywgZXJyLmFjdHVhbCwgZXJyLmV4cGVjdGVkKTtcbiAgdmFyIGxpbmVzID0gbXNnLnNwbGl0KCdcXG4nKS5zcGxpY2UoNCk7XG4gIHJldHVybiAnXFxuICAgICAgJ1xuICAgICAgICAgKyBjb2xvckxpbmVzKCdkaWZmIGFkZGVkJywgICAnKyBleHBlY3RlZCcpICsgJyAnXG4gICAgICAgICArIGNvbG9yTGluZXMoJ2RpZmYgcmVtb3ZlZCcsICctIGFjdHVhbCcpXG4gICAgICAgICArICdcXG5cXG4nXG4gICAgICAgICArIGxpbmVzLm1hcChjbGVhblVwKS5maWx0ZXIobm90QmxhbmspLmpvaW4oJ1xcbicpO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGNoYXJhY3RlciBkaWZmIGZvciBgZXJyYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGVycm9yRGlmZihlcnIsIHR5cGUsIGVzY2FwZSkge1xuICB2YXIgYWN0dWFsICAgPSBlc2NhcGUgPyBlc2NhcGVJbnZpc2libGVzKGVyci5hY3R1YWwpICAgOiBlcnIuYWN0dWFsO1xuICB2YXIgZXhwZWN0ZWQgPSBlc2NhcGUgPyBlc2NhcGVJbnZpc2libGVzKGVyci5leHBlY3RlZCkgOiBlcnIuZXhwZWN0ZWQ7XG4gIHJldHVybiBkaWZmWydkaWZmJyArIHR5cGVdKGFjdHVhbCwgZXhwZWN0ZWQpLm1hcChmdW5jdGlvbihzdHIpe1xuICAgIGlmIChzdHIuYWRkZWQpIHJldHVybiBjb2xvckxpbmVzKCdkaWZmIGFkZGVkJywgc3RyLnZhbHVlKTtcbiAgICBpZiAoc3RyLnJlbW92ZWQpIHJldHVybiBjb2xvckxpbmVzKCdkaWZmIHJlbW92ZWQnLCBzdHIudmFsdWUpO1xuICAgIHJldHVybiBzdHIudmFsdWU7XG4gIH0pLmpvaW4oJycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgd2l0aCBhbGwgaW52aXNpYmxlIGNoYXJhY3RlcnMgaW4gcGxhaW4gdGV4dFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZXNjYXBlSW52aXNpYmxlcyhsaW5lKSB7XG4gICAgcmV0dXJuIGxpbmUucmVwbGFjZSgvXFx0L2csICc8dGFiPicpXG4gICAgICAgICAgICAgICAucmVwbGFjZSgvXFxyL2csICc8Q1I+JylcbiAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJzxMRj5cXG4nKTtcbn1cblxuLyoqXG4gKiBDb2xvciBsaW5lcyBmb3IgYHN0cmAsIHVzaW5nIHRoZSBjb2xvciBgbmFtZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGNvbG9yTGluZXMobmFtZSwgc3RyKSB7XG4gIHJldHVybiBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihzdHIpe1xuICAgIHJldHVybiBjb2xvcihuYW1lLCBzdHIpO1xuICB9KS5qb2luKCdcXG4nKTtcbn1cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgLyBiIGhhdmUgdGhlIHNhbWUgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzYW1lVHlwZShhLCBiKSB7XG4gIGEgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSk7XG4gIGIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYik7XG4gIHJldHVybiBhID09IGI7XG59XG5cbn0pOyAvLyBtb2R1bGU6IHJlcG9ydGVycy9iYXNlLmpzXG5cbnJlcXVpcmUucmVnaXN0ZXIoXCJyZXBvcnRlcnMvZG9jLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpXG4gICwgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIEV4cG9zZSBgRG9jYC5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBEb2M7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRG9jYCByZXBvcnRlci5cbiAqXG4gKiBAcGFyYW0ge1J1bm5lcn0gcnVubmVyXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIERvYyhydW5uZXIpIHtcbiAgQmFzZS5jYWxsKHRoaXMsIHJ1bm5lcik7XG5cbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCBzdGF0cyA9IHRoaXMuc3RhdHNcbiAgICAsIHRvdGFsID0gcnVubmVyLnRvdGFsXG4gICAgLCBpbmRlbnRzID0gMjtcblxuICBmdW5jdGlvbiBpbmRlbnQoKSB7XG4gICAgcmV0dXJuIEFycmF5KGluZGVudHMpLmpvaW4oJyAgJyk7XG4gIH1cblxuICBydW5uZXIub24oJ3N1aXRlJywgZnVuY3Rpb24oc3VpdGUpe1xuICAgIGlmIChzdWl0ZS5yb290KSByZXR1cm47XG4gICAgKytpbmRlbnRzO1xuICAgIGNvbnNvbGUubG9nKCclczxzZWN0aW9uIGNsYXNzPVwic3VpdGVcIj4nLCBpbmRlbnQoKSk7XG4gICAgKytpbmRlbnRzO1xuICAgIGNvbnNvbGUubG9nKCclczxoMT4lczwvaDE+JywgaW5kZW50KCksIHV0aWxzLmVzY2FwZShzdWl0ZS50aXRsZSkpO1xuICAgIGNvbnNvbGUubG9nKCclczxkbD4nLCBpbmRlbnQoKSk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbignc3VpdGUgZW5kJywgZnVuY3Rpb24oc3VpdGUpe1xuICAgIGlmIChzdWl0ZS5yb290KSByZXR1cm47XG4gICAgY29uc29sZS5sb2coJyVzPC9kbD4nLCBpbmRlbnQoKSk7XG4gICAgLS1pbmRlbnRzO1xuICAgIGNvbnNvbGUubG9nKCclczwvc2VjdGlvbj4nLCBpbmRlbnQoKSk7XG4gICAgLS1pbmRlbnRzO1xuICB9KTtcblxuICBydW5uZXIub24oJ3Bhc3MnLCBmdW5jdGlvbih0ZXN0KXtcbiAgICBjb25zb2xlLmxvZygnJXMgIDxkdD4lczwvZHQ+JywgaW5kZW50KCksIHV0aWxzLmVzY2FwZSh0ZXN0LnRpdGxlKSk7XG4gICAgdmFyIGNvZGUgPSB1dGlscy5lc2NhcGUodXRpbHMuY2xlYW4odGVzdC5mbi50b1N0cmluZygpKSk7XG4gICAgY29uc29sZS5sb2coJyVzICA8ZGQ+PHByZT48Y29kZT4lczwvY29kZT48L3ByZT48L2RkPicsIGluZGVudCgpLCBjb2RlKTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdmYWlsJywgZnVuY3Rpb24odGVzdCwgZXJyKXtcbiAgICBjb25zb2xlLmxvZygnJXMgIDxkdCBjbGFzcz1cImVycm9yXCI+JXM8L2R0PicsIGluZGVudCgpLCB1dGlscy5lc2NhcGUodGVzdC50aXRsZSkpO1xuICAgIHZhciBjb2RlID0gdXRpbHMuZXNjYXBlKHV0aWxzLmNsZWFuKHRlc3QuZm4udG9TdHJpbmcoKSkpO1xuICAgIGNvbnNvbGUubG9nKCclcyAgPGRkIGNsYXNzPVwiZXJyb3JcIj48cHJlPjxjb2RlPiVzPC9jb2RlPjwvcHJlPjwvZGQ+JywgaW5kZW50KCksIGNvZGUpO1xuICAgIGNvbnNvbGUubG9nKCclcyAgPGRkIGNsYXNzPVwiZXJyb3JcIj4lczwvZGQ+JywgaW5kZW50KCksIHV0aWxzLmVzY2FwZShlcnIpKTtcbiAgfSk7XG59XG5cbn0pOyAvLyBtb2R1bGU6IHJlcG9ydGVycy9kb2MuanNcblxucmVxdWlyZS5yZWdpc3RlcihcInJlcG9ydGVycy9kb3QuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJylcbiAgLCBjb2xvciA9IEJhc2UuY29sb3I7XG5cbi8qKlxuICogRXhwb3NlIGBEb3RgLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IERvdDtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBEb3RgIG1hdHJpeCB0ZXN0IHJlcG9ydGVyLlxuICpcbiAqIEBwYXJhbSB7UnVubmVyfSBydW5uZXJcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRG90KHJ1bm5lcikge1xuICBCYXNlLmNhbGwodGhpcywgcnVubmVyKTtcblxuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIHN0YXRzID0gdGhpcy5zdGF0c1xuICAgICwgd2lkdGggPSBCYXNlLndpbmRvdy53aWR0aCAqIC43NSB8IDBcbiAgICAsIG4gPSAtMTtcblxuICBydW5uZXIub24oJ3N0YXJ0JywgZnVuY3Rpb24oKXtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuICAnKTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdwZW5kaW5nJywgZnVuY3Rpb24odGVzdCl7XG4gICAgaWYgKCsrbiAlIHdpZHRoID09IDApIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4gICcpO1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGNvbG9yKCdwZW5kaW5nJywgQmFzZS5zeW1ib2xzLmRvdCkpO1xuICB9KTtcblxuICBydW5uZXIub24oJ3Bhc3MnLCBmdW5jdGlvbih0ZXN0KXtcbiAgICBpZiAoKytuICUgd2lkdGggPT0gMCkgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbiAgJyk7XG4gICAgaWYgKCdzbG93JyA9PSB0ZXN0LnNwZWVkKSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShjb2xvcignYnJpZ2h0IHllbGxvdycsIEJhc2Uuc3ltYm9scy5kb3QpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY29sb3IodGVzdC5zcGVlZCwgQmFzZS5zeW1ib2xzLmRvdCkpO1xuICAgIH1cbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdmYWlsJywgZnVuY3Rpb24odGVzdCwgZXJyKXtcbiAgICBpZiAoKytuICUgd2lkdGggPT0gMCkgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbiAgJyk7XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY29sb3IoJ2ZhaWwnLCBCYXNlLnN5bWJvbHMuZG90KSk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygpO1xuICAgIHNlbGYuZXBpbG9ndWUoKTtcbiAgfSk7XG59XG5cbi8qKlxuICogSW5oZXJpdCBmcm9tIGBCYXNlLnByb3RvdHlwZWAuXG4gKi9cblxuZnVuY3Rpb24gRigpe307XG5GLnByb3RvdHlwZSA9IEJhc2UucHJvdG90eXBlO1xuRG90LnByb3RvdHlwZSA9IG5ldyBGO1xuRG90LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERvdDtcblxuXG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMvZG90LmpzXG5cbnJlcXVpcmUucmVnaXN0ZXIoXCJyZXBvcnRlcnMvaHRtbC1jb3YuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBKU09OQ292ID0gcmVxdWlyZSgnLi9qc29uLWNvdicpXG4gICwgZnMgPSByZXF1aXJlKCdicm93c2VyL2ZzJyk7XG5cbi8qKlxuICogRXhwb3NlIGBIVE1MQ292YC5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBIVE1MQ292O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEpzQ292ZXJhZ2VgIHJlcG9ydGVyLlxuICpcbiAqIEBwYXJhbSB7UnVubmVyfSBydW5uZXJcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gSFRNTENvdihydW5uZXIpIHtcbiAgdmFyIGphZGUgPSByZXF1aXJlKCdqYWRlJylcbiAgICAsIGZpbGUgPSBfX2Rpcm5hbWUgKyAnL3RlbXBsYXRlcy9jb3ZlcmFnZS5qYWRlJ1xuICAgICwgc3RyID0gZnMucmVhZEZpbGVTeW5jKGZpbGUsICd1dGY4JylcbiAgICAsIGZuID0gamFkZS5jb21waWxlKHN0ciwgeyBmaWxlbmFtZTogZmlsZSB9KVxuICAgICwgc2VsZiA9IHRoaXM7XG5cbiAgSlNPTkNvdi5jYWxsKHRoaXMsIHJ1bm5lciwgZmFsc2UpO1xuXG4gIHJ1bm5lci5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShmbih7XG4gICAgICAgIGNvdjogc2VsZi5jb3ZcbiAgICAgICwgY292ZXJhZ2VDbGFzczogY292ZXJhZ2VDbGFzc1xuICAgIH0pKTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJuIGNvdmVyYWdlIGNsYXNzIGZvciBgbmAuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY292ZXJhZ2VDbGFzcyhuKSB7XG4gIGlmIChuID49IDc1KSByZXR1cm4gJ2hpZ2gnO1xuICBpZiAobiA+PSA1MCkgcmV0dXJuICdtZWRpdW0nO1xuICBpZiAobiA+PSAyNSkgcmV0dXJuICdsb3cnO1xuICByZXR1cm4gJ3RlcnJpYmxlJztcbn1cbn0pOyAvLyBtb2R1bGU6IHJlcG9ydGVycy9odG1sLWNvdi5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwicmVwb3J0ZXJzL2h0bWwuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJylcbiAgLCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcbiAgLCBQcm9ncmVzcyA9IHJlcXVpcmUoJy4uL2Jyb3dzZXIvcHJvZ3Jlc3MnKVxuICAsIGVzY2FwZSA9IHV0aWxzLmVzY2FwZTtcblxuLyoqXG4gKiBTYXZlIHRpbWVyIHJlZmVyZW5jZXMgdG8gYXZvaWQgU2lub24gaW50ZXJmZXJpbmcgKHNlZSBHSC0yMzcpLlxuICovXG5cbnZhciBEYXRlID0gZ2xvYmFsLkRhdGVcbiAgLCBzZXRUaW1lb3V0ID0gZ2xvYmFsLnNldFRpbWVvdXRcbiAgLCBzZXRJbnRlcnZhbCA9IGdsb2JhbC5zZXRJbnRlcnZhbFxuICAsIGNsZWFyVGltZW91dCA9IGdsb2JhbC5jbGVhclRpbWVvdXRcbiAgLCBjbGVhckludGVydmFsID0gZ2xvYmFsLmNsZWFySW50ZXJ2YWw7XG5cbi8qKlxuICogRXhwb3NlIGBIVE1MYC5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBIVE1MO1xuXG4vKipcbiAqIFN0YXRzIHRlbXBsYXRlLlxuICovXG5cbnZhciBzdGF0c1RlbXBsYXRlID0gJzx1bCBpZD1cIm1vY2hhLXN0YXRzXCI+J1xuICArICc8bGkgY2xhc3M9XCJwcm9ncmVzc1wiPjxjYW52YXMgd2lkdGg9XCI0MFwiIGhlaWdodD1cIjQwXCI+PC9jYW52YXM+PC9saT4nXG4gICsgJzxsaSBjbGFzcz1cInBhc3Nlc1wiPjxhIGhyZWY9XCIjXCI+cGFzc2VzOjwvYT4gPGVtPjA8L2VtPjwvbGk+J1xuICArICc8bGkgY2xhc3M9XCJmYWlsdXJlc1wiPjxhIGhyZWY9XCIjXCI+ZmFpbHVyZXM6PC9hPiA8ZW0+MDwvZW0+PC9saT4nXG4gICsgJzxsaSBjbGFzcz1cImR1cmF0aW9uXCI+ZHVyYXRpb246IDxlbT4wPC9lbT5zPC9saT4nXG4gICsgJzwvdWw+JztcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBIVE1MYCByZXBvcnRlci5cbiAqXG4gKiBAcGFyYW0ge1J1bm5lcn0gcnVubmVyXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEhUTUwocnVubmVyKSB7XG4gIEJhc2UuY2FsbCh0aGlzLCBydW5uZXIpO1xuXG4gIHZhciBzZWxmID0gdGhpc1xuICAgICwgc3RhdHMgPSB0aGlzLnN0YXRzXG4gICAgLCB0b3RhbCA9IHJ1bm5lci50b3RhbFxuICAgICwgc3RhdCA9IGZyYWdtZW50KHN0YXRzVGVtcGxhdGUpXG4gICAgLCBpdGVtcyA9IHN0YXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJylcbiAgICAsIHBhc3NlcyA9IGl0ZW1zWzFdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdlbScpWzBdXG4gICAgLCBwYXNzZXNMaW5rID0gaXRlbXNbMV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2EnKVswXVxuICAgICwgZmFpbHVyZXMgPSBpdGVtc1syXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZW0nKVswXVxuICAgICwgZmFpbHVyZXNMaW5rID0gaXRlbXNbMl0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2EnKVswXVxuICAgICwgZHVyYXRpb24gPSBpdGVtc1szXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZW0nKVswXVxuICAgICwgY2FudmFzID0gc3RhdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJylbMF1cbiAgICAsIHJlcG9ydCA9IGZyYWdtZW50KCc8dWwgaWQ9XCJtb2NoYS1yZXBvcnRcIj48L3VsPicpXG4gICAgLCBzdGFjayA9IFtyZXBvcnRdXG4gICAgLCBwcm9ncmVzc1xuICAgICwgY3R4XG4gICAgLCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vY2hhJyk7XG5cbiAgaWYgKGNhbnZhcy5nZXRDb250ZXh0KSB7XG4gICAgdmFyIHJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICBjYW52YXMuc3R5bGUud2lkdGggPSBjYW52YXMud2lkdGg7XG4gICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG4gICAgY2FudmFzLndpZHRoICo9IHJhdGlvO1xuICAgIGNhbnZhcy5oZWlnaHQgKj0gcmF0aW87XG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY3R4LnNjYWxlKHJhdGlvLCByYXRpbyk7XG4gICAgcHJvZ3Jlc3MgPSBuZXcgUHJvZ3Jlc3M7XG4gIH1cblxuICBpZiAoIXJvb3QpIHJldHVybiBlcnJvcignI21vY2hhIGRpdiBtaXNzaW5nLCBhZGQgaXQgdG8geW91ciBkb2N1bWVudCcpO1xuXG4gIC8vIHBhc3MgdG9nZ2xlXG4gIG9uKHBhc3Nlc0xpbmssICdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgdW5oaWRlKCk7XG4gICAgdmFyIG5hbWUgPSAvcGFzcy8udGVzdChyZXBvcnQuY2xhc3NOYW1lKSA/ICcnIDogJyBwYXNzJztcbiAgICByZXBvcnQuY2xhc3NOYW1lID0gcmVwb3J0LmNsYXNzTmFtZS5yZXBsYWNlKC9mYWlsfHBhc3MvZywgJycpICsgbmFtZTtcbiAgICBpZiAocmVwb3J0LmNsYXNzTmFtZS50cmltKCkpIGhpZGVTdWl0ZXNXaXRob3V0KCd0ZXN0IHBhc3MnKTtcbiAgfSk7XG5cbiAgLy8gZmFpbHVyZSB0b2dnbGVcbiAgb24oZmFpbHVyZXNMaW5rLCAnY2xpY2snLCBmdW5jdGlvbigpe1xuICAgIHVuaGlkZSgpO1xuICAgIHZhciBuYW1lID0gL2ZhaWwvLnRlc3QocmVwb3J0LmNsYXNzTmFtZSkgPyAnJyA6ICcgZmFpbCc7XG4gICAgcmVwb3J0LmNsYXNzTmFtZSA9IHJlcG9ydC5jbGFzc05hbWUucmVwbGFjZSgvZmFpbHxwYXNzL2csICcnKSArIG5hbWU7XG4gICAgaWYgKHJlcG9ydC5jbGFzc05hbWUudHJpbSgpKSBoaWRlU3VpdGVzV2l0aG91dCgndGVzdCBmYWlsJyk7XG4gIH0pO1xuXG4gIHJvb3QuYXBwZW5kQ2hpbGQoc3RhdCk7XG4gIHJvb3QuYXBwZW5kQ2hpbGQocmVwb3J0KTtcblxuICBpZiAocHJvZ3Jlc3MpIHByb2dyZXNzLnNpemUoNDApO1xuXG4gIHJ1bm5lci5vbignc3VpdGUnLCBmdW5jdGlvbihzdWl0ZSl7XG4gICAgaWYgKHN1aXRlLnJvb3QpIHJldHVybjtcblxuICAgIC8vIHN1aXRlXG4gICAgdmFyIHVybCA9IHNlbGYuc3VpdGVVUkwoc3VpdGUpO1xuICAgIHZhciBlbCA9IGZyYWdtZW50KCc8bGkgY2xhc3M9XCJzdWl0ZVwiPjxoMT48YSBocmVmPVwiJXNcIj4lczwvYT48L2gxPjwvbGk+JywgdXJsLCBlc2NhcGUoc3VpdGUudGl0bGUpKTtcblxuICAgIC8vIGNvbnRhaW5lclxuICAgIHN0YWNrWzBdLmFwcGVuZENoaWxkKGVsKTtcbiAgICBzdGFjay51bnNoaWZ0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJykpO1xuICAgIGVsLmFwcGVuZENoaWxkKHN0YWNrWzBdKTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdzdWl0ZSBlbmQnLCBmdW5jdGlvbihzdWl0ZSl7XG4gICAgaWYgKHN1aXRlLnJvb3QpIHJldHVybjtcbiAgICBzdGFjay5zaGlmdCgpO1xuICB9KTtcblxuICBydW5uZXIub24oJ2ZhaWwnLCBmdW5jdGlvbih0ZXN0LCBlcnIpe1xuICAgIGlmICgnaG9vaycgPT0gdGVzdC50eXBlKSBydW5uZXIuZW1pdCgndGVzdCBlbmQnLCB0ZXN0KTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCd0ZXN0IGVuZCcsIGZ1bmN0aW9uKHRlc3Qpe1xuICAgIC8vIFRPRE86IGFkZCB0byBzdGF0c1xuICAgIHZhciBwZXJjZW50ID0gc3RhdHMudGVzdHMgLyB0aGlzLnRvdGFsICogMTAwIHwgMDtcbiAgICBpZiAocHJvZ3Jlc3MpIHByb2dyZXNzLnVwZGF0ZShwZXJjZW50KS5kcmF3KGN0eCk7XG5cbiAgICAvLyB1cGRhdGUgc3RhdHNcbiAgICB2YXIgbXMgPSBuZXcgRGF0ZSAtIHN0YXRzLnN0YXJ0O1xuICAgIHRleHQocGFzc2VzLCBzdGF0cy5wYXNzZXMpO1xuICAgIHRleHQoZmFpbHVyZXMsIHN0YXRzLmZhaWx1cmVzKTtcbiAgICB0ZXh0KGR1cmF0aW9uLCAobXMgLyAxMDAwKS50b0ZpeGVkKDIpKTtcblxuICAgIC8vIHRlc3RcbiAgICBpZiAoJ3Bhc3NlZCcgPT0gdGVzdC5zdGF0ZSkge1xuICAgICAgdmFyIHVybCA9IHNlbGYudGVzdFVSTCh0ZXN0KTtcbiAgICAgIHZhciBlbCA9IGZyYWdtZW50KCc8bGkgY2xhc3M9XCJ0ZXN0IHBhc3MgJWVcIj48aDI+JWU8c3BhbiBjbGFzcz1cImR1cmF0aW9uXCI+JWVtczwvc3Bhbj4gPGEgaHJlZj1cIiVzXCIgY2xhc3M9XCJyZXBsYXlcIj7igKM8L2E+PC9oMj48L2xpPicsIHRlc3Quc3BlZWQsIHRlc3QudGl0bGUsIHRlc3QuZHVyYXRpb24sIHVybCk7XG4gICAgfSBlbHNlIGlmICh0ZXN0LnBlbmRpbmcpIHtcbiAgICAgIHZhciBlbCA9IGZyYWdtZW50KCc8bGkgY2xhc3M9XCJ0ZXN0IHBhc3MgcGVuZGluZ1wiPjxoMj4lZTwvaDI+PC9saT4nLCB0ZXN0LnRpdGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGVsID0gZnJhZ21lbnQoJzxsaSBjbGFzcz1cInRlc3QgZmFpbFwiPjxoMj4lZSA8YSBocmVmPVwiP2dyZXA9JWVcIiBjbGFzcz1cInJlcGxheVwiPuKAozwvYT48L2gyPjwvbGk+JywgdGVzdC50aXRsZSwgZW5jb2RlVVJJQ29tcG9uZW50KHRlc3QuZnVsbFRpdGxlKCkpKTtcbiAgICAgIHZhciBzdHIgPSB0ZXN0LmVyci5zdGFjayB8fCB0ZXN0LmVyci50b1N0cmluZygpO1xuXG4gICAgICAvLyBGRiAvIE9wZXJhIGRvIG5vdCBhZGQgdGhlIG1lc3NhZ2VcbiAgICAgIGlmICghfnN0ci5pbmRleE9mKHRlc3QuZXJyLm1lc3NhZ2UpKSB7XG4gICAgICAgIHN0ciA9IHRlc3QuZXJyLm1lc3NhZ2UgKyAnXFxuJyArIHN0cjtcbiAgICAgIH1cblxuICAgICAgLy8gPD1JRTcgc3RyaW5naWZpZXMgdG8gW09iamVjdCBFcnJvcl0uIFNpbmNlIGl0IGNhbiBiZSBvdmVybG9hZGVkLCB3ZVxuICAgICAgLy8gY2hlY2sgZm9yIHRoZSByZXN1bHQgb2YgdGhlIHN0cmluZ2lmeWluZy5cbiAgICAgIGlmICgnW29iamVjdCBFcnJvcl0nID09IHN0cikgc3RyID0gdGVzdC5lcnIubWVzc2FnZTtcblxuICAgICAgLy8gU2FmYXJpIGRvZXNuJ3QgZ2l2ZSB5b3UgYSBzdGFjay4gTGV0J3MgYXQgbGVhc3QgcHJvdmlkZSBhIHNvdXJjZSBsaW5lLlxuICAgICAgaWYgKCF0ZXN0LmVyci5zdGFjayAmJiB0ZXN0LmVyci5zb3VyY2VVUkwgJiYgdGVzdC5lcnIubGluZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN0ciArPSBcIlxcbihcIiArIHRlc3QuZXJyLnNvdXJjZVVSTCArIFwiOlwiICsgdGVzdC5lcnIubGluZSArIFwiKVwiO1xuICAgICAgfVxuXG4gICAgICBlbC5hcHBlbmRDaGlsZChmcmFnbWVudCgnPHByZSBjbGFzcz1cImVycm9yXCI+JWU8L3ByZT4nLCBzdHIpKTtcbiAgICB9XG5cbiAgICAvLyB0b2dnbGUgY29kZVxuICAgIC8vIFRPRE86IGRlZmVyXG4gICAgaWYgKCF0ZXN0LnBlbmRpbmcpIHtcbiAgICAgIHZhciBoMiA9IGVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoMicpWzBdO1xuXG4gICAgICBvbihoMiwgJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcHJlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScgPT0gcHJlLnN0eWxlLmRpc3BsYXlcbiAgICAgICAgICA/ICdibG9jaydcbiAgICAgICAgICA6ICdub25lJztcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgcHJlID0gZnJhZ21lbnQoJzxwcmU+PGNvZGU+JWU8L2NvZGU+PC9wcmU+JywgdXRpbHMuY2xlYW4odGVzdC5mbi50b1N0cmluZygpKSk7XG4gICAgICBlbC5hcHBlbmRDaGlsZChwcmUpO1xuICAgICAgcHJlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuXG4gICAgLy8gRG9uJ3QgY2FsbCAuYXBwZW5kQ2hpbGQgaWYgI21vY2hhLXJlcG9ydCB3YXMgYWxyZWFkeSAuc2hpZnQoKSdlZCBvZmYgdGhlIHN0YWNrLlxuICAgIGlmIChzdGFja1swXSkgc3RhY2tbMF0uYXBwZW5kQ2hpbGQoZWwpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBQcm92aWRlIHN1aXRlIFVSTFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3VpdGVdXG4gKi9cblxuSFRNTC5wcm90b3R5cGUuc3VpdGVVUkwgPSBmdW5jdGlvbihzdWl0ZSl7XG4gIHJldHVybiAnP2dyZXA9JyArIGVuY29kZVVSSUNvbXBvbmVudChzdWl0ZS5mdWxsVGl0bGUoKSk7XG59O1xuXG4vKipcbiAqIFByb3ZpZGUgdGVzdCBVUkxcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW3Rlc3RdXG4gKi9cblxuSFRNTC5wcm90b3R5cGUudGVzdFVSTCA9IGZ1bmN0aW9uKHRlc3Qpe1xuICByZXR1cm4gJz9ncmVwPScgKyBlbmNvZGVVUklDb21wb25lbnQodGVzdC5mdWxsVGl0bGUoKSk7XG59O1xuXG4vKipcbiAqIERpc3BsYXkgZXJyb3IgYG1zZ2AuXG4gKi9cblxuZnVuY3Rpb24gZXJyb3IobXNnKSB7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZnJhZ21lbnQoJzxkaXYgaWQ9XCJtb2NoYS1lcnJvclwiPiVzPC9kaXY+JywgbXNnKSk7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgRE9NIGZyYWdtZW50IGZyb20gYGh0bWxgLlxuICovXG5cbmZ1bmN0aW9uIGZyYWdtZW50KGh0bWwpIHtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHNcbiAgICAsIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgLCBpID0gMTtcblxuICBkaXYuaW5uZXJIVE1MID0gaHRtbC5yZXBsYWNlKC8lKFtzZV0pL2csIGZ1bmN0aW9uKF8sIHR5cGUpe1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAncyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJ2UnOiByZXR1cm4gZXNjYXBlKGFyZ3NbaSsrXSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZGl2LmZpcnN0Q2hpbGQ7XG59XG5cbi8qKlxuICogQ2hlY2sgZm9yIHN1aXRlcyB0aGF0IGRvIG5vdCBoYXZlIGVsZW1lbnRzXG4gKiB3aXRoIGBjbGFzc25hbWVgLCBhbmQgaGlkZSB0aGVtLlxuICovXG5cbmZ1bmN0aW9uIGhpZGVTdWl0ZXNXaXRob3V0KGNsYXNzbmFtZSkge1xuICB2YXIgc3VpdGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc3VpdGUnKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWl0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZWxzID0gc3VpdGVzW2ldLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NuYW1lKTtcbiAgICBpZiAoMCA9PSBlbHMubGVuZ3RoKSBzdWl0ZXNbaV0uY2xhc3NOYW1lICs9ICcgaGlkZGVuJztcbiAgfVxufVxuXG4vKipcbiAqIFVuaGlkZSAuaGlkZGVuIHN1aXRlcy5cbiAqL1xuXG5mdW5jdGlvbiB1bmhpZGUoKSB7XG4gIHZhciBlbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzdWl0ZSBoaWRkZW4nKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbHMubGVuZ3RoOyArK2kpIHtcbiAgICBlbHNbaV0uY2xhc3NOYW1lID0gZWxzW2ldLmNsYXNzTmFtZS5yZXBsYWNlKCdzdWl0ZSBoaWRkZW4nLCAnc3VpdGUnKTtcbiAgfVxufVxuXG4vKipcbiAqIFNldCBgZWxgIHRleHQgdG8gYHN0cmAuXG4gKi9cblxuZnVuY3Rpb24gdGV4dChlbCwgc3RyKSB7XG4gIGlmIChlbC50ZXh0Q29udGVudCkge1xuICAgIGVsLnRleHRDb250ZW50ID0gc3RyO1xuICB9IGVsc2Uge1xuICAgIGVsLmlubmVyVGV4dCA9IHN0cjtcbiAgfVxufVxuXG4vKipcbiAqIExpc3RlbiBvbiBgZXZlbnRgIHdpdGggY2FsbGJhY2sgYGZuYC5cbiAqL1xuXG5mdW5jdGlvbiBvbihlbCwgZXZlbnQsIGZuKSB7XG4gIGlmIChlbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZm4sIGZhbHNlKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5hdHRhY2hFdmVudCgnb24nICsgZXZlbnQsIGZuKTtcbiAgfVxufVxuXG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMvaHRtbC5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwicmVwb3J0ZXJzL2luZGV4LmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG5cbmV4cG9ydHMuQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xuZXhwb3J0cy5Eb3QgPSByZXF1aXJlKCcuL2RvdCcpO1xuZXhwb3J0cy5Eb2MgPSByZXF1aXJlKCcuL2RvYycpO1xuZXhwb3J0cy5UQVAgPSByZXF1aXJlKCcuL3RhcCcpO1xuZXhwb3J0cy5KU09OID0gcmVxdWlyZSgnLi9qc29uJyk7XG5leHBvcnRzLkhUTUwgPSByZXF1aXJlKCcuL2h0bWwnKTtcbmV4cG9ydHMuTGlzdCA9IHJlcXVpcmUoJy4vbGlzdCcpO1xuZXhwb3J0cy5NaW4gPSByZXF1aXJlKCcuL21pbicpO1xuZXhwb3J0cy5TcGVjID0gcmVxdWlyZSgnLi9zcGVjJyk7XG5leHBvcnRzLk55YW4gPSByZXF1aXJlKCcuL255YW4nKTtcbmV4cG9ydHMuWFVuaXQgPSByZXF1aXJlKCcuL3h1bml0Jyk7XG5leHBvcnRzLk1hcmtkb3duID0gcmVxdWlyZSgnLi9tYXJrZG93bicpO1xuZXhwb3J0cy5Qcm9ncmVzcyA9IHJlcXVpcmUoJy4vcHJvZ3Jlc3MnKTtcbmV4cG9ydHMuTGFuZGluZyA9IHJlcXVpcmUoJy4vbGFuZGluZycpO1xuZXhwb3J0cy5KU09OQ292ID0gcmVxdWlyZSgnLi9qc29uLWNvdicpO1xuZXhwb3J0cy5IVE1MQ292ID0gcmVxdWlyZSgnLi9odG1sLWNvdicpO1xuZXhwb3J0cy5KU09OU3RyZWFtID0gcmVxdWlyZSgnLi9qc29uLXN0cmVhbScpO1xuXG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMvaW5kZXguanNcblxucmVxdWlyZS5yZWdpc3RlcihcInJlcG9ydGVycy9qc29uLWNvdi5qc1wiLCBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUpe1xuXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKTtcblxuLyoqXG4gKiBFeHBvc2UgYEpTT05Db3ZgLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IEpTT05Db3Y7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgSnNDb3ZlcmFnZWAgcmVwb3J0ZXIuXG4gKlxuICogQHBhcmFtIHtSdW5uZXJ9IHJ1bm5lclxuICogQHBhcmFtIHtCb29sZWFufSBvdXRwdXRcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gSlNPTkNvdihydW5uZXIsIG91dHB1dCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIG91dHB1dCA9IDEgPT0gYXJndW1lbnRzLmxlbmd0aCA/IHRydWUgOiBvdXRwdXQ7XG5cbiAgQmFzZS5jYWxsKHRoaXMsIHJ1bm5lcik7XG5cbiAgdmFyIHRlc3RzID0gW11cbiAgICAsIGZhaWx1cmVzID0gW11cbiAgICAsIHBhc3NlcyA9IFtdO1xuXG4gIHJ1bm5lci5vbigndGVzdCBlbmQnLCBmdW5jdGlvbih0ZXN0KXtcbiAgICB0ZXN0cy5wdXNoKHRlc3QpO1xuICB9KTtcblxuICBydW5uZXIub24oJ3Bhc3MnLCBmdW5jdGlvbih0ZXN0KXtcbiAgICBwYXNzZXMucHVzaCh0ZXN0KTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdmYWlsJywgZnVuY3Rpb24odGVzdCl7XG4gICAgZmFpbHVyZXMucHVzaCh0ZXN0KTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuICAgIHZhciBjb3YgPSBnbG9iYWwuXyRqc2NvdmVyYWdlIHx8IHt9O1xuICAgIHZhciByZXN1bHQgPSBzZWxmLmNvdiA9IG1hcChjb3YpO1xuICAgIHJlc3VsdC5zdGF0cyA9IHNlbGYuc3RhdHM7XG4gICAgcmVzdWx0LnRlc3RzID0gdGVzdHMubWFwKGNsZWFuKTtcbiAgICByZXN1bHQuZmFpbHVyZXMgPSBmYWlsdXJlcy5tYXAoY2xlYW4pO1xuICAgIHJlc3VsdC5wYXNzZXMgPSBwYXNzZXMubWFwKGNsZWFuKTtcbiAgICBpZiAoIW91dHB1dCkgcmV0dXJuO1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKEpTT04uc3RyaW5naWZ5KHJlc3VsdCwgbnVsbCwgMiApKTtcbiAgfSk7XG59XG5cbi8qKlxuICogTWFwIGpzY292ZXJhZ2UgZGF0YSB0byBhIEpTT04gc3RydWN0dXJlXG4gKiBzdWl0YWJsZSBmb3IgcmVwb3J0aW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb3ZcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1hcChjb3YpIHtcbiAgdmFyIHJldCA9IHtcbiAgICAgIGluc3RydW1lbnRhdGlvbjogJ25vZGUtanNjb3ZlcmFnZSdcbiAgICAsIHNsb2M6IDBcbiAgICAsIGhpdHM6IDBcbiAgICAsIG1pc3NlczogMFxuICAgICwgY292ZXJhZ2U6IDBcbiAgICAsIGZpbGVzOiBbXVxuICB9O1xuXG4gIGZvciAodmFyIGZpbGVuYW1lIGluIGNvdikge1xuICAgIHZhciBkYXRhID0gY292ZXJhZ2UoZmlsZW5hbWUsIGNvdltmaWxlbmFtZV0pO1xuICAgIHJldC5maWxlcy5wdXNoKGRhdGEpO1xuICAgIHJldC5oaXRzICs9IGRhdGEuaGl0cztcbiAgICByZXQubWlzc2VzICs9IGRhdGEubWlzc2VzO1xuICAgIHJldC5zbG9jICs9IGRhdGEuc2xvYztcbiAgfVxuXG4gIHJldC5maWxlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS5maWxlbmFtZS5sb2NhbGVDb21wYXJlKGIuZmlsZW5hbWUpO1xuICB9KTtcblxuICBpZiAocmV0LnNsb2MgPiAwKSB7XG4gICAgcmV0LmNvdmVyYWdlID0gKHJldC5oaXRzIC8gcmV0LnNsb2MpICogMTAwO1xuICB9XG5cbiAgcmV0dXJuIHJldDtcbn07XG5cbi8qKlxuICogTWFwIGpzY292ZXJhZ2UgZGF0YSBmb3IgYSBzaW5nbGUgc291cmNlIGZpbGVcbiAqIHRvIGEgSlNPTiBzdHJ1Y3R1cmUgc3VpdGFibGUgZm9yIHJlcG9ydGluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWUgbmFtZSBvZiB0aGUgc291cmNlIGZpbGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIGpzY292ZXJhZ2UgY292ZXJhZ2UgZGF0YVxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY292ZXJhZ2UoZmlsZW5hbWUsIGRhdGEpIHtcbiAgdmFyIHJldCA9IHtcbiAgICBmaWxlbmFtZTogZmlsZW5hbWUsXG4gICAgY292ZXJhZ2U6IDAsXG4gICAgaGl0czogMCxcbiAgICBtaXNzZXM6IDAsXG4gICAgc2xvYzogMCxcbiAgICBzb3VyY2U6IHt9XG4gIH07XG5cbiAgZGF0YS5zb3VyY2UuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBudW0pe1xuICAgIG51bSsrO1xuXG4gICAgaWYgKGRhdGFbbnVtXSA9PT0gMCkge1xuICAgICAgcmV0Lm1pc3NlcysrO1xuICAgICAgcmV0LnNsb2MrKztcbiAgICB9IGVsc2UgaWYgKGRhdGFbbnVtXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXQuaGl0cysrO1xuICAgICAgcmV0LnNsb2MrKztcbiAgICB9XG5cbiAgICByZXQuc291cmNlW251bV0gPSB7XG4gICAgICAgIHNvdXJjZTogbGluZVxuICAgICAgLCBjb3ZlcmFnZTogZGF0YVtudW1dID09PSB1bmRlZmluZWRcbiAgICAgICAgPyAnJ1xuICAgICAgICA6IGRhdGFbbnVtXVxuICAgIH07XG4gIH0pO1xuXG4gIHJldC5jb3ZlcmFnZSA9IHJldC5oaXRzIC8gcmV0LnNsb2MgKiAxMDA7XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBwbGFpbi1vYmplY3QgcmVwcmVzZW50YXRpb24gb2YgYHRlc3RgXG4gKiBmcmVlIG9mIGN5Y2xpYyBwcm9wZXJ0aWVzIGV0Yy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdGVzdFxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY2xlYW4odGVzdCkge1xuICByZXR1cm4ge1xuICAgICAgdGl0bGU6IHRlc3QudGl0bGVcbiAgICAsIGZ1bGxUaXRsZTogdGVzdC5mdWxsVGl0bGUoKVxuICAgICwgZHVyYXRpb246IHRlc3QuZHVyYXRpb25cbiAgfVxufVxuXG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMvanNvbi1jb3YuanNcblxucmVxdWlyZS5yZWdpc3RlcihcInJlcG9ydGVycy9qc29uLXN0cmVhbS5qc1wiLCBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUpe1xuXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKVxuICAsIGNvbG9yID0gQmFzZS5jb2xvcjtcblxuLyoqXG4gKiBFeHBvc2UgYExpc3RgLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IExpc3Q7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgTGlzdGAgdGVzdCByZXBvcnRlci5cbiAqXG4gKiBAcGFyYW0ge1J1bm5lcn0gcnVubmVyXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIExpc3QocnVubmVyKSB7XG4gIEJhc2UuY2FsbCh0aGlzLCBydW5uZXIpO1xuXG4gIHZhciBzZWxmID0gdGhpc1xuICAgICwgc3RhdHMgPSB0aGlzLnN0YXRzXG4gICAgLCB0b3RhbCA9IHJ1bm5lci50b3RhbDtcblxuICBydW5uZXIub24oJ3N0YXJ0JywgZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShbJ3N0YXJ0JywgeyB0b3RhbDogdG90YWwgfV0pKTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdwYXNzJywgZnVuY3Rpb24odGVzdCl7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoWydwYXNzJywgY2xlYW4odGVzdCldKSk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbignZmFpbCcsIGZ1bmN0aW9uKHRlc3QsIGVycil7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoWydmYWlsJywgY2xlYW4odGVzdCldKSk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShKU09OLnN0cmluZ2lmeShbJ2VuZCcsIHNlbGYuc3RhdHNdKSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJldHVybiBhIHBsYWluLW9iamVjdCByZXByZXNlbnRhdGlvbiBvZiBgdGVzdGBcbiAqIGZyZWUgb2YgY3ljbGljIHByb3BlcnRpZXMgZXRjLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0ZXN0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjbGVhbih0ZXN0KSB7XG4gIHJldHVybiB7XG4gICAgICB0aXRsZTogdGVzdC50aXRsZVxuICAgICwgZnVsbFRpdGxlOiB0ZXN0LmZ1bGxUaXRsZSgpXG4gICAgLCBkdXJhdGlvbjogdGVzdC5kdXJhdGlvblxuICB9XG59XG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMvanNvbi1zdHJlYW0uanNcblxucmVxdWlyZS5yZWdpc3RlcihcInJlcG9ydGVycy9qc29uLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpXG4gICwgY3Vyc29yID0gQmFzZS5jdXJzb3JcbiAgLCBjb2xvciA9IEJhc2UuY29sb3I7XG5cbi8qKlxuICogRXhwb3NlIGBKU09OYC5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBKU09OUmVwb3J0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgSlNPTmAgcmVwb3J0ZXIuXG4gKlxuICogQHBhcmFtIHtSdW5uZXJ9IHJ1bm5lclxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBKU09OUmVwb3J0ZXIocnVubmVyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgQmFzZS5jYWxsKHRoaXMsIHJ1bm5lcik7XG5cbiAgdmFyIHRlc3RzID0gW11cbiAgICAsIGZhaWx1cmVzID0gW11cbiAgICAsIHBhc3NlcyA9IFtdO1xuXG4gIHJ1bm5lci5vbigndGVzdCBlbmQnLCBmdW5jdGlvbih0ZXN0KXtcbiAgICB0ZXN0cy5wdXNoKHRlc3QpO1xuICB9KTtcblxuICBydW5uZXIub24oJ3Bhc3MnLCBmdW5jdGlvbih0ZXN0KXtcbiAgICBwYXNzZXMucHVzaCh0ZXN0KTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdmYWlsJywgZnVuY3Rpb24odGVzdCwgZXJyKXtcbiAgICBmYWlsdXJlcy5wdXNoKHRlc3QpO1xuICAgIGlmIChlcnIgPT09IE9iamVjdChlcnIpKSB7XG4gICAgICB0ZXN0LmVyck1zZyA9IGVyci5tZXNzYWdlO1xuICAgICAgdGVzdC5lcnJTdGFjayA9IGVyci5zdGFjaztcbiAgICB9XG4gIH0pO1xuXG4gIHJ1bm5lci5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgc3RhdHM6IHNlbGYuc3RhdHMsXG4gICAgICB0ZXN0czogdGVzdHMubWFwKGNsZWFuKSxcbiAgICAgIGZhaWx1cmVzOiBmYWlsdXJlcy5tYXAoY2xlYW4pLFxuICAgICAgcGFzc2VzOiBwYXNzZXMubWFwKGNsZWFuKVxuICAgIH07XG4gICAgcnVubmVyLnRlc3RSZXN1bHRzID0gb2JqO1xuXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCAyKSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJldHVybiBhIHBsYWluLW9iamVjdCByZXByZXNlbnRhdGlvbiBvZiBgdGVzdGBcbiAqIGZyZWUgb2YgY3ljbGljIHByb3BlcnRpZXMgZXRjLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0ZXN0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjbGVhbih0ZXN0KSB7XG4gIHJldHVybiB7XG4gICAgdGl0bGU6IHRlc3QudGl0bGUsXG4gICAgZnVsbFRpdGxlOiB0ZXN0LmZ1bGxUaXRsZSgpLFxuICAgIGR1cmF0aW9uOiB0ZXN0LmR1cmF0aW9uLFxuICAgIGVycjogdGVzdC5lcnIsXG4gICAgZXJyU3RhY2s6IHRlc3QuZXJyLnN0YWNrLFxuICAgIGVyck1lc3NhZ2U6IHRlc3QuZXJyLm1lc3NhZ2VcbiAgfVxufVxuXG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMvanNvbi5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwicmVwb3J0ZXJzL2xhbmRpbmcuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJylcbiAgLCBjdXJzb3IgPSBCYXNlLmN1cnNvclxuICAsIGNvbG9yID0gQmFzZS5jb2xvcjtcblxuLyoqXG4gKiBFeHBvc2UgYExhbmRpbmdgLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IExhbmRpbmc7XG5cbi8qKlxuICogQWlycGxhbmUgY29sb3IuXG4gKi9cblxuQmFzZS5jb2xvcnMucGxhbmUgPSAwO1xuXG4vKipcbiAqIEFpcnBsYW5lIGNyYXNoIGNvbG9yLlxuICovXG5cbkJhc2UuY29sb3JzWydwbGFuZSBjcmFzaCddID0gMzE7XG5cbi8qKlxuICogUnVud2F5IGNvbG9yLlxuICovXG5cbkJhc2UuY29sb3JzLnJ1bndheSA9IDkwO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYExhbmRpbmdgIHJlcG9ydGVyLlxuICpcbiAqIEBwYXJhbSB7UnVubmVyfSBydW5uZXJcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gTGFuZGluZyhydW5uZXIpIHtcbiAgQmFzZS5jYWxsKHRoaXMsIHJ1bm5lcik7XG5cbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCBzdGF0cyA9IHRoaXMuc3RhdHNcbiAgICAsIHdpZHRoID0gQmFzZS53aW5kb3cud2lkdGggKiAuNzUgfCAwXG4gICAgLCB0b3RhbCA9IHJ1bm5lci50b3RhbFxuICAgICwgc3RyZWFtID0gcHJvY2Vzcy5zdGRvdXRcbiAgICAsIHBsYW5lID0gY29sb3IoJ3BsYW5lJywgJ+KciCcpXG4gICAgLCBjcmFzaGVkID0gLTFcbiAgICAsIG4gPSAwO1xuXG4gIGZ1bmN0aW9uIHJ1bndheSgpIHtcbiAgICB2YXIgYnVmID0gQXJyYXkod2lkdGgpLmpvaW4oJy0nKTtcbiAgICByZXR1cm4gJyAgJyArIGNvbG9yKCdydW53YXknLCBidWYpO1xuICB9XG5cbiAgcnVubmVyLm9uKCdzdGFydCcsIGZ1bmN0aW9uKCl7XG4gICAgc3RyZWFtLndyaXRlKCdcXG4gICcpO1xuICAgIGN1cnNvci5oaWRlKCk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbigndGVzdCBlbmQnLCBmdW5jdGlvbih0ZXN0KXtcbiAgICAvLyBjaGVjayBpZiB0aGUgcGxhbmUgY3Jhc2hlZFxuICAgIHZhciBjb2wgPSAtMSA9PSBjcmFzaGVkXG4gICAgICA/IHdpZHRoICogKytuIC8gdG90YWwgfCAwXG4gICAgICA6IGNyYXNoZWQ7XG5cbiAgICAvLyBzaG93IHRoZSBjcmFzaFxuICAgIGlmICgnZmFpbGVkJyA9PSB0ZXN0LnN0YXRlKSB7XG4gICAgICBwbGFuZSA9IGNvbG9yKCdwbGFuZSBjcmFzaCcsICfinIgnKTtcbiAgICAgIGNyYXNoZWQgPSBjb2w7XG4gICAgfVxuXG4gICAgLy8gcmVuZGVyIGxhbmRpbmcgc3RyaXBcbiAgICBzdHJlYW0ud3JpdGUoJ1xcdTAwMWJbNEZcXG5cXG4nKTtcbiAgICBzdHJlYW0ud3JpdGUocnVud2F5KCkpO1xuICAgIHN0cmVhbS53cml0ZSgnXFxuICAnKTtcbiAgICBzdHJlYW0ud3JpdGUoY29sb3IoJ3J1bndheScsIEFycmF5KGNvbCkuam9pbign4ouFJykpKTtcbiAgICBzdHJlYW0ud3JpdGUocGxhbmUpXG4gICAgc3RyZWFtLndyaXRlKGNvbG9yKCdydW53YXknLCBBcnJheSh3aWR0aCAtIGNvbCkuam9pbign4ouFJykgKyAnXFxuJykpO1xuICAgIHN0cmVhbS53cml0ZShydW53YXkoKSk7XG4gICAgc3RyZWFtLndyaXRlKCdcXHUwMDFiWzBtJyk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICBjdXJzb3Iuc2hvdygpO1xuICAgIGNvbnNvbGUubG9nKCk7XG4gICAgc2VsZi5lcGlsb2d1ZSgpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBJbmhlcml0IGZyb20gYEJhc2UucHJvdG90eXBlYC5cbiAqL1xuXG5mdW5jdGlvbiBGKCl7fTtcbkYucHJvdG90eXBlID0gQmFzZS5wcm90b3R5cGU7XG5MYW5kaW5nLnByb3RvdHlwZSA9IG5ldyBGO1xuTGFuZGluZy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMYW5kaW5nO1xuXG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMvbGFuZGluZy5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwicmVwb3J0ZXJzL2xpc3QuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJylcbiAgLCBjdXJzb3IgPSBCYXNlLmN1cnNvclxuICAsIGNvbG9yID0gQmFzZS5jb2xvcjtcblxuLyoqXG4gKiBFeHBvc2UgYExpc3RgLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IExpc3Q7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgTGlzdGAgdGVzdCByZXBvcnRlci5cbiAqXG4gKiBAcGFyYW0ge1J1bm5lcn0gcnVubmVyXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIExpc3QocnVubmVyKSB7XG4gIEJhc2UuY2FsbCh0aGlzLCBydW5uZXIpO1xuXG4gIHZhciBzZWxmID0gdGhpc1xuICAgICwgc3RhdHMgPSB0aGlzLnN0YXRzXG4gICAgLCBuID0gMDtcblxuICBydW5uZXIub24oJ3N0YXJ0JywgZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygpO1xuICB9KTtcblxuICBydW5uZXIub24oJ3Rlc3QnLCBmdW5jdGlvbih0ZXN0KXtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShjb2xvcigncGFzcycsICcgICAgJyArIHRlc3QuZnVsbFRpdGxlKCkgKyAnOiAnKSk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbigncGVuZGluZycsIGZ1bmN0aW9uKHRlc3Qpe1xuICAgIHZhciBmbXQgPSBjb2xvcignY2hlY2ttYXJrJywgJyAgLScpXG4gICAgICArIGNvbG9yKCdwZW5kaW5nJywgJyAlcycpO1xuICAgIGNvbnNvbGUubG9nKGZtdCwgdGVzdC5mdWxsVGl0bGUoKSk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbigncGFzcycsIGZ1bmN0aW9uKHRlc3Qpe1xuICAgIHZhciBmbXQgPSBjb2xvcignY2hlY2ttYXJrJywgJyAgJytCYXNlLnN5bWJvbHMuZG90KVxuICAgICAgKyBjb2xvcigncGFzcycsICcgJXM6ICcpXG4gICAgICArIGNvbG9yKHRlc3Quc3BlZWQsICclZG1zJyk7XG4gICAgY3Vyc29yLkNSKCk7XG4gICAgY29uc29sZS5sb2coZm10LCB0ZXN0LmZ1bGxUaXRsZSgpLCB0ZXN0LmR1cmF0aW9uKTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdmYWlsJywgZnVuY3Rpb24odGVzdCwgZXJyKXtcbiAgICBjdXJzb3IuQ1IoKTtcbiAgICBjb25zb2xlLmxvZyhjb2xvcignZmFpbCcsICcgICVkKSAlcycpLCArK24sIHRlc3QuZnVsbFRpdGxlKCkpO1xuICB9KTtcblxuICBydW5uZXIub24oJ2VuZCcsIHNlbGYuZXBpbG9ndWUuYmluZChzZWxmKSk7XG59XG5cbi8qKlxuICogSW5oZXJpdCBmcm9tIGBCYXNlLnByb3RvdHlwZWAuXG4gKi9cblxuZnVuY3Rpb24gRigpe307XG5GLnByb3RvdHlwZSA9IEJhc2UucHJvdG90eXBlO1xuTGlzdC5wcm90b3R5cGUgPSBuZXcgRjtcbkxpc3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGlzdDtcblxuXG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMvbGlzdC5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwicmVwb3J0ZXJzL21hcmtkb3duLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKVxuICAsIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBFeHBvc2UgYE1hcmtkb3duYC5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBNYXJrZG93bjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBNYXJrZG93bmAgcmVwb3J0ZXIuXG4gKlxuICogQHBhcmFtIHtSdW5uZXJ9IHJ1bm5lclxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBNYXJrZG93bihydW5uZXIpIHtcbiAgQmFzZS5jYWxsKHRoaXMsIHJ1bm5lcik7XG5cbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCBzdGF0cyA9IHRoaXMuc3RhdHNcbiAgICAsIGxldmVsID0gMFxuICAgICwgYnVmID0gJyc7XG5cbiAgZnVuY3Rpb24gdGl0bGUoc3RyKSB7XG4gICAgcmV0dXJuIEFycmF5KGxldmVsKS5qb2luKCcjJykgKyAnICcgKyBzdHI7XG4gIH1cblxuICBmdW5jdGlvbiBpbmRlbnQoKSB7XG4gICAgcmV0dXJuIEFycmF5KGxldmVsKS5qb2luKCcgICcpO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFwVE9DKHN1aXRlLCBvYmopIHtcbiAgICB2YXIgcmV0ID0gb2JqO1xuICAgIG9iaiA9IG9ialtzdWl0ZS50aXRsZV0gPSBvYmpbc3VpdGUudGl0bGVdIHx8IHsgc3VpdGU6IHN1aXRlIH07XG4gICAgc3VpdGUuc3VpdGVzLmZvckVhY2goZnVuY3Rpb24oc3VpdGUpe1xuICAgICAgbWFwVE9DKHN1aXRlLCBvYmopO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBzdHJpbmdpZnlUT0Mob2JqLCBsZXZlbCkge1xuICAgICsrbGV2ZWw7XG4gICAgdmFyIGJ1ZiA9ICcnO1xuICAgIHZhciBsaW5rO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmICgnc3VpdGUnID09IGtleSkgY29udGludWU7XG4gICAgICBpZiAoa2V5KSBsaW5rID0gJyAtIFsnICsga2V5ICsgJ10oIycgKyB1dGlscy5zbHVnKG9ialtrZXldLnN1aXRlLmZ1bGxUaXRsZSgpKSArICcpXFxuJztcbiAgICAgIGlmIChrZXkpIGJ1ZiArPSBBcnJheShsZXZlbCkuam9pbignICAnKSArIGxpbms7XG4gICAgICBidWYgKz0gc3RyaW5naWZ5VE9DKG9ialtrZXldLCBsZXZlbCk7XG4gICAgfVxuICAgIC0tbGV2ZWw7XG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlVE9DKHN1aXRlKSB7XG4gICAgdmFyIG9iaiA9IG1hcFRPQyhzdWl0ZSwge30pO1xuICAgIHJldHVybiBzdHJpbmdpZnlUT0Mob2JqLCAwKTtcbiAgfVxuXG4gIGdlbmVyYXRlVE9DKHJ1bm5lci5zdWl0ZSk7XG5cbiAgcnVubmVyLm9uKCdzdWl0ZScsIGZ1bmN0aW9uKHN1aXRlKXtcbiAgICArK2xldmVsO1xuICAgIHZhciBzbHVnID0gdXRpbHMuc2x1ZyhzdWl0ZS5mdWxsVGl0bGUoKSk7XG4gICAgYnVmICs9ICc8YSBuYW1lPVwiJyArIHNsdWcgKyAnXCI+PC9hPicgKyAnXFxuJztcbiAgICBidWYgKz0gdGl0bGUoc3VpdGUudGl0bGUpICsgJ1xcbic7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbignc3VpdGUgZW5kJywgZnVuY3Rpb24oc3VpdGUpe1xuICAgIC0tbGV2ZWw7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbigncGFzcycsIGZ1bmN0aW9uKHRlc3Qpe1xuICAgIHZhciBjb2RlID0gdXRpbHMuY2xlYW4odGVzdC5mbi50b1N0cmluZygpKTtcbiAgICBidWYgKz0gdGVzdC50aXRsZSArICcuXFxuJztcbiAgICBidWYgKz0gJ1xcbmBgYGpzXFxuJztcbiAgICBidWYgKz0gY29kZSArICdcXG4nO1xuICAgIGJ1ZiArPSAnYGBgXFxuXFxuJztcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCcjIFRPQ1xcbicpO1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGdlbmVyYXRlVE9DKHJ1bm5lci5zdWl0ZSkpO1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGJ1Zik7XG4gIH0pO1xufVxufSk7IC8vIG1vZHVsZTogcmVwb3J0ZXJzL21hcmtkb3duLmpzXG5cbnJlcXVpcmUucmVnaXN0ZXIoXCJyZXBvcnRlcnMvbWluLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xuXG4vKipcbiAqIEV4cG9zZSBgTWluYC5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBNaW47XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgTWluYCBtaW5pbWFsIHRlc3QgcmVwb3J0ZXIgKGJlc3QgdXNlZCB3aXRoIC0td2F0Y2gpLlxuICpcbiAqIEBwYXJhbSB7UnVubmVyfSBydW5uZXJcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gTWluKHJ1bm5lcikge1xuICBCYXNlLmNhbGwodGhpcywgcnVubmVyKTtcblxuICBydW5uZXIub24oJ3N0YXJ0JywgZnVuY3Rpb24oKXtcbiAgICAvLyBjbGVhciBzY3JlZW5cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFx1MDAxYlsySicpO1xuICAgIC8vIHNldCBjdXJzb3IgcG9zaXRpb25cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFx1MDAxYlsxOzNIJyk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbignZW5kJywgdGhpcy5lcGlsb2d1ZS5iaW5kKHRoaXMpKTtcbn1cblxuLyoqXG4gKiBJbmhlcml0IGZyb20gYEJhc2UucHJvdG90eXBlYC5cbiAqL1xuXG5mdW5jdGlvbiBGKCl7fTtcbkYucHJvdG90eXBlID0gQmFzZS5wcm90b3R5cGU7XG5NaW4ucHJvdG90eXBlID0gbmV3IEY7XG5NaW4ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTWluO1xuXG5cbn0pOyAvLyBtb2R1bGU6IHJlcG9ydGVycy9taW4uanNcblxucmVxdWlyZS5yZWdpc3RlcihcInJlcG9ydGVycy9ueWFuLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKVxuICAsIGNvbG9yID0gQmFzZS5jb2xvcjtcblxuLyoqXG4gKiBFeHBvc2UgYERvdGAuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gTnlhbkNhdDtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBEb3RgIG1hdHJpeCB0ZXN0IHJlcG9ydGVyLlxuICpcbiAqIEBwYXJhbSB7UnVubmVyfSBydW5uZXJcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gTnlhbkNhdChydW5uZXIpIHtcbiAgQmFzZS5jYWxsKHRoaXMsIHJ1bm5lcik7XG4gIHZhciBzZWxmID0gdGhpc1xuICAgICwgc3RhdHMgPSB0aGlzLnN0YXRzXG4gICAgLCB3aWR0aCA9IEJhc2Uud2luZG93LndpZHRoICogLjc1IHwgMFxuICAgICwgcmFpbmJvd0NvbG9ycyA9IHRoaXMucmFpbmJvd0NvbG9ycyA9IHNlbGYuZ2VuZXJhdGVDb2xvcnMoKVxuICAgICwgY29sb3JJbmRleCA9IHRoaXMuY29sb3JJbmRleCA9IDBcbiAgICAsIG51bWVyT2ZMaW5lcyA9IHRoaXMubnVtYmVyT2ZMaW5lcyA9IDRcbiAgICAsIHRyYWplY3RvcmllcyA9IHRoaXMudHJhamVjdG9yaWVzID0gW1tdLCBbXSwgW10sIFtdXVxuICAgICwgbnlhbkNhdFdpZHRoID0gdGhpcy5ueWFuQ2F0V2lkdGggPSAxMVxuICAgICwgdHJhamVjdG9yeVdpZHRoTWF4ID0gdGhpcy50cmFqZWN0b3J5V2lkdGhNYXggPSAod2lkdGggLSBueWFuQ2F0V2lkdGgpXG4gICAgLCBzY29yZWJvYXJkV2lkdGggPSB0aGlzLnNjb3JlYm9hcmRXaWR0aCA9IDVcbiAgICAsIHRpY2sgPSB0aGlzLnRpY2sgPSAwXG4gICAgLCBuID0gMDtcblxuICBydW5uZXIub24oJ3N0YXJ0JywgZnVuY3Rpb24oKXtcbiAgICBCYXNlLmN1cnNvci5oaWRlKCk7XG4gICAgc2VsZi5kcmF3KCk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbigncGVuZGluZycsIGZ1bmN0aW9uKHRlc3Qpe1xuICAgIHNlbGYuZHJhdygpO1xuICB9KTtcblxuICBydW5uZXIub24oJ3Bhc3MnLCBmdW5jdGlvbih0ZXN0KXtcbiAgICBzZWxmLmRyYXcoKTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdmYWlsJywgZnVuY3Rpb24odGVzdCwgZXJyKXtcbiAgICBzZWxmLmRyYXcoKTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuICAgIEJhc2UuY3Vyc29yLnNob3coKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYubnVtYmVyT2ZMaW5lczsgaSsrKSB3cml0ZSgnXFxuJyk7XG4gICAgc2VsZi5lcGlsb2d1ZSgpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBEcmF3IHRoZSBueWFuIGNhdFxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbk55YW5DYXQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpe1xuICB0aGlzLmFwcGVuZFJhaW5ib3coKTtcbiAgdGhpcy5kcmF3U2NvcmVib2FyZCgpO1xuICB0aGlzLmRyYXdSYWluYm93KCk7XG4gIHRoaXMuZHJhd055YW5DYXQoKTtcbiAgdGhpcy50aWNrID0gIXRoaXMudGljaztcbn07XG5cbi8qKlxuICogRHJhdyB0aGUgXCJzY29yZWJvYXJkXCIgc2hvd2luZyB0aGUgbnVtYmVyXG4gKiBvZiBwYXNzZXMsIGZhaWx1cmVzIGFuZCBwZW5kaW5nIHRlc3RzLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbk55YW5DYXQucHJvdG90eXBlLmRyYXdTY29yZWJvYXJkID0gZnVuY3Rpb24oKXtcbiAgdmFyIHN0YXRzID0gdGhpcy5zdGF0cztcbiAgdmFyIGNvbG9ycyA9IEJhc2UuY29sb3JzO1xuXG4gIGZ1bmN0aW9uIGRyYXcoY29sb3IsIG4pIHtcbiAgICB3cml0ZSgnICcpO1xuICAgIHdyaXRlKCdcXHUwMDFiWycgKyBjb2xvciArICdtJyArIG4gKyAnXFx1MDAxYlswbScpO1xuICAgIHdyaXRlKCdcXG4nKTtcbiAgfVxuXG4gIGRyYXcoY29sb3JzLmdyZWVuLCBzdGF0cy5wYXNzZXMpO1xuICBkcmF3KGNvbG9ycy5mYWlsLCBzdGF0cy5mYWlsdXJlcyk7XG4gIGRyYXcoY29sb3JzLnBlbmRpbmcsIHN0YXRzLnBlbmRpbmcpO1xuICB3cml0ZSgnXFxuJyk7XG5cbiAgdGhpcy5jdXJzb3JVcCh0aGlzLm51bWJlck9mTGluZXMpO1xufTtcblxuLyoqXG4gKiBBcHBlbmQgdGhlIHJhaW5ib3cuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuTnlhbkNhdC5wcm90b3R5cGUuYXBwZW5kUmFpbmJvdyA9IGZ1bmN0aW9uKCl7XG4gIHZhciBzZWdtZW50ID0gdGhpcy50aWNrID8gJ18nIDogJy0nO1xuICB2YXIgcmFpbmJvd2lmaWVkID0gdGhpcy5yYWluYm93aWZ5KHNlZ21lbnQpO1xuXG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm51bWJlck9mTGluZXM7IGluZGV4KyspIHtcbiAgICB2YXIgdHJhamVjdG9yeSA9IHRoaXMudHJhamVjdG9yaWVzW2luZGV4XTtcbiAgICBpZiAodHJhamVjdG9yeS5sZW5ndGggPj0gdGhpcy50cmFqZWN0b3J5V2lkdGhNYXgpIHRyYWplY3Rvcnkuc2hpZnQoKTtcbiAgICB0cmFqZWN0b3J5LnB1c2gocmFpbmJvd2lmaWVkKTtcbiAgfVxufTtcblxuLyoqXG4gKiBEcmF3IHRoZSByYWluYm93LlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbk55YW5DYXQucHJvdG90eXBlLmRyYXdSYWluYm93ID0gZnVuY3Rpb24oKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHRoaXMudHJhamVjdG9yaWVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaW5kZXgpIHtcbiAgICB3cml0ZSgnXFx1MDAxYlsnICsgc2VsZi5zY29yZWJvYXJkV2lkdGggKyAnQycpO1xuICAgIHdyaXRlKGxpbmUuam9pbignJykpO1xuICAgIHdyaXRlKCdcXG4nKTtcbiAgfSk7XG5cbiAgdGhpcy5jdXJzb3JVcCh0aGlzLm51bWJlck9mTGluZXMpO1xufTtcblxuLyoqXG4gKiBEcmF3IHRoZSBueWFuIGNhdFxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbk55YW5DYXQucHJvdG90eXBlLmRyYXdOeWFuQ2F0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHN0YXJ0V2lkdGggPSB0aGlzLnNjb3JlYm9hcmRXaWR0aCArIHRoaXMudHJhamVjdG9yaWVzWzBdLmxlbmd0aDtcbiAgdmFyIGNvbG9yID0gJ1xcdTAwMWJbJyArIHN0YXJ0V2lkdGggKyAnQyc7XG4gIHZhciBwYWRkaW5nID0gJyc7XG5cbiAgd3JpdGUoY29sb3IpO1xuICB3cml0ZSgnXywtLS0tLS0sJyk7XG4gIHdyaXRlKCdcXG4nKTtcblxuICB3cml0ZShjb2xvcik7XG4gIHBhZGRpbmcgPSBzZWxmLnRpY2sgPyAnICAnIDogJyAgICc7XG4gIHdyaXRlKCdffCcgKyBwYWRkaW5nICsgJy9cXFxcXy9cXFxcICcpO1xuICB3cml0ZSgnXFxuJyk7XG5cbiAgd3JpdGUoY29sb3IpO1xuICBwYWRkaW5nID0gc2VsZi50aWNrID8gJ18nIDogJ19fJztcbiAgdmFyIHRhaWwgPSBzZWxmLnRpY2sgPyAnficgOiAnXic7XG4gIHZhciBmYWNlO1xuICB3cml0ZSh0YWlsICsgJ3wnICsgcGFkZGluZyArIHRoaXMuZmFjZSgpICsgJyAnKTtcbiAgd3JpdGUoJ1xcbicpO1xuXG4gIHdyaXRlKGNvbG9yKTtcbiAgcGFkZGluZyA9IHNlbGYudGljayA/ICcgJyA6ICcgICc7XG4gIHdyaXRlKHBhZGRpbmcgKyAnXCJcIiAgXCJcIiAnKTtcbiAgd3JpdGUoJ1xcbicpO1xuXG4gIHRoaXMuY3Vyc29yVXAodGhpcy5udW1iZXJPZkxpbmVzKTtcbn07XG5cbi8qKlxuICogRHJhdyBueWFuIGNhdCBmYWNlLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbk55YW5DYXQucHJvdG90eXBlLmZhY2UgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0YXRzID0gdGhpcy5zdGF0cztcbiAgaWYgKHN0YXRzLmZhaWx1cmVzKSB7XG4gICAgcmV0dXJuICcoIHggLngpJztcbiAgfSBlbHNlIGlmIChzdGF0cy5wZW5kaW5nKSB7XG4gICAgcmV0dXJuICcoIG8gLm8pJztcbiAgfSBlbHNlIGlmKHN0YXRzLnBhc3Nlcykge1xuICAgIHJldHVybiAnKCBeIC5eKSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcoIC0gLi0pJztcbiAgfVxufVxuXG4vKipcbiAqIE1vdmUgY3Vyc29yIHVwIGBuYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gblxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuTnlhbkNhdC5wcm90b3R5cGUuY3Vyc29yVXAgPSBmdW5jdGlvbihuKSB7XG4gIHdyaXRlKCdcXHUwMDFiWycgKyBuICsgJ0EnKTtcbn07XG5cbi8qKlxuICogTW92ZSBjdXJzb3IgZG93biBgbmAuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbk55YW5DYXQucHJvdG90eXBlLmN1cnNvckRvd24gPSBmdW5jdGlvbihuKSB7XG4gIHdyaXRlKCdcXHUwMDFiWycgKyBuICsgJ0InKTtcbn07XG5cbi8qKlxuICogR2VuZXJhdGUgcmFpbmJvdyBjb2xvcnMuXG4gKlxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5OeWFuQ2F0LnByb3RvdHlwZS5nZW5lcmF0ZUNvbG9ycyA9IGZ1bmN0aW9uKCl7XG4gIHZhciBjb2xvcnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8ICg2ICogNyk7IGkrKykge1xuICAgIHZhciBwaTMgPSBNYXRoLmZsb29yKE1hdGguUEkgLyAzKTtcbiAgICB2YXIgbiA9IChpICogKDEuMCAvIDYpKTtcbiAgICB2YXIgciA9IE1hdGguZmxvb3IoMyAqIE1hdGguc2luKG4pICsgMyk7XG4gICAgdmFyIGcgPSBNYXRoLmZsb29yKDMgKiBNYXRoLnNpbihuICsgMiAqIHBpMykgKyAzKTtcbiAgICB2YXIgYiA9IE1hdGguZmxvb3IoMyAqIE1hdGguc2luKG4gKyA0ICogcGkzKSArIDMpO1xuICAgIGNvbG9ycy5wdXNoKDM2ICogciArIDYgKiBnICsgYiArIDE2KTtcbiAgfVxuXG4gIHJldHVybiBjb2xvcnM7XG59O1xuXG4vKipcbiAqIEFwcGx5IHJhaW5ib3cgdG8gdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbk55YW5DYXQucHJvdG90eXBlLnJhaW5ib3dpZnkgPSBmdW5jdGlvbihzdHIpe1xuICB2YXIgY29sb3IgPSB0aGlzLnJhaW5ib3dDb2xvcnNbdGhpcy5jb2xvckluZGV4ICUgdGhpcy5yYWluYm93Q29sb3JzLmxlbmd0aF07XG4gIHRoaXMuY29sb3JJbmRleCArPSAxO1xuICByZXR1cm4gJ1xcdTAwMWJbMzg7NTsnICsgY29sb3IgKyAnbScgKyBzdHIgKyAnXFx1MDAxYlswbSc7XG59O1xuXG4vKipcbiAqIFN0ZG91dCBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gd3JpdGUoc3RyaW5nKSB7XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHN0cmluZyk7XG59XG5cbi8qKlxuICogSW5oZXJpdCBmcm9tIGBCYXNlLnByb3RvdHlwZWAuXG4gKi9cblxuZnVuY3Rpb24gRigpe307XG5GLnByb3RvdHlwZSA9IEJhc2UucHJvdG90eXBlO1xuTnlhbkNhdC5wcm90b3R5cGUgPSBuZXcgRjtcbk55YW5DYXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTnlhbkNhdDtcblxuXG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMvbnlhbi5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwicmVwb3J0ZXJzL3Byb2dyZXNzLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKVxuICAsIGN1cnNvciA9IEJhc2UuY3Vyc29yXG4gICwgY29sb3IgPSBCYXNlLmNvbG9yO1xuXG4vKipcbiAqIEV4cG9zZSBgUHJvZ3Jlc3NgLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFByb2dyZXNzO1xuXG4vKipcbiAqIEdlbmVyYWwgcHJvZ3Jlc3MgYmFyIGNvbG9yLlxuICovXG5cbkJhc2UuY29sb3JzLnByb2dyZXNzID0gOTA7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUHJvZ3Jlc3NgIGJhciB0ZXN0IHJlcG9ydGVyLlxuICpcbiAqIEBwYXJhbSB7UnVubmVyfSBydW5uZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFByb2dyZXNzKHJ1bm5lciwgb3B0aW9ucykge1xuICBCYXNlLmNhbGwodGhpcywgcnVubmVyKTtcblxuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgLCBzdGF0cyA9IHRoaXMuc3RhdHNcbiAgICAsIHdpZHRoID0gQmFzZS53aW5kb3cud2lkdGggKiAuNTAgfCAwXG4gICAgLCB0b3RhbCA9IHJ1bm5lci50b3RhbFxuICAgICwgY29tcGxldGUgPSAwXG4gICAgLCBtYXggPSBNYXRoLm1heFxuICAgICwgbGFzdE4gPSAtMTtcblxuICAvLyBkZWZhdWx0IGNoYXJzXG4gIG9wdGlvbnMub3BlbiA9IG9wdGlvbnMub3BlbiB8fCAnWyc7XG4gIG9wdGlvbnMuY29tcGxldGUgPSBvcHRpb25zLmNvbXBsZXRlIHx8ICfilqwnO1xuICBvcHRpb25zLmluY29tcGxldGUgPSBvcHRpb25zLmluY29tcGxldGUgfHwgQmFzZS5zeW1ib2xzLmRvdDtcbiAgb3B0aW9ucy5jbG9zZSA9IG9wdGlvbnMuY2xvc2UgfHwgJ10nO1xuICBvcHRpb25zLnZlcmJvc2UgPSBmYWxzZTtcblxuICAvLyB0ZXN0cyBzdGFydGVkXG4gIHJ1bm5lci5vbignc3RhcnQnLCBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCk7XG4gICAgY3Vyc29yLmhpZGUoKTtcbiAgfSk7XG5cbiAgLy8gdGVzdHMgY29tcGxldGVcbiAgcnVubmVyLm9uKCd0ZXN0IGVuZCcsIGZ1bmN0aW9uKCl7XG4gICAgY29tcGxldGUrKztcbiAgICB2YXIgaW5jb21wbGV0ZSA9IHRvdGFsIC0gY29tcGxldGVcbiAgICAgICwgcGVyY2VudCA9IGNvbXBsZXRlIC8gdG90YWxcbiAgICAgICwgbiA9IHdpZHRoICogcGVyY2VudCB8IDBcbiAgICAgICwgaSA9IHdpZHRoIC0gbjtcblxuICAgIGlmIChsYXN0TiA9PT0gbiAmJiAhb3B0aW9ucy52ZXJib3NlKSB7XG4gICAgICAvLyBEb24ndCByZS1yZW5kZXIgdGhlIGxpbmUgaWYgaXQgaGFzbid0IGNoYW5nZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGFzdE4gPSBuO1xuXG4gICAgY3Vyc29yLkNSKCk7XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcdTAwMWJbSicpO1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGNvbG9yKCdwcm9ncmVzcycsICcgICcgKyBvcHRpb25zLm9wZW4pKTtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShBcnJheShuKS5qb2luKG9wdGlvbnMuY29tcGxldGUpKTtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShBcnJheShpKS5qb2luKG9wdGlvbnMuaW5jb21wbGV0ZSkpO1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGNvbG9yKCdwcm9ncmVzcycsIG9wdGlvbnMuY2xvc2UpKTtcbiAgICBpZiAob3B0aW9ucy52ZXJib3NlKSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShjb2xvcigncHJvZ3Jlc3MnLCAnICcgKyBjb21wbGV0ZSArICcgb2YgJyArIHRvdGFsKSk7XG4gICAgfVxuICB9KTtcblxuICAvLyB0ZXN0cyBhcmUgY29tcGxldGUsIG91dHB1dCBzb21lIHN0YXRzXG4gIC8vIGFuZCB0aGUgZmFpbHVyZXMgaWYgYW55XG4gIHJ1bm5lci5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICBjdXJzb3Iuc2hvdygpO1xuICAgIGNvbnNvbGUubG9nKCk7XG4gICAgc2VsZi5lcGlsb2d1ZSgpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBJbmhlcml0IGZyb20gYEJhc2UucHJvdG90eXBlYC5cbiAqL1xuXG5mdW5jdGlvbiBGKCl7fTtcbkYucHJvdG90eXBlID0gQmFzZS5wcm90b3R5cGU7XG5Qcm9ncmVzcy5wcm90b3R5cGUgPSBuZXcgRjtcblByb2dyZXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFByb2dyZXNzO1xuXG5cbn0pOyAvLyBtb2R1bGU6IHJlcG9ydGVycy9wcm9ncmVzcy5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwicmVwb3J0ZXJzL3NwZWMuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJylcbiAgLCBjdXJzb3IgPSBCYXNlLmN1cnNvclxuICAsIGNvbG9yID0gQmFzZS5jb2xvcjtcblxuLyoqXG4gKiBFeHBvc2UgYFNwZWNgLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFNwZWM7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgU3BlY2AgdGVzdCByZXBvcnRlci5cbiAqXG4gKiBAcGFyYW0ge1J1bm5lcn0gcnVubmVyXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFNwZWMocnVubmVyKSB7XG4gIEJhc2UuY2FsbCh0aGlzLCBydW5uZXIpO1xuXG4gIHZhciBzZWxmID0gdGhpc1xuICAgICwgc3RhdHMgPSB0aGlzLnN0YXRzXG4gICAgLCBpbmRlbnRzID0gMFxuICAgICwgbiA9IDA7XG5cbiAgZnVuY3Rpb24gaW5kZW50KCkge1xuICAgIHJldHVybiBBcnJheShpbmRlbnRzKS5qb2luKCcgICcpXG4gIH1cblxuICBydW5uZXIub24oJ3N0YXJ0JywgZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygpO1xuICB9KTtcblxuICBydW5uZXIub24oJ3N1aXRlJywgZnVuY3Rpb24oc3VpdGUpe1xuICAgICsraW5kZW50cztcbiAgICBjb25zb2xlLmxvZyhjb2xvcignc3VpdGUnLCAnJXMlcycpLCBpbmRlbnQoKSwgc3VpdGUudGl0bGUpO1xuICB9KTtcblxuICBydW5uZXIub24oJ3N1aXRlIGVuZCcsIGZ1bmN0aW9uKHN1aXRlKXtcbiAgICAtLWluZGVudHM7XG4gICAgaWYgKDEgPT0gaW5kZW50cykgY29uc29sZS5sb2coKTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdwZW5kaW5nJywgZnVuY3Rpb24odGVzdCl7XG4gICAgdmFyIGZtdCA9IGluZGVudCgpICsgY29sb3IoJ3BlbmRpbmcnLCAnICAtICVzJyk7XG4gICAgY29uc29sZS5sb2coZm10LCB0ZXN0LnRpdGxlKTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdwYXNzJywgZnVuY3Rpb24odGVzdCl7XG4gICAgaWYgKCdmYXN0JyA9PSB0ZXN0LnNwZWVkKSB7XG4gICAgICB2YXIgZm10ID0gaW5kZW50KClcbiAgICAgICAgKyBjb2xvcignY2hlY2ttYXJrJywgJyAgJyArIEJhc2Uuc3ltYm9scy5vaylcbiAgICAgICAgKyBjb2xvcigncGFzcycsICcgJXMgJyk7XG4gICAgICBjdXJzb3IuQ1IoKTtcbiAgICAgIGNvbnNvbGUubG9nKGZtdCwgdGVzdC50aXRsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBmbXQgPSBpbmRlbnQoKVxuICAgICAgICArIGNvbG9yKCdjaGVja21hcmsnLCAnICAnICsgQmFzZS5zeW1ib2xzLm9rKVxuICAgICAgICArIGNvbG9yKCdwYXNzJywgJyAlcyAnKVxuICAgICAgICArIGNvbG9yKHRlc3Quc3BlZWQsICcoJWRtcyknKTtcbiAgICAgIGN1cnNvci5DUigpO1xuICAgICAgY29uc29sZS5sb2coZm10LCB0ZXN0LnRpdGxlLCB0ZXN0LmR1cmF0aW9uKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJ1bm5lci5vbignZmFpbCcsIGZ1bmN0aW9uKHRlc3QsIGVycil7XG4gICAgY3Vyc29yLkNSKCk7XG4gICAgY29uc29sZS5sb2coaW5kZW50KCkgKyBjb2xvcignZmFpbCcsICcgICVkKSAlcycpLCArK24sIHRlc3QudGl0bGUpO1xuICB9KTtcblxuICBydW5uZXIub24oJ2VuZCcsIHNlbGYuZXBpbG9ndWUuYmluZChzZWxmKSk7XG59XG5cbi8qKlxuICogSW5oZXJpdCBmcm9tIGBCYXNlLnByb3RvdHlwZWAuXG4gKi9cblxuZnVuY3Rpb24gRigpe307XG5GLnByb3RvdHlwZSA9IEJhc2UucHJvdG90eXBlO1xuU3BlYy5wcm90b3R5cGUgPSBuZXcgRjtcblNwZWMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3BlYztcblxuXG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMvc3BlYy5qc1xuXG5yZXF1aXJlLnJlZ2lzdGVyKFwicmVwb3J0ZXJzL3RhcC5qc1wiLCBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUpe1xuXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKVxuICAsIGN1cnNvciA9IEJhc2UuY3Vyc29yXG4gICwgY29sb3IgPSBCYXNlLmNvbG9yO1xuXG4vKipcbiAqIEV4cG9zZSBgVEFQYC5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBUQVA7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgVEFQYCByZXBvcnRlci5cbiAqXG4gKiBAcGFyYW0ge1J1bm5lcn0gcnVubmVyXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFRBUChydW5uZXIpIHtcbiAgQmFzZS5jYWxsKHRoaXMsIHJ1bm5lcik7XG5cbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCBzdGF0cyA9IHRoaXMuc3RhdHNcbiAgICAsIG4gPSAxXG4gICAgLCBwYXNzZXMgPSAwXG4gICAgLCBmYWlsdXJlcyA9IDA7XG5cbiAgcnVubmVyLm9uKCdzdGFydCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIHRvdGFsID0gcnVubmVyLmdyZXBUb3RhbChydW5uZXIuc3VpdGUpO1xuICAgIGNvbnNvbGUubG9nKCclZC4uJWQnLCAxLCB0b3RhbCk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbigndGVzdCBlbmQnLCBmdW5jdGlvbigpe1xuICAgICsrbjtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdwZW5kaW5nJywgZnVuY3Rpb24odGVzdCl7XG4gICAgY29uc29sZS5sb2coJ29rICVkICVzICMgU0tJUCAtJywgbiwgdGl0bGUodGVzdCkpO1xuICB9KTtcblxuICBydW5uZXIub24oJ3Bhc3MnLCBmdW5jdGlvbih0ZXN0KXtcbiAgICBwYXNzZXMrKztcbiAgICBjb25zb2xlLmxvZygnb2sgJWQgJXMnLCBuLCB0aXRsZSh0ZXN0KSk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbignZmFpbCcsIGZ1bmN0aW9uKHRlc3QsIGVycil7XG4gICAgZmFpbHVyZXMrKztcbiAgICBjb25zb2xlLmxvZygnbm90IG9rICVkICVzJywgbiwgdGl0bGUodGVzdCkpO1xuICAgIGlmIChlcnIuc3RhY2spIGNvbnNvbGUubG9nKGVyci5zdGFjay5yZXBsYWNlKC9eL2dtLCAnICAnKSk7XG4gIH0pO1xuXG4gIHJ1bm5lci5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygnIyB0ZXN0cyAnICsgKHBhc3NlcyArIGZhaWx1cmVzKSk7XG4gICAgY29uc29sZS5sb2coJyMgcGFzcyAnICsgcGFzc2VzKTtcbiAgICBjb25zb2xlLmxvZygnIyBmYWlsICcgKyBmYWlsdXJlcyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJldHVybiBhIFRBUC1zYWZlIHRpdGxlIG9mIGB0ZXN0YFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0ZXN0XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiB0aXRsZSh0ZXN0KSB7XG4gIHJldHVybiB0ZXN0LmZ1bGxUaXRsZSgpLnJlcGxhY2UoLyMvZywgJycpO1xufVxuXG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMvdGFwLmpzXG5cbnJlcXVpcmUucmVnaXN0ZXIoXCJyZXBvcnRlcnMveHVuaXQuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJylcbiAgLCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcbiAgLCBlc2NhcGUgPSB1dGlscy5lc2NhcGU7XG5cbi8qKlxuICogU2F2ZSB0aW1lciByZWZlcmVuY2VzIHRvIGF2b2lkIFNpbm9uIGludGVyZmVyaW5nIChzZWUgR0gtMjM3KS5cbiAqL1xuXG52YXIgRGF0ZSA9IGdsb2JhbC5EYXRlXG4gICwgc2V0VGltZW91dCA9IGdsb2JhbC5zZXRUaW1lb3V0XG4gICwgc2V0SW50ZXJ2YWwgPSBnbG9iYWwuc2V0SW50ZXJ2YWxcbiAgLCBjbGVhclRpbWVvdXQgPSBnbG9iYWwuY2xlYXJUaW1lb3V0XG4gICwgY2xlYXJJbnRlcnZhbCA9IGdsb2JhbC5jbGVhckludGVydmFsO1xuXG4vKipcbiAqIEV4cG9zZSBgWFVuaXRgLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFhVbml0O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFhVbml0YCByZXBvcnRlci5cbiAqXG4gKiBAcGFyYW0ge1J1bm5lcn0gcnVubmVyXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFhVbml0KHJ1bm5lcikge1xuICBCYXNlLmNhbGwodGhpcywgcnVubmVyKTtcbiAgdmFyIHN0YXRzID0gdGhpcy5zdGF0c1xuICAgICwgdGVzdHMgPSBbXVxuICAgICwgc2VsZiA9IHRoaXM7XG5cbiAgcnVubmVyLm9uKCdwZW5kaW5nJywgZnVuY3Rpb24odGVzdCl7XG4gICAgdGVzdHMucHVzaCh0ZXN0KTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdwYXNzJywgZnVuY3Rpb24odGVzdCl7XG4gICAgdGVzdHMucHVzaCh0ZXN0KTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdmYWlsJywgZnVuY3Rpb24odGVzdCl7XG4gICAgdGVzdHMucHVzaCh0ZXN0KTtcbiAgfSk7XG5cbiAgcnVubmVyLm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKHRhZygndGVzdHN1aXRlJywge1xuICAgICAgICBuYW1lOiAnTW9jaGEgVGVzdHMnXG4gICAgICAsIHRlc3RzOiBzdGF0cy50ZXN0c1xuICAgICAgLCBmYWlsdXJlczogc3RhdHMuZmFpbHVyZXNcbiAgICAgICwgZXJyb3JzOiBzdGF0cy5mYWlsdXJlc1xuICAgICAgLCBza2lwcGVkOiBzdGF0cy50ZXN0cyAtIHN0YXRzLmZhaWx1cmVzIC0gc3RhdHMucGFzc2VzXG4gICAgICAsIHRpbWVzdGFtcDogKG5ldyBEYXRlKS50b1VUQ1N0cmluZygpXG4gICAgICAsIHRpbWU6IChzdGF0cy5kdXJhdGlvbiAvIDEwMDApIHx8IDBcbiAgICB9LCBmYWxzZSkpO1xuXG4gICAgdGVzdHMuZm9yRWFjaCh0ZXN0KTtcbiAgICBjb25zb2xlLmxvZygnPC90ZXN0c3VpdGU+Jyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEluaGVyaXQgZnJvbSBgQmFzZS5wcm90b3R5cGVgLlxuICovXG5cbmZ1bmN0aW9uIEYoKXt9O1xuRi5wcm90b3R5cGUgPSBCYXNlLnByb3RvdHlwZTtcblhVbml0LnByb3RvdHlwZSA9IG5ldyBGO1xuWFVuaXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gWFVuaXQ7XG5cblxuLyoqXG4gKiBPdXRwdXQgdGFnIGZvciB0aGUgZ2l2ZW4gYHRlc3QuYFxuICovXG5cbmZ1bmN0aW9uIHRlc3QodGVzdCkge1xuICB2YXIgYXR0cnMgPSB7XG4gICAgICBjbGFzc25hbWU6IHRlc3QucGFyZW50LmZ1bGxUaXRsZSgpXG4gICAgLCBuYW1lOiB0ZXN0LnRpdGxlXG4gICAgLCB0aW1lOiAodGVzdC5kdXJhdGlvbiAvIDEwMDApIHx8IDBcbiAgfTtcblxuICBpZiAoJ2ZhaWxlZCcgPT0gdGVzdC5zdGF0ZSkge1xuICAgIHZhciBlcnIgPSB0ZXN0LmVycjtcbiAgICBjb25zb2xlLmxvZyh0YWcoJ3Rlc3RjYXNlJywgYXR0cnMsIGZhbHNlLCB0YWcoJ2ZhaWx1cmUnLCB7fSwgZmFsc2UsIGNkYXRhKGVzY2FwZShlcnIubWVzc2FnZSkgKyBcIlxcblwiICsgZXJyLnN0YWNrKSkpKTtcbiAgfSBlbHNlIGlmICh0ZXN0LnBlbmRpbmcpIHtcbiAgICBjb25zb2xlLmxvZyh0YWcoJ3Rlc3RjYXNlJywgYXR0cnMsIGZhbHNlLCB0YWcoJ3NraXBwZWQnLCB7fSwgdHJ1ZSkpKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyh0YWcoJ3Rlc3RjYXNlJywgYXR0cnMsIHRydWUpICk7XG4gIH1cbn1cblxuLyoqXG4gKiBIVE1MIHRhZyBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gdGFnKG5hbWUsIGF0dHJzLCBjbG9zZSwgY29udGVudCkge1xuICB2YXIgZW5kID0gY2xvc2UgPyAnLz4nIDogJz4nXG4gICAgLCBwYWlycyA9IFtdXG4gICAgLCB0YWc7XG5cbiAgZm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG4gICAgcGFpcnMucHVzaChrZXkgKyAnPVwiJyArIGVzY2FwZShhdHRyc1trZXldKSArICdcIicpO1xuICB9XG5cbiAgdGFnID0gJzwnICsgbmFtZSArIChwYWlycy5sZW5ndGggPyAnICcgKyBwYWlycy5qb2luKCcgJykgOiAnJykgKyBlbmQ7XG4gIGlmIChjb250ZW50KSB0YWcgKz0gY29udGVudCArICc8LycgKyBuYW1lICsgZW5kO1xuICByZXR1cm4gdGFnO1xufVxuXG4vKipcbiAqIFJldHVybiBjZGF0YSBlc2NhcGVkIENEQVRBIGBzdHJgLlxuICovXG5cbmZ1bmN0aW9uIGNkYXRhKHN0cikge1xuICByZXR1cm4gJzwhW0NEQVRBWycgKyBlc2NhcGUoc3RyKSArICddXT4nO1xufVxuXG59KTsgLy8gbW9kdWxlOiByZXBvcnRlcnMveHVuaXQuanNcblxucmVxdWlyZS5yZWdpc3RlcihcInJ1bm5hYmxlLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnYnJvd3Nlci9ldmVudHMnKS5FdmVudEVtaXR0ZXJcbiAgLCBkZWJ1ZyA9IHJlcXVpcmUoJ2Jyb3dzZXIvZGVidWcnKSgnbW9jaGE6cnVubmFibGUnKVxuICAsIG1pbGxpc2Vjb25kcyA9IHJlcXVpcmUoJy4vbXMnKTtcblxuLyoqXG4gKiBTYXZlIHRpbWVyIHJlZmVyZW5jZXMgdG8gYXZvaWQgU2lub24gaW50ZXJmZXJpbmcgKHNlZSBHSC0yMzcpLlxuICovXG5cbnZhciBEYXRlID0gZ2xvYmFsLkRhdGVcbiAgLCBzZXRUaW1lb3V0ID0gZ2xvYmFsLnNldFRpbWVvdXRcbiAgLCBzZXRJbnRlcnZhbCA9IGdsb2JhbC5zZXRJbnRlcnZhbFxuICAsIGNsZWFyVGltZW91dCA9IGdsb2JhbC5jbGVhclRpbWVvdXRcbiAgLCBjbGVhckludGVydmFsID0gZ2xvYmFsLmNsZWFySW50ZXJ2YWw7XG5cbi8qKlxuICogT2JqZWN0I3RvU3RyaW5nKCkuXG4gKi9cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBFeHBvc2UgYFJ1bm5hYmxlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJ1bm5hYmxlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJ1bm5hYmxlYCB3aXRoIHRoZSBnaXZlbiBgdGl0bGVgIGFuZCBjYWxsYmFjayBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIFJ1bm5hYmxlKHRpdGxlLCBmbikge1xuICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gIHRoaXMuZm4gPSBmbjtcbiAgdGhpcy5hc3luYyA9IGZuICYmIGZuLmxlbmd0aDtcbiAgdGhpcy5zeW5jID0gISB0aGlzLmFzeW5jO1xuICB0aGlzLl90aW1lb3V0ID0gMjAwMDtcbiAgdGhpcy5fc2xvdyA9IDc1O1xuICB0aGlzLl9lbmFibGVUaW1lb3V0cyA9IHRydWU7XG4gIHRoaXMudGltZWRPdXQgPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBJbmhlcml0IGZyb20gYEV2ZW50RW1pdHRlci5wcm90b3R5cGVgLlxuICovXG5cbmZ1bmN0aW9uIEYoKXt9O1xuRi5wcm90b3R5cGUgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlO1xuUnVubmFibGUucHJvdG90eXBlID0gbmV3IEY7XG5SdW5uYWJsZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSdW5uYWJsZTtcblxuXG4vKipcbiAqIFNldCAmIGdldCB0aW1lb3V0IGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBtc1xuICogQHJldHVybiB7UnVubmFibGV8TnVtYmVyfSBtcyBvciBzZWxmXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SdW5uYWJsZS5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uKG1zKXtcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRoaXMuX3RpbWVvdXQ7XG4gIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgbXMpIG1zID0gbWlsbGlzZWNvbmRzKG1zKTtcbiAgZGVidWcoJ3RpbWVvdXQgJWQnLCBtcyk7XG4gIHRoaXMuX3RpbWVvdXQgPSBtcztcbiAgaWYgKHRoaXMudGltZXIpIHRoaXMucmVzZXRUaW1lb3V0KCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgJiBnZXQgc2xvdyBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gbXNcbiAqIEByZXR1cm4ge1J1bm5hYmxlfE51bWJlcn0gbXMgb3Igc2VsZlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUnVubmFibGUucHJvdG90eXBlLnNsb3cgPSBmdW5jdGlvbihtcyl7XG4gIGlmICgwID09PSBhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGhpcy5fc2xvdztcbiAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBtcykgbXMgPSBtaWxsaXNlY29uZHMobXMpO1xuICBkZWJ1ZygndGltZW91dCAlZCcsIG1zKTtcbiAgdGhpcy5fc2xvdyA9IG1zO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IGFuZCAmIGdldCB0aW1lb3V0IGBlbmFibGVkYC5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZWRcbiAqIEByZXR1cm4ge1J1bm5hYmxlfEJvb2xlYW59IGVuYWJsZWQgb3Igc2VsZlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUnVubmFibGUucHJvdG90eXBlLmVuYWJsZVRpbWVvdXRzID0gZnVuY3Rpb24oZW5hYmxlZCl7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5fZW5hYmxlVGltZW91dHM7XG4gIGRlYnVnKCdlbmFibGVUaW1lb3V0cyAlcycsIGVuYWJsZWQpO1xuICB0aGlzLl9lbmFibGVUaW1lb3V0cyA9IGVuYWJsZWQ7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGZ1bGwgdGl0bGUgZ2VuZXJhdGVkIGJ5IHJlY3Vyc2l2ZWx5XG4gKiBjb25jYXRlbmF0aW5nIHRoZSBwYXJlbnQncyBmdWxsIHRpdGxlLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUnVubmFibGUucHJvdG90eXBlLmZ1bGxUaXRsZSA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0aGlzLnBhcmVudC5mdWxsVGl0bGUoKSArICcgJyArIHRoaXMudGl0bGU7XG59O1xuXG4vKipcbiAqIENsZWFyIHRoZSB0aW1lb3V0LlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJ1bm5hYmxlLnByb3RvdHlwZS5jbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpe1xuICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG59O1xuXG4vKipcbiAqIEluc3BlY3QgdGhlIHJ1bm5hYmxlIHZvaWQgb2YgcHJpdmF0ZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJ1bm5hYmxlLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMsIGZ1bmN0aW9uKGtleSwgdmFsKXtcbiAgICBpZiAoJ18nID09IGtleVswXSkgcmV0dXJuO1xuICAgIGlmICgncGFyZW50JyA9PSBrZXkpIHJldHVybiAnIzxTdWl0ZT4nO1xuICAgIGlmICgnY3R4JyA9PSBrZXkpIHJldHVybiAnIzxDb250ZXh0Pic7XG4gICAgcmV0dXJuIHZhbDtcbiAgfSwgMik7XG59O1xuXG4vKipcbiAqIFJlc2V0IHRoZSB0aW1lb3V0LlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJ1bm5hYmxlLnByb3RvdHlwZS5yZXNldFRpbWVvdXQgPSBmdW5jdGlvbigpe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBtcyA9IHRoaXMudGltZW91dCgpIHx8IDFlOTtcblxuICBpZiAoIXRoaXMuX2VuYWJsZVRpbWVvdXRzKSByZXR1cm47XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgc2VsZi5jYWxsYmFjayhuZXcgRXJyb3IoJ3RpbWVvdXQgb2YgJyArIG1zICsgJ21zIGV4Y2VlZGVkJykpO1xuICAgIHNlbGYudGltZWRPdXQgPSB0cnVlO1xuICB9LCBtcyk7XG59O1xuXG4vKipcbiAqIFdoaXRlbGlzdCB0aGVzZSBnbG9iYWxzIGZvciB0aGlzIHRlc3QgcnVuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblJ1bm5hYmxlLnByb3RvdHlwZS5nbG9iYWxzID0gZnVuY3Rpb24oYXJyKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9hbGxvd2VkR2xvYmFscyA9IGFycjtcbn07XG5cbi8qKlxuICogUnVuIHRoZSB0ZXN0IGFuZCBpbnZva2UgYGZuKGVycilgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SdW5uYWJsZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oZm4pe1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIHN0YXJ0ID0gbmV3IERhdGVcbiAgICAsIGN0eCA9IHRoaXMuY3R4XG4gICAgLCBmaW5pc2hlZFxuICAgICwgZW1pdHRlZDtcblxuICAvLyBTb21lIHRpbWVzIHRoZSBjdHggZXhpc3RzIGJ1dCBpdCBpcyBub3QgcnVubmFibGVcbiAgaWYgKGN0eCAmJiBjdHgucnVubmFibGUpIGN0eC5ydW5uYWJsZSh0aGlzKTtcblxuICAvLyBjYWxsZWQgbXVsdGlwbGUgdGltZXNcbiAgZnVuY3Rpb24gbXVsdGlwbGUoZXJyKSB7XG4gICAgaWYgKGVtaXR0ZWQpIHJldHVybjtcbiAgICBlbWl0dGVkID0gdHJ1ZTtcbiAgICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyIHx8IG5ldyBFcnJvcignZG9uZSgpIGNhbGxlZCBtdWx0aXBsZSB0aW1lcycpKTtcbiAgfVxuXG4gIC8vIGZpbmlzaGVkXG4gIGZ1bmN0aW9uIGRvbmUoZXJyKSB7XG4gICAgdmFyIG1zID0gc2VsZi50aW1lb3V0KCk7XG4gICAgaWYgKHNlbGYudGltZWRPdXQpIHJldHVybjtcbiAgICBpZiAoZmluaXNoZWQpIHJldHVybiBtdWx0aXBsZShlcnIpO1xuICAgIHNlbGYuY2xlYXJUaW1lb3V0KCk7XG4gICAgc2VsZi5kdXJhdGlvbiA9IG5ldyBEYXRlIC0gc3RhcnQ7XG4gICAgZmluaXNoZWQgPSB0cnVlO1xuICAgIGlmICghZXJyICYmIHNlbGYuZHVyYXRpb24gPiBtcyAmJiBzZWxmLl9lbmFibGVUaW1lb3V0cykgZXJyID0gbmV3IEVycm9yKCd0aW1lb3V0IG9mICcgKyBtcyArICdtcyBleGNlZWRlZCcpO1xuICAgIGZuKGVycik7XG4gIH1cblxuICAvLyBmb3IgLnJlc2V0VGltZW91dCgpXG4gIHRoaXMuY2FsbGJhY2sgPSBkb25lO1xuXG4gIC8vIGV4cGxpY2l0IGFzeW5jIHdpdGggYGRvbmVgIGFyZ3VtZW50XG4gIGlmICh0aGlzLmFzeW5jKSB7XG4gICAgdGhpcy5yZXNldFRpbWVvdXQoKTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmZuLmNhbGwoY3R4LCBmdW5jdGlvbihlcnIpe1xuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IgfHwgdG9TdHJpbmcuY2FsbChlcnIpID09PSBcIltvYmplY3QgRXJyb3JdXCIpIHJldHVybiBkb25lKGVycik7XG4gICAgICAgIGlmIChudWxsICE9IGVycikge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZXJyKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgICAgICAgIHJldHVybiBkb25lKG5ldyBFcnJvcignZG9uZSgpIGludm9rZWQgd2l0aCBub24tRXJyb3I6ICcgKyBKU09OLnN0cmluZ2lmeShlcnIpKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkb25lKG5ldyBFcnJvcignZG9uZSgpIGludm9rZWQgd2l0aCBub24tRXJyb3I6ICcgKyBlcnIpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBkb25lKGVycik7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0aGlzLmFzeW5jT25seSkge1xuICAgIHJldHVybiBkb25lKG5ldyBFcnJvcignLS1hc3luYy1vbmx5IG9wdGlvbiBpbiB1c2Ugd2l0aG91dCBkZWNsYXJpbmcgYGRvbmUoKWAnKSk7XG4gIH1cblxuICAvLyBzeW5jIG9yIHByb21pc2UtcmV0dXJuaW5nXG4gIHRyeSB7XG4gICAgaWYgKHRoaXMucGVuZGluZykge1xuICAgICAgZG9uZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsRm4odGhpcy5mbik7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkb25lKGVycik7XG4gIH1cblxuICBmdW5jdGlvbiBjYWxsRm4oZm4pIHtcbiAgICB2YXIgcmVzdWx0ID0gZm4uY2FsbChjdHgpO1xuICAgIGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBzZWxmLnJlc2V0VGltZW91dCgpO1xuICAgICAgcmVzdWx0XG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGRvbmUoKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICBkb25lKHJlYXNvbiB8fCBuZXcgRXJyb3IoJ1Byb21pc2UgcmVqZWN0ZWQgd2l0aCBubyBvciBmYWxzeSByZWFzb24nKSlcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvbmUoKTtcbiAgICB9XG4gIH1cbn07XG5cbn0pOyAvLyBtb2R1bGU6IHJ1bm5hYmxlLmpzXG5cbnJlcXVpcmUucmVnaXN0ZXIoXCJydW5uZXIuanNcIiwgZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlKXtcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnYnJvd3Nlci9ldmVudHMnKS5FdmVudEVtaXR0ZXJcbiAgLCBkZWJ1ZyA9IHJlcXVpcmUoJ2Jyb3dzZXIvZGVidWcnKSgnbW9jaGE6cnVubmVyJylcbiAgLCBUZXN0ID0gcmVxdWlyZSgnLi90ZXN0JylcbiAgLCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKVxuICAsIGZpbHRlciA9IHV0aWxzLmZpbHRlclxuICAsIGtleXMgPSB1dGlscy5rZXlzO1xuXG4vKipcbiAqIE5vbi1lbnVtZXJhYmxlIGdsb2JhbHMuXG4gKi9cblxudmFyIGdsb2JhbHMgPSBbXG4gICdzZXRUaW1lb3V0JyxcbiAgJ2NsZWFyVGltZW91dCcsXG4gICdzZXRJbnRlcnZhbCcsXG4gICdjbGVhckludGVydmFsJyxcbiAgJ1hNTEh0dHBSZXF1ZXN0JyxcbiAgJ0RhdGUnXG5dO1xuXG4vKipcbiAqIEV4cG9zZSBgUnVubmVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJ1bm5lcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgYFJ1bm5lcmAgZm9yIHRoZSBnaXZlbiBgc3VpdGVgLlxuICpcbiAqIEV2ZW50czpcbiAqXG4gKiAgIC0gYHN0YXJ0YCAgZXhlY3V0aW9uIHN0YXJ0ZWRcbiAqICAgLSBgZW5kYCAgZXhlY3V0aW9uIGNvbXBsZXRlXG4gKiAgIC0gYHN1aXRlYCAgKHN1aXRlKSB0ZXN0IHN1aXRlIGV4ZWN1dGlvbiBzdGFydGVkXG4gKiAgIC0gYHN1aXRlIGVuZGAgIChzdWl0ZSkgYWxsIHRlc3RzIChhbmQgc3ViLXN1aXRlcykgaGF2ZSBmaW5pc2hlZFxuICogICAtIGB0ZXN0YCAgKHRlc3QpIHRlc3QgZXhlY3V0aW9uIHN0YXJ0ZWRcbiAqICAgLSBgdGVzdCBlbmRgICAodGVzdCkgdGVzdCBjb21wbGV0ZWRcbiAqICAgLSBgaG9va2AgIChob29rKSBob29rIGV4ZWN1dGlvbiBzdGFydGVkXG4gKiAgIC0gYGhvb2sgZW5kYCAgKGhvb2spIGhvb2sgY29tcGxldGVcbiAqICAgLSBgcGFzc2AgICh0ZXN0KSB0ZXN0IHBhc3NlZFxuICogICAtIGBmYWlsYCAgKHRlc3QsIGVycikgdGVzdCBmYWlsZWRcbiAqICAgLSBgcGVuZGluZ2AgICh0ZXN0KSB0ZXN0IHBlbmRpbmdcbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJ1bm5lcihzdWl0ZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2dsb2JhbHMgPSBbXTtcbiAgdGhpcy5fYWJvcnQgPSBmYWxzZTtcbiAgdGhpcy5zdWl0ZSA9IHN1aXRlO1xuICB0aGlzLnRvdGFsID0gc3VpdGUudG90YWwoKTtcbiAgdGhpcy5mYWlsdXJlcyA9IDA7XG4gIHRoaXMub24oJ3Rlc3QgZW5kJywgZnVuY3Rpb24odGVzdCl7IHNlbGYuY2hlY2tHbG9iYWxzKHRlc3QpOyB9KTtcbiAgdGhpcy5vbignaG9vayBlbmQnLCBmdW5jdGlvbihob29rKXsgc2VsZi5jaGVja0dsb2JhbHMoaG9vayk7IH0pO1xuICB0aGlzLmdyZXAoLy4qLyk7XG4gIHRoaXMuZ2xvYmFscyh0aGlzLmdsb2JhbFByb3BzKCkuY29uY2F0KGV4dHJhR2xvYmFscygpKSk7XG59XG5cbi8qKlxuICogV3JhcHBlciBmb3Igc2V0SW1tZWRpYXRlLCBwcm9jZXNzLm5leHRUaWNrLCBvciBicm93c2VyIHBvbHlmaWxsLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SdW5uZXIuaW1tZWRpYXRlbHkgPSBnbG9iYWwuc2V0SW1tZWRpYXRlIHx8IHByb2Nlc3MubmV4dFRpY2s7XG5cbi8qKlxuICogSW5oZXJpdCBmcm9tIGBFdmVudEVtaXR0ZXIucHJvdG90eXBlYC5cbiAqL1xuXG5mdW5jdGlvbiBGKCl7fTtcbkYucHJvdG90eXBlID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZTtcblJ1bm5lci5wcm90b3R5cGUgPSBuZXcgRjtcblJ1bm5lci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSdW5uZXI7XG5cblxuLyoqXG4gKiBSdW4gdGVzdHMgd2l0aCBmdWxsIHRpdGxlcyBtYXRjaGluZyBgcmVgLiBVcGRhdGVzIHJ1bm5lci50b3RhbFxuICogd2l0aCBudW1iZXIgb2YgdGVzdHMgbWF0Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge1JlZ0V4cH0gcmVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaW52ZXJ0XG4gKiBAcmV0dXJuIHtSdW5uZXJ9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SdW5uZXIucHJvdG90eXBlLmdyZXAgPSBmdW5jdGlvbihyZSwgaW52ZXJ0KXtcbiAgZGVidWcoJ2dyZXAgJXMnLCByZSk7XG4gIHRoaXMuX2dyZXAgPSByZTtcbiAgdGhpcy5faW52ZXJ0ID0gaW52ZXJ0O1xuICB0aGlzLnRvdGFsID0gdGhpcy5ncmVwVG90YWwodGhpcy5zdWl0ZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgdGVzdHMgbWF0Y2hpbmcgdGhlIGdyZXAgc2VhcmNoIGZvciB0aGVcbiAqIGdpdmVuIHN1aXRlLlxuICpcbiAqIEBwYXJhbSB7U3VpdGV9IHN1aXRlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJ1bm5lci5wcm90b3R5cGUuZ3JlcFRvdGFsID0gZnVuY3Rpb24oc3VpdGUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgdG90YWwgPSAwO1xuXG4gIHN1aXRlLmVhY2hUZXN0KGZ1bmN0aW9uKHRlc3Qpe1xuICAgIHZhciBtYXRjaCA9IHNlbGYuX2dyZXAudGVzdCh0ZXN0LmZ1bGxUaXRsZSgpKTtcbiAgICBpZiAoc2VsZi5faW52ZXJ0KSBtYXRjaCA9ICFtYXRjaDtcbiAgICBpZiAobWF0Y2gpIHRvdGFsKys7XG4gIH0pO1xuXG4gIHJldHVybiB0b3RhbDtcbn07XG5cbi8qKlxuICogUmV0dXJuIGEgbGlzdCBvZiBnbG9iYWwgcHJvcGVydGllcy5cbiAqXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJ1bm5lci5wcm90b3R5cGUuZ2xvYmFsUHJvcHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByb3BzID0gdXRpbHMua2V5cyhnbG9iYWwpO1xuXG4gIC8vIG5vbi1lbnVtZXJhYmxlc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGdsb2JhbHMubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAofnV0aWxzLmluZGV4T2YocHJvcHMsIGdsb2JhbHNbaV0pKSBjb250aW51ZTtcbiAgICBwcm9wcy5wdXNoKGdsb2JhbHNbaV0pO1xuICB9XG5cbiAgcmV0dXJuIHByb3BzO1xufTtcblxuLyoqXG4gKiBBbGxvdyB0aGUgZ2l2ZW4gYGFycmAgb2YgZ2xvYmFscy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEByZXR1cm4ge1J1bm5lcn0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJ1bm5lci5wcm90b3R5cGUuZ2xvYmFscyA9IGZ1bmN0aW9uKGFycil7XG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLl9nbG9iYWxzO1xuICBkZWJ1ZygnZ2xvYmFscyAlaicsIGFycik7XG4gIHRoaXMuX2dsb2JhbHMgPSB0aGlzLl9nbG9iYWxzLmNvbmNhdChhcnIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2hlY2sgZm9yIGdsb2JhbCB2YXJpYWJsZSBsZWFrcy5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SdW5uZXIucHJvdG90eXBlLmNoZWNrR2xvYmFscyA9IGZ1bmN0aW9uKHRlc3Qpe1xuICBpZiAodGhpcy5pZ25vcmVMZWFrcykgcmV0dXJuO1xuICB2YXIgb2sgPSB0aGlzLl9nbG9iYWxzO1xuXG4gIHZhciBnbG9iYWxzID0gdGhpcy5nbG9iYWxQcm9wcygpO1xuICB2YXIgbGVha3M7XG5cbiAgaWYgKHRlc3QpIHtcbiAgICBvayA9IG9rLmNvbmNhdCh0ZXN0Ll9hbGxvd2VkR2xvYmFscyB8fCBbXSk7XG4gIH1cblxuICBpZih0aGlzLnByZXZHbG9iYWxzTGVuZ3RoID09IGdsb2JhbHMubGVuZ3RoKSByZXR1cm47XG4gIHRoaXMucHJldkdsb2JhbHNMZW5ndGggPSBnbG9iYWxzLmxlbmd0aDtcblxuICBsZWFrcyA9IGZpbHRlckxlYWtzKG9rLCBnbG9iYWxzKTtcbiAgdGhpcy5fZ2xvYmFscyA9IHRoaXMuX2dsb2JhbHMuY29uY2F0KGxlYWtzKTtcblxuICBpZiAobGVha3MubGVuZ3RoID4gMSkge1xuICAgIHRoaXMuZmFpbCh0ZXN0LCBuZXcgRXJyb3IoJ2dsb2JhbCBsZWFrcyBkZXRlY3RlZDogJyArIGxlYWtzLmpvaW4oJywgJykgKyAnJykpO1xuICB9IGVsc2UgaWYgKGxlYWtzLmxlbmd0aCkge1xuICAgIHRoaXMuZmFpbCh0ZXN0LCBuZXcgRXJyb3IoJ2dsb2JhbCBsZWFrIGRldGVjdGVkOiAnICsgbGVha3NbMF0pKTtcbiAgfVxufTtcblxuLyoqXG4gKiBGYWlsIHRoZSBnaXZlbiBgdGVzdGAuXG4gKlxuICogQHBhcmFtIHtUZXN0fSB0ZXN0XG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJ1bm5lci5wcm90b3R5cGUuZmFpbCA9IGZ1bmN0aW9uKHRlc3QsIGVycil7XG4gICsrdGhpcy5mYWlsdXJlcztcbiAgdGVzdC5zdGF0ZSA9ICdmYWlsZWQnO1xuXG4gIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgZXJyKSB7XG4gICAgZXJyID0gbmV3IEVycm9yKCd0aGUgc3RyaW5nIFwiJyArIGVyciArICdcIiB3YXMgdGhyb3duLCB0aHJvdyBhbiBFcnJvciA6KScpO1xuICB9XG5cbiAgdGhpcy5lbWl0KCdmYWlsJywgdGVzdCwgZXJyKTtcbn07XG5cbi8qKlxuICogRmFpbCB0aGUgZ2l2ZW4gYGhvb2tgIHdpdGggYGVycmAuXG4gKlxuICogSG9vayBmYWlsdXJlcyB3b3JrIGluIHRoZSBmb2xsb3dpbmcgcGF0dGVybjpcbiAqIC0gSWYgYmFpbCwgdGhlbiBleGl0XG4gKiAtIEZhaWxlZCBgYmVmb3JlYCBob29rIHNraXBzIGFsbCB0ZXN0cyBpbiBhIHN1aXRlIGFuZCBzdWJzdWl0ZXMsXG4gKiAgIGJ1dCBqdW1wcyB0byBjb3JyZXNwb25kaW5nIGBhZnRlcmAgaG9va1xuICogLSBGYWlsZWQgYGJlZm9yZSBlYWNoYCBob29rIHNraXBzIHJlbWFpbmluZyB0ZXN0cyBpbiBhXG4gKiAgIHN1aXRlIGFuZCBqdW1wcyB0byBjb3JyZXNwb25kaW5nIGBhZnRlciBlYWNoYCBob29rLFxuICogICB3aGljaCBpcyBydW4gb25seSBvbmNlXG4gKiAtIEZhaWxlZCBgYWZ0ZXJgIGhvb2sgZG9lcyBub3QgYWx0ZXJcbiAqICAgZXhlY3V0aW9uIG9yZGVyXG4gKiAtIEZhaWxlZCBgYWZ0ZXIgZWFjaGAgaG9vayBza2lwcyByZW1haW5pbmcgdGVzdHMgaW4gYVxuICogICBzdWl0ZSBhbmQgc3Vic3VpdGVzLCBidXQgZXhlY3V0ZXMgb3RoZXIgYGFmdGVyIGVhY2hgXG4gKiAgIGhvb2tzXG4gKlxuICogQHBhcmFtIHtIb29rfSBob29rXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJ1bm5lci5wcm90b3R5cGUuZmFpbEhvb2sgPSBmdW5jdGlvbihob29rLCBlcnIpe1xuICB0aGlzLmZhaWwoaG9vaywgZXJyKTtcbiAgaWYgKHRoaXMuc3VpdGUuYmFpbCgpKSB7XG4gICAgdGhpcy5lbWl0KCdlbmQnKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSdW4gaG9vayBgbmFtZWAgY2FsbGJhY2tzIGFuZCB0aGVuIGludm9rZSBgZm4oKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SdW5uZXIucHJvdG90eXBlLmhvb2sgPSBmdW5jdGlvbihuYW1lLCBmbil7XG4gIHZhciBzdWl0ZSA9IHRoaXMuc3VpdGVcbiAgICAsIGhvb2tzID0gc3VpdGVbJ18nICsgbmFtZV1cbiAgICAsIHNlbGYgPSB0aGlzXG4gICAgLCB0aW1lcjtcblxuICBmdW5jdGlvbiBuZXh0KGkpIHtcbiAgICB2YXIgaG9vayA9IGhvb2tzW2ldO1xuICAgIGlmICghaG9vaykgcmV0dXJuIGZuKCk7XG4gICAgaWYgKHNlbGYuZmFpbHVyZXMgJiYgc3VpdGUuYmFpbCgpKSByZXR1cm4gZm4oKTtcbiAgICBzZWxmLmN1cnJlbnRSdW5uYWJsZSA9IGhvb2s7XG5cbiAgICBob29rLmN0eC5jdXJyZW50VGVzdCA9IHNlbGYudGVzdDtcblxuICAgIHNlbGYuZW1pdCgnaG9vaycsIGhvb2spO1xuXG4gICAgaG9vay5vbignZXJyb3InLCBmdW5jdGlvbihlcnIpe1xuICAgICAgc2VsZi5mYWlsSG9vayhob29rLCBlcnIpO1xuICAgIH0pO1xuXG4gICAgaG9vay5ydW4oZnVuY3Rpb24oZXJyKXtcbiAgICAgIGhvb2sucmVtb3ZlQWxsTGlzdGVuZXJzKCdlcnJvcicpO1xuICAgICAgdmFyIHRlc3RFcnJvciA9IGhvb2suZXJyb3IoKTtcbiAgICAgIGlmICh0ZXN0RXJyb3IpIHNlbGYuZmFpbChzZWxmLnRlc3QsIHRlc3RFcnJvcik7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHNlbGYuZmFpbEhvb2soaG9vaywgZXJyKTtcblxuICAgICAgICAvLyBzdG9wIGV4ZWN1dGluZyBob29rcywgbm90aWZ5IGNhbGxlZSBvZiBob29rIGVyclxuICAgICAgICByZXR1cm4gZm4oZXJyKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuZW1pdCgnaG9vayBlbmQnLCBob29rKTtcbiAgICAgIGRlbGV0ZSBob29rLmN0eC5jdXJyZW50VGVzdDtcbiAgICAgIG5leHQoKytpKTtcbiAgICB9KTtcbiAgfVxuXG4gIFJ1bm5lci5pbW1lZGlhdGVseShmdW5jdGlvbigpe1xuICAgIG5leHQoMCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBSdW4gaG9vayBgbmFtZWAgZm9yIHRoZSBnaXZlbiBhcnJheSBvZiBgc3VpdGVzYFxuICogaW4gb3JkZXIsIGFuZCBjYWxsYmFjayBgZm4oZXJyLCBlcnJTdWl0ZSlgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge0FycmF5fSBzdWl0ZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SdW5uZXIucHJvdG90eXBlLmhvb2tzID0gZnVuY3Rpb24obmFtZSwgc3VpdGVzLCBmbil7XG4gIHZhciBzZWxmID0gdGhpc1xuICAgICwgb3JpZyA9IHRoaXMuc3VpdGU7XG5cbiAgZnVuY3Rpb24gbmV4dChzdWl0ZSkge1xuICAgIHNlbGYuc3VpdGUgPSBzdWl0ZTtcblxuICAgIGlmICghc3VpdGUpIHtcbiAgICAgIHNlbGYuc3VpdGUgPSBvcmlnO1xuICAgICAgcmV0dXJuIGZuKCk7XG4gICAgfVxuXG4gICAgc2VsZi5ob29rKG5hbWUsIGZ1bmN0aW9uKGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHZhciBlcnJTdWl0ZSA9IHNlbGYuc3VpdGU7XG4gICAgICAgIHNlbGYuc3VpdGUgPSBvcmlnO1xuICAgICAgICByZXR1cm4gZm4oZXJyLCBlcnJTdWl0ZSk7XG4gICAgICB9XG5cbiAgICAgIG5leHQoc3VpdGVzLnBvcCgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5leHQoc3VpdGVzLnBvcCgpKTtcbn07XG5cbi8qKlxuICogUnVuIGhvb2tzIGZyb20gdGhlIHRvcCBsZXZlbCBkb3duLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUnVubmVyLnByb3RvdHlwZS5ob29rVXAgPSBmdW5jdGlvbihuYW1lLCBmbil7XG4gIHZhciBzdWl0ZXMgPSBbdGhpcy5zdWl0ZV0uY29uY2F0KHRoaXMucGFyZW50cygpKS5yZXZlcnNlKCk7XG4gIHRoaXMuaG9va3MobmFtZSwgc3VpdGVzLCBmbik7XG59O1xuXG4vKipcbiAqIFJ1biBob29rcyBmcm9tIHRoZSBib3R0b20gdXAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SdW5uZXIucHJvdG90eXBlLmhvb2tEb3duID0gZnVuY3Rpb24obmFtZSwgZm4pe1xuICB2YXIgc3VpdGVzID0gW3RoaXMuc3VpdGVdLmNvbmNhdCh0aGlzLnBhcmVudHMoKSk7XG4gIHRoaXMuaG9va3MobmFtZSwgc3VpdGVzLCBmbik7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBhcnJheSBvZiBwYXJlbnQgU3VpdGVzIGZyb21cbiAqIGNsb3Nlc3QgdG8gZnVydGhlc3QuXG4gKlxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SdW5uZXIucHJvdG90eXBlLnBhcmVudHMgPSBmdW5jdGlvbigpe1xuICB2YXIgc3VpdGUgPSB0aGlzLnN1aXRlXG4gICAgLCBzdWl0ZXMgPSBbXTtcbiAgd2hpbGUgKHN1aXRlID0gc3VpdGUucGFyZW50KSBzdWl0ZXMucHVzaChzdWl0ZSk7XG4gIHJldHVybiBzdWl0ZXM7XG59O1xuXG4vKipcbiAqIFJ1biB0aGUgY3VycmVudCB0ZXN0IGFuZCBjYWxsYmFjayBgZm4oZXJyKWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJ1bm5lci5wcm90b3R5cGUucnVuVGVzdCA9IGZ1bmN0aW9uKGZuKXtcbiAgdmFyIHRlc3QgPSB0aGlzLnRlc3RcbiAgICAsIHNlbGYgPSB0aGlzO1xuXG4gIGlmICh0aGlzLmFzeW5jT25seSkgdGVzdC5hc3luY09ubHkgPSB0cnVlO1xuXG4gIHRyeSB7XG4gICAgdGVzdC5vbignZXJyb3InLCBmdW5jdGlvbihlcnIpe1xuICAgICAgc2VsZi5mYWlsKHRlc3QsIGVycik7XG4gICAgfSk7XG4gICAgdGVzdC5ydW4oZm4pO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBmbihlcnIpO1xuICB9XG59O1xuXG4vKipcbiAqIFJ1biB0ZXN0cyBpbiB0aGUgZ2l2ZW4gYHN1aXRlYCBhbmQgaW52b2tlXG4gKiB0aGUgY2FsbGJhY2sgYGZuKClgIHdoZW4gY29tcGxldGUuXG4gKlxuICogQHBhcmFtIHtTdWl0ZX0gc3VpdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SdW5uZXIucHJvdG90eXBlLnJ1blRlc3RzID0gZnVuY3Rpb24oc3VpdGUsIGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCB0ZXN0cyA9IHN1aXRlLnRlc3RzLnNsaWNlKClcbiAgICAsIHRlc3Q7XG5cblxuICBmdW5jdGlvbiBob29rRXJyKGVyciwgZXJyU3VpdGUsIGFmdGVyKSB7XG4gICAgLy8gYmVmb3JlL2FmdGVyIEVhY2ggaG9vayBmb3IgZXJyU3VpdGUgZmFpbGVkOlxuICAgIHZhciBvcmlnID0gc2VsZi5zdWl0ZTtcblxuICAgIC8vIGZvciBmYWlsZWQgJ2FmdGVyIGVhY2gnIGhvb2sgc3RhcnQgZnJvbSBlcnJTdWl0ZSBwYXJlbnQsXG4gICAgLy8gb3RoZXJ3aXNlIHN0YXJ0IGZyb20gZXJyU3VpdGUgaXRzZWxmXG4gICAgc2VsZi5zdWl0ZSA9IGFmdGVyID8gZXJyU3VpdGUucGFyZW50IDogZXJyU3VpdGU7XG5cbiAgICBpZiAoc2VsZi5zdWl0ZSkge1xuICAgICAgLy8gY2FsbCBob29rVXAgYWZ0ZXJFYWNoXG4gICAgICBzZWxmLmhvb2tVcCgnYWZ0ZXJFYWNoJywgZnVuY3Rpb24oZXJyMiwgZXJyU3VpdGUyKSB7XG4gICAgICAgIHNlbGYuc3VpdGUgPSBvcmlnO1xuICAgICAgICAvLyBzb21lIGhvb2tzIG1heSBmYWlsIGV2ZW4gbm93XG4gICAgICAgIGlmIChlcnIyKSByZXR1cm4gaG9va0VycihlcnIyLCBlcnJTdWl0ZTIsIHRydWUpO1xuICAgICAgICAvLyByZXBvcnQgZXJyb3Igc3VpdGVcbiAgICAgICAgZm4oZXJyU3VpdGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRoZXJlIGlzIG5vIG5lZWQgY2FsbGluZyBvdGhlciAnYWZ0ZXIgZWFjaCcgaG9va3NcbiAgICAgIHNlbGYuc3VpdGUgPSBvcmlnO1xuICAgICAgZm4oZXJyU3VpdGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5leHQoZXJyLCBlcnJTdWl0ZSkge1xuICAgIC8vIGlmIHdlIGJhaWwgYWZ0ZXIgZmlyc3QgZXJyXG4gICAgaWYgKHNlbGYuZmFpbHVyZXMgJiYgc3VpdGUuX2JhaWwpIHJldHVybiBmbigpO1xuXG4gICAgaWYgKHNlbGYuX2Fib3J0KSByZXR1cm4gZm4oKTtcblxuICAgIGlmIChlcnIpIHJldHVybiBob29rRXJyKGVyciwgZXJyU3VpdGUsIHRydWUpO1xuXG4gICAgLy8gbmV4dCB0ZXN0XG4gICAgdGVzdCA9IHRlc3RzLnNoaWZ0KCk7XG5cbiAgICAvLyBhbGwgZG9uZVxuICAgIGlmICghdGVzdCkgcmV0dXJuIGZuKCk7XG5cbiAgICAvLyBncmVwXG4gICAgdmFyIG1hdGNoID0gc2VsZi5fZ3JlcC50ZXN0KHRlc3QuZnVsbFRpdGxlKCkpO1xuICAgIGlmIChzZWxmLl9pbnZlcnQpIG1hdGNoID0gIW1hdGNoO1xuICAgIGlmICghbWF0Y2gpIHJldHVybiBuZXh0KCk7XG5cbiAgICAvLyBwZW5kaW5nXG4gICAgaWYgKHRlc3QucGVuZGluZykge1xuICAgICAgc2VsZi5lbWl0KCdwZW5kaW5nJywgdGVzdCk7XG4gICAgICBzZWxmLmVtaXQoJ3Rlc3QgZW5kJywgdGVzdCk7XG4gICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cblxuICAgIC8vIGV4ZWN1dGUgdGVzdCBhbmQgaG9vayhzKVxuICAgIHNlbGYuZW1pdCgndGVzdCcsIHNlbGYudGVzdCA9IHRlc3QpO1xuICAgIHNlbGYuaG9va0Rvd24oJ2JlZm9yZUVhY2gnLCBmdW5jdGlvbihlcnIsIGVyclN1aXRlKXtcblxuICAgICAgaWYgKGVycikgcmV0dXJuIGhvb2tFcnIoZXJyLCBlcnJTdWl0ZSwgZmFsc2UpO1xuXG4gICAgICBzZWxmLmN1cnJlbnRSdW5uYWJsZSA9IHNlbGYudGVzdDtcbiAgICAgIHNlbGYucnVuVGVzdChmdW5jdGlvbihlcnIpe1xuICAgICAgICB0ZXN0ID0gc2VsZi50ZXN0O1xuXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBzZWxmLmZhaWwodGVzdCwgZXJyKTtcbiAgICAgICAgICBzZWxmLmVtaXQoJ3Rlc3QgZW5kJywgdGVzdCk7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuaG9va1VwKCdhZnRlckVhY2gnLCBuZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRlc3Quc3RhdGUgPSAncGFzc2VkJztcbiAgICAgICAgc2VsZi5lbWl0KCdwYXNzJywgdGVzdCk7XG4gICAgICAgIHNlbGYuZW1pdCgndGVzdCBlbmQnLCB0ZXN0KTtcbiAgICAgICAgc2VsZi5ob29rVXAoJ2FmdGVyRWFjaCcsIG5leHQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB0aGlzLm5leHQgPSBuZXh0O1xuICBuZXh0KCk7XG59O1xuXG4vKipcbiAqIFJ1biB0aGUgZ2l2ZW4gYHN1aXRlYCBhbmQgaW52b2tlIHRoZVxuICogY2FsbGJhY2sgYGZuKClgIHdoZW4gY29tcGxldGUuXG4gKlxuICogQHBhcmFtIHtTdWl0ZX0gc3VpdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SdW5uZXIucHJvdG90eXBlLnJ1blN1aXRlID0gZnVuY3Rpb24oc3VpdGUsIGZuKXtcbiAgdmFyIHRvdGFsID0gdGhpcy5ncmVwVG90YWwoc3VpdGUpXG4gICAgLCBzZWxmID0gdGhpc1xuICAgICwgaSA9IDA7XG5cbiAgZGVidWcoJ3J1biBzdWl0ZSAlcycsIHN1aXRlLmZ1bGxUaXRsZSgpKTtcblxuICBpZiAoIXRvdGFsKSByZXR1cm4gZm4oKTtcblxuICB0aGlzLmVtaXQoJ3N1aXRlJywgdGhpcy5zdWl0ZSA9IHN1aXRlKTtcblxuICBmdW5jdGlvbiBuZXh0KGVyclN1aXRlKSB7XG4gICAgaWYgKGVyclN1aXRlKSB7XG4gICAgICAvLyBjdXJyZW50IHN1aXRlIGZhaWxlZCBvbiBhIGhvb2sgZnJvbSBlcnJTdWl0ZVxuICAgICAgaWYgKGVyclN1aXRlID09IHN1aXRlKSB7XG4gICAgICAgIC8vIGlmIGVyclN1aXRlIGlzIGN1cnJlbnQgc3VpdGVcbiAgICAgICAgLy8gY29udGludWUgdG8gdGhlIG5leHQgc2libGluZyBzdWl0ZVxuICAgICAgICByZXR1cm4gZG9uZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZXJyU3VpdGUgaXMgYW1vbmcgdGhlIHBhcmVudHMgb2YgY3VycmVudCBzdWl0ZVxuICAgICAgICAvLyBzdG9wIGV4ZWN1dGlvbiBvZiBlcnJTdWl0ZSBhbmQgYWxsIHN1Yi1zdWl0ZXNcbiAgICAgICAgcmV0dXJuIGRvbmUoZXJyU3VpdGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLl9hYm9ydCkgcmV0dXJuIGRvbmUoKTtcblxuICAgIHZhciBjdXJyID0gc3VpdGUuc3VpdGVzW2krK107XG4gICAgaWYgKCFjdXJyKSByZXR1cm4gZG9uZSgpO1xuICAgIHNlbGYucnVuU3VpdGUoY3VyciwgbmV4dCk7XG4gIH1cblxuICBmdW5jdGlvbiBkb25lKGVyclN1aXRlKSB7XG4gICAgc2VsZi5zdWl0ZSA9IHN1aXRlO1xuICAgIHNlbGYuaG9vaygnYWZ0ZXJBbGwnLCBmdW5jdGlvbigpe1xuICAgICAgc2VsZi5lbWl0KCdzdWl0ZSBlbmQnLCBzdWl0ZSk7XG4gICAgICBmbihlcnJTdWl0ZSk7XG4gICAgfSk7XG4gIH1cblxuICB0aGlzLmhvb2soJ2JlZm9yZUFsbCcsIGZ1bmN0aW9uKGVycil7XG4gICAgaWYgKGVycikgcmV0dXJuIGRvbmUoKTtcbiAgICBzZWxmLnJ1blRlc3RzKHN1aXRlLCBuZXh0KTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEhhbmRsZSB1bmNhdWdodCBleGNlcHRpb25zLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUnVubmVyLnByb3RvdHlwZS51bmNhdWdodCA9IGZ1bmN0aW9uKGVycil7XG4gIGlmIChlcnIpIHtcbiAgICBkZWJ1ZygndW5jYXVnaHQgZXhjZXB0aW9uICVzJywgZXJyLm1lc3NhZ2UpO1xuICB9IGVsc2Uge1xuICAgIGRlYnVnKCd1bmNhdWdodCB1bmRlZmluZWQgZXhjZXB0aW9uJyk7XG4gICAgZXJyID0gbmV3IEVycm9yKCdDYXRjaGVkIHVuZGVmaW5lZCBlcnJvciwgZGlkIHlvdSB0aHJvdyB3aXRob3V0IHNwZWNpZnlpbmcgd2hhdD8nKTtcbiAgfVxuICBcbiAgdmFyIHJ1bm5hYmxlID0gdGhpcy5jdXJyZW50UnVubmFibGU7XG4gIGlmICghcnVubmFibGUgfHwgJ2ZhaWxlZCcgPT0gcnVubmFibGUuc3RhdGUpIHJldHVybjtcbiAgcnVubmFibGUuY2xlYXJUaW1lb3V0KCk7XG4gIGVyci51bmNhdWdodCA9IHRydWU7XG4gIHRoaXMuZmFpbChydW5uYWJsZSwgZXJyKTtcblxuICAvLyByZWNvdmVyIGZyb20gdGVzdFxuICBpZiAoJ3Rlc3QnID09IHJ1bm5hYmxlLnR5cGUpIHtcbiAgICB0aGlzLmVtaXQoJ3Rlc3QgZW5kJywgcnVubmFibGUpO1xuICAgIHRoaXMuaG9va1VwKCdhZnRlckVhY2gnLCB0aGlzLm5leHQpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGJhaWwgb24gaG9va3NcbiAgdGhpcy5lbWl0KCdlbmQnKTtcbn07XG5cbi8qKlxuICogUnVuIHRoZSByb290IHN1aXRlIGFuZCBpbnZva2UgYGZuKGZhaWx1cmVzKWBcbiAqIG9uIGNvbXBsZXRpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1J1bm5lcn0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJ1bm5lci5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oZm4pe1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIGZuID0gZm4gfHwgZnVuY3Rpb24oKXt9O1xuXG4gIGZ1bmN0aW9uIHVuY2F1Z2h0KGVycil7XG4gICAgc2VsZi51bmNhdWdodChlcnIpO1xuICB9XG5cbiAgZGVidWcoJ3N0YXJ0Jyk7XG5cbiAgLy8gY2FsbGJhY2tcbiAgdGhpcy5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICBkZWJ1ZygnZW5kJyk7XG4gICAgcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcigndW5jYXVnaHRFeGNlcHRpb24nLCB1bmNhdWdodCk7XG4gICAgZm4oc2VsZi5mYWlsdXJlcyk7XG4gIH0pO1xuXG4gIC8vIHJ1biBzdWl0ZXNcbiAgdGhpcy5lbWl0KCdzdGFydCcpO1xuICB0aGlzLnJ1blN1aXRlKHRoaXMuc3VpdGUsIGZ1bmN0aW9uKCl7XG4gICAgZGVidWcoJ2ZpbmlzaGVkIHJ1bm5pbmcnKTtcbiAgICBzZWxmLmVtaXQoJ2VuZCcpO1xuICB9KTtcblxuICAvLyB1bmNhdWdodCBleGNlcHRpb25cbiAgcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCB1bmNhdWdodCk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENsZWFubHkgYWJvcnQgZXhlY3V0aW9uXG4gKlxuICogQHJldHVybiB7UnVubmVyfSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblJ1bm5lci5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbigpe1xuICBkZWJ1ZygnYWJvcnRpbmcnKTtcbiAgdGhpcy5fYWJvcnQgPSB0cnVlO1xufVxuXG4vKipcbiAqIEZpbHRlciBsZWFrcyB3aXRoIHRoZSBnaXZlbiBnbG9iYWxzIGZsYWdnZWQgYXMgYG9rYC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBva1xuICogQHBhcmFtIHtBcnJheX0gZ2xvYmFsc1xuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmaWx0ZXJMZWFrcyhvaywgZ2xvYmFscykge1xuICByZXR1cm4gZmlsdGVyKGdsb2JhbHMsIGZ1bmN0aW9uKGtleSl7XG4gICAgLy8gRmlyZWZveCBhbmQgQ2hyb21lIGV4cG9zZXMgaWZyYW1lcyBhcyBpbmRleCBpbnNpZGUgdGhlIHdpbmRvdyBvYmplY3RcbiAgICBpZiAoL15kKy8udGVzdChrZXkpKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBpbiBmaXJlZm94XG4gICAgLy8gaWYgcnVubmVyIHJ1bnMgaW4gYW4gaWZyYW1lLCB0aGlzIGlmcmFtZSdzIHdpbmRvdy5nZXRJbnRlcmZhY2UgbWV0aG9kIG5vdCBpbml0IGF0IGZpcnN0XG4gICAgLy8gaXQgaXMgYXNzaWduZWQgaW4gc29tZSBzZWNvbmRzXG4gICAgaWYgKGdsb2JhbC5uYXZpZ2F0b3IgJiYgL15nZXRJbnRlcmZhY2UvLnRlc3Qoa2V5KSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gYW4gaWZyYW1lIGNvdWxkIGJlIGFwcHJvYWNoZWQgYnkgd2luZG93W2lmcmFtZUluZGV4XVxuICAgIC8vIGluIGllNiw3LDggYW5kIG9wZXJhLCBpZnJhbWVJbmRleCBpcyBlbnVtZXJhYmxlLCB0aGlzIGNvdWxkIGNhdXNlIGxlYWtcbiAgICBpZiAoZ2xvYmFsLm5hdmlnYXRvciAmJiAvXlxcZCsvLnRlc3Qoa2V5KSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gT3BlcmEgYW5kIElFIGV4cG9zZSBnbG9iYWwgdmFyaWFibGVzIGZvciBIVE1MIGVsZW1lbnQgSURzIChpc3N1ZSAjMjQzKVxuICAgIGlmICgvXm1vY2hhLS8udGVzdChrZXkpKSByZXR1cm4gZmFsc2U7XG5cbiAgICB2YXIgbWF0Y2hlZCA9IGZpbHRlcihvaywgZnVuY3Rpb24ob2spe1xuICAgICAgaWYgKH5vay5pbmRleE9mKCcqJykpIHJldHVybiAwID09IGtleS5pbmRleE9mKG9rLnNwbGl0KCcqJylbMF0pO1xuICAgICAgcmV0dXJuIGtleSA9PSBvaztcbiAgICB9KTtcbiAgICByZXR1cm4gbWF0Y2hlZC5sZW5ndGggPT0gMCAmJiAoIWdsb2JhbC5uYXZpZ2F0b3IgfHwgJ29uZXJyb3InICE9PSBrZXkpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBBcnJheSBvZiBnbG9iYWxzIGRlcGVuZGVudCBvbiB0aGUgZW52aXJvbm1lbnQuXG4gKlxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG4gZnVuY3Rpb24gZXh0cmFHbG9iYWxzKCkge1xuICBpZiAodHlwZW9mKHByb2Nlc3MpID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mKHByb2Nlc3MudmVyc2lvbikgPT09ICdzdHJpbmcnKSB7XG5cbiAgICB2YXIgbm9kZVZlcnNpb24gPSBwcm9jZXNzLnZlcnNpb24uc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24oYSwgdikge1xuICAgICAgcmV0dXJuIGEgPDwgOCB8IHY7XG4gICAgfSk7XG5cbiAgICAvLyAnZXJybm8nIHdhcyByZW5hbWVkIHRvIHByb2Nlc3MuX2Vycm5vIGluIHYwLjkuMTEuXG5cbiAgICBpZiAobm9kZVZlcnNpb24gPCAweDAwMDkwQikge1xuICAgICAgcmV0dXJuIFsnZXJybm8nXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gW107XG4gfVxuXG59KTsgLy8gbW9kdWxlOiBydW5uZXIuanNcblxucmVxdWlyZS5yZWdpc3RlcihcInN1aXRlLmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnYnJvd3Nlci9ldmVudHMnKS5FdmVudEVtaXR0ZXJcbiAgLCBkZWJ1ZyA9IHJlcXVpcmUoJ2Jyb3dzZXIvZGVidWcnKSgnbW9jaGE6c3VpdGUnKVxuICAsIG1pbGxpc2Vjb25kcyA9IHJlcXVpcmUoJy4vbXMnKVxuICAsIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpXG4gICwgSG9vayA9IHJlcXVpcmUoJy4vaG9vaycpO1xuXG4vKipcbiAqIEV4cG9zZSBgU3VpdGVgLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFN1aXRlO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBgU3VpdGVgIHdpdGggdGhlIGdpdmVuIGB0aXRsZWBcbiAqIGFuZCBwYXJlbnQgYFN1aXRlYC4gV2hlbiBhIHN1aXRlIHdpdGggdGhlXG4gKiBzYW1lIHRpdGxlIGlzIGFscmVhZHkgcHJlc2VudCwgdGhhdCBzdWl0ZVxuICogaXMgcmV0dXJuZWQgdG8gcHJvdmlkZSBuaWNlciByZXBvcnRlclxuICogYW5kIG1vcmUgZmxleGlibGUgbWV0YS10ZXN0aW5nLlxuICpcbiAqIEBwYXJhbSB7U3VpdGV9IHBhcmVudFxuICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlXG4gKiBAcmV0dXJuIHtTdWl0ZX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5jcmVhdGUgPSBmdW5jdGlvbihwYXJlbnQsIHRpdGxlKXtcbiAgdmFyIHN1aXRlID0gbmV3IFN1aXRlKHRpdGxlLCBwYXJlbnQuY3R4KTtcbiAgc3VpdGUucGFyZW50ID0gcGFyZW50O1xuICBpZiAocGFyZW50LnBlbmRpbmcpIHN1aXRlLnBlbmRpbmcgPSB0cnVlO1xuICB0aXRsZSA9IHN1aXRlLmZ1bGxUaXRsZSgpO1xuICBwYXJlbnQuYWRkU3VpdGUoc3VpdGUpO1xuICByZXR1cm4gc3VpdGU7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFN1aXRlYCB3aXRoIHRoZSBnaXZlblxuICogYHRpdGxlYCBhbmQgYGN0eGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlXG4gKiBAcGFyYW0ge0NvbnRleHR9IGN0eFxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gU3VpdGUodGl0bGUsIHBhcmVudENvbnRleHQpIHtcbiAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICB2YXIgY29udGV4dCA9IGZ1bmN0aW9uKCkge307XG4gIGNvbnRleHQucHJvdG90eXBlID0gcGFyZW50Q29udGV4dDtcbiAgdGhpcy5jdHggPSBuZXcgY29udGV4dCgpO1xuICB0aGlzLnN1aXRlcyA9IFtdO1xuICB0aGlzLnRlc3RzID0gW107XG4gIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICB0aGlzLl9iZWZvcmVFYWNoID0gW107XG4gIHRoaXMuX2JlZm9yZUFsbCA9IFtdO1xuICB0aGlzLl9hZnRlckVhY2ggPSBbXTtcbiAgdGhpcy5fYWZ0ZXJBbGwgPSBbXTtcbiAgdGhpcy5yb290ID0gIXRpdGxlO1xuICB0aGlzLl90aW1lb3V0ID0gMjAwMDtcbiAgdGhpcy5fZW5hYmxlVGltZW91dHMgPSB0cnVlO1xuICB0aGlzLl9zbG93ID0gNzU7XG4gIHRoaXMuX2JhaWwgPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBJbmhlcml0IGZyb20gYEV2ZW50RW1pdHRlci5wcm90b3R5cGVgLlxuICovXG5cbmZ1bmN0aW9uIEYoKXt9O1xuRi5wcm90b3R5cGUgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlO1xuU3VpdGUucHJvdG90eXBlID0gbmV3IEY7XG5TdWl0ZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTdWl0ZTtcblxuXG4vKipcbiAqIFJldHVybiBhIGNsb25lIG9mIHRoaXMgYFN1aXRlYC5cbiAqXG4gKiBAcmV0dXJuIHtTdWl0ZX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblN1aXRlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XG4gIHZhciBzdWl0ZSA9IG5ldyBTdWl0ZSh0aGlzLnRpdGxlKTtcbiAgZGVidWcoJ2Nsb25lJyk7XG4gIHN1aXRlLmN0eCA9IHRoaXMuY3R4O1xuICBzdWl0ZS50aW1lb3V0KHRoaXMudGltZW91dCgpKTtcbiAgc3VpdGUuZW5hYmxlVGltZW91dHModGhpcy5lbmFibGVUaW1lb3V0cygpKTtcbiAgc3VpdGUuc2xvdyh0aGlzLnNsb3coKSk7XG4gIHN1aXRlLmJhaWwodGhpcy5iYWlsKCkpO1xuICByZXR1cm4gc3VpdGU7XG59O1xuXG4vKipcbiAqIFNldCB0aW1lb3V0IGBtc2Agb3Igc2hvcnQtaGFuZCBzdWNoIGFzIFwiMnNcIi5cbiAqXG4gKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IG1zXG4gKiBAcmV0dXJuIHtTdWl0ZXxOdW1iZXJ9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuU3VpdGUucHJvdG90eXBlLnRpbWVvdXQgPSBmdW5jdGlvbihtcyl7XG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLl90aW1lb3V0O1xuICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIG1zKSBtcyA9IG1pbGxpc2Vjb25kcyhtcyk7XG4gIGRlYnVnKCd0aW1lb3V0ICVkJywgbXMpO1xuICB0aGlzLl90aW1lb3V0ID0gcGFyc2VJbnQobXMsIDEwKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAgKiBTZXQgdGltZW91dCBgZW5hYmxlZGAuXG4gICpcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZWRcbiAgKiBAcmV0dXJuIHtTdWl0ZXxCb29sZWFufSBzZWxmIG9yIGVuYWJsZWRcbiAgKiBAYXBpIHByaXZhdGVcbiAgKi9cblxuU3VpdGUucHJvdG90eXBlLmVuYWJsZVRpbWVvdXRzID0gZnVuY3Rpb24oZW5hYmxlZCl7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5fZW5hYmxlVGltZW91dHM7XG4gIGRlYnVnKCdlbmFibGVUaW1lb3V0cyAlcycsIGVuYWJsZWQpO1xuICB0aGlzLl9lbmFibGVUaW1lb3V0cyA9IGVuYWJsZWQ7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFNldCBzbG93IGBtc2Agb3Igc2hvcnQtaGFuZCBzdWNoIGFzIFwiMnNcIi5cbiAqXG4gKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IG1zXG4gKiBAcmV0dXJuIHtTdWl0ZXxOdW1iZXJ9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuU3VpdGUucHJvdG90eXBlLnNsb3cgPSBmdW5jdGlvbihtcyl7XG4gIGlmICgwID09PSBhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGhpcy5fc2xvdztcbiAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBtcykgbXMgPSBtaWxsaXNlY29uZHMobXMpO1xuICBkZWJ1Zygnc2xvdyAlZCcsIG1zKTtcbiAgdGhpcy5fc2xvdyA9IG1zO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0cyB3aGV0aGVyIHRvIGJhaWwgYWZ0ZXIgZmlyc3QgZXJyb3IuXG4gKlxuICogQHBhcm1hIHtCb29sZWFufSBiYWlsXG4gKiBAcmV0dXJuIHtTdWl0ZXxOdW1iZXJ9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuU3VpdGUucHJvdG90eXBlLmJhaWwgPSBmdW5jdGlvbihiYWlsKXtcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRoaXMuX2JhaWw7XG4gIGRlYnVnKCdiYWlsICVzJywgYmFpbCk7XG4gIHRoaXMuX2JhaWwgPSBiYWlsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUnVuIGBmbih0ZXN0WywgZG9uZV0pYCBiZWZvcmUgcnVubmluZyB0ZXN0cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7U3VpdGV9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuU3VpdGUucHJvdG90eXBlLmJlZm9yZUFsbCA9IGZ1bmN0aW9uKHRpdGxlLCBmbil7XG4gIGlmICh0aGlzLnBlbmRpbmcpIHJldHVybiB0aGlzO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHRpdGxlKSB7XG4gICAgZm4gPSB0aXRsZTtcbiAgICB0aXRsZSA9IGZuLm5hbWU7XG4gIH1cbiAgdGl0bGUgPSAnXCJiZWZvcmUgYWxsXCIgaG9vaycgKyAodGl0bGUgPyAnOiAnICsgdGl0bGUgOiAnJyk7XG5cbiAgdmFyIGhvb2sgPSBuZXcgSG9vayh0aXRsZSwgZm4pO1xuICBob29rLnBhcmVudCA9IHRoaXM7XG4gIGhvb2sudGltZW91dCh0aGlzLnRpbWVvdXQoKSk7XG4gIGhvb2suZW5hYmxlVGltZW91dHModGhpcy5lbmFibGVUaW1lb3V0cygpKTtcbiAgaG9vay5zbG93KHRoaXMuc2xvdygpKTtcbiAgaG9vay5jdHggPSB0aGlzLmN0eDtcbiAgdGhpcy5fYmVmb3JlQWxsLnB1c2goaG9vayk7XG4gIHRoaXMuZW1pdCgnYmVmb3JlQWxsJywgaG9vayk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSdW4gYGZuKHRlc3RbLCBkb25lXSlgIGFmdGVyIHJ1bm5pbmcgdGVzdHMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1N1aXRlfSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblN1aXRlLnByb3RvdHlwZS5hZnRlckFsbCA9IGZ1bmN0aW9uKHRpdGxlLCBmbil7XG4gIGlmICh0aGlzLnBlbmRpbmcpIHJldHVybiB0aGlzO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHRpdGxlKSB7XG4gICAgZm4gPSB0aXRsZTtcbiAgICB0aXRsZSA9IGZuLm5hbWU7XG4gIH1cbiAgdGl0bGUgPSAnXCJhZnRlciBhbGxcIiBob29rJyArICh0aXRsZSA/ICc6ICcgKyB0aXRsZSA6ICcnKTtcblxuICB2YXIgaG9vayA9IG5ldyBIb29rKHRpdGxlLCBmbik7XG4gIGhvb2sucGFyZW50ID0gdGhpcztcbiAgaG9vay50aW1lb3V0KHRoaXMudGltZW91dCgpKTtcbiAgaG9vay5lbmFibGVUaW1lb3V0cyh0aGlzLmVuYWJsZVRpbWVvdXRzKCkpO1xuICBob29rLnNsb3codGhpcy5zbG93KCkpO1xuICBob29rLmN0eCA9IHRoaXMuY3R4O1xuICB0aGlzLl9hZnRlckFsbC5wdXNoKGhvb2spO1xuICB0aGlzLmVtaXQoJ2FmdGVyQWxsJywgaG9vayk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSdW4gYGZuKHRlc3RbLCBkb25lXSlgIGJlZm9yZSBlYWNoIHRlc3QgY2FzZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7U3VpdGV9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuU3VpdGUucHJvdG90eXBlLmJlZm9yZUVhY2ggPSBmdW5jdGlvbih0aXRsZSwgZm4pe1xuICBpZiAodGhpcy5wZW5kaW5nKSByZXR1cm4gdGhpcztcbiAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiB0aXRsZSkge1xuICAgIGZuID0gdGl0bGU7XG4gICAgdGl0bGUgPSBmbi5uYW1lO1xuICB9XG4gIHRpdGxlID0gJ1wiYmVmb3JlIGVhY2hcIiBob29rJyArICh0aXRsZSA/ICc6ICcgKyB0aXRsZSA6ICcnKTtcblxuICB2YXIgaG9vayA9IG5ldyBIb29rKHRpdGxlLCBmbik7XG4gIGhvb2sucGFyZW50ID0gdGhpcztcbiAgaG9vay50aW1lb3V0KHRoaXMudGltZW91dCgpKTtcbiAgaG9vay5lbmFibGVUaW1lb3V0cyh0aGlzLmVuYWJsZVRpbWVvdXRzKCkpO1xuICBob29rLnNsb3codGhpcy5zbG93KCkpO1xuICBob29rLmN0eCA9IHRoaXMuY3R4O1xuICB0aGlzLl9iZWZvcmVFYWNoLnB1c2goaG9vayk7XG4gIHRoaXMuZW1pdCgnYmVmb3JlRWFjaCcsIGhvb2spO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUnVuIGBmbih0ZXN0WywgZG9uZV0pYCBhZnRlciBlYWNoIHRlc3QgY2FzZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7U3VpdGV9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuU3VpdGUucHJvdG90eXBlLmFmdGVyRWFjaCA9IGZ1bmN0aW9uKHRpdGxlLCBmbil7XG4gIGlmICh0aGlzLnBlbmRpbmcpIHJldHVybiB0aGlzO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHRpdGxlKSB7XG4gICAgZm4gPSB0aXRsZTtcbiAgICB0aXRsZSA9IGZuLm5hbWU7XG4gIH1cbiAgdGl0bGUgPSAnXCJhZnRlciBlYWNoXCIgaG9vaycgKyAodGl0bGUgPyAnOiAnICsgdGl0bGUgOiAnJyk7XG5cbiAgdmFyIGhvb2sgPSBuZXcgSG9vayh0aXRsZSwgZm4pO1xuICBob29rLnBhcmVudCA9IHRoaXM7XG4gIGhvb2sudGltZW91dCh0aGlzLnRpbWVvdXQoKSk7XG4gIGhvb2suZW5hYmxlVGltZW91dHModGhpcy5lbmFibGVUaW1lb3V0cygpKTtcbiAgaG9vay5zbG93KHRoaXMuc2xvdygpKTtcbiAgaG9vay5jdHggPSB0aGlzLmN0eDtcbiAgdGhpcy5fYWZ0ZXJFYWNoLnB1c2goaG9vayk7XG4gIHRoaXMuZW1pdCgnYWZ0ZXJFYWNoJywgaG9vayk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSB0ZXN0IGBzdWl0ZWAuXG4gKlxuICogQHBhcmFtIHtTdWl0ZX0gc3VpdGVcbiAqIEByZXR1cm4ge1N1aXRlfSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblN1aXRlLnByb3RvdHlwZS5hZGRTdWl0ZSA9IGZ1bmN0aW9uKHN1aXRlKXtcbiAgc3VpdGUucGFyZW50ID0gdGhpcztcbiAgc3VpdGUudGltZW91dCh0aGlzLnRpbWVvdXQoKSk7XG4gIHN1aXRlLmVuYWJsZVRpbWVvdXRzKHRoaXMuZW5hYmxlVGltZW91dHMoKSk7XG4gIHN1aXRlLnNsb3codGhpcy5zbG93KCkpO1xuICBzdWl0ZS5iYWlsKHRoaXMuYmFpbCgpKTtcbiAgdGhpcy5zdWl0ZXMucHVzaChzdWl0ZSk7XG4gIHRoaXMuZW1pdCgnc3VpdGUnLCBzdWl0ZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSBgdGVzdGAgdG8gdGhpcyBzdWl0ZS5cbiAqXG4gKiBAcGFyYW0ge1Rlc3R9IHRlc3RcbiAqIEByZXR1cm4ge1N1aXRlfSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblN1aXRlLnByb3RvdHlwZS5hZGRUZXN0ID0gZnVuY3Rpb24odGVzdCl7XG4gIHRlc3QucGFyZW50ID0gdGhpcztcbiAgdGVzdC50aW1lb3V0KHRoaXMudGltZW91dCgpKTtcbiAgdGVzdC5lbmFibGVUaW1lb3V0cyh0aGlzLmVuYWJsZVRpbWVvdXRzKCkpO1xuICB0ZXN0LnNsb3codGhpcy5zbG93KCkpO1xuICB0ZXN0LmN0eCA9IHRoaXMuY3R4O1xuICB0aGlzLnRlc3RzLnB1c2godGVzdCk7XG4gIHRoaXMuZW1pdCgndGVzdCcsIHRlc3QpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIHRoZSBmdWxsIHRpdGxlIGdlbmVyYXRlZCBieSByZWN1cnNpdmVseVxuICogY29uY2F0ZW5hdGluZyB0aGUgcGFyZW50J3MgZnVsbCB0aXRsZS5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblN1aXRlLnByb3RvdHlwZS5mdWxsVGl0bGUgPSBmdW5jdGlvbigpe1xuICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICB2YXIgZnVsbCA9IHRoaXMucGFyZW50LmZ1bGxUaXRsZSgpO1xuICAgIGlmIChmdWxsKSByZXR1cm4gZnVsbCArICcgJyArIHRoaXMudGl0bGU7XG4gIH1cbiAgcmV0dXJuIHRoaXMudGl0bGU7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgdG90YWwgbnVtYmVyIG9mIHRlc3RzLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuU3VpdGUucHJvdG90eXBlLnRvdGFsID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHV0aWxzLnJlZHVjZSh0aGlzLnN1aXRlcywgZnVuY3Rpb24oc3VtLCBzdWl0ZSl7XG4gICAgcmV0dXJuIHN1bSArIHN1aXRlLnRvdGFsKCk7XG4gIH0sIDApICsgdGhpcy50ZXN0cy5sZW5ndGg7XG59O1xuXG4vKipcbiAqIEl0ZXJhdGVzIHRocm91Z2ggZWFjaCBzdWl0ZSByZWN1cnNpdmVseSB0byBmaW5kXG4gKiBhbGwgdGVzdHMuIEFwcGxpZXMgYSBmdW5jdGlvbiBpbiB0aGUgZm9ybWF0XG4gKiBgZm4odGVzdClgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtTdWl0ZX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblN1aXRlLnByb3RvdHlwZS5lYWNoVGVzdCA9IGZ1bmN0aW9uKGZuKXtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLnRlc3RzLCBmbik7XG4gIHV0aWxzLmZvckVhY2godGhpcy5zdWl0ZXMsIGZ1bmN0aW9uKHN1aXRlKXtcbiAgICBzdWl0ZS5lYWNoVGVzdChmbik7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbn0pOyAvLyBtb2R1bGU6IHN1aXRlLmpzXG5cbnJlcXVpcmUucmVnaXN0ZXIoXCJ0ZXN0LmpzXCIsIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSl7XG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgUnVubmFibGUgPSByZXF1aXJlKCcuL3J1bm5hYmxlJyk7XG5cbi8qKlxuICogRXhwb3NlIGBUZXN0YC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRlc3Q7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgVGVzdGAgd2l0aCB0aGUgZ2l2ZW4gYHRpdGxlYCBhbmQgY2FsbGJhY2sgYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGl0bGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBUZXN0KHRpdGxlLCBmbikge1xuICBSdW5uYWJsZS5jYWxsKHRoaXMsIHRpdGxlLCBmbik7XG4gIHRoaXMucGVuZGluZyA9ICFmbjtcbiAgdGhpcy50eXBlID0gJ3Rlc3QnO1xufVxuXG4vKipcbiAqIEluaGVyaXQgZnJvbSBgUnVubmFibGUucHJvdG90eXBlYC5cbiAqL1xuXG5mdW5jdGlvbiBGKCl7fTtcbkYucHJvdG90eXBlID0gUnVubmFibGUucHJvdG90eXBlO1xuVGVzdC5wcm90b3R5cGUgPSBuZXcgRjtcblRlc3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVGVzdDtcblxuXG59KTsgLy8gbW9kdWxlOiB0ZXN0LmpzXG5cbnJlcXVpcmUucmVnaXN0ZXIoXCJ1dGlscy5qc1wiLCBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUpe1xuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBmcyA9IHJlcXVpcmUoJ2Jyb3dzZXIvZnMnKVxuICAsIHBhdGggPSByZXF1aXJlKCdicm93c2VyL3BhdGgnKVxuICAsIGpvaW4gPSBwYXRoLmpvaW5cbiAgLCBkZWJ1ZyA9IHJlcXVpcmUoJ2Jyb3dzZXIvZGVidWcnKSgnbW9jaGE6d2F0Y2gnKTtcblxuLyoqXG4gKiBJZ25vcmVkIGRpcmVjdG9yaWVzLlxuICovXG5cbnZhciBpZ25vcmUgPSBbJ25vZGVfbW9kdWxlcycsICcuZ2l0J107XG5cbi8qKlxuICogRXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGh0bWwuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZSA9IGZ1bmN0aW9uKGh0bWwpe1xuICByZXR1cm4gU3RyaW5nKGh0bWwpXG4gICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG59O1xuXG4vKipcbiAqIEFycmF5I2ZvckVhY2ggKDw9SUU4KVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IHNjb3BlXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmZvckVhY2ggPSBmdW5jdGlvbihhcnIsIGZuLCBzY29wZSl7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICBmbi5jYWxsKHNjb3BlLCBhcnJbaV0sIGkpO1xufTtcblxuLyoqXG4gKiBBcnJheSNtYXAgKDw9SUU4KVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IHNjb3BlXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLm1hcCA9IGZ1bmN0aW9uKGFyciwgZm4sIHNjb3BlKXtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgcmVzdWx0LnB1c2goZm4uY2FsbChzY29wZSwgYXJyW2ldLCBpKSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEFycmF5I2luZGV4T2YgKDw9SUU4KVxuICpcbiAqIEBwYXJtYSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHtPYmplY3R9IG9iaiB0byBmaW5kIGluZGV4IG9mXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhcnRcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuaW5kZXhPZiA9IGZ1bmN0aW9uKGFyciwgb2JqLCBzdGFydCl7XG4gIGZvciAodmFyIGkgPSBzdGFydCB8fCAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChhcnJbaV0gPT09IG9iailcbiAgICAgIHJldHVybiBpO1xuICB9XG4gIHJldHVybiAtMTtcbn07XG5cbi8qKlxuICogQXJyYXkjcmVkdWNlICg8PUlFOClcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBpbml0aWFsIHZhbHVlXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnJlZHVjZSA9IGZ1bmN0aW9uKGFyciwgZm4sIHZhbCl7XG4gIHZhciBydmFsID0gdmFsO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHJ2YWwgPSBmbihydmFsLCBhcnJbaV0sIGksIGFycik7XG4gIH1cblxuICByZXR1cm4gcnZhbDtcbn07XG5cbi8qKlxuICogQXJyYXkjZmlsdGVyICg8PUlFOClcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuZmlsdGVyID0gZnVuY3Rpb24oYXJyLCBmbil7XG4gIHZhciByZXQgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YXIgdmFsID0gYXJyW2ldO1xuICAgIGlmIChmbih2YWwsIGksIGFycikpIHJldC5wdXNoKHZhbCk7XG4gIH1cblxuICByZXR1cm4gcmV0O1xufTtcblxuLyoqXG4gKiBPYmplY3Qua2V5cyAoPD1JRTgpXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7QXJyYXl9IGtleXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMua2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uKG9iaikge1xuICB2YXIga2V5cyA9IFtdXG4gICAgLCBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5IC8vIGZvciBgd2luZG93YCBvbiA8PUlFOFxuXG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzLmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn07XG5cbi8qKlxuICogV2F0Y2ggdGhlIGdpdmVuIGBmaWxlc2AgZm9yIGNoYW5nZXNcbiAqIGFuZCBpbnZva2UgYGZuKGZpbGUpYCBvbiBtb2RpZmljYXRpb24uXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZmlsZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLndhdGNoID0gZnVuY3Rpb24oZmlsZXMsIGZuKXtcbiAgdmFyIG9wdGlvbnMgPSB7IGludGVydmFsOiAxMDAgfTtcbiAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbihmaWxlKXtcbiAgICBkZWJ1ZygnZmlsZSAlcycsIGZpbGUpO1xuICAgIGZzLndhdGNoRmlsZShmaWxlLCBvcHRpb25zLCBmdW5jdGlvbihjdXJyLCBwcmV2KXtcbiAgICAgIGlmIChwcmV2Lm10aW1lIDwgY3Vyci5tdGltZSkgZm4oZmlsZSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBJZ25vcmVkIGZpbGVzLlxuICovXG5cbmZ1bmN0aW9uIGlnbm9yZWQocGF0aCl7XG4gIHJldHVybiAhfmlnbm9yZS5pbmRleE9mKHBhdGgpO1xufVxuXG4vKipcbiAqIExvb2t1cCBmaWxlcyBpbiB0aGUgZ2l2ZW4gYGRpcmAuXG4gKlxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmZpbGVzID0gZnVuY3Rpb24oZGlyLCBleHQsIHJldCl7XG4gIHJldCA9IHJldCB8fCBbXTtcbiAgZXh0ID0gZXh0IHx8IFsnanMnXTtcblxuICB2YXIgcmUgPSBuZXcgUmVnRXhwKCdcXFxcLignICsgZXh0LmpvaW4oJ3wnKSArICcpJCcpO1xuXG4gIGZzLnJlYWRkaXJTeW5jKGRpcilcbiAgLmZpbHRlcihpZ25vcmVkKVxuICAuZm9yRWFjaChmdW5jdGlvbihwYXRoKXtcbiAgICBwYXRoID0gam9pbihkaXIsIHBhdGgpO1xuICAgIGlmIChmcy5zdGF0U3luYyhwYXRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICBleHBvcnRzLmZpbGVzKHBhdGgsIGV4dCwgcmV0KTtcbiAgICB9IGVsc2UgaWYgKHBhdGgubWF0Y2gocmUpKSB7XG4gICAgICByZXQucHVzaChwYXRoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiByZXQ7XG59O1xuXG4vKipcbiAqIENvbXB1dGUgYSBzbHVnIGZyb20gdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuc2x1ZyA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHJcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC5yZXBsYWNlKC8gKy9nLCAnLScpXG4gICAgLnJlcGxhY2UoL1teLVxcd10vZywgJycpO1xufTtcblxuLyoqXG4gKiBTdHJpcCB0aGUgZnVuY3Rpb24gZGVmaW5pdGlvbiBmcm9tIGBzdHJgLFxuICogYW5kIHJlLWluZGVudCBmb3IgcHJlIHdoaXRlc3BhY2UuXG4gKi9cblxuZXhwb3J0cy5jbGVhbiA9IGZ1bmN0aW9uKHN0cikge1xuICBzdHIgPSBzdHJcbiAgICAucmVwbGFjZSgvXFxyXFxuP3xbXFxuXFx1MjAyOFxcdTIwMjldL2csIFwiXFxuXCIpLnJlcGxhY2UoL15cXHVGRUZGLywgJycpXG4gICAgLnJlcGxhY2UoL15mdW5jdGlvbiAqXFwoLipcXCkgKnt8XFwoLipcXCkgKj0+ICp7Py8sICcnKVxuICAgIC5yZXBsYWNlKC9cXHMrXFx9JC8sICcnKTtcblxuICB2YXIgc3BhY2VzID0gc3RyLm1hdGNoKC9eXFxuPyggKikvKVsxXS5sZW5ndGhcbiAgICAsIHRhYnMgPSBzdHIubWF0Y2goL15cXG4/KFxcdCopLylbMV0ubGVuZ3RoXG4gICAgLCByZSA9IG5ldyBSZWdFeHAoJ15cXG4/JyArICh0YWJzID8gJ1xcdCcgOiAnICcpICsgJ3snICsgKHRhYnMgPyB0YWJzIDogc3BhY2VzKSArICd9JywgJ2dtJyk7XG5cbiAgc3RyID0gc3RyLnJlcGxhY2UocmUsICcnKTtcblxuICByZXR1cm4gZXhwb3J0cy50cmltKHN0cik7XG59O1xuXG4vKipcbiAqIEVzY2FwZSByZWd1bGFyIGV4cHJlc3Npb24gY2hhcmFjdGVycyBpbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZVJlZ2V4cCA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvWy1cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCBcIlxcXFwkJlwiKTtcbn07XG5cbi8qKlxuICogVHJpbSB0aGUgZ2l2ZW4gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy50cmltID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBgcXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBxc1xuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5wYXJzZVF1ZXJ5ID0gZnVuY3Rpb24ocXMpe1xuICByZXR1cm4gZXhwb3J0cy5yZWR1Y2UocXMucmVwbGFjZSgnPycsICcnKS5zcGxpdCgnJicpLCBmdW5jdGlvbihvYmosIHBhaXIpe1xuICAgIHZhciBpID0gcGFpci5pbmRleE9mKCc9JylcbiAgICAgICwga2V5ID0gcGFpci5zbGljZSgwLCBpKVxuICAgICAgLCB2YWwgPSBwYWlyLnNsaWNlKCsraSk7XG5cbiAgICBvYmpba2V5XSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWwpO1xuICAgIHJldHVybiBvYmo7XG4gIH0sIHt9KTtcbn07XG5cbi8qKlxuICogSGlnaGxpZ2h0IHRoZSBnaXZlbiBzdHJpbmcgb2YgYGpzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ganNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGhpZ2hsaWdodChqcykge1xuICByZXR1cm4ganNcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgIC5yZXBsYWNlKC9cXC9cXC8oLiopL2dtLCAnPHNwYW4gY2xhc3M9XCJjb21tZW50XCI+Ly8kMTwvc3Bhbj4nKVxuICAgIC5yZXBsYWNlKC8oJy4qPycpL2dtLCAnPHNwYW4gY2xhc3M9XCJzdHJpbmdcIj4kMTwvc3Bhbj4nKVxuICAgIC5yZXBsYWNlKC8oXFxkK1xcLlxcZCspL2dtLCAnPHNwYW4gY2xhc3M9XCJudW1iZXJcIj4kMTwvc3Bhbj4nKVxuICAgIC5yZXBsYWNlKC8oXFxkKykvZ20sICc8c3BhbiBjbGFzcz1cIm51bWJlclwiPiQxPC9zcGFuPicpXG4gICAgLnJlcGxhY2UoL1xcYm5ld1sgXFx0XSsoXFx3KykvZ20sICc8c3BhbiBjbGFzcz1cImtleXdvcmRcIj5uZXc8L3NwYW4+IDxzcGFuIGNsYXNzPVwiaW5pdFwiPiQxPC9zcGFuPicpXG4gICAgLnJlcGxhY2UoL1xcYihmdW5jdGlvbnxuZXd8dGhyb3d8cmV0dXJufHZhcnxpZnxlbHNlKVxcYi9nbSwgJzxzcGFuIGNsYXNzPVwia2V5d29yZFwiPiQxPC9zcGFuPicpXG59XG5cbi8qKlxuICogSGlnaGxpZ2h0IHRoZSBjb250ZW50cyBvZiB0YWcgYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmhpZ2hsaWdodFRhZ3MgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBjb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUobmFtZSk7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgY29kZVtpXS5pbm5lckhUTUwgPSBoaWdobGlnaHQoY29kZVtpXS5pbm5lckhUTUwpO1xuICB9XG59O1xuXG5cbi8qKlxuICogU3RyaW5naWZ5IGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuc3RyaW5naWZ5ID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmIChvYmogaW5zdGFuY2VvZiBSZWdFeHApIHJldHVybiBvYmoudG9TdHJpbmcoKTtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGV4cG9ydHMuY2Fub25pY2FsaXplKG9iaiksIG51bGwsIDIpLnJlcGxhY2UoLywoXFxufCQpL2csICckMScpO1xufVxuXG4vKipcbiAqIFJldHVybiBhIG5ldyBvYmplY3QgdGhhdCBoYXMgdGhlIGtleXMgaW4gc29ydGVkIG9yZGVyLlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5jYW5vbmljYWxpemUgPSBmdW5jdGlvbihvYmosIHN0YWNrKSB7XG4gICBzdGFjayA9IHN0YWNrIHx8IFtdO1xuXG4gICBpZiAoZXhwb3J0cy5pbmRleE9mKHN0YWNrLCBvYmopICE9PSAtMSkgcmV0dXJuICdbQ2lyY3VsYXJdJztcblxuICAgdmFyIGNhbm9uaWNhbGl6ZWRPYmo7XG5cbiAgIGlmICh7fS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgc3RhY2sucHVzaChvYmopO1xuICAgICBjYW5vbmljYWxpemVkT2JqID0gZXhwb3J0cy5tYXAob2JqLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgcmV0dXJuIGV4cG9ydHMuY2Fub25pY2FsaXplKGl0ZW0sIHN0YWNrKTtcbiAgICAgfSk7XG4gICAgIHN0YWNrLnBvcCgpO1xuICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGwpIHtcbiAgICAgc3RhY2sucHVzaChvYmopO1xuICAgICBjYW5vbmljYWxpemVkT2JqID0ge307XG4gICAgIGV4cG9ydHMuZm9yRWFjaChleHBvcnRzLmtleXMob2JqKS5zb3J0KCksIGZ1bmN0aW9uKGtleSkge1xuICAgICAgIGNhbm9uaWNhbGl6ZWRPYmpba2V5XSA9IGV4cG9ydHMuY2Fub25pY2FsaXplKG9ialtrZXldLCBzdGFjayk7XG4gICAgIH0pO1xuICAgICBzdGFjay5wb3AoKTtcbiAgIH0gZWxzZSB7XG4gICAgIGNhbm9uaWNhbGl6ZWRPYmogPSBvYmo7XG4gICB9XG5cbiAgIHJldHVybiBjYW5vbmljYWxpemVkT2JqO1xuIH1cblxufSk7IC8vIG1vZHVsZTogdXRpbHMuanNcbi8vIFRoZSBnbG9iYWwgb2JqZWN0IGlzIFwic2VsZlwiIGluIFdlYiBXb3JrZXJzLlxudmFyIGdsb2JhbCA9IChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pKCk7XG5cbi8qKlxuICogU2F2ZSB0aW1lciByZWZlcmVuY2VzIHRvIGF2b2lkIFNpbm9uIGludGVyZmVyaW5nIChzZWUgR0gtMjM3KS5cbiAqL1xuXG52YXIgRGF0ZSA9IGdsb2JhbC5EYXRlO1xudmFyIHNldFRpbWVvdXQgPSBnbG9iYWwuc2V0VGltZW91dDtcbnZhciBzZXRJbnRlcnZhbCA9IGdsb2JhbC5zZXRJbnRlcnZhbDtcbnZhciBjbGVhclRpbWVvdXQgPSBnbG9iYWwuY2xlYXJUaW1lb3V0O1xudmFyIGNsZWFySW50ZXJ2YWwgPSBnbG9iYWwuY2xlYXJJbnRlcnZhbDtcblxuLyoqXG4gKiBOb2RlIHNoaW1zLlxuICpcbiAqIFRoZXNlIGFyZSBtZWFudCBvbmx5IHRvIGFsbG93XG4gKiBtb2NoYS5qcyB0byBydW4gdW50b3VjaGVkLCBub3RcbiAqIHRvIGFsbG93IHJ1bm5pbmcgbm9kZSBjb2RlIGluXG4gKiB0aGUgYnJvd3Nlci5cbiAqL1xuXG52YXIgcHJvY2VzcyA9IHt9O1xucHJvY2Vzcy5leGl0ID0gZnVuY3Rpb24oc3RhdHVzKXt9O1xucHJvY2Vzcy5zdGRvdXQgPSB7fTtcblxudmFyIHVuY2F1Z2h0RXhjZXB0aW9uSGFuZGxlcnMgPSBbXTtcblxudmFyIG9yaWdpbmFsT25lcnJvckhhbmRsZXIgPSBnbG9iYWwub25lcnJvcjtcblxuLyoqXG4gKiBSZW1vdmUgdW5jYXVnaHRFeGNlcHRpb24gbGlzdGVuZXIuXG4gKiBSZXZlcnQgdG8gb3JpZ2luYWwgb25lcnJvciBoYW5kbGVyIGlmIHByZXZpb3VzbHkgZGVmaW5lZC5cbiAqL1xuXG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oZSwgZm4pe1xuICBpZiAoJ3VuY2F1Z2h0RXhjZXB0aW9uJyA9PSBlKSB7XG4gICAgaWYgKG9yaWdpbmFsT25lcnJvckhhbmRsZXIpIHtcbiAgICAgIGdsb2JhbC5vbmVycm9yID0gb3JpZ2luYWxPbmVycm9ySGFuZGxlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2xvYmFsLm9uZXJyb3IgPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgICB2YXIgaSA9IE1vY2hhLnV0aWxzLmluZGV4T2YodW5jYXVnaHRFeGNlcHRpb25IYW5kbGVycywgZm4pO1xuICAgIGlmIChpICE9IC0xKSB7IHVuY2F1Z2h0RXhjZXB0aW9uSGFuZGxlcnMuc3BsaWNlKGksIDEpOyB9XG4gIH1cbn07XG5cbi8qKlxuICogSW1wbGVtZW50cyB1bmNhdWdodEV4Y2VwdGlvbiBsaXN0ZW5lci5cbiAqL1xuXG5wcm9jZXNzLm9uID0gZnVuY3Rpb24oZSwgZm4pe1xuICBpZiAoJ3VuY2F1Z2h0RXhjZXB0aW9uJyA9PSBlKSB7XG4gICAgZ2xvYmFsLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIsIHVybCwgbGluZSl7XG4gICAgICBmbihuZXcgRXJyb3IoZXJyICsgJyAoJyArIHVybCArICc6JyArIGxpbmUgKyAnKScpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgdW5jYXVnaHRFeGNlcHRpb25IYW5kbGVycy5wdXNoKGZuKTtcbiAgfVxufTtcblxuLyoqXG4gKiBFeHBvc2UgbW9jaGEuXG4gKi9cblxudmFyIE1vY2hhID0gZ2xvYmFsLk1vY2hhID0gcmVxdWlyZSgnbW9jaGEnKSxcbiAgICBtb2NoYSA9IGdsb2JhbC5tb2NoYSA9IG5ldyBNb2NoYSh7IHJlcG9ydGVyOiAnaHRtbCcgfSk7XG5cbi8vIFRoZSBCREQgVUkgaXMgcmVnaXN0ZXJlZCBieSBkZWZhdWx0LCBidXQgbm8gVUkgd2lsbCBiZSBmdW5jdGlvbmFsIGluIHRoZVxuLy8gYnJvd3NlciB3aXRob3V0IGFuIGV4cGxpY2l0IGNhbGwgdG8gdGhlIG92ZXJyaWRkZW4gYG1vY2hhLnVpYCAoc2VlIGJlbG93KS5cbi8vIEVuc3VyZSB0aGF0IHRoaXMgZGVmYXVsdCBVSSBkb2VzIG5vdCBleHBvc2UgaXRzIG1ldGhvZHMgdG8gdGhlIGdsb2JhbCBzY29wZS5cbm1vY2hhLnN1aXRlLnJlbW92ZUFsbExpc3RlbmVycygncHJlLXJlcXVpcmUnKTtcblxudmFyIGltbWVkaWF0ZVF1ZXVlID0gW11cbiAgLCBpbW1lZGlhdGVUaW1lb3V0O1xuXG5mdW5jdGlvbiB0aW1lc2xpY2UoKSB7XG4gIHZhciBpbW1lZGlhdGVTdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB3aGlsZSAoaW1tZWRpYXRlUXVldWUubGVuZ3RoICYmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGltbWVkaWF0ZVN0YXJ0KSA8IDEwMCkge1xuICAgIGltbWVkaWF0ZVF1ZXVlLnNoaWZ0KCkoKTtcbiAgfVxuICBpZiAoaW1tZWRpYXRlUXVldWUubGVuZ3RoKSB7XG4gICAgaW1tZWRpYXRlVGltZW91dCA9IHNldFRpbWVvdXQodGltZXNsaWNlLCAwKTtcbiAgfSBlbHNlIHtcbiAgICBpbW1lZGlhdGVUaW1lb3V0ID0gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIEhpZ2gtcGVyZm9ybWFuY2Ugb3ZlcnJpZGUgb2YgUnVubmVyLmltbWVkaWF0ZWx5LlxuICovXG5cbk1vY2hhLlJ1bm5lci5pbW1lZGlhdGVseSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIGltbWVkaWF0ZVF1ZXVlLnB1c2goY2FsbGJhY2spO1xuICBpZiAoIWltbWVkaWF0ZVRpbWVvdXQpIHtcbiAgICBpbW1lZGlhdGVUaW1lb3V0ID0gc2V0VGltZW91dCh0aW1lc2xpY2UsIDApO1xuICB9XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGFsbG93IGFzc2VydGlvbiBsaWJyYXJpZXMgdG8gdGhyb3cgZXJyb3JzIGRpcmVjdGx5IGludG8gbW9jaGEuXG4gKiBUaGlzIGlzIHVzZWZ1bCB3aGVuIHJ1bm5pbmcgdGVzdHMgaW4gYSBicm93c2VyIGJlY2F1c2Ugd2luZG93Lm9uZXJyb3Igd2lsbFxuICogb25seSByZWNlaXZlIHRoZSAnbWVzc2FnZScgYXR0cmlidXRlIG9mIHRoZSBFcnJvci5cbiAqL1xubW9jaGEudGhyb3dFcnJvciA9IGZ1bmN0aW9uKGVycikge1xuICBNb2NoYS51dGlscy5mb3JFYWNoKHVuY2F1Z2h0RXhjZXB0aW9uSGFuZGxlcnMsIGZ1bmN0aW9uIChmbikge1xuICAgIGZuKGVycik7XG4gIH0pO1xuICB0aHJvdyBlcnI7XG59O1xuXG4vKipcbiAqIE92ZXJyaWRlIHVpIHRvIGVuc3VyZSB0aGF0IHRoZSB1aSBmdW5jdGlvbnMgYXJlIGluaXRpYWxpemVkLlxuICogTm9ybWFsbHkgdGhpcyB3b3VsZCBoYXBwZW4gaW4gTW9jaGEucHJvdG90eXBlLmxvYWRGaWxlcy5cbiAqL1xuXG5tb2NoYS51aSA9IGZ1bmN0aW9uKHVpKXtcbiAgTW9jaGEucHJvdG90eXBlLnVpLmNhbGwodGhpcywgdWkpO1xuICB0aGlzLnN1aXRlLmVtaXQoJ3ByZS1yZXF1aXJlJywgZ2xvYmFsLCBudWxsLCB0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldHVwIG1vY2hhIHdpdGggdGhlIGdpdmVuIHNldHRpbmcgb3B0aW9ucy5cbiAqL1xuXG5tb2NoYS5zZXR1cCA9IGZ1bmN0aW9uKG9wdHMpe1xuICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIG9wdHMpIG9wdHMgPSB7IHVpOiBvcHRzIH07XG4gIGZvciAodmFyIG9wdCBpbiBvcHRzKSB0aGlzW29wdF0ob3B0c1tvcHRdKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJ1biBtb2NoYSwgcmV0dXJuaW5nIHRoZSBSdW5uZXIuXG4gKi9cblxubW9jaGEucnVuID0gZnVuY3Rpb24oZm4pe1xuICB2YXIgb3B0aW9ucyA9IG1vY2hhLm9wdGlvbnM7XG4gIG1vY2hhLmdsb2JhbHMoJ2xvY2F0aW9uJyk7XG5cbiAgdmFyIHF1ZXJ5ID0gTW9jaGEudXRpbHMucGFyc2VRdWVyeShnbG9iYWwubG9jYXRpb24uc2VhcmNoIHx8ICcnKTtcbiAgaWYgKHF1ZXJ5LmdyZXApIG1vY2hhLmdyZXAocXVlcnkuZ3JlcCk7XG4gIGlmIChxdWVyeS5pbnZlcnQpIG1vY2hhLmludmVydCgpO1xuXG4gIHJldHVybiBNb2NoYS5wcm90b3R5cGUucnVuLmNhbGwobW9jaGEsIGZ1bmN0aW9uKGVycil7XG4gICAgLy8gVGhlIERPTSBEb2N1bWVudCBpcyBub3QgYXZhaWxhYmxlIGluIFdlYiBXb3JrZXJzLlxuICAgIGlmIChnbG9iYWwuZG9jdW1lbnQpIHtcbiAgICAgIE1vY2hhLnV0aWxzLmhpZ2hsaWdodFRhZ3MoJ2NvZGUnKTtcbiAgICB9XG4gICAgaWYgKGZuKSBmbihlcnIpO1xuICB9KTtcbn07XG5cbi8qKlxuICogRXhwb3NlIHRoZSBwcm9jZXNzIHNoaW0uXG4gKi9cblxuTW9jaGEucHJvY2VzcyA9IHByb2Nlc3M7XG59KSgpOyIsIkBjaGFyc2V0IFwidXRmLThcIjtcblxuYm9keSB7XG4gIG1hcmdpbjowO1xufVxuXG4jbW9jaGEge1xuICBmb250OiAyMHB4LzEuNSBcIkhlbHZldGljYSBOZXVlXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XG4gIG1hcmdpbjogNjBweCA1MHB4O1xufVxuXG4jbW9jaGEgdWwsXG4jbW9jaGEgbGkge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbiNtb2NoYSB1bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG5cbiNtb2NoYSBoMSxcbiNtb2NoYSBoMiB7XG4gIG1hcmdpbjogMDtcbn1cblxuI21vY2hhIGgxIHtcbiAgbWFyZ2luLXRvcDogMTVweDtcbiAgZm9udC1zaXplOiAxZW07XG4gIGZvbnQtd2VpZ2h0OiAyMDA7XG59XG5cbiNtb2NoYSBoMSBhIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjb2xvcjogaW5oZXJpdDtcbn1cblxuI21vY2hhIGgxIGE6aG92ZXIge1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn1cblxuI21vY2hhIC5zdWl0ZSAuc3VpdGUgaDEge1xuICBtYXJnaW4tdG9wOiAwO1xuICBmb250LXNpemU6IC44ZW07XG59XG5cbiNtb2NoYSAuaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuI21vY2hhIGgyIHtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbiNtb2NoYSAuc3VpdGUge1xuICBtYXJnaW4tbGVmdDogMTVweDtcbn1cblxuI21vY2hhIC50ZXN0IHtcbiAgbWFyZ2luLWxlZnQ6IDE1cHg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbiNtb2NoYSAudGVzdC5wZW5kaW5nOmhvdmVyIGgyOjphZnRlciB7XG4gIGNvbnRlbnQ6ICcocGVuZGluZyknO1xuICBmb250LWZhbWlseTogYXJpYWwsIHNhbnMtc2VyaWY7XG59XG5cbiNtb2NoYSAudGVzdC5wYXNzLm1lZGl1bSAuZHVyYXRpb24ge1xuICBiYWNrZ3JvdW5kOiAjYzA5ODUzO1xufVxuXG4jbW9jaGEgLnRlc3QucGFzcy5zbG93IC5kdXJhdGlvbiB7XG4gIGJhY2tncm91bmQ6ICNiOTRhNDg7XG59XG5cbiNtb2NoYSAudGVzdC5wYXNzOjpiZWZvcmUge1xuICBjb250ZW50OiAn4pyTJztcbiAgZm9udC1zaXplOiAxMnB4O1xuICBkaXNwbGF5OiBibG9jaztcbiAgZmxvYXQ6IGxlZnQ7XG4gIG1hcmdpbi1yaWdodDogNXB4O1xuICBjb2xvcjogIzAwZDZiMjtcbn1cblxuI21vY2hhIC50ZXN0LnBhc3MgLmR1cmF0aW9uIHtcbiAgZm9udC1zaXplOiA5cHg7XG4gIG1hcmdpbi1sZWZ0OiA1cHg7XG4gIHBhZGRpbmc6IDJweCA1cHg7XG4gIGNvbG9yOiAjZmZmO1xuICAtd2Via2l0LWJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLC4yKTtcbiAgLW1vei1ib3gtc2hhZG93OiBpbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwuMik7XG4gIGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLC4yKTtcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiA1cHg7XG4gIC1tb3otYm9yZGVyLXJhZGl1czogNXB4O1xuICAtbXMtYm9yZGVyLXJhZGl1czogNXB4O1xuICAtby1ib3JkZXItcmFkaXVzOiA1cHg7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbn1cblxuI21vY2hhIC50ZXN0LnBhc3MuZmFzdCAuZHVyYXRpb24ge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4jbW9jaGEgLnRlc3QucGVuZGluZyB7XG4gIGNvbG9yOiAjMGI5N2M0O1xufVxuXG4jbW9jaGEgLnRlc3QucGVuZGluZzo6YmVmb3JlIHtcbiAgY29udGVudDogJ+KXpic7XG4gIGNvbG9yOiAjMGI5N2M0O1xufVxuXG4jbW9jaGEgLnRlc3QuZmFpbCB7XG4gIGNvbG9yOiAjYzAwO1xufVxuXG4jbW9jaGEgLnRlc3QuZmFpbCBwcmUge1xuICBjb2xvcjogYmxhY2s7XG59XG5cbiNtb2NoYSAudGVzdC5mYWlsOjpiZWZvcmUge1xuICBjb250ZW50OiAn4pyWJztcbiAgZm9udC1zaXplOiAxMnB4O1xuICBkaXNwbGF5OiBibG9jaztcbiAgZmxvYXQ6IGxlZnQ7XG4gIG1hcmdpbi1yaWdodDogNXB4O1xuICBjb2xvcjogI2MwMDtcbn1cblxuI21vY2hhIC50ZXN0IHByZS5lcnJvciB7XG4gIGNvbG9yOiAjYzAwO1xuICBtYXgtaGVpZ2h0OiAzMDBweDtcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbi8qKlxuICogKDEpOiBhcHByb3hpbWF0ZSBmb3IgYnJvd3NlcnMgbm90IHN1cHBvcnRpbmcgY2FsY1xuICogKDIpOiA0MiA9IDIqMTUgKyAyKjEwICsgMioxIChwYWRkaW5nICsgbWFyZ2luICsgYm9yZGVyKVxuICogICAgICBeXiBzZXJpb3VzbHlcbiAqL1xuI21vY2hhIC50ZXN0IHByZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBmbG9hdDogbGVmdDtcbiAgY2xlYXI6IGxlZnQ7XG4gIGZvbnQ6IDEycHgvMS41IG1vbmFjbywgbW9ub3NwYWNlO1xuICBtYXJnaW46IDVweDtcbiAgcGFkZGluZzogMTVweDtcbiAgYm9yZGVyOiAxcHggc29saWQgI2VlZTtcbiAgbWF4LXdpZHRoOiA4NSU7IC8qKDEpKi9cbiAgbWF4LXdpZHRoOiBjYWxjKDEwMCUgLSA0MnB4KTsgLyooMikqL1xuICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XG4gIGJvcmRlci1ib3R0b20tY29sb3I6ICNkZGQ7XG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogM3B4O1xuICAtd2Via2l0LWJveC1zaGFkb3c6IDAgMXB4IDNweCAjZWVlO1xuICAtbW96LWJvcmRlci1yYWRpdXM6IDNweDtcbiAgLW1vei1ib3gtc2hhZG93OiAwIDFweCAzcHggI2VlZTtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xufVxuXG4jbW9jaGEgLnRlc3QgaDIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbiNtb2NoYSAudGVzdCBhLnJlcGxheSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAzcHg7XG4gIHJpZ2h0OiAwO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMTVweDtcbiAgaGVpZ2h0OiAxNXB4O1xuICBsaW5lLWhlaWdodDogMTVweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBiYWNrZ3JvdW5kOiAjZWVlO1xuICBmb250LXNpemU6IDE1cHg7XG4gIC1tb3otYm9yZGVyLXJhZGl1czogMTVweDtcbiAgYm9yZGVyLXJhZGl1czogMTVweDtcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBvcGFjaXR5IDIwMG1zO1xuICAtbW96LXRyYW5zaXRpb246IG9wYWNpdHkgMjAwbXM7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMjAwbXM7XG4gIG9wYWNpdHk6IDAuMztcbiAgY29sb3I6ICM4ODg7XG59XG5cbiNtb2NoYSAudGVzdDpob3ZlciBhLnJlcGxheSB7XG4gIG9wYWNpdHk6IDE7XG59XG5cbiNtb2NoYS1yZXBvcnQucGFzcyAudGVzdC5mYWlsIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuI21vY2hhLXJlcG9ydC5mYWlsIC50ZXN0LnBhc3Mge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4jbW9jaGEtcmVwb3J0LnBlbmRpbmcgLnRlc3QucGFzcyxcbiNtb2NoYS1yZXBvcnQucGVuZGluZyAudGVzdC5mYWlsIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbiNtb2NoYS1yZXBvcnQucGVuZGluZyAudGVzdC5wYXNzLnBlbmRpbmcge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuI21vY2hhLWVycm9yIHtcbiAgY29sb3I6ICNjMDA7XG4gIGZvbnQtc2l6ZTogMS41ZW07XG4gIGZvbnQtd2VpZ2h0OiAxMDA7XG4gIGxldHRlci1zcGFjaW5nOiAxcHg7XG59XG5cbiNtb2NoYS1zdGF0cyB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgdG9wOiAxNXB4O1xuICByaWdodDogMTBweDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBtYXJnaW46IDA7XG4gIGNvbG9yOiAjODg4O1xuICB6LWluZGV4OiAxO1xufVxuXG4jbW9jaGEtc3RhdHMgLnByb2dyZXNzIHtcbiAgZmxvYXQ6IHJpZ2h0O1xuICBwYWRkaW5nLXRvcDogMDtcbn1cblxuI21vY2hhLXN0YXRzIGVtIHtcbiAgY29sb3I6IGJsYWNrO1xufVxuXG4jbW9jaGEtc3RhdHMgYSB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgY29sb3I6IGluaGVyaXQ7XG59XG5cbiNtb2NoYS1zdGF0cyBhOmhvdmVyIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlZWU7XG59XG5cbiNtb2NoYS1zdGF0cyBsaSB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWFyZ2luOiAwIDVweDtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbiAgcGFkZGluZy10b3A6IDExcHg7XG59XG5cbiNtb2NoYS1zdGF0cyBjYW52YXMge1xuICB3aWR0aDogNDBweDtcbiAgaGVpZ2h0OiA0MHB4O1xufVxuXG4jbW9jaGEgY29kZSAuY29tbWVudCB7IGNvbG9yOiAjZGRkOyB9XG4jbW9jaGEgY29kZSAuaW5pdCB7IGNvbG9yOiAjMmY2ZmFkOyB9XG4jbW9jaGEgY29kZSAuc3RyaW5nIHsgY29sb3I6ICM1ODkwYWQ7IH1cbiNtb2NoYSBjb2RlIC5rZXl3b3JkIHsgY29sb3I6ICM4YTYzNDM7IH1cbiNtb2NoYSBjb2RlIC5udW1iZXIgeyBjb2xvcjogIzJmNmZhZDsgfVxuXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDogNDgwcHgpIHtcbiAgI21vY2hhIHtcbiAgICBtYXJnaW46IDYwcHggMHB4O1xuICB9XG5cbiAgI21vY2hhICNzdGF0cyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTQgVGhlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIFRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBwb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuLy8gVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdCBwb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuLy8gVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IHBvbHltZXIuZ2l0aHViLmlvL0NPTlRSSUJVVE9SUy50eHRcbi8vIENvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvIHN1YmplY3QgdG9cbi8vIGFuIGFkZGl0aW9uYWwgSVAgcmlnaHRzIGdyYW50IGZvdW5kIGF0IHBvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XG4oZnVuY3Rpb24oc2NvcGUpIHtcbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gcGFyc2Uoc3RhY2spIHtcbiAgdmFyIHJhd0xpbmVzID0gc3RhY2suc3BsaXQoJ1xcbicpO1xuXG4gIHZhciBzdGFja3lMaW5lcyA9IGNvbXBhY3QocmF3TGluZXMubWFwKHBhcnNlU3RhY2t5TGluZSkpO1xuICBpZiAoc3RhY2t5TGluZXMubGVuZ3RoID09PSByYXdMaW5lcy5sZW5ndGgpIHJldHVybiBzdGFja3lMaW5lcztcblxuICB2YXIgdjhMaW5lcyA9IGNvbXBhY3QocmF3TGluZXMubWFwKHBhcnNlVjhMaW5lKSk7XG4gIGlmICh2OExpbmVzLmxlbmd0aCA+IDApIHJldHVybiB2OExpbmVzO1xuXG4gIHZhciBnZWNrb0xpbmVzID0gY29tcGFjdChyYXdMaW5lcy5tYXAocGFyc2VHZWNrb0xpbmUpKTtcbiAgaWYgKGdlY2tvTGluZXMubGVuZ3RoID4gMCkgcmV0dXJuIGdlY2tvTGluZXM7XG5cbiAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHN0YWNrIGZvcm1hdDogJyArIHN0YWNrKTtcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRXJyb3IvU3RhY2tcbnZhciBHRUNLT19MSU5FID0gL14oPzooW15AXSopQCk/KC4qPyk6KFxcZCspKD86OihcXGQrKSk/JC87XG5cbmZ1bmN0aW9uIHBhcnNlR2Vja29MaW5lKGxpbmUpIHtcbiAgdmFyIG1hdGNoID0gbGluZS5tYXRjaChHRUNLT19MSU5FKTtcbiAgaWYgKCFtYXRjaCkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgbWV0aG9kOiAgIG1hdGNoWzFdIHx8ICcnLFxuICAgIGxvY2F0aW9uOiBtYXRjaFsyXSB8fCAnJyxcbiAgICBsaW5lOiAgICAgcGFyc2VJbnQobWF0Y2hbM10pIHx8IDAsXG4gICAgY29sdW1uOiAgIHBhcnNlSW50KG1hdGNoWzRdKSB8fCAwLFxuICB9O1xufVxuXG4vLyBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L3dpa2kvSmF2YVNjcmlwdFN0YWNrVHJhY2VBcGlcbnZhciBWOF9PVVRFUjEgPSAvXlxccyooZXZhbCApP2F0ICguKikgXFwoKC4qKVxcKSQvO1xudmFyIFY4X09VVEVSMiA9IC9eXFxzKmF0KCkoKSAoXFxTKykkLztcbnZhciBWOF9JTk5FUiAgPSAvXlxcKD8oW15cXChdKyk6KFxcZCspOihcXGQrKVxcKT8kLztcblxuZnVuY3Rpb24gcGFyc2VWOExpbmUobGluZSkge1xuICB2YXIgb3V0ZXIgPSBsaW5lLm1hdGNoKFY4X09VVEVSMSkgfHwgbGluZS5tYXRjaChWOF9PVVRFUjIpO1xuICBpZiAoIW91dGVyKSByZXR1cm4gbnVsbDtcbiAgdmFyIGlubmVyID0gb3V0ZXJbM10ubWF0Y2goVjhfSU5ORVIpO1xuICBpZiAoIWlubmVyKSByZXR1cm4gbnVsbDtcblxuICB2YXIgbWV0aG9kID0gb3V0ZXJbMl0gfHwgJyc7XG4gIGlmIChvdXRlclsxXSkgbWV0aG9kID0gJ2V2YWwgYXQgJyArIG1ldGhvZDtcbiAgcmV0dXJuIHtcbiAgICBtZXRob2Q6ICAgbWV0aG9kLFxuICAgIGxvY2F0aW9uOiBpbm5lclsxXSB8fCAnJyxcbiAgICBsaW5lOiAgICAgcGFyc2VJbnQoaW5uZXJbMl0pIHx8IDAsXG4gICAgY29sdW1uOiAgIHBhcnNlSW50KGlubmVyWzNdKSB8fCAwLFxuICB9O1xufVxuXG4vLyBTdGFja3kuZm9ybWF0dGluZy5wcmV0dHlcblxudmFyIFNUQUNLWV9MSU5FID0gL15cXHMqKC4rKSBhdCAoLispOihcXGQrKTooXFxkKykkLztcblxuZnVuY3Rpb24gcGFyc2VTdGFja3lMaW5lKGxpbmUpIHtcbiAgdmFyIG1hdGNoID0gbGluZS5tYXRjaChTVEFDS1lfTElORSk7XG4gIGlmICghbWF0Y2gpIHJldHVybiBudWxsO1xuICByZXR1cm4ge1xuICAgIG1ldGhvZDogICBtYXRjaFsxXSB8fCAnJyxcbiAgICBsb2NhdGlvbjogbWF0Y2hbMl0gfHwgJycsXG4gICAgbGluZTogICAgIHBhcnNlSW50KG1hdGNoWzNdKSB8fCAwLFxuICAgIGNvbHVtbjogICBwYXJzZUludChtYXRjaFs0XSkgfHwgMCxcbiAgfTtcbn1cblxuLy8gSGVscGVyc1xuXG5mdW5jdGlvbiBjb21wYWN0KGFycmF5KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbnNjb3BlLnBhcnNlICAgICAgICAgICA9IHBhcnNlO1xuc2NvcGUucGFyc2VHZWNrb0xpbmUgID0gcGFyc2VHZWNrb0xpbmU7XG5zY29wZS5wYXJzZVY4TGluZSAgICAgPSBwYXJzZVY4TGluZTtcbnNjb3BlLnBhcnNlU3RhY2t5TGluZSA9IHBhcnNlU3RhY2t5TGluZTtcbn0pKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgOiAodGhpcy5TdGFja3kgPSB0aGlzLlN0YWNreSB8fCB7fSkpO1xuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRoZSBQb2x5bWVyIFByb2plY3QgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vXG4vLyBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcbi8vIFRoZSBjb21wbGV0ZSBzZXQgb2YgYXV0aG9ycyBtYXkgYmUgZm91bmQgYXQgcG9seW1lci5naXRodWIuaW8vQVVUSE9SUy50eHRcbi8vIFRoZSBjb21wbGV0ZSBzZXQgb2YgY29udHJpYnV0b3JzIG1heSBiZSBmb3VuZCBhdCBwb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG4vLyBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzbyBzdWJqZWN0IHRvXG4vLyBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBwb2x5bWVyLmdpdGh1Yi5pby9QQVRFTlRTLnR4dFxuKGZ1bmN0aW9uKHNjb3BlKSB7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBwYXJzZSA9IHNjb3BlLnBhcnNlIHx8IHJlcXVpcmUoJy4vcGFyc2luZycpLnBhcnNlO1xuXG5zY29wZS5kZWZhdWx0cyA9IHtcbiAgLy8gTWV0aG9kcyBhcmUgYWxpZ25lZCB1cCB0byB0aGlzIG11Y2ggcGFkZGluZy5cbiAgbWF4TWV0aG9kUGFkZGluZzogNDAsXG4gIC8vIEEgc3RyaW5nIHRvIHByZWZpeCBlYWNoIGxpbmUgd2l0aC5cbiAgaW5kZW50OiAnJyxcbiAgLy8gQSBzdHJpbmcgdG8gc2hvdyBmb3Igc3RhY2sgbGluZXMgdGhhdCBhcmUgbWlzc2luZyBhIG1ldGhvZC5cbiAgbWV0aG9kUGxhY2Vob2xkZXI6ICc8dW5rbm93bj4nLFxuICAvLyBBIGxpc3Qgb2YgU3RyaW5ncy9SZWdFeHBzIHRoYXQgd2lsbCBiZSBzdHJpcHBlZCBmcm9tIGBsb2NhdGlvbmAgdmFsdWVzIG9uXG4gIC8vIGVhY2ggbGluZSAodmlhIGBTdHJpbmcjcmVwbGFjZWApLlxuICBsb2NhdGlvblN0cmlwOiBbXSxcbiAgLy8gQSBsaXN0IG9mIFN0cmluZ3MvUmVnRXhwcyB0aGF0IGluZGljYXRlIHRoYXQgYSBsaW5lIGlzICpub3QqIGltcG9ydGFudCwgYW5kXG4gIC8vIHNob3VsZCBiZSBzdHlsZWQgYXMgc3VjaC5cbiAgdW5pbXBvcnRhbnRMb2NhdGlvbjogW10sXG4gIC8vIEEgZmlsdGVyIGZ1bmN0aW9uIHRvIGNvbXBsZXRlbHkgcmVtb3ZlIGxpbmVzXG4gIGZpbHRlcjogZnVuY3Rpb24oKSB7IHJldHVybiBmYWxzZTsgfSxcbiAgLy8gc3R5bGVzIGFyZSBmdW5jdGlvbnMgdGhhdCB0YWtlIGEgc3RyaW5nIGFuZCByZXR1cm4gdGhhdCBzdHJpbmcgd2hlbiBzdHlsZWQuXG4gIHN0eWxlczoge1xuICAgIG1ldGhvZDogICAgICBwYXNzdGhyb3VnaCxcbiAgICBsb2NhdGlvbjogICAgcGFzc3Rocm91Z2gsXG4gICAgbGluZTogICAgICAgIHBhc3N0aHJvdWdoLFxuICAgIGNvbHVtbjogICAgICBwYXNzdGhyb3VnaCxcbiAgICB1bmltcG9ydGFudDogcGFzc3Rocm91Z2gsXG4gIH0sXG59O1xuXG4vLyBGb3IgU3RhY2t5LWluLU5vZGUsIHdlIGRlZmF1bHQgdG8gY29sb3JlZCBzdGFja3MuXG5pZiAodHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKTtcblxuICBzY29wZS5kZWZhdWx0cy5zdHlsZXMgPSB7XG4gICAgbWV0aG9kOiAgICAgIGNoYWxrLm1hZ2VudGEsXG4gICAgbG9jYXRpb246ICAgIGNoYWxrLmJsdWUsXG4gICAgbGluZTogICAgICAgIGNoYWxrLmN5YW4sXG4gICAgY29sdW1uOiAgICAgIGNoYWxrLmN5YW4sXG4gICAgdW5pbXBvcnRhbnQ6IGNoYWxrLmRpbSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJldHR5KHN0YWNrT3JQYXJzZWQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG1lcmdlRGVmYXVsdHMob3B0aW9ucyB8fCB7fSwgc2NvcGUuZGVmYXVsdHMpO1xuICB2YXIgbGluZXMgPSBBcnJheS5pc0FycmF5KHN0YWNrT3JQYXJzZWQpID8gc3RhY2tPclBhcnNlZCA6IHBhcnNlKHN0YWNrT3JQYXJzZWQpO1xuICBsaW5lcyA9IGNsZWFuKGxpbmVzLCBvcHRpb25zKTtcblxuICB2YXIgcGFkU2l6ZSA9IG1ldGhvZFBhZGRpbmcobGluZXMsIG9wdGlvbnMpO1xuICB2YXIgcGFydHMgPSBsaW5lcy5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgIHZhciBtZXRob2QgICA9IGxpbmUubWV0aG9kIHx8IG9wdGlvbnMubWV0aG9kUGxhY2Vob2xkZXI7XG4gICAgdmFyIHBhZCAgICAgID0gb3B0aW9ucy5pbmRlbnQgKyBwYWRkaW5nKHBhZFNpemUgLSBtZXRob2QubGVuZ3RoKTtcbiAgICB2YXIgbG9jYXRpb24gPSBbXG4gICAgICBvcHRpb25zLnN0eWxlcy5sb2NhdGlvbihsaW5lLmxvY2F0aW9uKSxcbiAgICAgIG9wdGlvbnMuc3R5bGVzLmxpbmUobGluZS5saW5lKSxcbiAgICAgIG9wdGlvbnMuc3R5bGVzLmNvbHVtbihsaW5lLmNvbHVtbiksXG4gICAgXS5qb2luKCc6Jyk7XG5cbiAgICB2YXIgdGV4dCA9IHBhZCArIG9wdGlvbnMuc3R5bGVzLm1ldGhvZChtZXRob2QpICsgJyBhdCAnICsgbG9jYXRpb247XG4gICAgaWYgKCFsaW5lLmltcG9ydGFudCkge1xuICAgICAgdGV4dCA9IG9wdGlvbnMuc3R5bGVzLnVuaW1wb3J0YW50KHRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJ1xcbicpO1xufVxuXG5mdW5jdGlvbiBjbGVhbihsaW5lcywgb3B0aW9ucykge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsaW5lOyBsaW5lID0gbGluZXNbaV07IGkrKykge1xuICAgIGlmIChvcHRpb25zLmZpbHRlcihsaW5lKSkgY29udGludWU7XG4gICAgbGluZS5sb2NhdGlvbiAgPSBjbGVhbkxvY2F0aW9uKGxpbmUubG9jYXRpb24sIG9wdGlvbnMpO1xuICAgIGxpbmUuaW1wb3J0YW50ID0gaXNJbXBvcnRhbnQobGluZSwgb3B0aW9ucyk7XG4gICAgcmVzdWx0LnB1c2gobGluZSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBVdGlsaXR5XG5cbmZ1bmN0aW9uIHBhc3N0aHJvdWdoKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBtZXJnZURlZmF1bHRzKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gIHZhciByZXN1bHQgPSBPYmplY3QuY3JlYXRlKGRlZmF1bHRzKTtcbiAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB2YWx1ZSA9IG1lcmdlRGVmYXVsdHModmFsdWUsIGRlZmF1bHRzW2tleV0pO1xuICAgIH1cbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbWV0aG9kUGFkZGluZyhsaW5lcywgb3B0aW9ucykge1xuICB2YXIgc2l6ZSA9IG9wdGlvbnMubWV0aG9kUGxhY2Vob2xkZXIubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMCwgbGluZTsgbGluZSA9IGxpbmVzW2ldOyBpKyspIHtcbiAgICBzaXplID0gTWF0aC5taW4ob3B0aW9ucy5tYXhNZXRob2RQYWRkaW5nLCBNYXRoLm1heChzaXplLCBsaW5lLm1ldGhvZC5sZW5ndGgpKTtcbiAgfVxuICByZXR1cm4gc2l6ZTtcbn1cblxuZnVuY3Rpb24gcGFkZGluZyhsZW5ndGgpIHtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgJyAnO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNsZWFuTG9jYXRpb24obG9jYXRpb24sIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMubG9jYXRpb25TdHJpcCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBtYXRjaGVyOyBtYXRjaGVyID0gb3B0aW9ucy5sb2NhdGlvblN0cmlwW2ldOyBpKyspIHtcbiAgICAgIGxvY2F0aW9uID0gbG9jYXRpb24ucmVwbGFjZShtYXRjaGVyLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxvY2F0aW9uO1xufVxuXG5mdW5jdGlvbiBpc0ltcG9ydGFudChsaW5lLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLnVuaW1wb3J0YW50TG9jYXRpb24pIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbWF0Y2hlcjsgbWF0Y2hlciA9IG9wdGlvbnMudW5pbXBvcnRhbnRMb2NhdGlvbltpXTsgaSsrKSB7XG4gICAgICBpZiAobGluZS5sb2NhdGlvbi5tYXRjaChtYXRjaGVyKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5zY29wZS5jbGVhbiAgPSBjbGVhbjtcbnNjb3BlLnByZXR0eSA9IHByZXR0eTtcbn0pKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgOiAodGhpcy5TdGFja3kgPSB0aGlzLlN0YWNreSB8fCB7fSkpO1xuXG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTQgVGhlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIFRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBwb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuLy8gVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdCBwb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuLy8gVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IHBvbHltZXIuZ2l0aHViLmlvL0NPTlRSSUJVVE9SUy50eHRcbi8vIENvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvIHN1YmplY3QgdG9cbi8vIGFuIGFkZGl0aW9uYWwgSVAgcmlnaHRzIGdyYW50IGZvdW5kIGF0IHBvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XG4oZnVuY3Rpb24oc2NvcGUpIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIHBhcnNlICA9IHNjb3BlLnBhcnNlICB8fCByZXF1aXJlKCcuL3BhcnNpbmcnKS5wYXJzZTtcbnZhciBwcmV0dHkgPSBzY29wZS5wcmV0dHkgfHwgcmVxdWlyZSgnLi9mb3JtYXR0aW5nJykucHJldHR5O1xuXG5mdW5jdGlvbiBub3JtYWxpemUoZXJyb3IsIHByZXR0eU9wdGlvbnMpIHtcbiAgaWYgKGVycm9yLnBhcnNlZFN0YWNrKSByZXR1cm4gZXJyb3I7XG4gIHZhciBtZXNzYWdlID0gZXJyb3IubWVzc2FnZSB8fCBlcnJvci5kZXNjcmlwdGlvbiB8fCBlcnJvciB8fCAnPHVua25vd24gZXJyb3I+JztcbiAgdmFyIHBhcnNlZFN0YWNrID0gW107XG4gIHRyeSB7XG4gICAgcGFyc2VkU3RhY2sgPSBwYXJzZShlcnJvci5zdGFjayB8fCBlcnJvci50b1N0cmluZygpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBBaCB3ZWxsLlxuICB9XG5cbiAgaWYgKHBhcnNlZFN0YWNrLmxlbmd0aCA9PT0gMCAmJiBlcnJvci5maWxlTmFtZSkge1xuICAgIHBhcnNlZFN0YWNrLnB1c2goe1xuICAgICAgbWV0aG9kOiAgICcnLFxuICAgICAgbG9jYXRpb246IGVycm9yLmZpbGVOYW1lLFxuICAgICAgbGluZTogICAgIGVycm9yLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW46ICAgZXJyb3IuY29sdW1uTnVtYmVyLFxuICAgIH0pO1xuICB9XG5cbiAgdmFyIHByZXR0eVN0YWNrID0gbWVzc2FnZTtcbiAgaWYgKHBhcnNlZFN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICBwcmV0dHlTdGFjayA9IHByZXR0eVN0YWNrICsgJ1xcbicgKyBwcmV0dHkocGFyc2VkU3RhY2ssIHByZXR0eU9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtZXNzYWdlOiAgICAgbWVzc2FnZSxcbiAgICBzdGFjazogICAgICAgcHJldHR5U3RhY2ssXG4gICAgcGFyc2VkU3RhY2s6IHBhcnNlZFN0YWNrLFxuICB9O1xufVxuXG5zY29wZS5ub3JtYWxpemUgPSBub3JtYWxpemU7XG59KSh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzIDogKHRoaXMuU3RhY2t5ID0gdGhpcy5TdGFja3kgfHwge30pKTtcblxuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChjKSAyMDE0IFRoZSBQb2x5bWVyIFByb2plY3QgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcbiAqIFRoZSBjb21wbGV0ZSBzZXQgb2YgYXV0aG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0FVVEhPUlMudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0NPTlRSSUJVVE9SUy50eHRcbiAqIENvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvXG4gKiBzdWJqZWN0IHRvIGFuIGFkZGl0aW9uYWwgSVAgcmlnaHRzIGdyYW50IGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9QQVRFTlRTLnR4dFxuICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqXG4gKiBZb3VyIGVudHJ5IHBvaW50IGludG8gYHdlYi1jb21wb25lbnQtdGVzdGVyYCdzIGVudmlyb25tZW50IGFuZCBjb25maWd1cmF0aW9uLlxuICovXG4oZnVuY3Rpb24oKSB7XG5cbnZhciBXQ1QgPSB3aW5kb3cuV0NUID0ge1xuICByZXBvcnRlcnM6IHt9LFxufTtcblxuLy8gQ29uZmlndXJhdGlvblxuXG4vKiogQnkgZGVmYXVsdCwgd2Ugd2FpdCBmb3IgYW55IHdlYiBjb21wb25lbnQgZnJhbWV3b3JrcyB0byBsb2FkLiAqL1xuV0NULndhaXRGb3JGcmFtZXdvcmtzID0gdHJ1ZTtcblxuLyoqIEhvdyBtYW55IGAuaHRtbGAgc3VpdGVzIHRoYXQgY2FuIGJlIGNvbmN1cnJlbnRseSBsb2FkZWQgJiBydW4uICovXG5XQ1QubnVtQ29uY3VycmVudFN1aXRlcyA9IDE7XG5cbi8vIEhlbHBlcnNcblxuLy8gRXZhbHVhdGVkIGluIG1vY2hhL3J1bi5qcy5cbldDVC5fc3VpdGVzVG9Mb2FkID0gW107XG5XQ1QuX2RlcGVuZGVuY2llcyA9IFtdO1xuXG4vLyBVc2VkIHRvIHNoYXJlIGRhdGEgYmV0d2VlbiBzdWJTdWl0ZXMgb24gY2xpZW50IGFuZCByZXBvcnRlcnMgb24gc2VydmVyXG5XQ1Quc2hhcmUgPSB7fTtcblxuLyoqXG4gKiBMb2FkcyBzdWl0ZXMgb2YgdGVzdHMsIHN1cHBvcnRpbmcgYC5qc2AgYXMgd2VsbCBhcyBgLmh0bWxgIGZpbGVzLlxuICpcbiAqIEBwYXJhbSB7IUFycmF5LjxzdHJpbmc+fSBmaWxlcyBUaGUgZmlsZXMgdG8gbG9hZC5cbiAqL1xuV0NULmxvYWRTdWl0ZXMgPSBmdW5jdGlvbiBsb2FkU3VpdGVzKGZpbGVzKSB7XG4gIGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuICAgIGlmIChmaWxlLnNsaWNlKC0zKSA9PT0gJy5qcycpIHtcbiAgICAgIFdDVC5fZGVwZW5kZW5jaWVzLnB1c2goZmlsZSk7XG4gICAgfSBlbHNlIGlmIChmaWxlLnNsaWNlKC01KSA9PT0gJy5odG1sJykge1xuICAgICAgV0NULl9zdWl0ZXNUb0xvYWQucHVzaChmaWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHJlc291cmNlIHR5cGU6ICcgKyBmaWxlKTtcbiAgICB9XG4gIH0pO1xufTtcblxufSkoKTtcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAxNCBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG4gKiBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuICogc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcbiAqL1xuKGZ1bmN0aW9uKCkge1xuXG5XQ1QudXRpbCA9IHt9O1xuXG4vKipcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gY2FsbGJhY2sgQSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGFjdGl2ZSB3ZWIgY29tcG9uZW50XG4gKiAgICAgZnJhbWV3b3JrcyBoYXZlIGxvYWRlZC5cbiAqL1xuV0NULnV0aWwud2hlbkZyYW1ld29ya3NSZWFkeSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIFdDVC51dGlsLmRlYnVnKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwgJ1dDVC51dGlsLndoZW5GcmFtZXdvcmtzUmVhZHknKTtcbiAgdmFyIGRvbmUgPSBmdW5jdGlvbigpIHtcbiAgICBXQ1QudXRpbC5kZWJ1Zyh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsICdXQ1QudXRpbC53aGVuRnJhbWV3b3Jrc1JlYWR5IGRvbmUnKTtcbiAgICBjYWxsYmFjaygpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGltcG9ydHNSZWFkeSgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignSFRNTEltcG9ydHNMb2FkZWQnLCBpbXBvcnRzUmVhZHkpO1xuICAgIFdDVC51dGlsLmRlYnVnKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwgJ0hUTUxJbXBvcnRzTG9hZGVkJyk7XG5cbiAgICBpZiAod2luZG93LlBvbHltZXIgJiYgUG9seW1lci53aGVuUmVhZHkpIHtcbiAgICAgIFBvbHltZXIud2hlblJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICBXQ1QudXRpbC5kZWJ1Zyh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsICdwb2x5bWVyLXJlYWR5Jyk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb25lKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWxsIG91ciBzdXBwb3J0ZWQgZnJhbWV3b3JrIGNvbmZpZ3VyYXRpb25zIGRlcGVuZCBvbiBpbXBvcnRzLlxuICBpZiAoIXdpbmRvdy5IVE1MSW1wb3J0cykge1xuICAgIGRvbmUoKTtcbiAgfSBlbHNlIGlmIChIVE1MSW1wb3J0cy5yZWFkeSkge1xuICAgIGltcG9ydHNSZWFkeSgpO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdIVE1MSW1wb3J0c0xvYWRlZCcsIGltcG9ydHNSZWFkeSk7XG4gIH1cbn07XG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gKiBAcGFyYW0ge3N0cmluZ30ga2luZFxuICogQHJldHVybiB7c3RyaW5nfSAnPGNvdW50PiA8a2luZD4gdGVzdHMnIG9yICc8Y291bnQ+IDxraW5kPiB0ZXN0Jy5cbiAqL1xuV0NULnV0aWwucGx1cmFsaXplZFN0YXQgPSBmdW5jdGlvbiBwbHVyYWxpemVkU3RhdChjb3VudCwga2luZCkge1xuICBpZiAoY291bnQgPT09IDEpIHtcbiAgICByZXR1cm4gY291bnQgKyAnICcgKyBraW5kICsgJyB0ZXN0JztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY291bnQgKyAnICcgKyBraW5kICsgJyB0ZXN0cyc7XG4gIH1cbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIFVSSSBvZiB0aGUgc2NyaXB0IHRvIGxvYWQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBkb25lXG4gKi9cbldDVC51dGlsLmxvYWRTY3JpcHQgPSBmdW5jdGlvbiBsb2FkU2NyaXB0KHBhdGgsIGRvbmUpIHtcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICBzY3JpcHQuc3JjID0gcGF0aCArICc/JyArIE1hdGgucmFuZG9tKCk7XG4gIHNjcmlwdC5vbmxvYWQgPSBkb25lLmJpbmQobnVsbCwgbnVsbCk7XG4gIHNjcmlwdC5vbmVycm9yID0gZG9uZS5iaW5kKG51bGwsICdGYWlsZWQgdG8gbG9hZCBzY3JpcHQgJyArIHNjcmlwdC5zcmMpO1xuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7Li4uKn0gdmFyX2FyZ3MgTG9ncyB2YWx1ZXMgdG8gdGhlIGNvbnNvbGUgd2hlbiBgV0NULmRlYnVnYCBpcyB0cnVlLlxuICovXG5XQ1QudXRpbC5kZWJ1ZyA9IGZ1bmN0aW9uIGRlYnVnKHZhcl9hcmdzKSB7XG4gIGlmICghV0NULmRlYnVnKSByZXR1cm47XG4gIGNvbnNvbGUuZGVidWcuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbn07XG5cbi8vIFVSTCBQcm9jZXNzaW5nXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdF9xdWVyeSBBIHF1ZXJ5IHN0cmluZyB0byBwYXJzZS5cbiAqIEByZXR1cm4geyFPYmplY3QuPHN0cmluZywgIUFycmF5LjxzdHJpbmc+Pn0gQWxsIHBhcmFtcyBvbiB0aGUgVVJMJ3MgcXVlcnkuXG4gKi9cbldDVC51dGlsLmdldFBhcmFtcyA9IGZ1bmN0aW9uIGdldFBhcmFtcyhvcHRfcXVlcnkpIHtcbiAgdmFyIHF1ZXJ5ID0gb3B0X3F1ZXJ5IHx8IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XG4gIGlmIChxdWVyeS5zdWJzdHJpbmcoMCwgMSkgPT09ICc/Jykge1xuICAgIHF1ZXJ5ID0gcXVlcnkuc3Vic3RyaW5nKDEpO1xuICB9XG4gIC8vIHB5dGhvbidzIFNpbXBsZUhUVFBTZXJ2ZXIgdGFja3MgYSBgL2Agb24gdGhlIGVuZCBvZiBxdWVyeSBzdHJpbmdzIDooXG4gIGlmIChxdWVyeS5zbGljZSgtMSkgPT09ICcvJykge1xuICAgIHF1ZXJ5ID0gcXVlcnkuc3Vic3RyaW5nKDAsIHF1ZXJ5Lmxlbmd0aCAtIDEpO1xuICB9XG4gIGlmIChxdWVyeSA9PT0gJycpIHJldHVybiB7fTtcblxuICB2YXIgcmVzdWx0ID0ge307XG4gIHF1ZXJ5LnNwbGl0KCcmJykuZm9yRWFjaChmdW5jdGlvbihwYXJ0KSB7XG4gICAgdmFyIHBhaXIgPSBwYXJ0LnNwbGl0KCc9Jyk7XG4gICAgaWYgKHBhaXIubGVuZ3RoICE9PSAyKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgVVJMIHF1ZXJ5IHBhcnQ6JywgcGFydCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBrZXkgICA9IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzBdKTtcbiAgICB2YXIgdmFsdWUgPSBkZWNvZGVVUklDb21wb25lbnQocGFpclsxXSk7XG5cbiAgICBpZiAoIXJlc3VsdFtrZXldKSB7XG4gICAgICByZXN1bHRba2V5XSA9IFtdO1xuICAgIH1cbiAgICByZXN1bHRba2V5XS5wdXNoKHZhbHVlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtIFRoZSBwYXJhbSB0byByZXR1cm4gYSB2YWx1ZSBmb3IuXG4gKiBAcmV0dXJuIHs/c3RyaW5nfSBUaGUgZmlyc3QgdmFsdWUgZm9yIGBwYXJhbWAsIGlmIGZvdW5kLlxuICovXG5XQ1QudXRpbC5nZXRQYXJhbSA9IGZ1bmN0aW9uIGdldFBhcmFtKHBhcmFtKSB7XG4gIHZhciBwYXJhbXMgPSBXQ1QudXRpbC5nZXRQYXJhbXMoKTtcbiAgcmV0dXJuIHBhcmFtc1twYXJhbV0gPyBwYXJhbXNbcGFyYW1dWzBdIDogbnVsbDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHshT2JqZWN0LjxzdHJpbmcsICFBcnJheS48c3RyaW5nPj59IHBhcmFtc1xuICogQHJldHVybiB7c3RyaW5nfSBgcGFyYW1zYCBlbmNvZGVkIGFzIGEgVVJJIHF1ZXJ5LlxuICovXG5XQ1QudXRpbC5wYXJhbXNUb1F1ZXJ5ID0gZnVuY3Rpb24gcGFyYW1zVG9RdWVyeShwYXJhbXMpIHtcbiAgdmFyIHBhaXJzID0gW107XG4gIE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBwYXJhbXNba2V5XS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gJz8nICsgcGFpcnMuam9pbignJicpO1xufTtcblxuLyoqIEByZXR1cm4ge3N0cmluZ30gYGxvY2F0aW9uYCByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3aW5kb3cuICovXG5XQ1QudXRpbC5yZWxhdGl2ZUxvY2F0aW9uID0gZnVuY3Rpb24gcmVsYXRpdmVMb2NhdGlvbihsb2NhdGlvbikge1xuICB2YXIgcGF0aCA9IGxvY2F0aW9uLnBhdGhuYW1lO1xuICB2YXIgYmFzZVBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL14uKlxcLy8pWzBdO1xuICBpZiAocGF0aC5pbmRleE9mKGJhc2VQYXRoKSA9PT0gMCkge1xuICAgIHBhdGggPSBwYXRoLnN1YnN0cmluZyhiYXNlUGF0aC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBwYXRoO1xufTtcblxuLyoqXG4gKiBMaWtlIGBhc3luYy5wYXJhbGxlbExpbWl0YCwgYnV0IG91ciBvd24gc28gdGhhdCB3ZSBkb24ndCBmb3JjZSBhIGRlcGVuZGVuY3lcbiAqIG9uIGRvd25zdHJlYW0gY29kZS5cbiAqXG4gKiBAcGFyYW0geyFBcnJheS48ZnVuY3Rpb24oZnVuY3Rpb24oKikpPn0gcnVubmVycyBSdW5uZXJzIHRoYXQgY2FsbCB0aGVpciBnaXZlblxuICogICAgIE5vZGUtc3R5bGUgY2FsbGJhY2sgd2hlbiBkb25lLlxuICogQHBhcmFtIHtudW1iZXJ8ZnVuY3Rpb24oKil9IGxpbWl0IE1heGltdW0gbnVtYmVyIG9mIGNvbmN1cnJlbnQgcnVubmVycy5cbiAqICAgICAob3B0aW9uYWwpLlxuICogQHBhcmFtIHs/ZnVuY3Rpb24oKil9IGRvbmUgQ2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgdHJpZ2dlcmVkIG9uY2UgYWxsIHJ1bm5lcnNcbiAqICAgICBoYXZlIGNvbXBsZXRlZCwgb3IgZW5jb3VudGVyZWQgYW4gZXJyb3IuXG4gKi9cbldDVC51dGlsLnBhcmFsbGVsID0gZnVuY3Rpb24gcGFyYWxsZWwocnVubmVycywgbGltaXQsIGRvbmUpIHtcbiAgaWYgKHR5cGVvZiBsaW1pdCAhPT0gJ251bWJlcicpIHtcbiAgICBkb25lICA9IGxpbWl0O1xuICAgIGxpbWl0ID0gMDtcbiAgfVxuICBpZiAoIXJ1bm5lcnMubGVuZ3RoKSByZXR1cm4gZG9uZSgpO1xuXG4gIHZhciBjYWxsZWQgICAgPSBmYWxzZTtcbiAgdmFyIHRvdGFsICAgICA9IHJ1bm5lcnMubGVuZ3RoO1xuICB2YXIgbnVtQWN0aXZlID0gMDtcbiAgdmFyIG51bURvbmUgICA9IDA7XG5cbiAgZnVuY3Rpb24gcnVubmVyRG9uZShlcnJvcikge1xuICAgIGlmIChjYWxsZWQpIHJldHVybjtcbiAgICBudW1Eb25lID0gbnVtRG9uZSArIDE7XG4gICAgbnVtQWN0aXZlID0gbnVtQWN0aXZlIC0gMTtcblxuICAgIGlmIChlcnJvciB8fCBudW1Eb25lID49IHRvdGFsKSB7XG4gICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgZG9uZShlcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJ1bk9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bk9uZSgpIHtcbiAgICBpZiAobGltaXQgJiYgbnVtQWN0aXZlID49IGxpbWl0KSByZXR1cm47XG4gICAgaWYgKCFydW5uZXJzLmxlbmd0aCkgcmV0dXJuO1xuICAgIG51bUFjdGl2ZSA9IG51bUFjdGl2ZSArIDE7XG4gICAgcnVubmVycy5zaGlmdCgpKHJ1bm5lckRvbmUpO1xuICB9XG4gIHJ1bm5lcnMuZm9yRWFjaChydW5PbmUpO1xufTtcblxufSkoKTtcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAxNCBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG4gKiBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuICogc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcbiAqL1xuKGZ1bmN0aW9uKCkge1xuXG5XQ1QuQ0xJU29ja2V0ID0gQ0xJU29ja2V0O1xuXG52YXIgU09DS0VUSU9fRU5EUE9JTlQgPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3Q7XG52YXIgU09DS0VUSU9fTElCUkFSWSAgPSBTT0NLRVRJT19FTkRQT0lOVCArICcvc29ja2V0LmlvL3NvY2tldC5pby5qcyc7XG5cbi8qKlxuICogQSBzb2NrZXQgZm9yIGNvbW11bmljYXRpb24gYmV0d2VlbiB0aGUgQ0xJIGFuZCBicm93c2VyIHJ1bm5lcnMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJyb3dzZXJJZCBBbiBJRCBnZW5lcmF0ZWQgYnkgdGhlIENMSSBydW5uZXIuXG4gKiBAcGFyYW0geyFpby5Tb2NrZXR9IHNvY2tldCBUaGUgc29ja2V0LmlvIGBTb2NrZXRgIHRvIGNvbW11bmljYXRlIG92ZXIuXG4gKi9cbmZ1bmN0aW9uIENMSVNvY2tldChicm93c2VySWQsIHNvY2tldCkge1xuICB0aGlzLmJyb3dzZXJJZCA9IGJyb3dzZXJJZDtcbiAgdGhpcy5zb2NrZXQgICAgPSBzb2NrZXQ7XG59XG5cbi8qKlxuICogQHBhcmFtIHshTW9jaGEuUnVubmVyfSBydW5uZXIgVGhlIE1vY2hhIGBSdW5uZXJgIHRvIG9ic2VydmUsIHJlcG9ydGluZ1xuICogICAgIGludGVyZXN0aW5nIGV2ZW50cyBiYWNrIHRvIHRoZSBDTEkgcnVubmVyLlxuICovXG5DTElTb2NrZXQucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbiBvYnNlcnZlKHJ1bm5lcikge1xuICB0aGlzLmVtaXRFdmVudCgnYnJvd3Nlci1zdGFydCcsIHtcbiAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpLFxuICB9KTtcblxuICAvLyBXZSBvbmx5IGVtaXQgYSBzdWJzZXQgb2YgZXZlbnRzIHRoYXQgd2UgY2FyZSBhYm91dCwgYW5kIGZvbGxvdyBhIG1vcmVcbiAgLy8gZ2VuZXJhbCBldmVudCBmb3JtYXQgdGhhdCBpcyBob3BlZnVsbHkgYXBwbGljYWJsZSB0byB0ZXN0IHJ1bm5lcnMgYmV5b25kXG4gIC8vIG1vY2hhLlxuICAvL1xuICAvLyBGb3IgYWxsIHBvc3NpYmxlIG1vY2hhIGV2ZW50cywgc2VlOlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdmlzaW9ubWVkaWEvbW9jaGEvYmxvYi9tYXN0ZXIvbGliL3J1bm5lci5qcyNMMzZcbiAgcnVubmVyLm9uKCd0ZXN0JywgZnVuY3Rpb24odGVzdCkge1xuICAgIHRoaXMuZW1pdEV2ZW50KCd0ZXN0LXN0YXJ0Jywge3Rlc3Q6IGdldFRpdGxlcyh0ZXN0KX0pO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIHJ1bm5lci5vbigndGVzdCBlbmQnLCBmdW5jdGlvbih0ZXN0KSB7XG4gICAgdGhpcy5lbWl0RXZlbnQoJ3Rlc3QtZW5kJywge1xuICAgICAgc3RhdGU6ICAgIGdldFN0YXRlKHRlc3QpLFxuICAgICAgdGVzdDogICAgIGdldFRpdGxlcyh0ZXN0KSxcbiAgICAgIGR1cmF0aW9uOiB0ZXN0LmR1cmF0aW9uLFxuICAgICAgZXJyb3I6ICAgIHRlc3QuZXJyLFxuICAgIH0pO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIHJ1bm5lci5vbignc3ViU3VpdGUgc3RhcnQnLCBmdW5jdGlvbihzdWJTdWl0ZSkge1xuICAgIHRoaXMuZW1pdEV2ZW50KCdzdWItc3VpdGUtc3RhcnQnLCBzdWJTdWl0ZS5zaGFyZSk7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgcnVubmVyLm9uKCdzdWJTdWl0ZSBlbmQnLCBmdW5jdGlvbihzdWJTdWl0ZSkge1xuICAgIHRoaXMuZW1pdEV2ZW50KCdzdWItc3VpdGUtZW5kJywgc3ViU3VpdGUuc2hhcmUpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIHJ1bm5lci5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbWl0RXZlbnQoJ2Jyb3dzZXItZW5kJyk7XG4gIH0uYmluZCh0aGlzKSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gZmlyZS5cbiAqIEBwYXJhbSB7Kn0gZGF0YSBBZGRpdGlvbmFsIGRhdGEgdG8gcGFzcyB3aXRoIHRoZSBldmVudC5cbiAqL1xuQ0xJU29ja2V0LnByb3RvdHlwZS5lbWl0RXZlbnQgPSBmdW5jdGlvbiBlbWl0RXZlbnQoZXZlbnQsIGRhdGEpIHtcbiAgdGhpcy5zb2NrZXQuZW1pdCgnY2xpZW50LWV2ZW50Jywge1xuICAgIGJyb3dzZXJJZDogdGhpcy5icm93c2VySWQsXG4gICAgZXZlbnQ6ICAgICBldmVudCxcbiAgICBkYXRhOiAgICAgIGRhdGEsXG4gIH0pO1xufTtcblxuLyoqXG4gKiBCdWlsZHMgYSBgQ0xJU29ja2V0YCBpZiB3ZSBhcmUgd2l0aGluIGEgQ0xJLXJ1biBlbnZpcm9ubWVudDsgc2hvcnQtY2lyY3VpdHNcbiAqIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIENMSVNvY2tldCl9IGRvbmUgTm9kZS1zdHlsZSBjYWxsYmFjay5cbiAqL1xuQ0xJU29ja2V0LmluaXQgPSBmdW5jdGlvbiBpbml0KGRvbmUpIHtcbiAgdmFyIGJyb3dzZXJJZCA9IFdDVC51dGlsLmdldFBhcmFtKCdjbGlfYnJvd3Nlcl9pZCcpO1xuICBpZiAoIWJyb3dzZXJJZCkgcmV0dXJuIGRvbmUoKTtcblxuICBXQ1QudXRpbC5sb2FkU2NyaXB0KFNPQ0tFVElPX0xJQlJBUlksIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgaWYgKGVycm9yKSByZXR1cm4gZG9uZShlcnJvcik7XG5cbiAgICB2YXIgc29ja2V0ID0gaW8oU09DS0VUSU9fRU5EUE9JTlQpO1xuICAgIHNvY2tldC5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgc29ja2V0Lm9mZigpO1xuICAgICAgZG9uZShlcnJvcik7XG4gICAgfSk7XG5cbiAgICBzb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgIHNvY2tldC5vZmYoKTtcbiAgICAgIGRvbmUobnVsbCwgbmV3IENMSVNvY2tldChicm93c2VySWQsIHNvY2tldCkpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbi8vIE1pc2MgVXRpbGl0eVxuXG4vKipcbiAqIEBwYXJhbSB7IU1vY2hhLlJ1bm5hYmxlfSBydW5uYWJsZSBUaGUgdGVzdCBvciBzdWl0ZSB0byBleHRyYWN0IHRpdGxlcyBmcm9tLlxuICogQHJldHVybiB7IUFycmF5LjxzdHJpbmc+fSBUaGUgdGl0bGVzIG9mIHRoZSBydW5uYWJsZSBhbmQgaXRzIHBhcmVudHMuXG4gKi9cbmZ1bmN0aW9uIGdldFRpdGxlcyhydW5uYWJsZSkge1xuICB2YXIgdGl0bGVzID0gW107XG4gIHdoaWxlIChydW5uYWJsZSAmJiAhcnVubmFibGUucm9vdCAmJiBydW5uYWJsZS50aXRsZSkge1xuICAgIHRpdGxlcy51bnNoaWZ0KHJ1bm5hYmxlLnRpdGxlKTtcbiAgICBydW5uYWJsZSA9IHJ1bm5hYmxlLnBhcmVudDtcbiAgfVxuICByZXR1cm4gdGl0bGVzO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7IU1vY2hhLlJ1bm5hYmxlfSBydW5uYWJsZVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRTdGF0ZShydW5uYWJsZSkge1xuICBpZiAocnVubmFibGUuc3RhdGUgPT09ICdwYXNzZWQnKSB7XG4gICAgcmV0dXJuICdwYXNzaW5nJztcbiAgfSBlbHNlIGlmIChydW5uYWJsZS5zdGF0ZSA9PSAnZmFpbGVkJykge1xuICAgIHJldHVybiAnZmFpbGluZyc7XG4gIH0gZWxzZSBpZiAocnVubmFibGUucGVuZGluZykge1xuICAgIHJldHVybiAncGVuZGluZyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICd1bmtub3duJztcbiAgfVxufVxuXG59KSgpO1xuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChjKSAyMDE0IFRoZSBQb2x5bWVyIFByb2plY3QgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcbiAqIFRoZSBjb21wbGV0ZSBzZXQgb2YgYXV0aG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0FVVEhPUlMudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0NPTlRSSUJVVE9SUy50eHRcbiAqIENvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvXG4gKiBzdWJqZWN0IHRvIGFuIGFkZGl0aW9uYWwgSVAgcmlnaHRzIGdyYW50IGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9QQVRFTlRTLnR4dFxuICovXG4oZnVuY3Rpb24oKSB7XG5cbi8vIFRPRE8odGhlZGVlbm8pOiBDb25zaWRlciByZW5hbWluZyBzdWJzdWl0ZS4gSUlSQywgc3ViU3VpdGUgaXMgZW50aXJlbHlcbi8vIGRpc3RpbmN0IGZyb20gbW9jaGEgc3VpdGUsIHdoaWNoIHRyaXBwZWQgbWUgdXAgYmFkbHkgd2hlbiB0cnlpbmcgdG8gYWRkXG4vLyBwbHVnaW4gc3VwcG9ydC4gUGVyaGFwcyBzb21ldGhpbmcgbGlrZSAnYmF0Y2gnLCBvciAnYnVuZGxlJy4gU29tZXRoaW5nIHRoYXRcbi8vIGhhcyBubyBtb2NoYSBjb3JyZWxhdGUuIFRoaXMgbWF5IGFsc28gZWxpbWluYXRlIHRoZSBuZWVkIGZvciByb290L25vbi1yb290XG4vLyBzdWl0ZSBkaXN0aW5jdGlvbnMuXG5cbi8qKlxuICogQSBNb2NoYSBzdWl0ZSAob3Igc3VpdGVzKSBydW4gd2l0aGluIGEgY2hpbGQgaWZyYW1lLCBidXQgcmVwb3J0ZWQgYXMgaWYgdGhleVxuICogYXJlIHBhcnQgb2YgdGhlIGN1cnJlbnQgY29udGV4dC5cbiAqL1xuZnVuY3Rpb24gU3ViU3VpdGUodXJsLCBwYXJlbnRTY29wZSkge1xuICB2YXIgcGFyYW1zID0gV0NULnV0aWwuZ2V0UGFyYW1zKHBhcmVudFNjb3BlLmxvY2F0aW9uLnNlYXJjaCk7XG4gIGRlbGV0ZSBwYXJhbXMuY2xpX2Jyb3dzZXJfaWQ7XG4gIHBhcmFtcy5idXN0ID0gW01hdGgucmFuZG9tKCldO1xuXG4gIHRoaXMudXJsICAgICAgICAgPSB1cmwgKyBXQ1QudXRpbC5wYXJhbXNUb1F1ZXJ5KHBhcmFtcyk7XG4gIHRoaXMucGFyZW50U2NvcGUgPSBwYXJlbnRTY29wZTtcblxuICB0aGlzLnN0YXRlID0gJ2luaXRpYWxpemluZyc7XG59XG5XQ1QuU3ViU3VpdGUgPSBTdWJTdWl0ZTtcblxuLy8gU3ViU3VpdGVzIGdldCBhIHByZXR0eSBnZW5lcm91cyBsb2FkIHRpbWVvdXQgYnkgZGVmYXVsdC5cblN1YlN1aXRlLmxvYWRUaW1lb3V0ID0gMzAwMDA7XG5cbi8vIFdlIGNhbid0IG1haW50YWluIHByb3BlcnRpZXMgb24gaWZyYW1lIGVsZW1lbnRzIGluIEZpcmVmb3gvU2FmYXJpLz8/Pywgc28gd2Vcbi8vIHRyYWNrIHN1YlN1aXRlcyBieSBVUkwuXG5TdWJTdWl0ZS5fYnlVcmwgPSB7fTtcblxuLyoqXG4gKiBAcmV0dXJuIHtTdWJTdWl0ZX0gVGhlIGBTdWJTdWl0ZWAgdGhhdCB3YXMgcmVnaXN0ZXJlZCBmb3IgdGhpcyB3aW5kb3cuXG4gKi9cblN1YlN1aXRlLmN1cnJlbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFN1YlN1aXRlLmdldCh3aW5kb3cpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0geyFXaW5kb3d9IHRhcmdldCBBIHdpbmRvdyB0byBmaW5kIHRoZSBTdWJTdWl0ZSBvZi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdHJhdmVyc2FsIFdoZXRoZXIgdGhpcyBpcyBhIHRyYXZlcnNhbCBmcm9tIGEgY2hpbGQgd2luZG93LlxuICogQHJldHVybiB7U3ViU3VpdGV9IFRoZSBgU3ViU3VpdGVgIHRoYXQgd2FzIHJlZ2lzdGVyZWQgZm9yIGB0YXJnZXRgLlxuICovXG5TdWJTdWl0ZS5nZXQgPSBmdW5jdGlvbih0YXJnZXQsIHRyYXZlcnNhbCkge1xuICB2YXIgc3ViU3VpdGUgPSBTdWJTdWl0ZS5fYnlVcmxbdGFyZ2V0LmxvY2F0aW9uLmhyZWZdO1xuICBpZiAoc3ViU3VpdGUpIHJldHVybiBzdWJTdWl0ZTtcbiAgaWYgKHdpbmRvdy5wYXJlbnQgPT09IHdpbmRvdykge1xuICAgIGlmICh0cmF2ZXJzYWwpIHtcbiAgICAgIC8vIEkgcmVhbGx5IGhvcGUgdGhlcmUncyBubyBsZWdpdCBjYXNlIGZvciB0aGlzLiBJbmZpbml0ZSByZWxvYWRzIGFyZSBubyBnb29kLlxuICAgICAgY29uc29sZS53YXJuKCdTdWJzdWl0ZSBsb2FkZWQgYnV0IHdhcyBuZXZlciByZWdpc3RlcmVkLiBUaGlzIG1vc3QgbGlrZWx5IGlzIGR1ZSB0byB3b25reSBoaXN0b3J5IGJlaGF2aW9yLiBSZWxvYWRpbmcuLi4nKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIC8vIE90aGVyd2lzZSwgdHJhdmVyc2UuXG4gIHJldHVybiB3aW5kb3cucGFyZW50LldDVC5TdWJTdWl0ZS5nZXQodGFyZ2V0LCB0cnVlKTtcbn07XG5cbi8qKlxuICogSGFuZ3MgYSByZWZlcmVuY2UgdG8gdGhlIFN1YlN1aXRlJ3MgaWZyYW1lLWxvY2FsIHdjdCBvYmplY3RcbiAqXG4gKiBUT0RPKHRoZWRlZW5vKTogVGhpcyBtZXRob2QgaXMgb2RkIHRvIGRvY3VtZW50IHNvIHRoZSBhY2hpdGVjdHVyZSBtaWdodCBuZWVkXG4gKiBhIGxpdHRsZSByZXdvcmsgaGVyZS4gTWF5YmUgYW5vdGhlciBuYW1lZCBjb25jZXB0PyBTZWVpbmcgV0NUIGV2ZXJ5d2hlcmUgaXNcbiAqIHByZXR0eSBjb25mdXNpbmcuIEFsc28sIEkgZG9uJ3QgdGhpbmsgd2UgbmVlZCB0aGUgcGFyZW50U2NvcGUuV0NUOyB0byBsaW1pdFxuICogY29uZnVzaW9uIEkgZGlkbid0IGluY2x1ZGUgaXQuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHdjdCBUaGUgU3ViU3VpdGUncyBpZnJhbWUtbG9jYWwgd2N0IG9iamVjdFxuICovXG5TdWJTdWl0ZS5wcm90b3R5cGUucHJlcGFyZSA9IGZ1bmN0aW9uKHdjdCkge1xuICB0aGlzLnNoYXJlID0gd2N0LnNoYXJlO1xufTtcblxuLyoqXG4gKiBMb2FkcyBhbmQgcnVucyB0aGUgc3Vic3VpdGUuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZG9uZSBOb2RlLXN0eWxlIGNhbGxiYWNrLlxuICovXG5TdWJTdWl0ZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oZG9uZSkge1xuICBXQ1QudXRpbC5kZWJ1ZygnU3ViU3VpdGUjcnVuJywgdGhpcy51cmwpO1xuICB0aGlzLnN0YXRlID0gJ2xvYWRpbmcnO1xuICB0aGlzLm9uUnVuQ29tcGxldGUgPSBkb25lO1xuXG4gIHRoaXMuaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gIHRoaXMuaWZyYW1lLnNyYyA9IHRoaXMudXJsO1xuICB0aGlzLmlmcmFtZS5jbGFzc0xpc3QuYWRkKCdzdWJzdWl0ZScpO1xuXG4gIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Vic3VpdGVzJyk7XG4gIGlmICghY29udGFpbmVyKSB7XG4gICAgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmlkID0gJ3N1YnN1aXRlcyc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmlmcmFtZSk7XG5cbiAgLy8gbGV0IHRoZSBpZnJhbWUgZXhwYW5kIHRoZSBVUkwgZm9yIHVzLlxuICB0aGlzLnVybCA9IHRoaXMuaWZyYW1lLnNyYztcbiAgU3ViU3VpdGUuX2J5VXJsW3RoaXMudXJsXSA9IHRoaXM7XG5cbiAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KFxuICAgICAgdGhpcy5sb2FkZWQuYmluZCh0aGlzLCBuZXcgRXJyb3IoJ1RpbWVkIG91dCBsb2FkaW5nICcgKyB0aGlzLnVybCkpLCBTdWJTdWl0ZS5sb2FkVGltZW91dCk7XG5cbiAgdGhpcy5pZnJhbWUuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLFxuICAgICAgdGhpcy5sb2FkZWQuYmluZCh0aGlzLCBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBsb2FkIGRvY3VtZW50ICcgKyB0aGlzLnVybCkpKTtcblxuICB0aGlzLmlmcmFtZS5jb250ZW50V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCB0aGlzLmxvYWRlZC5iaW5kKHRoaXMsIG51bGwpKTtcbn07XG5cbi8qKlxuICogQ2FsbGVkIHdoZW4gdGhlIHN1YiBzdWl0ZSdzIGlmcmFtZSBoYXMgbG9hZGVkIChvciBlcnJvcmVkIGR1cmluZyBsb2FkKS5cbiAqXG4gKiBAcGFyYW0geyp9IGVycm9yIFRoZSBlcnJvciB0aGF0IG9jY3VyZWQsIGlmIGFueS5cbiAqL1xuU3ViU3VpdGUucHJvdG90eXBlLmxvYWRlZCA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gIFdDVC51dGlsLmRlYnVnKCdTdWJTdWl0ZSNsb2FkZWQnLCB0aGlzLnVybCwgZXJyb3IpO1xuICBpZiAodGhpcy50aW1lb3V0SWQpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICB9XG4gIGlmIChlcnJvcikge1xuICAgIHRoaXMuc2lnbmFsUnVuQ29tcGxldGUoZXJyb3IpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59O1xuXG4vKiogQ2FsbGVkIHdoZW4gdGhlIHN1YiBzdWl0ZSdzIHRlc3RzIGFyZSBjb21wbGV0ZSwgc28gdGhhdCBpdCBjYW4gY2xlYW4gdXAuICovXG5TdWJTdWl0ZS5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uIGRvbmUoKSB7XG4gIFdDVC51dGlsLmRlYnVnKCdTdWJTdWl0ZSNkb25lJywgdGhpcy51cmwsIGFyZ3VtZW50cyk7XG5cbiAgdGhpcy5zaWduYWxSdW5Db21wbGV0ZSgpO1xuXG4gIGlmICghdGhpcy5pZnJhbWUpIHJldHVybjtcbiAgdGhpcy5pZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmlmcmFtZSk7XG59O1xuXG5TdWJTdWl0ZS5wcm90b3R5cGUuc2lnbmFsUnVuQ29tcGxldGUgPSBmdW5jdGlvbiBzaWduYWxSdW5Db21wbGV0ZShlcnJvcikge1xuICBpZiAoIXRoaXMub25SdW5Db21wbGV0ZSkgcmV0dXJuO1xuICB0aGlzLnN0YXRlID0gJ2NvbXBsZXRlJztcbiAgdGhpcy5vblJ1bkNvbXBsZXRlKGVycm9yKTtcbiAgdGhpcy5vblJ1bkNvbXBsZXRlID0gbnVsbDtcbn07XG5cbn0pKCk7XG4iLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgVGhlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVGhpcyBjb2RlIG1heSBvbmx5IGJlIHVzZWQgdW5kZXIgdGhlIEJTRCBzdHlsZSBsaWNlbnNlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQVVUSE9SUy50eHRcbiAqIFRoZSBjb21wbGV0ZSBzZXQgb2YgY29udHJpYnV0b3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQ09OVFJJQlVUT1JTLnR4dFxuICogQ29kZSBkaXN0cmlidXRlZCBieSBHb29nbGUgYXMgcGFydCBvZiB0aGUgcG9seW1lciBwcm9qZWN0IGlzIGFsc29cbiAqIHN1YmplY3QgdG8gYW4gYWRkaXRpb25hbCBJUCByaWdodHMgZ3JhbnQgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XG4gKi9cbihmdW5jdGlvbigpIHtcblxuLy8gcG9seW1lci10ZXN0LXRvb2xzIChhbmQgUG9seW1lci90b29scykgc3VwcG9ydCBIVE1MIHRlc3RzIHdoZXJlIGVhY2ggZmlsZSBpc1xuLy8gZXhwZWN0ZWQgdG8gY2FsbCBgZG9uZSgpYCwgd2hpY2ggcG9zdHMgYSBtZXNzYWdlIHRvIHRoZSBwYXJlbnQgd2luZG93Llxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICBpZiAoIWV2ZW50LmRhdGEgfHwgKGV2ZW50LmRhdGEgIT09ICdvaycgJiYgIWV2ZW50LmRhdGEuZXJyb3IpKSByZXR1cm47XG4gIHZhciBzdWJTdWl0ZSA9IFdDVC5TdWJTdWl0ZS5nZXQoZXZlbnQuc291cmNlKTtcbiAgaWYgKCFzdWJTdWl0ZSkgcmV0dXJuO1xuXG4gIC8vIFRoZSBuYW1lIG9mIHRoZSBzdWl0ZSBhcyBleHBvc2VkIHRvIHRoZSB1c2VyLlxuICB2YXIgcGF0aCA9IFdDVC51dGlsLnJlbGF0aXZlTG9jYXRpb24oZXZlbnQuc291cmNlLmxvY2F0aW9uKTtcbiAgdmFyIHBhcmVudFJ1bm5lciA9IHN1YlN1aXRlLnBhcmVudFNjb3BlLldDVC5fbXVsdGlSdW5uZXI7XG4gIHBhcmVudFJ1bm5lci5lbWl0T3V0T2ZCYW5kVGVzdCgncGFnZS13aWRlIHRlc3RzIHZpYSBnbG9iYWwgZG9uZSgpJywgZXZlbnQuZGF0YS5lcnJvciwgcGF0aCwgdHJ1ZSk7XG5cbiAgc3ViU3VpdGUuZG9uZSgpO1xufSk7XG5cbi8vIEF0dGVtcHQgdG8gZW5zdXJlIHRoYXQgd2UgY29tcGxldGUgYSB0ZXN0IHN1aXRlIGlmIGl0IGlzIGludGVycnVwdGVkIGJ5IGFcbi8vIGRvY3VtZW50IHVubG9hZC5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd1bmxvYWQnLCBmdW5jdGlvbihldmVudCkge1xuICAvLyBNb2NoYSdzIGhvb2sgcXVldWUgaXMgYXN5bmNocm9ub3VzOyBidXQgd2Ugd2FudCBzeW5jaHJvbm91cyBiZWhhdmlvciBpZlxuICAvLyB3ZSd2ZSBnb3R0ZW4gdG8gdGhlIHBvaW50IG9mIHVubG9hZGluZyB0aGUgZG9jdW1lbnQuXG4gIE1vY2hhLlJ1bm5lci5pbW1lZGlhdGVseSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7IGNhbGxiYWNrKCk7IH07XG59KTtcblxufSkoKTtcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAxNCBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG4gKiBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuICogc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcbiAqL1xuKGZ1bmN0aW9uKCkge1xuXG4vKipcbiAqIFJ1bnMgYHN0ZXBGbmAsIGNhdGNoaW5nIGFueSBlcnJvciBhbmQgcGFzc2luZyBpdCB0byBgY2FsbGJhY2tgIChOb2RlLXN0eWxlKS5cbiAqIE90aGVyd2lzZSwgY2FsbHMgYGNhbGxiYWNrYCB3aXRoIG5vIGFyZ3VtZW50cyBvbiBzdWNjZXNzLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gc3RlcEZuXG4gKi9cbndpbmRvdy5zYWZlU3RlcCA9IGZ1bmN0aW9uIHNhZmVTdGVwKGNhbGxiYWNrLCBzdGVwRm4pIHtcbiAgdmFyIGVycjtcbiAgdHJ5IHtcbiAgICBzdGVwRm4oKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnIgPSBlcnJvcjtcbiAgfVxuICBjYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBSdW5zIHlvdXIgdGVzdCBhdCBkZWNsYXJhdGlvbiB0aW1lIChiZWZvcmUgTW9jaGEgaGFzIGJlZ3VuIHRlc3RzKS4gSGFuZHkgZm9yXG4gKiB3aGVuIHlvdSBuZWVkIHRvIHRlc3QgZG9jdW1lbnQgaW5pdGlhbGl6YXRpb24uXG4gKlxuICogQmUgYXdhcmUgdGhhdCBhbnkgZXJyb3JzIHRocm93biBhc3luY2hyb25vdXNseSBjYW5ub3QgYmUgdGllZCB0byB5b3VyIHRlc3QuXG4gKiBZb3UgbWF5IHdhbnQgdG8gY2F0Y2ggdGhlbSBhbmQgcGFzcyB0aGVtIHRvIHRoZSBkb25lIGV2ZW50LCBpbnN0ZWFkLiBTZWVcbiAqIGBzYWZlU3RlcGAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHRlc3QuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKD9mdW5jdGlvbigpKX0gdGVzdEZuIFRoZSB0ZXN0IGZ1bmN0aW9uLiBJZiBhbiBhcmd1bWVudCBpc1xuICogICAgIGFjY2VwdGVkLCB0aGUgdGVzdCB3aWxsIGJlIHRyZWF0ZWQgYXMgYXN5bmMsIGp1c3QgbGlrZSBNb2NoYSB0ZXN0cy5cbiAqL1xud2luZG93LnRlc3RJbW1lZGlhdGUgPSBmdW5jdGlvbiB0ZXN0SW1tZWRpYXRlKG5hbWUsIHRlc3RGbikge1xuICBpZiAodGVzdEZuLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gdGVzdEltbWVkaWF0ZUFzeW5jKG5hbWUsIHRlc3RGbik7XG4gIH1cblxuICB2YXIgZXJyO1xuICB0cnkge1xuICAgIHRlc3RGbigpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVyciA9IGVycm9yO1xuICB9XG5cbiAgdGVzdChuYW1lLCBmdW5jdGlvbihkb25lKSB7XG4gICAgZG9uZShlcnIpO1xuICB9KTtcbn07XG5cbi8qKlxuICogQW4gYXN5bmMtb25seSB2YXJpYW50IG9mIGB0ZXN0SW1tZWRpYXRlYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtmdW5jdGlvbig/ZnVuY3Rpb24oKSl9IHRlc3RGblxuICovXG53aW5kb3cudGVzdEltbWVkaWF0ZUFzeW5jID0gZnVuY3Rpb24gdGVzdEltbWVkaWF0ZUFzeW5jKG5hbWUsIHRlc3RGbikge1xuICB2YXIgdGVzdENvbXBsZXRlID0gZmFsc2U7XG4gIHZhciBlcnI7XG5cbiAgdGVzdChuYW1lLCBmdW5jdGlvbihkb25lKSB7XG4gICAgdmFyIGludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGVzdENvbXBsZXRlKSByZXR1cm47XG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpO1xuICAgICAgZG9uZShlcnIpO1xuICAgIH0sIDEwKTtcbiAgfSk7XG5cbiAgdHJ5IHtcbiAgICB0ZXN0Rm4oZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvcikgZXJyID0gZXJyb3I7XG4gICAgICB0ZXN0Q29tcGxldGUgPSB0cnVlO1xuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVyciA9IGVycm9yO1xuICB9XG59O1xuXG4vKipcbiAqIFRyaWdnZXJzIGEgZmx1c2ggb2YgYW55IHBlbmRpbmcgZXZlbnRzLCBvYnNlcnZhdGlvbnMsIGV0YyBhbmQgY2FsbHMgeW91IGJhY2tcbiAqIGFmdGVyIHRoZXkgaGF2ZSBiZWVuIHByb2Nlc3NlZC5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCl9IGNhbGxiYWNrXG4gKi9cbndpbmRvdy5mbHVzaCA9IGZ1bmN0aW9uIGZsdXNoKGNhbGxiYWNrKSB7XG4gIC8vIElkZWFsbHksIHRoaXMgZnVuY3Rpb24gd291bGQgYmUgYSBjYWxsIHRvIFBvbHltZXIuZmx1c2gsIGJ1dCB0aGF0IGRvZXNuJ3RcbiAgLy8gc3VwcG9ydCBhIGNhbGxiYWNrIHlldCAoaHR0cHM6Ly9naXRodWIuY29tL1BvbHltZXIvcG9seW1lci1kZXYvaXNzdWVzLzExNSksXG4gIC8vIC4uLmFuZCB0aGVyZSdzIGNyb3NzLWJyb3dzZXIgZmxha2luZXNzIHRvIGRlYWwgd2l0aC5cblxuICAvLyBNYWtlIHN1cmUgdGhhdCB3ZSdyZSBpbnZva2luZyB0aGUgY2FsbGJhY2sgd2l0aCBubyBhcmd1bWVudHMgc28gdGhhdCB0aGVcbiAgLy8gY2FsbGVyIGNhbiBwYXNzIE1vY2hhIGNhbGxiYWNrcywgZXRjLlxuICB2YXIgZG9uZSA9IGZ1bmN0aW9uIGRvbmUoKSB7IGNhbGxiYWNrKCk7IH07XG5cbiAgLy8gQmVjYXVzZSBlbmRPZk1pY3JvdGFzayBpcyBmbGFreSBmb3IgSUUsIHdlIHBlcmZvcm0gbWljcm90YXNrIGNoZWNrcG9pbnRzXG4gIC8vIG91cnNlbHZlcyAoaHR0cHM6Ly9naXRodWIuY29tL1BvbHltZXIvcG9seW1lci1kZXYvaXNzdWVzLzExNCk6XG4gIHZhciBpc0lFID0gbmF2aWdhdG9yLmFwcE5hbWUgPT0gJ01pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3Jlcic7XG4gIGlmIChpc0lFICYmIHdpbmRvdy5QbGF0Zm9ybSAmJiB3aW5kb3cuUGxhdGZvcm0ucGVyZm9ybU1pY3JvdGFza0NoZWNrcG9pbnQpIHtcbiAgICB2YXIgcmVhbGx5RG9uZSA9IGRvbmU7XG4gICAgZG9uZSA9IGZ1bmN0aW9uIGRvbmVJRSgpIHtcbiAgICAgIFBsYXRmb3JtLnBlcmZvcm1NaWNyb3Rhc2tDaGVja3BvaW50KCk7XG4gICAgICBzZXRUaW1lb3V0KHJlYWxseURvbmUsIDApO1xuICAgIH07XG4gIH1cblxuICAvLyBFdmVyeW9uZSBlbHNlIGdldHMgYSByZWd1bGFyIGZsdXNoLlxuICB2YXIgc2NvcGUgPSB3aW5kb3cuUG9seW1lciB8fCB3aW5kb3cuV2ViQ29tcG9uZW50cztcbiAgaWYgKHNjb3BlICYmIHNjb3BlLmZsdXNoKSB7XG4gICAgc2NvcGUuZmx1c2goKTtcbiAgfVxuXG4gIC8vIEVuc3VyZSB0aGF0IHdlIGFyZSBjcmVhdGluZyBhIG5ldyBfdGFza18gdG8gYWxsb3cgYWxsIGFjdGl2ZSBtaWNyb3Rhc2tzIHRvXG4gIC8vIGZpbmlzaCAodGhlIGNvZGUgeW91J3JlIHRlc3RpbmcgbWF5IGJlIHVzaW5nIGVuZE9mTWljcm90YXNrLCB0b28pLlxuICBzZXRUaW1lb3V0KGRvbmUsIDApO1xufTtcblxuLyoqXG4gKiBBZHZhbmNlcyBhIHNpbmdsZSBhbmltYXRpb24gZnJhbWUuXG4gKlxuICogQ2FsbHMgYGZsdXNoYCwgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAsIGBmbHVzaGAsIGFuZCBgY2FsbGJhY2tgIHNlcXVlbnRpYWxseVxuICogQHBhcmFtIHtmdW5jdGlvbigpfSBjYWxsYmFja1xuICovXG53aW5kb3cuYW5pbWF0aW9uRnJhbWVGbHVzaCA9IGZ1bmN0aW9uIGFuaW1hdGlvbkZyYW1lRmx1c2goY2FsbGJhY2spIHtcbiAgZmx1c2goZnVuY3Rpb24oKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgZmx1c2goY2FsbGJhY2spO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbi8qKlxuICogREVQUkVDQVRFRDogVXNlIGBmbHVzaGAuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG53aW5kb3cuYXN5bmNQbGF0Zm9ybUZsdXNoID0gZnVuY3Rpb24gYXN5bmNQbGF0Zm9ybUZsdXNoKGNhbGxiYWNrKSB7XG4gIGNvbnNvbGUud2FybignYXN5bmNQbGF0Zm9ybUZsdXNoIGlzIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgdGhlIG1vcmUgdGVyc2UgZmx1c2goKScpO1xuICByZXR1cm4gd2luZG93LmZsdXNoKGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICpcbiAqL1xud2luZG93LndhaXRGb3IgPSBmdW5jdGlvbiB3YWl0Rm9yKGZuLCBuZXh0LCBpbnRlcnZhbE9yTXV0YXRpb25FbCwgdGltZW91dCwgdGltZW91dFRpbWUpIHtcbiAgdGltZW91dFRpbWUgPSB0aW1lb3V0VGltZSB8fCBEYXRlLm5vdygpICsgKHRpbWVvdXQgfHwgMTAwMCk7XG4gIGludGVydmFsT3JNdXRhdGlvbkVsID0gaW50ZXJ2YWxPck11dGF0aW9uRWwgfHwgMzI7XG4gIHRyeSB7XG4gICAgZm4oKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChEYXRlLm5vdygpID4gdGltZW91dFRpbWUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc05hTihpbnRlcnZhbE9yTXV0YXRpb25FbCkpIHtcbiAgICAgICAgaW50ZXJ2YWxPck11dGF0aW9uRWwub25NdXRhdGlvbihpbnRlcnZhbE9yTXV0YXRpb25FbCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2FpdEZvcihmbiwgbmV4dCwgaW50ZXJ2YWxPck11dGF0aW9uRWwsIHRpbWVvdXQsIHRpbWVvdXRUaW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHdhaXRGb3IoZm4sIG5leHQsIGludGVydmFsT3JNdXRhdGlvbkVsLCB0aW1lb3V0LCB0aW1lb3V0VGltZSk7XG4gICAgICAgIH0sIGludGVydmFsT3JNdXRhdGlvbkVsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgbmV4dCgpO1xufTtcblxufSkoKTtcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAxNCBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG4gKiBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuICogc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcbiAqL1xuKGZ1bmN0aW9uKCkge1xuXG5XQ1QuTXVsdGlSdW5uZXIgPSBNdWx0aVJ1bm5lcjtcblxudmFyIFNUQUNLWV9DT05GSUcgPSB7XG4gIGluZGVudDogJyAgJyxcbiAgbG9jYXRpb25TdHJpcDogW1xuICAgIC9eaHR0cHM/OlxcL1xcL1teXFwvXSsvLFxuICAgIC9cXD9bXFxkXFwuXSskLyxcbiAgXSxcbiAgZmlsdGVyOiBmdW5jdGlvbihsaW5lKSB7XG4gICAgcmV0dXJuIGxpbmUubG9jYXRpb24ubWF0Y2goL3dlYi1jb21wb25lbnQtdGVzdGVyXFwvYnJvd3Nlci5qcy8pO1xuICB9LFxufTtcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3Zpc2lvbm1lZGlhL21vY2hhL2Jsb2IvbWFzdGVyL2xpYi9ydW5uZXIuanMjTDM2LTQ2XG52YXIgTU9DSEFfRVZFTlRTID0gW1xuICAnc3RhcnQnLFxuICAnZW5kJyxcbiAgJ3N1aXRlJyxcbiAgJ3N1aXRlIGVuZCcsXG4gICd0ZXN0JyxcbiAgJ3Rlc3QgZW5kJyxcbiAgJ2hvb2snLFxuICAnaG9vayBlbmQnLFxuICAncGFzcycsXG4gICdmYWlsJyxcbiAgJ3BlbmRpbmcnLFxuXTtcblxuLy8gVW50aWwgYSBzdWl0ZSBoYXMgbG9hZGVkLCB3ZSBhc3N1bWUgdGhpcyBtYW55IHRlc3RzIGluIGl0LlxudmFyIEVTVElNQVRFRF9URVNUU19QRVJfU1VJVEUgPSAzO1xuXG4vKipcbiAqIEEgTW9jaGEtbGlrZSBydW5uZXIgdGhhdCBjb21iaW5lcyB0aGUgb3V0cHV0IG9mIG11bHRpcGxlIE1vY2hhIHN1aXRlcy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtU3VpdGVzIFRoZSBudW1iZXIgb2Ygc3VpdGVzIHRoYXQgd2lsbCBiZSBydW4sIGluIG9yZGVyIHRvXG4gKiAgICAgZXN0aW1hdGUgdGhlIHRvdGFsIG51bWJlciBvZiB0ZXN0cyB0aGF0IHdpbGwgYmUgcGVyZm9ybWVkLlxuICogQHBhcmFtIHshQXJyYXkuPCFNb2NoYS5yZXBvcnRlcnMuQmFzZT59IHJlcG9ydGVycyBUaGUgc2V0IG9mIHJlcG9ydGVycyB0aGF0XG4gKiAgICAgc2hvdWxkIHJlY2VpdmUgdGhlIHVuaWZpZWQgZXZlbnQgc3RyZWFtLlxuICovXG5mdW5jdGlvbiBNdWx0aVJ1bm5lcihudW1TdWl0ZXMsIHJlcG9ydGVycykge1xuICB0aGlzLnJlcG9ydGVycyA9IHJlcG9ydGVycy5tYXAoZnVuY3Rpb24ocmVwb3J0ZXIpIHtcbiAgICByZXR1cm4gbmV3IHJlcG9ydGVyKHRoaXMpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIHRoaXMudG90YWwgPSBudW1TdWl0ZXMgKiBFU1RJTUFURURfVEVTVFNfUEVSX1NVSVRFO1xuICAvLyBNb2NoYSByZXBvcnRlcnMgYXNzdW1lIGEgc3RyZWFtIG9mIGV2ZW50cywgc28gd2UgaGF2ZSB0byBiZSBjYXJlZnVsIHRvIG9ubHlcbiAgLy8gcmVwb3J0IG9uIG9uZSBydW5uZXIgYXQgYSB0aW1lLi4uXG4gIHRoaXMuY3VycmVudFJ1bm5lciA9IG51bGw7XG4gIC8vIC4uLndoaWxlIHdlIGJ1ZmZlciBldmVudHMgZm9yIGFueSBvdGhlciBhY3RpdmUgcnVubmVycy5cbiAgdGhpcy5wZW5kaW5nRXZlbnRzID0gW107XG5cbiAgdGhpcy5lbWl0KCdzdGFydCcpO1xufVxuLy8gTW9jaGEgZG9lc24ndCBleHBvc2UgaXRzIGBFdmVudEVtaXR0ZXJgIHNoaW0gZGlyZWN0bHksIHNvOlxuTXVsdGlSdW5uZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YoTW9jaGEuUnVubmVyLnByb3RvdHlwZSkpO1xuXG4vKipcbiAqIEByZXR1cm4geyFNb2NoYS5yZXBvcnRlcnMuQmFzZX0gQSByZXBvcnRlci1saWtlIFwiY2xhc3NcIiBmb3IgZWFjaCBjaGlsZCBzdWl0ZVxuICogICAgIHRoYXQgc2hvdWxkIGJlIHBhc3NlZCB0byBgbW9jaGEucnVuYC5cbiAqL1xuTXVsdGlSdW5uZXIucHJvdG90eXBlLmNoaWxkUmVwb3J0ZXIgPSBmdW5jdGlvbiBjaGlsZFJlcG9ydGVyKG5hbWUpIHtcbiAgLy8gVGhlIHJlcG9ydGVyIGlzIHVzZWQgYXMgYSBjb25zdHJ1Y3Rvciwgc28gd2UgY2FuJ3QgZGVwZW5kIG9uIGB0aGlzYCBiZWluZ1xuICAvLyBwcm9wZXJseSBib3VuZC5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBmdW5jdGlvbiByZXBvcnRlcihydW5uZXIpIHtcbiAgICBydW5uZXIubmFtZSA9IG5hbWU7XG4gICAgc2VsZi5iaW5kQ2hpbGRSdW5uZXIocnVubmVyKTtcbiAgfVxuICByZXBvcnRlci50aXRsZSA9IG5hbWU7XG4gIHJldHVybiByZXBvcnRlcjtcbn07XG5cbi8qKiBNdXN0IGJlIGNhbGxlZCBvbmNlIGFsbCBydW5uZXJzIGhhdmUgZmluaXNoZWQuICovXG5NdWx0aVJ1bm5lci5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uIGRvbmUoKSB7XG4gIHRoaXMuY29tcGxldGUgPSB0cnVlO1xuICB0aGlzLmVtaXQoJ2VuZCcpO1xuICB0aGlzLmZsdXNoUGVuZGluZ0V2ZW50cygpO1xufTtcblxuLyoqXG4gKiBFbWl0IGEgdG9wIGxldmVsIHRlc3QgdGhhdCBpcyBub3QgcGFydCBvZiBhbnkgc3VpdGUgbWFuYWdlZCBieSB0aGlzIHJ1bm5lci5cbiAqXG4gKiBIZWxwZnVsIGZvciByZXBvcnRpbmcgb24gZ2xvYmFsIGVycm9ycywgbG9hZGluZyBpc3N1ZXMsIGV0Yy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgVGhlIHRpdGxlIG9mIHRoZSB0ZXN0LlxuICogQHBhcmFtIHsqfSBvcHRfZXJyb3IgQW4gZXJyb3IgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdGVzdC4gSWYgZmFsc3ksIHRlc3QgaXNcbiAqICAgICBjb25zaWRlcmVkIHRvIGJlIHBhc3NpbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0X3N1aXRlVGl0bGUgVGl0bGUgZm9yIHRoZSBzdWl0ZSB0aGF0J3Mgd3JhcHBpbmcgdGhlIHRlc3QuXG4gKiBAcGFyYW0gez9ib29sZWFufSBvcHRfZXN0aW1hdGVkIElmIHRoaXMgdGVzdCB3YXMgaW5jbHVkZWQgaW4gdGhlIG9yaWdpbmFsXG4gKiAgICAgZXN0aW1hdGUgb2YgYG51bVN1aXRlc2AuXG4gKi9cbk11bHRpUnVubmVyLnByb3RvdHlwZS5lbWl0T3V0T2ZCYW5kVGVzdCA9IGZ1bmN0aW9uIGVtaXRPdXRPZkJhbmRUZXN0KHRpdGxlLCBvcHRfZXJyb3IsIG9wdF9zdWl0ZVRpdGxlLCBvcHRfZXN0aW1hdGVkKSB7XG4gIFdDVC51dGlsLmRlYnVnKCdNdWx0aVJ1bm5lciNlbWl0T3V0T2ZCYW5kVGVzdCgnLCBhcmd1bWVudHMsICcpJyk7XG4gIHZhciByb290ID0gbmV3IE1vY2hhLlN1aXRlKCk7XG4gIHJvb3QudGl0bGUgPSBvcHRfc3VpdGVUaXRsZTtcbiAgdmFyIHRlc3QgPSBuZXcgTW9jaGEuVGVzdCh0aXRsZSwgZnVuY3Rpb24oKSB7XG4gIH0pO1xuICB0ZXN0LnBhcmVudCA9IHJvb3Q7XG4gIHRlc3Quc3RhdGUgID0gb3B0X2Vycm9yID8gJ2ZhaWxlZCcgOiAncGFzc2VkJztcbiAgdGVzdC5lcnIgICAgPSBvcHRfZXJyb3I7XG5cbiAgaWYgKCFvcHRfZXN0aW1hdGVkKSB7XG4gICAgdGhpcy50b3RhbCA9IHRoaXMudG90YWwgKyBFU1RJTUFURURfVEVTVFNfUEVSX1NVSVRFO1xuICB9XG5cbiAgdmFyIHJ1bm5lciA9IHt0b3RhbDogMX07XG4gIHRoaXMucHJveHlFdmVudCgnc3RhcnQnLCBydW5uZXIpO1xuICB0aGlzLnByb3h5RXZlbnQoJ3N1aXRlJywgcnVubmVyLCByb290KTtcbiAgdGhpcy5wcm94eUV2ZW50KCd0ZXN0JywgcnVubmVyLCB0ZXN0KTtcbiAgaWYgKG9wdF9lcnJvcikge1xuICAgIHRoaXMucHJveHlFdmVudCgnZmFpbCcsIHJ1bm5lciwgdGVzdCwgb3B0X2Vycm9yKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnByb3h5RXZlbnQoJ3Bhc3MnLCBydW5uZXIsIHRlc3QpO1xuICB9XG4gIHRoaXMucHJveHlFdmVudCgndGVzdCBlbmQnLCBydW5uZXIsIHRlc3QpO1xuICB0aGlzLnByb3h5RXZlbnQoJ3N1aXRlIGVuZCcsIHJ1bm5lciwgcm9vdCk7XG4gIHRoaXMucHJveHlFdmVudCgnZW5kJywgcnVubmVyKTtcbn07XG5cbi8vIEludGVybmFsIEludGVyZmFjZVxuXG4vKiogQHBhcmFtIHshTW9jaGEucnVubmVycy5CYXNlfSBydW5uZXIgVGhlIHJ1bm5lciB0byBsaXN0ZW4gdG8gZXZlbnRzIGZvci4gKi9cbk11bHRpUnVubmVyLnByb3RvdHlwZS5iaW5kQ2hpbGRSdW5uZXIgPSBmdW5jdGlvbiBiaW5kQ2hpbGRSdW5uZXIocnVubmVyKSB7XG4gIE1PQ0hBX0VWRU5UUy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgIHJ1bm5lci5vbihldmVudE5hbWUsIHRoaXMucHJveHlFdmVudC5iaW5kKHRoaXMsIGV2ZW50TmFtZSwgcnVubmVyKSk7XG4gIH0uYmluZCh0aGlzKSk7XG59O1xuXG4vKipcbiAqIEV2YWx1YXRlcyBhbiBldmVudCBmaXJlZCBieSBgcnVubmVyYCwgcHJveHlpbmcgaXQgZm9yd2FyZCBvciBidWZmZXJpbmcgaXQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICogQHBhcmFtIHshTW9jaGEucnVubmVycy5CYXNlfSBydW5uZXIgVGhlIHJ1bm5lciB0aGF0IGVtaXR0ZWQgdGhpcyBldmVudC5cbiAqIEBwYXJhbSB7Li4uKn0gdmFyX2FyZ3MgQW55IGFkZGl0aW9uYWwgZGF0YSBwYXNzZWQgYXMgcGFydCBvZiB0aGUgZXZlbnQuXG4gKi9cbk11bHRpUnVubmVyLnByb3RvdHlwZS5wcm94eUV2ZW50ID0gZnVuY3Rpb24gcHJveHlFdmVudChldmVudE5hbWUsIHJ1bm5lciwgdmFyX2FyZ3MpIHtcbiAgdmFyIGV4dHJhQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gIGlmICh0aGlzLmNvbXBsZXRlKSB7XG4gICAgY29uc29sZS53YXJuKCdvdXQgb2Ygb3JkZXIgTW9jaGEgZXZlbnQgZm9yICcgKyBydW5uZXIubmFtZSArICc6JywgZXZlbnROYW1lLCBleHRyYUFyZ3MpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0aGlzLmN1cnJlbnRSdW5uZXIgJiYgcnVubmVyICE9PSB0aGlzLmN1cnJlbnRSdW5uZXIpIHtcbiAgICB0aGlzLnBlbmRpbmdFdmVudHMucHVzaChhcmd1bWVudHMpO1xuICAgIHJldHVybjtcbiAgfVxuICBXQ1QudXRpbC5kZWJ1ZygnTXVsdGlSdW5uZXIjcHJveHlFdmVudCgnLCBhcmd1bWVudHMsICcpJyk7XG5cbiAgLy8gVGhpcyBhcHBlYXJzIHRvIGJlIGEgTW9jaGEgYnVnOiBUZXN0cyBmYWlsZWQgYnkgcGFzc2luZyBhbiBlcnJvciB0byB0aGVpclxuICAvLyBkb25lIGZ1bmN0aW9uIGRvbid0IHNldCBgZXJyYCBwcm9wZXJseS5cbiAgLy9cbiAgLy8gVE9ETyhuZXZpcik6IFRyYWNrIGRvd24uXG4gIGlmIChldmVudE5hbWUgPT09ICdmYWlsJyAmJiAhZXh0cmFBcmdzWzBdLmVycikge1xuICAgIGV4dHJhQXJnc1swXS5lcnIgPSBleHRyYUFyZ3NbMV07XG4gIH1cblxuICBpZiAoZXZlbnROYW1lID09PSAnc3RhcnQnKSB7XG4gICAgdGhpcy5vblJ1bm5lclN0YXJ0KHJ1bm5lcik7XG4gIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSAnZW5kJykge1xuICAgIHRoaXMub25SdW5uZXJFbmQocnVubmVyKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmNsZWFuRXZlbnQoZXZlbnROYW1lLCBydW5uZXIsIGV4dHJhQXJncyk7XG4gICAgdGhpcy5lbWl0LmFwcGx5KHRoaXMsIFtldmVudE5hbWVdLmNvbmNhdChleHRyYUFyZ3MpKTtcbiAgfVxufTtcblxuLyoqXG4gKiBDbGVhbnMgb3IgbW9kaWZpZXMgYW4gZXZlbnQgaWYgbmVlZGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcbiAqIEBwYXJhbSB7IU1vY2hhLnJ1bm5lcnMuQmFzZX0gcnVubmVyIFRoZSBydW5uZXIgdGhhdCBlbWl0dGVkIHRoaXMgZXZlbnQuXG4gKiBAcGFyYW0geyFBcnJheS48Kj59IGV4dHJhQXJnc1xuICovXG5NdWx0aVJ1bm5lci5wcm90b3R5cGUuY2xlYW5FdmVudCA9IGZ1bmN0aW9uIGNsZWFuRXZlbnQoZXZlbnROYW1lLCBydW5uZXIsIGV4dHJhQXJncykge1xuICAvLyBTdWl0ZSBoaWVyYXJjaHlcbiAgaWYgKGV4dHJhQXJnc1swXSkge1xuICAgIGV4dHJhQXJnc1swXSA9IHRoaXMuc2hvd1Jvb3RTdWl0ZShleHRyYUFyZ3NbMF0pO1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIGVycm9yc1xuICBpZiAoZXZlbnROYW1lID09PSAnZmFpbCcpIHtcbiAgICBleHRyYUFyZ3NbMV0gPSBTdGFja3kubm9ybWFsaXplKGV4dHJhQXJnc1sxXSwgU1RBQ0tZX0NPTkZJRyk7XG4gIH1cbiAgaWYgKGV4dHJhQXJnc1swXSAmJiBleHRyYUFyZ3NbMF0uZXJyKSB7XG4gICAgZXh0cmFBcmdzWzBdLmVyciA9IFN0YWNreS5ub3JtYWxpemUoZXh0cmFBcmdzWzBdLmVyciwgU1RBQ0tZX0NPTkZJRyk7XG4gIH1cbn07XG5cbi8qKlxuICogV2UgbGlrZSB0byBzaG93IHRoZSByb290IHN1aXRlJ3MgdGl0bGUsIHdoaWNoIHJlcXVpcmVzIGEgbGl0dGxlIGJpdCBvZlxuICogdHJpY2tlcnkgaW4gdGhlIHN1aXRlIGhpZXJhcmNoeS5cbiAqXG4gKiBAcGFyYW0geyFNb2NoYS5SdW5uYWJsZX0gbm9kZVxuICovXG5NdWx0aVJ1bm5lci5wcm90b3R5cGUuc2hvd1Jvb3RTdWl0ZSA9IGZ1bmN0aW9uIHNob3dSb290U3VpdGUobm9kZSkge1xuICB2YXIgbGVhZiA9IG5vZGUgPSBPYmplY3QuY3JlYXRlKG5vZGUpO1xuICB3aGlsZSAobm9kZSAmJiAhbm9kZS5yb290KSB7XG4gICAgdmFyIHdyYXBwZWRQYXJlbnQgPSBPYmplY3QuY3JlYXRlKG5vZGUucGFyZW50KTtcbiAgICBub2RlLnBhcmVudCA9IHdyYXBwZWRQYXJlbnQ7XG4gICAgbm9kZSA9IHdyYXBwZWRQYXJlbnQ7XG4gIH1cbiAgbm9kZS5yb290ID0gZmFsc2U7XG5cbiAgcmV0dXJuIGxlYWY7XG59O1xuXG4vKiogQHBhcmFtIHshTW9jaGEucnVubmVycy5CYXNlfSBydW5uZXIgKi9cbk11bHRpUnVubmVyLnByb3RvdHlwZS5vblJ1bm5lclN0YXJ0ID0gZnVuY3Rpb24gb25SdW5uZXJTdGFydChydW5uZXIpIHtcbiAgV0NULnV0aWwuZGVidWcoJ011bHRpUnVubmVyI29uUnVubmVyU3RhcnQ6JywgcnVubmVyLm5hbWUpO1xuICB0aGlzLnRvdGFsID0gdGhpcy50b3RhbCAtIEVTVElNQVRFRF9URVNUU19QRVJfU1VJVEUgKyBydW5uZXIudG90YWw7XG4gIHRoaXMuY3VycmVudFJ1bm5lciA9IHJ1bm5lcjtcbn07XG5cbi8qKiBAcGFyYW0geyFNb2NoYS5ydW5uZXJzLkJhc2V9IHJ1bm5lciAqL1xuTXVsdGlSdW5uZXIucHJvdG90eXBlLm9uUnVubmVyRW5kID0gZnVuY3Rpb24gb25SdW5uZXJFbmQocnVubmVyKSB7XG4gIFdDVC51dGlsLmRlYnVnKCdNdWx0aVJ1bm5lciNvblJ1bm5lckVuZDonLCBydW5uZXIubmFtZSk7XG4gIHRoaXMuY3VycmVudFJ1bm5lciA9IG51bGw7XG4gIHRoaXMuZmx1c2hQZW5kaW5nRXZlbnRzKCk7XG59O1xuXG4vKipcbiAqIEZsdXNoZXMgYW55IGJ1ZmZlcmVkIGV2ZW50cyBhbmQgcnVucyB0aGVtIHRocm91Z2ggYHByb3h5RXZlbnRgLiBUaGlzIHdpbGxcbiAqIGxvb3AgdW50aWwgYWxsIGJ1ZmZlcmVkIHJ1bm5lcnMgYXJlIGNvbXBsZXRlLCBvciB3ZSBoYXZlIHJ1biBvdXQgb2YgYnVmZmVyZWRcbiAqIGV2ZW50cy5cbiAqL1xuTXVsdGlSdW5uZXIucHJvdG90eXBlLmZsdXNoUGVuZGluZ0V2ZW50cyA9IGZ1bmN0aW9uIGZsdXNoUGVuZGluZ0V2ZW50cygpIHtcbiAgdmFyIGV2ZW50cyA9IHRoaXMucGVuZGluZ0V2ZW50cztcbiAgdGhpcy5wZW5kaW5nRXZlbnRzID0gW107XG4gIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50QXJncykge1xuICAgIHRoaXMucHJveHlFdmVudC5hcHBseSh0aGlzLCBldmVudEFyZ3MpO1xuICB9LmJpbmQodGhpcykpO1xufTtcblxufSkoKTtcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAxNCBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG4gKiBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuICogc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcbiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKlxuICogUnVucyBhbGwgdGVzdHMgZGVzY3JpYmVkIGJ5IHRoaXMgZG9jdW1lbnQsIGFmdGVyIGdpdmluZyB0aGUgZG9jdW1lbnQgYSBjaGFuY2VcbiAqIHRvIGxvYWQuXG4gKlxuICogSWYgYFdDVC53YWl0Rm9yRnJhbWV3b3Jrc2AgaXMgdHJ1ZSAodGhlIGRlZmF1bHQpLCB3ZSB3aWxsIGFsc28gd2FpdCBmb3IgYW55XG4gKiBwcmVzZW50IHdlYiBjb21wb25lbnQgZnJhbWV3b3JrcyB0byBoYXZlIGZ1bGx5IGluaXRpYWxpemVkIGFzIHdlbGwuXG4gKi9cbihmdW5jdGlvbigpIHtcblxuLy8gV2UgZG8gYSBiaXQgb2Ygb3VyIG93biBncmVwIHByb2Nlc3NpbmcgdG8gc3BlZWQgdGhpbmdzIHVwLlxudmFyIGdyZXAgPSBXQ1QudXRpbC5nZXRQYXJhbSgnZ3JlcCcpO1xuXG4vLyBlbnZpcm9ubWVudC5qcyBpcyBvcHRpb25hbDsgd2UgbmVlZCB0byB0YWtlIGEgbG9vayBhdCBvdXIgc2NyaXB0J3MgVVJMIGluXG4vLyBvcmRlciB0byBkZXRlcm1pbmUgaG93IChvciBub3QpIHRvIGxvYWQgaXQuXG52YXIgcHJlZml4ICA9IHdpbmRvdy5XQ1RQcmVmaXg7XG52YXIgbG9hZEVudiA9ICF3aW5kb3cuV0NUU2tpcEVudmlyb25tZW50O1xuXG52YXIgc2NyaXB0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFtzcmMqPVwiYnJvd3Nlci5qc1wiXScpO1xuaWYgKHNjcmlwdHMubGVuZ3RoICE9PSAxICYmICFwcmVmaXgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZGV0ZWN0IHJvb3QgVVJMIGZvciBXQ1QuIFBsZWFzZSBzZXQgV0NUUHJlZml4IGJlZm9yZSBpbmNsdWRpbmcgYnJvd3Nlci5qcycpO1xufVxuaWYgKHNjcmlwdHNbMF0pIHtcbiAgdmFyIHRoaXNTY3JpcHQgPSBzY3JpcHRzWzBdLnNyYztcbiAgcHJlZml4ICA9IHRoaXNTY3JpcHQuc3Vic3RyaW5nKDAsIHRoaXNTY3JpcHQuaW5kZXhPZignYnJvd3Nlci5qcycpKTtcbiAgLy8gWW91IGNhbiB0YWNrID9za2lwRW52IG9udG8gdGhlIGJyb3dzZXIgVVJMIHRvIHNraXAgdGhlIGRlZmF1bHQgZW52aXJvbm1lbnQuXG4gIGxvYWRFbnYgPSB0aGlzU2NyaXB0LmluZGV4T2YoJ3NraXBFbnYnKSA9PT0gLTE7XG59XG5pZiAobG9hZEVudikge1xuICAvLyBTeW5jaHJvbm91cyBsb2FkIHNvIHRoYXQgd2UgY2FuIGd1YXJhbnRlZSBpdCBpcyBzZXQgdXAgZm9yIGVhcmx5IHRlc3RzLlxuICBkb2N1bWVudC53cml0ZSgnPHNjcmlwdCBzcmM9XCInICsgcHJlZml4ICsgJ2Vudmlyb25tZW50LmpzXCI+PC9zY3JpcHQ+Jyk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxufVxuXG4vLyBHaXZlIGFueSBzY3JpcHRzIG9uIHRoZSBwYWdlIGEgY2hhbmNlIHRvIHR3aWRkbGUgdGhlIGVudmlyb25tZW50LlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICBXQ1QudXRpbC5kZWJ1ZygncnVuIHN0YWdlOiBET01Db250ZW50TG9hZGVkJyk7XG4gIHZhciBzdWJTdWl0ZSA9IFdDVC5TdWJTdWl0ZS5jdXJyZW50KCk7XG4gIGlmIChzdWJTdWl0ZSkge1xuICAgIFdDVC51dGlsLmRlYnVnKCdydW4gc3RhZ2U6IHN1YnN1aXRlJyk7XG4gICAgLy8gR2l2ZSB0aGUgc3Vic3VpdGUgdGltZSB0byBjb21wbGV0ZSBpdHMgbG9hZCAoc2VlIGBTdWJTdWl0ZS5sb2FkYCkuXG4gICAgc2V0VGltZW91dChydW5TdWJTdWl0ZS5iaW5kKG51bGwsIHN1YlN1aXRlKSwgMCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQmVmb3JlIGFueXRoaW5nIGVsc2UsIHdlIG5lZWQgdG8gZW5zdXJlIG91ciBjb21tdW5pY2F0aW9uIGNoYW5uZWwgd2l0aCB0aGVcbiAgLy8gQ0xJIHJ1bm5lciBpcyBlc3RhYmxpc2hlZCAoaWYgd2UncmUgcnVubmluZyBpbiB0aGF0IGNvbnRleHQpLiBMZXNzXG4gIC8vIGJ1ZmZlcmluZyB0byBkZWFsIHdpdGguXG4gIFdDVC5DTElTb2NrZXQuaW5pdChmdW5jdGlvbihlcnJvciwgc29ja2V0KSB7XG4gICAgV0NULnV0aWwuZGVidWcoJ3J1biBzdGFnZTogV0NULkNMSVNvY2tldC5pbml0IGRvbmUnLCBlcnJvcik7XG4gICAgaWYgKGVycm9yKSB0aHJvdyBlcnJvcjtcbiAgICB2YXIgc3Vic3VpdGVzID0gV0NULl9zdWl0ZXNUb0xvYWQ7XG4gICAgaWYgKGdyZXApIHtcbiAgICAgIHZhciBjbGVhblN1YnN1aXRlcyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIHN1YnN1aXRlOyBzdWJzdWl0ZSA9IHN1YnN1aXRlc1tpXTsgaSsrKSB7XG4gICAgICAgIGlmIChzdWJzdWl0ZS5pbmRleE9mKGdyZXApID09PSAwKSB7XG4gICAgICAgICAgY2xlYW5TdWJzdWl0ZXMucHVzaChzdWJzdWl0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN1YnN1aXRlcyA9IGNsZWFuU3Vic3VpdGVzO1xuICAgIH1cblxuICAgIHZhciBydW5uZXIgPSBuZXdNdWx0aVN1aXRlUnVubmVyKHN1YnN1aXRlcywgZGV0ZXJtaW5lUmVwb3J0ZXJzKHNvY2tldCkpO1xuXG4gICAgbG9hZERlcGVuZGVuY2llcyhydW5uZXIsIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBXQ1QudXRpbC5kZWJ1ZygncnVuIHN0YWdlOiBsb2FkRGVwZW5kZW5jaWVzIGRvbmUnLCBlcnJvcik7XG4gICAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yO1xuXG4gICAgICBydW5NdWx0aVN1aXRlKHJ1bm5lciwgc3Vic3VpdGVzKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuLyoqXG4gKiBMb2FkcyBhbnkgZGVwZW5kZW5jaWVzIG9mIHRoZSBfY3VycmVudF8gc3VpdGUgKGUuZy4gYC5qc2Agc291cmNlcykuXG4gKlxuICogQHBhcmFtIHshV0NULk11bHRpUnVubmVyfSBydW5uZXIgVGhlIHJ1bm5lciB3aGVyZSBlcnJvcnMgc2hvdWxkIGJlIHJlcG9ydGVkLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZG9uZSBBIG5vZGUgc3R5bGUgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGxvYWREZXBlbmRlbmNpZXMocnVubmVyLCBkb25lKSB7XG4gIFdDVC51dGlsLmRlYnVnKCdsb2FkRGVwZW5kZW5jaWVzOicsIFdDVC5fZGVwZW5kZW5jaWVzKTtcblxuICBmdW5jdGlvbiBvbkVycm9yKGV2ZW50KSB7XG4gICAgcnVubmVyLmVtaXRPdXRPZkJhbmRUZXN0KCdUZXN0IFN1aXRlIEluaXRpYWxpemF0aW9uJywgZXZlbnQuZXJyb3IpO1xuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuXG4gIHZhciBsb2FkZXJzID0gV0NULl9kZXBlbmRlbmNpZXMubWFwKGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAvLyBXZSBvbmx5IHN1cHBvcnQgYC5qc2AgZGVwZW5kZW5jaWVzIGZvciBub3cuXG4gICAgcmV0dXJuIFdDVC51dGlsLmxvYWRTY3JpcHQuYmluZChXQ1QudXRpbCwgZmlsZSk7XG4gIH0pO1xuXG4gIFdDVC51dGlsLnBhcmFsbGVsKGxvYWRlcnMsIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgZG9uZShlcnJvcik7XG4gIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7IVdDVC5TdWJTdWl0ZX0gc3ViU3VpdGUgVGhlIGBTdWJTdWl0ZWAgZm9yIHRoaXMgZnJhbWUsIHRoYXQgYG1vY2hhYFxuICogICAgIHNob3VsZCBiZSBydW4gZm9yLlxuICovXG5mdW5jdGlvbiBydW5TdWJTdWl0ZShzdWJTdWl0ZSkge1xuICBXQ1QudXRpbC5kZWJ1ZygncnVuU3ViU3VpdGUnLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xuICAvLyBOb3QgdmVyeSBwcmV0dHkuXG4gIHZhciBwYXJlbnRXQ1QgPSBzdWJTdWl0ZS5wYXJlbnRTY29wZS5XQ1Q7XG4gIHN1YlN1aXRlLnByZXBhcmUoV0NUKTtcblxuICB2YXIgc3VpdGVOYW1lID0gcGFyZW50V0NULnV0aWwucmVsYXRpdmVMb2NhdGlvbih3aW5kb3cubG9jYXRpb24pO1xuICB2YXIgcmVwb3J0ZXIgID0gcGFyZW50V0NULl9tdWx0aVJ1bm5lci5jaGlsZFJlcG9ydGVyKHN1aXRlTmFtZSk7XG4gIHJ1bk1vY2hhKHJlcG9ydGVyLCBzdWJTdWl0ZS5kb25lLmJpbmQoc3ViU3VpdGUpKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyFBcnJheS48c3RyaW5nPn0gc3Vic3VpdGVzIFRoZSBzdWJzdWl0ZXMgdGhhdCB3aWxsIGJlIHJ1bi5cbiAqIEBwYXJhbSB7IUFycmF5LjwhTW9jaGEucmVwb3J0ZXJzLkJhc2U+fSByZXBvcnRlcnMgVGhlIHJlcG9ydGVycyB0aGF0IHNob3VsZFxuICogICAgIGNvbnN1bWUgdGhlIG91dHB1dCBvZiB0aGlzIGBNdWx0aVJ1bm5lcmAuXG4gKiBAcmV0dXJuIHshV0NULk11bHRpUnVubmVyfSBUaGUgcnVubmVyIGZvciBvdXIgcm9vdCBzdWl0ZS5cbiAqL1xuZnVuY3Rpb24gbmV3TXVsdGlTdWl0ZVJ1bm5lcihzdWJzdWl0ZXMsIHJlcG9ydGVycykge1xuICBXQ1QudXRpbC5kZWJ1ZygnbmV3TXVsdGlTdWl0ZVJ1bm5lcicsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSk7XG4gIFdDVC5fbXVsdGlSdW5uZXIgPSBuZXcgV0NULk11bHRpUnVubmVyKHN1YnN1aXRlcy5sZW5ndGggKyAxLCByZXBvcnRlcnMpO1xuICByZXR1cm4gV0NULl9tdWx0aVJ1bm5lcjtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyFXQ1QuTXVsdGlSdW5uZXJ9IFRoZSBydW5uZXIgYnVpbHQgdmlhIGBuZXdNdWx0aVN1aXRlUnVubmVyYC5cbiAqIEBwYXJhbSB7IUFycmF5LjxzdHJpbmc+fSBzdWJzdWl0ZXMgVGhlIHN1YnN1aXRlcyB0byBydW4uXG4gKi9cbmZ1bmN0aW9uIHJ1bk11bHRpU3VpdGUocnVubmVyLCBzdWJzdWl0ZXMpIHtcbiAgV0NULnV0aWwuZGVidWcoJ3J1bk11bHRpU3VpdGUnLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xuICB2YXIgcm9vdE5hbWUgPSBXQ1QudXRpbC5yZWxhdGl2ZUxvY2F0aW9uKHdpbmRvdy5sb2NhdGlvbik7XG5cbiAgdmFyIHN1aXRlUnVubmVycyA9IFtcbiAgICAvLyBSdW4gdGhlIGxvY2FsIHRlc3RzIChpZiBhbnkpIGZpcnN0LCBub3Qgc3RvcHBpbmcgb24gZXJyb3I7XG4gICAgcnVuTW9jaGEuYmluZChudWxsLCBydW5uZXIuY2hpbGRSZXBvcnRlcihyb290TmFtZSkpLFxuICBdO1xuXG4gIC8vIEFzIHdlbGwgYXMgYW55IHN1YiBzdWl0ZXMuIEFnYWluLCBkb24ndCBzdG9wIG9uIGVycm9yLlxuICBzdWJzdWl0ZXMuZm9yRWFjaChmdW5jdGlvbihmaWxlKSB7XG4gICAgc3VpdGVSdW5uZXJzLnB1c2goZnVuY3Rpb24obmV4dCkge1xuICAgICAgdmFyIHN1YlN1aXRlID0gbmV3IFdDVC5TdWJTdWl0ZShmaWxlLCB3aW5kb3cpO1xuICAgICAgcnVubmVyLmVtaXQoJ3N1YlN1aXRlIHN0YXJ0Jywgc3ViU3VpdGUpO1xuICAgICAgc3ViU3VpdGUucnVuKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHJ1bm5lci5lbWl0KCdzdWJTdWl0ZSBlbmQnLCBzdWJTdWl0ZSk7XG5cbiAgICAgICAgaWYgKGVycm9yKSBydW5uZXIuZW1pdE91dE9mQmFuZFRlc3QoZmlsZSwgZXJyb3IpO1xuICAgICAgICBuZXh0KCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgV0NULnV0aWwucGFyYWxsZWwoc3VpdGVSdW5uZXJzLCBXQ1QubnVtQ29uY3VycmVudFN1aXRlcywgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICBXQ1QudXRpbC5kZWJ1ZygncnVuTXVsdGlTdWl0ZSBkb25lJywgZXJyb3IpO1xuICAgIHJ1bm5lci5kb25lKCk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEtpY2tzIG9mZiBhIG1vY2hhIHJ1biwgd2FpdGluZyBmb3IgZnJhbWV3b3JrcyB0byBsb2FkIGlmIG5lY2Vzc2FyeS5cbiAqXG4gKiBAcGFyYW0geyFNb2NoYS5yZXBvcnRlcnMuQmFzZX0gcmVwb3J0ZXIgVGhlIHJlcG9ydGVyIHRvIHBhc3MgdG8gYG1vY2hhLnJ1bmAuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBkb25lIEEgY2FsbGJhY2sgZmlyZWQsIF9ubyBlcnJvciBpcyBwYXNzZWRfLlxuICovXG5mdW5jdGlvbiBydW5Nb2NoYShyZXBvcnRlciwgZG9uZSwgd2FpdGVkKSB7XG4gIGlmIChXQ1Qud2FpdEZvckZyYW1ld29ya3MgJiYgIXdhaXRlZCkge1xuICAgIFdDVC51dGlsLndoZW5GcmFtZXdvcmtzUmVhZHkocnVuTW9jaGEuYmluZChudWxsLCByZXBvcnRlciwgZG9uZSwgdHJ1ZSkpO1xuICAgIHJldHVybjtcbiAgfVxuICBXQ1QudXRpbC5kZWJ1ZygncnVuTW9jaGEnLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xuXG4gIG1vY2hhLnJlcG9ydGVyKHJlcG9ydGVyKTtcbiAgbW9jaGEuc3VpdGUudGl0bGUgPSByZXBvcnRlci50aXRsZTtcbiAgbW9jaGEuZ3JlcChncmVwKTtcblxuICAvLyBXZSBjYW4ndCB1c2UgYG1vY2hhLnJ1bmAgYmVjYXVzZSBpdCBiYXNoZXMgb3ZlciBncmVwLCBpbnZlcnQsIGFuZCBmcmllbmRzLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3Zpc2lvbm1lZGlhL21vY2hhL2Jsb2IvbWFzdGVyL3N1cHBvcnQvdGFpbC5qcyNMMTM3XG4gIHZhciBydW5uZXIgPSBNb2NoYS5wcm90b3R5cGUucnVuLmNhbGwobW9jaGEsIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgTW9jaGEudXRpbHMuaGlnaGxpZ2h0VGFncygnY29kZScpO1xuICAgIGRvbmUoKTsgIC8vIFdlIGlnbm9yZSB0aGUgTW9jaGEgZmFpbHVyZSBjb3VudC5cbiAgfSk7XG5cbiAgLy8gTW9jaGEncyBkZWZhdWx0IGBvbmVycm9yYCBoYW5kbGluZyBzdHJpcHMgdGhlIHN0YWNrICh0byBzdXBwb3J0IHJlYWxseSBvbGRcbiAgLy8gYnJvd3NlcnMpLiBXZSB1cGdyYWRlIHRoaXMgdG8gZ2V0IGJldHRlciBzdGFja3MgZm9yIGFzeW5jIGVycm9ycy5cbiAgLy9cbiAgLy8gVE9ETyhuZXZpcik6IENhbiB3ZSBleHBhbmQgc3VwcG9ydCB0byBvdGhlciBicm93c2Vycz9cbiAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2Nocm9tZS9pKSkge1xuICAgIHdpbmRvdy5vbmVycm9yID0gbnVsbDtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgaWYgKCFldmVudC5lcnJvcikgcmV0dXJuO1xuICAgICAgaWYgKGV2ZW50LmVycm9yLmlnbm9yZSkgcmV0dXJuO1xuICAgICAgcnVubmVyLnVuY2F1Z2h0KGV2ZW50LmVycm9yKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEZpZ3VyZSBvdXQgd2hpY2ggcmVwb3J0ZXJzIHNob3VsZCBiZSB1c2VkIGZvciB0aGUgY3VycmVudCBgd2luZG93YC5cbiAqXG4gKiBAcGFyYW0ge1dDVC5DTElTb2NrZXR9IHNvY2tldCBUaGUgQ0xJIHNvY2tldCwgaWYgcHJlc2VudC5cbiAqL1xuZnVuY3Rpb24gZGV0ZXJtaW5lUmVwb3J0ZXJzKHNvY2tldCkge1xuICB2YXIgcmVwb3J0ZXJzID0gW1xuICAgIFdDVC5yZXBvcnRlcnMuVGl0bGUsXG4gICAgV0NULnJlcG9ydGVycy5Db25zb2xlLFxuICBdO1xuXG4gIGlmIChzb2NrZXQpIHtcbiAgICByZXBvcnRlcnMucHVzaChmdW5jdGlvbihydW5uZXIpIHtcbiAgICAgIHNvY2tldC5vYnNlcnZlKHJ1bm5lcik7XG4gICAgfSk7XG4gIH1cblxuICBpZiAoV0NULl9zdWl0ZXNUb0xvYWQubGVuZ3RoID4gMCB8fCBXQ1QuX2RlcGVuZGVuY2llcy5sZW5ndGggPiAwKSB7XG4gICAgcmVwb3J0ZXJzLnB1c2goV0NULnJlcG9ydGVycy5IVE1MKTtcbiAgfVxuXG4gIHJldHVybiByZXBvcnRlcnM7XG59XG5cbn0pKCk7XG4iLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgVGhlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVGhpcyBjb2RlIG1heSBvbmx5IGJlIHVzZWQgdW5kZXIgdGhlIEJTRCBzdHlsZSBsaWNlbnNlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQVVUSE9SUy50eHRcbiAqIFRoZSBjb21wbGV0ZSBzZXQgb2YgY29udHJpYnV0b3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQ09OVFJJQlVUT1JTLnR4dFxuICogQ29kZSBkaXN0cmlidXRlZCBieSBHb29nbGUgYXMgcGFydCBvZiB0aGUgcG9seW1lciBwcm9qZWN0IGlzIGFsc29cbiAqIHN1YmplY3QgdG8gYW4gYWRkaXRpb25hbCBJUCByaWdodHMgZ3JhbnQgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XG4gKi9cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICpcbiAqIFByb3ZpZGVzIGF1dG9tYXRpYyBjb25maWd1cmF0aW9uIG9mIE1vY2hhIGJ5IHN0dWJiaW5nIG91dCBwb3RlbnRpYWwgTW9jaGFcbiAqIG1ldGhvZHMsIGFuZCBjb25maWd1cmluZyBNb2NoYSBhcHByb3ByaWF0ZWx5IG9uY2UgeW91IGNhbGwgdGhlbS5cbiAqXG4gKiBKdXN0IGNhbGwgYHN1aXRlYCwgYGRlc2NyaWJlYCwgZXRjIG5vcm1hbGx5LCBhbmQgZXZlcnl0aGluZyBzaG91bGQgSnVzdCBXb3JrLlxuICovXG4oZnVuY3Rpb24oKSB7XG5cbi8vIE1vY2hhIGdsb2JhbCBoZWxwZXJzLCBicm9rZW4gb3V0IGJ5IHRlc3RpbmcgbWV0aG9kLlxudmFyIE1PQ0hBX0VYUE9SVFMgPSB7XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9tb2NoYS9ibG9iL21hc3Rlci9saWIvaW50ZXJmYWNlcy90ZGQuanNcbiAgdGRkOiBbXG4gICAgJ3NldHVwJyxcbiAgICAndGVhcmRvd24nLFxuICAgICdzdWl0ZVNldHVwJyxcbiAgICAnc3VpdGVUZWFyZG93bicsXG4gICAgJ3N1aXRlJyxcbiAgICAndGVzdCcsXG4gIF0sXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9tb2NoYS9ibG9iL21hc3Rlci9saWIvaW50ZXJmYWNlcy90ZGQuanNcbiAgYmRkOiBbXG4gICAgJ2JlZm9yZScsXG4gICAgJ2FmdGVyJyxcbiAgICAnYmVmb3JlRWFjaCcsXG4gICAgJ2FmdGVyRWFjaCcsXG4gICAgJ2Rlc2NyaWJlJyxcbiAgICAneGRlc2NyaWJlJyxcbiAgICAneGNvbnRleHQnLFxuICAgICdpdCcsXG4gICAgJ3hpdCcsXG4gICAgJ3hzcGVjaWZ5JyxcbiAgXSxcbn07XG5cbi8vIFdlIGV4cG9zZSBhbGwgTW9jaGEgbWV0aG9kcyB1cCBmcm9udCwgY29uZmlndXJpbmcgYW5kIHJ1bm5pbmcgbW9jaGFcbi8vIGF1dG9tYXRpY2FsbHkgd2hlbiB5b3UgY2FsbCB0aGVtLlxuLy9cbi8vIFRoZSBhc3N1bXB0aW9uIGlzIHRoYXQgaXQgaXMgYSBvbmUtb2ZmIChzdWItKXN1aXRlIG9mIHRlc3RzIGJlaW5nIHJ1bi5cbk9iamVjdC5rZXlzKE1PQ0hBX0VYUE9SVFMpLmZvckVhY2goZnVuY3Rpb24odWkpIHtcbiAgTU9DSEFfRVhQT1JUU1t1aV0uZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB3aW5kb3dba2V5XSA9IGZ1bmN0aW9uIHdyYXBwZWRNb2NoYUZ1bmN0aW9uKCkge1xuICAgICAgV0NULnNldHVwTW9jaGEodWkpO1xuICAgICAgaWYgKCF3aW5kb3dba2V5XSB8fCB3aW5kb3dba2V5XSA9PT0gd3JhcHBlZE1vY2hhRnVuY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBtb2NoYS5zZXR1cCB0byBkZWZpbmUgJyArIGtleSk7XG4gICAgICB9XG4gICAgICB3aW5kb3dba2V5XS5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSk7XG59KTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdWkgU2V0cyB1cCBtb2NoYSB0byBydW4gYHVpYC1zdHlsZSB0ZXN0cy5cbiAqL1xuV0NULnNldHVwTW9jaGEgPSBmdW5jdGlvbiBzZXR1cE1vY2hhKHVpKSB7XG4gIGlmIChXQ1QuX21vY2hhVUkgJiYgV0NULl9tb2NoYVVJID09PSB1aSkgcmV0dXJuO1xuICBpZiAoV0NULl9tb2NoYVVJICYmIFdDVC5fbW9jaGFVSSAhPT0gdWkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01peGluZyAnICsgV0NULl9tb2NoYVVJICsgJyBhbmQgJyArIHVpICsgJyBNb2NoYSBzdHlsZXMgaXMgbm90IHN1cHBvcnRlZC4nKTtcbiAgfVxuICBtb2NoYS5zZXR1cCh7dWk6IHVpLCB0aW1lb3V0OiA2MCAqIDEwMDB9KTsgIC8vIE5vdGUgdGhhdCB0aGUgcmVwb3J0ZXIgaXMgY29uZmlndXJlZCBpbiBydW4uanMuXG4gIFdDVC5tb2NoYUlzU2V0dXAgPSB0cnVlO1xufTtcblxufSkoKTtcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAxNCBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG4gKiBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuICogc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcbiAqL1xuKGZ1bmN0aW9uKCkge1xuXG5XQ1QucmVwb3J0ZXJzLkNvbnNvbGUgPSBDb25zb2xlO1xuXG4vLyBXZSBjYXB0dXJlIGNvbnNvbGUgZXZlbnRzIHdoZW4gcnVubmluZyB0ZXN0czsgc28gbWFrZSBzdXJlIHdlIGhhdmUgYVxuLy8gcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCBvbmUuXG52YXIgY29uc29sZSA9IHdpbmRvdy5jb25zb2xlO1xuXG52YXIgRk9OVCA9ICc7Zm9udDogbm9ybWFsIDEzcHggXCJSb2JvdG9cIiwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBcIkhlbHZldGljYVwiLCBzYW5zLXNlcmlmOyc7XG52YXIgU1RZTEVTID0ge1xuICBwbGFpbjogICBGT05ULFxuICBzdWl0ZTogICAnY29sb3I6ICM1YzZiYzAnICsgRk9OVCxcbiAgdGVzdDogICAgRk9OVCxcbiAgcGFzc2luZzogJ2NvbG9yOiAjMjU5YjI0JyArIEZPTlQsXG4gIHBlbmRpbmc6ICdjb2xvcjogI2U2NTEwMCcgKyBGT05ULFxuICBmYWlsaW5nOiAnY29sb3I6ICNjNDE0MTEnICsgRk9OVCxcbiAgc3RhY2s6ICAgJ2NvbG9yOiAjYzQxNDExJyxcbiAgcmVzdWx0czogRk9OVCArICdmb250LXNpemU6IDE2cHgnLFxufTtcblxuLy8gSSBkb24ndCB0aGluayB3ZSBjYW4gZmVhdHVyZSBkZXRlY3QgdGhpcyBvbmUuLi5cbnZhciB1c2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG52YXIgQ0FOX1NUWUxFX0xPRyAgID0gdXNlckFnZW50Lm1hdGNoKCdmaXJlZm94JykgfHwgdXNlckFnZW50Lm1hdGNoKCd3ZWJraXQnKTtcbnZhciBDQU5fU1RZTEVfR1JPVVAgPSB1c2VyQWdlbnQubWF0Y2goJ3dlYmtpdCcpO1xuLy8gVHJhY2sgdGhlIGluZGVudCBmb3IgZmFrZWQgYGNvbnNvbGUuZ3JvdXBgXG52YXIgbG9nSW5kZW50ID0gJyc7XG5cbmZ1bmN0aW9uIGxvZyh0ZXh0LCBzdHlsZSkge1xuICB0ZXh0ID0gdGV4dC5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGwpIHsgcmV0dXJuIGxvZ0luZGVudCArIGw7IH0pLmpvaW4oJ1xcbicpO1xuICBpZiAoQ0FOX1NUWUxFX0xPRykge1xuICAgIGNvbnNvbGUubG9nKCclYycgKyB0ZXh0LCBTVFlMRVNbc3R5bGVdIHx8IFNUWUxFUy5wbGFpbik7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2codGV4dCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbG9nR3JvdXAodGV4dCwgc3R5bGUpIHtcbiAgaWYgKENBTl9TVFlMRV9HUk9VUCkge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVjJyArIHRleHQsIFNUWUxFU1tzdHlsZV0gfHwgU1RZTEVTLnBsYWluKTtcbiAgfSBlbHNlIGlmIChjb25zb2xlLmdyb3VwKSB7XG4gICAgY29uc29sZS5ncm91cCh0ZXh0KTtcbiAgfSBlbHNlIHtcbiAgICBsb2dJbmRlbnQgPSBsb2dJbmRlbnQgKyAnICAnO1xuICAgIGxvZyh0ZXh0LCBzdHlsZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbG9nR3JvdXBFbmQoKSB7XG4gIGlmIChjb25zb2xlLmdyb3VwRW5kKSB7XG4gICAgY29uc29sZS5ncm91cEVuZCgpO1xuICB9IGVsc2Uge1xuICAgIGxvZ0luZGVudCA9IGxvZ0luZGVudC5zdWJzdHIoMCwgbG9nSW5kZW50Lmxlbmd0aCAtIDIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxvZ0V4Y2VwdGlvbihlcnJvcikge1xuICBsb2coZXJyb3Iuc3RhY2sgfHwgZXJyb3IubWVzc2FnZSB8fCBlcnJvciwgJ3N0YWNrJyk7XG59XG5cbi8qKlxuICogQSBNb2NoYSByZXBvcnRlciB0aGF0IGxvZ3MgcmVzdWx0cyBvdXQgdG8gdGhlIHdlYiBgY29uc29sZWAuXG4gKlxuICogQHBhcmFtIHshTW9jaGEuUnVubmVyfSBydW5uZXIgVGhlIHJ1bm5lciB0aGF0IGlzIGJlaW5nIHJlcG9ydGVkIG9uLlxuICovXG5mdW5jdGlvbiBDb25zb2xlKHJ1bm5lcikge1xuICBNb2NoYS5yZXBvcnRlcnMuQmFzZS5jYWxsKHRoaXMsIHJ1bm5lcik7XG5cbiAgcnVubmVyLm9uKCdzdWl0ZScsIGZ1bmN0aW9uKHN1aXRlKSB7XG4gICAgaWYgKHN1aXRlLnJvb3QpIHJldHVybjtcbiAgICBsb2dHcm91cChzdWl0ZS50aXRsZSwgJ3N1aXRlJyk7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgcnVubmVyLm9uKCdzdWl0ZSBlbmQnLCBmdW5jdGlvbihzdWl0ZSkge1xuICAgIGlmIChzdWl0ZS5yb290KSByZXR1cm47XG4gICAgbG9nR3JvdXBFbmQoKTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICBydW5uZXIub24oJ3Rlc3QnLCBmdW5jdGlvbih0ZXN0KSB7XG4gICAgbG9nR3JvdXAodGVzdC50aXRsZSwgJ3Rlc3QnKTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICBydW5uZXIub24oJ3BlbmRpbmcnLCBmdW5jdGlvbih0ZXN0KSB7XG4gICAgbG9nR3JvdXAodGVzdC50aXRsZSwgJ3BlbmRpbmcnKTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICBydW5uZXIub24oJ2ZhaWwnLCBmdW5jdGlvbih0ZXN0LCBlcnJvcikge1xuICAgIGxvZ0V4Y2VwdGlvbihlcnJvcik7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgcnVubmVyLm9uKCd0ZXN0IGVuZCcsIGZ1bmN0aW9uKHRlc3QpIHtcbiAgICBsb2dHcm91cEVuZCgpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIHJ1bm5lci5vbignZW5kJywgdGhpcy5sb2dTdW1tYXJ5LmJpbmQodGhpcykpO1xufVxuQ29uc29sZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1vY2hhLnJlcG9ydGVycy5CYXNlLnByb3RvdHlwZSk7XG5cbi8qKiBQcmludHMgb3V0IGEgZmluYWwgc3VtbWFyeSBvZiB0ZXN0IHJlc3VsdHMuICovXG5Db25zb2xlLnByb3RvdHlwZS5sb2dTdW1tYXJ5ID0gZnVuY3Rpb24gbG9nU3VtbWFyeSgpIHtcbiAgbG9nR3JvdXAoJ1Rlc3QgUmVzdWx0cycsICdyZXN1bHRzJyk7XG5cbiAgaWYgKHRoaXMuc3RhdHMuZmFpbHVyZXMgPiAwKSB7XG4gICAgbG9nKFdDVC51dGlsLnBsdXJhbGl6ZWRTdGF0KHRoaXMuc3RhdHMuZmFpbHVyZXMsICdmYWlsaW5nJyksICdmYWlsaW5nJyk7XG4gIH1cbiAgaWYgKHRoaXMuc3RhdHMucGVuZGluZyA+IDApIHtcbiAgICBsb2coV0NULnV0aWwucGx1cmFsaXplZFN0YXQodGhpcy5zdGF0cy5wZW5kaW5nLCAncGVuZGluZycpLCAncGVuZGluZycpO1xuICB9XG4gIGxvZyhXQ1QudXRpbC5wbHVyYWxpemVkU3RhdCh0aGlzLnN0YXRzLnBhc3NlcywgJ3Bhc3NpbmcnKSk7XG5cbiAgaWYgKCF0aGlzLnN0YXRzLmZhaWx1cmVzKSB7XG4gICAgbG9nKCd0ZXN0IHN1aXRlIHBhc3NlZCcsICdwYXNzaW5nJyk7XG4gIH1cbiAgbG9nKCdFdmFsdWF0ZWQgJyArIHRoaXMuc3RhdHMudGVzdHMgKyAnIHRlc3RzIGluICcgKyB0aGlzLnN0YXRzLmR1cmF0aW9uICsgJ21zLicpO1xuICBsb2dHcm91cEVuZCgpO1xufTtcblxufSkoKTtcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAxNCBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG4gKiBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuICogc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcbiAqL1xuKGZ1bmN0aW9uKCkge1xuXG5XQ1QucmVwb3J0ZXJzLkhUTUwgPSBIVE1MO1xuXG4vKipcbiAqIFdDVC1zcGVjaWZpYyBiZWhhdmlvciBvbiB0b3Agb2YgTW9jaGEncyBkZWZhdWx0IEhUTUwgcmVwb3J0ZXIuXG4gKlxuICogQHBhcmFtIHshTW9jaGEuUnVubmVyfSBydW5uZXIgVGhlIHJ1bm5lciB0aGF0IGlzIGJlaW5nIHJlcG9ydGVkIG9uLlxuICovXG5mdW5jdGlvbiBIVE1MKHJ1bm5lcikge1xuICB2YXIgb3V0cHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIG91dHB1dC5pZCA9ICdtb2NoYSc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3V0cHV0KTtcblxuICBydW5uZXIub24oJ3N1aXRlJywgZnVuY3Rpb24odGVzdCkge1xuICAgIHRoaXMudG90YWwgPSBydW5uZXIudG90YWw7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgTW9jaGEucmVwb3J0ZXJzLkhUTUwuY2FsbCh0aGlzLCBydW5uZXIpO1xufVxuSFRNTC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1vY2hhLnJlcG9ydGVycy5IVE1MLnByb3RvdHlwZSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgVGhlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVGhpcyBjb2RlIG1heSBvbmx5IGJlIHVzZWQgdW5kZXIgdGhlIEJTRCBzdHlsZSBsaWNlbnNlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQVVUSE9SUy50eHRcbiAqIFRoZSBjb21wbGV0ZSBzZXQgb2YgY29udHJpYnV0b3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQ09OVFJJQlVUT1JTLnR4dFxuICogQ29kZSBkaXN0cmlidXRlZCBieSBHb29nbGUgYXMgcGFydCBvZiB0aGUgcG9seW1lciBwcm9qZWN0IGlzIGFsc29cbiAqIHN1YmplY3QgdG8gYW4gYWRkaXRpb25hbCBJUCByaWdodHMgZ3JhbnQgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XG4gKi9cbihmdW5jdGlvbigpIHtcblxuV0NULnJlcG9ydGVycy5UaXRsZSA9IFRpdGxlO1xuXG52YXIgQVJDX09GRlNFVCA9IDA7IC8vIHN0YXJ0IGF0IHRoZSByaWdodC5cbnZhciBBUkNfV0lEVEggID0gNjtcblxuLyoqXG4gKiBBIE1vY2hhIHJlcG9ydGVyIHRoYXQgdXBkYXRlcyB0aGUgZG9jdW1lbnQncyB0aXRsZSBhbmQgZmF2aWNvbiB3aXRoXG4gKiBhdC1hLWdsYW5jZSBzdGF0cy5cbiAqXG4gKiBAcGFyYW0geyFNb2NoYS5SdW5uZXJ9IHJ1bm5lciBUaGUgcnVubmVyIHRoYXQgaXMgYmVpbmcgcmVwb3J0ZWQgb24uXG4gKi9cbmZ1bmN0aW9uIFRpdGxlKHJ1bm5lcikge1xuICBNb2NoYS5yZXBvcnRlcnMuQmFzZS5jYWxsKHRoaXMsIHJ1bm5lcik7XG5cbiAgcnVubmVyLm9uKCd0ZXN0IGVuZCcsIHRoaXMucmVwb3J0LmJpbmQodGhpcykpO1xufVxuXG4vKiogUmVwb3J0cyBjdXJyZW50IHN0YXRzIHZpYSB0aGUgcGFnZSB0aXRsZSBhbmQgZmF2aWNvbi4gKi9cblRpdGxlLnByb3RvdHlwZS5yZXBvcnQgPSBmdW5jdGlvbiByZXBvcnQoKSB7XG4gIHRoaXMudXBkYXRlVGl0bGUoKTtcbiAgdGhpcy51cGRhdGVGYXZpY29uKCk7XG59O1xuXG4vKiogVXBkYXRlcyB0aGUgZG9jdW1lbnQgdGl0bGUgd2l0aCBhIHN1bW1hcnkgb2YgY3VycmVudCBzdGF0cy4gKi9cblRpdGxlLnByb3RvdHlwZS51cGRhdGVUaXRsZSA9IGZ1bmN0aW9uIHVwZGF0ZVRpdGxlKCkge1xuICBpZiAodGhpcy5zdGF0cy5mYWlsdXJlcyA+IDApIHtcbiAgICBkb2N1bWVudC50aXRsZSA9IFdDVC51dGlsLnBsdXJhbGl6ZWRTdGF0KHRoaXMuc3RhdHMuZmFpbHVyZXMsICdmYWlsaW5nJyk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQudGl0bGUgPSBXQ1QudXRpbC5wbHVyYWxpemVkU3RhdCh0aGlzLnN0YXRzLnBhc3NlcywgJ3Bhc3NpbmcnKTtcbiAgfVxufTtcblxuLyoqXG4gKiBEcmF3cyBhbiBhcmMgZm9yIHRoZSBmYXZpY29uIHN0YXR1cywgcmVsYXRpdmUgdG8gdGhlIHRvdGFsIG51bWJlciBvZiB0ZXN0cy5cbiAqXG4gKiBAcGFyYW0geyFDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGNvbnRleHRcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbFxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0XG4gKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoXG4gKiBAcGFyYW0ge3N0cmluZ30gY29sb3JcbiAqL1xuZnVuY3Rpb24gZHJhd0Zhdmljb25BcmMoY29udGV4dCwgdG90YWwsIHN0YXJ0LCBsZW5ndGgsIGNvbG9yKSB7XG4gIHZhciBhcmNTdGFydCA9IEFSQ19PRkZTRVQgKyBNYXRoLlBJICogMiAqIChzdGFydCAvIHRvdGFsKTtcbiAgdmFyIGFyY0VuZCAgID0gQVJDX09GRlNFVCArIE1hdGguUEkgKiAyICogKChzdGFydCArIGxlbmd0aCkgLyB0b3RhbCk7XG5cbiAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICBjb250ZXh0LmxpbmVXaWR0aCAgID0gQVJDX1dJRFRIO1xuICBjb250ZXh0LmFyYygxNiwgMTYsIDE2IC0gQVJDX1dJRFRIIC8gMiwgYXJjU3RhcnQsIGFyY0VuZCk7XG4gIGNvbnRleHQuc3Ryb2tlKCk7XG59XG5cbi8qKiBVcGRhdGVzIHRoZSBkb2N1bWVudCdzIGZhdmljb24gdy8gYSBzdW1tYXJ5IG9mIGN1cnJlbnQgc3RhdHMuICovXG5UaXRsZS5wcm90b3R5cGUudXBkYXRlRmF2aWNvbiA9IGZ1bmN0aW9uIHVwZGF0ZUZhdmljb24oKSB7XG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLmhlaWdodCA9IGNhbnZhcy53aWR0aCA9IDMyO1xuICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gIHZhciBwYXNzaW5nID0gdGhpcy5zdGF0cy5wYXNzZXM7XG4gIHZhciBwZW5kaW5nID0gdGhpcy5zdGF0cy5wZW5kaW5nO1xuICB2YXIgZmFpbGluZyA9IHRoaXMuc3RhdHMuZmFpbHVyZXM7XG4gIHZhciB0b3RhbCAgID0gTWF0aC5tYXgodGhpcy5ydW5uZXIudG90YWwsIHBhc3NpbmcgKyBwZW5kaW5nICsgZmFpbGluZyk7XG4gIGRyYXdGYXZpY29uQXJjKGNvbnRleHQsIHRvdGFsLCAwLCAgICAgICAgICAgICAgICAgcGFzc2luZywgJyMwZTljNTcnKTtcbiAgZHJhd0Zhdmljb25BcmMoY29udGV4dCwgdG90YWwsIHBhc3NpbmcsICAgICAgICAgICBwZW5kaW5nLCAnI2YzYjMwMCcpO1xuICBkcmF3RmF2aWNvbkFyYyhjb250ZXh0LCB0b3RhbCwgcGVuZGluZyArIHBhc3NpbmcsIGZhaWxpbmcsICcjZmY1NjIxJyk7XG5cbiAgdGhpcy5zZXRGYXZpY29uKGNhbnZhcy50b0RhdGFVUkwoKSk7XG59O1xuXG4vKiogU2V0cyB0aGUgY3VycmVudCBmYXZpY29uIGJ5IFVSTC4gKi9cblRpdGxlLnByb3RvdHlwZS5zZXRGYXZpY29uID0gZnVuY3Rpb24gc2V0RmF2aWNvbih1cmwpIHtcbiAgdmFyIGN1cnJlbnQgPSBkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbcmVsPVwiaWNvblwiXScpO1xuICBpZiAoY3VycmVudCkge1xuICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoY3VycmVudCk7XG4gIH1cblxuICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgbGluay5yZWwgPSAnaWNvbic7XG4gIGxpbmsudHlwZSA9ICdpbWFnZS94LWljb24nO1xuICBsaW5rLmhyZWYgPSB1cmw7XG4gIGxpbmsuc2V0QXR0cmlidXRlKCdzaXplcycsICczMngzMicpO1xuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmspO1xufTtcblxufSkoKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IFRoZSBQb2x5bWVyIFByb2plY3QgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcbiAqIFRoZSBjb21wbGV0ZSBzZXQgb2YgYXV0aG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0FVVEhPUlMudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0NPTlRSSUJVVE9SUy50eHRcbiAqIENvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvXG4gKiBzdWJqZWN0IHRvIGFuIGFkZGl0aW9uYWwgSVAgcmlnaHRzIGdyYW50IGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9QQVRFTlRTLnR4dFxuICovXG5odG1sLCBib2R5IHtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogIDEwMCU7XG59XG5cbiNtb2NoYSwgI3N1YnN1aXRlcyB7XG4gIGhlaWdodDogMTAwJTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIHdpZHRoOiA1MCU7XG59XG5cbiNtb2NoYSB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICBwYWRkaW5nOiA2MHB4IDUwcHg7XG4gIHJpZ2h0OiAwO1xufVxuXG4jc3Vic3VpdGVzIHtcbiAgLW1zLWZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIC13ZWJraXQtZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XG4gIGRpc3BsYXk6IC13ZWJraXQtZmxleDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgbGVmdDogMDtcbn1cblxuI3N1YnN1aXRlcyAuc3Vic3VpdGUge1xuICBib3JkZXI6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbiNtb2NoYSAudGVzdC5wYXNzIC5kdXJhdGlvbiB7XG4gIGNvbG9yOiAjNTU1O1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9