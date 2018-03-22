import { html } from '../../../lib/utils/html-tag.js';
import { PolymerElement } from '../../../polymer-element.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');
$_documentContainer.innerHTML = `<dom-module id="p-r-ap" assetpath="../../assets/"></dom-module>`;
document.head.appendChild($_documentContainer);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
class PR extends PolymerElement {
  static get template() {
    return html`
    <style>
      .logo {
        background-image: url(foo.z);
        clip-path: url('#bar');
        mask-image: url('/zot');
      }
    </style>
    <div id="div" class="logo" style\$="background-image: url('[[importPath]]foo.z');"></div>
    <img id="img" src\$="[[importPath]]foo.z">
    <a id="a" href\$="[[importPath]]foo.z">Foo</a>
    <zonk id="import" url\$="[[importPath]]foo.z"></zonk>
    <zonk id="resolveUrl" url\$="[[resolveUrl('foo.z')]]"></zonk>
    <zonk id="resolveUrlHash" url\$="[[resolveUrl('#foo')]]"></zonk>
    <zonk id="resolveUrlAbs" url\$="[[resolveUrl('/foo')]]"></zonk>
    <zonk id="root" url\$="[[rootPath]]foo.z"></zonk>
    <a id="rel" href\$="[[importPath]]../foo.z?123">Foo</a>
    <a id="action" action="foo.z">Foo</a>
    <form id="formAction" action\$="[[importPath]]foo.z"></form>
    <a id="hash" href="#foo.z">Foo</a>
    <a id="absolute" href="/foo.z">Foo</a>
    <a id="protocol" href="data:foo.z">Foo</a>
`;
  }

  static get is() { return 'p-r'; }
}
customElements.define(PR.is, PR);
class PRAp extends PolymerElement {
  static get is() { return 'p-r-ap'; }
}
customElements.define(PRAp.is, PRAp);
