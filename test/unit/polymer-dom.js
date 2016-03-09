suite('Polymer.dom', function() {

  var testElement;
  var wrap = window.wrap || function(n){ return n; };

  suiteSetup(function() {
    testElement = document.querySelector('x-test');
  });

  test('querySelector (local)', function() {
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    assert.equal(projected.textContent, 'projected');
    var p2 = Polymer.dom(testElement).querySelector('#projected');
    assert.isNull(p2);
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    assert.equal(rere.is, 'x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    assert.equal(re.is, 'x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(p.is, 'x-project');
  });

  test('querySelectorAll (local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var rereList = Polymer.dom(rere.root).querySelectorAll('*');
    assert.include(rereList, re);
    assert.equal(rereList.length, 2);
    var reList = Polymer.dom(re.root).querySelectorAll('*');
    assert.include(reList, p);
    assert.equal(reList.length, 2);
    var pList = Polymer.dom(p.root).querySelectorAll('*');
    assert.equal(pList.length, 1);
  });

  test('querySelector (light)', function() {
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(Polymer.dom(rere).querySelector('#projected'), projected);
    assert(Polymer.dom(re).querySelector('content'));
    assert(Polymer.dom(p).querySelector('content'));
  });

  test('querySelectorAll (light)', function() {
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(Polymer.dom(rere).querySelectorAll('#projected')[0], projected);
    assert(Polymer.dom(re).querySelectorAll('content').length, 1);
    assert(Polymer.dom(p).querySelectorAll('content').length, 1);
  });

  test('querySelectorAll with dom-repeat', function() {
    var el = document.createElement('polymer-dom-repeat');
    document.body.appendChild(el);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(el.$.container).querySelectorAll('*').length, 6, 'querySelectorAll finds repeated elements');
    document.body.removeChild(el);
  });

  test('querySelector document', function() {
    assert.ok(Polymer.dom().querySelector('body'));
  });

  test('projection', function() {
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    assert.equal(projected.textContent, 'projected');
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    assert.equal(rere.is, 'x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    assert.equal(re.is, 'x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(p.is, 'x-project');
    var c1 = Polymer.dom(rere.root).querySelector('content');
    assert.include(Polymer.dom(c1).getDistributedNodes(), projected);
    var c2 = Polymer.dom(re.root).querySelector('content');
    assert.include(Polymer.dom(c2).getDistributedNodes(), projected);
    var c3 = Polymer.dom(p.root).querySelector('content');
    assert.include(Polymer.dom(c3).getDistributedNodes(), projected);
    var ip$ = [c1, c2, c3];
    assert.deepEqual(Polymer.dom(projected).getDestinationInsertionPoints(), ip$);
  });

  test('distributeContent', function() {
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var c1 = Polymer.dom(rere.root).querySelector('content');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var c2 = Polymer.dom(re.root).querySelector('content');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var c3 = Polymer.dom(p.root).querySelector('content');
    var ip$ = [c1, c2, c3];
    testElement.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(projected).getDestinationInsertionPoints(), ip$);
    rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    assert.equal(rere.is, 'x-rereproject');
    rere.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(projected).getDestinationInsertionPoints(), ip$);
    re = Polymer.dom(rere.root).querySelector('x-reproject');
    assert.equal(re.is, 'x-reproject');
    re.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(projected).getDestinationInsertionPoints(), ip$);
    p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(p.is, 'x-project');
  });

  test('distributeContent (reproject)', function() {
    var select = document.querySelector('x-select1');
    var child = Polymer.dom(select).firstElementChild;
    var c1 = Polymer.dom(select.root).querySelector('content');
    var c2 = Polymer.dom(select.$.select.root).querySelector('content');
    var c3 = Polymer.dom(select.$.select.$.select.root).querySelector('content');
    assert.equal(c1.getAttribute('select'), '[s1]');
    assert.equal(c2.getAttribute('select'), '[s2]');
    assert.equal(c3.getAttribute('select'), '[s3]');
    var ip$ = [c1, c2, c3];
    assert.equal(child.className, 'select-child');
    assert.equal(Polymer.dom(child).getDestinationInsertionPoints().length, 0);
    child.setAttribute('s1', '');
    select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    child.setAttribute('s2', '');
    select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    child.setAttribute('s3', '');
    select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    child.removeAttribute('s1');
    select.$.select.$.select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
    child.setAttribute('s1', '');
    select.$.select.$.select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    child.removeAttribute('s2');
    select.$.select.$.select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    child.setAttribute('s2', '');
    select.$.select.$.select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    child.removeAttribute('s3');
    select.$.select.$.select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    child.removeAttribute('s2');
    child.removeAttribute('s1');
    select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
  });

  test('Polymer.dom.setAttribute (reproject)', function() {
    var select = document.querySelector('x-select1');
    var child = Polymer.dom(select).firstElementChild;
    var c1 = Polymer.dom(select.root).querySelector('content');
    var c2 = Polymer.dom(select.$.select.root).querySelector('content');
    var c3 = Polymer.dom(select.$.select.$.select.root).querySelector('content');
    assert.equal(c1.getAttribute('select'), '[s1]');
    assert.equal(c2.getAttribute('select'), '[s2]');
    assert.equal(c3.getAttribute('select'), '[s3]');
    var ip$ = [c1, c2, c3];
    assert.equal(child.className, 'select-child');
    assert.equal(Polymer.dom(child).getDestinationInsertionPoints().length, 0);
    Polymer.dom(child).setAttribute('s1', '');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    Polymer.dom(child).setAttribute('s2', '');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    Polymer.dom(child).setAttribute('s3', '');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).removeAttribute('s1');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
    Polymer.dom(child).setAttribute('s1', '');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).removeAttribute('s2');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    Polymer.dom(child).setAttribute('s2', '');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).removeAttribute('s3');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    Polymer.dom(child).removeAttribute('s2');
    Polymer.dom(child).removeAttribute('s1');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
  });

  test('Polymer.dom.classListAdd/Remove/Toggle/Contains (reproject)', function() {
    var select = document.querySelector('x-select-class1');
    var child = Polymer.dom(select).firstElementChild;
    var c1 = Polymer.dom(select.root).querySelector('content');
    var c2 = Polymer.dom(select.$.select.root).querySelector('content');
    var c3 = Polymer.dom(select.$.select.$.select.root).querySelector('content');
    assert.equal(c1.getAttribute('select'), '.s1');
    assert.equal(c2.getAttribute('select'), '.s2');
    assert.equal(c3.getAttribute('select'), '.s3');
    var ip$ = [c1, c2, c3];
    assert.equal(Polymer.dom(child).getDestinationInsertionPoints().length, 0);
    Polymer.dom(child).classList.add('s1');
    assert.isTrue(Polymer.dom(child).classList.contains('s1'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    Polymer.dom(child).classList.add('s2');
    assert.isTrue(Polymer.dom(child).classList.contains('s2'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    Polymer.dom(child).classList.add('s3');
    assert.isTrue(Polymer.dom(child).classList.contains('s3'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).classList.toggle('s1');
    assert.isFalse(Polymer.dom(child).classList.contains('s1'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
    Polymer.dom(child).classList.toggle('s1');
    assert.isTrue(Polymer.dom(child).classList.contains('s1'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).classList.remove('s2');
    assert.isFalse(Polymer.dom(child).classList.contains('s2'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    Polymer.dom(child).classList.toggle('s2');
    assert.isTrue(Polymer.dom(child).classList.contains('s2'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).classList.remove('s3');
    assert.isFalse(Polymer.dom(child).classList.contains('s3'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    Polymer.dom(child).classList.remove('s2');
    Polymer.dom(child).classList.remove('s1');
    assert.isFalse(Polymer.dom(child).classList.contains('s2'));
    assert.isFalse(Polymer.dom(child).classList.contains('s1'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
  });

  test('re-distribution results in correct logical tree when outer host remove a node from pool of inner host', function() {
    var r = document.querySelector('x-redistribute-a-b');
    var rc = Polymer.dom(r.root).querySelectorAll('content');
    var ec1 = Polymer.dom(r.$.echo1.root).querySelector('content');
    var ec2 = Polymer.dom(r.$.echo2.root).querySelector('content');
    var child = document.createElement('div');
    child.className = 'a';
    Polymer.dom(r).appendChild(child);
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [rc[0], ec1]);
    assert.deepEqual(Polymer.dom(rc[0]).getDistributedNodes(), [child]);
    assert.deepEqual(Polymer.dom(rc[1]).getDistributedNodes(), []);
    assert.deepEqual(Polymer.dom(ec1).getDistributedNodes(), [child]);
    assert.deepEqual(Polymer.dom(ec2).getDistributedNodes(), []);
    child.className = 'b';
    r.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [rc[1], ec2]);
    assert.deepEqual(Polymer.dom(rc[0]).getDistributedNodes(), []);
    assert.deepEqual(Polymer.dom(rc[1]).getDistributedNodes(), [child]);
    assert.deepEqual(Polymer.dom(ec1).getDistributedNodes(), []);
    assert.deepEqual(Polymer.dom(ec2).getDistributedNodes(), [child]);
    child.className = 'a';
    r.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [rc[0], ec1]);
    assert.deepEqual(Polymer.dom(rc[0]).getDistributedNodes(), [child]);
    assert.deepEqual(Polymer.dom(rc[1]).getDistributedNodes(), []);
    assert.deepEqual(Polymer.dom(ec1).getDistributedNodes(), [child]);
    assert.deepEqual(Polymer.dom(ec2).getDistributedNodes(), []);
  });

  test('without a host setting hostAttributes/reflecting properties provokes distribution', function() {
    var e = document.querySelector('x-select-attr');
    var ip$ = Polymer.dom(e.root).querySelectorAll('content');
    var c = Polymer.dom(e).firstElementChild;
    assert.equal(Polymer.dom(c).getDestinationInsertionPoints()[0], ip$[1], 'child not distributed based on host attribute');
    c.foo = true;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c).getDestinationInsertionPoints()[0], ip$[0], 'child not distributed based on reflecting attribute');
    c.foo = false;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c).getDestinationInsertionPoints()[0], ip$[1], 'child not distributed based on reflecting attribute');
  });

  test('within a host setting hostAttributes/reflecting properties provokes distribution', function() {
    // TODO(sorvell): disabling this test failure until it can be diagnosed
    // filed as issue #1595
    if (window.ShadowDOMPolyfill) {
        return;
    }
    var e = document.querySelector('x-compose-select-attr');
    var ip$ = Polymer.dom(e.$.select.root).querySelectorAll('content');
    var c1 = e.$.attr1;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c1).getDestinationInsertionPoints()[0], ip$[1], 'child not distributed based on host attribute');
    c1.foo = true;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c1).getDestinationInsertionPoints()[0], ip$[0], 'child not distributed based on reflecting attribute');
    c1.foo = false;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c1).getDestinationInsertionPoints()[0], ip$[1], 'child not distributed based on reflecting attribute');
    var c2 = e.$.attr2;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c2).getDestinationInsertionPoints()[0], ip$[0], 'child not distributed based on default value');
  });

  test('appendChild (light)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var s = document.createElement('span');
    s.id = 'added';
    s.textContent = 'Added';
    Polymer.dom(rere).appendChild(s);
    assert.equal(Polymer.dom(testElement.root).querySelector('#added'), s);
  });

  test('insertBefore (light)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var ref = Polymer.dom(testElement.root).querySelector('#added');
    var s = document.createElement('span');
    s.id = 'added2';
    s.textContent = 'Added2';
    Polymer.dom(rere).insertBefore(s, ref);
    assert.equal(Polymer.dom(testElement.root).querySelector('#added2'), s);
  });

  test('removeChild (light)', function() {
    var added = Polymer.dom(testElement.root).querySelector('#added');
    var added2 = Polymer.dom(testElement.root).querySelector('#added2');
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    assert.equal(Polymer.dom(testElement.root).querySelectorAll('*').length, 4);
    Polymer.dom(rere).removeChild(added);
    Polymer.dom(rere).removeChild(added2);
    assert.equal(Polymer.dom(testElement.root).querySelectorAll('*').length, 2);
  });

  test('appendChild (local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var s = document.createElement('span');
    s.id = 'local';
    s.textContent = 'Local';
    Polymer.dom(rere.root).appendChild(s);
    assert.equal(Polymer.dom(rere.root).querySelector('#local'), s);
  });

  test('insertBefore (local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var ref = Polymer.dom(testElement.root).querySelector('#local');
    var s = document.createElement('span');
    s.id = 'local2';
    s.textContent = 'Local2';
    Polymer.dom(rere.root).insertBefore(s, ref);
    assert.equal(Polymer.dom(rere.root).querySelector('#local2'), s);
  });

  test('removeChild (local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var local = Polymer.dom(rere.root).querySelector('#local');
    var local2 = Polymer.dom(rere.root).querySelector('#local2');
    Polymer.dom(rere.root).removeChild(local);
    Polymer.dom(rere.root).removeChild(local2);
    assert.equal(Polymer.dom(rere.root).querySelectorAll('#local').length, 0);
  });

  test('localDom.insertBefore first element results in minimal change', function() {
    var children = Polymer.dom(testElement.root).childNodes;
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    assert.equal(rere.attachedCount, 1);
    var s = document.createElement('span');
    s.id = 'local-first';
    s.textContent = 'Local First';
    Polymer.dom(testElement.root).insertBefore(s, children[0]);
    assert.equal(Polymer.dom(testElement.root).querySelector('#local-first'), s);
    assert.equal(rere.attachedCount, 1);
    Polymer.dom(testElement.root).removeChild(s);
    assert.equal(rere.attachedCount, 1);
  });

  test('appendChild (fragment, local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var fragment = document.createDocumentFragment();
    var childCount = 5;
    for (var i=0; i < childCount; i++) {
      var s = document.createElement('span');
      s.textContent = i;
      fragment.appendChild(s);
    }
    Polymer.dom(rere.root).appendChild(fragment);
    var added = Polymer.dom(rere.root).querySelectorAll('span');
    assert.equal(added.length, childCount);
    for (i=0; i < added.length; i++) {
      Polymer.dom(rere.root).removeChild(added[i]);
    }
    assert.equal(Polymer.dom(rere.root).querySelectorAll('span').length, 0);
  });

  test('insertBefore (fragment, local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var fragment = document.createDocumentFragment();
    var childCount = 5;
    for (var i=0; i < childCount; i++) {
      var s = document.createElement('span');
      s.textContent = i;
      fragment.appendChild(s);
    }
    var l = document.createElement('span');
    l.textContent = 'last';
    Polymer.dom(rere.root).appendChild(l);
    Polymer.dom(rere.root).insertBefore(fragment, l);
    var added = Polymer.dom(rere.root).querySelectorAll('span');
    assert.equal(added.length, childCount+1);
    assert.equal(added[added.length-1], l);
    for (i=0; i < added.length; i++) {
      Polymer.dom(rere.root).removeChild(added[i]);
    }
    assert.equal(Polymer.dom(rere.root).querySelectorAll('span').length, 0);
  });

  test('mutations using fragments without logical dom', function() {
    var d = document.createElement('div');
    document.body.appendChild(d);
    assert.equal(Polymer.dom(d).childNodes.length, 0);
    var frag = document.createDocumentFragment();
    var c = document.createElement('div');
    frag.appendChild(c);
    Polymer.dom(d).appendChild(frag);
    assert.equal(Polymer.dom(d).childNodes.length, 1);
    assert.equal(Polymer.dom(d).firstChild, c);
    var c1 = document.createElement('div');
    frag.appendChild(c1);
    Polymer.dom(d).appendChild(frag);
    assert.equal(Polymer.dom(d).childNodes.length, 2);
    assert.equal(Polymer.dom(d).firstChild, c);
    assert.equal(Polymer.dom(d).lastChild, c1);
  });

  test('appendChild interacts with unmanaged parent tree', function() {
    var container = document.querySelector('#container');
    var echo = Polymer.dom(container).firstElementChild;
    assert.equal(echo.localName, 'x-echo');
    var s1 = Polymer.dom(echo).nextElementSibling;
    assert.equal(s1.textContent, '1');
    var s2 = Polymer.dom(s1).nextElementSibling;
    assert.equal(s2.textContent, '2');
    assert.equal(Polymer.dom(container).children.length, 3);
    Polymer.dom(echo).appendChild(s1);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(container).children.length, 2);
    assert.equal(Polymer.dom(echo).nextElementSibling, s2);
    Polymer.dom(echo).appendChild(s2);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(container).children.length, 1);
    assert.equal(Polymer.dom(echo).nextElementSibling, null);
    Polymer.dom(container).appendChild(s1);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(container).children.length, 2);
    assert.equal(Polymer.dom(echo).nextElementSibling, s1);
    Polymer.dom(container).appendChild(s2);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(container).children.length, 3);
    assert.equal(Polymer.dom(echo).nextElementSibling, s1);
    assert.equal(Polymer.dom(s1).nextElementSibling, s2);
  });

  test('distribute (forced)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var s = document.createElement('span');
    s.id = 'light';
    s.textContent = 'Light';
    Polymer.dom(rere).appendChild(s);
    assert.equal(Polymer.dom(rere).querySelector('#light'), s);
    assert.equal(Polymer.dom(s).parentNode, rere);
    if (rere.shadyRoot) {
      assert.notEqual(Polymer.TreeApi.Composed.getParentNode(s), rere);
    }
    Polymer.dom(testElement).flush();
    if (rere.shadyRoot) {
      assert.equal(Polymer.TreeApi.Composed.getParentNode(s), p);
    }
    Polymer.dom(rere).removeChild(s);
    if (rere.shadyRoot) {
      assert.equal(Polymer.TreeApi.Composed.getParentNode(s), p);
    }
    Polymer.dom(testElement).flush();
    if (rere.shadyRoot) {
      assert.equal(Polymer.TreeApi.Composed.getParentNode(s), null);
    }
  });

  test('queryDistributedElements', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    var d$ = Polymer.dom(p.root).queryDistributedElements('*');
    assert.equal(d$.length, 1);
    assert.equal(d$[0], projected);

  });

  test('getEffectiveChildNodes', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    var c$ = Polymer.dom(re).getEffectiveChildNodes();
    assert.equal(c$.length, 3);
    assert.equal(c$[1], projected);
  });

  test('Polymer.dom.querySelector', function() {
    var test = Polymer.dom().querySelector('x-test');
    var rere = Polymer.dom().querySelector('x-rereproject');
    var projected = Polymer.dom().querySelector('#projected');
    assert.ok(testElement);
    assert.notOk(rere);
    assert.notOk(projected);
  });

  test('Polymer.dom event', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var eventHandled = 0;
    testElement.addEventListener('test-event', function(e) {
      eventHandled++;
      assert.equal(Polymer.dom(e).rootTarget, p);
      assert.equal(Polymer.dom(e).localTarget, testElement);
      var path = Polymer.dom(e).path;
      // path includes window only on more recent Shadow DOM implementations
      // account for that here.
      assert.ok(path.length >= 10);
      assert.equal(path[0], p);
      assert.equal(path[2], re);
      assert.equal(path[4], rere);
      assert.equal(path[6], testElement);
      // event.path *should* be an array
      assert.isArray(path);
      assert.isFunction(path.indexOf);
      assert(path.indexOf(testElement) > -1);
    });

    rere.addEventListener('test-event', function(e) {
      eventHandled++;
      assert.equal(Polymer.dom(e).localTarget, rere);
    });

    p.fire('test-event');
    assert.equal(eventHandled, 2);
  });

  test('parentNode', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    assert.equal(Polymer.dom(testElement).parentNode, wrap(document.body));
    assert.equal(Polymer.dom(projected).parentNode, rere);
  });

  test('Polymer.dom.childNodes is an array', function() {
    assert.isTrue(Array.isArray(Polymer.dom(document.body).childNodes));
  });

  test('Polymer.dom cloneNode shallow', function() {
    var a = document.createElement('div');
    a.innerHTML = '<x-clonate><span>1</span><span>2</span></x-clonate>';
    var b = Polymer.dom(Polymer.dom(a).firstElementChild).cloneNode();
    Polymer.dom(document.body).appendChild(b);
    assert.equal(Polymer.dom(b).childNodes.length, 0, 'shallow copy has incorrect children');
    if (b.shadyRoot) {
      assert.equal(b.children.length, 2, 'shallow copy has incorrect composed children');
    }
  });

  test('Polymer.dom cloneNode deep', function() {
    var a = document.createElement('div');
    a.innerHTML = '<x-clonate><span>1</span><span>2</span></x-clonate>';
    var b = Polymer.dom(a).cloneNode(true);
    Polymer.dom(document.body).appendChild(b);
    assert.equal(Polymer.dom(b.firstElementChild).childNodes.length, 2, 'deep copy has incorrect children');
    if (b.shadyRoot) {
      assert.equal(b.children.length, 4, 'deep copy has incorrect composed children');
    }
  });

  test('Polymer.dom importNode shallow', function() {
    var a = document.createElement('div');
    a.innerHTML = '<x-clonate><span>1</span><span>2</span></x-clonate>';
    var b = Polymer.dom(document).importNode(Polymer.dom(a).firstElementChild);
    Polymer.dom(document.body).appendChild(b);
    assert.equal(Polymer.dom(b).childNodes.length, 0, 'shallow import has incorrect children');
    if (b.shadyRoot) {
      assert.equal(b.children.length, 2, 'shallow import has incorrect composed children');
    }
  });

  test('Polymer.dom importNode deep', function() {
    var a = document.createElement('div');
    a.innerHTML = '<x-clonate><span>1</span><span>2</span></x-clonate>';
    var b = Polymer.dom(document).importNode(a, true);
    Polymer.dom(document.body).appendChild(b);
    assert.equal(Polymer.dom(b.firstElementChild).childNodes.length, 2, 'deep copy has incorrect children');
    if (b.shadyRoot) {
      assert.equal(b.children.length, 4, 'deep copy has incorrect composed children');
    }
  });

  test('flush causes attached and re-flushes if necessary', function(done) {
    var a = document.createElement('x-attach1');
    Polymer.dom(document.body).appendChild(a);
    Polymer.dom.flush();
    function testHeight() {
      assert.equal(a.offsetHeight, 540);
      done();
    }
    // note: CustomElements.takeRecords doesn't process all mutations under
    // SD polyfill and therefore we have no measurement guarantee in that case.
    if (Polymer.Settings.useShadow && !Polymer.Settings.useNativeShadow) {
      setTimeout(testHeight);
    } else {
      testHeight();
    }

  });

  test('Polymer.dom.flush reentrancy', function() {
    // Setup callbacks
    var order = [];
    var cb1 = sinon.spy(function() { order.push(cb1); });
    var cb2 = sinon.spy(function() { order.push(cb2); });
    var cb3 = sinon.spy(function() { order.push(cb3); });
    var cb4 = sinon.spy(function() { order.push(cb4); });
    var cbReentrant = sinon.spy(function() {
      order.push(cbReentrant);
      Polymer.dom.addDebouncer(Polymer.Debounce(null, cb3));
      Polymer.dom.flush();
      Polymer.dom.addDebouncer(Polymer.Debounce(null, cb4));
    });
    // Enqueue debouncers
    Polymer.dom.addDebouncer(Polymer.Debounce(null, cb1));
    Polymer.dom.addDebouncer(Polymer.Debounce(null, cbReentrant));
    Polymer.dom.addDebouncer(Polymer.Debounce(null, cb2));
    // Flush
    Polymer.dom.flush();
    // Check callbacks called and in correct order
    assert.isTrue(cb1.calledOnce);
    assert.isTrue(cb2.calledOnce);
    assert.isTrue(cb3.calledOnce);
    assert.isTrue(cb4.calledOnce);
    assert.isTrue(cbReentrant.calledOnce);
    assert.sameMembers(order, [cb1, cbReentrant, cb2, cb3, cb4]);
  });

  test('path correctly calculated for elements with destination insertion points', function(done) {
    var re = document.createElement('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var child = document.createElement('p');
    child.innerHTML = "hello";
    // child will be inserted into p after distributeContent is performed.
    Polymer.dom(re).appendChild(child);
    Polymer.dom(document.body).appendChild(re);
    Polymer.dom.flush();
    child.addEventListener('child-event', function(e){
      var path = Polymer.dom(e).path;
      assert.isTrue(path.indexOf(p) !== -1, 'path contains p');
      assert.isTrue(path.indexOf(re) !== -1, 'path contains re');
      done();
    });
    var evt = new CustomEvent('child-event');
    child.dispatchEvent(evt);
  });

});

