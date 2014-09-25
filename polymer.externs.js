/**
 * @param {string} name The name of the declared Polymer element.
 * @param {PolymerElement} prototype The prototype of the element.
 */
var Polymer = function(name, prototype) {};


/** @constructor @extends {HTMLElement} */
var PolymerElement = function() {
  /** @type {Object.<string, HTMLElement>} */
  this.$;
};

// Canonical docs for these lifecycle callbacks are here:
// http://www.polymer-project.org/docs/polymer/polymer.html#lifecyclemethods

/** On create callback. */
PolymerElement.prototype.created = function() {};
/** On ready callback. */
PolymerElement.prototype.ready = function() {};
/** On attached to the DOM callback. */
PolymerElement.prototype.attached = function() {};
/** On DOM ready callback. */
PolymerElement.prototype.domReady = function() {};
/** On detached from the DOM callback. */
PolymerElement.prototype.detached = function() {};
