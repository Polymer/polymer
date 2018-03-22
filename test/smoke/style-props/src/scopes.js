import './settings.js';
import './elements.js';
import { Polymer } from '../../../../lib/legacy/polymer-fn.js';
import { html } from '../../../../lib/utils/html-tag.js';
import { dom } from '../../../../lib/legacy/polymer.dom.js';

Polymer({
  _template: html`
    <style>

      :host {
        border: 2px solid #ddd;
        background-color: #e5e5e5;
        border-radius: 8px;
        margin: 16px;
        padding: 16px;
        position: relative;
        min-height: 240px;
        --c: var(--cc);
      }

      .header {
        @apply(--header);
      }

      x-setting.c {
        @apply(--left-setting);
      }

      x-setting.cc {
        position: absolute;
        left: 56px;
        top: 14px;
      }

    </style>
    <div class="header">x-view2</div>
    <x-setting class="c">--c</x-setting>
    <x-setting class="cc">--cc</x-setting>
    <x-s></x-s>
`,

  is: 'x-view2'
});

Polymer({
  _template: html`
    <style include="simple-layout-styles">

      :host {
        border: 2px solid #ddd;
        background-color: #f1f1f1;
        border-radius: 8px;
        margin: 16px;
        padding: 16px;
        position: relative;
        --b: steelblue;
        --c: purple;
      }

      .header {
        @apply(--header);
      }

      x-setting.b {
        @apply(--left-setting);
      }

      x-setting.c {
        position: absolute;
        left: 64px;
        top: 14px;
      }

    </style>
    <div class="header">x-view1</div>
    <x-setting class="b">--b</x-setting>
    <x-setting class="c">--c</x-setting>
    <div class="horizontal layout center-center flex">
      <x-s></x-s>
    </div>
    <x-view2 class="horizontal layout center-center flex"></x-view2>
`,

  is: 'x-view1'
});

Polymer({
  _template: html`
    <style include="simple-layout-styles">

      :host {
        font-family: sans-serif;
        display: block;
        border: 2px solid #ddd;
        background-color: #fafafa;
        border-radius: 8px;
        margin: 16px;
        padding: 16px;
        position: relative;
        --a: red;
        --cc: yellow;

        --header: {
          position: absolute;
          top: 2px;
          left: 2px;
        };
        --left-setting: {
          position: absolute;
          left: 4px;
          top: 14px;
        };
        --s-header: {
          font-size: 10px;
          font-weight: bold;
        };
      }

      .header {
        @apply(--header);
      }

      x-setting.a {
        @apply(--left-setting);
      }

      x-setting.cc {
        position: absolute;
        left: 64px;
        top: 14px;
      }

      .container {
        margin: 16px;
        padding: 16px;
      }

      .ss-c {
        margin: 12px;
        --ss-transform: rotate(30deg);
      }

      @media(min-width: 800px) {
        .ss-c {
          --ss-transform: rotate(-30deg);
        }
      }

    </style>
    <div class="header">x-app</div>
    <x-setting class="a">--a</x-setting>
    <x-setting class="cc">--cc</x-setting>

    <div class="horizontal layout">
      <div class="container flex horizontal center-center layout">
        <x-s></x-s>
      </div>

      <x-view1 class="flex-2 horizontal center-center layout"></x-view1>

    </div>

    <div class="container horizontal layout wrap">
      <template is="dom-repeat" items="{{items}}">
        <div class="horizontal layout">
          <span>{{item.index}}</span>
          <x-ss class="ss-c"></x-ss>
        </div>
      </template>
    </div>
`,

  is: 'x-app',

  listeners: {
    'setting-change': 'settingChange'
  },

  properties: {
    items: {
      value: function() {
        var items = [];
        for (var i = 0; i < 250; i++) {
          items.push({index: i});
        }
        return items;
      }
    }
  },

  clickHandler: function() {
    d = document.createElement('div');
    d.innerHTML = 'Added!';
    var children = dom(this.root).childNodes;
    var ref = children[Math.floor(children.length * Math.random(children.length))];
    var ref = children[0];
  },

  settingChange: function(e) {
    var target = e.composedPath()[0];
    var host = target.getRootNode().host;
    const obj = {};
    obj[target.setting] = 'rgb(' +
      Math.round(Math.random() * 255) + ',' +
      Math.round(Math.random() * 255) + ',' +
      Math.round(Math.random() * 255) + ')';
    console.time('updateStyles');
    host.updateStyles(obj);
    document.body.offsetWidth;
    console.timeEnd('updateStyles');
  }
});
