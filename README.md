# Polymer "alacarte"
Exploratory code working up towards the Polymer 2.0 release.
## Overarching goals
* Custom Elements and Shadow DOM v1 support
* Polymer 2.0 components look just like “vanilla” web components from the outside
  * Remove the need for `Polymer.dom` calls
  * Remove the requirement for `set`/`notifyPath` path notifications in data-binding
* Rough edges sanded off of current data binding system
  * Batch changes and run effects for set of changes in well-defined order (compute, notify, propagate, observe)
  * Remove multi-property `undefined` rule
  * TBD: provide alternatives to object-identify array tracking
* Improved code factoring
  * Refactored into decoupled libraries that can stand on their own and be composed using raw ES6 classes
  * Any optional parts (e.g. shady shim, style shim, template elements, etc.) opt-in and not loaded/required by default
* Provide a minimally-breaking API surface area from Polymer 1.0, to the extent allowed given the above goals

## How to use & caveats
Alacarte includes a Polymer 1.0 "Backward Compatibility" (BC) layer loadable via `alacarte/polymer.html` that attempts to provide as close to the same API and semantics for using Polymer as possible.  Notes on usage:
* In order to test existing code that references `polymer/polymer.html`, you'll need to check out `alacarte` as `polymer`, or else redirect `polymer/polymer.html` to `alacarte/polymer.html`.
* ShadowDOM V1 is used *by default* if it is available (Chrome 54). To force ShadowDOM V0 to be used, set `Polymer.shadowDomV0=true` or `?shadowDomV0=true`.
* ShadyDom is used when the requested version of ShadowDOM is not available OR when `ShadyDom.force=true` or `?forceShadyDom=true`.
* By default, `Polymer()` will attempt to register V1 `customElements.define` if present (via polyfill or native), but will fallback to V0 `document.registerElement`
* To use the Custom Elements V1 polyfill, check out / bower link the `v1-polymer-edits` branch of `webcomponentsjs` and load `webcomponentsjs/webcomponents-lite.js`.  You can control which polyfill/native support is used via these query string flags:
  - `?wc-ce=v1` uses V1 polyfill & uses native V1 when present (start Canary with `--enable-blink-features=CustomElementsV1` flag to test native V1 support)
  - `?wc-ce=v1&wc-register` uses V1 polyfill _even if_ native present
  - `?wc-ce=v0` uses V0 polyfill & uses native V0 when present (forces `window.customElements = null`)
  - `?wc-ce=v0&wc-register` uses V0 polyfill _even if_ native present
* You should continue to use `created` and `attached` Polymer callbacks when using the V1 CE polyfill, despite the name changes in the V1 spec.
* Style selector shimming is implemented when needed. This is necessary when ShadyDom is in use and provides style encapsulation.
* Custom properties:
   * Native css custom properties are used by default (different from 1.0) on all browser that support them: Chrome, FF, Safari 10/Tech Preview. Native @apply is used where supported: Canary + experimental web platform features. When not available, @apply is emulated via custom properties (e.g. --foo { color: red; } becomes --foo_-_color: red;)
   * Custom properties are shimmed on other browsers (Safari 9, IE/Edge). This is currently implemented for elements, not yet implemented for custom-style.
   * To force custom properties to be shimmed: `Polymer.forceShimCssProperties=true` or `?forceShimCssProperties=true`.
* custom-style: does not currently work in HTMLImports when native v1 custom elements are used (edited)

## Not yet implemented
* Some utility functions are not yet implemented
    * A number of utility functions that were previously on the Polymer 1.0 element prototype are not ported over yet.  These will warn with "not yet implemented" warnings.
* `<array-selector>` not yet implemented
* `Polymer.dom`: currently *most* of this is emulated, but some api's may be missing. Please file issues after checking to see if the missing behavior is an intended breaking change.
* `Polymer.dom.observeNodes`: we're likely going to provide a breaking replacement for this that's more in the spirit of ShadowDom V1.

## Breaking Changes
This is a list of proposed/intentional breaking changes as implemented in the current incantation of this repo.  If you find changes that broke existing code or rules, please raise and we'll need to decide whether they are expected/intentional or not.

Note that some of the items listed below have been temporarily shimmed to make testing existing code easier, but will be removed in the future.

### ShadyDOM
We've removed the need to use `Polymer.dom` by patching the dom as necessary so that the api is mostly equivalent to ShadowDOM. The result is not as correct as the ShadowDOM polyfill, but it's also less intrusive since nodes are not wrapped but patched on demand. Currently all dom tree accessors and mutation and query methods should be patched on relevant nodes. Some nodes that could/should be patched are not currently. For testing/debugging, you can test if a node is patched by looking at the `__patched` property. Please note that `MutationObservers` are *not* patched and will return incorrect information. There are 2 workarounds until a better replacement for `Polymer.dom.observeNodes` is implemented. The `slotchange` event is implemented. You can use a filtering strategy to capture mutations in the same root as the observed element as shown here: https://github.com/PolymerLabs/alacarte/blob/master/test/smoke/shady-slot-observer.html#L78.

