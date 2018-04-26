/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { StrictBindingParser } from '../../lib/mixins/strict-binding-parser.js';
import { Polymer } from '../../lib/legacy/polymer-fn.js';
import { html } from '../../lib/utils/html-tag.js';
import { PolymerElement } from '../../polymer-element.js';
import { MutableDataBehavior } from '../../lib/legacy/mutable-data-behavior.js';
import { MutableData } from '../../lib/mixins/mutable-data.js';
let ComputingBehavior = {
  properties: {
    computeFromBehavior: Function
  },
  computeFromBehavior: function(value) {
    return 'computed:' + value;
  }
};
Polymer({
  _template: html`
    <div id="boundChild" value="{{ value }}" negvalue="{{!bool}}" attrvalue\$="{{attrvalue}}" sanitize-value="{{sanitizeValue}}" computedvalue="{{computedvalue}}" computedvaluetwo="{{computedvaluetwo}}" camel-case="{{value}}" computed-inline="{{computeInline(value,add, divide)}}" computed-inline2="{{computeInline(value, add,divide)}}" computed-inline3="{{computeInline(value, add,
                                        divide )}}" computedattribute\$="{{computeInline(value, add,divide)}}" computedattribute2\$="{{computeInline(
                               value, add, divide)}}" neg-computed-inline="{{!computeInline(value,add,divide)}}" computed-negative-number="{{computeNegativeNumber(-1)}}" computed-negative-literal="{{computeNegativeNumber(-A)}}" computed-wildcard="{{computeWildcard(a, b.*)}}" style\$="{{boundStyle}}" data-id\$="{{dataSetId}}" custom-event-value="{{customEventValue::custom}}" custom-event-object-value="{{customEventObject.value::change}}" computed-from-mixed-literals="{{computeFromLiterals(3, &quot;foo&quot;, bool)}}" computed-from-pure-literals="{{computeFromLiterals( 3, &quot;foo&quot;)}}" computed-from-tricky-function="{{\$computeTrickyFunctionFromLiterals( 3, &quot;foo&quot;)}}" computed-from-tricky-literals="{{computeFromTrickyLiterals(3, 'tricky\\,\\'zot\\'')}}" computed-from-tricky-literals2="{{computeFromTrickyLiterals(3,&quot;tricky\\,'zot'&quot; )}}" computed-from-tricky-literals3="{{computeFromTrickyLiterals(3,
                                          &quot;tricky\\,'zot'&quot; )}}" computed-from-no-args="{{computeFromNoArgs( )}}" no-computed="{{foobared(noInlineComputed)}}" compoundattr1\$="{{cpnd1}}{{ cpnd2 }}{{cpnd3.prop}}{{ computeCompound(cpnd4, cpnd5, 'literalComputed')}}" compoundattr2\$="literal1 {{cpnd1}} literal2 {{cpnd2}}{{cpnd3.prop}} literal3 {{computeCompound(cpnd4, cpnd5, 'literalComputed')}} literal4" compoundattr3\$="[yes/no]: {{cpnd1}}, {{computeCompound('world', 'username ', 'Hello {0} ')}}" computed-from-behavior="{{computeFromBehavior(value)}}" computed-dynamic-fn="{{dynamicFn('hello', 'username')}}">
      Test
      <!-- Malformed bindings to be ignored -->
      {{really.long.identifier.in.malformed.binding.should.be.ignored]}
      {{computeFromLiterals(3, 'really.long.literal.in.malformed.binding.should.be.ignored)]}
      <!-- Should still parse -->
      {{computeFromLiterals(3, 'foo', bool)}}
      </div>
      <x-prop id="boundProps" prop1="{{cpnd1}}{{ cpnd2 }}{{cpnd3.prop}}{{ computeCompound(cpnd4, cpnd5, 'literalComputed')}}" prop2="literal1 {{cpnd1}} literal2 {{cpnd2}}{{cpnd3.prop}} literal3 {{computeCompound(cpnd4, cpnd5, 'literalComputed')}} literal4"></x-prop>
      <span id="boundText">{{text}}</span>
      <span id="sanitizeText">{{sanitizeText}}</span>
      <span idtest="" id="{{boundId}}"></span>
      <s id="computedContent">{{computeFromTrickyLiterals(3, 'tricky\\,\\'zot\\'')}}</s>
      <s id="computedContent2">{{computeFromTrickyLiterals("(",3)}}</s>
      <input id="boundInput" value="{{text::input}}">
      <textarea id="boundTextArea" value="{{text::input}}"></textarea>
      <div id="compound1">{{cpnd1}}{{cpnd2}}{{cpnd3.prop}}{{computeCompound(cpnd4, cpnd5, 'literalComputed')}}</div>
      <div id="compound2">
        literal1 {{cpnd1}} literal2 {{cpnd2}}{{cpnd3.prop}} literal3 {{computeCompound(cpnd4, cpnd5, 'literalComputed')}} literal4
      </div>
      <span id="boundWithDash">{{objectWithDash.binding-with-dash}}</span>
      <script id="scriptWithBinding">
        /* eslint-disable no-unused-vars */
        function foo() {
          return "We have a {{binding}} here";
        }
        /* eslint-enable no-unused-vars */
      </script>
      <style id="styleWithBinding">
        :host {
          content: '[[binding]]'
        }
      </style>
      <span id="boundWithSlash">[[objectWithSlash.binding/with/slash]]</span>
      <span id="jsonContent">[["Jan", 31],["Feb", 28],["Mar", 31]]</span>
      <span id="nonEnglishUnicode">{{objectWithNonEnglishUnicode.商品名}}</span>
      <span id="booleanTrue">foo(field, true): {{computeWithBoolean(otherValue, true)}}</span>
      <span id="booleanFalse">foo(field, false): {{computeWithBoolean(otherValue, false)}}</span>
`,

  is: 'x-basic',
  behaviors: [ComputingBehavior],

  properties: {
    value: {
      type: Number,
      observer: 'valueChanged',
      value: 10
    },
    computedvalue: {
      computed: 'computeValue(value)',
      observer: 'computedvalueChanged'
    },
    computedvaluetwo: {
      computed: 'computeValue(valuetwo)',
      observer: 'computedvaluetwoChanged'
    },
    notifyingvalue: {
      type: Number,
      notify: true,
      observer: 'notifyingvalueChanged'
    },
    notifyingvalueWithDefault: {
      notify: true,
      value: 99
    },
    computednotifyingvalue: {
      type: Number,
      notify: true,
      // Naming here is to test that a private setter is not created for
      // computed properties
      computed: '_setComputednotifyingvalue(notifyingvalue)'
    },
    computedFromMultipleValues: {
      type: Number,
      notify: true,
      computed: 'computeFromMultipleValues(sum1, sum2, divide)',
      observer: 'computedFromMultipleValuesChanged'
    },
    camelNotifyingValue: {
      type: Number,
      notify: true
    },
    readonlyvalue: {
      type: Number,
      readOnly: true,
      notify: true,
      observer: 'readonlyvalueChanged'
    },
    notifierWithoutComputing: {
      type: Number,
      observer: 'notifierWithoutComputingChanged',
      notify: true,
      value: 0
    },
    add: {
      value: 20
    },
    divide: {
      value: 2
    },
    customEventValue: {
      type: Number,
      observer: 'customEventValueChanged'
    },
    customEventObject: {
      type: Object,
      value: function() { return {}; }
    },
    boundId: {
      type: String,
      value: 'span'
    },
    noObserver: {
      observer: 'foobared'
    },
    noComputedProp: {
      computed: 'foobared(noComputed)'
    },
    objectWithDash: {
      type: Object
    },
    title: {
      observer: 'titleChanged'
    },
    dynamicFn: {
      type: Function
    }
  },

  observers: [
    'multipleDepChangeHandler(dep1, dep2, dep3)',
    'customEventObjectValueChanged(customEventObject.value)',
    'foobared(noComplexObserver.*)'
  ],

  created: function() {
    this.observerCounts = {
      valueChanged: 0,
      computedvalueChanged: 0,
      computedvaluetwoChanged: 0,
      notifyingvalueChanged: 0,
      readonlyvalueChanged: 0,
      computedFromMultipleValuesChanged: 0,
      multipleDepChangeHandler: 0,
      customEventValueChanged: 0,
      customEventObjectValueChanged: 0,
      notifierWithoutComputingChanged: 0
    };
    this.titleChanged = sinon.spy();
    this._dynamicFnCalled = false;
  },

  ready: function() {
    this.isReady = true;
  },

  clearObserverCounts: function() {
    for (var i in this.observerCounts) {
      this.observerCounts[i] = 0;
    }
  },

  valueChanged: function(val, old) {
    this.observerCounts.valueChanged++;
    assert.equal(arguments.length, 2, 'observer argument length wrong');
    assert.equal(val, this.value, 'observer value argument wrong');
    assert.equal(old, this._value, 'observer old argument wrong');
    this._value = val;
  },

  computeValue: function(val) {
    return val + 1;
  },

  computedvalueChanged: function(val, old) {
    this.observerCounts.computedvalueChanged++;
    assert.equal(arguments.length, 2, 'observer argument length wrong');
    assert.equal(val, this.computedvalue, 'observer value argument wrong');
    assert.equal(old, this._computedvalue, 'observer old argument wrong');
    this._computedvalue = val;
  },

  computedvaluetwoChanged: function(val, old) {
    this.observerCounts.computedvaluetwoChanged++;
    assert.equal(arguments.length, 2, 'observer argument length wrong');
    assert.equal(val, this.computedvaluetwo, 'observer value argument wrong');
    assert.equal(old, this._computedvaluetwo, 'observer old argument wrong');
    this._computedvaluetwo = val;
  },

  notifyingvalueChanged: function(val, old) {
    this.observerCounts.notifyingvalueChanged++;
    assert.equal(arguments.length, 2, 'observer argument length wrong');
    assert.equal(val, this.notifyingvalue, 'observer value argument wrong');
    assert.equal(old, this._notifyingvalue, 'observer old argument wrong');
    this._notifyingvalue = val;
  },

  readonlyvalueChanged: function(val, old) {
    this.observerCounts.readonlyvalueChanged++;
    assert.equal(arguments.length, 2, 'observer argument length wrong');
    assert.equal(val, this.readonlyvalue, 'observer value argument wrong');
    assert.equal(old, this._readonlyvalue, 'observer old argument wrong');
    this._readonlyvalue = val;
  },

  notifierWithoutComputingChanged: function() {
    this.observerCounts.notifierWithoutComputingChanged++;
  },

  _setComputednotifyingvalue: function(val) {
    return val + 2;
  },

  computeFromMultipleValues: function(sum1, sum2, divide) {
    assert.equal(arguments.length, 3, 'observer argument length wrong');
    assert.equal(sum1, this.sum1, 'observer value argument wrong');
    assert.equal(sum2, this.sum2, 'observer value argument wrong');
    assert.equal(divide, this.divide, 'observer value argument wrong');
    if (!isNaN(sum1) && !isNaN(sum2) && !isNaN(divide)) {
      return (sum1 + sum2) / divide;
    }
  },

  computedFromMultipleValuesChanged: function(val, old) {
    this.observerCounts.computedFromMultipleValuesChanged++;
    assert.equal(arguments.length, 2, 'observer argument length wrong');
    assert.equal(val, this.computedFromMultipleValues, 'observer value argument wrong');
    assert.equal(old, this._computedFromMultipleValues, 'observer old argument wrong');
    this._computedFromMultipleValues = val;
  },

  multipleDepChangeHandler: function(dep1, dep2, dep3) {
    this.observerCounts.multipleDepChangeHandler++;
    assert.equal(arguments.length, 3, 'observer argument length wrong');
    assert.equal(dep1, this.dep1, 'dependency 1 argument wrong');
    assert.equal(dep2, this.dep2, 'dependency 2 argument wrong');
    assert.equal(dep3, this.dep3, 'dependency 3 argument wrong');
  },

  computeInline: function(value, add, divide) {
    assert.equal(arguments.length, 3, 'observer argument length wrong');
    assert.equal(value, this.value, 'dependency 1 argument wrong');
    assert.equal(add, this.add, 'dependency 2 argument wrong');
    assert.equal(divide, this.divide, 'dependency 3 argument wrong');
    return (value + add) / divide;
  },

  customEventValueChanged: function(val, old) {
    this.observerCounts.customEventValueChanged++;
    assert.equal(arguments.length, 2, 'observer argument length wrong');
    assert.equal(val, this.customEventValue, 'observer value argument wrong');
    assert.equal(old, this._customEventValue, 'observer old argument wrong');
    this._customEventValue = val;
  },

  customEventObjectValueChanged: function(val) {
    this.observerCounts.customEventObjectValueChanged++;
    assert.equal(arguments.length, 1, 'observer argument length wrong');
    assert.equal(val, this.customEventObject.value, 'observer value argument wrong');
    // note, no `old` argument for path observers
  },

  computeFromLiterals: function(num, str) {
    assert.equal(num, 3);
    assert.equal(str, 'foo');
    return num + str;
  },

  $computeTrickyFunctionFromLiterals: function(num, str) {
    return this.computeFromLiterals(num, str);
  },

  computeFromTrickyLiterals: function(a, b) {
    return a + b;
  },

  computeFromNoArgs: function() {
    return 'no args!';
  },

  computeNegativeNumber: function (num) {
    return num;
  },

  computeCompound: function(a, b, c) {
    return '' + (c || '') + (b || '') + (a || '');
  },

  computeWildcard: function(a, bInfo) {
    return a + (bInfo && bInfo.base ? bInfo.base.value  : 0);
  },

  computeWithBoolean: function(value, bool) {
    return bool ? value : value * 2;
  },

  fireCustomNotifyingEvent: function() {
    this.customNotifyingValue = 'changed!';
    this.dispatchEvent(new CustomEvent('custom-notifying-value-changed'),
      {value: this.customNotifyingValue});
  },

  dynamicFn: function() {}
});

