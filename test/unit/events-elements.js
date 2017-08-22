import { Base } from '../../polymer.js';
import { Polymer } from '../../lib/legacy/polymer-fn.js';
var EventLoggerImpl = {
  created: function() {
    this._handled = {};
    this._removed = [];
  },
  handle: function(e) {
    this._handled[e.currentTarget.localName] = e.type;
  },
  unlisten: function(node, eventName, handler) {
    this._removed.push({target: node.localName, event: eventName});
    Base.unlisten.call(this, node, eventName, handler);
  }
};
Polymer({
  is: 'x-listeners',
  behaviors: [EventLoggerImpl],
  listeners: {
    foo: 'handle',
    bar: 'missing'
  }
});
Polymer({
  _template: `
    <div id="inner" on-foo="handle" on-bar="missing"></div>
`,

  is: 'x-on',
  behaviors: [EventLoggerImpl]
});
Polymer({
  _template: `
    <div id="inner"></div>
`,

  is: 'x-dynamic',
  behaviors: [EventLoggerImpl],

  setup: function() {
    this.listen(this, 'foo', 'handle');
    this.listen(this.$.inner, 'foo', 'handle');
    this.listen(this, 'bar', 'missing');
    this.listen(this.$.inner, 'bar', 'missing');
  },

  teardown: function() {
    this.unlisten(this, 'foo', 'handle');
    this.unlisten(this.$.inner, 'foo', 'handle');
    this.unlisten(this, 'bar', 'missing');
    this.unlisten(this.$.inner, 'bar', 'missing');
  }
});
Polymer({
  is: 'x-double',
  behaviors: [EventLoggerImpl],
  ready: function() {
    this.fooChanged = sinon.spy();
  },
  setup: function() {
    this.listen(this, 'foo', 'fooChanged');
    this.listen(this, 'foo', 'fooChanged');
  },
  teardown: function() {
    this.unlisten(this, 'foo', 'fooChanged');
  }
});