suite('Polymer.dom accessors', function() {
  var noDistribute, distribute;

  suiteSetup(function() {
    noDistribute = document.querySelector('.accessors x-test-no-distribute');
    distribute = document.querySelector('.accessors x-project');
  });

  test('Polymer.dom node accessors (no distribute)', function() {
    var child = Polymer.dom(noDistribute).children[0];
    assert.isTrue(child.classList.contains('child'), 'test node could not be found');
    var before = document.createElement('div');
    var after = document.createElement('div');
    Polymer.dom(noDistribute).insertBefore(before, child);
    Polymer.dom(noDistribute).appendChild(after);
    assert.equal(Polymer.dom(noDistribute).firstChild, before, 'firstChild incorrect');
    assert.equal(Polymer.dom(noDistribute).lastChild, after, 'lastChild incorrect');
    assert.equal(Polymer.dom(before).nextSibling, child, 'nextSibling incorrect');
    assert.equal(Polymer.dom(child).nextSibling, after, 'nextSibling incorrect');
    assert.equal(Polymer.dom(after).previousSibling, child, 'previousSibling incorrect');
    assert.equal(Polymer.dom(child).previousSibling, before, 'previousSibling incorrect');
  });

  test('Polymer.dom node accessors (distribute)', function() {
    var child = Polymer.dom(distribute).children[0];
    assert.isTrue(child.classList.contains('child'), 'test node could not be found');
    var before = document.createElement('div');
    var after = document.createElement('div');
    Polymer.dom(distribute).insertBefore(before, child);
    Polymer.dom(distribute).appendChild(after);
    assert.equal(Polymer.dom(distribute).firstChild, before, 'firstChild incorrect');
    assert.equal(Polymer.dom(distribute).lastChild, after, 'lastChild incorrect');
    assert.equal(Polymer.dom(before).nextSibling, child, 'nextSibling incorrect');
    assert.equal(Polymer.dom(child).nextSibling, after, 'nextSibling incorrect');
    assert.equal(Polymer.dom(after).previousSibling, child, 'previousSibling incorrect');
    assert.equal(Polymer.dom(child).previousSibling, before, 'previousSibling incorrect');
  });

  test('Polymer.dom element accessors (no distribute)', function() {
    var parent = document.createElement('x-test-no-distribute');
    var child = document.createElement('div');
    Polymer.dom(parent).appendChild(child);
    var before = document.createElement('div');
    var after = document.createElement('div');
    Polymer.dom(parent).insertBefore(before, child);
    Polymer.dom(parent).appendChild(after);
    assert.equal(Polymer.dom(parent).firstElementChild, before, 'firstElementChild incorrect');
    assert.equal(Polymer.dom(parent).lastElementChild, after, 'lastElementChild incorrect');
    assert.equal(Polymer.dom(before).nextElementSibling, child, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(child).nextElementSibling, after, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(after).previousElementSibling, child, 'previousElementSibling incorrect');
    assert.equal(Polymer.dom(child).previousElementSibling, before, 'previousElementSibling incorrect');
  });

  test('Polymer.dom element accessors (distribute)', function() {
    var parent = document.createElement('x-project');
    var child = document.createElement('div');
    Polymer.dom(parent).appendChild(child);
    var before = document.createElement('div');
    var after = document.createElement('div');
    Polymer.dom(parent).insertBefore(before, child);
    Polymer.dom(parent).appendChild(after);
    assert.equal(Polymer.dom(parent).firstElementChild, before, 'firstElementChild incorrect');
    assert.equal(Polymer.dom(parent).lastElementChild, after, 'lastElementChild incorrect');
    assert.equal(Polymer.dom(before).nextElementSibling, child, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(child).nextElementSibling, after, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(after).previousElementSibling, child, 'previousElementSibling incorrect');
    assert.equal(Polymer.dom(child).previousElementSibling, before, 'previousElementSibling incorrect');
  });

  test('Polymer.dom node accessors (empty logical tree)', function() {
    var element = document.createElement('x-simple');
    assert.equal(Polymer.dom(element).parentNode, null, 'parentNode incorrect');
    assert.equal(Polymer.dom(element).firstChild, null, 'firstChild incorrect');
    assert.equal(Polymer.dom(element).lastChild, null, 'lastChild incorrect');
    assert.equal(Polymer.dom(element).nextSibling, null, 'nextSibling incorrect');
    assert.equal(Polymer.dom(element).previousSibling, null, 'previousSibling incorrect');
    assert.equal(Polymer.dom(element).firstElementChild, null, 'firstElementChild incorrect');
    assert.equal(Polymer.dom(element).lastElementChild, null, 'lastElementChild incorrect');
    assert.equal(Polymer.dom(element).nextElementSibling, null, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(element).previousElementSibling, null, 'previousElementSibling incorrect');
  });

  test('Polymer.dom node accessors (unmanaged logical tree)', function() {
    var element = document.createElement('div');
    var child1 = document.createElement('div');
    var child2 = document.createElement('div');
    element.appendChild(child1);
    element.appendChild(child2);
    assert.equal(Polymer.dom(element).parentNode, null, 'parentNode incorrect');
    assert.equal(Polymer.dom(element).firstChild, child1, 'firstChild incorrect');
    assert.equal(Polymer.dom(element).lastChild, child2, 'lastChild incorrect');
    assert.equal(Polymer.dom(element).nextSibling, null, 'nextSibling incorrect');
    assert.equal(Polymer.dom(element).previousSibling, null, 'previousSibling incorrect');
    assert.equal(Polymer.dom(element).firstElementChild, child1, 'firstElementChild incorrect');
    assert.equal(Polymer.dom(element).lastElementChild, child2, 'lastElementChild incorrect');
    assert.equal(Polymer.dom(element).nextElementSibling, null, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(element).previousElementSibling, null, 'previousElementSibling incorrect');
  });

  test('Polymer.dom textContent', function() {
    var testElement = document.createElement('x-project');
    Polymer.dom(testElement).textContent = 'Hello World';
    assert.equal(Polymer.dom(testElement).textContent, 'Hello World', 'textContent getter incorrect');
    if (testElement.shadyRoot) {
      Polymer.dom.flush();
      assert.equal(Polymer.TreeApi.Composed.getChildNodes(testElement)[1].textContent, 'Hello World', 'text content setter incorrect');
    }
    testElement = document.createElement('x-commented');
    assert.equal(Polymer.dom(testElement.root).textContent, '[]', 'text content getter with comment incorrect');

    var textNode = document.createTextNode('foo');
    assert.equal(Polymer.dom(textNode).textContent, 'foo', 'text content getter on textnode incorrect');
    Polymer.dom(textNode).textContent = 'bar';
    assert.equal(textNode.textContent, 'bar', 'text content setter on textnode incorrect');

    var commentNode = document.createComment('foo');
    assert.equal(Polymer.dom(commentNode).textContent, 'foo', 'text content getter on commentnode incorrect');
    Polymer.dom(commentNode).textContent = 'bar';
    assert.equal(commentNode.textContent, 'bar', 'text content setter on commentnode incorrect');
  });

  test('Polymer.dom innerHTML', function() {
    var testElement = document.createElement('x-project');
    Polymer.dom(testElement).innerHTML = '<div>Hello World</div><div>2</div><div>3</div>';
    var added = Polymer.dom(testElement).firstChild;
    assert.equal(added.textContent , 'Hello World', 'innerHTML setter incorrect');
    assert.equal(Polymer.dom(testElement).innerHTML , '<div>Hello World</div><div>2</div><div>3</div>', 'innerHTML getter incorrect');
    if (testElement.shadyRoot) {
      Polymer.dom.flush();
      var children = Polymer.TreeApi.Composed.getChildNodes(testElement);
      assert.equal(children[1], added, 'innerHTML setter composed incorrectly');
      assert.equal(children[2].textContent, '2', 'innerHTML setter composed incorrectly');
      assert.equal(children[3].textContent, '3', 'innerHTML setter composed incorrectly');
    }
  });

  test('Polymer.dom innerHTML (non-composed)', function() {
    var testElement = document.createElement('div');
    document.body.appendChild(testElement);
    Polymer.dom(testElement).innerHTML = '<div>Hello World</div><div>2</div><div>3</div>';
    var added = Polymer.dom(testElement).firstChild;
    assert.equal(added.textContent , 'Hello World', 'innerHTML setter incorrect');
    assert.equal(Polymer.dom(testElement).innerHTML , '<div>Hello World</div><div>2</div><div>3</div>', 'innerHTML getter incorrect');
    assert.equal(testElement.children.length, 3);
  });

  suite('Polymer.dom activeElement', function() {
    var r;
      // light
        var r_l
      // shadow
        var r_0;
          // light
            var r_0_l;
          // shadow
            var r_0_0;
              // light
                var r_0_0_l;
                  // shadow
                    var r_0_0_l_0;
            var r_0_1;
              // light
                var r_0_1_l;
        var r_1;
          // light
            var r_1_l;
              // shadow
                var r_1_l_0;
          // shadow
            var r_1_0;
              // light
                var r_1_0_l;
            var r_1_1;
              // light
                var r_1_1_l;

    suiteSetup(function() {
      r = Polymer.dom(document).querySelector('x-shadow-host-root');
        r_l = Polymer.dom(r).querySelector('x-shadow-host-root-light');
        r_0 = Polymer.dom(r.root).querySelector('x-shadow-host-root-0');
          r_0_l = Polymer.dom(r_0).querySelector('x-shadow-host-root-0-light');
          r_0_0 = Polymer.dom(r_0.root).querySelector('x-shadow-host-root-0-0');
            r_0_0_l = Polymer.dom(r_0_0).querySelector('x-shadow-host-root-0-0-light');
              r_0_0_l_0 = Polymer.dom(r_0_0_l.root).querySelector('x-shadow-host-root-0-0-light-0');
          r_0_1 = Polymer.dom(r_0.root).querySelector('x-shadow-host-root-0-1');
            r_0_1_l = Polymer.dom(r_0_1).querySelector('x-shadow-host-root-0-1-light');
        r_1 = Polymer.dom(r.root).querySelector('x-shadow-host-root-1');
          r_1_l = Polymer.dom(r_1).querySelector('x-shadow-host-root-1-light');
            r_1_l_0 = Polymer.dom(r_1_l.root).querySelector('x-shadow-host-root-1-light-0');
          r_1_0 = Polymer.dom(r_1.root).querySelector('x-shadow-host-root-1-0');
            r_1_0_l = Polymer.dom(r_1_0).querySelector('x-shadow-host-root-1-0-light');
          r_1_1 = Polymer.dom(r_1.root).querySelector('x-shadow-host-root-1-1');
            r_1_1_l = Polymer.dom(r_1_1).querySelector('x-shadow-host-root-1-1-light');
    });

    test('r.focus()', function() {
      r.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, null, 'r.root.activeElement === null');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_l.focus()', function() {
      r_l.focus();

      assert.equal(Polymer.dom(document).activeElement, r_l, 'document.activeElement === r_l');
      assert.equal(Polymer.dom(r.root).activeElement, null, 'r.root.activeElement === null');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_0.focus()', function() {
      r_0.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_0_l.focus()', function() {
      r_0_l.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_0_l, 'r.root.activeElement === r_0_l');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');

      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_0_0.focus()', function() {
      r_0_0.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
      assert.equal(Polymer.dom(r_0.root).activeElement, r_0_0, 'r_0.root.activeElement === r_0_0');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_0_0_l.focus()', function() {
      r_0_0_l.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
      assert.equal(Polymer.dom(r_0.root).activeElement, r_0_0_l, 'r_0.root.activeElement === r_0_0_l');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_0_0_l_0.focus()', function() {
      r_0_0_l_0.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
      assert.equal(Polymer.dom(r_0.root).activeElement, r_0_0_l, 'r_0.root.activeElement === r_0_0_l');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0_l.root).activeElement, r_0_0_l_0, 'r_0_0_l.root.activeElement === r_0_0_l_0');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_0_1.focus()', function() {
      r_0_1.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
      assert.equal(Polymer.dom(r_0.root).activeElement, r_0_1, 'r_0.root.activeElement === r_0_1');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_0_1_l.focus()', function() {
      r_0_1_l.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
      assert.equal(Polymer.dom(r_0.root).activeElement, r_0_1_l, 'r_0.root.activeElement === r_0_1_l');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_1.focus()', function() {
      r_1.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_1_l.focus()', function() {
      r_1_l.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_1_l, 'r.root.activeElement === r_1_l');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_1_l_0.focus()', function() {
      r_1_l_0.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_1_l, 'r.root.activeElement === r_1_l');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_l.root).activeElement, r_1_l_0, 'r_1.root.activeElement === r_1_l_0');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_1_0.focus()', function() {
      r_1_0.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, r_1_0, 'r_1.root.activeElement === r_1_0');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_1_0_l.focus()', function() {
      r_1_0_l.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, r_1_0_l, 'r_1.root.activeElement === r_1_0_l');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_1_1.focus()', function() {
      r_1_1.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, r_1_1, 'r_1.root.activeElement === r_1_1');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('r_1_1_l.focus()', function() {
      r_1_1_l.focus();

      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, r_1_1_l, 'r_1.root.activeElement === r_1_1_l');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('setting activeElement on document has no effect', function() {
      r_1_1.focus();

      Polymer.dom(document).activeElement = "abc";
      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, r_1_1, 'r_1.root.activeElement === r_1_1');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });

    test('setting activeElement on a shadow root has no effect', function() {
      r_1_1.focus();

      Polymer.dom(r_1.root).activeElement = "abc";
      assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
      assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
      assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
      assert.equal(Polymer.dom(r_1.root).activeElement, r_1_1, 'r_1.root.activeElement === r_1_1');
      assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
      assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
    });
  });
});