class XBasicWithStrictBindingParser extends StrictBindingParser(customElements.get('x-basic')) {
  static get is() { return 'x-basic-strict-binding-parser'; }
}
customElements.define(XBasicWithStrictBindingParser.is, XBasicWithStrictBindingParser);
Polymer({
  _template: html`
    <x-basic id="basic1" value="{{boundvalue}}" notifyingvalue="{{boundnotifyingvalue}}" notifyingvalue-with-default="{{boundnotifyingvalueWithDefault}}" camel-notifying-value="{{boundnotifyingvalue}}" computedvalue="{{boundcomputedvalue}}" computednotifyingvalue="{{boundcomputednotifyingvalue}}" readonlyvalue="{{boundreadonlyvalue}}" custom-notifying-value="{{boundCustomNotifyingValue}}">
    </x-basic>
    <x-basic id="basic2" value="[[boundvalue]]" notifyingvalue="[[boundnotifyingvalue]]" computedvalue="[[boundcomputedvalue]]" computednotifyingvalue="[[boundcomputednotifyingvalue]]">
    </x-basic>
    <x-basic id="basic3" notifyingvalue="{{computedValue}}" computedvalue="{{value}}">
    </x-basic>
    <x-basic id="basic4" notifyingvalue="{{!negatedValue}}">
    </x-basic>
`,

  is: 'x-compose',

  observers: [
    'boundvalueChanged(boundvalue)',
    'boundnotifyingvalueChanged(boundnotifyingvalue)',
    'boundcomputedvalueChanged(boundcomputedvalue)',
    'boundcomputednotifyingvalueChanged(boundcomputednotifyingvalue)',
    'boundreadonlyvalueChanged(boundreadonlyvalue)',
    'boundCustomNotifyingValueChanged(boundCustomNotifyingValue)',
    'boundnotifyingvalueWithDefaultChanged(boundnotifyingvalueWithDefault)'
  ],

  properties: {
    a: {
      value: 10
    },
    b: {
      value: 20
    },
    computedValue: {
      computed: 'computeComputedValue(a, b)'
    },
    negatedValue: {
      value: false
    }
  },

  created: function() {
    this.observerCounts = {
      boundvalueChanged: 0,
      boundnotifyingvalueChanged: 0,
      boundcomputedvalueChanged: 0,
      boundcomputednotifyingvalueChanged: 0,
      boundreadonlyvalueChanged: 0,
      boundCustomNotifyingValueChanged: 0,
      boundnotifyingvalueWithDefault: 0
    };
  },

  computeComputedValue: function(a, b) {
    return a + b;
  },

  clearObserverCounts: function() {
    for (var i in this.observerCounts) {
      this.observerCounts[i] = 0;
    }
  },

  assertClientsReady: function() {
    assert.isTrue(this.$.basic1.isReady, 'basic1 not `ready` by observer time');
    assert.isTrue(this.$.basic2.isReady, 'basic2 element not `ready` by observer time');
    assert.isTrue(this.$.basic3.isReady, 'basic3 element not `ready` by observer time');
    assert.isTrue(this.$.basic4.isReady, 'basic4 element not `ready` by observer time');
  },

  boundvalueChanged: function() {
    this.assertClientsReady();
    this.observerCounts.boundvalueChanged++;
  },

  boundnotifyingvalueChanged: function() {
    this.assertClientsReady();
    this.observerCounts.boundnotifyingvalueChanged++;
  },

  boundcomputedvalueChanged: function() {
    this.assertClientsReady();
    this.observerCounts.boundcomputedvalueChanged++;
  },

  boundcomputednotifyingvalueChanged: function() {
    this.assertClientsReady();
    this.observerCounts.boundcomputednotifyingvalueChanged++;
  },

  boundreadonlyvalueChanged: function() {
    this.assertClientsReady();
    this.observerCounts.boundreadonlyvalueChanged++;
  },

  boundCustomNotifyingValueChanged: function() {
    this.assertClientsReady();
    this.observerCounts.boundCustomNotifyingValueChanged++;
  },

  boundnotifyingvalueWithDefaultChanged: function() {
    this.assertClientsReady();
    this.observerCounts.boundnotifyingvalueWithDefault++;
  }
});
Polymer({
  _template: html`
    <slot name="drawer"></slot>
    <div id="before"></div>
    <x-basic id="basic1" on-notifyingvalue-with-default-changed="handleNotify">
    </x-basic>
    <div id="later"></div>
`,

  is: 'x-handle-notify-event',

  properties: {
    prop: {
      observer: 'propChanged'
    }
  },

  created: function() {
    this.readySpy = sinon.spy();
    this.afterSettingProp = sinon.spy();
    this.propChanged = sinon.spy();
    this.handleNotify = sinon.spy(function() {
      this.prop = 'prop';
      this.afterSettingProp();
    });
  },

  ready: function() {
    this.readySpy();
  }
});
Polymer({
  is: 'x-reflect',
  properties: {
    reflectedobject: {
      type: Object,
      reflectToAttribute: true
    },
    reflectedarray: {
      type: Array,
      reflectToAttribute: true
    },
    reflectedNumber: {
      type: Number,
      reflectToAttribute: true
    },
    reflectedstring: {
      type: String,
      reflectToAttribute: true
    },
    reflectedboolean: {
      type: Boolean,
      reflectToAttribute: true
    },
    reflecteddate: {
      type: Date,
      reflectToAttribute: true
    }
  }
});
Polymer({
  is: 'x-prop',
  properties: {
    prop1: {
      value: 'default',
      observer: 'prop1Changed'
    },
    prop2: {
      value: 'default',
      observer: function(newProp, oldProp) { return this.prop2Changed(newProp, oldProp); }
    }
  },
  created: function() {
    this.prop1Changed = sinon.spy();
    this.prop2Changed = sinon.spy();
  }
});
Polymer({
  is: 'x-notifies1',
  properties: {
    notifies: {
      notify: true
    }
  },
  ready: function() {
    this.notifies = 'readyValue';
  }
});
Polymer({
  _template: html`
    <x-notifies1 id="notifies1" notifies="{{shouldChange}}"></x-notifies1>
`,

  is: 'x-notifies2',

  properties: {
    notifies: {
      notify: true
    }
  }
});
Polymer({
  _template: html`
    <x-notifies2 id="notifies2" notifies="{{shouldNotChange}}"></x-notifies2>
`,

  is: 'x-notifies3',

  properties: {
    shouldNotChange: {
      observer: 'shouldNotChangeChanged'
    }
  },

  shouldNotChangeChanged: function() { }
});
Polymer({
  _template: html`
    <p>©</p>
    <p id="binding">{{myText}}</p>
`,

  is: "x-entity-and-binding",

  properties: {
    myText: {
      type: String,
      value: 'binding'
    }
  }
});
Polymer({
  _template: html`
    <input id="input" value\$="{{inputValue}}">
`,

  is: 'x-input-value'
});
Polymer({
  _template: html`
    <div id="check">{{isAttached}}</div>
`,

  is: 'x-bind-is-attached',

  properties: {
    isAttached: {
      observer: '_isAttachedChanged'
    }
  },

  _isAttachedChanged: function() {}
});
var invocations = [];
Polymer({
  _template: html`
    <x-order-of-effects id="child" base="{{base}}"></x-order-of-effects>
`,

  is: 'x-order-of-effects-grand-parent',
  initializeWhenCreated: true,

  properties: {
    base: {
      observer: '_childPropertyChanged'
    }
  },

  _childPropertyChanged: function() {
    invocations.push('notify');
  }
});
Polymer({
  _template: html`
    <x-order-of-effects-child prop1="[[base]]" prop2="[[_computedAnnotation(base)]]"></x-order-of-effects-child>
`,

  is: 'x-order-of-effects',
  initializeWhenCreated: true,

  properties: {
    base: {
      type: String,
      observer: '_observer',
      notify: true,
      reflectToAttribute: true
    },
    computed: {
      type: String,
      computed: '_computed(base)'
    }
  },

  observers: ['_complexObserver(base)'],

  created: function() {
    this.invocations = invocations;
  },

  attributeChanged(name) {
    if (name == 'base') {
      invocations.push('reflect');
    }
  },

  _computed: function(base) {
    invocations.push('compute');
    return base;
  },

  _computedAnnotation: function(base) {
    return base;
  },

  _observer: function() {
    invocations.push('observe');
  },

  _complexObserver: function() {
    invocations.push('observe');
  }
});
Polymer({
  is: 'x-order-of-effects-child',
  properties: {
    prop1: {
      observer: '_prop1Changed'
    },
    prop2: {
      observer: '_prop2Changed'
    }
  },
  _prop1Changed: function() {
    invocations.push('propagate');
  },
  _prop2Changed: function() {
    invocations.push('propagate');
  }
});
var TranslateBehavior = {
  properties: {
    translateMessage: {
      type: Function,
      computed: '_computeTranslateFn(translator)'
    }
  }
};
Polymer({
  _template: html`
    <div id="check">[[translateMessage('Hello World.')]]</div>
`,

  is: 'x-bind-computed-property',
  behaviors: [TranslateBehavior],

  properties: {
    translator: {
      type: Function,
      value: function() {
        return function(message) {
          return 'translated: ' + message;
        };
      }
    }
  },

  _computeTranslateFn: function(translator) {
    return function(message) {
      return translator(message);
    };
  }
});
Polymer({
  _template: html`
    <div id="check">[[translateMessage(message)]]</div>
`,

  is: 'x-bind-computed-property-late-translator',

  properties: {
    message: {
      type: String,
      value: 'Hello'
    },
    translateMessage: {
      type: Function,
      computed: '_computeTranslateFn(translator)'
    },
    translator: {
      type: Function
    }
  },

  _computeTranslateFn: function(translator) {
    return function(message) {
      return translator(message);
    };
  }
});
Polymer({
  _template: html`
    <div -u-p-c-a-s-e\$="[[UPCASE]]"></div>
`,

  is: 'x-bind-bad-attribute-name',

  properties: {
    UPCASE: {
      type: String,
      value: 'foo'
    }
  }
});
Polymer({
  _template: html`
    <template is="dom-if" if="[[visible]]">
      <p>[[translateMessage('text')]]</p>
    </template>
`,

  is: 'x-child-template-with-dynamic-fn',

  properties: {
    translateMessage: {
      type: Function,
      value: function () {
        return function(str) {
          return str;
        };
      }
    },
    visible: {
      type: Boolean,
      value: true
    }
  }
});
Polymer({
  is: 'x-propagate',
  properties: {
    value: {
      type: Number,
      value: -1
    }
  },
  observers: [
    '_boundOne(value)',
    '_boundTwo(value)'
  ],
  _boundOne: function(value) {
    if (value < 0) {
      this.value = 1;
    }
  },
  _boundTwo: function(value) {
    if (value < 0) {
      this.value = 2;
    }
  }
});
class XRaw extends HTMLElement {
  constructor() {
    super();
    this._value = null;
    this.valueChangedCount = 0;
    this.valueChanged = sinon.spy();
    this.arrayChanged = sinon.spy();
    this.compoundChanged = sinon.spy();
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this.valueChanged(value);
    this.notify();
  }
  get compound() {
    return this._compound;
  }
  set compound(value) {
    this._compound = value;
    this.compoundChanged(value);
  }
  increment() {
    this._value++;
    this.notify();
  }
  notify() {
    this.dispatchEvent(new CustomEvent('value-changed'));
  }
  set array(value) {
    this.arrayChanged(value);
    this.textContent = value;
  }
}
customElements.define('x-raw', XRaw);

