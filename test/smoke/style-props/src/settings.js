import { Polymer } from '../../../../lib/legacy/polymer-fn.js';
import { html } from '../../../../lib/utils/html-tag.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="simple-layout-styles">
  <template>
    <style>
      .horizontal.layout {
        display: flex;
      }

      .flex {
        flex: 1;
      }

      .flex-2 {
        flex: 2;
      }

      .center-center {
        justify-content: center;
        align-items: center;
      }

      .wrap {
        flex-wrap: wrap;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);
Polymer({
  _template: html`
    <style include="simple-layout-styles">
    :host {
      margin: 4px;
      display: block;
      -webkit-user-select: none;
      user-select: none;
      cursor: pointer;
      transform: skewX(160deg);
      -webkit-transform: skewX(160deg);
    }

    section {
      box-sizing: border-box;
      margin: 1px;
      padding: 4px 16px;
      border: 1px solid black;
      border-radius: 4px;
    }

    .setting {
      background-color: var(--setting-color, #eee);
    }

  </style>
    <section class="center-center horizontal layout setting"><slot></slot></section>
`,

  is: 'x-setting',

  listeners: {
    click: 'clickHandler'
  },

  ready: function() {
    this.setting = this.textContent;
    const obj = {
      '--setting-color': 'var(' + this.setting + ')'
    }
    this.updateStyles(obj);
  },

  clickHandler: function() {
    this.fire('setting-change', this.setting);
  }
});
