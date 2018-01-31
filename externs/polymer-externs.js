/**
 * @fileoverview Externs for Polymer Pass and external Polymer API
 * @externs
 *
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/* eslint-disable */

/**
 * @typedef {{
 * type: !Function,
 * value: *,
 * readOnly: (boolean | undefined),
 * computed: (string | undefined),
 * reflectToAttribute: (boolean | undefined),
 * notify: (boolean | undefined),
 * observer: (string | function(*,*) | undefined)
 * }}
 */
let PolymerElementPropertiesMeta;

/**
 * @typedef {Object<string, !PolymerElementPropertiesMeta>}
 */
let PolymerElementProperties;

let PolymerInit = function(){};
/** @type {string} */
PolymerInit.prototype.is;
/** @type {(string | undefined)} */
PolymerInit.prototype.extends;
/** @type {(!PolymerElementProperties | undefined)} */
PolymerInit.prototype.properties;
/** @type {(!Array<string> | undefined)} */
PolymerInit.prototype.observers;
/** @type {(!HTMLTemplateElement | string | undefined)} */
PolymerInit.prototype.template;
/** @type {(!Object<string, *> | undefined)} */
PolymerInit.prototype.hostAttributes;
/** @type {(!Object<string, string> | undefined)} */
PolymerInit.prototype.listeners;

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

let PropertiesMixinConstructor = function (){};
/** @type {(!PolymerElementProperties | undefined)} */
PropertiesMixinConstructor.properties;

/**
 * @param {!PolymerInit} init
 * @return {!function(new:HTMLElement)}
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

/** @type {string} */
Polymer.version;

// nb. This is explicitly 'var', as Closure Compiler checks that this is the case.
/**
 * @constructor
 * @extends {HTMLElement}
 * @implements {Polymer_LegacyElementMixin}
 */
var PolymerElement = Polymer.LegacyElementMixin();
