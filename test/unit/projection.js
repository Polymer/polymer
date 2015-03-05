suite('projection', function() {

  function getDestinationInsertionPoints(node) {
    return node._destinationInsertionPoints || 
      Array.prototype.slice.call(node.getDestinationInsertionPoints(), 0);
  }

  function getDistributedNodes(node) {
    return node._distributedNodes || 
      Array.prototype.slice.call(node.getDistributedNodes(), 0);
  }


  test('querySelector (local)', function() {
    var test = document.querySelector('x-test');
    var projected = Polymer.dom.querySelector('#projected', test.root);
    assert.equal(projected.textContent, 'projected');
    var p2 = Polymer.dom.querySelector('#projected', test);
    assert.notOk(p2);
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    assert.equal(rere.is, 'x-rereproject');
    var re = Polymer.dom.querySelector('x-reproject', rere.root);
    assert.equal(re.is, 'x-reproject');
    var p = Polymer.dom.querySelector('x-project', re.root);
    assert.equal(p.is, 'x-project');
  });

  test('querySelectorAll (local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var re = Polymer.dom.querySelector('x-reproject', rere.root);
    var p = Polymer.dom.querySelector('x-project', re.root);
    var rereList = Polymer.dom.querySelectorAll('*', rere.root);
    assert.include(rereList, re);
    assert.equal(rereList.length, 2);
    var reList = Polymer.dom.querySelectorAll('*', re.root);
    assert.include(reList, p);
    assert.equal(reList.length, 2);
    var pList = Polymer.dom.querySelectorAll('*', p.root);
    assert.equal(pList.length, 1);
  });

  test('querySelector (light)', function() {
    var test = document.querySelector('x-test');
    var projected = Polymer.dom.querySelector('#projected', test.root);
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var re = Polymer.dom.querySelector('x-reproject', rere.root);
    var p = Polymer.dom.querySelector('x-project', re.root);
    assert.equal(Polymer.dom.querySelector('#projected', rere), projected);
    assert(Polymer.dom.querySelector('content', re));
    assert(Polymer.dom.querySelector('content', p));
  });

  test('querySelectorAll (light)', function() {
    var test = document.querySelector('x-test');
    var projected = Polymer.dom.querySelector('#projected', test.root);
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var re = Polymer.dom.querySelector('x-reproject', rere.root);
    var p = Polymer.dom.querySelector('x-project', re.root);
    assert.equal(Polymer.dom.querySelectorAll('#projected', rere)[0], projected);
    assert(Polymer.dom.querySelectorAll('content', re).length, 1);
    assert(Polymer.dom.querySelectorAll('content', p).length, 1);
  });

  // test('querySelectorAllComposed', function() {
  //   var test = document.querySelector('x-test');
  //   var projected = Polymer.dom.querySelector('#projected', test.root);
  //   var rere = Polymer.dom.querySelector('x-rereproject', test.root);
  //   var re = Polymer.dom.querySelector('x-reproject', rere.root);
  //   var p = Polymer.dom.querySelector('x-project', re.root);
  //   assert.equal(rere.querySelectorAllComposed('#projected')[0], projected);
  //   assert.equal(re.querySelectorAllComposed('#projected')[0], projected);
  //   assert.equal(p.querySelectorAllComposed('#projected')[0], projected);
  // });


  test('projection', function() {
    var test = document.querySelector('x-test');
    var projected = Polymer.dom.querySelector('#projected', test.root);
    assert.equal(projected.textContent, 'projected');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    assert.equal(rere.is, 'x-rereproject');
    var re = Polymer.dom.querySelector('x-reproject', rere.root);
    assert.equal(re.is, 'x-reproject');
    var p = Polymer.dom.querySelector('x-project', re.root);
    assert.equal(p.is, 'x-project');
    var c1 = Polymer.dom.querySelector('content', rere.root);
    assert.include(Polymer.dom.distributedNodes(c1), projected);
    var c2 = Polymer.dom.querySelector('content', re.root);
    assert.include(Polymer.dom.distributedNodes(c2), projected);
    var c3 = Polymer.dom.querySelector('content', p.root);
    assert.include(Polymer.dom.distributedNodes(c3), projected);
    var ip$ = [c1, c2, c3];
    assert.deepEqual(Polymer.dom.destinationInsertionPoints(projected), ip$);
  });

  test('distributeContent', function() {
    var test = document.querySelector('x-test');
    test._distributionClean = false;
    test._distributeContent();
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    assert.equal(rere.is, 'x-rereproject');
    rere._distributionClean = false;
    rere._distributeContent();
    var re = Polymer.dom.querySelector('x-reproject', rere.root);
    assert.equal(re.is, 'x-reproject');
    re._distributionClean = false;
    re._distributeContent();
    var p = Polymer.dom.querySelector('x-project', re.root);
    assert.equal(p.is, 'x-project');
  });

  test('appendChild (light)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var s = document.createElement('span');
    s.id = 'added';
    s.textContent = 'Added';
    Polymer.dom.appendChild(s, rere);
    assert.equal(Polymer.dom.querySelector('#added', test.root), s);
  });

  test('insertBefore (light)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var ref = Polymer.dom.querySelector('#added', test.root);
    var s = document.createElement('span');
    s.id = 'added2';
    s.textContent = 'Added2';
    Polymer.dom.insertBefore(s, ref, rere);
    assert.equal(Polymer.dom.querySelector('#added2', test.root), s);
  });

  test('removeChild (light)', function() {
    var test = document.querySelector('x-test');
    var added = Polymer.dom.querySelector('#added', test.root);
    var added2 = Polymer.dom.querySelector('#added2', test.root);
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    assert.equal(Polymer.dom.querySelectorAll('*', test.root).length, 4);
    Polymer.dom.removeChild(added, rere);
    Polymer.dom.removeChild(added2, rere);
    assert.equal(Polymer.dom.querySelectorAll('*', test.root).length, 2);
  });

  test('appendChild (local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var s = document.createElement('span');
    s.id = 'local';
    s.textContent = 'Local';
    Polymer.dom.appendChild(s, rere.root);
    assert.equal(Polymer.dom.querySelector('#local', rere.root), s);
  });

  test('insertBefore (local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var ref = Polymer.dom.querySelector('#local', test.root);
    var s = document.createElement('span');
    s.id = 'local2';
    s.textContent = 'Local2';
    Polymer.dom.insertBefore(s, ref, rere.root);
    assert.equal(Polymer.dom.querySelector('#local2', rere.root), s);
  });

  test('removeChild (local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var local = Polymer.dom.querySelector('#local', rere.root);
    var local2 = Polymer.dom.querySelector('#local2', rere.root);
    Polymer.dom.removeChild(local, rere.root);
    Polymer.dom.removeChild(local2, rere.root);
    assert.equal(Polymer.dom.querySelectorAll('#local', rere.root).length, 0);
  });

  test('localDom.insertBefore first element results in minimal change', function() {
    var test = document.querySelector('x-test');
    var children = Polymer.dom.childNodes(test.root);
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    assert.equal(rere.attachedCount, 1);
    var s = document.createElement('span');
    s.id = 'local-first';
    s.textContent = 'Local First';
    Polymer.dom.insertBefore(s, children[0], test.root);
    assert.equal(Polymer.dom.querySelector('#local-first', test.root), s);
    assert.equal(rere.attachedCount, 1);
    Polymer.dom.removeChild(s, test.root);
    assert.equal(rere.attachedCount, 1);
  });

  test('appendChild (fragment, local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var fragment = document.createDocumentFragment();
    var childCount = 5;
    for (var i=0; i < childCount; i++) {
      var s = document.createElement('span');
      s.textContent = i; 
      fragment.appendChild(s);
    }
    Polymer.dom.appendChild(fragment, rere.root);
    var added = Polymer.dom.querySelectorAll('span', rere.root);
    assert.equal(added.length, childCount);
    for (var i=0; i < added.length; i++) {
      Polymer.dom.removeChild(added[i], rere.root);
    }
    assert.equal(Polymer.dom.querySelectorAll('span', rere.root).length, 0);
  });

  test('insertBefore (fragment, local)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var fragment = document.createDocumentFragment();
    var childCount = 5;
    for (var i=0; i < childCount; i++) {
      var s = document.createElement('span');
      s.textContent = i; 
      fragment.appendChild(s);
    }
    var l = document.createElement('span');
    l.textContent = 'last';
    Polymer.dom.appendChild(l, rere.root);
    Polymer.dom.insertBefore(fragment, l, rere.root);
    var added = Polymer.dom.querySelectorAll('span', rere.root);
    assert.equal(added.length, childCount+1);
    assert.equal(added[added.length-1], l);
    for (var i=0; i < added.length; i++) {
      Polymer.dom.removeChild(added[i], rere.root);
    }
    assert.equal(Polymer.dom.querySelectorAll('span', rere.root).length, 0);
  });

  test('distribute (forced)', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var re = Polymer.dom.querySelector('x-reproject', rere.root);
    var p = Polymer.dom.querySelector('x-project', re.root);
    var s = document.createElement('span');
    s.id = 'light';
    s.textContent = 'Light';
    Polymer.dom.appendChild(s, rere);
    assert.equal(Polymer.dom.querySelector('#light', rere), s);
    assert.equal(Polymer.dom.elementParent(s), rere);
    if (rere.shadyRoot) {
      assert.notEqual(s.parentNode, rere);
    }
    Polymer.dom.flush();
    if (rere.shadyRoot) {
      assert.equal(s.parentNode, p);
    }
    Polymer.dom.removeChild(s, rere);
    if (rere.shadyRoot) {
      assert.equal(s.parentNode, p);
    }
    Polymer.dom.flush();
    if (rere.shadyRoot) {
      assert.equal(s.parentNode, null);
    }
  });

  test('elementParent', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var projected = Polymer.dom.querySelector('#projected', test.root);
    assert.equal(Polymer.dom.elementParent(test), wrap(document.body));
    assert.equal(Polymer.dom.elementParent(projected), rere);
  });

  test('distributedElements', function() {
    var test = document.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject', test.root);
    var re = Polymer.dom.querySelector('x-reproject', rere.root);
    var p = Polymer.dom.querySelector('x-project', re.root);
    var projected = Polymer.dom.querySelector('#projected', test.root);
    var d$ = Polymer.dom.distributedElements(p.root);
    assert.equal(d$.length, 1);
    assert.equal(d$[0], projected);

  });

  test('Polymer.dom.querySelector', function() {
    var test = Polymer.dom.querySelector('x-test');
    var rere = Polymer.dom.querySelector('x-rereproject');
    var projected = Polymer.dom.querySelector('#projected');
    assert.ok(test);
    assert.notOk(rere);
    assert.notOk(projected);
  });

});
