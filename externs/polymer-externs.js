/**
 * @fileoverview Externs for Polymer
 * @externs
 */

/* eslint-disable */

/**
 * @typedef Object<string, {
 *   value: *,
 *   type: (Function | undefined),
 *   readOnly: (boolean | undefined),
 *   computed: (string | undefined),
 *   reflectToAttribute: (boolean | undefined),
 *   notify: (boolean | undefined),
 *   observer: (string | undefined)
 * }>)
 */
let PolymerElementProperties;

/**
 * @typedef {{
 *   is: string,
 *   extends: (string | undefined),
 *   properties: (!PolymerElementProperties | undefined),
 *   observers: (!Array<string> | undefined),
 *   template: (!HTMLTemplateElement | string | undefined),
 *   hostAttributes: (!Object<string, *> | undefined),
 *   listeners: (!Object<string, string> | undefined)
 * }}
 */
let PolymerInit;

let PolymerElementConstructor = function () { };
/** @type {(string | undefined)} */
PolymerElementConstructor.is;
/** @type {(string | undefined)} */
PolymerElementConstructor.extends;
/** @type {(!PolymerElementProperties | undefined)} */
PolymerElementConstructor.properties;
/** @type {(!Array<string> | undefined)} */
PolymerElementConstructor.observers;
/** @type {(!HTMLTemplateElement | string | undefined)} */
PolymerElementConstructor.template;

/**
 * @param {!PolymerInit} init
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