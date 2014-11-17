/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var observer;
var callbackArgs = undefined;
var callbackInvoked = false;

function then(fn) {
  setTimeout(function() {
    Platform.performMicrotaskCheckpoint();
    fn();
  }, 0);

  return {
    then: function(next) {
      return then(next);
    }
  };
}

function noop() {}

function callback() {
  callbackArgs = Array.prototype.slice.apply(arguments);
  callbackInvoked = true;
}

function doSetup() {}
function doTeardown() {
  callbackInvoked = false;
  callbackArgs = undefined;
}

function assertNoChanges() {
  if (observer)
    observer.deliver();
  assert.isFalse(callbackInvoked);
  assert.isUndefined(callbackArgs);
}

function assertPathChanges(expectNewValue, expectOldValue, dontDeliver) {
  if (!dontDeliver)
    observer.deliver();

  assert.isTrue(callbackInvoked);

  var newValue = callbackArgs[0];
  var oldValue = callbackArgs[1];
  assert.deepEqual(expectNewValue, newValue);
  assert.deepEqual(expectOldValue, oldValue);

  if (!dontDeliver) {
    assert.isTrue(window.dirtyCheckCycleCount === undefined ||
                  window.dirtyCheckCycleCount === 1);
  }

  callbackArgs = undefined;
  callbackInvoked = false;
}

function assertCompoundPathChanges(expectNewValues, expectOldValues,
                                   expectObserved, dontDeliver) {
  if (!dontDeliver)
    observer.deliver();

  assert.isTrue(callbackInvoked);

  var newValues = callbackArgs[0];
  var oldValues = callbackArgs[1];
  var observed = callbackArgs[2];
  assert.deepEqual(expectNewValues, newValues);
  assert.deepEqual(expectOldValues, oldValues);
  assert.deepEqual(expectObserved, observed);

  if (!dontDeliver) {
    assert.isTrue(window.dirtyCheckCycleCount === undefined ||
                  window.dirtyCheckCycleCount === 1);
  }

  callbackArgs = undefined;
  callbackInvoked = false;
}

var createObject = ('__proto__' in {}) ?
  function(obj) { return obj; } :
  function(obj) {
    var proto = obj.__proto__;
    if (!proto)
      return obj;
    var newObject = Object.create(proto);
    Object.getOwnPropertyNames(obj).forEach(function(name) {
      Object.defineProperty(newObject, name,
                           Object.getOwnPropertyDescriptor(obj, name));
    });
    return newObject;
  };

function assertPath(pathString, expectKeys, expectSerialized) {
  var path = Path.get(pathString);
  if (!expectKeys) {
    assert.isFalse(path.valid);
    return;
  }

  assert.deepEqual(Array.prototype.slice.apply(path), expectKeys);
  assert.strictEqual(path.toString(), expectSerialized);
}

function assertInvalidPath(pathString) {
  assertPath(pathString);
}

suite('Path', function() {
  test('constructor throws', function() {
    assert.throws(function() {
      new Path('foo')
    });
  });

  test('path validity', function() {
    // invalid path get value is always undefined
    var p = Path.get('a b');
    assert.isFalse(p.valid);
    assert.isUndefined(p.getValueFrom({ a: { b: 2 }}));

    assertPath('', [], '');
    assertPath(' ', [], '');
    assertPath(null, [], '');
    assertPath(undefined, [], '');
    assertPath('a', ['a'], 'a');
    assertPath('a.b', ['a', 'b'], 'a.b');
    assertPath('a. b', ['a', 'b'], 'a.b');
    assertPath('a .b', ['a', 'b'], 'a.b');
    assertPath('a . b', ['a', 'b'], 'a.b');
    assertPath(' a . b ', ['a', 'b'], 'a.b');
    assertPath('a[0]', ['a', '0'], 'a[0]');
    assertPath('a [0]', ['a', '0'], 'a[0]');
    assertPath('a[0][1]', ['a', '0', '1'], 'a[0][1]');
    assertPath('a [ 0 ] [ 1 ] ', ['a', '0', '1'], 'a[0][1]');
    assertPath('[1234567890] ', ['1234567890'], '[1234567890]');
    assertPath(' [1234567890] ', ['1234567890'], '[1234567890]');
    assertPath('opt0', ['opt0'], 'opt0');
    assertPath('$foo.$bar._baz', ['$foo', '$bar', '_baz'], '$foo.$bar._baz');
    assertPath('foo["baz"]', ['foo', 'baz'], 'foo.baz');
    assertPath('foo["b\\"az"]', ['foo', 'b"az'], 'foo["b\\"az"]');
    assertPath("foo['b\\'az']", ['foo', "b'az"], 'foo["b\'az"]');
    assertPath(['a', 'b'], ['a', 'b'], 'a.b');
    assertPath([''], [''], '[""]');

    function Foo(val) { this.val = val; }
    Foo.prototype.toString = function() { return 'Foo' + this.val; };
    assertPath([new Foo('a'), new Foo('b')], ['Fooa', 'Foob'], 'Fooa.Foob');

    assertInvalidPath('.');
    assertInvalidPath(' . ');
    assertInvalidPath('..');
    assertInvalidPath('a[4');
    assertInvalidPath('a.b.');
    assertInvalidPath('a,b');
    assertInvalidPath('a["foo]');
    assertInvalidPath('[0x04]');
    assertInvalidPath('[0foo]');
    assertInvalidPath('[foo-bar]');
    assertInvalidPath('foo-bar');
    assertInvalidPath('42');
    assertInvalidPath('a[04]');
    assertInvalidPath(' a [ 04 ]');
    assertInvalidPath('  42   ');
    assertInvalidPath('foo["bar]');
    assertInvalidPath("foo['bar]");
  });

  test('Paths are interned', function() {
    var p = Path.get('foo.bar');
    var p2 = Path.get('foo.bar');
    assert.strictEqual(p, p2);

    var p3 = Path.get('');
    var p4 = Path.get('');
    assert.strictEqual(p3, p4);
  });

  test('null is empty path', function() {
    assert.strictEqual(Path.get(''), Path.get(null));
  });

  test('undefined is empty path', function() {
    assert.strictEqual(Path.get(undefined), Path.get(null));
  });

  test('Path.getValueFrom', function() {
    var obj = {
      a: {
        b: {
          c: 1
        }
      }
    };

    var p1 = Path.get('a');
    var p2 = Path.get('a.b');
    var p3 = Path.get('a.b.c');

    assert.strictEqual(obj.a, p1.getValueFrom(obj));
    assert.strictEqual(obj.a.b, p2.getValueFrom(obj));
    assert.strictEqual(1, p3.getValueFrom(obj));

    obj.a.b.c = 2;
    assert.strictEqual(2, p3.getValueFrom(obj));

    obj.a.b = {
      c: 3
    };
    assert.strictEqual(3, p3.getValueFrom(obj));

    obj.a = {
      b: 4
    };
    assert.strictEqual(undefined, p3.getValueFrom(obj));
    assert.strictEqual(4, p2.getValueFrom(obj));
  });

  test('Path.setValueFrom', function() {
    var obj = {};
    var p2 = Path.get('bar');

    Path.get('foo').setValueFrom(obj, 3);
    assert.equal(3, obj.foo);

    var bar = { baz: 3 };

    Path.get('bar').setValueFrom(obj, bar);
    assert.equal(bar, obj.bar);

    var p = Path.get('bar.baz.bat');
    p.setValueFrom(obj, 'not here');
    assert.equal(undefined, p.getValueFrom(obj));
  });

  test('Degenerate Values', function() {
    var emptyPath = Path.get();
    var foo = {};

    assert.equal(null, emptyPath.getValueFrom(null));
    assert.equal(foo, emptyPath.getValueFrom(foo));
    assert.equal(3, emptyPath.getValueFrom(3));
    assert.equal(undefined, Path.get('a').getValueFrom(undefined));
  });
});

