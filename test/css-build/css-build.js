/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import {Polymer} from '../../lib/legacy/polymer-fn.js';
import {PolymerElement, html} from '../../polymer-element.js';

Polymer({
  is: 'css-build'
});

class CssBuildClass extends PolymerElement {
  static get is() {
    return 'css-build-class';
  }
  static get template() {
    return html`
      <style>
        :host {
          @apply --mixin;
          display: block;
        }
        :host(.ignore-background) {
          background-color: rgb(255, 0, 0);
        }
        #div {
          border: var(--border, 2px solid black);
        }
        #container ::slotted(*) {
          padding-left: 10px;
        }
      </style>
      <div id="div"></div>
      <div id="container">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define(CssBuildClass.is, CssBuildClass);