Polymer({
  is: 'x-polymer',
  created: function() {
    this.arrayChanged = sinon.spy();
    this.compoundChanged = sinon.spy();
  },
  observers: ['compoundChanged(compound)'],
  set array(value) {
    this._array = value;
    this.arrayChanged(value);
  },
  get array() {
    return this._array;
  }
});

Polymer({
  _template: html`
    <x-polymer id="polymer" array="{{array}}" compound="**{{array}}**">{{array}}</x-polymer>
    <x-raw id="raw" array="{{array}}" value="{{value}}" compound="**{{array}}**"></x-raw>
`,

  is: 'x-interop',

  properties: {
    value: {
      value: 10
    },
    array: {
      value: function() {
        return [1,2,3];
      }
    }
  }
});

Polymer({
  is: 'x-template-proto',
  _template: (function() {
    let template = document.createElement('template');
    template.innerHTML = '<div id="div" on-click="clicked">{{bound}}</div>';
    return template;
  })(),
  properties: {
    bound: {
      value: 'yes'
    }
  },
  clicked: sinon.spy()
});

let TemplateBehavior = {
  _template: (function() {
    let template = document.createElement('template');
    template.innerHTML = '<div id="div" on-click="clicked">{{bound}}</div>';
    return template;
  })(),
  properties: {
    bound: {
      value: 'yes'
    }
  },
  clicked: sinon.spy()
};

