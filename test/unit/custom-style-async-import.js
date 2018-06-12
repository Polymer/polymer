import { Polymer } from '../../lib/legacy/polymer-fn.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<custom-style>
<style is="custom-style">
  html {
    --cs-blue: {
      border : 8px solid blue;
    };
  }
</style>
</custom-style>
<dom-module id="x-client">
<template>
  <style>
    :host {
      display: inline-block;
      border : 4px solid red;
      @apply (--cs-blue);
    }
  </style>
  x-client
</template>
</dom-module>`;

document.body.appendChild($_documentContainer.content);

Polymer({
  is: 'x-client'
});
