import { Class } from './class.js';

export const Polymer = function(info) {
  // if input is a `class` (aka a function with a prototype), use the prototype
  // remember that the `constructor` will never be called
  let klass;
  if (typeof info === 'function') {
    klass = info;
  } else {
    klass = Class(info);
  }
  customElements.define(klass.is, /** @type {!HTMLElement} */(klass));
  return klass;
};
