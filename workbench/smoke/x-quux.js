Polymer('x-quux', {
  ready: function() {
    this.style.fontSize = '24px';
    // don't call super() on purpose
  },
  parseElements: function() {
    this.parseElement(this.element);
  }
});