suite('Basic Tests', function() {

  test('Exception Doesnt Stop Notification', function() {
    var model = [1];
    var count = 0;

    var observer1 = new ObjectObserver(model);
    observer1.open(function() {
      count++;
      throw 'ouch';
    });

    var observer2 = new PathObserver(model, '[0]');
    observer2.open(function() {
      count++;
      throw 'ouch';
    });

    var observer3 = new ArrayObserver(model);
    observer3.open(function() {
      count++;
      throw 'ouch';
    });

    model[0] = 2;
    model[1] = 2;

    observer1.deliver();
    observer2.deliver();
    observer3.deliver();

    assert.equal(3, count);

    observer1.close();
    observer2.close();
    observer3.close();
  });

  test('Can only open once', function() {
    observer = new PathObserver({ id: 1 }, 'id');
    observer.open(callback);
    assert.throws(function() {
      observer.open(callback);
    });
    observer.close();

    observer = new CompoundObserver();
    observer.open(callback);
    assert.throws(function() {
      observer.open(callback);
    });
    observer.close();

    observer = new ObjectObserver({}, 'id');
    observer.open(callback);
    assert.throws(function() {
      observer.open(callback);
    });
    observer.close();

    observer = new ArrayObserver([], 'id');
    observer.open(callback);
    assert.throws(function() {
      observer.open(callback);
    });
    observer.close();

  });

  test('No Object.observe performMicrotaskCheckpoint', function() {
    if (typeof Object.observe == 'function')
      return;

    var model = [1];
    var count = 0;

    var observer1 = new ObjectObserver(model);
    observer1.open(function() {
      count++;
    });

    var observer2 = new PathObserver(model, '[0]');
    observer2.open(function() {
      count++;
    });

    var observer3 = new ArrayObserver(model);
    observer3.open(function() {
      count++;
    });

    model[0] = 2;
    model[1] = 2;

    Platform.performMicrotaskCheckpoint();
    assert.equal(3, count);

    observer1.close();
    observer2.close();
    observer3.close();
  });
});

suite('ObserverTransform', function() {

  test('Close Invokes Close', function() {
    var count = 0;
    var observer = {
      open: function() {},
      close: function() { count++; }
    };

    var observer = new ObserverTransform(observer);
    observer.open();
    observer.close();
    assert.strictEqual(1, count);
  });

  test('valueFn/setValueFn', function() {
    var obj = { foo: 1 };

    function valueFn(value) { return value * 2; }

    function setValueFn(value) { return value / 2; }

    observer = new ObserverTransform(new PathObserver(obj, 'foo'),
                                     valueFn,
                                     setValueFn);
    observer.open(callback);

    obj.foo = 2;

    assert.strictEqual(4, observer.discardChanges());
    assertNoChanges();

    observer.setValue(2);
    assert.strictEqual(obj.foo, 1);
    assertPathChanges(2, 4);

    obj.foo = 10;
    assertPathChanges(20, 2);

    observer.close();
  });

  test('valueFn - object literal', function() {
    var model = {};

    function valueFn(value) {
      return [ value ];
    }

    observer = new ObserverTransform(new PathObserver(model, 'foo'), valueFn);
    observer.open(callback);

    model.foo = 1;
    assertPathChanges([1], [undefined]);

    model.foo = 3;
    assertPathChanges([3], [1]);

    observer.close();
  });

  test('CompoundObserver - valueFn reduction', function() {
    var model = { a: 1, b: 2, c: 3 };

    function valueFn(values) {
      return values.reduce(function(last, cur) {
        return typeof cur === 'number' ? last + cur : undefined;
      }, 0);
    }

    var compound = new CompoundObserver();
    compound.addPath(model, 'a');
    compound.addPath(model, 'b');
    compound.addPath(model, Path.get('c'));

    observer = new ObserverTransform(compound, valueFn);
    assert.strictEqual(6, observer.open(callback));

    model.a = -10;
    model.b = 20;
    model.c = 30;
    assertPathChanges(40, 6);

    observer.close();
  });
})

