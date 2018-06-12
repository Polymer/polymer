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
import { MutableData } from '../../lib/mixins/mutable-data.js';
window.getData = () => [
  {
    prop: 'prop-1',
    items: [
      {
        prop: 'prop-1-1',
        items: [
          { prop: 'prop-1-1-1' },
          { prop: 'prop-1-1-2' },
          { prop: 'prop-1-1-3' }
        ]
      },
      {
        prop: 'prop-1-2',
        items: [
          { prop: 'prop-1-2-1' },
          { prop: 'prop-1-2-2' },
          { prop: 'prop-1-2-3' }
        ]
      },
      {
        prop: 'prop-1-3',
        items: [
          { prop: 'prop-1-3-1' },
          { prop: 'prop-1-3-2' },
          { prop: 'prop-1-3-3' }
        ]
      }
    ]
  },
  {
    prop: 'prop-2',
    items: [
      {
        prop: 'prop-2-1',
        items: [
          { prop: 'prop-2-1-1' },
          { prop: 'prop-2-1-2' },
          { prop: 'prop-2-1-3' }
        ]
      },
      {
        prop: 'prop-2-2',
        items: [
          { prop: 'prop-2-2-1' },
          { prop: 'prop-2-2-2' },
          { prop: 'prop-2-2-3' }
        ]
      },
      {
        prop: 'prop-2-3',
        items: [
          { prop: 'prop-2-3-1' },
          { prop: 'prop-2-3-2' },
          { prop: 'prop-2-3-3' }
        ]
      }
    ]
  },
  {
    prop: 'prop-3',
    items: [
      {
        prop: 'prop-3-1',
        items: [
          { prop: 'prop-3-1-1' },
          { prop: 'prop-3-1-2' },
          { prop: 'prop-3-1-3' }
        ]
      },
      {
        prop: 'prop-3-2',
        items: [
          { prop: 'prop-3-2-1' },
          { prop: 'prop-3-2-2' },
          { prop: 'prop-3-2-3' }
        ]
      },
      {
        prop: 'prop-3-3',
        items: [
          { prop: 'prop-3-3-1' },
          { prop: 'prop-3-3-2' },
          { prop: 'prop-3-3-3' }
        ]
      }
    ]
  }
];

Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        border: 1px solid black;
        padding: 3px;
        margin: 3px;
      }
    </style>
    <span>{{itemaProp}}</span>
    <span>{{itembProp}}</span>
    <span>{{itemcProp}}</span>
    <x-bar id="bar" outer-prop="{{outerProp}}" outer-item-prop="{{outerItemProp}}" innera-prop="{{inneraProp}}" itema-prop="{{itemaProp}}" innerb-prop="{{innerbProp}}" itemb-prop="{{itembProp}}" innerc-prop="{{innercProp}}" itemc-prop="{{itemcProp}}" computed1="{{computed1}}" computed2="{{computed2}}" computed3="{{computed3}}">
    </x-bar>
`,

  is: 'x-foo',

  properties: {
    outerProp: {
      notify: true
    },
    outerItemProp: {
      notify: true
    },
    inneraProp: {
      notify: true
    },
    itemaProp: {
      notify: true
    },
    innerbProp: {
      notify: true
    },
    itembProp: {
      notify: true
    },
    innercProp: {
      notify: true
    },
    itemcProp: {
      notify: true
    },
    indexa: {
      notify: true
    },
    indexb: {
      notify: true
    },
    indexc: {
      notify: true
    }
  }
});
Polymer({
  is: 'x-bar',
  properties: {
    outerProp: {
      notify: true
    },
    outerItemProp: {
      notify: true
    },
    inneraProp: {
      notify: true
    },
    itemaProp: {
      notify: true
    },
    innerbProp: {
      notify: true
    },
    itembProp: {
      notify: true
    },
    innercProp: {
      notify: true
    },
    itemcProp: {
      notify: true
    },
    indexa: {
      notify: true
    },
    indexb: {
      notify: true
    },
    indexc: {
      notify: true
    }
  }
});
let XNestedRepeat = Polymer({
    _template: html`
  <template id="repeater" is="dom-repeat" items="{{items}}" as="itema" index-as="indexa" on-dom-change="domUpdateHandler">
    <x-foo on-test1="testHandler1"
           innera-prop="{{innera.prop}}"
           itema-prop="{{itema.prop}}"
           outer-prop="{{prop}}"
           outer-item-prop="{{item.prop}}"
           indexa="{{indexa}}">
    </x-foo>
    <template is="dom-repeat" items="{{itema.items}}" as="itemb" index-as="indexb">
      <x-foo on-test2="testHandler2"
             innerb-prop="{{innerb.prop}}"
             itemb-prop="{{itemb.prop}}"
             innera-prop="{{innera.prop}}"
             itema-prop="{{itema.prop}}"
             outer-prop="{{prop}}"
             outer-item-prop="{{item.prop}}"
             indexa="{{indexa}}"
             indexb="{{indexb}}">
      </x-foo>
      <template is="dom-repeat" items="{{itemb.items}}" as="itemc" index-as="indexc">
        <x-foo on-test3="testHandler3"
               innerc-prop="{{innerc.prop}}"
               itemc-prop="{{itemc.prop}}"
               innerb-prop="{{innerb.prop}}"
               itemb-prop="{{itemb.prop}}"
               innera-prop="{{innera.prop}}"
               itema-prop="{{itema.prop}}"
               outer-prop="{{prop}}"
               outer-item-prop="{{item.prop}}"
               indexa="{{indexa}}"
               indexb="{{indexb}}"
               indexc="{{indexc}}">
       </x-foo>
      </template>
    </template>
  </template>
