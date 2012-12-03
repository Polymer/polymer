/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('g-menu', function() {
  var menu;
  
  setup(function() {
    menu = document.createElement('g-menu');
    work.appendChild(menu);
  });
  
  teardown(function() {
    work.textContent = '';
  });
  
  function addItems(inNum) {
    for (var i = 0; i < inNum; i++) {
      var item = document.createElement('g-menu-item');
      item.textContent = 'item' + i;
      menu.appendChild(item);
    }
    ShadowDOM.distribute(menu);
  }
  
  test('items', function() {
    addItems(4);
    expect(menu.items).to.have.length(4);
  });
  
  test('item content', function() {
    addItems(4);
    Array.prototype.forEach.call(menu.items, function(item, i) {
      expect(item.textContent).to.be('item' + i);
    });
  });
  
  test('selection', function() {
    addItems(4);
    menu.selected = 2;
    expect(menu.selection).to.be(menu.items[2]); 
  });
  
  test('click item', function(done) {
    addItems(4);
    menu.items[2].click();
    async(function() {
      expect(menu.selected).to.be(2);
      done();
    });
  });
  
  suite('attributes', function() {
    test('selected', function() {
      addItems(4);
      menu.selected = 2;
      expect(menu.items[2].className).to.be('selected');
    });
    
    test('multi', function(done) {
      addItems(4);
      menu.multi = true;
      async(function() {
        menu.selected = 0;
        menu.selected = 1;
        expect(menu.items[0].className).to.be('selected');
        expect(menu.items[1].className).to.be('selected');
        done();
      });
    });
  });
});
