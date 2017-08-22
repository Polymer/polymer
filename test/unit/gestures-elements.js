import '../../polymer.js';
import { Polymer } from '../../lib/legacy/polymer-fn.js';
Polymer({
  _template: `
  <style>
    #div {
      height: 40px;
      background: red;
    }
  </style>

    <div id="div"></div>
`,

  is: 'x-foo',

  listeners: {
    tap: 'tapHandler'
  },

  tapHandler: function(e) {
    this._testLocalTarget = e.target;
    this._testRootTarget = e.composedPath()[0];
  }
});
Polymer({
  _template: `
    <x-foo id="foo"></x-foo>
`,

  is: 'x-app',

  listeners: {
    tap: 'tapHandler'
  },

  tapHandler: function(e) {
    this._testLocalTarget = e.target;
    this._testRootTarget = e.composedPath()[0];
  }
});
Polymer({
  _template: `
    <div id="inner" on-tap="handler" on-track="handler" on-down="handler" on-up="handler"></div>
`,

  is: 'x-setup',

  listeners: {
    tap: 'handler',
    track: 'handler',
    down: 'handler',
    up: 'handler'
  },

  handler: function() {
  }
});
Polymer({
  is: 'x-dynamic',
  handler: function(){},
  setup: function() {
    this.listen(this, 'tap', 'handler');
  },
  teardown: function() {
    this.unlisten(this, 'tap', 'handler');
  }
});
var EventCaptureBehavior = {
  properties: {
    stream: {
      type: Array,
      value: function() {
        return [];
      }
    }
  },
  handle: function(e) {
    this.stream.push(e);
  }
};
Polymer({
  listeners: {
    'down': 'prevent',
    'up': 'handle',
    'tap': 'handle',
    'track': 'handle'
  },
  behaviors: [EventCaptureBehavior],
  is: 'x-prevent',
  prevent: function(e, detail) {
    detail.prevent('tap');
    detail.prevent('track');
    e.preventDefault();
    this.handle(e);
  }
});
Polymer({
  is: 'x-buttons',
  listeners: {
    'down': 'handle',
    'up': 'handle',
    'tap': 'handle',
    'track': 'handle'
  },
  behaviors: [EventCaptureBehavior]
});
Polymer({
  is: 'x-document-listener',
  setup: function() {
    this.listen(document, 'down', 'handle');
  },
  teardown: function() {
    this.unlisten(document, 'down', 'handle');
  },
  behaviors: [EventCaptureBehavior]
});
Polymer({
  is: 'x-nested-child-prevent',
  listeners: {
    tap: 'handle'
  },
  behaviors: [EventCaptureBehavior]
});
Polymer({
  _template: `
    <style>
      :host {
        position: absolute;
        display: block;
        background: orange;
        height: 100px;
        width: 100px;
      }
      #child {
        position: relative;
        display: block;
        background: blue;
        height: 50px;
        width: 50px;
        margin-top: 25px;
        margin-left: 25px;
      }
    </style>
    <x-nested-child-prevent id="child"></x-nested-child-prevent>
`,

  is: 'x-nested-prevent',

  listeners: {
    track: 'handle'
  },

  behaviors: [EventCaptureBehavior]
});
Polymer({
  is: 'x-imperative',
  behaviors: [EventCaptureBehavior]
});
