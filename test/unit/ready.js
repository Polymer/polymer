suite('ready', function() {

  var configure = ['x-ready', 'x-zot#a', 'x-zot#b', 'x-zot#c', 'x-zot#d', 'x-foo', 'x-bar', 'x-zot', 'x-bar', 'x-zot'];
  var ready = ['x-zot#a', 'x-zot#b', 'x-zot#c', 'x-zot#d', 'x-zot', 'x-bar', 'x-zot', 'x-bar', 'x-foo', 'x-ready'];

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

});
