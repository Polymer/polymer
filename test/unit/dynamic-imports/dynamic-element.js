import '../../../polymer.js';
import { Polymer } from '../../../lib/legacy/polymer-fn.js';
import { dom } from '../../../lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <span id="content">dynamic-element</span> :
`,

  is: 'dynamic-element',

  ready: function() {
    var url = this.resolveUrl('outer-element.html');
    this.importHref(url, function() {
      this.$.outer = document.createElement('outer-element');
      dom(this.root).appendChild(this.$.outer);
      this._hasContent = true;
      if (this._callback) {
        this._callback();
      }
    }, function() {
      assert.fail('failed to load import', url);
    });
  },

  whenDynamicContentReady: function(callback) {
    this._callback = callback;
    if (this._hasContent) {
      this._callback();
    }
  }
});
