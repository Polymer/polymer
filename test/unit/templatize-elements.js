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

import { templatize } from '../../lib/utils/templatize.js';
import { Templatizer } from '../../lib/legacy/templatizer-behavior.js';
import { html } from '../../lib/utils/html-tag.js';

Polymer({
  is: 'x-child',
  properties: {
    outerProp: {
      notify: true
    },
    outerObj: {
      notify: true
    },
    outerObjProp: {
      notify: true
    },
    prop: {
      notify: true
    },
    obj: {
      notify: true
    },
    objProp: {
      notify: true
    },
    outerInnerConflict: {
      notify: true
    }
  },
  observers: [
    'objChanged(obj.*)',
    'outerObjChanged(outerObj.*)'
  ],
  objChanged: function() {},
  outerObjChanged: function() {}
});

Polymer({
  is: 'x-templatize',
  properties: {
    obj: {
      notify: true
    },
    prop: {
      notify: true,
      observer: 'propChanged'
    }
  },
  observers: [
    'objChanged(obj.*)'
  ],
  propChanged: function(value) {
    if (this.instance) {
      this.instance.prop = value;
    }
  },
  objChanged: function(info) {
    if (this.instance) {
      this.instance.notifyPath(info.path, info.value);
    }
  },
  go: function(withProps) {
    var template = this.querySelector('template');
    var ctor = templatize(template, this, {
      parentModel: true,
      instanceProps: {
        obj: true,
        prop: true,
        outerInnerConflict: true
      },
      forwardHostProp: function(prop, value) {
        if (this.instance) {
          this.instance.forwardHostProp(prop, value);
        }
      },
      notifyInstanceProp: function(inst, prop, value) {
        // notify path on host (set won't work since it dirty checks)
        this.notifyPath(prop, value);
      }
    });
    this.instance = new ctor(
      withProps ? {
        obj: this.obj,
        prop: this.prop,
        outerInnerConflict: {
          prop: 'bar'
        }
      } : null);
    this.parentNode.appendChild(this.instance.root);
  }
});

Polymer({
  is: 'x-templatize-behavior',
  properties: {
    obj: {
      notify: true
    },
    prop: {
      notify: true,
      observer: 'propChanged'
    }
  },
  observers: [
    'objChanged(obj.*)'
  ],
  behaviors: [Templatizer],
  propChanged: function(value) {
    if (this.instance) {
      this.instance.prop = value;
    }
  },
  objChanged: function(info) {
    if (this.instance) {
      this.instance.notifyPath(info.path, info.value);
    }
  },
  _parentModel: true,
  _instanceProps: {
    obj: true,
    prop: true,
    outerInnerConflict: true
  },
  _forwardHostPropV2: function(prop, value) {
    if (this.instance) {
      this.instance.forwardHostProp(prop, value);
    }
  },
  _notifyInstancePropV2: function(inst, prop, value) {
    // notify path on host (set won't work since it dirty checks)
    this.notifyPath(prop, value);
  },
  go: function(withProps) {
    var template = this.querySelector('template');
    this.templatize(template);
    this.instance = this.stamp(
      withProps ? {
        obj: this.obj,
        prop: this.prop,
        outerInnerConflict: {
          prop: 'bar'
        }
      } : null);
    this.parentNode.appendChild(this.instance.root);
  }
});

Polymer({
  _template: html`
    <x-templatize obj="{{objA}}" prop="{{propA}}" id="templatizeA">
      <template>
        <x-child on-tap="handleTap" id="childA" outer-prop="{{outerProp}}" outer-obj="{{outerObj}}" outer-obj-prop="{{outerObj.prop}}" prop="{{prop}}" obj="{{obj}}" obj-prop="{{obj.prop}}" conflict="{{outerInnerConflict.prop}}" computed-from-literal="{{computeFromLiteral(33, prop)}}"></x-child>
      </template>
    </x-templatize>

    <x-templatize prop="prop-a" name="templatizeB">
      <template>
        <x-child id="childB" computed-from-literal="{{computeFromLiteral(33, prop)}}"></x-child>
      </template>
    </x-templatize>

    <x-templatize-behavior obj="{{objA}}" prop="{{propA}}" id="templatizeC">
      <template>
        <x-child on-tap="handleTap" id="childC" outer-prop="{{outerProp}}" outer-obj="{{outerObj}}" outer-obj-prop="{{outerObj.prop}}" prop="{{prop}}" obj="{{obj}}" obj-prop="{{obj.prop}}" conflict="{{outerInnerConflict.prop}}" computed-from-literal="{{computeFromLiteral(33, prop)}}"></x-child>
      </template>


  </x-templatize-behavior>
`,

  is: 'x-host',

  properties: {
    outerProp: {
      value: 'outerProp'
    },
    outerObj: {
      value: function() {
        return { prop: 'outerObj.prop' };
      }
    },
    propA: {
      value: 'prop-a'
    },
    objA: {
      value: function() {
        return { prop: 'objA.prop' };
      }
    },
    propB: {
      value: 'prop-b'
    },
    objB: {
      value: function() {
        return { prop: 'objB.prop' };
      }
    },
    outerInnerConflict: {
      value: function() {
        return { prop: 'conflict' };
      }
    }
  },

  observers: [
    'outerObjChanged(outerObj.*)',
    'objAChanged(objA.*)',
    'objBChanged(objB.*)'
  ],

  created: function() {
    this.handleTap = sinon.spy();
  },

  outerObjChanged: function() {},
  objAChanged: function() {},
  objBChanged: function() {},
  computeFromLiteral: function(literal, prop) { return literal + '-' + prop; }
});
