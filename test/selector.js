/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('g-selector', function() {
  var selector;
  
  setup(function() {
    selector = document.createElement('g-selector');
    work.appendChild(selector);
  });
  
  teardown(function() {
    work.textContent = '';
  });
  
  function addItems(inNum) {
    for (var i=0; i<inNum; i++) {
      selector.appendChild(document.createElement('div')).textContent = 'item' + i;
    }
    ShadowDOM.distribute(selector);
  }
  
  test('getItems', function() {
    addItems(4);
    expect(selector.items).to.have.length(4);
  });
  
  test('item textContent', function() {
    addItems(4);
    selector.items.forEach(function(item, i) {
      expect(item.textContent).to.be('item'+i);
    });
  });
  
  suite('attributes', function() {
    test('selected', function() {
      addItems(4);
      selector.selected = 2;
      expect(selector.items[2].className).to.be('selected');
    });
    
    test('multi', function(done) {
      addItems(4);
      selector.multi = true;
      setTimeout(function() {
        selector.selected = 0;
        selector.selected = 1;
        expect(selector.selection.length).to.be(2);
        expect(selector.items[0].className).to.be('selected');
        expect(selector.items[1].className).to.be('selected');
        done();
      }, 0);
    });
  });
});
