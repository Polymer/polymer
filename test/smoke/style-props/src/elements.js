import './elements-defaults.js';
import { Polymer } from '../../../../lib/legacy/polymer-fn.js';
import { html } from '../../../../lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="simple-layout-styles">
      :host {
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        background-color: lightblue;
        @apply(--x-s);
      }

      .container {
        height: 100px;
        width: 100px;
      }

      section {
        box-sizing: border-box;
        margin: 1px;
        width: 48px;
        height: 48px;
        border: 1px solid black;
        border-radius: 4px;
      }

      .header {
        @apply(--s-header);
      }

      .a {
        background-color: var(--a, #eee);
      }

      .b {
        background-color: var(--b, #eee);
      }

      .c {
        background-color: var(--c, #eee);
      }

      .d {
        background: -webkit-linear-gradient(top right, #777, white);
      }
    </style>
    <div class="header">x-s</div>
    <div class="container horizontal wrap layout">
      <section class="center-center horizontal layout a">--a</section>
      <section class="center-center horizontal layout b">--b</section>
      <section class="center-center horizontal layout c">--c</section>
      <section class="d"></section>
    </div>
`,

  is: 'x-s'
});
Polymer({
  _template: html`
    <style include="simple-layout-styles">
      :host {
        background-color: goldenrod;
        transform: var(--ss-transform);
        -webkit-transform: var(--ss-transform);
        @apply(--x-s);
      }

      .container {
        height: 100px;
        width: 50px;
      }

      section {
        box-sizing: border-box;
        width: 48px;
        height: 48px;
        margin: 1px;
        border: 1px solid black;
        border-radius: 4px;
      }

      .header {
        @apply(--s-header);
      }

      .a {
        background-color: var(--a, #eee);
      }

      .b {
        background: -webkit-linear-gradient(top right, #777, white);
      }

    </style>
    <div class="header">x-ss</div>
    <div class="container horizontal wrap layout">
      <section class="center-center horizontal layout a">--a</section>
      <section class="center-center horizontal layout b"></section>
    </div>
`,

  is: 'x-ss'
});