suite('PathObserver Tests', function() {

  setup(doSetup);

  teardown(doTeardown);

  test('Callback args', function() {
    var obj = {
      foo: 'bar'
    };

    var path = Path.get('foo');
    var observer = new PathObserver(obj, path);

    var args;
    observer.open(function() {
      args = Array.prototype.slice.apply(arguments);
    });

    obj.foo = 'baz';
    observer.deliver();
    assert.strictEqual(args.length, 3);
    assert.strictEqual(args[0], 'baz');
    assert.strictEqual(args[1], 'bar');
    assert.strictEqual(args[2], observer);
    assert.strictEqual(args[2].path, path);
    observer.close();
  });

  test('PathObserver.path', function() {
    var obj = {
      foo: 'bar'
    };

    var path = Path.get('foo');
    var observer = new PathObserver(obj, 'foo');
    assert.strictEqual(observer.path, Path.get('foo'));
  });


  test('invalid', function() {
    var observer = new PathObserver({ a: { b: 1 }} , 'a b');
    observer.open(callback);
    assert.strictEqual(undefined, observer.value);
    observer.deliver();
    assert.isFalse(callbackInvoked);
  });

  test('Optional target for callback', function() {
    var target = {
      changed: function(value, oldValue) {
        this.called = true;
      }
    };
    var obj = { foo: 1 };
    var observer = new PathObserver(obj, 'foo');
    observer.open(target.changed, target);
    obj.foo = 2;
    observer.deliver();
    assert.isTrue(target.called);

    observer.close();
  });

  test('Delivery Until No Changes', function() {
    var obj = { foo: { bar: 5 }};
    var callbackCount = 0;
    var observer = new PathObserver(obj, 'foo . bar');
    observer.open(function() {
      callbackCount++;
      if (!obj.foo.bar)
        return;

      obj.foo.bar--;
    });

    obj.foo.bar--;
    observer.deliver();

    assert.equal(5, callbackCount);

    observer.close();
  });

  test('Path disconnect', function() {
    var arr = {};

    arr.foo = 'bar';
    observer = new PathObserver(arr, 'foo');
    observer.open(callback);
    arr.foo = 'baz';

    assertPathChanges('baz', 'bar');
    arr.foo = 'bar';

    observer.close();

    arr.foo = 'boo';
    assertNoChanges();
  });

  test('Path discardChanges', function() {
    var arr = {};

    arr.foo = 'bar';
    observer = new PathObserver(arr, 'foo');
    observer.open(callback);
    arr.foo = 'baz';

    assertPathChanges('baz', 'bar');

    arr.foo = 'bat';
    observer.discardChanges();
    assertNoChanges();

    arr.foo = 'bag';
    assertPathChanges('bag', 'bat');
    observer.close();
  });

  test('Path setValue', function() {
    var obj = {};

    obj.foo = 'bar';
    observer = new PathObserver(obj, 'foo');
    observer.open(callback);
    obj.foo = 'baz';

    observer.setValue('bat');
    assert.strictEqual(obj.foo, 'bat');
    assertPathChanges('bat', 'bar');

    observer.setValue('bot');
    observer.discardChanges();
    assertNoChanges();

    observer.close();
  });

  test('Degenerate Values', function() {
    var emptyPath = Path.get();
    observer = new PathObserver(null, '');
    observer.open(callback);
    assert.equal(null, observer.value);
    observer.close();

    var foo = {};
    observer = new PathObserver(foo, '');
    assert.equal(foo, observer.open(callback));
    observer.close();

    observer = new PathObserver(3, '');
    assert.equal(3, observer.open(callback));
    observer.close();

    observer = new PathObserver(undefined, 'a');
    assert.equal(undefined, observer.open(callback));
    observer.close();

    var bar = { id: 23 };
    observer = new PathObserver(undefined, 'a/3!');
    assert.equal(undefined, observer.open(callback));
    observer.close();
  });

  test('Path NaN', function() {
    var foo = { val: 1 };
    observer = new PathObserver(foo, 'val');
    observer.open(callback);
    foo.val = 0/0;

    // Can't use assertSummary because deepEqual() will fail with NaN
    observer.deliver();
    assert.isTrue(callbackInvoked);
    assert.isTrue(isNaN(callbackArgs[0]));
    assert.strictEqual(1, callbackArgs[1]);
    observer.close();
  });

  test('Path Set Value Back To Same', function() {
    var obj = {};
    var path = Path.get('foo');

    path.setValueFrom(obj, 3);
    assert.equal(3, obj.foo);

    observer = new PathObserver(obj, 'foo');
    assert.equal(3, observer.open(callback));

    path.setValueFrom(obj, 2);
    assert.equal(2, observer.discardChanges());

    path.setValueFrom(obj, 3);
    assert.equal(3, observer.discardChanges());

    assertNoChanges();

    observer.close();
  });

  test('Path Triple Equals', function() {
    var model = { };

    observer = new PathObserver(model, 'foo');
    observer.open(callback);

    model.foo = null;
    assertPathChanges(null, undefined);

    model.foo = undefined;
    assertPathChanges(undefined, null);

    observer.close();
  });

  test('Path Simple', function() {
    var model = { };

    observer = new PathObserver(model, 'foo');
    observer.open(callback);

    model.foo = 1;
    assertPathChanges(1, undefined);

    model.foo = 2;
    assertPathChanges(2, 1);

    delete model.foo;
    assertPathChanges(undefined, 2);

    observer.close();
  });

  test('Path Simple - path object', function() {
    var model = { };

    var path = Path.get('foo');
    observer = new PathObserver(model, path);
    observer.open(callback);

    model.foo = 1;
    assertPathChanges(1, undefined);

    model.foo = 2;
    assertPathChanges(2, 1);

    delete model.foo;
    assertPathChanges(undefined, 2);

    observer.close();
  });

  test('Path - root is initially null', function(done) {
    var model = { };

    var path = Path.get('foo');
    observer = new PathObserver(model, 'foo.bar');
    observer.open(callback);

    model.foo = { };
    then(function() {
      model.foo.bar = 1;

    }).then(function() {
      assertPathChanges(1, undefined, true);

      observer.close();
      done();
    });
  });

  test('Path With Indices', function() {
    var model = [];

    observer = new PathObserver(model, '[0]');
    observer.open(callback);

    model.push(1);
    assertPathChanges(1, undefined);

    observer.close();
  });

  test('Path Observation', function() {
    var model = {
      a: {
        b: {
          c: 'hello, world'
        }
      }
    };

    observer = new PathObserver(model, 'a.b.c');
    observer.open(callback);

    model.a.b.c = 'hello, mom';
    assertPathChanges('hello, mom', 'hello, world');

    model.a.b = {
      c: 'hello, dad'
    };
    assertPathChanges('hello, dad', 'hello, mom');

    model.a = {
      b: {
        c: 'hello, you'
      }
    };
    assertPathChanges('hello, you', 'hello, dad');

    model.a.b = 1;
    assertPathChanges(undefined, 'hello, you');

    // Stop observing
    observer.close();

    model.a.b = {c: 'hello, back again -- but not observing'};
    assertNoChanges();

    // Resume observing
    observer = new PathObserver(model, 'a.b.c');
    observer.open(callback);

    model.a.b.c = 'hello. Back for reals';
    assertPathChanges('hello. Back for reals',
        'hello, back again -- but not observing');

    observer.close();
  });

  test('Path Set To Same As Prototype', function() {
    var model = createObject({
      __proto__: {
        id: 1
      }
    });

    observer = new PathObserver(model, 'id');
    observer.open(callback);
    model.id = 1;

    assertNoChanges();
    observer.close();
  });

  test('Path Set Read Only', function() {
    var model = {};
    Object.defineProperty(model, 'x', {
      configurable: true,
      writable: false,
      value: 1
    });
    observer = new PathObserver(model, 'x');
    observer.open(callback);

    model.x = 2;

    assertNoChanges();
    observer.close();
  });

  test('Path Set Shadows', function() {
    var model = createObject({
      __proto__: {
        x: 1
      }
    });

    observer = new PathObserver(model, 'x');
    observer.open(callback);
    model.x = 2;
    assertPathChanges(2, 1);
    observer.close();
  });

  test('Delete With Same Value On Prototype', function() {
    var model = createObject({
      __proto__: {
        x: 1,
      },
      x: 1
    });

    observer = new PathObserver(model, 'x');
    observer.open(callback);
    delete model.x;
    assertNoChanges();
    observer.close();
  });

  test('Delete With Different Value On Prototype', function() {
    var model = createObject({
      __proto__: {
        x: 1,
      },
      x: 2
    });

    observer = new PathObserver(model, 'x');
    observer.open(callback);
    delete model.x;
    assertPathChanges(1, 2);
    observer.close();
  });

  test('Value Change On Prototype', function() {
    var proto = {
      x: 1
    }
    var model = createObject({
      __proto__: proto
    });

    observer = new PathObserver(model, 'x');
    observer.open(callback);
    model.x = 2;
    assertPathChanges(2, 1);

    delete model.x;
    assertPathChanges(1, 2);

    proto.x = 3;
    assertPathChanges(3, 1);
    observer.close();
  });

  // FIXME: Need test of observing change on proto.

  test('Delete Of Non Configurable', function() {
    var model = {};
    Object.defineProperty(model, 'x', {
      configurable: false,
      value: 1
    });

    observer = new PathObserver(model, 'x');
    observer.open(callback);

    delete model.x;
    assertNoChanges();
    observer.close();
  });

  test('Notify', function() {
    if (typeof Object.getNotifier !== 'function')
      return;

    var model = {
      a: {}
    }

    var _b = 2;

    Object.defineProperty(model.a, 'b', {
      get: function() { return _b; },
      set: function(b) {
        Object.getNotifier(this).notify({
          type: 'update',
          name: 'b',
          oldValue: _b
        });

        _b = b;
      }
    });

    observer = new PathObserver(model, 'a.b');
    observer.open(callback);
    _b = 3;
    assertPathChanges(3, 2);

    model.a.b = 4; // will be observed.
    assertPathChanges(4, 3);

    observer.close();
  });

  test('issue-161', function(done) {
    var model = { model: 'model' };
    var ob1 = new PathObserver(model, 'obj.bar');
    var called = false
    ob1.open(function() {
      called = true;
    });

    var obj2 = new PathObserver(model, 'obj');
    obj2.open(function() {
      model.obj.bar = true;
    });

    model.obj = { 'obj': 'obj' };
    model.obj.foo = true;

    then(function() {
      assert.strictEqual(called, true);
      done();
    });
  });

  test('object cycle', function(done) {
    var model = { a: {}, c: 1 };
    model.a.b = model;

    var called = 0;
    new PathObserver(model, 'a.b.c').open(function() {
      called++;
    });

    // This change should be detected, even though it's a change to the root
    // object and isn't a change to `a`.
    model.c = 42;

    then(function() {
      assert.equal(called, 1);
      done();
    });
  });

});


