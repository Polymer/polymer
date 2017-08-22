import { Polymer } from '../../lib/legacy/polymer-fn.js';
Polymer({
  is: 'x-needs-host',
  attached: function() {
    if (!this.__dataHost) {
      throw "No dataHost at ready time";
    }
    this.config = this.__dataHost.getAttribute('config');
  }
});
