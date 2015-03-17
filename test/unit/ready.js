suite('ready', function() {

  var configure = ['x-ready', 'x-zot#a', 'x-zot#b', 'x-zot#c', 'x-zot#d', 'x-foo#foo', 'x-bar#bar1', 'x-zot', 'x-bar#bar2', 'x-zot'];
  var ready = ['x-zot#a', 'x-zot#b', 'x-zot#c', 'x-zot#d', 'x-zot', 'x-bar#bar1', 'x-zot', 'x-bar#bar2', 'x-foo#foo', 'x-ready'];

  test('element create in dom calls configure/ready/attached in proper order', function() {
    assert.deepEqual(configureList, configure);
    assert.deepEqual(readyList, ready);
  });

  test('element create + attach calls configure/ready/attached in proper order', function() {
    clearTestLists();
    document.body.appendChild(document.createElement('x-ready'));
    CustomElements.takeRecords(document);
    assert.deepEqual(configureList, configure);
    assert.deepEqual(readyList, ready);
  });

  test('element.host set/unset via attach/detach', function() {
    clearTestLists();
    var xReady = document.body.appendChild(document.createElement('x-ready'));
    CustomElements.takeRecords(document);
    document.body.removeChild(xReady);
    CustomElements.takeRecords(document);
    assert.notOk(xReady.host);
    assert.notOk(xReady.$.a.host);
    assert.notOk(xReady.$.foo.host);
    assert.notOk(xReady.$.foo.$.bar1.host);
    document.body.appendChild(xReady);
    CustomElements.takeRecords(document);
    assert.notOk(xReady.host);
    assert.equal(xReady.$.a.host, xReady);
    assert.equal(xReady.$.foo.host, xReady);
    assert.equal(xReady.$.foo.$.bar1.host, xReady.$.foo);
  });

});