suite('CompoundObserver Tests', function() {

  setup(doSetup);

  teardown(doTeardown);

  test('Simple', function() {
    var model = { a: 1, b: 2, c: 3 };

    observer = new CompoundObserver();
    observer.addPath(model, 'a');
    observer.addPath(model, 'b');
    observer.addPath(model, Path.get('c'));
    observer.open(callback);
    assertNoChanges();

    var observerCallbackArg = [model, Path.get('a'),
                               model, Path.get('b'),
                               model, Path.get('c')];
    model.a = -10;
    model.b = 20;
    model.c = 30;
    assertCompoundPathChanges([-10, 20, 30], [1, 2, 3],
                              observerCallbackArg);

    model.a = 'a';
    model.c = 'c';
    assertCompoundPathChanges(['a', 20, 'c'], [-10,, 30],
                              observerCallbackArg);

    model.a = 2;
    model.b = 3;
    model.c = 4;

    assertCompoundPathChanges([2, 3, 4], ['a', 20, 'c'],
                              observerCallbackArg);

    model.a = 'z';
    model.b = 'y';
    model.c = 'x';
    assert.deepEqual(['z', 'y', 'x'], observer.discardChanges());
    assertNoChanges();

    assert.strictEqual('z', model.a);
    assert.strictEqual('y', model.b);
    assert.strictEqual('x', model.c);
    assertNoChanges();

    observer.close();
  });

  test('reportChangesOnOpen', function() {
    var model = { a: 1, b: 2, c: 3 };

    observer = new CompoundObserver(true);
    observer.addPath(model, 'a');
    observer.addPath(model, 'b');
    observer.addPath(model, Path.get('c'));

    model.a = -10;
    model.b = 20;
    observer.open(callback);
    var observerCallbackArg = [model, Path.get('a'),
                               model, Path.get('b'),
                               model, Path.get('c')];
    assertCompoundPathChanges([-10, 20, 3], [1, 2, ],
                              observerCallbackArg, true);
    observer.close();
  });

  test('All Observers', function() {
    function ident(value) { return value; }

    var model = { a: 1, b: 2, c: 3 };

    observer = new CompoundObserver();
    var pathObserver1 = new PathObserver(model, 'a');
    var pathObserver2 = new PathObserver(model, 'b');
    var pathObserver3 = new PathObserver(model, Path.get('c'));

    observer.addObserver(pathObserver1);
    observer.addObserver(pathObserver2);
    observer.addObserver(pathObserver3);
    observer.open(callback);

    var observerCallbackArg = [Observer.observerSentinel_, pathObserver1,
                               Observer.observerSentinel_, pathObserver2,
                               Observer.observerSentinel_, pathObserver3];
    model.a = -10;
    model.b = 20;
    model.c = 30;
    assertCompoundPathChanges([-10, 20, 30], [1, 2, 3],
                              observerCallbackArg);

    model.a = 'a';
    model.c = 'c';
    assertCompoundPathChanges(['a', 20, 'c'], [-10,, 30],
                              observerCallbackArg);

    observer.close();
  });

  test('Degenerate Values', function() {
    var model = {};
    observer = new CompoundObserver();
    observer.addPath({}, '.'); // invalid path
    observer.addPath('obj-value', ''); // empty path
    observer.addPath({}, 'foo'); // unreachable
    observer.addPath(3, 'bar'); // non-object with non-empty path
    var values = observer.open(callback);
    assert.strictEqual(4, values.length);
    assert.strictEqual(undefined, values[0]);
    assert.strictEqual('obj-value', values[1]);
    assert.strictEqual(undefined, values[2]);
    assert.strictEqual(undefined, values[3]);
    observer.close();
  });

  test('valueFn - return object literal', function() {
    var model = { a: 1};

    function valueFn(values) {
      return {};
    }

    observer = new CompoundObserver(valueFn);

    observer.addPath(model, 'a');
    observer.open(callback);
    model.a = 2;

    observer.deliver();
    assert.isTrue(window.dirtyCheckCycleCount === undefined ||
                  window.dirtyCheckCycleCount === 1);
    observer.close();
  });

  test('reset', function() {
    var model = { a: 1, b: 2, c: 3 };
    var callCount = 0;
    function callback() {
      callCount++;
    }

    observer = new CompoundObserver();

    observer.addPath(model, 'a');
    observer.addPath(model, 'b');
    assert.deepEqual([1, 2], observer.open(callback));

    model.a = 2;
    observer.deliver();
    assert.strictEqual(1, callCount);

    model.b = 3;
    observer.deliver();
    assert.strictEqual(2, callCount);

    model.c = 4;
    observer.deliver();
    assert.strictEqual(2, callCount);

    observer.startReset();
    observer.addPath(model, 'b');
    observer.addPath(model, 'c');
    assert.deepEqual([3, 4], observer.finishReset())

    model.a = 3;
    observer.deliver();
    assert.strictEqual(2, callCount);

    model.b = 4;
    observer.deliver();
    assert.strictEqual(3, callCount);

    model.c = 5;
    observer.deliver();
    assert.strictEqual(4, callCount);

    observer.close();
  });

  test('Heterogeneous', function() {
    var model = { a: 1, b: 2 };
    var otherModel = { c: 3 };

    function valueFn(value) { return value * 2; }
    function setValueFn(value) { return value / 2; }

    var compound = new CompoundObserver;
    compound.addPath(model, 'a');
    compound.addObserver(new ObserverTransform(new PathObserver(model, 'b'),
                                               valueFn, setValueFn));
    compound.addObserver(new PathObserver(otherModel, 'c'));

    function combine(values) {
      return values[0] + values[1] + values[2];
    };
    observer = new ObserverTransform(compound, combine);
    assert.strictEqual(8, observer.open(callback));

    model.a = 2;
    model.b = 4;
    assertPathChanges(13, 8);

    model.b = 10;
    otherModel.c = 5;
    assertPathChanges(27, 13);

    model.a = 20;
    model.b = 1;
    otherModel.c = 5;
    assertNoChanges();

    observer.close();
  })
});

