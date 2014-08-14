// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
// This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
// The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also
// subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt

var testDiv;

function clearAllTemplates(node) {
  if (node instanceof HTMLTemplateElement || node.iterator_)
    node.clear();

  for (var child = node.firstChild; child; child = child.nextSibling)
    clearAllTemplates(child);
}

function doSetup() {
  testDiv = document.body.appendChild(document.createElement('div'));
  Observer._errorThrownDuringCallback = false;
}

function doTeardown() {
  assert.isFalse(!!Observer._errorThrownDuringCallback);
  document.body.removeChild(testDiv);
  clearAllTemplates(testDiv);
  Platform.performMicrotaskCheckpoint();
  assert.strictEqual(0, Observer._allObserversCount);
}

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

function createTestHtml(s) {
  var div = document.createElement('div');
  div.innerHTML = s;
  testDiv.appendChild(div);

  HTMLTemplateElement.forAllTemplatesFrom_(div, function(template) {
    HTMLTemplateElement.decorate(template);
  });

  return div;
}

function recursivelySetTemplateModel(node, model, delegate) {
  HTMLTemplateElement.forAllTemplatesFrom_(node, function(template) {
    template.bindingDelegate = delegate;
    template.model = model;
  });
}

suite('Template Instantiation', function() {

  setup(doSetup)

  teardown(doTeardown);

  function createShadowTestHtml(s) {
    var div = document.createElement('div');
    var root = div.webkitCreateShadowRoot();
    root.innerHTML = s;
    testDiv.appendChild(div);

    HTMLTemplateElement.forAllTemplatesFrom_(div, function(node) {
      HTMLTemplateElement.decorate(node);
    });

    return root;
  }

  function dispatchEvent(type, target) {
    var event = document.createEvent('Event');
    event.initEvent(type, true, false);
    target.dispatchEvent(event);
  }

  test('accessing bindingDelegate getter without Bind', function(done) {
    var div = createTestHtml('<template></template>');
    var template = div.firstChild;
    assert.strictEqual(template.bindingDelegate, undefined);
    done();
  });

  test('Bind', function(done) {
    var div = createTestHtml(
        '<template bind={{}}>text</template>');
    var template = div.firstChild;
    template.model = {};

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('text', div.lastChild.textContent);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      template.model = null;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('text', div.lastChild.textContent);

      done();
    });
  });

  test('oneTime-Bind', function(done) {
    var div = createTestHtml(
        '<template bind="[[ bound ]]">text</template>');
    var template = div.firstChild;
    var m = { bound: 1 };
    template.model = m;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('text', div.lastChild.textContent);

      m.bound = undefined;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('text', div.lastChild.textContent);

      done();
    });
  });

  test('Bind - no parent', function(done) {
    var div = createTestHtml(
      '<template bind>text</template>');
    var template = div.firstChild;
    div.removeChild(template);

    template.model = {};

    then(function() {
      assert.strictEqual(0, template.childNodes.length);
      assert.strictEqual(null, template.nextSibling);
      assert.isFalse(!!Observer._errorThrownDuringCallback);

      done();
    });
  });

  test('Bind, no defaultView', function(done) {
    var div = createTestHtml(
      '<template bind>text</template>');
    var template = div.firstChild;
    var doc = document.implementation.createHTMLDocument('');
    doc.adoptNode(div);
    template.model = {};

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.isFalse(!!Observer._errorThrownDuringCallback);
      clearAllTemplates(div);

      done();
    });
  });

  test('Empty Bind', function(done) {
    var div = createTestHtml(
        '<template bind>text</template>');
    var template = div.firstChild;
    template.model = {};

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('text', div.lastChild.textContent);

      done();
    });
  });

  test('Bind If', function(done) {
    var div = createTestHtml(
        '<template bind="{{ bound }}" if="{{ predicate }}">' +
          'value:{{ value }}' +
        '</template>');
    var m = { bound: null, predicate: 0 };
    var template = div.firstChild;

    template.model = m;

    then(function() {
      assert.strictEqual(1, div.childNodes.length);

      m.predicate = 1;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:', div.lastChild.textContent);

      m.bound = { value: 2 };

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:2', div.lastChild.textContent);

      m.bound.value = 3;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:3', div.lastChild.textContent);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('Bind oneTime-If (predicate false)', function(done) {
    var div = createTestHtml(
        '<template bind="{{ bound }}" if="[[ predicate ]]">' +
          'value:{{ value }}' +
        '</template>');
    var m = { bound: null, predicate: 0 };
    var template = div.firstChild;

    template.model = m;

    then(function() {
      assert.strictEqual(1, div.childNodes.length);

      m.predicate = 1;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      m.bound = { value: 2 };

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      m.bound.value = 3;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('Bind oneTime-If (predicate true)', function(done) {
    var div = createTestHtml(
        '<template bind="{{ bound }}" if="[[ predicate ]]">' +
          'value:{{ value }}' +
        '</template>');
    var m = { bound: null, predicate: 1 };
    var template = div.firstChild;

    template.model = m;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:', div.lastChild.textContent);

      m.bound = { value: 2 };

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:2', div.lastChild.textContent);

      m.bound.value = 3;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:3', div.lastChild.textContent);

      m.predicate = 0;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:3', div.lastChild.textContent);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('oneTime-Bind If', function(done) {
    var div = createTestHtml(
        '<template bind="[[ bound ]]" if="{{ predicate }}">' +
          'value:{{ value }}' +
        '</template>');
    var m = { bound: { value: 2 }, predicate: 0 };
    var template = div.firstChild;

    template.model = m;

    then(function() {
      assert.strictEqual(1, div.childNodes.length);

      m.predicate = 1;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:2', div.lastChild.textContent);

      m.bound.value = 3;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:3', div.lastChild.textContent);

      m.bound = { value: 4 };

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:3', div.lastChild.textContent);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('oneTime-Bind oneTime-If', function(done) {
    var div = createTestHtml(
        '<template bind="[[ bound ]]" if="[[ predicate ]]">' +
          'value:{{ value }}' +
        '</template>');
    var m = { bound: { value: 2 }, predicate: 1 };
    var template = div.firstChild;

    template.model = m;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:2', div.lastChild.textContent);

      m.bound.value = 3;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:3', div.lastChild.textContent);

      m.bound = { value: 4 };

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:3', div.lastChild.textContent);

      m.predicate = 0;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:3', div.lastChild.textContent);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('Bind If, 2', function(done) {
    var div = createTestHtml(
        '<template bind="{{ foo }}" if="{{ bar }}">{{ bat }}</template>');
    var template = div.firstChild;
    var m = { bar: 0, foo: { bat: 'baz' } };
    template.model = m;

    then(function() {
      assert.strictEqual(1, div.childNodes.length);

      m.bar = 1;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('baz', div.lastChild.textContent);

      done();
    });
  });

  test('If', function(done) {
    var div = createTestHtml(
        '<template if="{{ foo }}">{{ value }}</template>');
    var m = { foo: 0, value: 'foo' };
    var template = div.firstChild;
    template.model = m;

    then(function() {
      assert.strictEqual(1, div.childNodes.length);

      m.foo = 1;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('foo', div.lastChild.textContent);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('Bind If minimal discardChanges', function(done) {

    var div = createTestHtml(
        '<template bind="{{ bound }}" if="{{ predicate }}">' +
          'value:{{ value }}' +
        '</template>');
    var m = { bound: null, predicate: 0 };
    var template = div.firstChild;

    var discardChangesCalled = { bound: 0, predicate: 0 };
    template.bindingDelegate = {
      prepareBinding: function(path, name, node) {
        return function(model, node, oneTime) {
          var result = new PathObserver(model, path); 
          result.discardChanges = function() {
            discardChangesCalled[path]++;
            return PathObserver.prototype.discardChanges.call(this);
          }
          return result;
        }
      }
    };

    template.model = m;

    then(function() {
      assert.strictEqual(0, discardChangesCalled.bound);
      assert.strictEqual(0, discardChangesCalled.predicate);

      assert.strictEqual(1, div.childNodes.length);

      m.predicate = 1;

    }).then(function() {
      assert.strictEqual(1, discardChangesCalled.bound);
      assert.strictEqual(0, discardChangesCalled.predicate);

      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:', div.lastChild.textContent);

      m.bound = { value: 2 };

    }).then(function() {
      assert.strictEqual(1, discardChangesCalled.bound);
      assert.strictEqual(1, discardChangesCalled.predicate);

      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:2', div.lastChild.textContent);

      m.bound.value = 3;

    }).then(function() {
      assert.strictEqual(1, discardChangesCalled.bound);
      assert.strictEqual(1, discardChangesCalled.predicate);

      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('value:3', div.lastChild.textContent);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, discardChangesCalled.bound);
      assert.strictEqual(1, discardChangesCalled.predicate);

      assert.strictEqual(1, div.childNodes.length);

      done();
    });

  });

  test('Empty If', function(done) {
    var div = createTestHtml(
        '<template if>{{ value }}</template>');
    var m = { value: 'foo' };
    var template = div.firstChild;
    template.model = null;

    then(function() {
      assert.strictEqual(1, div.childNodes.length);

      template.model = m;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('foo', div.lastChild.textContent);

      done();
    });
  });

  test('OneTime - simple text', function(done) {
    var div = createTestHtml(
        '<template bind>[[ value ]]</template>');
    var template = div.firstChild;
    var m = { value: 'foo' };
    template.model = m;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('foo', div.lastChild.textContent);

      m.value = 'bar';

    }).then(function() {
      // unchanged.
      assert.strictEqual('foo', div.lastChild.textContent);

      done();
    });
  });

  test('OneTime - compound text' , function(done) {
    var div = createTestHtml(
        '<template bind>[[ foo ]] bar [[ baz ]]</template>');
    var template = div.firstChild;
    var m = { foo: 'FOO', baz: 'BAZ' };
    template.model = m;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('FOO bar BAZ', div.lastChild.textContent);

      m.foo = 'FI';
      m.baz = 'BA';

    }).then(function() {
      // unchanged.
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('FOO bar BAZ', div.lastChild.textContent);

      done();
    });
  });

  test('OneTime/Dynamic Mixed - compound text' , function(done) {
    var div = createTestHtml(
        '<template bind>[[ foo ]] bar {{ baz }}</template>');
    var template = div.firstChild;
    var m = { foo: 'FOO', baz: 'BAZ' };
    template.model = m;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('FOO bar BAZ', div.lastChild.textContent);

      m.foo = 'FI';
      m.baz = 'BA';

    }).then(function() {
      // unchanged [[ foo ]].
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('FOO bar BA', div.lastChild.textContent);

      done();
    });
  });

  test('OneTime - simple attribute', function(done) {
    var div = createTestHtml(
        '<template bind><div foo="[[ value ]]"></div></template>');
    var template = div.firstChild;
    var m = { value: 'foo' };
    template.model = m;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('foo', div.lastChild.getAttribute('foo'));

      m.value = 'bar';

    }).then(function() {
      // unchanged.
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('foo', div.lastChild.getAttribute('foo'));

      done();
    });
  });

  test('OneTime - compound attribute', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<div foo="[[ value ]]:[[ otherValue]]"></div>' +
        '</template>');
    var template = div.firstChild;
    var m = { value: 'foo', otherValue: 'bar' };
    template.model = m;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('foo:bar', div.lastChild.getAttribute('foo'));

      m.value = 'baz';
      m.otherValue = 'bot';

    }).then(function() {
      // unchanged.
      assert.strictEqual('foo:bar', div.lastChild.getAttribute('foo'));

      done();
    });
  });

  test('OneTime/Dynamic Mixed - compound attribute', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<div foo="{{ value }}:[[ otherValue]]"></div>' +
        '</template>');
    var template = div.firstChild;
    var m = { value: 'foo', otherValue: 'bar' };
    template.model = m;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('foo:bar', div.lastChild.getAttribute('foo'));

      m.value = 'baz';
      m.otherValue = 'bot';

    }).then(function() {
      //  unchanged [[otherValue]].
      assert.strictEqual('baz:bar', div.lastChild.getAttribute('foo'));

      done();
    });
  });

  test('Repeat If', function(done) {
    var div = createTestHtml(
        '<template repeat="{{ items }}" if="{{ predicate }}">{{}}</template>');
    var m = { predicate: 0, items: [1] };
    var template = div.firstChild;
    template.model = m;

    then(function() {
      assert.strictEqual(1, div.childNodes.length);

      m.predicate = 1;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('1', div.childNodes[1].textContent);

      m.items.push(2, 3);

    }).then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('1', div.childNodes[1].textContent);
      assert.strictEqual('2', div.childNodes[2].textContent);
      assert.strictEqual('3', div.childNodes[3].textContent);

      m.items = [4];

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('4', div.childNodes[1].textContent);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('Repeat oneTime-If (predicate false)', function(done) {
    var div = createTestHtml(
        '<template repeat="{{ items }}" if="[[ predicate ]]">{{}}</template>');
    var m = { predicate: 0, items: [1] };
    var template = div.firstChild;
    template.model = m;

    then(function() {
      assert.strictEqual(1, div.childNodes.length);

      m.predicate = 1;

    }).then(function() {
      // unchanged.
      assert.strictEqual(1, div.childNodes.length);

      m.items.push(2, 3);

    }).then(function() {
      // unchanged.
      assert.strictEqual(1, div.childNodes.length);

      m.items = [4];

    }).then(function() {
      // unchanged.
      assert.strictEqual(1, div.childNodes.length);

      template.model = undefined;

    }).then(function() {
      // unchanged.
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('Repeat oneTime-If (predicate true)', function(done) {
    var div = createTestHtml(
        '<template repeat="{{ items }}" if="[[ predicate ]]">{{}}</template>');
    var m = { predicate: 1, items: [1] };
    var template = div.firstChild;
    template.model = m;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('1', div.childNodes[1].textContent);

      m.items.push(2, 3);

    }).then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('1', div.childNodes[1].textContent);
      assert.strictEqual('2', div.childNodes[2].textContent);
      assert.strictEqual('3', div.childNodes[3].textContent);

      m.items = [4];

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('4', div.childNodes[1].textContent);

      m.predicate = 0;

    }).then(function() {
      // unchanged.
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('4', div.childNodes[1].textContent);

      template.model = undefined;
    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('oneTime-Repeat If', function(done) {
    var div = createTestHtml(
        '<template repeat="[[ items ]]" if="{{ predicate }}">{{}}</template>');
    var m = { predicate: 0, items: [1] };
    var template = div.firstChild;
    template.model = m;

    then(function() {
      assert.strictEqual(1, div.childNodes.length);

      m.predicate = 1;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('1', div.childNodes[1].textContent);

      m.items.push(2, 3);

    }).then(function() {
      // unchanged.
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('1', div.childNodes[1].textContent);

      m.items = [4];

    }).then(function() {
      // unchanged.
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('1', div.childNodes[1].textContent);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('oneTime-Repeat oneTime-If', function(done) {
    var div = createTestHtml(
        '<template repeat="[[ items ]]" if="[[ predicate ]]">{{}}</template>');
    var m = { predicate: 1, items: [1] };
    var template = div.firstChild;
    template.model = m;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('1', div.childNodes[1].textContent);

      m.items.push(2, 3);

    }).then(function() {
      // unchanged.
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('1', div.childNodes[1].textContent);

      m.items = [4];

    }).then(function() {
      // unchanged.
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('1', div.childNodes[1].textContent);

      m.predicate = 0;

    }).then(function() {
      // unchanged.
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('1', div.childNodes[1].textContent);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('TextTemplateWithNullStringBinding', function(done) {
    var div = createTestHtml(
        '<template bind={{}}>a{{b}}c</template>');
    var template = div.firstChild;
    var model =  {b: 'B'};
    template.model = model;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('aBc', div.lastChild.textContent);

      model.b = 'b';

    }).then(function() {
      assert.strictEqual('abc', div.lastChild.textContent);

      model.b = undefined;

    }).then(function() {
      assert.strictEqual('ac', div.lastChild.textContent);

      model = undefined;

    }).then(function() {
      // setting model isn't observable.
      assert.strictEqual('ac', div.lastChild.textContent);

      done();
    });
  });

  test('TextTemplateWithBindingPath', function(done) {
    var div = createTestHtml(
        '<template bind="{{ data }}">a{{b}}c</template>');
    var model =  { data: {b: 'B'} };
    var template = div.firstChild;
    template.model = model;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('aBc', div.lastChild.textContent);

      model.data.b = 'b';

    }).then(function() {
      assert.strictEqual('abc', div.lastChild.textContent);

      model.data = {b: 'X'};

    }).then(function() {
      assert.strictEqual('aXc', div.lastChild.textContent);

      model.data = null;

    }).then(function() {
      assert.strictEqual('ac', div.lastChild.textContent);

      done();
    });
  });

  test('TextTemplateWithBindingAndConditional', function(done) {
    var div = createTestHtml(
        '<template bind="{{}}" if="{{ d }}">a{{b}}c</template>');
    var template = div.firstChild;
    var model =  {b: 'B', d: 1};
    template.model = model;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('aBc', div.lastChild.textContent);

      model.b = 'b';

    }).then(function() {
      assert.strictEqual('abc', div.lastChild.textContent);

      model.d = '';

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      model.d = 'here';
      model.b = 'd';

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('adc', div.lastChild.textContent);

      done();
    });
  });

  test('TemplateWithTextBinding2', function(done) {
    var div = createTestHtml(
        '<template bind="{{ b }}">a{{value}}c</template>');
    assert.strictEqual(1, div.childNodes.length);
    var template = div.firstChild;
    var model = {b: {value: 'B'}};
    template.model = model;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('aBc', div.lastChild.textContent);

      model.b = {value: 'b'};

    }).then(function() {
      assert.strictEqual('abc', div.lastChild.textContent);

      done();
    });
  });

  test('TemplateWithAttributeBinding', function(done) {
    var div = createTestHtml(
        '<template bind="{{}}">' +
        '<div foo="a{{b}}c"></div>' +
        '</template>');
    var template = div.firstChild;
    var model = {b: 'B'};
    template.model = model;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('aBc', div.lastChild.getAttribute('foo'));

      model.b = 'b';

    }).then(function() {
      assert.strictEqual('abc', div.lastChild.getAttribute('foo'));

      model.b = 'X';

    }).then(function() {
      assert.strictEqual('aXc', div.lastChild.getAttribute('foo'));

      done();
    });
  });

  test('TemplateWithConditionalBinding', function(done) {
    var div = createTestHtml(
        '<template bind="{{}}">' +
        '<div foo?="{{b}}"></div>' +
        '</template>');
    var template = div.firstChild;
    var model = {b: 'b'};
    template.model = model;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.isTrue(div.lastChild.hasAttribute('foo'));
      assert.isFalse(div.lastChild.hasAttribute('foo?'));
      assert.strictEqual('', div.lastChild.getAttribute('foo'));

      model.b = null;

    }).then(function() {
      assert.isFalse(div.lastChild.hasAttribute('foo'));

      done();
    })
  });

  test('Repeat', function(done) {
    var div = createTestHtml(
        '<template repeat="{{ array }}"">{{}}</template>');

    var model = { array: [0, 1, 2] };
    var template = div.firstChild;
    template.model = model;

    then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('0', div.childNodes[1].textContent);
      assert.strictEqual('1', div.childNodes[2].textContent);
      assert.strictEqual('2', div.childNodes[3].textContent);

      model.array.length = 1;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('0', div.childNodes[1].textContent);

      model.array.push(3, 4);

    }).then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('0', div.childNodes[1].textContent);
      assert.strictEqual('3', div.childNodes[2].textContent);
      assert.strictEqual('4', div.childNodes[3].textContent);

      model.array.splice(1, 1);

    }).then(function() {
      assert.strictEqual(3, div.childNodes.length);
      assert.strictEqual('0', div.childNodes[1].textContent);
      assert.strictEqual('4', div.childNodes[2].textContent);

      model.array.push(5, 6);
      model.array = ['x', 'y'];

    }).then(function() {
      assert.strictEqual(3, div.childNodes.length);
      assert.strictEqual('x', div.childNodes[1].textContent);
      assert.strictEqual('y', div.childNodes[2].textContent);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('Repeat - oneTime', function(done) {
    var div = createTestHtml(
        '<template repeat="[[]]"">text</template>');

    var model = [0, 1, 2];
    var template = div.firstChild;
    template.model = model;

    then(function() {
      assert.strictEqual(4, div.childNodes.length);

      model.length = 1;

    }).then(function() {
      // unchanged.
      assert.strictEqual(4, div.childNodes.length);

      model.push(3, 4);

    }).then(function() {
      // unchanged.
      assert.strictEqual(4, div.childNodes.length);

      template.model = undefined;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('Repeat - Reuse Instances', function(done) {
    function addExpandos(node) {
      while (node) {
        node.expando = Number(node.textContent);
        node = node.nextSibling;
      }
    }

    function checkExpandos(node) {
      assert.isDefined(node);
      while (node) {
        assert.strictEqual(node.expando, Number(node.textContent));
        node = node.nextSibling;
      }
    }

    var div = createTestHtml(
        '<template repeat>{{ val }}</template>');
    var template = div.firstChild;

    var model = [{val: 10},{val: 5},{val: 2},{val: 8},{val: 1}];
    template.model = model;

    var template;
    then(function() {
      assert.strictEqual(6, div.childNodes.length);
      template = div.firstChild;

      addExpandos(template.nextSibling);
      checkExpandos(template.nextSibling);

      // TODO(rafaelw): Re-enable when Object.observe/sort bug is fixed.
      // model.sort(function(a, b) { return a.val - b.val; });
      // Platform.performMicrotaskCheckpoint();
      // checkExpandos(template.nextSibling);

      model = model.slice();
      model.reverse();
      template.model = model;

    }).then(function() {
      checkExpandos(template.nextSibling);

      model.forEach(function(item) {
        item.val = item.val + 1;
      });

    }).then(function() {
      assert.strictEqual('2', div.childNodes[1].textContent);
      assert.strictEqual('9', div.childNodes[2].textContent);
      assert.strictEqual('3', div.childNodes[3].textContent);
      assert.strictEqual('6', div.childNodes[4].textContent);
      assert.strictEqual('11', div.childNodes[5].textContent);

      done();
    });
  });

  test('Bind - Reuse Instance', function(done) {
    function addExpandos(node) {
      while (node) {
        node.expando = Number(node.textContent);
        node = node.nextSibling;
      }
    }

    function checkExpandos(node) {
      assert.isDefined(node);
      while (node) {
        assert.strictEqual(node.expando, Number(node.textContent));
        node = node.nextSibling;
      }
    }

    var div = createTestHtml(
        '<template bind="{{ foo }}">{{ bar }}</template>');
    var template = div.firstChild;

    var model = { foo: { bar: 5 }};
    template.model = model;

    var template;
    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      template = div.firstChild;

      addExpandos(template.nextSibling);
      checkExpandos(template.nextSibling);

      model = {foo: model.foo};
      template.model = model;

    }).then(function() {
      checkExpandos(template.nextSibling);

      done();
    });
  });

  test('Repeat-Empty', function(done) {
    var div = createTestHtml(
        '<template repeat>text</template>');
    var template = div.firstChild;
    var model = [0, 1, 2];
    template.model = model;

    then(function() {
      assert.strictEqual(4, div.childNodes.length);

      model.length = 1;

    }).then(function() {
      assert.strictEqual(2, div.childNodes.length);

      model.push(3, 4);

    }).then(function() {
      assert.strictEqual(4, div.childNodes.length);

      model.splice(1, 1);

    }).then(function() {
      assert.strictEqual(3, div.childNodes.length);

      done();
    });
  });

  test('Removal from iteration needs to unbind', function(done) {
    var div = createTestHtml(
        '<template repeat="{{}}"><a>{{v}}</a></template>');
    var template = div.firstChild;
    var model = [{v: 0}, {v: 1}, {v: 2}, {v: 3}, {v: 4}];
    template.model = model;

    var as;
    var vs;
    then(function() {
      as = [];
      for (var node = div.firstChild.nextSibling; node; node = node.nextSibling) {
        as.push(node);
      }
      vs = model.slice();  // copy

      for (var i = 0; i < 5; i++) {
        assert.equal(as[i].textContent, String(i));
      }

      model.length = 3;

    }).then(function() {
      for (var i = 0; i < 5; i++) {
        assert.equal(as[i].textContent, String(i));
      }

      vs[3].v = 33;
      vs[4].v = 44;

    }).then(function() {
      for (var i = 0; i < 5; i++) {
        assert.equal(as[i].textContent, String(i));
      }

      done();
    });
  });

  test('Template.clear', function(done) {
    var div = createTestHtml(
        '<template repeat>{{}}</template>');
    var template = div.firstChild;
    template.model = [0, 1, 2];

    then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('0', div.childNodes[1].textContent);
      assert.strictEqual('1', div.childNodes[2].textContent);
      assert.strictEqual('2', div.childNodes[3].textContent);

      // clear() synchronously removes instances and clears the model.
      div.firstChild.clear();
      assert.strictEqual(1, div.childNodes.length);
      assert.strictEqual(undefined, template.model);

      // test that template still works if new model assigned
      template.model = [3, 4];

    }).then(function() {
      assert.strictEqual(3, div.childNodes.length);
      assert.strictEqual('3', div.childNodes[1].textContent);
      assert.strictEqual('4', div.childNodes[2].textContent);

      done();
    });
  });

  test('DOM Stability on Iteration', function(done) {
    var div = createTestHtml(
        '<template repeat="{{}}">{{}}</template>');
    var template = div.firstChild;
    var model = [1, 2, 3, 4, 5];
    template.model = model;

    function getInstanceNode(index) {
      var node = div.firstChild.nextSibling;
      while (index-- > 0) {
        node = node.nextSibling;
      }
      return node;
    }

    function setInstanceExpando(index, value) {
      getInstanceNode(index)['expando'] = value;
    }

    function getInstanceExpando(index) {
      return getInstanceNode(index)['expando'];
    }

    then(function() {
      setInstanceExpando(0, 0);
      setInstanceExpando(1, 1);
      setInstanceExpando(2, 2);
      setInstanceExpando(3, 3);
      setInstanceExpando(4, 4);

      model.shift();
      model.pop();

    }).then(function() {
      assert.strictEqual(1, getInstanceExpando(0));
      assert.strictEqual(2, getInstanceExpando(1));
      assert.strictEqual(3, getInstanceExpando(2));

      model.unshift(5);
      model[2] = 6;
      model.push(7);

    }).then(function() {
      assert.strictEqual(undefined, getInstanceExpando(0));
      assert.strictEqual(1, getInstanceExpando(1));
      assert.strictEqual(undefined, getInstanceExpando(2));
      assert.strictEqual(3, getInstanceExpando(3));
      assert.strictEqual(undefined, getInstanceExpando(4));

      setInstanceExpando(0, 5);
      setInstanceExpando(2, 6);
      setInstanceExpando(4, 7);

      model.splice(2, 0, 8);

    }).then(function() {
      assert.strictEqual(5, getInstanceExpando(0));
      assert.strictEqual(1, getInstanceExpando(1));
      assert.strictEqual(undefined, getInstanceExpando(2));
      assert.strictEqual(6, getInstanceExpando(3));
      assert.strictEqual(3, getInstanceExpando(4));
      assert.strictEqual(7, getInstanceExpando(5));

      done();
    });
  });

  test('Repeat2', function(done) {
    var div = createTestHtml(
        '<template repeat="{{}}">{{value}}</template>');
    assert.strictEqual(1, div.childNodes.length);
    var template = div.firstChild;
    var model = [
      {value: 0},
      {value: 1},
      {value: 2}
    ];
    template.model = model;

    then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('0', div.childNodes[1].textContent);
      assert.strictEqual('1', div.childNodes[2].textContent);
      assert.strictEqual('2', div.childNodes[3].textContent);

      model[1].value = 'One';

    }).then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('0', div.childNodes[1].textContent);
      assert.strictEqual('One', div.childNodes[2].textContent);
      assert.strictEqual('2', div.childNodes[3].textContent);

      model.splice(0, 1, {value: 'Zero'});

    }).then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('Zero', div.childNodes[1].textContent);
      assert.strictEqual('One', div.childNodes[2].textContent);
      assert.strictEqual('2', div.childNodes[3].textContent);

      done();
    });
  });

  test('TemplateWithInputValue', function(done) {
    var div = createTestHtml(
        '<template bind="{{}}">' +
        '<input value="{{x}}">' +
        '</template>');
    var template = div.firstChild;
    var model = {x: 'hi'};
    template.model = model;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('hi', div.lastChild.value);

      model.x = 'bye';
      assert.strictEqual('hi', div.lastChild.value);

    }).then(function() {
      assert.strictEqual('bye', div.lastChild.value);

      div.lastChild.value = 'hello';
      dispatchEvent('input', div.lastChild);
      assert.strictEqual('hello', model.x);

    }).then(function() {
      assert.strictEqual('hello', div.lastChild.value);

      done();
    });
  });

