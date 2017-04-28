/**
 * @fileoverview Externs for Polymer
 * @externs
 */

/**
 * @param {!{is: string}} init
 * @return {!HTMLElement}
 */
function Polymer(init){}

/**
 * @type {(function(*,string,string,Node):*)|undefined}
 */
Polymer.sanitizeDOMValue;

/**
 * @param {string} string
 * @param {Object} obj
 * @return {string}
 */
function JSCompiler_renameProperty(string, obj) {}

/** @record */
function PolymerTelemetry(){}
/** @type {number} */
PolymerTelemetry.prototype.instanceCount;
/** @type {Array<HTMLElement>} */
PolymerTelemetry.prototype.registrations;
/** @type {function(HTMLElement)} */
PolymerTelemetry.prototype._regLog;
/** @type {function(HTMLElement)} */
PolymerTelemetry.prototype.register;
/** @type {function(HTMLElement)} */
PolymerTelemetry.prototype.dumpRegistrations;