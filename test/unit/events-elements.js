/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { Base } from '../../polymer-legacy.js';

import { Polymer } from '../../lib/legacy/polymer-fn.js';
import { html } from '../../lib/utils/html-tag.js';
var EventLoggerImpl = {
  created: function() {
    this._handled = {};
    this._removed = [];
  },
  handle: function(e) {
    const order = e._handleOrder = e._handleOrder || [];
    order.push(this.localName);
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
  _template: html`
    <div id="inner" on-foo="handle" on-bar="missing"></div>
`,

  is: 'x-on',
  behaviors: [EventLoggerImpl]
});
Polymer({
  _template: html`
      <x-listeners id="inner" on-foo="handle"></x-listeners>
`,

  is: 'x-order',
  behaviors: [EventLoggerImpl]
});
Polymer({
  _template: html`
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
