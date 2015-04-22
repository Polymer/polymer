suite('Polymer.dom', function() {

  test('querySelector (local)', function() {
    var test = document.querySelector('x-test');
    var projected = Polymer.dom(test.root).querySelector('#projected');
    assert.equal(projected.textContent, 'projected');
    var p2 = Polymer.dom(test).querySelector('#projected');
    assert.notOk(p2);
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    assert.equal(rere.is, 'x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    assert.equal(re.is, 'x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(p.is, 'x-project');
  });

  test('querySelectorAll (local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
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
    var test = document.querySelector('x-test');
    var projected = Polymer.dom(test.root).querySelector('#projected');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(Polymer.dom(rere).querySelector('#projected'), projected);
    assert(Polymer.dom(re).querySelector('content'));
    assert(Polymer.dom(p).querySelector('content'));
  });

  test('querySelectorAll (light)', function() {
    var test = document.querySelector('x-test');
    var projected = Polymer.dom(test.root).querySelector('#projected');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(Polymer.dom(rere).querySelectorAll('#projected')[0], projected);
    assert(Polymer.dom(re).querySelectorAll('content').length, 1);
    assert(Polymer.dom(p).querySelectorAll('content').length, 1);
  });

  test('projection', function() {
    var test = document.querySelector('x-test');
    var projected = Polymer.dom(test.root).querySelector('#projected');
    assert.equal(projected.textContent, 'projected');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
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
    var test = document.querySelector('x-test');
    test._distributionClean = false;
    test._distributeContent();
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    assert.equal(rere.is, 'x-rereproject');
    rere._distributionClean = false;
    rere._distributeContent();
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    assert.equal(re.is, 'x-reproject');
    re._distributionClean = false;
    re._distributeContent();
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(p.is, 'x-project');
  });

  test('appendChild (light)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    var s = document.createElement('span');
    s.id = 'added';
    s.textContent = 'Added';
    Polymer.dom(rere).appendChild(s);
    assert.equal(Polymer.dom(test.root).querySelector('#added'), s);
  });

  test('insertBefore (light)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    var ref = Polymer.dom(test.root).querySelector('#added');
    var s = document.createElement('span');
    s.id = 'added2';
    s.textContent = 'Added2';
    Polymer.dom(rere).insertBefore(s, ref);
    assert.equal(Polymer.dom(test.root).querySelector('#added2'), s);
  });

  test('removeChild (light)', function() {
    var test = document.querySelector('x-test');
    var added = Polymer.dom(test.root).querySelector('#added');
    var added2 = Polymer.dom(test.root).querySelector('#added2');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    assert.equal(Polymer.dom(test.root).querySelectorAll('*').length, 4);
    Polymer.dom(rere).removeChild(added);
    Polymer.dom(rere).removeChild(added2);
    assert.equal(Polymer.dom(test.root).querySelectorAll('*').length, 2);
  });

  test('appendChild (local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    var s = document.createElement('span');
    s.id = 'local';
    s.textContent = 'Local';
    Polymer.dom(rere.root).appendChild(s);
    assert.equal(Polymer.dom(rere.root).querySelector('#local'), s);
  });

  test('insertBefore (local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    var ref = Polymer.dom(test.root).querySelector('#local');
    var s = document.createElement('span');
    s.id = 'local2';
    s.textContent = 'Local2';
    Polymer.dom(rere.root).insertBefore(s, ref);
    assert.equal(Polymer.dom(rere.root).querySelector('#local2'), s);
  });

  test('removeChild (local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    var local = Polymer.dom(rere.root).querySelector('#local');
    var local2 = Polymer.dom(rere.root).querySelector('#local2');
    Polymer.dom(rere.root).removeChild(local);
    Polymer.dom(rere.root).removeChild(local2);
    assert.equal(Polymer.dom(rere.root).querySelectorAll('#local').length, 0);
  });

  test('localDom.insertBefore first element results in minimal change', function() {
    var test = document.querySelector('x-test');
    var children = Polymer.dom(test.root).childNodes;
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    assert.equal(rere.attachedCount, 1);
    var s = document.createElement('span');
    s.id = 'local-first';
    s.textContent = 'Local First';
    Polymer.dom(test.root).insertBefore(s, children[0]);
    assert.equal(Polymer.dom(test.root).querySelector('#local-first'), s);
    assert.equal(rere.attachedCount, 1);
    Polymer.dom(test.root).removeChild(s);
    assert.equal(rere.attachedCount, 1);
  });

  test('appendChild (fragment, local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
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
    for (var i=0; i < added.length; i++) {
      Polymer.dom(rere.root).removeChild(added[i]);
    }
    assert.equal(Polymer.dom(rere.root).querySelectorAll('span').length, 0);
  });

  test('insertBefore (fragment, local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
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
    for (var i=0; i < added.length; i++) {
      Polymer.dom(rere.root).removeChild(added[i]);
    }
    assert.equal(Polymer.dom(rere.root).querySelectorAll('span').length, 0);
  });

  test('distribute (forced)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var s = document.createElement('span');
    s.id = 'light';
    s.textContent = 'Light';
    Polymer.dom(rere).appendChild(s);
    assert.equal(Polymer.dom(rere).querySelector('#light'), s);
    assert.equal(Polymer.dom(s).parentNode, rere);
    if (rere.shadyRoot) {
      assert.notEqual(s.parentNode, rere);
    }
    Polymer.dom(test).flush();
    if (rere.shadyRoot) {
      assert.equal(s.parentNode, p);
    }
    Polymer.dom(rere).removeChild(s);
    if (rere.shadyRoot) {
      assert.equal(s.parentNode, p);
    }
    Polymer.dom(test).flush();
    if (rere.shadyRoot) {
      assert.equal(s.parentNode, null);
    }
  });

  test('parentNode', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    var projected = Polymer.dom(test.root).querySelector('#projected');
    assert.equal(Polymer.dom(test).parentNode, wrap(document.body));
    assert.equal(Polymer.dom(projected).parentNode, rere);
  });

  test('queryDistributedElements', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var projected = Polymer.dom(test.root).querySelector('#projected');
    var d$ = Polymer.dom(p.root).queryDistributedElements('*');
    assert.equal(d$.length, 1);
    assert.equal(d$[0], projected);

  });

  test('Polymer.dom.querySelector', function() {
    var test = Polymer.dom().querySelector('x-test');
    var rere = Polymer.dom().querySelector('x-rereproject');
    var projected = Polymer.dom().querySelector('#projected');
    assert.ok(test);
    assert.notOk(rere);
    assert.notOk(projected);
  });

  test('Polymer.dom event', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom(test.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var eventHandled = 0;
    test.addEventListener('test-event', function(e) {
      eventHandled++;
      assert.equal(Polymer.dom(e).rootTarget, p);
      assert.equal(Polymer.dom(e).localTarget, test);
      var path = Polymer.dom(e).path;
      // path includes window only on more recent Shadow DOM implementations
      // account for that here.
      assert.ok(path.length >= 10);
      assert.equal(path[0], p);
      assert.equal(path[2], re);
      assert.equal(path[4], rere);
      assert.equal(path[6], test);
    });

    rere.addEventListener('test-event', function(e) {
      eventHandled++;
      assert.equal(Polymer.dom(e).localTarget, rere);
    });

    p.fire('test-event');
    assert.equal(eventHandled, 2);
  });

  test('Polymer.dom.childNodes is an array', function() {
    assert.isTrue(Array.isArray(Polymer.dom(document.body).childNodes));
  });

});

suite('Polymer.dom non-distributed elements', function() {

  var nd;

  before(function() {
    nd = document.querySelector('x-test-no-distribute');
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
        assert.equal(child.parentNode, d.$.notTestContainer, 'child not rendered in composed dom');
      }
    }
    function testWithAttr() {
      assert.equal(Polymer.dom(child).getDestinationInsertionPoints()[0], d.$.testContent, 'child not distributed logically');
      if (shady) {
        assert.equal(child.parentNode, d.$.testContainer, 'child not rendered in composed dom');
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
    testWithAttr();
    //
    child.removeAttribute('test');
    d.distributeContent();
    testNoAttr();
    //
    child.setAttribute('test', '');
    d.distributeContent();
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

});