`,
  is: 'x-nested-repeat',
  testHandler1Count: 0,
  testHandler2Count: 0,
  testHandler3Count: 0,
  domUpdateHandlerCount: 0,
  testHandler1: function() {
    this.testHandler1Count++;
  },
  testHandler2: function() {
    this.testHandler2Count++;
  },
  testHandler3: function() {
    this.testHandler3Count++;
  },
  domUpdateHandler: function() {
    this.domUpdateHandlerCount++;
  }
});
class XNestedRepeatMutable extends MutableData(XNestedRepeat) {
  static get template() {
    if (!this._templateEl) {
      this._templateEl = XNestedRepeat.template.cloneNode(true);
    }
    return this.makeRepeatsMutable(this._templateEl.cloneNode(true));
  }
  static makeRepeatsMutable(template) {
    Array.from(template.content.querySelectorAll('[is=dom-repeat]')).forEach(e => {
      e.setAttribute('mutable-data', '');
      this.makeRepeatsMutable(e);
    });
    return template;
  }
}
customElements.define('x-nested-repeat-mutable', XNestedRepeatMutable);
Polymer({
  _template: html`
    <template id="repeater" is="dom-repeat" items="{{items}}" as="itema" index-as="indexa" observe="prop">
      <x-foo innera-prop="{{innera.prop}}" itema-prop="{{itema.prop}}" outer-prop="{{prop}}" outer-item-prop="{{item.prop}}" indexa="{{indexa}}" computeda="{{concat(itema.prop, itemForComputedA.prop)}}">
      </x-foo>
      <template is="dom-repeat" items="{{itema.items}}" as="itemb" index-as="indexb">
        <x-foo innerb-prop="{{innerb.prop}}" itemb-prop="{{itemb.prop}}" innera-prop="{{innera.prop}}" itema-prop="{{itema.prop}}" outer-prop="{{prop}}" outer-item-prop="{{item.prop}}" indexa="{{indexa}}" indexb="{{indexb}}" computedb="{{concat(itemb.prop, itemForComputedB.prop)}}">
        </x-foo>
        <template is="dom-repeat" items="{{itemb.items}}" as="itemc" index-as="indexc">
          <x-foo innerc-prop="{{innerc.prop}}" itemc-prop="{{itemc.prop}}" innerb-prop="{{innerb.prop}}" itemb-prop="{{itemb.prop}}" innera-prop="{{innera.prop}}" itema-prop="{{itema.prop}}" outer-prop="{{prop}}" outer-item-prop="{{item.prop}}" indexa="{{indexa}}" indexb="{{indexb}}" indexc="{{indexc}}" computedc="{{concat(itemc.prop, itemForComputedC.prop)}}">
          </x-foo>
        </template>
      </template>
    </template>