### Events
Events that are listened to on patched elements are patched. They have the (beginnings of the) ShadowDOM V1 spec info for events:
* `target` should be the same target as in ShadowDOM, also the same as `Polymer.dom(event).localTarget`
* `composedPath()` should be the same as in ShadowDOM, also the same as `Polymer.dom(event).path`. Note that `Polymer.dom(event).rootTarget` has been removed and instead you should use `event.composedPath()[0]`.
* `element.unlisten` is not supported for events set up with the `listeners` object in the `Polymer()` call.

### Styling
* Drop invalid syntax
  * `:root {}`
    * Should be `:host > * {}` (in a shadow root)
    * Should be `html {}` (in main document)
    * Thus, cannot share old `:root` styles for use in both main document and shadow root
  * `var(--a, --b)`
    * Should be `var(--a, var(--b))`
  * `@apply(--foo)`
    * Should be `@apply --foo;`
* Native CSS Custom Properties by default
* `element.customStyle` has been removed, use `element.updateStyles({}) instead.`
* `<style>` inside of a `<dom-module>`, but outside of `<template>` is no longer supported
* Drop scope crossing selectors
  * ::shadow, /deep/, :host-context()
* Replace ::content with ::slotted()
  * Can only style distributed child nodes, must give a compound selector to ::slotted();
* Imperativly created custom-styles, `document.createElement('style', 'custom-style')`, are no longer supported.

