Polymer('x-foo', {
  ready: function() {
    this.style.color = 'blue';
  }
});

Polymer('x-bar', {
  ready: function() {
    this.style.padding = '4px';
    this.style.backgroundColor = 'orange';
    this.super();
  },
  parseElement: function() {
    this.webkitCreateShadowRoot().appendChild(document.createElement('content'));
    this.textContent = 'Override!';
  }
});
