/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { PolymerElement } from '../../polymer-element.js';

import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '../../lib/elements/custom-style.js';
import { html } from '../../lib/utils/html-tag.js';
class ApplyElement extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --mixin;
    }
    </style>
`;
  }

  static get is() {return 'apply-element';}
}
customElements.define('apply-element', ApplyElement);
class XOuter extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --mixin;
      background-color: rgb(123, 123, 123);
    }
    :host > * {
      --mixin: {
        position: absolute;
        margin: 50px;
        height: 100px;
        width: 100px;
        background-color: rgb(255, 0, 0);
      }
    }
    </style>
    <apply-element></apply-element>
`;
  }

  static get is() {return 'x-outer';}
}
customElements.define('x-outer', XOuter);
