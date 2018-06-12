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
let PropertyTypeBehavior = {
  properties: {
    behaviorShorthandNumber: Number,
    behaviorShorthandBool: Boolean,
    behaviorNumber: {
      value: 11,
      type: Number
    },
    behaviorBool: {
      value: false,
      type: Boolean
    }
  }
};

Polymer({
  is: 'x-basic',
  hostAttributes: {
    attr1: 'this is attr 1',
    attr2: 42,
    attr3: 'host',
    'aria-role': 'button',
    title: 'awesome',
    'attr-object': {foo: 'bar', nested: {'meaning': 42}, arr: [0, 'foo', true]},
    'attr-stupid': false,
    class: 'foo bar baz'
  },
  behaviors: [ PropertyTypeBehavior ],
  properties: {
    object: {
      type: Object,
      value: function() { return {}; }
    },
    array: {
      type: Array,
      value: function() { return []; }
    },
    number: {
      type: Number,
      value: 0
    },
    string: {
      type: String,
      value: 'none'
    },
    bool: {
      type: Boolean,
      value: true
    },
    negBool: {
      type: Boolean,
      value: false
    },
    date: {
      type: Date,
      value: function() { return new Date(0); }
    },
    dashCase: {
      type: String,
      value: 'none'
    },
    UPCASE: {
      type: String,
      value: 'none'
    },
    noType: {
      value: 'none'
    },
    readOnly: {
      type: String,
      value: 'default',
      readOnly: true
    },
    prop: {
      value: 'prop',
      observer: 'propChanged'
    },
    attr1: {
      observer: 'attr1Changed'
    },
    shorthandNumber: Number,
    shorthandBool: Boolean,
    foreignTypeObjectProp: {
      type: Object,
      value: 'none'
    }
  },

  propChangedCount: 0,
  attr1ChangedCount: 0,

  propChanged: function() {
    this.propChangedCount++;
  },

  attr1Changed: function() {
    this.attr1ChangedCount++;
  }

});
Polymer({
  is: 'x-reflect',
  behaviors: [ PropertyTypeBehavior ],
  properties: {
    object: {
      type: Object,
      reflectToAttribute: true,
      value: function() { return {}; }
    },
    array: {
      type: Array,
      reflectToAttribute: true,
      value: function() { return []; }
    },
    number: {
      type: Number,
      reflectToAttribute: true,
      value: 0
    },
    string: {
      type: String,
      reflectToAttribute: true,
      value: 'none'
    },
    bool: {
      type: Boolean,
      reflectToAttribute: true,
      value: true
    },
    negBool: {
      type: Boolean,
      reflectToAttribute: true,
      value: false
    },
    date: {
      type: Date,
      reflectToAttribute: true,
      value: function() { return new Date(0); }
    },
    dashCase: {
      type: String,
      reflectToAttribute: true,
      value: 'none'
    },
    UPCASE: {
      type: String,
      reflectToAttribute: true,
      value: 'none'
    },
    noType: {
      value: 'none'
    },
    readOnly: {
      type: String,
      value: 'default',
      readOnly: true
    },
    shorthandNumber: Number,
    shorthandBool: Boolean,
    foreignTypeObjectProp: {
      type: Object,
      reflectToAttribute: true,
      value: 'none'
    }
  },
  _warn: function() {
    var search = Array.prototype.join.call(arguments, '');
    if (search.indexOf('UPCASE') > -1) {
      this.__warnedAboutUPCASE = true;
    }
  }
});
Polymer({
  _template: html`
    <x-basic id="basic" prop="{{attr1}}" attr1\$="{{attr1}}" class="should-not-override"></x-basic>
`,

  is: 'x-compose',

  hostAttributes: {
    attr1: 'compose'
  },

  properties: {
    attr1: String,
    prop2: String
  },

  ready: function() {
    this.setAttribute('prop2', 'hi');
  }
});
