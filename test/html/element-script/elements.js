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
  }
});
