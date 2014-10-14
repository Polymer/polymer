/** @externs @fileoverview Externs for the Polymer library. */

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

/**
 * Fire a callback when the light DOM children of an element changes.
 * `callback` is called at most once, and should re-register with onMutation
 * if it cares about further changes to the light DOM.
 *
 * @param {HTMLElement} domElement The element to observe for changes. Often
 *     the polymerElement itself.
 * @param {Function} callback The function to call when changes happen.
 */
PolymerElement.prototype.onMutation = function(domElement, callback) {};

/**
 * Call the callback after a given timeout.
 *
 * @param {Function} callback The function to call after the delay. Called with
 *     `this` bound to the polymerElement.
 * @param {Array=} opt_args Arguments to pass to callback.
 * @param {number=} opt_timeoutMillis Minimum delay in milliseconds before
 *     calling the callback.
 */
PolymerElement.prototype.async = function(
      callback, opt_args, opt_timeoutMillis) {};

/**
 * Call the callback after a timeout. Calling job again with the same name
 * resets the timer but will not result in additional calls to callback.
 *
 * @param {string} name
 * @param {Function} callback
 * @param {number} timeoutMillis The minimum delay in milliseconds before
 *     calling the callback.
 */
PolymerElement.prototype.job = function(name, callback, timeoutMillis) {};
