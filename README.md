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
* At this moment, the Shady DOM shim is not included in `polymer.html`, meaning elements that create shadow roots will only run in Chrome.  To opt-in to testing Shady DOM, load `alacarte/src/shady/shady.html` in your app/demo.  When loaded, all browsers will use Shady DOM, even where native Shadow DOM exists.
* The Shady DOM shim currently does not automatically shim styles.  As such, styling will not be correct when using Shady DOM (although the tree traversal API's will be properly scoped).
* To use the Custom Elements V1 polyfill, check out / bower link the `v1-polymer-edits` branch of `webcomponentsjs` and load `webcomponentsjs/webcomponents-lite.js`.  That branch also supports a switch to fall back to the old V0 polyfill (`?wc-ce=v0`).
* You should continue to use `created` and `attached` Polymer callbacks when using the V1 CE polyfill, despite the name changes in the V1 spec.

## Not yet implemented
* Some utility functions are not yet implemented
    * A number of utility functions that were previously on the Polymer 1.0 element prototype are not ported over yet.  These will warn with "not yet implemented" warnings.
* Shady DOM styling is not yet integrated
* Array notification API's not yet implemented
* `<array-selector>` not yet implemented

## Breaking Changes
This is a list of proposed/intentional breaking changes as implemented in the current incantation of this repo.  If you find changes that broke existing code or rules, please raise and we'll need to decide whether they are expected/intentional or not.

Note that some of the items listed below have been temporarily shimmed to make testing existing code easier, but will be removed in the future.

### Styling
* Drop invalid syntax
  * :root {}
    * Should be :host > * {}
  * var(--a, --b)
    * Should be var(--a, var(--b))
  * @apply(--foo)
    * Should be @apply --foo;
* Native CSS Custom Properties by default
* TBD: Drop `element.customStyle`

### Element definitions
* TBD: `dom-if`, `dom-repeat`, `dom-bind`, `array-selector`, etc. will not included in `polymer.html` by default (going forward; they currently are); users should import those elements when needed
* TBD: Type extension elements may be handled differently due to lack of browser support for `is` in V1 spec

### Polymer element prototype
* Methods starting with `_` are not guaranteed to exist (most have been removed)

### Element lifecycle
* Attached: no longer deferred until first render time. Instead when measurement is needed use... API TBD.
* `lazyRegister` option removed and is now “on” by default

### Data
* Template not stamped & data system not initialized (observers, bindings, etc.) until attached (or until microtask, if we go the async by default route)
  * Fallout from V1 changes, since attributes not readable in constructor
* Inline computed annotations run unconditionally at initialization, regardless if any arguments are defined (and will see undefined for undefined arguments)
* Inline computed annotations are always “dynamic” (e.g. setting/changing the function will cause the binding to re-compute)
* Other method effects (multi-prop observers, computed) called once at initialization if any arguments are defined (and will see undefined for undefined arguments)
‘notify’ events not fired when value changes as result of binding from host 
* In order for a property to be deserialized from its attribute, it must be declared in the `properties` metadata object

Other
* Shadow DOM v1
  * `<content select="...">` → `<slot name="...">`
  * Selectively distributed content needs to add `slot` attribute
* Custom Elements v1
  * Applies to any “raw” custom elements (e.g. test-fixture)
    * createdCallback → constructor
      * Basically can only set instance properties
      * Must not inspect attributes, children, parent
    * attachedCallback → connectedCallback
* Alacarte code uses limited ES2015 syntax (mostly just `class`, so it can be run without transpilation in current Chrome, Safari, FF, and Edge; note Safari 9 does not currently support `=>`, among others).  Transpilation is required to run in IE11.