Polymer({
  is: 'x-template-behavior',
  behaviors: [TemplateBehavior]
});

Polymer({
  _template: html`
    <x-immutable-b b="[[a.b]]" x="[[a.x]]" id="b"></x-immutable-b>
`,

  is: 'x-immutable-a',
  observers: ['aChanged(a)', 'xChanged(x)'],

  created() {
    this.aChanged = sinon.spy();
    this.xChanged = sinon.spy();
  }
});
class XImmutableB extends PolymerElement {
  static get template() {
    return html`
    <x-immutable-c c="[[b.c]]" x="[[b.x]]" id="c">
  </x-immutable-c>
`;
  }

  static get is() { return 'x-immutable-b'; }
  static get observers() { return ['bChanged(b)', 'xChanged(x)']; }
  constructor() {
    super();
    this.bChanged = sinon.spy();
    this.xChanged = sinon.spy();
  }
}
customElements.define('x-immutable-b', XImmutableB);
Polymer({
  is: 'x-immutable-c',
  observers: ['cChanged(c)', 'xChanged(x)'],
  created() {
    this.cChanged = sinon.spy();
    this.xChanged = sinon.spy();
  }
});
Polymer({
  _template: html`
    <x-mutable-b b="[[a.b]]" x="[[a.x]]" id="b"></x-mutable-b>
`,

  is: 'x-mutable-a',
  behaviors: [MutableDataBehavior],
  observers: ['aChanged(a)', 'xChanged(x)'],

  created() {
    this.aChanged = sinon.spy();
    this.xChanged = sinon.spy();
  }
});
class XMutableB extends MutableData(PolymerElement) {
  static get template() {
    return html`
    <x-mutable-c c="[[b.c]]" x="[[b.x]]" id="c">
  </x-mutable-c>
`;
  }