//////////////////////////////////////////////////////////////////////////////

  test('Decorated', function(done) {
    var div = createTestHtml(
        '<template bind="{{ XX }}" id="t1">' +
          '<p>Crew member: {{name}}, Job title: {{title}}</p>' +
        '</template>' +
        '<template bind="{{ XY }}" id="t2" ref="t1"></template>');
    var t1 = document.getElementById('t1');
    var t2 = document.getElementById('t2');
    var model = {
      XX: {name: 'Leela', title: 'Captain'},
      XY: {name: 'Fry', title: 'Delivery boy'},
      XZ: {name: 'Zoidberg', title: 'Doctor'}
    };
    t1.model = model;
    t2.model = model;

    then(function() {
      var instance = t1.nextElementSibling;
      assert.strictEqual('Crew member: Leela, Job title: Captain', instance.textContent);

      instance = t2.nextElementSibling;
      assert.strictEqual('Crew member: Fry, Job title: Delivery boy',
                   instance.textContent);

      assert.strictEqual(4, div.children.length);
      assert.strictEqual(4, div.childNodes.length);

      assert.strictEqual('P', div.childNodes[1].tagName);
      assert.strictEqual('P', div.childNodes[3].tagName);

      done();
    })
  });

  test('DefaultStyles', function() {
    var t = document.createElement('template');
    HTMLTemplateElement.decorate(t);

    document.body.appendChild(t);
    assert.strictEqual('none', getComputedStyle(t, null).display);

    document.body.removeChild(t);
  });


  test('Bind', function(done) {
    var div = createTestHtml('<template bind="{{}}">Hi {{ name }}</template>');
    var template = div.firstChild;
    var model = {name: 'Leela'};
    template.model = model;

    then(function() {
      assert.strictEqual('Hi Leela', div.childNodes[1].textContent);

      done();
    });
  });

  test('BindPlaceHolderHasNewLine', function(done) {
    var div = createTestHtml('<template bind="{{}}">Hi {{\nname\n}}</template>');
    var template = div.firstChild;
    var model = {name: 'Leela'};
    template.model = model;

    then(function() {
      assert.strictEqual('Hi Leela', div.childNodes[1].textContent);

      done();
    });
  });

  test('BindWithRef', function(done) {
    var id = 't' + Math.random();
    var div = createTestHtml(
        '<template id="' + id +'">' +
          'Hi {{ name }}' +
        '</template>' +
        '<template ref="' + id + '" bind="{{}}"></template>');
    var t1 = div.firstChild;
    var t2 = div.childNodes[1];

    var model = {name: 'Fry'};
    t2.model = model;

    then(function() {
      assert.strictEqual('Hi Fry', t2.nextSibling.textContent);

      done();
    });
  });

  test('Ref at multiple', function() {
    // Note: this test is asserting that template "ref"erences can be located
    // at various points. In particular:
    // -in the document (at large) (e.g. ref=doc)
    // -within template content referenced from sub-content
    //   -both before and after the reference
    // The following asserts ensure that all referenced templates content is
    // found.
    var div = createTestHtml(
      '<template bind>' +
        '<template bind ref=doc></template>' +
        '<template id=elRoot>EL_ROOT</template>' +
        '<template bind>' +
          '<template bind ref=elRoot></template>' +
          '<template bind>' +
            '<template bind ref=subA></template>' +
            '<template id=subB>SUB_B</template>' +
            '<template bind>' +
              '<template bind ref=subB></template>' +
            '</template>' +
          '</template>' +
          '<template id=subA>SUB_A</template>' +
        '</template>' +
      '</template>' +
      '<template id=doc>DOC</template>');
    var t = div.firstChild;
    var fragment = t.createInstance({});
    assert.strictEqual(14, fragment.childNodes.length);
    assert.strictEqual('DOC', fragment.childNodes[1].textContent);
    assert.strictEqual('EL_ROOT', fragment.childNodes[5].textContent);
    assert.strictEqual('SUB_A', fragment.childNodes[8].textContent);
    assert.strictEqual('SUB_B', fragment.childNodes[12].textContent);
    div.appendChild(fragment);
  });

  test('Update Ref', function(done) {
    // Updating ref by observing the attribute is dependent on MutationObservers
    if (typeof MutationObserver != 'function') {
      done();
      return;
    }

    var div = createTestHtml(
        '<template id=A>Hi, {{}}</template>' +
        '<template id=B>Hola, {{}}</template>' +
        '<template ref=A repeat></template>');
    var template = div.childNodes[2];
    var model = ['Fry'];
    template.model = model;

    then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('Hi, Fry', div.childNodes[3].textContent);

      // In IE 11, MutationObservers do not fire before setTimeout.
      // So rather than using "then" to queue up the next test, we use a
      // MutationObserver here to detect the change to "ref".
      new MutationObserver(function() {
        assert.strictEqual(5, div.childNodes.length);
        assert.strictEqual('Hola, Fry', div.childNodes[3].textContent);
        assert.strictEqual('Hola, Leela', div.childNodes[4].textContent);

        done();
      }).observe(template, { attributes: true, attributeFilter: ['ref'] });

      template.setAttribute('ref', 'B');
      model.push('Leela');
    });
  });

  test('Bound Ref', function(done) {
    var div = createTestHtml(
        '<template id=A>Hi, {{}}</template>' +
        '<template id=B>Hola, {{}}</template>' +
        '<template ref="{{ ref }}" repeat="{{ people }}"></template>');
    var template = div.childNodes[2];
    var model = { ref: 'A', people: ['Fry'] };
    template.model = model;

    then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('Hi, Fry', div.childNodes[3].textContent);

      model.ref = 'B';
      model.people.push('Leela');

    }).then(function() {
      assert.strictEqual(5, div.childNodes.length);
      assert.strictEqual('Hola, Fry', div.childNodes[3].textContent);
      assert.strictEqual('Hola, Leela', div.childNodes[4].textContent);

      done();
    });
  });

  test('BindWithDynamicRef', function(done) {
    var id = 't' + Math.round(100 * Math.random());
    var div = createTestHtml(
        '<template id="' + id +'">' +
          'Hi {{ name }}' +
        '</template>' +
        '<template ref="{{ id }}" bind="{{}}"></template>');
    var template = div.childNodes[1];
    var t1 = div.firstChild;
    var t2 = div.childNodes[1];
    var model = {name: 'Fry', id: id };
    template.model = model;

    then(function() {
      assert.strictEqual('Hi Fry', t2.nextSibling.textContent);

      done();
    });
  });

  function assertNodesAre() {
    var expectedLength = arguments.length;
    assert.strictEqual(expectedLength + 1, div.childNodes.length);

    for (var i = 0; i < arguments.length; i++) {
      var targetNode = div.childNodes[i + 1];
      assert.strictEqual(arguments[i], targetNode.textContent);
    }
  }

  test('Repeat3', function(done) {
    div = createTestHtml('<template repeat="{{ contacts }}">Hi {{ name }}</template>');
    var t = div.firstChild;

    var m = {
      contacts: [
        {name: 'Raf'},
        {name: 'Arv'},
        {name: 'Neal'}
      ]
    };

    t.model = m;
    then(function() {
      assertNodesAre('Hi Raf', 'Hi Arv', 'Hi Neal');

      m.contacts.push({name: 'Alex'});

    }).then(function() {
      assertNodesAre('Hi Raf', 'Hi Arv', 'Hi Neal', 'Hi Alex');

      m.contacts.splice(0, 2, {name: 'Rafael'}, {name: 'Erik'});

    }).then(function() {
      assertNodesAre('Hi Rafael', 'Hi Erik', 'Hi Neal', 'Hi Alex');

      m.contacts.splice(1, 2);

    }).then(function() {
      assertNodesAre('Hi Rafael', 'Hi Alex');

      m.contacts.splice(1, 0, {name: 'Erik'}, {name: 'Dimitri'});

    }).then(function() {
      assertNodesAre('Hi Rafael', 'Hi Erik', 'Hi Dimitri', 'Hi Alex');

      m.contacts.splice(0, 1, {name: 'Tab'}, {name: 'Neal'});

    }).then(function() {
      assertNodesAre('Hi Tab', 'Hi Neal', 'Hi Erik', 'Hi Dimitri', 'Hi Alex');

      m.contacts = [{name: 'Alex'}];

    }).then(function() {
      assertNodesAre('Hi Alex');

      m.contacts.length = 0;

    }).then(function() {
      assertNodesAre();

      done();
    });
  });

  test('RepeatModelSet', function(done) {
    div = createTestHtml(
        '<template repeat="{{ contacts }}">' +
          'Hi {{ name }}' +
        '</template>');
    var template = div.firstChild;
    var m = {
      contacts: [
        {name: 'Raf'},
        {name: 'Arv'},
        {name: 'Neal'}
      ]
    };
    template.model = m;

    then(function() {
      assertNodesAre('Hi Raf', 'Hi Arv', 'Hi Neal');

      done();
    })
  });

  test('RepeatEmptyPath', function(done) {
    div = createTestHtml('<template repeat="{{}}">Hi {{ name }}</template>');
    var template = div.firstChild;
    var m = [
      {name: 'Raf'},
      {name: 'Arv'},
      {name: 'Neal'}
    ];
    template.model = m;

    then(function() {
      assertNodesAre('Hi Raf', 'Hi Arv', 'Hi Neal');

      m.push({name: 'Alex'});

    }).then(function() {
      assertNodesAre('Hi Raf', 'Hi Arv', 'Hi Neal', 'Hi Alex');

      m.splice(0, 2, {name: 'Rafael'}, {name: 'Erik'});

    }).then(function() {
      assertNodesAre('Hi Rafael', 'Hi Erik', 'Hi Neal', 'Hi Alex');

      m.splice(1, 2);

    }).then(function() {
      assertNodesAre('Hi Rafael', 'Hi Alex');

      m.splice(1, 0, {name: 'Erik'}, {name: 'Dimitri'});

    }).then(function() {
      assertNodesAre('Hi Rafael', 'Hi Erik', 'Hi Dimitri', 'Hi Alex');

      m.splice(0, 1, {name: 'Tab'}, {name: 'Neal'});

    }).then(function() {
      assertNodesAre('Hi Tab', 'Hi Neal', 'Hi Erik', 'Hi Dimitri', 'Hi Alex');

      m.length = 0;
      m.push({name: 'Alex'});

    }).then(function() {
      assertNodesAre('Hi Alex');

      done();
    });
  });

  test('RepeatNullModel', function(done) {
    div = createTestHtml('<template repeat="{{}}">Hi {{ name }}</template>');
    var template = div.firstChild;

    var m = null;
    template.model = m;

    then(function() {
      assert.strictEqual(1, div.childNodes.length);

      template.iterate = '';
      m = {};
      template.model = m;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      done();
    });
  });

  test('RepeatReuse', function(done) {
    div = createTestHtml('<template repeat="{{}}">Hi {{ name }}</template>');
    var template = div.firstChild;
    var m = [
      {name: 'Raf'},
      {name: 'Arv'},
      {name: 'Neal'}
    ];
    template.model = m;

    var node1, node2, node3;

    then(function() {
      assertNodesAre('Hi Raf', 'Hi Arv', 'Hi Neal');
      node1 = div.childNodes[1];
      node2 = div.childNodes[2];
      node3 = div.childNodes[3];

      m.splice(1, 1, {name: 'Erik'});

    }).then(function() {
      assertNodesAre('Hi Raf', 'Hi Erik', 'Hi Neal');
      assert.strictEqual(node1, div.childNodes[1],
          'model[0] did not change so the node should not have changed');
      assert.notStrictEqual(node2, div.childNodes[2],
          'Should not reuse when replacing');
      assert.strictEqual(node3, div.childNodes[3],
          'model[2] did not change so the node should not have changed');

      node2 = div.childNodes[2];
      m.splice(0, 0, {name: 'Alex'});

    }).then(function() {
      assertNodesAre('Hi Alex', 'Hi Raf', 'Hi Erik', 'Hi Neal');

      done();
    });
  });

  test('TwoLevelsDeepBug', function(done) {
    div = createTestHtml(
      '<template bind="{{}}"><span><span>{{ foo }}</span></span></template>');
    var template = div.firstChild;
    var model = {foo: 'bar'};
    template.model = model;

    then(function() {
      assert.strictEqual('bar',
                   div.childNodes[1].childNodes[0].childNodes[0].textContent);

      done();
    });
  });

  test('Checked', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<input type="checkbox" checked="{{a}}">' +
        '</template>');
    var t = div.firstChild;
    t.model = {
      a: true
    };

    then(function() {
      var instanceInput = t.nextSibling;
      assert.isTrue(instanceInput.checked);

      instanceInput.click();
      assert.isFalse(instanceInput.checked);

      instanceInput.click();
      assert.isTrue(instanceInput.checked);

      done();
    });
  });

  function nestedHelper(s, start, done) {
    var div = createTestHtml(s);
    var m = {
      a: {
        b: 1,
        c: {d: 2}
      },
    };
    recursivelySetTemplateModel(div, m);

    var i;
    then(function() {
      i = start;
      assert.strictEqual('1', div.childNodes[i++].textContent);
      assert.strictEqual('TEMPLATE', div.childNodes[i++].tagName);
      assert.strictEqual('2', div.childNodes[i++].textContent);

      m.a.b = 11;

    }).then(function() {
      assert.strictEqual('11', div.childNodes[start].textContent);

      m.a.c = {d: 22};

    }).then(function() {
      assert.strictEqual('22', div.childNodes[start + 2].textContent);

      //clearAllTemplates(div);
      done();
    });
  }

  test('Nested', function(done) {
    nestedHelper(
        '<template bind="{{a}}">' +
          '{{b}}' +
          '<template bind="{{c}}">' +
            '{{d}}' +
          '</template>' +
        '</template>', 1, done);
  });

  test('NestedWithRef', function(done) {
    nestedHelper(
        '<template id="inner">{{d}}</template>' +
        '<template id="outer" bind="{{a}}">' +
          '{{b}}' +
          '<template ref="inner" bind="{{c}}"></template>' +
        '</template>', 2, done);
  });

  function nestedIterateInstantiateHelper(s, start, done) {
    div = createTestHtml(s);
    var m = {
      a: [
        {
          b: 1,
          c: {d: 11}
        },
        {
          b: 2,
          c: {d: 22}
        }
      ]
    };
    recursivelySetTemplateModel(div, m);

    var i;
    then(function() {
      i = start;
      assert.strictEqual('1', div.childNodes[i++].textContent);
      assert.strictEqual('TEMPLATE', div.childNodes[i++].tagName);
      assert.strictEqual('11', div.childNodes[i++].textContent);
      assert.strictEqual('2', div.childNodes[i++].textContent);
      assert.strictEqual('TEMPLATE', div.childNodes[i++].tagName);
      assert.strictEqual('22', div.childNodes[i++].textContent);

      m.a[1] = {
        b: 3,
        c: {d: 33}
      };

    }).then(function() {
      assert.strictEqual('3', div.childNodes[start + 3].textContent);
      assert.strictEqual('33', div.childNodes[start + 5].textContent);

      done();
    });
  }

  test('NestedRepeatBind', function(done) {
    nestedIterateInstantiateHelper(
        '<template repeat="{{a}}">' +
          '{{b}}' +
          '<template bind="{{c}}">' +
            '{{d}}' +
          '</template>' +
        '</template>', 1, done);
  });

  test('NestedRepeatBindWithRef', function(done) {
    nestedIterateInstantiateHelper(
        '<template id="inner">' +
          '{{d}}' +
        '</template>' +
        '<template repeat="{{a}}">' +
          '{{b}}' +
          '<template ref="inner" bind="{{c}}"></template>' +
        '</template>', 2, done);
  });

  function nestedIterateIterateHelper(s, start, done) {
    div = createTestHtml(s);
    var m = {
      a: [
        {
          b: 1,
          c: [{d: 11}, {d: 12}]
        },
        {
          b: 2,
          c: [{d: 21}, {d: 22}]
        }
      ]
    };
    recursivelySetTemplateModel(div, m);

    var i;

    then(function() {
      i = start;
      assert.strictEqual('1', div.childNodes[i++].textContent);
      assert.strictEqual('TEMPLATE', div.childNodes[i++].tagName);
      assert.strictEqual('11', div.childNodes[i++].textContent);
      assert.strictEqual('12', div.childNodes[i++].textContent);
      assert.strictEqual('2', div.childNodes[i++].textContent);
      assert.strictEqual('TEMPLATE', div.childNodes[i++].tagName);
      assert.strictEqual('21', div.childNodes[i++].textContent);
      assert.strictEqual('22', div.childNodes[i++].textContent);

      m.a[1] = {
        b: 3,
        c: [{d: 31}, {d: 32}, {d: 33}]
      };

      i = start + 4;

    }).then(function() {
      assert.strictEqual('3', div.childNodes[start + 4].textContent);
      assert.strictEqual('31', div.childNodes[start + 6].textContent);
      assert.strictEqual('32', div.childNodes[start + 7].textContent);
      assert.strictEqual('33', div.childNodes[start + 8].textContent);

      done();
    });
  }

  test('NestedRepeatBind', function(done) {
    nestedIterateIterateHelper(
        '<template repeat="{{a}}">' +
          '{{b}}' +
          '<template repeat="{{c}}">' +
            '{{d}}' +
          '</template>' +
        '</template>', 1, done);
  });

  test('NestedRepeatRepeatWithRef', function(done) {
    nestedIterateIterateHelper(
        '<template id="inner">' +
          '{{d}}' +
        '</template>' +
        '<template repeat="{{a}}">' +
          '{{b}}' +
          '<template ref="inner" repeat="{{c}}"></template>' +
        '</template>', 2, done);
  });

  test('NestedRepeatSelfRef', function(done) {
    var div = createTestHtml(
        '<template id="t" repeat="{{}}">' +
          '{{name}}' +
          '<template ref="t" repeat="{{items}}"></template>' +
        '</template>');
    var template = div.firstChild;
    var m = [
      {
        name: 'Item 1',
        items: [
          {
            name: 'Item 1.1',
            items: [
              {
                 name: 'Item 1.1.1',
                 items: []
              }
            ]
          },
          {
            name: 'Item 1.2'
          }
        ]
      },
      {
        name: 'Item 2',
        items: []
      },
    ];
    template.model = m;

    var i = 1;
    then(function() {
      assert.strictEqual('Item 1', div.childNodes[i++].textContent);
      assert.strictEqual('TEMPLATE', div.childNodes[i++].tagName);
      assert.strictEqual('Item 1.1', div.childNodes[i++].textContent);
      assert.strictEqual('TEMPLATE', div.childNodes[i++].tagName);
      assert.strictEqual('Item 1.1.1', div.childNodes[i++].textContent);
      assert.strictEqual('TEMPLATE', div.childNodes[i++].tagName);
      assert.strictEqual('Item 1.2', div.childNodes[i++].textContent);
      assert.strictEqual('TEMPLATE', div.childNodes[i++].tagName);
      assert.strictEqual('Item 2', div.childNodes[i++].textContent);

      m[0] = {
        name: 'Item 1 changed'
      };

      i = 1;

    }).then(function() {
      assert.strictEqual('Item 1 changed', div.childNodes[i++].textContent);
      assert.strictEqual('TEMPLATE', div.childNodes[i++].tagName);
      assert.strictEqual('Item 2', div.childNodes[i++].textContent);

      done();
    });
  });

  test('Attribute Template Optgroup/Option - selectedIndex', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<select selectedIndex="{{ selected }}">' +
            '<optgroup template repeat="{{ groups }}" label="{{ name }}">' +
              '<option template repeat="{{ items }}">{{ val }}</option>' +
            '</optgroup>' +
          '</select>' +
        '</template>');
    var template = div.firstChild;
    var m = {
      selected: 1,
      groups: [
        {
          name: 'one', items: [{ val: 0 }, { val: 1 }]
        }
      ],
    };
    template.model = m;

    then(function() {
      var select = div.firstChild.nextSibling;
      assert.strictEqual(2, select.childNodes.length);
      assert.strictEqual(1, select.selectedIndex);
      assert.strictEqual('TEMPLATE', select.childNodes[0].tagName);
      var optgroup = select.childNodes[1];
      assert.strictEqual('TEMPLATE', optgroup.childNodes[0].tagName);
      assert.strictEqual('OPTION', optgroup.childNodes[1].tagName);
      assert.strictEqual('0', optgroup.childNodes[1].textContent);
      assert.strictEqual('OPTION', optgroup.childNodes[2].tagName);
      assert.strictEqual('1', optgroup.childNodes[2].textContent);

      done();
    });
  });

  test('Attribute Template Optgroup/Option - value', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<select value="{{ selected }}">' +
            '<option template repeat="{{ items }}" value="{{ value }}">{{ name }}</option>' +
          '</select>' +
        '</template>');
    var template = div.firstChild;
    var m = {
      selected: 'b',
      items: [
        { name: 'A', value: 'a' },
        { name: 'B', value: 'b' },
        { name: 'C', value: 'c' }
      ]
    };
    template.model = m;

    then(function() {
      var select = div.firstChild.nextSibling;
      assert.strictEqual(4, select.childNodes.length);
      assert.strictEqual('b', select.value);

      done();
    });
  });

  test('NestedIterateTableMixedSemanticNative', function(done) {
    if (!parserHasNativeTemplate) {
      done();
      return;
    }

    var div = createTestHtml(
        '<table><tbody>' +
          '<template repeat="{{}}">' +
            '<tr>' +
              '<td template repeat="{{}}" class="{{ val }}">{{ val }}</td>' +
            '</tr>' +
          '</template>' +
        '</tbody></table>');
    var template = div.firstChild.firstChild.firstChild;
    var m = [
      [{ val: 0 }, { val: 1 }],
      [{ val: 2 }, { val: 3 }]
    ];
    template.model = m;

    then(function() {
      var i = 1;
      var tbody = div.childNodes[0].childNodes[0];

      // 1 for the <tr template>, 2 * (1 tr)
      assert.strictEqual(3, tbody.childNodes.length);

      // 1 for the <td template>, 2 * (1 td)
      assert.strictEqual(3, tbody.childNodes[1].childNodes.length);
      assert.strictEqual('0', tbody.childNodes[1].childNodes[1].textContent)
      assert.strictEqual('1', tbody.childNodes[1].childNodes[2].textContent)

      // 1 for the <td template>, 2 * (1 td)
      assert.strictEqual(3, tbody.childNodes[2].childNodes.length);
      assert.strictEqual('2', tbody.childNodes[2].childNodes[1].textContent)
      assert.strictEqual('3', tbody.childNodes[2].childNodes[2].textContent)

      // Asset the 'class' binding is retained on the semantic template (just check
      // the last one).
      assert.strictEqual('3', tbody.childNodes[2].childNodes[2].getAttribute('class'));

      done();
    });
  });

  test('NestedIterateTable', function(done) {
    var div = createTestHtml(
        '<table><tbody>' +
          '<tr template repeat="{{}}">' +
            '<td template repeat="{{}}" class="{{ val }}">{{ val }}</td>' +
          '</tr>' +
        '</tbody></table>');
    var template = div.firstChild.firstChild.firstChild;
    var m = [
      [{ val: 0 }, { val: 1 }],
      [{ val: 2 }, { val: 3 }]
    ];
    template.model = m;

    then(function() {
      var i = 1;
      var tbody = div.childNodes[0].childNodes[0];

      // 1 for the <tr template>, 2 * (1 tr)
      assert.strictEqual(3, tbody.childNodes.length);

      // 1 for the <td template>, 2 * (1 td)
      assert.strictEqual(3, tbody.childNodes[1].childNodes.length);
      assert.strictEqual('0', tbody.childNodes[1].childNodes[1].textContent)
      assert.strictEqual('1', tbody.childNodes[1].childNodes[2].textContent)

      // 1 for the <td template>, 2 * (1 td)
      assert.strictEqual(3, tbody.childNodes[2].childNodes.length);
      assert.strictEqual('2', tbody.childNodes[2].childNodes[1].textContent)
      assert.strictEqual('3', tbody.childNodes[2].childNodes[2].textContent)

      // Asset the 'class' binding is retained on the semantic template (just check
      // the last one).
      assert.strictEqual('3', tbody.childNodes[2].childNodes[2].getAttribute('class'));

      done();
    });
  });

  test('NestedRepeatDeletionOfMultipleSubTemplates', function(done) {
    var div = createTestHtml(
        '<ul>' +
          '<template repeat="{{}}" id=t1>' +
            '<li>{{name}}' +
              '<ul>' +
                '<template ref=t1 repeat="{{items}}"></template>' +
              '</ul>' +
            '</li>' +
          '</template>' +
        '</ul>');

    var m = [
      {
        name: 'Item 1',
        items: [
          {
            name: 'Item 1.1'
          }
        ]
      }
    ];

    var ul = div.firstChild;
    var t = ul.firstChild;
    t.model = m;

    then(function() {
      assert.strictEqual(ul.childNodes.length, 2);
      var ul2 = ul.childNodes[1].childNodes[1];
      assert.strictEqual(ul2.childNodes.length, 2);
      var ul3 = ul2.childNodes[1].childNodes[1]
      assert.strictEqual(ul3.childNodes.length, 1);

      m.splice(0, 1);

    }).then(function() {
      assert.strictEqual(ul.childNodes.length, 1);

      done();
    });
  });

  test('DeepNested', function(done) {
    var div = createTestHtml(
      '<template bind="{{a}}">' +
        '<p>' +
          '<template bind="{{b}}">' +
            '{{ c }}' +
          '</template>' +
        '</p>' +
      '</template>');
    var template = div.firstChild;
    var m = {
      a: {
        b: {
          c: 42
        }
      }
    };
    template.model = m;

    then(function() {
      assert.strictEqual('P', div.childNodes[1].tagName);
      assert.strictEqual('TEMPLATE', div.childNodes[1].firstChild.tagName);
      assert.strictEqual('42', div.childNodes[1].childNodes[1].textContent);

      done();
    });
  });

  test('TemplateContentRemoved', function(done) {
    var div = createTestHtml('<template bind="{{}}">{{ }}</template>');
    var template = div.firstChild;
    template.model = 42;

    then(function() {
      assert.strictEqual('42', div.childNodes[1].textContent);
      assert.strictEqual('', div.childNodes[0].textContent);

      done();
    });
  });

  test('TemplateContentRemovedEmptyArray', function(done) {
    var div = createTestHtml('<template iterate>Remove me</template>');
    var template = div.firstChild;
    template.model = [];

    then(function() {
      assert.strictEqual(1, div.childNodes.length);
      assert.strictEqual('', div.childNodes[0].textContent);

      done();
    });
  });

  test('TemplateContentRemovedNested', function(done) {
    var div = createTestHtml(
        '<template bind="{{}}">' +
          '{{ a }}' +
          '<template bind="{{}}">' +
            '{{ b }}' +
          '</template>' +
        '</template>');
    var template = div.firstChild;
    var model = {
      a: 1,
      b: 2
    };
    template.model = model;

    then(function() {
      assert.strictEqual('', div.childNodes[0].textContent);
      assert.strictEqual('1', div.childNodes[1].textContent);
      assert.strictEqual('', div.childNodes[2].textContent);
      assert.strictEqual('2', div.childNodes[3].textContent);

      done();
    });
  });

  test('BindWithUndefinedModel', function(done) {
    var div = createTestHtml('<template bind="{{}}" if="{{}}">{{ a }}</template>');
    var template = div.firstChild;

    var model = {a: 42};
    template.model = model;

    then(function() {
      assert.strictEqual('42', div.childNodes[1].textContent);

      model = undefined;
      template.model = model;

    }).then(function() {
      assert.strictEqual(1, div.childNodes.length);

      model = {a: 42};
      template.model = model;

    }).then(function() {
      assert.strictEqual('42', div.childNodes[1].textContent);

      done();
    });
  });

  test('BindNested', function(done) {
    var div = createTestHtml(
        '<template bind="{{}}">' +
          'Name: {{ name }}' +
          '<template bind="{{wife}}" if="{{wife}}">' +
            'Wife: {{ name }}' +
          '</template>' +
          '<template bind="{{child}}" if="{{child}}">' +
            'Child: {{ name }}' +
          '</template>' +
        '</template>');
    var template = div.firstChild;
    var m = {
      name: 'Hermes',
      wife: {
        name: 'LaBarbara'
      }
    };
    template.model = m;

    then(function() {
      assert.strictEqual(5, div.childNodes.length);
      assert.strictEqual('Name: Hermes', div.childNodes[1].textContent);
      assert.strictEqual('Wife: LaBarbara', div.childNodes[3].textContent);

      m.child = {name: 'Dwight'};

    }).then(function() {
      assert.strictEqual(6, div.childNodes.length);
      assert.strictEqual('Child: Dwight', div.childNodes[5].textContent);

      delete m.wife;

    }).then(function() {
      assert.strictEqual(5, div.childNodes.length);
      assert.strictEqual('Child: Dwight', div.childNodes[4].textContent);

      done();
    });
  });

  test('BindRecursive', function(done) {
    var div = createTestHtml(
        '<template bind="{{}}" if="{{}}" id="t">' +
          'Name: {{ name }}' +
          '<template bind="{{friend}}" if="{{friend}}" ref="t"></template>' +
        '</template>');
    var template = div.firstChild;
    var m = {
      name: 'Fry',
      friend: {
        name: 'Bender'
      }
    };
    template.model = m;

    then(function() {
      assert.strictEqual(5, div.childNodes.length);
      assert.strictEqual('Name: Fry', div.childNodes[1].textContent);
      assert.strictEqual('Name: Bender', div.childNodes[3].textContent);

      m.friend.friend = {name: 'Leela'};

    }).then(function() {
      assert.strictEqual(7, div.childNodes.length);
      assert.strictEqual('Name: Leela', div.childNodes[5].textContent);

      m.friend = {name: 'Leela'};

    }).then(function() {
      assert.strictEqual(5, div.childNodes.length);
      assert.strictEqual('Name: Leela', div.childNodes[3].textContent);

      done();
    })
  });

  test('RecursiveRef', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<template id=src>{{ foo }}</template>' +
          '<template bind ref=src></template>' +
        '</template>');
    var template = div.firstChild;
    var m = {
      foo: 'bar'
    };
    template.model = m;

    then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('bar', div.childNodes[3].textContent);

      done();
    });
  });

  test('Template - Self is terminator', function(done) {
    var div = createTestHtml(
        '<template repeat>{{ foo }}' +
          '<template bind></template>' +
        '</template>');
    var template = div.firstChild;

    var m = [{ foo: 'bar' }];
    template.model = m;

    then(function() {
      m.push({ foo: 'baz' });
      template.model = m;

    }).then(function() {
      assert.strictEqual(5, div.childNodes.length);
      assert.strictEqual('bar', div.childNodes[1].textContent);
      assert.strictEqual('baz', div.childNodes[3].textContent);

      done();
    });
  });

  test('Template - Same Contents, Different Array has no effect', function(done) {
    if (!window.MutationObserver) {
      done();
      return;
    }

    var div = createTestHtml(
        '<template repeat>{{ foo }}</template>');
    var template = div.firstChild;
    var m = [{ foo: 'bar' }, { foo: 'bat'}];
    template.model = m;

    var observer, template, records;

    then(function() {
      observer = new MutationObserver(function() {});
      observer.observe(div, { childList: true });

      template = div.firstChild;
      template.model = m.slice();

    }).then(function() {
      records = observer.takeRecords();
      assert.strictEqual(0, records.length);

      done();
    })
  });

  test('baseURI', function(done) {
    var div = createTestHtml('<template bind><div style="background: url(foo.jpg)"></div></template>');
    var local = document.createElement('div');
    local.setAttribute('style', 'background: url(foo.jpg)');
    div.appendChild(local);
    var template = div.firstChild;
    template.model = {};
    then(function() {
      assert.strictEqual(local.style.backgroundImage, div.childNodes[1].style.backgroundImage);
      done();
    })
  });

  test('ChangeRefId', function(done) {
    var div = createTestHtml(
        '<template id="a">a:{{ }}</template>' +
        '<template id="b">b:{{ }}</template>' +
        '<template repeat="{{}}">' +
          '<template ref="a" bind="{{}}"></template>' +
        '</template>');
    var template = div.childNodes[2];
    var model = [];
    template.model = model;

    then(function() {
      assert.strictEqual(3, div.childNodes.length);

      document.getElementById('a').id = 'old-a';
      document.getElementById('b').id = 'a';

      model.push(1, 2);

    }).then(function() {
      assert.strictEqual(7, div.childNodes.length);
      assert.strictEqual('b:1', div.childNodes[4].textContent);
      assert.strictEqual('b:2', div.childNodes[6].textContent);

      done();
    });
  });

  test('Content', function() {
    var div = createTestHtml(
        '<template><a></a></template>' +
        '<template><b></b></template>');
    var templateA = div.firstChild;
    var templateB = div.lastChild;
    var contentA = templateA.content;
    var contentB = templateB.content;
    assert.notStrictEqual(contentA, undefined);

    assert.notStrictEqual(templateA.ownerDocument, contentA.ownerDocument);
    assert.notStrictEqual(templateB.ownerDocument, contentB.ownerDocument);

    assert.strictEqual(templateA.ownerDocument, templateB.ownerDocument);
    assert.strictEqual(contentA.ownerDocument, contentB.ownerDocument);

    assert.strictEqual(templateA.ownerDocument.defaultView, wrap(window));
    assert.strictEqual(templateB.ownerDocument.defaultView, wrap(window));

    assert.strictEqual(contentA.ownerDocument.defaultView, null);
    assert.strictEqual(contentB.ownerDocument.defaultView, null);

    assert.strictEqual(contentA.firstChild, contentA.lastChild);
    assert.strictEqual(contentA.firstChild.tagName, 'A');

    assert.strictEqual(contentB.firstChild, contentB.lastChild);
    assert.strictEqual(contentB.firstChild.tagName, 'B');
  });

  test('NestedContent', function() {
    var div = createTestHtml(
        '<template>' +
        '<template></template>' +
        '</template>');
    var templateA = div.firstChild;
    var templateB = templateA.content.firstChild;

    assert.strictEqual(templateA.content.ownerDocument, templateB.ownerDocument);
    assert.strictEqual(templateA.content.ownerDocument,
                 templateB.content.ownerDocument);
  });

  test('BindShadowDOM', function(done) {
    if (!HTMLElement.prototype.webkitCreateShadowRoot) {
      done();
      return;
    }

    var root = createShadowTestHtml(
        '<template bind="{{}}">Hi {{ name }}</template>');
    var template = root.firstChild;
    var model = {name: 'Leela'};
    template.model = model;

    then(function() {
      assert.strictEqual('Hi Leela', root.childNodes[1].textContent);
      clearAllTemplates(root);

      done();
    });
  });

  test('BindShadowDOM Template Ref', function(done) {
    if (!HTMLElement.prototype.webkitCreateShadowRoot) {
      done();
      return;
    }

    var root = createShadowTestHtml(
        '<template id=foo>Hi</template><template bind ref=foo></template>');
    var template = root.childNodes[1];
    template.model = {};

    then(function() {
      assert.strictEqual(3, root.childNodes.length);
      clearAllTemplates(root);

      done();
    });
  });

  // https://github.com/Polymer/mdv/issues/8
  test('UnbindingInNestedBind', function(done) {
    var div = createTestHtml(
      '<template bind="{{outer}}" if="{{outer}}">' +
        '<template bind="{{inner}}" if="{{inner}}">' +
          '{{ age }}' +
        '</template>' +
      '</template>');
    var template = div.firstChild;
    var count = 0;
    var expectedAge = 42;
    var delegate = {
      prepareBinding: function(path, name, node) {
        if (name != 'textContent' || path != 'age')
          return;

        return function(model) {
          assert.strictEqual(expectedAge, model.age);
          count++;
          return new PathObserver(model, path);
        }
      }
    };

    var model = {
      outer: {
        inner: {
          age: 42
        }
      }
    };

    template.bindingDelegate = delegate;
    template.model = model;

    var inner;
    then(function() {
      assert.strictEqual(1, count);

      inner = model.outer.inner;
      model.outer = null;

    }).then(function() {
      assert.strictEqual(1, count);

      model.outer = {inner: {age: 2}};
      expectedAge = 2;

    }).then(function() {
      assert.strictEqual(2, count);

      testHelper = undefined;

      done();
    });
  });

  // https://github.com/Polymer/mdv/issues/8
  test('DontCreateInstancesForAbandonedIterators', function(done) {
    var div = createTestHtml(
      '<template bind="{{}} {{}}">' +
        '<template bind="{{}}">Foo' +
        '</template>' +
      '</template>');
    var template = div.firstChild;
    template.model = undefined;

    then(function() {
      assert.isFalse(!!Observer._errorThrownDuringCallback);

      done();
    });
  });

  test('CreateInstance', function() {
    var delegate = {
      prepareBinding: function(path, name, node) {
        if (path != 'replaceme')
          return;
        return function() {
          return new PathObserver({ value: 'replaced' }, 'value');
        }
      }
    };

    var div = createTestHtml(
      '<template>' +
        '<template bind="{{b}}">' +
          '{{ foo }}:{{ replaceme }}' +
        '</template>' +
      '</template>');
    var outer = div.firstChild;
    var model = {
      b: {
        foo: 'bar'
      }
    };

    var instance = outer.createInstance(model, delegate);
    assert.strictEqual('bar:replaced',
                       instance.firstChild.nextSibling.textContent);
    clearAllTemplates(instance);
  });

  test('Repeat - svg', function(done) {
    var div = createTestHtml(
        '<svg width="400" height="110">' +
          '<template repeat>' +
            '<rect width="{{ width }}" height="{{ height }}" />' +
          '</template>' +
        '</svg>');

    var model = [{ width: 10, height: 10 }, { width: 20, height: 20 }];
    var svg = div.firstChild;
    var template = svg.firstChild;
    template.model = model;

    then(function() {
      assert.strictEqual(3, svg.childNodes.length);
      assert.strictEqual('10', svg.childNodes[1].getAttribute('width'));
      assert.strictEqual('10', svg.childNodes[1].getAttribute('height'));
      assert.strictEqual('20', svg.childNodes[2].getAttribute('width'));
      assert.strictEqual('20', svg.childNodes[2].getAttribute('height'));

      done();
    });
  });

  test('Bootstrap', function() {
    var div = document.createElement('div');
    div.innerHTML =
      '<template>' +
        '<div></div>' +
        '<template>' +
          'Hello' +
        '</template>' +
      '</template>';

    HTMLTemplateElement.bootstrap(div);
    var template = div.firstChild;
    assert.strictEqual(2, template.content.childNodes.length);
    var template2 = template.content.firstChild.nextSibling;
    assert.strictEqual(1, template2.content.childNodes.length);
    assert.strictEqual('Hello', template2.content.firstChild.textContent);

    var template = document.createElement('template');
    template.innerHTML =
      '<template>' +
        '<div></div>' +
        '<template>' +
          'Hello' +
        '</template>' +
      '</template>';

    HTMLTemplateElement.bootstrap(template);
    var template2 = template.content.firstChild;
    assert.strictEqual(2, template2.content.childNodes.length);
    var template3 = template2.content.firstChild.nextSibling;
    assert.strictEqual(1, template3.content.childNodes.length);
    assert.strictEqual('Hello', template3.content.firstChild.textContent);
  });

  test('issue-285', function(done) {
    var div = createTestHtml(
        '<template>' +
          '<template bind if="{{show}}">' +
            '<template id=del repeat="{{items}}">' +
              '{{}}' +
            '</template>' +
          '</template>' +
        '</template>');

    var template = div.firstChild;

    var model = {
      show: true,
      items: [1]
    };

    var delegate = {
      prepareInstanceModel: function(template) {
        if (template.id == 'del') {
          return function(val) {
            return val*2;
          };
        }
      }
    };
    div.appendChild(template.createInstance(model, delegate));

    then(function() {
      assert.equal('2', template.nextSibling.nextSibling.nextSibling.textContent);
      model.show = false;

    }).then(function() {
      model.show = true;

    }).then(function() {
      assert.equal('2', template.nextSibling.nextSibling.nextSibling.textContent);

      done();
    });
  });

  test('Accessor value retrieval count', function(done) {
    var hasObserve = typeof Object.observe == 'function';

    var div = createTestHtml(
        '<template bind>' +
            '{{ prop }}' +
        '</template>');

    var count = 0;
    var value = 1;
    var model = {
      get prop() {
        count++;
        return value;
      }
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      if (hasObserve)
        assert.equal(1, count);
      else
        assert.equal(2, count);

      value++;
      if (hasObserve) {
        Object.getNotifier(model).notify({
          type: 'update',
          object: model,
          name: 'prop',
          oldValue: 1 });
      }

      model.dep++;

    }).then(function() {
      if (hasObserve)
        assert.equal(2, count);
      else
        assert.equal(4, count);

      done();
    });
  });
});

