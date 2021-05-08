// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {LegacyElementMixinConstructor} from './legacy-element-mixin.js';
import {ElementMixinConstructor} from '../mixins/element-mixin.js';
import {PropertyEffectsConstructor} from '../mixins/property-effects.js';
import {TemplateStampConstructor} from '../mixins/template-stamp.js';
import {PropertyAccessorsConstructor} from '../mixins/property-accessors.js';
import {PropertiesChangedConstructor} from '../mixins/properties-changed.js';
import {PropertiesMixinConstructor} from '../mixins/properties-mixin.js';
import {GestureEventListenersConstructor} from '../mixins/gesture-event-listeners.js';
import {DirMixinConstructor} from '../mixins/dir-mixin.js';

export {mixinBehaviors};

/**
 * Helper type to get the intersection of all types in a tuple.
 */
type Intersection<T extends any[]> = T extends [infer U, ...infer V] ? U & Intersection<V> : unknown;

/**
 * Mixins applied by LegacyElementMixin.
 */
type LegacyElementMixins = LegacyElementMixinConstructor & ElementMixinConstructor & PropertyEffectsConstructor & TemplateStampConstructor & PropertyAccessorsConstructor & PropertiesChangedConstructor & PropertiesMixinConstructor & GestureEventListenersConstructor & DirMixinConstructor;

/**
 * Applies a "legacy" behavior or array of behaviors to the provided class.
 *
 * Note: this method will automatically also apply the `LegacyElementMixin`
 * to ensure that any legacy behaviors can rely on legacy Polymer API on
 * the underlying element.
 *
 * @returns Returns a new Element class extended by the
 * passed in `behaviors` and also by `LegacyElementMixin`.
 */
declare function mixinBehaviors<T, U>(behaviors: [U], klass: {new(): T}): {new(): T & U} & LegacyElementMixins;
declare function mixinBehaviors<T, U, V>(behaviors: [U, V], klass: {new(): T}): {new(): T & U & V} & LegacyElementMixins;
declare function mixinBehaviors<T, U, V, W>(behaviors: [U, V, W], klass: {new(): T}): {new(): T & U & V & W} & LegacyElementMixins;
declare function mixinBehaviors<T, U extends any[]>(behaviors: U, klass: {new(): T}): {new(): T & Intersection<U>} & LegacyElementMixins;
declare function mixinBehaviors<T, U>(behavior: U, klass: {new(): T}): {new(): T & U} & LegacyElementMixins;

export {Class};


/**
 * Generates a class that extends `LegacyElement` based on the
 * provided info object.  Metadata objects on the `info` object
 * (`properties`, `observers`, `listeners`, `behaviors`, `is`) are used
 * for Polymer's meta-programming systems, and any functions are copied
 * to the generated class.
 *
 * Valid "metadata" values are as follows:
 *
 * `is`: String providing the tag name to register the element under. In
 * addition, if a `dom-module` with the same id exists, the first template
 * in that `dom-module` will be stamped into the shadow root of this element,
 * with support for declarative event listeners (`on-...`), Polymer data
 * bindings (`[[...]]` and `{{...}}`), and id-based node finding into
 * `this.$`.
 *
 * `properties`: Object describing property-related metadata used by Polymer
 * features (key: property names, value: object containing property metadata).
 * Valid keys in per-property metadata include:
 * - `type` (String|Number|Object|Array|...): Used by
 *   `attributeChangedCallback` to determine how string-based attributes
 *   are deserialized to JavaScript property values.
 * - `notify` (boolean): Causes a change in the property to fire a
 *   non-bubbling event called `<property>-changed`. Elements that have
 *   enabled two-way binding to the property use this event to observe changes.
 * - `readOnly` (boolean): Creates a getter for the property, but no setter.
 *   To set a read-only property, use the private setter method
 *   `_setProperty(property, value)`.
 * - `observer` (string): Observer method name that will be called when
 *   the property changes. The arguments of the method are
 *   `(value, previousValue)`.
 * - `computed` (string): String describing method and dependent properties
 *   for computing the value of this property (e.g. `'computeFoo(bar, zot)'`).
 *   Computed properties are read-only by default and can only be changed
 *   via the return value of the computing method.
 *
 * `observers`: Array of strings describing multi-property observer methods
 *  and their dependent properties (e.g. `'observeABC(a, b, c)'`).
 *
 * `listeners`: Object describing event listeners to be added to each
 *  instance of this element (key: event name, value: method name).
 *
 * `behaviors`: Array of additional `info` objects containing metadata
 * and callbacks in the same format as the `info` object here which are
 * merged into this element.
 *
 * `hostAttributes`: Object listing attributes to be applied to the host
 *  once created (key: attribute name, value: attribute value).  Values
 *  are serialized based on the type of the value.  Host attributes should
 *  generally be limited to attributes such as `tabIndex` and `aria-...`.
 *  Attributes in `hostAttributes` are only applied if a user-supplied
 *  attribute is not already present (attributes in markup override
 *  `hostAttributes`).
 *
 * In addition, the following Polymer-specific callbacks may be provided:
 * - `registered`: called after first instance of this element,
 * - `created`: called during `constructor`
 * - `attached`: called during `connectedCallback`
 * - `detached`: called during `disconnectedCallback`
 * - `ready`: called before first `attached`, after all properties of
 *   this element have been propagated to its template and all observers
 *   have run
 *
 * @returns Generated class
 */
declare function Class<T>(info: PolymerInit, mixin: (p0: T) => T): {new(): HTMLElement};

import {PolymerInit} from '../../interfaces';