  static get is() { return 'x-mutable-b'; }
  static get observers() { return ['bChanged(b)', 'xChanged(x)']; }
  constructor() {
    super();
    this.bChanged = sinon.spy();
    this.xChanged = sinon.spy();
  }
}
customElements.define('x-mutable-b', XMutableB);
Polymer({
  is: 'x-mutable-c',
  behaviors: [MutableDataBehavior],
  observers: ['cChanged(c)', 'xChanged(x)'],
  created() {
    this.cChanged = sinon.spy();
    this.xChanged = sinon.spy();
  }
});

class SuperObserverElement extends PolymerElement {
  static get is() { return 'super-observer-element'; }
  static get properties() {
    return {
      prop: {
        value: 'String',
        observer() {
          this.__observerCalled++;
        }
      }
    };
  }
}
SuperObserverElement.prototype.__observerCalled = 0;
customElements.define(SuperObserverElement.is, SuperObserverElement);

class SubObserverElement extends SuperObserverElement {
  static get is() { return 'sub-observer-element'; }
}
customElements.define(SubObserverElement.is, SubObserverElement);

class SVGElement extends PolymerElement {
  static get template() {
    return html`
    <svg id="svg" viewBox="[[value]]"></svg>
`;
  }

  static get is() { return 'svg-element'; }
  static get properties() {
    return {
      value: {
        type: String,
        value: '0 0 50 50'
      }
    };
  }
}
customElements.define(SVGElement.is, SVGElement);
