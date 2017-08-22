import { Element } from '../../../polymer-element.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');
$_documentContainer.innerHTML = `<dom-module id="p-r-ap" assetpath="../../assets/"></dom-module>`;
document.head.appendChild($_documentContainer);
class PR extends Element {
  static get template() {
    return `
    <style>
      .logo {
        background-image: url(foo.z);
      }
    </style>
    <div id="div" class="logo" style\$="background-image: url('[[importPath]]foo.z');"></div>
    <img id="img" src\$="[[importPath]]foo.z">
    <a id="a" href\$="[[importPath]]foo.z">Foo</a>
    <zonk id="import" url\$="[[importPath]]foo.z"></zonk>
    <zonk id="resolveUrl" url\$="[[resolveUrl('foo.z')]]"></zonk>
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
class PRAp extends Element {
  static get is() { return 'p-r-ap'; }
}
customElements.define(PRAp.is, PRAp);
