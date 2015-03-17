suite('scoped-styling', function() {

  function assertComputed(element, value) {
    var computed = getComputedStyle(element);
    assert.equal(computed['border-top-width'], value, 'computed style incorrect');
  }

  var styled = document.querySelector('x-styled');
  var styledWide = document.querySelector('x-styled.wide');
  var unscoped = document.querySelector('.scoped');
  var button = document.querySelector('[is=x-button]');
  var specialButton = document.querySelector('[is=x-button].special');

  test(':host, :host(...)', function() {
    assertComputed(styled, '1px');
    assertComputed(styledWide, '2px');
    
  });

  test('scoped selectors, simple and complex', function() {
    assertComputed(styled.$.simple, '3px');
    assertComputed(styled.$.complex1, '4px');
    assertComputed(styled.$.complex2, '4px');
  });

  test('media query scoped selectors', function() {
    assertComputed(styled.$.media, '5px');
  });

  test('upper bound encapsulation', function() {
    assertComputed(unscoped, '0px');
  });

  test('lower bound encapsulation', function() {
    assertComputed(styled.$.child.$.simple, '0px');
    assertComputed(styled.$.child.$.complex1, '0px');
    assertComputed(styled.$.child.$.complex2, '0px');
    assertComputed(styled.$.child.$.media, '0px');
  });

  test('::content selectors', function() {
    var content = document.querySelector('.content');
    var content1 = document.querySelector('.content1');
    var content2 = document.querySelector('.content2');
    assertComputed(content, '6px');
    assertComputed(content1, '13px');
    assertComputed(content2, '14px');
  });

  test('::shadow selectors', function() {
    assertComputed(styled.$.child.$.shadow, '7px');
  });

  test('/deep/ selectors', function() {
    assertComputed(styled.$.child.$.deep, '8px');
  });

  test('dynamically added elements', function() {
    var d = document.createElement('div');
    d.classList.add('scoped');
    Polymer.dom(styled.root).appendChild(d);
    assertComputed(d, '4px');
    Polymer.dom(styled.root).removeChild(d);
    assert.equal(d.getAttribute('style-scoped'), null);
    Polymer.dom(styled.root).appendChild(d);
    assertComputed(d, '4px');
    Polymer.dom(styled.root).removeChild(d);
    assert.equal(d.getAttribute('style-scoped'), null);
  });

  test('type extension elements', function() {
    assertComputed(button, '10px');
    assertComputed(specialButton, '11px');
  });

  if (window.Polymer && !Polymer.Settings.useNativeShadow) {

    suite('scoped-styling-shady-only', function() {

      test('element style precedence below document styles', function() {
        assertComputed(styledWide.$.priority, '1px');
      });

      test('styles shimmed in registration order', function() {
        var s$ = document.head.querySelectorAll('style[scope]');
        var expected = ['x-child2', 'x-styled', 'x-button'];
        var actual = [];
        for (var i=0; i<s$.length; i++) {
          actual.push(s$[i].getAttribute('scope'));
        }
        assert.deepEqual(actual, expected);
      });
    });
  }
  
});