suite('ArrayObserver Tests', function() {

  setup(doSetup);

  teardown(doTeardown);

  function ensureNonSparse(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (i in arr)
        continue;
      arr[i] = undefined;
    }
  }

  function assertArrayChanges(expectSplices) {
    observer.deliver();
    var splices = callbackArgs[0];

    assert.isTrue(callbackInvoked);

    splices.forEach(function(splice) {
      ensureNonSparse(splice.removed);
    });

    expectSplices.forEach(function(splice) {
      ensureNonSparse(splice.removed);
    });

    assert.deepEqual(expectSplices, splices);
    callbackArgs = undefined;
    callbackInvoked = false;
  }

  function applySplicesAndAssertDeepEqual(orig, copy) {
    observer.deliver();
    if (callbackInvoked) {
      var splices = callbackArgs[0];
      ArrayObserver.applySplices(copy, orig, splices);
    }

    ensureNonSparse(orig);
    ensureNonSparse(copy);
    assert.deepEqual(orig, copy);
    callbackArgs = undefined;
    callbackInvoked = false;
  }

  function assertEditDistance(orig, expectDistance) {
    observer.deliver();
    var splices = callbackArgs[0];
    var actualDistance = 0;

    if (callbackInvoked) {
      splices.forEach(function(splice) {
        actualDistance += splice.addedCount + splice.removed.length;
      });
    }

    assert.deepEqual(expectDistance, actualDistance);
    callbackArgs = undefined;
    callbackInvoked = false;
  }

  function arrayMutationTest(arr, operations) {
    var copy = arr.slice();
    observer = new ArrayObserver(arr);
    observer.open(callback);
    operations.forEach(function(op) {
      switch(op.name) {
        case 'delete':
          delete arr[op.index];
          break;

        case 'update':
          arr[op.index] = op.value;
          break;

        default:
          arr[op.name].apply(arr, op.args);
          break;
      }
    });

    applySplicesAndAssertDeepEqual(arr, copy);
    observer.close();
  }

  test('Optional target for callback', function() {
    var target = {
      changed: function(splices) {
        this.called = true;
      }
    };
    var obj = [];
    var observer = new ArrayObserver(obj);
    observer.open(target.changed, target);
    obj.length = 1;
    observer.deliver();
    assert.isTrue(target.called);
    observer.close();
  });

  test('Delivery Until No Changes', function() {
    var arr = [0, 1, 2, 3, 4];
    var callbackCount = 0;
    var observer = new ArrayObserver(arr);
    observer.open(function() {
      callbackCount++;
      arr.shift();
    });

    arr.shift();
    observer.deliver();

    assert.equal(5, callbackCount);

    observer.close();
  });

  test('Array disconnect', function() {
    var arr = [ 0 ];

    observer = new ArrayObserver(arr);
    observer.open(callback);

    arr[0] = 1;

    assertArrayChanges([{
      index: 0,
      removed: [0],
      addedCount: 1
    }]);

    observer.close();
    arr[1] = 2;
    assertNoChanges();
  });

  test('Array discardChanges', function() {
    var arr = [];

    arr.push(1);
    observer = new ArrayObserver(arr);
    observer.open(callback);
    arr.push(2);

    assertArrayChanges([{
      index: 1,
      removed: [],
      addedCount: 1
    }]);

    arr.push(3);
    observer.discardChanges();
    assertNoChanges();

    arr.pop();
    assertArrayChanges([{
      index: 2,
      removed: [3],
      addedCount: 0
    }]);
    observer.close();
  });

  test('Array', function() {
    var model = [0, 1];

    observer = new ArrayObserver(model);
    observer.open(callback);

    model[0] = 2;

    assertArrayChanges([{
      index: 0,
      removed: [0],
      addedCount: 1
    }]);

    model[1] = 3;
    assertArrayChanges([{
      index: 1,
      removed: [1],
      addedCount: 1
    }]);

    observer.close();
  });

  test('Array observe non-array throws', function() {
    assert.throws(function () {
      observer = new ArrayObserver({});
    });
  });

  test('Array Set Same', function() {
    var model = [1];

    observer = new ArrayObserver(model);
    observer.open(callback);

    model[0] = 1;
    observer.deliver();
    assert.isFalse(callbackInvoked);
    observer.close();
  });

  test('Array Splice', function() {
    var model = [0, 1]

    observer = new ArrayObserver(model);
    observer.open(callback);

    model.splice(1, 1, 2, 3); // [0, 2, 3]
    assertArrayChanges([{
      index: 1,
      removed: [1],
      addedCount: 2
    }]);

    model.splice(0, 1); // [2, 3]
    assertArrayChanges([{
      index: 0,
      removed: [0],
      addedCount: 0
    }]);

    model.splice();
    assertNoChanges();

    model.splice(0, 0);
    assertNoChanges();

    model.splice(0, -1);
    assertNoChanges();

    model.splice(-1, 0, 1.5); // [2, 1.5, 3]
    assertArrayChanges([{
      index: 1,
      removed: [],
      addedCount: 1
    }]);

    model.splice(3, 0, 0); // [2, 1.5, 3, 0]
    assertArrayChanges([{
      index: 3,
      removed: [],
      addedCount: 1
    }]);

    model.splice(0); // []
    assertArrayChanges([{
      index: 0,
      removed: [2, 1.5, 3, 0],
      addedCount: 0
    }]);

    observer.close();
  });

  test('Array Splice Truncate And Expand With Length', function() {
    var model = ['a', 'b', 'c', 'd', 'e'];

    observer = new ArrayObserver(model);
    observer.open(callback);

    model.length = 2;

    assertArrayChanges([{
      index: 2,
      removed: ['c', 'd', 'e'],
      addedCount: 0
    }]);

    model.length = 5;

    assertArrayChanges([{
      index: 2,
      removed: [],
      addedCount: 3
    }]);

    observer.close();
  });

  test('Array Splice Delete Too Many', function() {
    var model = ['a', 'b', 'c'];

    observer = new ArrayObserver(model);
    observer.open(callback);

    model.splice(2, 3); // ['a', 'b']
    assertArrayChanges([{
      index: 2,
      removed: ['c'],
      addedCount: 0
    }]);

    observer.close();
  });

  test('Array Length', function() {
    var model = [0, 1];

    observer = new ArrayObserver(model);
    observer.open(callback);

    model.length = 5; // [0, 1, , , ,];
    assertArrayChanges([{
      index: 2,
      removed: [],
      addedCount: 3
    }]);

    model.length = 1;
    assertArrayChanges([{
        index: 1,
        removed: [1, , , ,],
        addedCount: 0
    }]);

    model.length = 1;
    assertNoChanges();

    observer.close();
  });

  test('Array Push', function() {
    var model = [0, 1];

    observer = new ArrayObserver(model);
    observer.open(callback);

    model.push(2, 3); // [0, 1, 2, 3]
    assertArrayChanges([{
      index: 2,
      removed: [],
      addedCount: 2
    }]);

    model.push();
    assertNoChanges();

    observer.close();
  });

  test('Array Pop', function() {
    var model = [0, 1];

    observer = new ArrayObserver(model);
    observer.open(callback);

    model.pop(); // [0]
    assertArrayChanges([{
      index: 1,
      removed: [1],
      addedCount: 0
    }]);

    model.pop(); // []
    assertArrayChanges([{
      index: 0,
      removed: [0],
      addedCount: 0
    }]);

    model.pop();
    assertNoChanges();

    observer.close();
  });

  test('Array Shift', function() {
    var model = [0, 1];

    observer = new ArrayObserver(model);
    observer.open(callback);

    model.shift(); // [1]
    assertArrayChanges([{
      index: 0,
      removed: [0],
      addedCount: 0
    }]);

    model.shift(); // []
    assertArrayChanges([{
      index: 0,
      removed: [1],
      addedCount: 0
    }]);

    model.shift();
    assertNoChanges();

    observer.close();
  });

  test('Array Unshift', function() {
    var model = [0, 1];

    observer = new ArrayObserver(model);
    observer.open(callback);

    model.unshift(-1); // [-1, 0, 1]
    assertArrayChanges([{
      index: 0,
      removed: [],
      addedCount: 1
    }]);

    model.unshift(-3, -2); // []
    assertArrayChanges([{
      index: 0,
      removed: [],
      addedCount: 2
    }]);

    model.unshift();
    assertNoChanges();

    observer.close();
  });

  test('Array Tracker Contained', function() {
    arrayMutationTest(
        ['a', 'b'],
        [
          { name: 'splice', args: [1, 1] },
          { name: 'unshift', args: ['c', 'd', 'e'] },
          { name: 'splice', args: [1, 2, 'f'] }
        ]
    );
  });

  test('Array Tracker Delete Empty', function() {
    arrayMutationTest(
        [],
        [
          { name: 'delete', index: 0 },
          { name: 'splice', args: [0, 0, 'a', 'b', 'c'] }
        ]
    );
  });

  test('Array Tracker Right Non Overlap', function() {
    arrayMutationTest(
        ['a', 'b', 'c', 'd'],
        [
          { name: 'splice', args: [0, 1, 'e'] },
          { name: 'splice', args: [2, 1, 'f', 'g'] }
        ]
    );
  });

  test('Array Tracker Left Non Overlap', function() {
    arrayMutationTest(
        ['a', 'b', 'c', 'd'],
        [
          { name: 'splice', args: [3, 1, 'f', 'g'] },
          { name: 'splice', args: [0, 1, 'e'] }
        ]
    );
  });

  test('Array Tracker Right Adjacent', function() {
    arrayMutationTest(
        ['a', 'b', 'c', 'd'],
        [
          { name: 'splice', args: [1, 1, 'e'] },
          { name: 'splice', args: [2, 1, 'f', 'g'] }
        ]
    );
  });

  test('Array Tracker Left Adjacent', function() {
    arrayMutationTest(
        ['a', 'b', 'c', 'd'],
        [
          { name: 'splice', args: [2, 2, 'e'] },
          { name: 'splice', args: [1, 1, 'f', 'g'] }
        ]
    );
  });

  test('Array Tracker Right Overlap', function() {
    arrayMutationTest(
        ['a', 'b', 'c', 'd'],
        [
          { name: 'splice', args: [1, 1, 'e'] },
          { name: 'splice', args: [1, 1, 'f', 'g'] }
        ]
    );
  });

  test('Array Tracker Left Overlap', function() {
    arrayMutationTest(
        ['a', 'b', 'c', 'd'],
        [
          // a b [e f g] d
          { name: 'splice', args: [2, 1, 'e', 'f', 'g'] },
          // a [h i j] f g d
          { name: 'splice', args: [1, 2, 'h', 'i', 'j'] }
        ]
    );
  });

  test('Array Tracker Prefix And Suffix One In', function() {
    arrayMutationTest(
        ['a', 'b', 'c', 'd'],
        [
          { name: 'unshift', args: ['z'] },
          { name: 'push', arg: ['z'] }
        ]
    );
  });

  test('Array Tracker Shift One', function() {
    arrayMutationTest(
        [16, 15, 15],
        [
          { name: 'shift', args: ['z'] }
        ]
    );
  });

  test('Array Tracker Update Delete', function() {
    arrayMutationTest(
        ['a', 'b', 'c', 'd'],
        [
          { name: 'splice', args: [2, 1, 'e', 'f', 'g'] },
          { name: 'update', index: 0, value: 'h' },
          { name: 'delete', index: 1 }
        ]
    );
  });

  test('Array Tracker Update After Delete', function() {
    arrayMutationTest(
        ['a', 'b', undefined, 'd'],
        [
          { name: 'update', index: 2, value: 'e' }
        ]
    );
  });

  test('Array Tracker Delete Mid Array', function() {
    arrayMutationTest(
        ['a', 'b', 'c', 'd'],
        [
          { name: 'delete', index: 2 }
        ]
    );
  });

  test('Array Random Case 1', function() {
    var model = ['a','b'];
    var copy = model.slice();

    observer = new ArrayObserver(model);
    observer.open(callback);

    model.splice(0, 1, 'c', 'd', 'e');
    model.splice(4,0,'f');
    model.splice(3,2);

    applySplicesAndAssertDeepEqual(model, copy);
  });

  test('Array Random Case 2', function() {
    var model = [3,4];
    var copy = model.slice();

    observer = new ArrayObserver(model);
    observer.open(callback);

    model.splice(2,0,8);
    model.splice(0,1,0,5);
    model.splice(2,2);

    applySplicesAndAssertDeepEqual(model, copy);
  });

  test('Array Random Case 3', function() {
    var model = [1,3,6];
    var copy = model.slice();

    observer = new ArrayObserver(model);
    observer.open(callback);

    model.splice(1,1);
    model.splice(0,2,1,7);
    model.splice(1,0,3,7);

    applySplicesAndAssertDeepEqual(model, copy);
  });

  test('Array Tracker Fuzzer', function() {
    var testCount = 64;

    console.log('Fuzzing spliceProjection ' + testCount +
                ' passes with ' + ArrayFuzzer.operationCount + ' operations each.');

    for (var i = 0; i < testCount; i++) {
      console.log('pass: ' + i);
      var fuzzer = new ArrayFuzzer();
      fuzzer.go();
      ensureNonSparse(fuzzer.arr);
      ensureNonSparse(fuzzer.copy);
      assert.deepEqual(fuzzer.arr, fuzzer.copy);
    }
  });

  test('Array Tracker No Proxies Edits', function() {
    model = [];
    observer = new ArrayObserver(model);
    observer.open(callback);
    model.length = 0;
    model.push(1, 2, 3);
    assertEditDistance(model, 3);
    observer.close();

    model = ['x', 'x', 'x', 'x', '1', '2', '3'];
    observer = new ArrayObserver(model);
    observer.open(callback);
    model.length = 0;
    model.push('1', '2', '3', 'y', 'y', 'y', 'y');
    assertEditDistance(model, 8);
    observer.close();

    model = ['1', '2', '3', '4', '5'];
    observer = new ArrayObserver(model);
    observer.open(callback);
    model.length = 0;
    model.push('a', '2', 'y', 'y', '4', '5', 'z', 'z');
    assertEditDistance(model, 7);
    observer.close();
  });
});