### Element definitions
* Extending native elements (`is`): We will not produce `is` elements. Although still included in the v1 custom elements [spec](https://html.spec.whatwg.org/#custom-elements-customized-builtin-example) and scheduled for implementation in Chrome, because Apple [has stated](https://github.com/w3c/webcomponents/issues/509#issuecomment-233419167) it will not implmenent `is`, we will not be encouraging its use. Instead, a wrapper custom element can surround a native element, e.g. `<a is="my-endpoint">...</a>` could become `<my-endpoint><a>...</a></my-endpoint>`. Users will need to change existing `is` elements where necessary.
* All template type extensions have now been changed to standard custom elements that take a `<template>` in their light dom,  e.g.

  ```
<template is="dom-repeat" items="{{items}}">...</template>
  ```

  should change to

  ```
<dom-repeat items="{{items}}">
    <template>...</template>
</dom-repeat>
  ```

  For the time being, `Polymer()` will automatically wrap template extensions used in Polymer element templates during template processing for backward-compatibility, although we may decide to remove this auto-wrapping in the future.  Templates used in the main document must be manually wrapped.
* The `custom-style` element has also been changed to a standard custom element that must wrap a style element. In addition, the style element must contain a `type="custom-style"` attribute (so that it does not parse),  e.g.

 ```
 <style is="custom-style">...</style>
   ```

   should change to

   ```
 <custom-style>
     <style type="custom-style">...</style>
 </custom-style>
   ```

* TBD: `dom-if`, `dom-repeat`, `dom-bind`, `array-selector`, etc. will not included in `polymer.html` by default (going forward; they currently are); users should import those elements when needed

### Removed API
* `Polymer.instanceof` and `Polymer.isInstance`: no longer needed, use 
`instanceof` instead.
* `dom-module`: Removed ability to use `is` and `name` attribute to 
configure the module name. The only supported declarative way set the module 
id is to use `id`.
* `element.getPropertyInfo`: This api returned unexpected information some of the time and was rarely used.
* `element.beforeRegister`: This was originally added for metadata compatibility with ES6 classes. We now prefer users create ES6 classes via `Polymer.Element`, specifying metadata in the static `config` property. For legacy use via `Polymer({...})`, dynamic effects may now be added using the `registered` lifecycle method.
* `listeners`: Removed ability to use `id.event` to add listeners to elements in local dom. Use declarative template event handlers instead. 

### Polymer element prototype
* Methods starting with `_` are not guaranteed to exist (most have been removed)

### Behaviors: Background Info
Behaviors continue to be supported but the implementation has changed. This should be transparent but for background, in 1.0 behaviors mixed directly onto the element prototype and special care was taken to call all lifecycle methods. Now, behaviors are in the element's prototype chain (implemented via class expression mixins) and lifecycle methods are called via super. **This should not change any user code in behaviors.** Here's a sketch of the implementation of what happens when the user calls `Polymer({ ... behaviors: [..., [], ...] })`:
* a base `Polymer.CompatElement` becomes the element base class. Note, `Polymer.CompatElement` extends `Polymer.Element`. `Polymer.Element` adds the minimal api an element needs to use Polymer's data binding system, and `Polymer.CompatElement` adds all Polymer 1.0 element api.
* then behaviors are mixed into it using generated class expressions. 
  * first, behaviors are flattened into a single de-duplicated array
  * then a generated class expression is created for each behavior and this extends the base class
  * the generated class has the behavior properties mixed into it, implements all Polymer 1.0 lifecycle entry points calling `super.method` and then the behavior's implementation, and transforms metadata into the form `Polymer.Element` expects, a static `config` object.
* the class is then extended with a generated class for the object passed to `Polymer` and the element's static `is` property is set.
* finally, `customElements.define` is called on the the resulting class.
 
The resulting class prototype chain will look like this:
* `HTMLElement`
* `Polymer.Element`
* `Polymer.CompatElement`
* 0 or more generated classes for behaviors
* generated class for the element

### Element lifecycle
* Attached: no longer deferred until first render time. Instead when measurement is needed use... API TBD.
* `lazyRegister` option removed and is now “on” by default
* Experimental: `listeners` and `hostAttributes` are deferred until "afterNextRender", since the majority uses of these should not be initial paint-blocking.  Please help identify use cases where paint-blocking host attributes/listeners are useful/needed.
* Requst to early-users: We would really like to remove the `ready` callback, since its use is generally anti-pattern-ish, and it's hard to document when a "one-shot callback that runs after all local dom & observers have flushed" should actually be used, as opposed to running said code in an observer.  In exploring alacarte, please try to avoid `ready` and help identify use cases where it is useful/needed.

### Data
* Template not stamped & data system not initialized (observers, bindings, etc.) until attached (or until microtask, if we go the async by default route)
  * Fallout from V1 changes, since attributes not readable in constructor
* Re-setting an object or array no longer ditry checks, meaning you can make deep changes to an object/array and just re-set it, without needing to use `set`/`notifyPath`.
* Inline computed annotations run unconditionally at initialization, regardless if any arguments are defined (and will see undefined for undefined arguments) <-- the inconsistency between this and how normal observers/computed runs is probably not justifiable; will probably revisit
* Inline computed annotations are always “dynamic” (e.g. setting/changing the function will cause the binding to re-compute)
* Other method effects (multi-prop observers, computed) called once at initialization if any arguments are defined (and will see undefined for undefined arguments)
‘notify’ events not fired when value changes as result of binding from host
* In order for a property to be deserialized from its attribute, it must be declared in the `properties` metadata object

### Other
* Shadow DOM v1
  * `<content select="...">` → `<slot name="...">`
  * Selectively distributed content needs to add `slot` attribute
* Custom Elements v1
  * Applies to any “raw” custom elements (e.g. test-fixture)
    * createdCallback → constructor
      * Basically can only set instance properties
      * Must not inspect attributes, children, parent
    * attachedCallback → connectedCallback
* Alacarte code uses ES2015 syntax, and can be run without transpilation in current Chrome, Safari Technology Preview, FF, and Edge.  Transpilation is required to run in IE11 and Safari 9; we don't yet have an out-of-the-box workflow for this yet, but is coming.

### A new way to write elements...
Why? In V1 custom elements, elments are expected to be defined using an ES6 class. This is the only* way the element constructor can be called. For this reason, we've evolved a new way to write elements using ES6 classes. *Any new code written for Polymer 2.0 should be written this way.* We'd like feedback on the following api. 
* extend from `Polymer.Element`. This class provides the minimal surface area to integrate with 2.0's data binding system. It provides only standard custom element lifecycle with the exception of `ready`. (You can extend from `Polymer.CompatElement` to get all of the Polymer 1.0 element api, but since most of this api was rarely used, this should not often be needed.)
* implement "behaviors" as mixins that return class expressions
* property metadata should be put on the class as a static in a property called `config`
* element's `is` property should be defined as a static on the class
* `listeners` and `hostAttributes` have been removed from element metadata; they can be installed how and when needed but for convenience `addListeners` and `ensureAttributes` are available and respectively take arguments the same as the old metadata objects. The ability to reference other elements in the listeners object has been removed (e.g. `'foo.tap': 'myHandler'`)

```
class MyElement extends Polymer.Element {
  static get is() { return 'x-foo'; }
  
  static get config() {
    return {
      properties: { 
        // same as 1.0 
      },
      observers: [
        // same as 1.0 
      ]
    }
  }
  
  constructor() {
    super();
    // ...
  }
  
  ready() {
    super.ready();
    this.addListeners({
      'tap': '_tapHandler'
    }
    this.ensureAttributes({
      tabIndex: 0,
      role: 'button'
    });
  }
}

customElements.define(MyElement.is, MyElement);
```

Here's a behavior/mixin example:

```
function MyMixin(superclass) {
  return class extends superclass {
    static get config() { return /* config object same as above */ }
    
    // anything else you'd want to do in an element class... call super as needed...
  }
}
```

Usage of mixin:

```
class MyElement extends MyMixin(Polymer.Element) {

  static get is() { return 'x-foo'; }

  ...
 
}
```

Visualization of 1.0 `Polymer({...})` --> 2.0 `class extends Polymer.Element` [changes here](https://docs.google.com/presentation/d/1Yg-KcS48WeqxqGBLUZOEngFFRPgZJ0fnNGCkzn1kBqU/edit#slide=id.p).
