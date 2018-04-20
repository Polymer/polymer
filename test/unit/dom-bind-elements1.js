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
Polymer({
  is: 'x-basic',
  properties: {
    notifyingvalue: {
      notify: true
    }
  }
});
Polymer({
  _template: html`
<div id="container"><slot id="slot"></slot></div>
`,

  is: 'x-content'
});
Polymer({
  _template: html`
<x-content id="local"></x-content>
`,

  is: 'x-attach-dom-bind',

  attached: function() {
    var domBind = document.createElement('dom-bind');
    var template = document.createElement('template');

    domBind.appendChild(template);

    var span = document.createElement('span');
    span.innerHTML = '{{hello}}';

    template.content.appendChild(span);
    domBind.hello = 'hey';

    this.$.local.appendChild(domBind);
  }
});
Polymer({
  _template: html`
<x-content id="local"></x-content>
`,

  is: 'x-compose'
});
Polymer({
  is: 'x-produce-a',
  properties: {
    bindToText: {
      notify: true,
      value: 'this text is bound'
    }
  }
});
