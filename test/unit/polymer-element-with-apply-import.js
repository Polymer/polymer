import { Element } from '../../polymer-element.js';
import '../../../../@webcomponents/shadycss/entrypoints/apply-shim.js';
import '../../lib/elements/custom-style.js';
class ApplyElement extends Element {
  static get template() {
    return `
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
class XOuter extends Element {
  static get template() {
    return `
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