`,

  is: 'x-nested-repeat-configured',

  properties: {
    items: {
      value: window.getData()
    },
    prop: {
      value: 'outer'
    },
    item: {
      value: function() { return {prop: 'outerItem'}; }
    },
    itemForComputedA: {
      value: function() { return {prop: 'itemForComputedA'}; }
    },
    itemForComputedB: {
      value: function() { return {prop: 'itemForComputedB'}; }
    },
    itemForComputedC: {
      value: function() { return {prop: 'itemForComputedC'}; }
    },
    _testHost: {
      value: function() { return this; }
    }
  },

  sortDesc: function(a, b) {
    assert.equal(this, this._testHost);
    return b.prop.localeCompare(a.prop);
  },

  filter2nd: function(o) {
    assert.equal(this, this._testHost);
    return o.prop.indexOf('2') < 0;
  },

  concat: function(a, b) {
    return a + '+' + b;
  }
});
Polymer({
  _template: html`
      <template id="repeater" is="dom-repeat" items="{{items}}">
        <x-foo itema-prop="{{item.prop.nestedProp}}"></x-foo>
      </template>
`,

  is: 'x-repeat-filter-and-sort-by-nested-property',

  properties: {
    items: {
      value () {
        return [
          { prop: { nestedProp: 0 } },
          { prop: { nestedProp: 1 } },
          { prop: { nestedProp: 2 } },
          { prop: { nestedProp: 3 } },
          { prop: { nestedProp: 4 } },
        ];
      }
    }
  }
});
Polymer({
  _template: html`
    <template id="repeat" is="dom-repeat" items="{{items}}">
      <x-foo itema-prop="{{item.prop}}"></x-foo>
    </template>
`,

  is: 'x-simple-repeat',

  properties: {
    items: {
      value: window.getData()
    }
  }
});
Polymer({
  _template: html`
    <div id="container1">
      <template is="dom-repeat" items="{{items}}" id="repeater1">
        <x-foo itema-prop="{{item}}"></x-foo>
      </template>
    </div>
    <div id="container2">
      <template is="dom-repeat" items="{{items}}" id="repeater2">
        <x-foo itema-prop="{{item}}"></x-foo>
      </template>
    </div>
`,

  is: 'x-primitive-repeat',

  properties: {
    items: {
      value: function() {
        return ['a', 'b', 'c', 'd', 'e'];
      }
    }
  }
});
Polymer({
  _template: html`
    <template id="repeater" is="dom-repeat" items="{{items}}">
      <div>{{item}}</div>
    </template>
`,

  is: 'x-primitive-large',

  properties: {
    items: {
      value: function() {
        var ar = [];
        for (var i = 0; i < 11; i++) {
          ar.push(i);
        }
        return ar;
      }
    }
  }
});
Polymer({
  _template: html`
    <template id="repeater" is="dom-repeat" items="{{items}}">
      <div prop="{{outerProp.prop}}">{{item.prop}}</div>
    </template>
`,

  is: 'x-repeat-limit',

  properties: {
    preppedItems: {
      value: function() {
        var ar = [];
        for (var i = 0; i < 20; i++) {
          ar.push({prop: i});
        }
        return ar;
      }
    },
    outerProp: {
      value: function() {
        return {prop: 'outer'};
      }
    }
  }
});
Polymer({
  _template: html`
    <template id="repeater" is="dom-repeat" items="{{items}}" initial-count="10">
      <x-wait>{{item.prop}}</x-wait>
    </template>
`,

  is: 'x-repeat-chunked',

  properties: {
    preppedItems: {
      value: function() {
        var ar = [];
        for (var i = 0; i < 100; i++) {
          ar.push({prop: i});
        }
        return ar;
      }
    }
  }
});
Polymer({
  is: 'x-wait',
  created: function() {
    var time = performance.now();
    time += 4;
    while (performance.now() < time) {} //eslint-disable-line no-empty
  }
});
Polymer({
  _template: html`
    <template is="dom-repeat" items="{{items}}" id="outer">
      <template is="dom-if" if="">
        <template is="dom-repeat" items="{{item.items}}" id="inner">
          <template is="dom-if" if="">
            <button on-click="handleClick">{{item.prop}}</button>
          </template>
        </template>
      </template>
    </template>
`,

  is: 'x-repeat-with-if',

  properties: {
    items: {
      value: () => [
        {items: [{prop:'a'}, {prop: 'b'}]},
        {items: [{prop:'c'}, {prop: 'd'}]}
      ]
    }
  },

  created() {
    // cache target so it's available in spy after event stack returns
    this.handleClick = sinon.spy((event) => event._target = event.target);
  }
});
