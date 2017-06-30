/**
 * @fileoverview Externs for Polymer
 * @externs
 */

/* eslint-disable */

/**
 * @typedef {{
 * value: *,
 * type: (!Function | undefined),
 * readOnly: (boolean | undefined),
 * computed: (string | undefined),
 * reflectToAttribute: (boolean | undefined),
 * notify: (boolean | undefined),
 * observer: (string | undefined)
 * }}
 */
let PolymerElementPropertiesMeta;

/**
 * @typedef {Object<string, !PolymerElementPropertiesMeta>}
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

let PolymerElementConstructor = function (){};
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

/** @type {PolymerElementProperties} */
Polymer.ElementProperties;

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
PolymerTelemetry.instanceCount;
/** @type {Array<HTMLElement>} */
PolymerTelemetry.registrations;
/** @type {function(HTMLElement)} */
PolymerTelemetry._regLog;
/** @type {function(HTMLElement)} */
PolymerTelemetry.register;
/** @type {function(HTMLElement)} */
PolymerTelemetry.dumpRegistrations;;

/** @type {PolymerTelemetry} */
Polymer.telemetry;

/** @type {boolean} */
Polymer_PropertyAccessors.prototype.__serializing;
/** @type {number} */
Polymer_PropertyAccessors.prototype.__dataCounter;
/** @type {boolean} */
Polymer_PropertyAccessors.prototype.__dataEnabled;
/** @type {boolean} */
Polymer_PropertyAccessors.prototype.__dataReady;
/** @type {boolean} */
Polymer_PropertyAccessors.prototype.__dataInvalid;
/** @type {!Object} */
Polymer_PropertyAccessors.prototype.__data;
/** @type {Object} */
Polymer_PropertyAccessors.prototype.__dataPending;
/** @type {Object} */
Polymer_PropertyAccessors.prototype.__dataOld;
/** @type {Object} */
Polymer_PropertyAccessors.prototype.__dataProto;
/** @type {Object} */
Polymer_PropertyAccessors.prototype.__dataHasAccessor;
/** @type {Object} */
Polymer_PropertyAccessors.prototype.__dataInstanceProps;

/** @type {boolean} */
Polymer_PropertyEffects.prototype.__dataClientsReady;
/** @type {Array} */
Polymer_PropertyEffects.prototype.__dataPendingClients;
/** @type {Object} */
Polymer_PropertyEffects.prototype.__dataToNotify;
/** @type {Object} */
Polymer_PropertyEffects.prototype.__dataLinkedPaths;
/** @type {boolean} */
Polymer_PropertyEffects.prototype.__dataHasPaths;
/** @type {Object} */
Polymer_PropertyEffects.prototype.__dataCompoundStorage;
/** @type {Polymer_PropertyEffects} */
Polymer_PropertyEffects.prototype.__dataHost;
/** @type {!Object} */
Polymer_PropertyEffects.prototype.__dataTemp;
/** @type {boolean} */
Polymer_PropertyEffects.prototype.__dataClientsInitialized;
/** @type {Object} */
Polymer_PropertyEffects.prototype.__computeEffects;
/** @type {Object} */
Polymer_PropertyEffects.prototype.__reflectEffects;
/** @type {Object} */
Polymer_PropertyEffects.prototype.__notifyEffects;
/** @type {Object} */
Polymer_PropertyEffects.prototype.__propagateEffects;
/** @type {Object} */
Polymer_PropertyEffects.prototype.__observeEffects;
/** @type {Object} */
Polymer_PropertyEffects.prototype.__readOnly;
/** @type {!TemplateInfo} */
Polymer_PropertyEffects.prototype.__templateInfo;