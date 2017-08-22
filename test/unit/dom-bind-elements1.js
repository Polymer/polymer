import { Polymer } from '../../lib/legacy/polymer-fn.js';
Polymer({
  is: 'x-basic',
  properties: {
    notifyingvalue: {
      notify: true
    }
  }
});
Polymer({
  _template: `
<div id="container"><slot id="slot"></slot></div>
`,

  is: 'x-content'
});
Polymer({
  _template: `
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
  _template: `
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
