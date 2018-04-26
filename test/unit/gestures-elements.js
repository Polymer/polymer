/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Polymer } from '../../lib/legacy/polymer-fn.js';
import { html } from '../../lib/utils/html-tag.js';
import { PolymerElement } from '../../polymer-element.js';
import { GestureEventListeners } from '../../lib/mixins/gesture-event-listeners.js';
Polymer({
  _template: html`
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
  _template: html`
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
  _template: html`
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
  _template: html`
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
class XNativeLabel extends PolymerElement {
  static get template() {
    return html`
    <label id="label" for="check"></label>
    <input id="check" type="checkbox">
`;
  }

  static get is() {
    return 'x-native-label';
  }
}
customElements.define(XNativeLabel.is, XNativeLabel);
class XNativeLabelNested extends PolymerElement {
  static get template() {
    return html`
    <label id="label">
      <input id="check" type="checkbox">
    </label>
`;
  }

  static get is() {
    return 'x-native-label-nested';
  }
}
customElements.define(XNativeLabelNested.is, XNativeLabelNested);
class XDisabled extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
    <button id="disabled" on-tap="tap" disabled=""></button>
    <div disabled="">
      <button id="nested" on-tap="tap"></button>
    </div>
`;
  }

  constructor() {
    super();
    this.taps = [];
  }
  static get is() {return 'x-disabled-tap';}
  tap(e) {
    this.taps.push(e.id);
  }
}
customElements.define(XDisabled.is, XDisabled);
