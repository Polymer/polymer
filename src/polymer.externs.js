/**
 * @fileoverview Closure compiler externs for the Polymer library.
 *
 * @externs
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt. The complete set of authors may be
 * found at http://polymer.github.io/AUTHORS.txt. The complete set of
 * contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt. Code
 * distributed by Google as part of the polymer project is also subject to an
 * additional IP rights grant found at http://polymer.github.io/PATENTS.txt.
 */

/**
 * @param {string} name The name of the declared Polymer element.
 * @param {PolymerElement} prototype The prototype of the element.
 */
var Polymer = function(name, prototype) {};


/** @constructor @extends {HTMLElement} */
var PolymerElement = function() {
  /** @type {Object.<string, !HTMLElement>} */
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
 * Callback fired when an attribute on the element has been added, changed, or
 * removed.
 *
 * @param {string} name The name of the attribute that changed.
 * @param {*} oldValue The previous value of the attribute, or null if it was
 *     added.
 * @param {*} newValue The new value of the attribute, or null if it was
 *     removed.
 * @param {string} namespace The namespace of the attribute.
 */
PolymerElement.prototype.attributeChanged = function(
    name, oldValue, newValue, namespace) {};

/**
 * Fire a callback when the light DOM children of an element changes.
 * `callback` is called at most once, and should re-register with onMutation
 * if it cares about further changes to the light DOM.
 *
 * @param {!Node} domNode The node to observe for changes. Often
 *     the polymerElement itself.
 * @param {function(!MutationObserver, !Array.<!MutationRecord>)} callback
 *     The function to call when changes happen.
 */
PolymerElement.prototype.onMutation = function(domNode, callback) {};


/**
 * Call the callback after a given timeout.
 *
 * @param {(Function|string)} callback The function to call after the delay.
 *     Called with `this` bound to the polymerElement.
 * @param {Array=} opt_args Arguments to pass to callback.
 * @param {number=} opt_timeoutMillis Minimum delay in milliseconds before
 *     calling the callback.
 * @return {number} A handle for `#cancelAsync()`
 */
PolymerElement.prototype.async = function(
    callback, opt_args, opt_timeoutMillis) {};

/**
 * Cancels the async operation with the given handle from executing if
 * it hasn't yet run. See `#async()`.
 *
 * @param {number} handle The handle for the async operation to cancel.
 */
PolymerElement.prototype.cancelAsync = function(handle) {};


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


/**
 * When called inside an overriden function of a super class, calls the super
 * class's implementation of that function with the given arguments array.
 *
 * @param {Array<*>=} args The arguments to pass to the super class function.
 */
PolymerElement.prototype.super = function(args) {};


/**
 * Fire an event.
 *
 * @param {string} type An event name.
 * @param {*=} detail
 * @param {Node=} onNode Target node.
 * @param {boolean=} bubbles Set false to prevent bubbling, defaults to true.
 * @param {boolean=} cancelable Set false to prevent cancellation, defaults to
 *     true.
 * @return {Object} event
 */
PolymerElement.prototype.fire =
    function(type, detail, onNode, bubbles, cancelable) {};


/** @constructor @extends {HTMLInputElement} */
var InputElement = function() {
};