suite('Binding Delegate API', function() {

  setup(doSetup)

  teardown(doTeardown);

  test('prepareBinding', function(done) {
    var model = { foo: 'bar'};
    var testData = [
      {
        type: 'prepare',
        path: '',
        name: 'bind',
        nodeType: Node.ELEMENT_NODE,
        tagName: 'TEMPLATE'
      },
      {
        type: 'bindFn',
        model: model,
        nodeType: Node.ELEMENT_NODE,
        tagName: 'TEMPLATE',
        oneTime: true
      },
      {
        type: 'prepare',
        path: 'foo',
        name: 'textContent',
        nodeType: Node.TEXT_NODE,
        tagName: undefined
      },
      {
        type: 'prepare',
        path: '',
        name: 'bind',
        nodeType: Node.ELEMENT_NODE,
        tagName: 'TEMPLATE'
      },
      {
        type: 'bindFn',
        model: model,
        nodeType: Node.TEXT_NODE,
        tagName: undefined,
        oneTime: false
      },
      {
        type: 'bindFn',
        model: model,
        nodeType: Node.ELEMENT_NODE,
        tagName: 'TEMPLATE',
        oneTime: false
      },
      {
        type: 'prepare',
        path: 'foo',
        name: 'textContent',
        nodeType: Node.TEXT_NODE,
        tagName: undefined
      },
      {
        type: 'bindFn',
        model: model,
        nodeType: Node.TEXT_NODE,
        tagName: undefined,
        oneTime: true
      }
    ];

    var delegate = {
      self: "self",

      prepareBinding: function(path, name, node) {
        var data = testData.shift();

        assert.strictEqual("self", this.self);
        assert.strictEqual(data.type, 'prepare');
        assert.strictEqual(data.path, path);
        assert.strictEqual(data.name, name);
        assert.strictEqual(data.nodeType, node.nodeType);
        assert.strictEqual(data.tagName, node.tagName);

        return function(model, node, oneTime) {
          var data = testData.shift();

          assert.strictEqual(data.type, 'bindFn');
          assert.strictEqual(data.model, model);
          assert.strictEqual(data.nodeType, node.nodeType);
          assert.strictEqual(data.tagName, node.tagName);
          assert.isTrue(data.oneTime == oneTime);

          return oneTime ? Path.get(path).getValueFrom(model) :
                           new PathObserver(model, path);
        }
      }
    };

    var div = createTestHtml(
        '<template bind="[[]]">{{ foo }}' +
          '<template bind>[[ foo ]]</template>' +
        '</template>');
    var template = div.firstChild;
    template.bindingDelegate = delegate;
    template.model = model;

    then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('bar', div.lastChild.textContent);
      assert.strictEqual('TEMPLATE', div.childNodes[2].tagName);

      assert.strictEqual(0, testData.length);

      done();
    });
  });

  test('prepareInstanceModel', function(done) {
    var model = [{ foo: 1 }, { foo: 2 }, { foo: 3 }];

    var div = createTestHtml(
        '<template repeat>' +
        '{{ foo }}</template>');
    var template = div.firstChild;

    var testData = [
      {
        template: template,
      },
      {
        model: model[0],
        altModel: { foo: 'a' }
      },
      {
        model: model[1],
        altModel: { foo: 'b' }
      },
      {
        model: model[2],
        altModel: { foo: 'c' }
      }
    ];

    var delegate = {
      self: "self",

      prepareInstanceModel: function(template) {
        var data = testData.shift();

        assert.strictEqual("self", this.self);
        assert.strictEqual(data.template, template);

        return function(model) {
          data = testData.shift();
          assert.strictEqual(data.model, model);
          return data.altModel;
        }
      }
    };

    template.bindingDelegate = delegate;
    template.model = model;

    then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('TEMPLATE', div.childNodes[0].tagName);
      assert.strictEqual('a', div.childNodes[1].textContent);
      assert.strictEqual('b', div.childNodes[2].textContent);
      assert.strictEqual('c', div.childNodes[3].textContent);

      assert.strictEqual(0, testData.length);

      done();
    });
  });

  test('prepareInstanceModel - reorder instances', function(done) {
    var model = [0, 1, 2];

    var div = createTestHtml(
        '<template repeat>' +
        '{{}}</template>');
    var template = div.firstChild;
    var prepareCount = 0;
    var callCount = 0;

    var delegate = {
      prepareInstanceModel: function(template) {
        prepareCount++;
        return function(model) {
          callCount++;
          return model;
        };
      }
    };

    template.bindingDelegate = delegate;
    template.model = model;

    then(function() {
      assert.strictEqual(1, prepareCount);
      assert.strictEqual(3, callCount);

      model.reverse();

    }).then(function() {
      assert.strictEqual(1, prepareCount);
      assert.strictEqual(3, callCount);

      done();
    });
  });

  test('prepareInstancePositionChanged', function(done) {
    var model = ['a', 'b', 'c'];

    var div = createTestHtml(
        '<template repeat>' +
        '{{}}</template>');
    var template = div.firstChild;

    var testData = [
      {
        template: template,
      },
      {
        model: model[0],
        index: 0
      },
      {
        model: model[1],
        index: 1
      },
      {
        model: model[2],
        index: 2
      },
      // After splice
      {
        model: model[2],
        index: 1
      }
    ];

    var delegate = {
      self: "self",

      prepareInstancePositionChanged: function(template) {
        var data = testData.shift();

        assert.strictEqual("self", this.self);
        assert.strictEqual(data.template, template);

        return function(templateInstance, index) {
          data = testData.shift();
          assert.strictEqual(data.model, templateInstance.model);
          assert.strictEqual(data.index, index);
        }
      }
    };

    template.bindingDelegate = delegate;
    template.model = model;

    then(function() {
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('TEMPLATE', div.childNodes[0].tagName);
      assert.strictEqual('a', div.childNodes[1].textContent);
      assert.strictEqual('b', div.childNodes[2].textContent);
      assert.strictEqual('c', div.childNodes[3].textContent);

      model.splice(1, 1);

    }).then(function() {
      assert.strictEqual(0, testData.length);

      done();
    });
  });

  test('Update bindingDelegate with active template', function(done) {
    function bindingHandler(prefix, path) {
      return function(model) {
        return new ObserverTransform(new PathObserver(model, path),
          function(value) {
            return prefix + ':' + value;
          }
        );
      };
    }

    var delegateA = {
      prepareBinding: function(path, name, node) {
        if (path == '$ident')
          return bindingHandler('a', 'id');

        if (path == '$index')
          return bindingHandler('i', 'index');
      },

      prepareInstanceModel: function(template) {
        return function(model) {
          return { id: model };
        }
      },

      prepareInstancePositionChanged: function(template) {
        return function(templateInstance, index) {
          templateInstance.model.index = index;
        }
      }
    };

    var delegateB = {
      prepareBinding: function(path, name, node) {
        if (path == '$ident')
          return bindingHandler('A', 'id');

        if (path == '$index')
          return bindingHandler('I', 'index');
      },

      prepareInstanceModel: function(template) {
        return function(model) {
          return { id: model + '-narg' };
        };
      },

      prepareInstancePositionChanged: function(template) {
        return function(templateInstance, index) {
          templateInstance.model.index = 2 * index;
        }
      }
    };

    var model = [1, 2];

    var div = createTestHtml(
        '<template repeat>{{ $index }} - {{ $ident }}</template>');
    var template = div.firstChild;
    template.bindingDelegate = delegateA;
    template.model = model;

    then(function() {
      assert.strictEqual(3, div.childNodes.length);
      assert.strictEqual('i:0 - a:1', div.childNodes[1].textContent);
      assert.strictEqual('i:1 - a:2', div.childNodes[2].textContent);

      assert.throws(function() {
        template.bindingDelegate = delegateB;
      });

      template.clear();
      assert.strictEqual(1, div.childNodes.length);

      template.bindingDelegate = delegateB;
      template.model = model;
      model.push(3);
    }).then(function() {
      // All instances should reflect delegateB
      assert.strictEqual(4, div.childNodes.length);
      assert.strictEqual('I:0 - A:1-narg', div.childNodes[1].textContent);
      assert.strictEqual('I:2 - A:2-narg', div.childNodes[2].textContent);
      assert.strictEqual('I:4 - A:3-narg', div.childNodes[3].textContent);

      done();
    });
  });

  test('Basic', function(done) {
    var model = { foo: 2, bar: 4 };

    var delegate = {
      prepareBinding: function(path, name, node) {
        var match = path.match(/2x:(.*)/);
        if (match == null)
          return;

        path = Path.get(match[1].trim());
        function timesTwo(value) {
          return value * 2;
        }
        return function(model) {
          return new ObserverTransform(new PathObserver(model, path), timesTwo);
        };
      }
    };

    var div = createTestHtml(
        '<template bind>' +
        '{{ foo }} + {{ 2x: bar }} + {{ 4x: bar }}</template>');
    var template = div.firstChild;
    template.bindingDelegate = delegate;
    template.model = model;

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('2 + 8 + ', div.lastChild.textContent);

      model.foo = 4;
      model.bar = 8;

    }).then(function() {
      assert.strictEqual('4 + 16 + ', div.lastChild.textContent);

      done();
    });
  });

  test('CreateInstance', function(done) {
    var delegateFoo = {
      prepareBinding: function(path, name, node) {
        if (name == 'textContent') {
          return function(model) {
            return 'foo';
          };
        }
      }
    };

    var delegateBar = {
      prepareBinding: function(path, name, node) {
        if (name == 'textContent') {
          return function(model) {
            return 'bar';
          };
        }
      }
    };

    var div = createTestHtml(
        '<template bind>[[ 2x: bar ]]</template>');
    var template = div.firstChild;
    template.bindingDelegate = delegateFoo;
    template.model = {};

    then(function() {
      assert.strictEqual(2, div.childNodes.length);
      assert.strictEqual('foo', div.lastChild.textContent);

      var fragment = template.createInstance({});
      assert.strictEqual(1, fragment.childNodes.length);
      assert.strictEqual('foo', fragment.lastChild.textContent);

      var fragment = template.createInstance({}, delegateBar);
      assert.strictEqual(1, fragment.childNodes.length);
      assert.strictEqual('bar', fragment.lastChild.textContent);

      done();
    });
  });

  test('issue-141', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<div foo="{{foo1}} {{foo2}}" bar="{{bar}}"></div>' +
        '</template>');
    var template = div.firstChild;
    var model = {
      foo1: 'foo1Value',
      foo2: 'foo2Value',
      bar: 'barValue'
    };
    template.model = model;

    then(function() {
      assert.equal('barValue', div.lastChild.getAttribute('bar'));

      done();
    });
  });

  test('issue-18', function(done) {

    var delegate = {
      prepareBinding: function(path, name, node) {
        if (name != 'class')
          return;

        return function(model) {
          return new PathObserver(model, path);
        }
      }
    };

    var div = createTestHtml(
        '<template bind>' +
          '<div class="foo: {{ bar }}"></div>' +
        '</template>');
    var template = div.firstChild;
    var model = {
      bar: 2
    };
    template.model = model;

    then(function() {
      assert.equal('foo: 2', div.lastChild.getAttribute('class'));

      done();
    });
  });

  test('issue-152', function(done) {
    var div = createTestHtml(
        '<template ref=notThere bind>XXX</template>');

    var template = div.firstChild;
    template.model = {};
    then(function() {
      // if a ref cannot be located, a template will continue to use itself
      // as the source of template instances.
      assert.strictEqual('XXX', div.childNodes[1].textContent);
      done();
    })
  });
});

suite('Compat', function() {
  test('underbar bindings', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<div _style="color: {{ color }};"></div>' +
          '<img _src="{{ url }}">' +
          '<a _href="{{ url2 }}">Link</a>' +
          '<input type="number" _value="{{ number }}">' +
        '</template>');
    var template = div.firstChild;
    var model = {
      color: 'red',
      url: 'pic.jpg',
      url2: 'link.html',
      number: 4
    };
    template.model = model;

    then(function() {
      var subDiv = div.firstChild.nextSibling;
      assert.equal('color: red;', subDiv.getAttribute('style'));

      var img = subDiv.nextSibling;
      assert.equal('pic.jpg', img.getAttribute('src'));

      var a = img.nextSibling;
      assert.equal('link.html', a.getAttribute('href'));

      var input = a.nextSibling;
      assert.equal(4, input.value);

      done();
    });
  });
});