suite('Polymer.dom non-distributed elements', function() {

  var nd;

  suiteSetup(function() {
    nd = document.querySelector('#noDistribute');
  });

  test('Polymer.dom finds undistributed child', function() {
    assert.ok(Polymer.dom(nd).children.length, 2, 'light children includes distributed and non-distributed nodes');
  });

  test('Polymer.dom removes/adds undistributed child', function() {
    var b = Polymer.dom(nd).children[0];
    assert.equal(Polymer.dom(b).getDestinationInsertionPoints().length, 0, 'element improperly distributed');
    Polymer.dom(nd).removeChild(b);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 1, 'children length not decremented due to element removal');
    Polymer.dom(nd).appendChild(b);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 2, 'children length not incremented due to element addition');
    var d = document.createElement('div');
    d.innerHTML = 'added';
    Polymer.dom(nd).insertBefore(d, b);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 3, 'children length not incremented due to element addition');
    Polymer.dom(nd).removeChild(d);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 2, 'children length not decremented due to element removal');
  });

  test('Polymer.dom removes/adds between light and local dom', function() {
    var b = Polymer.dom(nd).children[1];
    assert.equal(Polymer.dom(b).getDestinationInsertionPoints().length, 0, 'element improperly distributed');
    Polymer.dom(nd.root).appendChild(b);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 1, 'children length not decremented due to element removal');
    assert.equal(Polymer.dom(nd.root).children.length, 2, 'root children length not incremented due to element addition');
    Polymer.dom(nd).appendChild(b);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 2, 'children length not incremented due to element addition');
    assert.equal(Polymer.dom(nd.root).children.length, 1, 'root children length not decremented due to element removal');
  });

  test('distributeContent correctly distributes changes to light dom', function() {
    var shady = !Polymer.Settings.useShadow;
    function testNoAttr() {
      assert.equal(Polymer.dom(child).getDestinationInsertionPoints()[0], d.$.notTestContent, 'child not distributed logically');
      if (shady) {
        assert.equal(Polymer.TreeApi.Composed.getParentNode(child), d.$.notTestContainer, 'child not rendered in composed dom');
      }
    }
    function testWithAttr() {
      assert.equal(Polymer.dom(child).getDestinationInsertionPoints()[0], d.$.testContent, 'child not distributed logically');
      if (shady) {
        assert.equal(Polymer.TreeApi.Composed.getParentNode(child), d.$.testContainer, 'child not rendered in composed dom');
      }
    }
    // test with x-distribute
    var d = document.createElement('x-distribute');
    document.body.appendChild(d);
    var child = document.createElement('div');
    child.classList.add('child');
    child.textContent = 'Child';
    Polymer.dom(d).appendChild(child);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(d).children[0], child, 'child not added to logical dom');
    testNoAttr();
    // set / unset `test` attr and see if it distributes properly
    child.setAttribute('test', '');
    d.distributeContent();
    Polymer.dom.flush();
    testWithAttr();
    //
    child.removeAttribute('test');
    d.distributeContent();
    Polymer.dom.flush();
    testNoAttr();
    //
    child.setAttribute('test', '');
    d.distributeContent();
    Polymer.dom.flush();
    testWithAttr();
  });

  test('getOwnerRoot', function() {
    var test = document.createElement('div');
    var c1 = document.createElement('x-compose');
    var c2 = document.createElement('x-compose');
    Polymer.dom(c1.$.project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    Polymer.dom(c2.$.project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c2.root, 'getOwnerRoot not correctly reset when element moved to different root');
    Polymer.dom(c1).appendChild(test);
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect for child moved from a root to no root');
  });

  test('getOwnerRoot when out of tree', function() {
    var test = document.createElement('div');
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect when not in root');
    var c1 = document.createElement('x-compose');
    var project = c1.$.project;
    Polymer.dom(project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    Polymer.dom(project).removeChild(test);
    Polymer.dom.flush();
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect for child moved from a root to no root');
    Polymer.dom(project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
  });

  test('getOwnerRoot when out of tree and adding subtree', function() {
    var container = document.createDocumentFragment();
    var test = document.createElement('div');
    container.appendChild(test);
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect when not in root');
    var c1 = document.createElement('x-compose');
    var project = c1.$.project;
    Polymer.dom(project).appendChild(container);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    Polymer.dom(project).removeChild(test);
    Polymer.dom.flush();
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect for child moved from a root to no root');
    Polymer.dom(project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
  });

  test('getOwnerRoot, subtree', function() {
    var test = document.createElement('div');
    var testChild = document.createElement('div');
    test.appendChild(testChild);
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect when not in root');
    var c1 = document.createElement('x-compose');
    var project = c1.$.project;
    Polymer.dom(project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    assert.equal(Polymer.dom(testChild).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for sub-child added to element in root');
    Polymer.dom(project).removeChild(test);
    Polymer.dom.flush();
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect for child moved from a root to no root');
    assert.notOk(Polymer.dom(testChild).getOwnerRoot(), 'getOwnerRoot incorrect for sub-child moved from a root to no root');
    Polymer.dom(project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    assert.equal(Polymer.dom(testChild).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for sub-child added to element in root');
  });

  test('getOwnerRoot (paper-ripple use case)', function() {
    var test = document.createElement('div');
    // child
    var d = document.createElement('div');
    Polymer.dom(test).appendChild(d);
    var c1 = document.createElement('x-compose');
    var c2 = document.createElement('x-compose');
    Polymer.dom(c1.$.project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    Polymer.dom(c2.$.project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c2.root, 'getOwnerRoot not correctly reset when element moved to different root');
    Polymer.dom(c1).appendChild(test);
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect for child moved from a root to no root');
  });

  test('getDistributedNodes on non-content element', function() {
    assert.equal(Polymer.dom(document.createElement('div')).getDistributedNodes().length, 0);
        assert.equal(Polymer.dom().getDistributedNodes().length, 0);
  });

  test('getDestinationInsertionPoints on non-distributable element', function() {
    assert.equal(Polymer.dom(document.createElement('div')).getDestinationInsertionPoints().length, 0);
    assert.equal(Polymer.dom(document).getDestinationInsertionPoints().length, 0);
  });

  test('Deep Contains', function() {
    var el = document.querySelector('x-deep-contains');
    var shadow = el.$.shadowed;
    var light = Polymer.dom(el).querySelector('#light');
    var notdistributed = Polymer.dom(el).children[1];
    var disconnected = document.createElement('div');
    var separate = document.createElement('div');
    document.body.appendChild(separate);

    assert.equal(Polymer.dom(el).deepContains(el), true, 'Element should deepContain itself');
    assert.equal(Polymer.dom(el).deepContains(shadow), true, 'Shadowed Child element should be found');
    assert.equal(Polymer.dom(el).deepContains(light), true, 'Light Child element should be found');
    assert.equal(Polymer.dom(el).deepContains(notdistributed), true, 'Non-distributed child element should be found');
    assert.equal(Polymer.dom(el).deepContains(disconnected), false, 'Disconnected element should not be found');
    assert.equal(Polymer.dom(el).deepContains(separate), false, 'Unassociated, attached element should not be found');

    document.body.removeChild(separate);
  });

  test('Polymer.DomApi.wrap', function() {
    var wrap = window.wrap || function(node) { return node; };

    var node = document.querySelector('x-wrapped');
    assert.equal(wrap(document), Polymer.DomApi.wrap(document), 'document should be wrapped');
    assert.equal(wrap(node), Polymer.DomApi.wrap(node), 'node should be wrapped');
    assert.equal(wrap(node), Polymer.dom(node).node, 'Polymer.dom should always wrap the input node');
  });
});