suite('ObjectObserver Tests', function() {

  setup(doSetup);

  teardown(doTeardown);

  function assertObjectChanges(expect) {
    observer.deliver();

    assert.isTrue(callbackInvoked);

    var added = callbackArgs[0];
    var removed = callbackArgs[1];
    var changed = callbackArgs[2];
    var getOldValue = callbackArgs[3];
    var oldValues = {};

    function collectOldValues(type) {
      Object.keys(type).forEach(function(prop) {
        oldValues[prop] = getOldValue(prop);
      });
    };
    collectOldValues(added);
    collectOldValues(removed);
    collectOldValues(changed);

    assert.deepEqual(expect.added, added);
    assert.deepEqual(expect.removed, removed);
    assert.deepEqual(expect.changed, changed);
    assert.deepEqual(expect.oldValues, oldValues);

    callbackArgs = undefined;
    callbackInvoked = false;
  }

  test('Optional target for callback', function() {
    var target = {
      changed: function(value, oldValue) {
        this.called = true;
      }
    };
    var obj = { foo: 1 };
    var observer = new PathObserver(obj, 'foo');
    observer.open(target.changed, target);
    obj.foo = 2;
    observer.deliver();
    assert.isTrue(target.called);

    observer.close();
  });

  test('Delivery Until No Changes', function() {
    var obj = { foo: 5 };
    var callbackCount = 0;
    var observer = new ObjectObserver(obj);
    observer.open(function() {
      callbackCount++;
      if (!obj.foo)
        return;

      obj.foo--;
    });

    obj.foo--;
    observer.deliver();

    assert.equal(5, callbackCount);

    observer.close();
  });

  test('Object disconnect', function() {
    var obj = {};

    obj.foo = 'bar';
    observer = new ObjectObserver(obj);
    observer.open(callback);

    obj.foo = 'baz';
    obj.bat = 'bag';
    obj.blaz = 'foo';

    delete obj.foo;
    delete obj.blaz;

    assertObjectChanges({
      added: {
        'bat': 'bag'
      },
      removed: {
        'foo': undefined
      },
      changed: {},
      oldValues: {
        'foo': 'bar',
        'bat': undefined
      }
    });

    obj.foo = 'blarg';

    observer.close();

    obj.bar = 'blaz';
    assertNoChanges();
  });

  test('Object discardChanges', function() {
    var obj = {};

    obj.foo = 'bar';
    observer = new ObjectObserver(obj);
    observer.open(callback);
    obj.foo = 'baz';

    assertObjectChanges({
      added: {},
      removed: {},
      changed: {
        foo: 'baz'
      },
      oldValues: {
        foo: 'bar'
      }
    });

    obj.blaz = 'bat';
    observer.discardChanges();
    assertNoChanges();

    obj.bat = 'bag';
    assertObjectChanges({
      added: {
        bat: 'bag'
      },
      removed: {},
      changed: {},
      oldValues: {
        bat: undefined
      }
    });
    observer.close();
  });

  test('Object observe array', function() {
    var arr = [];

    observer = new ObjectObserver(arr);
    observer.open(callback);

    arr.length = 5;
    arr.foo = 'bar';
    arr[3] = 'baz';

    assertObjectChanges({
      added: {
        foo: 'bar',
        '3': 'baz'
      },
      removed: {},
      changed: {
        'length': 5
      },
      oldValues: {
        length: 0,
        foo: undefined,
        '3': undefined
      }
    });

    observer.close();
  });

  test('Object', function() {
    var model = {};

    observer = new ObjectObserver(model);
    observer.open(callback);
    model.id = 0;
    assertObjectChanges({
      added: {
        id: 0
      },
      removed: {},
      changed: {},
      oldValues: {
        id: undefined
      }
    });

    delete model.id;
    assertObjectChanges({
      added: {},
      removed: {
        id: undefined
      },
      changed: {},
      oldValues: {
        id: 0
      }
    });

    // Stop observing -- shouldn't see an event
    observer.close();
    model.id = 101;
    assertNoChanges();

    // Re-observe -- should see an new event again.
    observer = new ObjectObserver(model);
    observer.open(callback);
    model.id2 = 202;;
    assertObjectChanges({
      added: {
        id2: 202
      },
      removed: {},
      changed: {},
      oldValues: {
        id2: undefined
      }
    });

    observer.close();
  });

  test('Object Delete Add Delete', function() {
    var model = { id: 1 };

    observer = new ObjectObserver(model);
    observer.open(callback);

    // If mutation occurs in seperate "runs", two events fire.
    delete model.id;
    assertObjectChanges({
      added: {},
      removed: {
        id: undefined
      },
      changed: {},
      oldValues: {
        id: 1
      }
    });

    model.id = 1;
    assertObjectChanges({
      added: {
        id: 1
      },
      removed: {},
      changed: {},
      oldValues: {
        id: undefined
      }
    });

    // If mutation occurs in the same "run", no events fire (nothing changed).
    delete model.id;
    model.id = 1;
    assertNoChanges();

    observer.close();
  });

  test('Object Set Undefined', function() {
    var model = {};

    observer = new ObjectObserver(model);
    observer.open(callback);

    model.x = undefined;
    assertObjectChanges({
      added: {
        x: undefined
      },
      removed: {},
      changed: {},
      oldValues: {
        x: undefined
      }
    });

    observer.close();
  });
});
