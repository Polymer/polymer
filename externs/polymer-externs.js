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

/**
 * @typedef {{
 * name: (string | undefined),
 * structured: (boolean | undefined),
 * wildcard: (boolean | undefined)
 * }}
 */
var DataTrigger;

/**
 * @typedef {{
 * info: ?,
 * trigger: (!DataTrigger | undefined),
 * fn: (!Function | undefined)
 * }}
 */
var DataEffect;

/**
 * @record
 * @extends {Polymer_PropertyEffects}
 */
function PropertyEffectsInstance(){}
/** @type {Object<string, !Array<!DataEffect>>} */
PropertyEffectsInstance.prototype.__computeEffects;
/** @type {Object<string, !Array<!DataEffect>>} */
PropertyEffectsInstance.prototype.__reflectEffects;
/** @type {Object<string, !Array<!DataEffect>>} */
PropertyEffectsInstance.prototype.__notifyEffects;
/** @type {Object<string, !Array<!DataEffect>>} */
PropertyEffectsInstance.prototype.__propagateEffects;
/** @type {Object<string, !Array<!DataEffect>>} */
PropertyEffectsInstance.prototype.__observeEffects;
/** @type {Object<string, !Array<!DataEffect>>} */
PropertyEffectsInstance.prototype.__readOnly;
/** @type {Object} */
PropertyEffectsInstance.prototype.__data;