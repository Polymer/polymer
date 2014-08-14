// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
// This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
// The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also
// subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt

suite('PolymerExpressions', function() {

  var testDiv, originalConsoleError, errors;


  var getExpression;

  suiteSetup(function() {
    getExpression = PolymerExpressions.getExpression;
  });

  function clearAllTemplates(node) {
    if (node instanceof HTMLTemplateElement || node.iterator_)
      node.clear();

    for (var child = node.firstChild; child; child = child.nextSibling)
      clearAllTemplates(child);
  }

  setup(function() {
    errors = [];
    originalConsoleError = console.error;
    console.error = function() {
      errors.push(Array.prototype.slice.call(arguments));
    };
    testDiv = document.body.appendChild(document.createElement('div'));
    Observer._errorThrownDuringCallback = false;
  });

  teardown(function() {
    errors = [];
    console.error = originalConsoleError;
    assert.isFalse(!!Observer._errorThrownDuringCallback);
    document.body.removeChild(testDiv);
    clearAllTemplates(testDiv);
    Platform.performMicrotaskCheckpoint();
    assert.strictEqual(0, Observer._allObserversCount);
  });

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

  function dispatchEvent(type, target) {
    var event = document.createEvent('Event');
    event.initEvent(type, true, false);
    target.dispatchEvent(event);
    Platform.performMicrotaskCheckpoint();
  }

  function hasClass(node, className) {
    return node.className.split(' ').some(function(name) {
      return name === className;
    });
  }

  function assertHasClass(node, className) {
    return assert.isTrue(hasClass(node, className))
  }

  function assertLacksClass(node, className) {
    return assert.isFalse(hasClass(node, className))
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
      delegate = delegate|| new PolymerExpressions;

      // testing filters
      delegate.hex = function(value) {
        return Number(value).toString(16);
      };
      // toModel as property on toDOM function
      delegate.hex.toModel = function(value) {
        return parseInt(value, 16);
      };
      delegate.toFixed = function(value, fractions) {
        return Number(value).toFixed(fractions);
      };
      delegate.upperCase = function(value) {
        return String(value).toUpperCase();
      };
      delegate.incrProp = function(value, obj, propName) {
        obj[propName]++;
      };
      // filter as full object with toDOM and toModel properties
      delegate.plusN = {
        toDOM: function(value, n) {
          return Number(value) + n;
        },
        toModel: function(value, n) {
          return Number(value) - n;
        }
      };
      delegate.staticSort = function(list) {
        var copy = list.slice(0);
        copy.sort();
        return copy;
      };

      template.bindingDelegate = delegate;
      template.model = model;
    });
  }

  function objToString(str) {
    return {
      toString: function() {
        return str;
      }
    };
  }

  test('ClassName Singular', function(done) {
    var div = createTestHtml(
        '<template bind><div class="{{ {foo: bar} | tokenList }}">' +
        '</div></template>');
    var model = {bar: 1};
    recursivelySetTemplateModel(div, model);

    var target;
    then(function() {
      target = div.childNodes[1];
      assertHasClass(target, 'foo');

      model.bar = 0;

    }).then(function() {
      assertLacksClass(target, 'foo');

      done();
    });
  });


  test('ClassName Singular Static', function(done) {
    var div = createTestHtml(
        '<template bind><div class="[[ {foo: bar} | tokenList ]]">' +
        '</div></template>');
    var model = {bar: 1};
    recursivelySetTemplateModel(div, model);

    var target;
    then(function() {
      target = div.childNodes[1];
      assertHasClass(target, 'foo');

      model.bar = 0;

    }).then(function() {
      assertHasClass(target, 'foo');

      done();
    });
  });

  test('ClassName Multiple', function(done) {
    var div = createTestHtml(
        '<template bind>' +
        '<div class="{{ {foo: bar, baz: bat > 1, boo: bot.bam} ' +
            '| tokenList }}">' +
        '</div></template>');
    var model = {bar: 1, bat: 1, bot: { bam: 1 }};
    recursivelySetTemplateModel(div, model);

    var target;
    then(function() {
      target = div.childNodes[1];
      assert.strictEqual('foo boo', target.className);
      assertHasClass(target, 'foo');
      assertLacksClass(target, 'baz');
      assertHasClass(target, 'boo');

      model.bar = 0;
      model.bat = 2;

    }).then(function() {
      assert.strictEqual('baz boo', target.className);
      assertLacksClass(target, 'foo');
      assertHasClass(target, 'baz');
      assertHasClass(target, 'boo');

      done();
    });
  });

  test('ClassName Multiple - static', function(done) {
    var div = createTestHtml(
        '<template bind>' +
        '<div class="[[ {foo: bar, baz: bat > 1, boo: bot.bam} ' +
            '| tokenList ]]">' +
        '</div></template>');
    var model = {bar: 1, bat: 1, bot: { bam: 1 }};
    recursivelySetTemplateModel(div, model);

    var target;
    then(function() {
      target = div.childNodes[1];
      assert.strictEqual('foo boo', target.className);
      assertHasClass(target, 'foo');
      assertLacksClass(target, 'baz');
      assertHasClass(target, 'boo');

      model.bar = 0;
      model.bat = 2;

    }).then(function() {
      assert.strictEqual('foo boo', target.className);
      assertHasClass(target, 'foo');
      assertLacksClass(target, 'baz');
      assertHasClass(target, 'boo');

      done();
    });
  });

  test('tokenList', function(done) {
    var div = createTestHtml(
        '<template bind>' +
        '<div class="{{ object | tokenList }}">' +
        '</div></template>');

    var model = {
      object: {bar: 1, bat: 1, bot: {bam: 1}}
    };
    recursivelySetTemplateModel(div, model);

    var target;
    then(function() {
      target = div.childNodes[1];
      assert.strictEqual('bar bat bot', target.className);

      model.object = {bar: 1, bot: 1};

    }).then(function() {
      assert.strictEqual('bar bot', target.className);

      done();
    });
  });

  test('tokenList - static', function(done) {
    var div = createTestHtml(
        '<template bind>' +
        '<div class="[[ object | tokenList ]]">' +
        '</div></template>');

    var model = {
      object: {bar: 1, bat: 1, bot: {bam: 1}}
    };
    recursivelySetTemplateModel(div, model);

    var target;
    then(function() {
      target = div.childNodes[1];
      assert.strictEqual('bar bat bot', target.className);

      model.object = {bar: 1, bot: 1};

    }).then(function() {
      assert.strictEqual('bar bat bot', target.className);

      done();
    });
  });

  test('styleObject', function(done) {
    // IE removes invalid style attribute values so we use xstyle in this test.

    var div = createTestHtml(
        '<template bind>' +
        '<div xstyle="{{ object | styleObject }}">' +
        '</div></template>');

    var model = {
      object: {
        width: '100px',
        backgroundColor: 'blue',
        WebkitUserSelect: 'none'
      }
    };
    recursivelySetTemplateModel(div, model);

    var target;
    then(function() {
      target = div.childNodes[1];
      assert.strictEqual(target.getAttribute('xstyle'),
          'width: 100px; background-color: blue; -webkit-user-select: none');

      model.object = {
        left: '50px',
        whiteSpace: 'pre'
      };

    }).then(function() {
      assert.strictEqual(target.getAttribute('xstyle'),
          'left: 50px; white-space: pre');

      done();
    });
  });

  test('styleObject2', function(done) {
    // IE removes invalid style attribute values so we use xstyle in this test.

    var div = createTestHtml(
        '<template bind>' +
        '<div xstyle="{{ {width: w, backgroundColor: bc} | styleObject }}">' +
        '</div></template>');

    var model = {
      w: '100px',
      bc: 'blue'
    };
    recursivelySetTemplateModel(div, model);

    var target;
    then(function() {
      target = div.childNodes[1];
      assert.strictEqual(target.getAttribute('xstyle'),
                         'width: 100px; background-color: blue');

      model.w = 0;

    }).then(function() {
      assert.strictEqual(target.getAttribute('xstyle'),
          'width: 0; background-color: blue');

      done();
    });
  });

  test('Named Scope Bind', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<template bind="{{ foo.bar as baz }}">' +
            '{{ id }}:{{ baz.bat }}' +
          '</template>' +
        '</template>');
    var model = { id: 'id', foo: { bar: { bat: 'boo' }}};
    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('id:boo', div.childNodes[2].textContent);

      done();
    });
  });

  test('Named Scope Repeat', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<template repeat="{{ user in users }}">' +
            '{{ id }}:{{ user.name }}' +
          '</template>' +
        '</template>');
    var model = {
      id: 'id',
      users: [
        { name: 'Tim' },
        { name: 'Sally'}
      ]
    };
    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('id:Tim', div.childNodes[2].textContent);
      assert.strictEqual('id:Sally', div.childNodes[3].textContent);

      done();
    });
  });

  test('Named Scope Repeat - semantic template', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<table><tr template repeat="{{ user in users }}">' +
            '<td>{{ id }}:{{ user.name }}</td>' +
          '</tr></table>' +
        '</template>');
    var model = {
      id: 'id',
      users: [
        { name: 'Tim' },
        { name: 'Sally'}
      ]
    };
    recursivelySetTemplateModel(div, model);

    then(function() {
      var tbody = div.firstChild.nextSibling.firstChild;
      assert.strictEqual('id:Tim', tbody.childNodes[1].firstChild.textContent);
      assert.strictEqual('id:Sally',
                         tbody.childNodes[2].firstChild.textContent);

      done();
    });
  });

  test('Named Scope Deep Nesting', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<template repeat="{{ user in users }}">' +
            '{{ id }}:{{ user.name }}' +
            '<template repeat="{{ employee in user.employees }}">' +
              '{{ id }}:{{ user.name }}:{{ employee.name }}' +
            '</template>' +
          '</template>' +
        '</template>');
    var model = {
      id: 'id',
      users: [
        { name: 'Tim', employees: [{ name: 'Bob'}, { name: 'Sam'}]},
        { name: 'Sally', employees: [{ name: 'Steve' }]}
      ]
    };
    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('id:Tim', div.childNodes[2].textContent);
      assert.strictEqual('id:Tim:Bob', div.childNodes[4].textContent);
      assert.strictEqual('id:Tim:Sam', div.childNodes[5].textContent);

      assert.strictEqual('id:Sally', div.childNodes[6].textContent);
      assert.strictEqual('id:Sally:Steve', div.childNodes[8].textContent);

      done();
    });
  });

  test('Named Scope Unnamed resets', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<template bind="{{ foo as bar }}">' +
            '{{ bar.id }}' +
            '<template bind="{{ bar.bat }}">' +
              '{{ boo }}:{{ bar.id }}' +
            '</template>' +
          '</template>' +
        '</template>');
    var model = {
      foo: {
        id: 2,
        bat: {
          boo: 'bot'
        }
      },
    };
    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('2', div.childNodes[2].textContent);
      assert.strictEqual('bot:', div.childNodes[4].textContent);

      done();
    });
  });

  test('Expressions Arithmetic, + - / *', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ (a.b + c.d)/e - f * g.h }}' +
        '</template>');
    var model = {
      a: {
        b: 5
      },
      c: {
        d: 5
      },
      e: 2,
      f: 3,
      g: {
        h: 2
      }
    };
    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('-1', div.childNodes[1].textContent);

      model.a.b = 11;
      model.f = -2;

    }).then(function() {
      assert.strictEqual('12', div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Unary - +', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ (-a.b) - (+c) }}' +
        '</template>');
    var model = {
      a: {
        b: 5
      },
      c: 3
    };
    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('-8', div.childNodes[1].textContent);

      model.a.b = -1;
      model.c = -4;

    }).then(function() {
      assert.strictEqual('5', div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Logical !', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ !a.b }}:{{ !c }}:{{ !d }}' +
        '</template>');
    var model = {
      a: {
        b: 5
      },
      c: '',
      d: false
    };
    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('false:true:true', div.childNodes[1].textContent);

      model.a.b = 0;
      model.c = 'foo'

    }).then(function() {
      assert.strictEqual('true:false:true', div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Arithmetic, Additive', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ (a.b + c.d) - (f + g.h) }}' +
        '</template>');
    var model = {
      a: {
        b: 5
      },
      c: {
        d: 5
      },
      e: 2,
      f: 3,
      g: {
        h: 2
      }
    };
    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('5', div.childNodes[1].textContent);

      model.a.b = 7;
      model.g.h = -5;

    }).then(function() {
      assert.strictEqual('14', div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Arithmetic, Multiplicative', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ (a.b * c.d) / (f % g.h) }}' +
        '</template>');
    var model = {
      a: {
        b: 5
      },
      c: {
        d: 6
      },
      e: 2,
      f: 8,
      g: {
        h: 5
      }
    };
    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('10', div.childNodes[1].textContent);

      model.a.b = 10;
      model.f = 16;

    }).then(function() {
      assert.strictEqual('60', div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Relational', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ a.b > c }}:{{ a.b < c }}:{{ c >= d }}:{{ d <= e }}' +
        '</template>');
    var model = {
      a: {
        b: 5
      },
      c: 3,
      d: 3,
      e: 2
    };
    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('true:false:true:false',
                         div.childNodes[1].textContent);

      model.a.b = 1;
      model.d = -5;

    }).then(function() {
      assert.strictEqual('false:true:true:true', div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Equality', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ a.b == c }}:{{ a.b != c }}:{{ c === d }}:{{ d !== e }}' +
        '</template>');
    var model = {
      a: {
        b: 5
      },
      c: '5',
      d: {}
    };
    model.e = model.d;

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('true:false:false:false',
                         div.childNodes[1].textContent);

      model.a.b = 3;
      model.e = {};

    }).then(function() {
      assert.strictEqual('false:true:false:true',
                          div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Binary Logical', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ a.b && c }}:{{ a.b || c }}:{{ c && d }}:{{ d || e }}' +
        '</template>');
    var model = {
      a: {
        b: 0
      },
      c: 5,
      d: true,
      e: ''
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('0:5:true:true', div.childNodes[1].textContent);

      model.a.b = true;
      model.d = 0;

    }).then(function() {
      assert.strictEqual('5:true:0:', div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Conditional', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ a.b ? c : d.e }}:{{ f ? g.h : i }}' +
        '</template>');
    var model = {
      a: {
        b: 1
      },
      c: 5,
      d: {
        e: 2
      },
      f: 0,
      g: {
        h: 'foo'
      },
      i: 'bar'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('5:bar', div.childNodes[1].textContent);

      model.c = 6;
      model.f = '';
      model.i = 'bat'

    }).then(function() {
      assert.strictEqual('6:bat', div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Conditional 2', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ checked ? a : b }}' +
        '</template>');
    var model = {
      checked: false,
      a: 'A',
      b: 'B'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('B', div.childNodes[1].textContent);

      model.checked = true;

    }).then(function() {
      assert.strictEqual('A', div.childNodes[1].textContent);

      model.a = 'AAA';
    }).then(function() {
      assert.strictEqual('AAA', div.childNodes[1].textContent);

      model.checked = false;

    }).then(function() {
      assert.strictEqual('B', div.childNodes[1].textContent);

      model.b = 'BBB';
    }).then(function() {
      assert.strictEqual('BBB', div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Literals', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ +1 }}:{{ "foo" }}:{{ true ? true : false }}:' +
            '{{ true ? null : false}}' +
        '</template>');
    var model = {};

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('1:foo:true:null', div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Array Literals', function(done) {
    var div = createTestHtml(
        '<template repeat="{{ [foo, bar] }}">' +
            '{{}}' +
        '</template>');

    var model = {
      foo: 'bar',
      bar: 'bat'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('bar', div.childNodes[1].textContent);
      assert.strictEqual('bat', div.childNodes[2].textContent);

      model.foo = 'boo';
      model.bar = 'blat';

    }).then(function() {
      assert.strictEqual('boo', div.childNodes[1].textContent);
      assert.strictEqual('blat', div.childNodes[2].textContent);

      done();
    });
  });

  test('Expressions Object Literals', function(done) {
    var div = createTestHtml(
        '<template bind="{{ { \'id\': 1, foo: bar } }}">' +
            '{{id}}:{{foo}}' +
        '</template>');

    var model = {
      bar: 'bat'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('1:bat', div.childNodes[1].textContent);

      model.bar = 'blat';

    }).then(function() {
      assert.strictEqual('1:blat', div.childNodes[1].textContent);

      done();
    });
  });

  test('Expressions Array Literals, Named Scope', function(done) {
    var div = createTestHtml(
        '<template repeat="{{ user in [foo, bar] }}">' +
            '{{ user }}' +
        '</template>');

    var model = {
      foo: 'bar',
      bar: 'bat'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('bar', div.childNodes[1].textContent);
      assert.strictEqual('bat', div.childNodes[2].textContent);

      model.foo = 'boo';
      model.bar = 'blat';

    }).then(function() {
      assert.strictEqual('boo', div.childNodes[1].textContent);
      assert.strictEqual('blat', div.childNodes[2].textContent);

      done();
    });
  });

  test('Expressions Object Literals, Named Scope', function(done) {
    var div = createTestHtml(
        '<template bind="{{ { \'id\': 1, foo: bar } as t }}">' +
            '{{t.id}}:{{t.foo}}' +
        '</template>');

    var model = {
      bar: 'bat'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('1:bat', div.childNodes[1].textContent);

      model.bar = 'blat';

    }).then(function() {
      assert.strictEqual('1:blat', div.childNodes[1].textContent);

      done();
    });
  });

  test('filter without arguments', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '{{ bar | upperCase }}' +
            '{{ bar | upperCase() }}' +
        '</template>');

    var model = {
      bar: 'bat'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('BATBAT', div.childNodes[1].textContent);

      model.bar = 'blat';

    }).then(function() {
      assert.equal('BLATBLAT', div.childNodes[1].textContent);

      done();
    });
  });

  test('filter with arguments', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '{{ bar | toFixed(4) }}' +
        '</template>');

    var model = {
      bar: 1.23456789
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('1.2346', div.childNodes[1].textContent);

      model.bar = 9.87654321;

    }).then(function() {
      assert.equal('9.8765', div.childNodes[1].textContent);

      done();
    });
  });

  test('Inline functions', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '{{ addTwo(2, 3) + addTwo(a, b) }}:{{ minus(addTwo(a, b), c) }}' +
        '</template>');

    var model = {
      a: 4,
      b: 5,
      c: 3,
      addTwo: function(a, b) {
        assert.strictEqual(this, model);
        return a + b;
      },
      minus: function(a, amount) {
        assert.strictEqual(this, model);
        return a - amount;
      }
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('14:6', div.childNodes[1].textContent);

      model.a = 10;
    }).then(function() {
      assert.equal('20:12', div.childNodes[1].textContent);

      model.c = 10;

    }).then(function() {
      assert.equal('20:5', div.childNodes[1].textContent);

      done();
    });
  });


  test('Expression execution count', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '{{ dep | incrProp(obj, "count") }}' +
        '</template>');

    var model = {
      dep: 1,
      obj: { count: 0 }
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal(1, model.obj.count);
      model.dep++;

    }).then(function() {
      assert.equal(2, model.obj.count);

      done();
    });
  });


  test('chained filters', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '{{ bar | toFixed(0) | hex | upperCase }}' +
        '</template>');

    var model = {
      bar: 12.34
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('C', div.childNodes[1].textContent);

      model.bar = 14.56;

    }).then(function() {
      assert.equal('F', div.childNodes[1].textContent);

      done();
    });
  });

  test('complex computed property expression', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '<div foo="{{ foo[bar + 2].baz + bat }}">' +
        '</template>');

    var model = {
      foo: [{ baz: 'bo' }, { baz: 'ba' }],
      bar: -2,
      bat: 't'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('bot', div.childNodes[1].getAttribute('foo'));
      model.myIndex = 0;
      model.bar = -1;
      model.bat = 'r';

    }).then(function() {
      assert.equal('bar', div.childNodes[1].getAttribute('foo'));

      done();
    });
  });

  test('computed - newly reachable objects', function(done) {
    var div = createTestHtml(
        '<template bind>' +
            '<div foo="{{ 1 == foo.bar.bat }}">' +
        '</template>');

    var model = {};

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('false', div.childNodes[1].getAttribute('foo'));
      model.foo = {};

    }).then(function() {
      assert.equal('false', div.childNodes[1].getAttribute('foo'));
      model.foo.bar = {};

    }).then(function() {
      assert.equal('false', div.childNodes[1].getAttribute('foo'));
      model.foo.bar.bat = 1;

    }).then(function() {
      assert.equal('true', div.childNodes[1].getAttribute('foo'));

      done();
    });
  });


  test('computed property with ident index', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '<div foo="{{ myArray[myIndex] }}">' +
        '</template>');

    var model = {
      myArray: ['baz', 'bar'],
      myIndex: 1
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('bar', div.childNodes[1].getAttribute('foo'));
      model.myIndex = 0;

    }).then(function() {
      assert.equal('baz', div.childNodes[1].getAttribute('foo'));

      model.myArray = ['hello', 'world'];
    }).then(function() {
      assert.equal('hello', div.childNodes[1].getAttribute('foo'));

      done();
    });
  });

  test('computed property with object index', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '<div foo="{{ myObj[dateObj] }}">' +
        '</template>');

    var model = {
      myObj: {
        'Tue Jul 08 2014 12:00:00 GMT-0700 (PDT)': 'bar',
        'Wed Jul 09 2014 12:00:00 GMT-0700 (PDT)': 'baz'
      },
      dateObj: objToString('Tue Jul 08 2014 12:00:00 GMT-0700 (PDT)')
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('bar', div.childNodes[1].getAttribute('foo'));
      model.dateObj = objToString('Wed Jul 09 2014 12:00:00 GMT-0700 (PDT)');

    }).then(function() {
      assert.equal('baz', div.childNodes[1].getAttribute('foo'));

      done();
    });
  });

  test('computed property with object index - assignment', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '<input value="{{ myObj[dateObj] }}">' +
        '</template>');

    var model = {
      myObj: {
        'Tue Jul 08 2014 12:00:00 GMT-0700 (PDT)': 'bar',
      },
      dateObj: objToString('Tue Jul 08 2014 12:00:00 GMT-0700 (PDT)')
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('bar', div.childNodes[1].value);
      div.childNodes[1].value = 'baz';
      dispatchEvent('input', div.childNodes[1]);

    }).then(function() {
      assert.equal('baz',
                   model.myObj['Tue Jul 08 2014 12:00:00 GMT-0700 (PDT)']);
      done();
    });
  });

  test('two-way computed property', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '<input value="{{ bar[\'contains space\'] }}">' +
        '</template>');

    var model = {
      bar: {
        'contains space': 'a'
      }
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('a', div.childNodes[1].value);

      div.childNodes[1].value = 'b';
      dispatchEvent('input', div.childNodes[1]);

    }).then(function() {
      assert.equal('b', model.bar['contains space']);

      done();
    });
  });

  test('two-way computed property 2', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '<input value="{{ bar[0].bat }}">' +
        '</template>');

    var model = {
      bar: [{ bat: 'a' }]
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('a', div.childNodes[1].value);

      div.childNodes[1].value = 'b';
      dispatchEvent('input', div.childNodes[1]);

    }).then(function() {
      assert.equal('b', model.bar[0].bat);

      done();
    });
  });

  test('dynamic two-way computed property', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '<input value="{{ foo[bar] }}">' +
        '</template>');

    var model = {
      foo: {
        a: '1',
        b: '3'
      },
      bar: 'a'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('1', div.childNodes[1].value);

      div.childNodes[1].value = '2';
      dispatchEvent('input', div.childNodes[1]);

    }).then(function() {
      assert.equal('2', model.foo.a);
      assert.equal('3', model.foo.b);

      model.bar = 'b';

    }).then(function() {
      assert.equal('3', div.childNodes[1].value);

      div.childNodes[1].value = '4';
      dispatchEvent('input', div.childNodes[1]);

    }).then(function() {
      assert.equal('2', model.foo.a);
      assert.equal('4', model.foo.b);

      done();
    });
  });

  test('two-way filter', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '<input value="{{ bar | plusN(bat) | plusN(boo) }}">' +
        '</template>');

    var model = {
      bar: 10,
      bat: 1,
      boo: 3
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('14', div.childNodes[1].value);

      div.childNodes[1].value = 8;
      dispatchEvent('input', div.childNodes[1]);

    }).then(function() {
      assert.equal(4, model.bar);
      assert.equal(1, model.bat);
      assert.equal(3, model.boo);

      model.bar = 5;
      model.bat = 3;
      model.boo = -2;

    }).then(function() {
      assert.equal('6', div.childNodes[1].value);

      div.childNodes[1].value = 10;
      dispatchEvent('input', div.childNodes[1]);

    }).then(function() {
      assert.equal(9, model.bar);
      assert.equal(3, model.bat);
      assert.equal(-2, model.boo);

      done();
    })
  });

  test('two-way binding to root scope', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<template bind="{{ foo as foo }}">' +
            '<input value="{{ bar }}">' +
          '</template>' +
        '</template>');

    var model = { foo: {}, bar: 'bar' };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('bar', div.childNodes[2].value);

      div.childNodes[2].value = 'baz';
      dispatchEvent('input', div.childNodes[2]);

    }).then(function() {
      assert.equal('baz', model.bar);

      done();
    })
  });

  test('two-way binding to root scope with transform', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<template bind="{{ foo as foo }}">' +
            '<input value="{{ bar | plusN(2) }}">' +
          '</template>' +
        '</template>');

    var model = { foo: {}, bar: 3 };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('5', div.childNodes[2].value);

      div.childNodes[2].value = 8;
      dispatchEvent('input', div.childNodes[2]);

    }).then(function() {
      assert.equal(6, model.bar);

      done();
    })
  });

  test('two-way filter too many paths', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '<input value="{{ bar + num | hex }}">' +
        '</template>');

    var model = {
      bar: 32,
      num: 10
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('2a', div.childNodes[1].value);

      div.childNodes[1].value = 'ff';
      dispatchEvent('input', div.childNodes[1]);

    }).then(function() {
      assert.equal(32, model.bar);
      assert.equal(10, model.num);

      model.bar = 15;

    }).then(function() {
      assert.equal('19', div.childNodes[1].value);

      model.num = 5;

    }).then(function() {
      assert.equal('14', div.childNodes[1].value);

      done();
    });
  });

  test('two-way filter chained', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '<input value="{{ bar | plusN(10) | hex }}">' +
        '</template>');

    var model = {
      bar: 22
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('20', div.childNodes[1].value);

      div.childNodes[1].value = 'ff';
      dispatchEvent('input', div.childNodes[1]);

    }).then(function() {
      assert.equal(245, model.bar);

      model.bar = 5;

    }).then(function() {
      assert.equal('f', div.childNodes[1].value);

      done();
    });
  });

  test('filter unexpected EOF', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '{{ bar | }}' +
        '</template>');

    var model = {
      bar: 'bat'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('', div.childNodes[1].textContent);

      model.bar = 'blat';

    }).then(function() {
      assert.equal('', div.childNodes[1].textContent);

      assert.equal(errors[0][0], 'Invalid expression syntax: bar |');

      done();
    });
  });

  test('filter not at EOF', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '{{ bar | upperCase + 42 }}' +
        '</template>');

    var model = {
      bar: 'bat'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('', div.childNodes[1].textContent);

      model.bar = 'blat';

    }).then(function() {
      assert.equal('', div.childNodes[1].textContent);

      assert.equal(errors[0][0],
                   'Invalid expression syntax: bar | upperCase + 42');

      done();
    });
  });

  test('Member lookup with constant expressions', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '{{ array[0] }} {{ object["a"] }}' +
        '</template>');
    var model = {
      array: ['a', 'b'],
      object: {
        a: 'A'
      }
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('a A', div.childNodes[1].textContent);

      model.array = ['c', 'd'];

    }).then(function() {
      assert.equal('c A', div.childNodes[1].textContent);

      model.object = {a: 'E'};

    }).then(function() {
      assert.equal('c E', div.childNodes[1].textContent);

      done();
    });
  });

  test('Member lookup', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '{{ array[index] }} {{ object[key] }}' +
        '</template>');
    var model = {
      array: ['a', 'b'],
      index: 0,
      object: {
        a: 'A',
        b: 'B'
      },
      key: 'a'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('a A', div.childNodes[1].textContent);

      model.index = 1;

    }).then(function() {
      assert.equal('b A', div.childNodes[1].textContent);

      model.key = 'b';

    }).then(function() {
      assert.equal('b B', div.childNodes[1].textContent);

      model.array = ['c', 'd'];

    }).then(function() {
      assert.equal('d B', div.childNodes[1].textContent);

      model.object = {
        a: 'C',
        b: 'D'
      };

    }).then(function() {
      assert.equal('d D', div.childNodes[1].textContent);

      done();
    });
  });

  test('Member lookup nested', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '{{ object[array[index]] }}' +
        '</template>');
    var model = {
      array: ['a', 'b'],
      index: 0,
      object: {
        a: 'A',
        b: 'B'
      }
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('A', div.childNodes[1].textContent);

      model.index = 1;

    }).then(function() {
      Platform.performMicrotaskCheckpoint();
      assert.equal('B', div.childNodes[1].textContent);

      done();
    });
  });

  test('in expression with index scope', function(done) {
    var div = createTestHtml(
        '<template repeat="{{ value, i in array }}">' +
          '{{ i }}. {{ value }}' +
        '</template>');

    var model = {
      array: ['a', 'b', 'c']
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('0. a', div.childNodes[1].textContent);
      assert.strictEqual('1. b', div.childNodes[2].textContent);
      assert.strictEqual('2. c', div.childNodes[3].textContent);

      model.array.splice(1, 1, 'd', 'e');

    }).then(function() {
      assert.strictEqual('0. a', div.childNodes[1].textContent);
      assert.strictEqual('1. d', div.childNodes[2].textContent);
      assert.strictEqual('2. e', div.childNodes[3].textContent);
      assert.strictEqual('3. c', div.childNodes[4].textContent);

      model.array.reverse();

    }).then(function() {
      assert.strictEqual('0. c', div.childNodes[1].textContent);
      assert.strictEqual('1. e', div.childNodes[2].textContent);
      assert.strictEqual('2. d', div.childNodes[3].textContent);
      assert.strictEqual('3. a', div.childNodes[4].textContent);

      model.array.sort();

    }).then(function() {
      assert.strictEqual('0. a', div.childNodes[1].textContent);
      assert.strictEqual('1. c', div.childNodes[2].textContent);
      assert.strictEqual('2. d', div.childNodes[3].textContent);
      assert.strictEqual('3. e', div.childNodes[4].textContent);

      model.array.shift();

    }).then(function() {
      assert.strictEqual('0. c', div.childNodes[1].textContent);
      assert.strictEqual('1. d', div.childNodes[2].textContent);
      assert.strictEqual('2. e', div.childNodes[3].textContent);

      model.array.unshift('f');
      model.array.push('g');

    }).then(function() {
      assert.strictEqual('0. f', div.childNodes[1].textContent);
      assert.strictEqual('1. c', div.childNodes[2].textContent);
      assert.strictEqual('2. d', div.childNodes[3].textContent);
      assert.strictEqual('3. e', div.childNodes[4].textContent);
      assert.strictEqual('4. g', div.childNodes[5].textContent);

      done();
    });
  });

  test('in expression with nested index scopes', function(done) {
    var div = createTestHtml(
        '<template repeat="{{ foo, i in foos }}">' +
          '<template repeat="{{ value, j in foo }}">' +
            '{{ i }}:{{ j }}. {{ value }}' +
          '</template>' +
        '</template>');

    var model = {
      foos: [
        [ 'a', 'b'],
        [ 'c', 'd']
      ]
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('0:0. a', div.childNodes[2].textContent);
      assert.strictEqual('0:1. b', div.childNodes[3].textContent);
      assert.strictEqual('1:0. c', div.childNodes[5].textContent);
      assert.strictEqual('1:1. d', div.childNodes[6].textContent);

      model.foos.reverse();

    }).then(function() {
      assert.strictEqual('0:0. c', div.childNodes[2].textContent);
      assert.strictEqual('0:1. d', div.childNodes[3].textContent);
      assert.strictEqual('1:0. a', div.childNodes[5].textContent);
      assert.strictEqual('1:1. b', div.childNodes[6].textContent);

      model.foos[0].reverse();
      model.foos[1].reverse();

    }).then(function() {
      assert.strictEqual('0:0. d', div.childNodes[2].textContent);
      assert.strictEqual('0:1. c', div.childNodes[3].textContent);
      assert.strictEqual('1:0. b', div.childNodes[5].textContent);
      assert.strictEqual('1:1. a', div.childNodes[6].textContent);

      done();
    });
  });

  test('Named Scope Bind with filter', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<template bind="{{ value | hex as hexValue }}">' +
            '{{ hexValue }}' +
          '</template>' +
        '</template>');

    var model = {
      value: 32
    };
    recursivelySetTemplateModel(div, model);

    then(function() {
      var target = div.childNodes[2];
      assert.strictEqual('20', div.childNodes[2].textContent);

      model.value = 255;

    }).then(function() {
      assert.strictEqual('ff', div.childNodes[2].textContent);

      done();
    });
  });

  test('Named Scope Repeat with filter', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '<template repeat="{{ value in [ 3, 2, 1 ] | staticSort }}">' +
            '{{ value }}' +
          '</template>' +
        '</template>');
    var model = {};
    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual('1', div.childNodes[2].textContent);
      assert.strictEqual('2', div.childNodes[3].textContent);
      assert.strictEqual('3', div.childNodes[4].textContent);

      done();
    });
  });

  test('filter on model', function(done) {
    var div = createTestHtml(
        '<template bind="{{ }}">' +
            '<input value="{{ value | multiple }}">' +
        '</template>');

    var model = {
      factor: 2,
      multiple: function(value) {
        return Number(value) * this.factor;
      },

      value: 8
    };

    model.multiple.toModel = function(value) {
      return Number(value) / this.factor;
    }

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('16', div.childNodes[1].value);

      div.childNodes[1].value = 20;
      dispatchEvent('input', div.childNodes[1]);

    }).then(function() {
      assert.equal('10', model.value);

      done();
    });
  });

  // https://github.com/Polymer/polymer-expressions/issues/19
  test('issue-19', function(done) {
    var div = createTestHtml(
        '<template id="t" bind="{{ foo.bar as b }}">' +
          '<span>{{ b }}</span>' +
        '</template>');

    var model = {};

    recursivelySetTemplateModel(div, model);

    then(function() {
      var target = div.childNodes[1];

      done();
    });
  });

  test('Inline function parsing', function() {
    assert.isDefined(getExpression('a(1, 2)'));
    assert.isDefined(getExpression('a(b + c, d + e)'));
    assert.isDefined(getExpression('a(true) + b(false)'));
    assert.throws(function() {
      getExpression('a.b()');
    });
    assert.throws(function() {
      getExpression('a[1]()');
    });
    assert.throws(function() {
      getExpression('(a + b)()');
    });
  });

  test('Dynamic deps path expressions', function() {
    assert.isFalse(getExpression('a + b').dynamicDeps);
    assert.isFalse(getExpression('a + b > 3 + hello["kitty"]').dynamicDeps);
    assert.isTrue(getExpression('a[a.b]').dynamicDeps);
    assert.isTrue(getExpression('a[a.b] + d[e]').dynamicDeps);
    assert.isFalse(getExpression('a[0].c').dynamicDeps);
    assert.isFalse(getExpression('a[1][0]').dynamicDeps);

    assert.isTrue(getExpression('a[b].c').dynamicDeps);
    assert.isTrue(getExpression('(a + 1).c').dynamicDeps);
    assert.isTrue(getExpression('a[a.b].c').dynamicDeps);
    assert.isTrue(getExpression('a[a][0]').dynamicDeps);
    assert.isTrue(getExpression('a[a.b] + d[e].f').dynamicDeps);
    assert.isTrue(getExpression('a[b + c]').dynamicDeps);
    assert.isTrue(getExpression('a[b + 2].c + d').dynamicDeps);
  });

  // https://github.com/Polymer/polymer-expressions/issues/24
  test('issue-24 - 1', function(done) {
    var div = createTestHtml(
        '<template id="t" bind if="{{ true }}">' +
          '<span>{{ b }}</span>' +
        '</template>');

    var model = {
      b: 'hi',
      true: false
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal(div.childNodes.length, 2);
      var target = div.childNodes[1];
      assert.equal(target.textContent, 'hi');
      done();
    });
  });

  test('issue-24 - 2', function(done) {
    var div = createTestHtml(
        '<template id="t" bind if="{{ false }}">' +
          '<span>{{ b }}</span>' +
        '</template>');

    var model = {
      b: 'hi',
      false: true
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal(div.childNodes.length, 1);
      done();
    });
  });

  test('issue-24 - 3', function(done) {
    var div = createTestHtml(
        '<template id="t" bind if="{{ null }}">' +
          '<span>{{ b }}</span>' +
        '</template>');

    var model = {
      b: 'hi',
      null: true
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal(div.childNodes.length, 1);
      done();
    });
  });

  test('issue-24 - 4', function(done) {
    var div = createTestHtml(
        '<template id="t" bind if="{{ 0 }}">' +
          '<span>{{ b }}</span>' +
        '</template>');

    var model = {
      b: 'hi',
      0: true
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal(div.childNodes.length, 1);
      done();
    });
  });

  test('issue-24 - 5', function(done) {
    var div = createTestHtml(
        '<template id="t" bind>' +
          '<span>{{ true }}</span>' +
        '</template>');

    var model = {true: false};

    recursivelySetTemplateModel(div, model);

    then(function() {
      var target = div.childNodes[1];
      assert.equal(div.childNodes.length, 2);
      assert.equal(target.textContent, 'true');
      done();
    });
  });

  test('issue-24 - 6', function(done) {
    var div = createTestHtml(
        '<template id="t" bind>' +
          '<span>{{ 111 }}</span>' +
        '</template>');

    var model = {111: 222};

    recursivelySetTemplateModel(div, model);

    then(function() {
      var target = div.childNodes[1];
      assert.equal(div.childNodes.length, 2);
      assert.equal(target.textContent, '111');
      done();
    });
  });

  test('issue-24 - 7', function(done) {
    var div = createTestHtml(
        '<template id="t" bind>' +
          '<span>{{ 1.2 }}</span>' +
        '</template>');

    var model = {
      1: {
        2: 3
      }
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      var target = div.childNodes[1];
      assert.equal(div.childNodes.length, 2);
      assert.equal(target.textContent, '1.2');
      done();
    });
  });

  test('issue-29 - 1', function(done) {
    var div = createTestHtml(
        '<template id="t" bind>' +
          '{{ items[index] }}' +
        '</template>');

    var model = {
      index: 0,
      items: [1, 2]
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      var target = div.childNodes[1];
      assert.equal(target.textContent, '1');
      model.index = 1;
    }).then(function() {
      var target = div.childNodes[1];
      assert.equal(target.textContent, '2');
      model.items[1] = 3;
    }).then(function() {
      var target = div.childNodes[1];
      assert.equal(target.textContent, '3');
      done();
    });
  });

  test('issue-29 - 2', function(done) {
    var div = createTestHtml(
        '<template id="t" bind>' +
          '{{ index }} - {{ items[index] }}' +
        '</template>');

    var model = {
      index: 0,
      items: [1, 2]
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      var target = div.childNodes[1];
      assert.equal(target.textContent, '0 - 1');
      model.index++;
    }).then(function() {
      var target = div.childNodes[1];
      assert.equal(target.textContent, '1 - 2');
      model.items[1] = 3;
    }).then(function() {
      var target = div.childNodes[1];
      assert.equal(target.textContent, '1 - 3');
      done();
    });
  });

  test('issue-29 - 3', function(done) {
    var div = createTestHtml(
        '<template id="t" bind="{{items[index] as item}}">' +
          '{{ index }} - {{ item }}' +
        '</template>');

    var model = {
      index: 0,
      items: [1, 2]
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      var target = div.childNodes[1];
      assert.equal(target.textContent, '0 - 1');
      model.index++;
    }).then(function() {
      var target = div.childNodes[1];
      assert.equal(target.textContent, '1 - 2');
      model.items[1] = 3;
    }).then(function() {
      var target = div.childNodes[1];
      assert.equal(target.textContent, '1 - 3');
      done();
    });
  });

  test('issue-33', function(done) {
    var div = createTestHtml(
        '<template repeat="{{ id in data }}">' +
          '{{ id }}' +
        '</template>');

    var model =  document.createElement('div');
    model.id = 'foo';
    model.data = ['a', 'b', 'c'];

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual(div.childNodes.length, 4);
      assert.strictEqual(model.id, 'foo');
      done();
    });
  });

  test('issue-34', function(done) {
    var div = createTestHtml(
        '<template bind>' +
          '{{ comments[\'f-irst\'] }}' +
        '</template>');

    var model = {
      comments: {
        'f-irst': 'foo'
      }
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      model.comments['f-irst'] = 'bar'
    }).then(function() {
      assert.strictEqual(div.childNodes[1].textContent, 'bar');
      done();
    });
  });

  test('issue-35', function(done) {
    var div = createTestHtml(
        '<template bind="{{ data[0] as foo }}">' +
          '{{ foo.value }}' +
        '</template>');

    var model = {
      data: [{ value: 'bar' }]
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.strictEqual(div.childNodes[1].textContent, 'bar');
      done();
    });
  });

  test('lazy conditional', function(done) {
    var div = createTestHtml(
        '<template bind=>' +
          '{{ a ? b : c }}' +
        '</template>');
    var count = 0;
    var model = {
      a: true,
      b: 'B',
      get c() {
        count++;
      }
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('B', div.childNodes[1].textContent);
      assert.equal(0, count);

      model.b = 'BB';

    }).then(function() {
      assert.equal('BB', div.childNodes[1].textContent);
      assert.equal(0, count);

      done();
    });
  });

  test('lazy conditional 2', function(done) {
    var div = createTestHtml(
        '<template bind=>' +
          '{{ a ? b : c }}' +
        '</template>');
    var count = 0;
    var model = {
      a: false,
      get b() {
        count++;
      },
      c: 'C'
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('C', div.childNodes[1].textContent);
      assert.equal(0, count);

      model.c = 'CC';

    }).then(function() {
      assert.equal('CC', div.childNodes[1].textContent);
      assert.equal(0, count);

      done();
    });
  });

  test('lazy or', function(done) {
    var div = createTestHtml(
        '<template bind=>' +
          '{{ a || b }}' +
        '</template>');
    var count = 0;
    var model = {
      a: 'A',
      get b() {
        count++;
      },
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('A', div.childNodes[1].textContent);
      assert.equal(0, count);

      model.a = 'AA';

    }).then(function() {
      assert.equal('AA', div.childNodes[1].textContent);
      assert.equal(0, count);

      done();
    });
  });

  test('lazy and', function(done) {
    var div = createTestHtml(
        '<template bind=>' +
          '{{ a && b }}' +
        '</template>');
    var count = 0;
    var model = {
      a: false,
      get b() {
        count++;
      },
    };

    recursivelySetTemplateModel(div, model);

    then(function() {
      assert.equal('false', div.childNodes[1].textContent);
      assert.equal(0, count);

      model.a = 0;

    }).then(function() {
      assert.equal('0', div.childNodes[1].textContent);
      assert.equal(0, count);

      done();
    });
  });

});
