# Polymer

[![Build Status](https://travis-ci.org/Polymer/polymer.svg?branch=master)](https://travis-ci.org/Polymer/polymer)

Polymer lets you build encapsulated, reusable elements that work just like standard HTML elements, to use in building web applications.

```html
<!-- Polyfill Web Components for older browsers -->
<script src="webcomponentsjs/webcomponents-lite.js"></script>

<!-- Import element -->
<link rel="import" href="google-map.html">

<!-- Use element -->
<google-map latitude="37.790" longitude="-122.390"></google-map>
```

Check out [polymer-project.org](https://www.polymer-project.org) for all of the library documentation, including getting started guides, tutorials, developer reference, and more.

Or if you'd just like to download the library, check out our [releases page](https://github.com/polymer/polymer/releases).

## Polymer 2.0 is out!

Polymer 2.0 is released, and will be the future focus of Polymer development going forward.  We intend to keep the 2.x public API stable barring critical issues.  For background and migration information on the 2.x see the [2.0 documentation](https://www.polymer-project.org/2.0/docs/about_20) on the website or the [2.0 section below](#2-0), and we welcome your feedback via [issues](https://github.com/Polymer/polymer/issues/new) or [Slack](https://polymer-slack.herokuapp.com/).

**To evaluate Polymer 2.0**, please point your bower at the latest `2.0.0` tag for polymer, and be sure load to the `webcomponentsjs/webcomponents-lite.js` or `webcomponentsjs/webcomponents-loader.js` polyfills from the latest `v1.0.0` tag of [`webcomponentsjs`](https://github.com/webcomponents/webcomponentsjs).

👀 **Looking for Polymer v1.x?** Please see the [the v1 branch](https://github.com/Polymer/polymer/tree/1.x).

## Overview

Polymer is a lightweight library built on top of the web standards-based [Web Components](http://webcomponents.org/) APIs, and makes it easier to build your very own custom HTML elements. Creating reusable custom elements - and using elements built by others - can make building complex web applications easier and more efficient. By being based on the Web Components API's built in the browser (or [polyfilled](https://github.com/webcomponents/webcomponentsjs) where needed), Polymer elements are interoperable at the browser level, and can be used with other frameworks or libraries that work with modern browsers.

Among many ways to leverage custom elements, they can be particularly useful for building reusable UI components. Instead of continually re-building a specific navigation bar or button in different frameworks and for different projects, you can define this element once using Polymer, and then reuse it throughout your project or in any future project.

Polymer provides a declarative syntax to easily create your own custom elements, using all standard web technologies - define the structure of the element with HTML, style it with CSS, and add interactions to the element with JavaScript.

Polymer also provides optional two-way data-binding, meaning:

1. When properties in the model for an element get updated, the element can update itself in response.
2. When the element is updated internally, the changes can be propagated back to the model.

Polymer is designed to be flexible, lightweight, and close to the web platform - the library doesn't invent complex new abstractions and magic, but uses the best features of the web platform in straightforward ways to simply sugar the creation of custom elements.

In addition to the Polymer library for building your own custom elements, the Polymer project includes a collection of [pre-built elements](https://elements.polymer-project.org) that you can  drop on a page and use immediately, or use as starting points for your own custom elements.

## Polymer in 1 Minute

Polymer adds convenient features to make it easy to build complex elements:

**Basic custom element without Polymer:**

```js
// Standard custom element that Extends HTMLElement
class MyElement extends HTMLElement {
  constructor() {
    super();
    console.log('my-element was created!');
  }
}

// Register custom element class with browser
customElements.define('my-element', MyElement);
```

```html
<!-- use the element -->
<my-element></my-element>
```

**Custom element using Polymer**

```html
<!-- Define template that your element will use -->
<dom-module id="my-simple-namecard">
  <template>
    <div>
      Hi! My name is <span>Jane</span>
    </div>
  </template>
</dom-module>
```

```js
// Custom element that extends Polymer base class
class MySimpleNamecard extends Polymer.Element {

  // Stamp template from this dom-module into element's shadow DOM:
  static get is() { return 'my-simple-namecard'; }

}

// Register custom element class with browser
customElements.define(MySimpleNamecard.is, MySimpleNamecard);
```

**Configure properties on your element...**

```js
// Create an element that takes a property
class MyPropertyNamecard extends Polymer.Element {

  static get is() { return 'my-property-namecard'; }

  // Define property/attribute API:
  static get properties() {
    return {
      myName: {
        type: String,
        observer: 'myNameChanged'
      }
    };
  }

  myNameChanged(myName) {
    this.textContent = 'Hi! My name is ' + myName;
  }

}

customElements.define(MyPropertyNamecard.is, MyPropertyNamecard);
```

**...and have them set using declarative attributes**

```html
<!-- using the element -->
<my-property-namecard my-name="Jim"></my-property-namecard>
```

> Hi! My name is Jim

**Bind data into your element using the familiar mustache-syntax**

```html
<!-- Define template with bindings -->
<dom-module id="my-bound-namecard">
  <template>
    <div>
      Hi! My name is <span>[[myName]]</span>
    </div>
  </template>
</dom-module>
```
```js
class MyBoundNamecard extends Polymer.Element {

  static get is() { return 'my-bound-namecard'; }

  static get properties() {
    return {
      myName: String
    };
  }

}

customElements.define(MyBoundNamecard.is, MyBoundNamecard);
```

```html
<!-- using the element -->
<my-bound-namecard my-name="Josh"></my-bound-namecard>
```

> Hi! My name is Josh

**Style the internals of your element, without the style leaking out**

```html
<!-- Add style to your element -->
<dom-module id="my-styled-namecard">
  <template>
    <style>
      /* This would be crazy without webcomponents, but with shadow DOM */
      /* it only applies to this element's private "shadow DOM" */
      span {
        font-weight: bold;
      }
    </style>

    <div>
      Hi! My name is <span>{{myName}}</span>
    </div>
  </template>
</dom-module>
```
```js
class MyStyledNamecard extends Polymer.Element {

  static get is() { return 'my-styled-namecard'; }

  static get properties() {
    return {
      myName: String
    };
  }

}

customElements.define(MyStyledNamecard.is, MyStyledNamecard);
```
```html
<!-- using the element -->
<my-styled-namecard my-name="Jesse"></my-styled-namecard>
```

> Hi! My name is **Jesse**

**and so much more!**

Web components are an incredibly powerful new set of primitives baked into the web platform, and open up a whole new world of possibility when it comes to componentizing front-end code and easily creating powerful, immersive, app-like experiences on the web.

By being based on Web Components, elements built with Polymer are:

* Built from the platform up
* Self-contained
* Don't require an overarching framework - are interoperable across frameworks
* Re-usable

## Contributing

The Polymer team loves contributions from the community! Take a look at our [contributing guide](CONTRIBUTING.md) for more information on how to contribute.

## Communicating with the Polymer team

Beyond Github, we try to have a variety of different lines of communication available:

* [Blog](https://blog.polymer-project.org/)
* [Twitter](https://twitter.com/polymer)
* [Google+ community](https://plus.google.com/communities/115626364525706131031)
* [Mailing list](https://groups.google.com/forum/#!forum/polymer-dev)
* [Slack channel](https://bit.ly/polymerslack)

# License

The Polymer library uses a BSD-like license that is available [here](./LICENSE.txt)

-----------

<a name="release-candidate"></a>
<a name="2-0"></a>
# Polymer 2.0

Polymer 2.0 is a major new release of Polymer that is compatible with the latest web components standards and web platform APIs, and makes significant improvements over the 1.x version of the library.  The following section provides context and migration information for existing users of Polymer 1.x:

## Goals of Polymer 2.0

1. **Take advantage of native "v1" Web Components implementations across browsers.**

   The primary goal of the Polymer 2.0 release is to take advantage of native, cross-browser support for Web Components.

   Polymer 1.x is built on top of the so-called "v0" Web Components specs, which are supported natively only in Google Chrome; using Polymer in other browsers has always required the use of polyfills.

   Beginning this fall, multiple browsers will be shipping native implementations of the new "v1" specs for Shadow DOM and Custom Elements, yielding better web components performance and reducing the need for polyfills.

   Polymer 2.0 features full support for the v1 specs, taking advantage of native browser implementations where they are available and depending on updated v1 polyfills from [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs) where necessary.

   Polymer 2.0 also embraces the new ES-class-based mechanism for defining custom elements, bringing idiomatic Polymer style closer to "vanilla" custom element authoring.

1. **Provide a smooth migration path from Polymer 1.x.**

   Our second major goal is to provide as easy a transition as possible for developers who have built elements and apps with Polymer 1.x, making Polymer 2.0 a sturdy bridge to the future.

   To upgrade, you will need to make some changes to your 1.x-based elements and apps. These changes are necessitated by both the v0-to-v1 spec transition and a handful of key improvements in Polymer itself (see our remaining goals, below).

   However, we've taken care to limit the number of changes that are strictly required and to ease the process of upgrading:

   * Polymer 2.0 introduces a new [ES6 class-based syntax](#20-es6-class-based-syntax), but we've provided a [lightweight compatibility layer](#10-compatibility-layer) allowing you to upgrade your 1.x code with minimal modifications. Depending on your needs, you can either take advantage of the compatibility layer or jump straight to idiomatic 2.0 style.

   * Before releasing Polymer 2.0, we'll also provide an upgrade tool to automate as many of the changes (both required and recommended) as possible.

   * Finally, we're working on guidelines for building and testing "hybrid" elements that will run in both Polymer 1.x and Polymer 2.0. We plan to ship hybrid versions of all of the elements that we provide, easing the transition for developers who use them. Third-party element providers may also choose to ship hybrid elements.

   * If you have an especially large app or constraints that don't allow for an all-at-once upgrade, you can also use hybrid elements to migrate your app from 1.x to 2.0 in piecewise fashion: update your elements to hybrid form, individually or in batches, while running against Polymer 1.x; then cut over to Polymer 2.0 when all of your elements have been updated.

1. **Eliminate leaky abstractions.**

   Seamless interoperability is one of Web Components' major selling points. Generally speaking, web components "just work" anywhere you use HTML elements. To use them, you need only be aware of their public attributes, properties, methods and events; you don't need to know anything about their inner workings. This means you can easily mix standard HTML elements, third-party elements and elements you've defined yourself.

   Unfortunately, there are a couple of cases in Polymer 1.x (the `Polymer.dom` API and the `set`/`notifyPath` API) where implementation details of Polymer-based elements leak out, requiring users of the elements to interact with them in non-standard ways. These "leaks" were by design – compromises we chose to make in the interest of performance – but in hindsight we aren't happy with the tradeoff.

   In Polymer 2.0 we've found ways to eliminate these leaky abstractions without unduly compromising performance, which means that your Polymer 2.x-based elements will be indistinguishable from "vanilla" elements from a consumer's point of view (unless you leak implementation details of your own).

1. **Make targeted improvements to the Polymer data system.**

   Based on developer feedback and observations of Polymer apps in the wild, we've also made some key improvements to Polymer's data system. These changes are designed to make it easier to reason about and debug the propagation of data through and between elements:

   * Changes are now batched, and the effects of those changes are run in well-defined order.
   * We ensure that multi-property observers run exactly once per turn for any set of changes to dependencies (removing the [multi-property undefined rule](https://www.polymer-project.org/1.0/docs/devguide/observers#multi-property-observers)).
   * To add compatibility with more approaches to state management, we now provide a mixin (and legacy behavior) to skip dirty-checking properties whose values are objects or arrays and always consider them dirty, causing their side effects to run.

1. **Improve factoring of Polymer and the polyfills**

   We've done major refactoring of Polymer and the webcomponentsjs polyfills to improve efficiency, utility and flexibility:

   * The "Shady DOM" shim that was part of Polymer 1.x has been factored out of Polymer and added to the webcomponentsjs polyfills, along with the related shim for CSS Custom Properties. (As noted above, the Shady DOM shim no longer exposes an alternative API but instead patches the native DOM API for transparent usage).

   * Polymer itself has been internally factored into several loosely coupled libraries.

     * The new `Polymer.Element` class extends from the native `HTMLElement` and mixes in functionality from these libraries.

     * The idiomatic way of using Polymer 2.0 (assuming you're not using the 1.x compatibility layer) is to define your own custom elements that subclass `Polymer.Element`, using standard ES class definition syntax.

     * If you're interested in using pieces of Polymer's functionality in _a la carte_ fashion, you can try defining your own base element class, utilizing a subset of the libraries. For now, this use case should be considered experimental, as the factoring of libraries is subject to change and is not part of the official Polymer 2.0 API.

## 1.0 Compatibility Layer
Polymer 2.0 retains the existing `polymer/polymer.html` import that current Polymer 1.0 users can continue to import, which strives to provide a very minimally-breaking change for code written to the Polymer 1.0 API.  For the most part, existing users upgrading to Polymer 2.0 will only need to adapt existing code to be compliant with the V1 Shadow DOM API related to content distribution and styling, as well as minor breaking changes introduced due to changes in the V1 Custom Elements spec and data-layer improvements listed [below](#breaking-changes).

## 2.0 ES6 Class-based Syntax
With the widespread adoption of ES6 in browsers, as well as the requirement that V1 Custom Elements be defined as ES6 class extensions of `HTMLElement`, Polymer 2.0 shifts its primary API for defining new elements to an ES6 class-centric syntax.  Using this syntax, users will extend `Polymer.Element` (a subclass of `HTMLElement`), which provides meta-programming for most of the same features of Polymer 1.0 based on static configuration data supplied on the class definition.

Basic syntax looks like this:

```html
<!-- Load the Polymer.Element base class -->
<link rel="import" href="bower_components/polymer/polymer-element.html">
```

```js
// Extend Polymer.Element base class
class MyElement extends Polymer.Element {
  static get is() { return 'my-element'; }
  static get properties() { return { /* properties metadata */ } }
  static get observers() { return [ /* observer descriptors */ ] }
  constructor() {
    super();
    ...
  }
  connectedCallback() {
    super.connectedCallback();
    ...
  }
  ...
}

// Register custom element definition using standard platform API
customElements.define(MyElement.is, MyElement);
```

Users can then leverage native subclassing support provided by ES6 to extend and customize existing elements defined using ES6 syntax:

```js
// Subclass existing element
class MyElementSubclass extends MyElement {
  static get is() { return 'my-element-subclass'; }
  static get properties() { return { /* properties metadata */ } }
  static get observers() { return [ /* observer descriptors */ ] }
  constructor() {
    super();
    ...
  }
  ...
}

// Register custom element definition using standard platform API
customElements.define(MyElementSubclass.is, MyElementSubclass);
```

Below are the general steps for defining a custom element using this new syntax:

* Extend from `Polymer.Element`. This class provides the minimal surface area to integrate with 2.0's data binding system. It provides only standard custom element lifecycle with the addition of `ready`. (You can apply the `Polymer.LegacyElementMixin` to get all of the Polymer 1.0 element API, but since most of this API was rarely used, this should not often be needed.)
* Implement "behaviors" as [mixins that return class expressions](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) and apply to the base class you are extending from.
* Property metadata (`properties`) and multi-property/wildcard observers (`observers`) should be put on the class as static getters, but otherwise match the 1.x syntax.
* In order to provide a template to stamp into the element's shadow DOM, either define a static `is` getter that returns the id of a `dom-module` containing the element's template, or else provide a static `template` getter that returns a template to stamp.  The `template` getter may either return an HTMLTemplateElement or a string containing HTML which will be parsed into a template.
* `listeners` and `hostAttributes` have been removed from element metadata; listeners and attributes should be installed using standard platform API (`this.addEventListener`, `this.setAttribute`) how and when needed (e.g. in `connectedCallback`).  For convenience `_ensureAttribute` is available that sets an attribute if and only if the element does not yet have that attribute, to match `hostAttribute` semantics.

Note that `Polymer.Element` provides a cleaner base class void of a lot of sugared utility API that present on elements defined with `Polymer()`, such as `fire`, `transform`, etc.  With web platform surface area becoming far more stable across browsers, we intend to hew towards sugaring less and embracing the raw platform API more.  So when using `Polymer.Element`, instead of using the legacy `this.fire('some-event')` API, simply use the equivalent platform API's such as `this.dispatchEvent(new CustomEvent('some-event', {bubbles: true})`.  #usetheplatform

See below for a visual guide on migrating Polymer 1.0's declarative syntax to the ES6 class syntax in Polymer 2.0:

![Difference in Polymer 1.0 and Polymer 2.0 element definition](img/migration.png)

## Polyfills

Polymer 2.0 has been developed alongside and tested with a new suite of V1-spec compatible polyfills for Custom Elements and Shadow DOM.   Polymer 2.0 is compatible the latest releases of [`webcomponentsjs/webcomponents-lite.js`](https://github.com/webcomponents/webcomponentsjs), which is included as a bower dependency to Polymer 2.x.

## Breaking Changes
Below is a list of intentional breaking changes made in Polymer 2.0, along with their rationale/justification and migration guidance.  If you find changes that broke existing code not documented here, please [file an issue](https://github.com/Polymer/polymer/issues/new) and we'll investigate to determine whether they are expected/intentional or not.


### Polymer.dom
On browsers that lack native V1 Shadow DOM support, Polymer 2.0 is designed to be used with the new [V1 Shady DOM shim](https://github.com/webcomponents/shadydom), which patches native DOM API as necessary to be mostly equivalent to native Shadow DOM.  This removes the requirement to use the `Polymer.dom` API when interacting with the DOM.  `Polymer.dom` can be eliminated for elements targeting Polymer 2.0, in favor of the native DOM API's.

Note that `Polymer.dom` is still provided in the `polymer.html` backward-compatibility layer which simply facades the native API, but usage of it in 2.0 can be removed.  Note that `Polymer.dom` will no longer return `Array`s for API's where the platform returns e.g. `NodeList`'s, so code may need to be updated to avoid direct use of array methods.

### V1 Shadow DOM
Polymer 2.0 elements will stamp their templates into shadow roots created using V1's `attachShadow({mode: 'open'})` by default.  As such, user code related to scoped styling, distribution, and events must be adapted to native V1 API.  For a great writeup on all Shadow DOM V1 spec changes, [see this writeup](http://hayato.io/2016/shadowdomv1/).  Required changes for V1 are summarized below:

#### Distribution
* <a name="breaking-slot"></a>`<content>` insertion points must be changed to `<slot>`
* <a name="breaking-slot-name"></a>Insertion points that selected content via `<content select="...">` must be changed to named slots: `<slot name="...">`
* <a name="breaking-slot-slot"></a>Selection of distributed content into named slots must use `slot="..."` rather than tag/class/attributes selected by `<content>`
* <a name="breaking-redistribution"></a>Re-distributing content by placing a `<slot>` into an element that itself has named slots requires placing a `name` attribute on the `<slot>` to indicate what content _it_ selects from its host children, and placing a `slot` attribute to indicate where its selected content should be slotted into its parent
* <a name="breaking-async-distribution"></a>In the V1 "Shady DOM" shim, initial distribution of children into `<slot>` is asynchronous (microtask) to creating the `shadowRoot`, meaning distribution occurs after observers/`ready` (in Polymer 1.0's shim, initial distribution occurred before `ready`).  In order to force distribution synchronously, call `ShadyDOM.flush()`.
* <a name="breaking-observe-nodes-flush"></a>Calling `Polymer.dom.flush` no longer results in callbacks registered with `Polymer.dom.observeNodes` being called. Instead, the object returned from `Polymer.dom.observeNodes` now contains a `flush` method which can be used to immediately call the registered callback if any changes are pending.

#### Scoped styling

* <a name="breaking-styling-content"></a>`::content` CSS pseudo-selectors must be changed to `::slotted`, and may only target immediate children and use no descendant selectors
* <a name="breaking-styling-host-context"></a>`:host-context()` pseudo-selectors have been removed. These were primarily useful for writing bidi rules (e.g. `:host-context([dir=rtl])`); these should be replaced with the [new `:dir(rtl)` selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:dir), which we plan to polyfill in the [styling shim](https://github.com/webcomponents/shadycss) soon
* <a name="breaking-deep"></a>The previously deprecated `/deep/` and `::shadow` selectors have been completely removed from V1 native support and must not be used (use [CSS custom properties](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-css-properties) to customize styling instead)

#### Scoped events

* <a name="breaking-event-localTarget"></a>Code using `Polymer.dom(event).localTarget` should change to the V1 standard API `event.target`
* <a name="breaking-event-path"></a>Code using `Polymer.dom(event).path` (aka V0 `event.path`) should change to the V1 standard API `event.composedPath()`
* <a name="breaking-event-rootTarget"></a>Code using `Polymer.dom(event).rootTarget` (aka V0 `event.path[0]`)  should change to the V1 standard API `event.composedPath()[0]`

### V1 Custom Elements
Polymer 2.0 elements will target the V1 Custom Elements API, which primarily changes the "created" step to actually invoke the `class` constructor, imposes new restrictions on what can be done in the `constructor` (previously `createdCallback`), and introduces different callback names.

* <a name="breaking-callbacks"></a>Changes to callback names:
  * When using `Polymer({...})` from the compatibility layer, all callbacks should use legacy Polymer API names (`created`, `attached`, `detached`, `attributeChanged`)
  * When extending from `Polymer.Element`, users should override the V1 standard callback names and call `super()`:
    * `created` changes to `constructor`
    * `attached` changes to `connectedCallback`
    * `detached` changes to `disconnectedCallback`
    * `attributeChanged` changes to `attributeChangedCallback`
* <a name="breaking-attributes"></a>The V1 Custom Elements spec forbids reading attributes, children, or parent information from the DOM API in the `constructor` (or `created` when using the legacy API).  Likewise, attributes and children may not be added in the `constructor`.  Any such work must be deferred (e.g. until `connectedCallback` or microtask/`setTimeout`/`requestAnimationFrame`).
* <a name="breaking-is"></a>Polymer will no longer produce type-extension elements (aka `is="..."`). Although they are still included in the V1 Custom Elements [spec](https://html.spec.whatwg.org/#custom-elements-customized-builtin-example) and scheduled for implementation in Chrome, because Apple [has stated](https://github.com/w3c/webcomponents/issues/509#issuecomment-233419167) it will not implement `is`, we will not be encouraging its use to avoid indefinite reliance on the Custom Elements polyfill. Instead, a wrapper custom element can surround a native element, e.g. `<a is="my-anchor">...</a>` could become `<my-anchor><a>...</a></my-anchor>`. Users will need to change existing `is` elements where necessary.
* <a name="breaking-templates"></a>All template type extensions provided by Polymer have now been changed to standard custom elements that take a `<template>` in their light dom,  e.g.

  ```html
  <template is="dom-repeat" items="{{items}}">...</template>
  ```

  should change to

  ```html
  <dom-repeat items="{{items}}">
      <template>...</template>
  </dom-repeat>
  ```

  For the time being, Polymer (both legacy and class API) will automatically wrap template extensions used in Polymer element templates during template processing for backward-compatibility, although we may decide to remove this auto-wrapping in the future.  Templates used in the main document must be manually wrapped.
* <a name="breaking-custom-style"></a>The `custom-style` element has also been changed to a standard custom element that must wrap a style element  e.g.

  ```html
  <style is="custom-style">...</style>
  ```

   should change to

   ```html
   <custom-style>
     <style>...</style>
   </custom-style>
   ```

### CSS Custom Property Shim
Polymer 2.0 will continue to use a [shim](https://github.com/webcomponents/shadycss) to provide limited [CSS Custom Properties](#https://www.polymer-project.org/1.0/docs/devguide/styling#custom-css-properties) support on browsers that do not yet natively support custom properties, to allow an element to expose a custom styling API.  The following changes have been made in the shim that Polymer 2.0 will use:

* <a name="breaking-css-native"></a>The shim will now always use native CSS Custom Properties by default on browsers that implement them (this was opt-in in 1.0).  The shim will perform a one-time transformation of stylesheets containing [CSS Custom Property mixins](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-css-mixins) to leverage individual native CSS properties where possible for better performance.  This introduces [some limitations](https://github.com/webcomponents/shadycss#custom-properties-and-apply) to be aware of.
* <a name="breaking-css-syntax"></a>The following invalid styling syntax was previously accepted by the 1.0 custom property shim.  In order to support native CSS Custom Properties, rules should be correct to use only natively valid syntax:
  * `:root {}`
    * Should be `:host > * {}` (in a shadow root)
    * Should be `html {}` (in main document)
    * Thus, cannot share old `:root` styles for use in both main document and shadow root
  * `var(--a, --b)`
    * Should be `var(--a, var(--b))`
  * `@apply(--foo)`
    * Should be `@apply --foo;`
* <a name="breaking-customStyle"></a>`element.customStyle` as an object that can be assigned to has been removed; use `element.updateStyles({...})` instead.
* <a name="breaking-style-location"></a>`<style>` inside of a `<dom-module>`, but outside of `<template>` is no longer supported

### Data system
* <a name="breaking-data-init"></a>An element's template is not stamped & data system not initialized (observers, bindings, etc.) until the element has been connected to the main document.  This is a direct result of the V1 changes that prevent reading attributes in the constructor.
* <a name="breaking-data-batching"></a>Propagation of data through the binding system is now batched, such that multi-property computing functions and observers run once with a set of coherent changes.  Single property accessors still propagate data synchronously, although there is a new `setProperties({...})` API on Polymer elements that can be used to propagate multiple values as a coherent set.
* <a name="breaking-notify-order"></a>Property change notification event dispatch (`notify: true`) occurs after all other side effects of a property change occurs.  In 1.x notification happened after binding side effects, but before observers, which was counter-intuitive.  This rationalizes the concept of upward notification to ensure it happens after _all_ local and downward side-effects based on the change occur.  Concretely, the order of effect processing in 2.x is as follows:
  1. computed properties (`computed`)
  1. template bindings (both property bindngs `[[...]]` and computed bindings `[[compute(...)]]`, including any side-effects on child elements for the bound property/attribute changes)
  1. attribute reflection (`reflectToAttribute: true`)
  1. observers (both single-property `observer` and multi-property `observers`)
  1. property-changed event notification (`notify: true`, including any side-effects on host elements for the bound property changes)
* <a name="breaking-method-args"></a>Multi-property observers, computed methods, and computed bindings are now called once at initialization if any arguments are defined (and will see `undefined` for any undefined arguments).  As such, the [1.x rule requiring all properties of a multi-property observer to be defined](https://www.polymer-project.org/1.0/docs/devguide/observers#multi-property-observers) no longer applies, as this was a major source of confusion and unintended consequences.  Subsequently setting multi-property method arguments will cause the method to be called once for each property changed via accessors, or once per batch of changes via `setProperties({...})`.
* <a name="breaking-dynamic-functions"> Declaring a method name used as an observer or computing function in the `properties` block causes the method property itself to become a dependency for any effects it is used in, meaning the effect for that method will run whenever the method is set, similar to 1.x. However, due to removing the `undefined` rule noted above, in 2.x if such a method exists when the element is created, it will run with initial values of arguments, even in the case some or all arguments are `undefined`.
* <a name="breaking-binding-notifications">‘notify’ events are no longer fired when value changes _as result of binding from host_, as a major performance optimization over 1.x behavior.  Use cases such as `<my-el foo="{{bar}}" on-foo-changed="fooChanged">` are no longer supported.  In this case you should simply user a `bar` observer in the host.  Use cases such as dynamically adding a `property-changed` event listener on for properties bound by an element's host by an actor other than the host are no longer supported.
* <a name="breaking-properties-deserialization"></a>In order for a property to be deserialized from its attribute, it must be declared in the `properties` metadata object
* <a name="breaking-colleciton"></a>The `Polymer.Collection` and associated key-based path and splice notification for arrays has been eliminated.  See [explanation here](https://github.com/Polymer/polymer/pull/3970#issue-178203286) for more details.
* <a name="feature-mutable-data"></a>While not a breaking change, Polymer now ships with a `Polymer.MutableData` mixin (and legacy `Polymer.MutableDataBehavior` behavior) to provide more options for managing data.  By default, `Polymer.PropertyEffects` performs strict dirty checking on objects, which means that any deep modifications to an object or array will not be propagated unless "immutable" data patterns are used (i.e. all object references from the root to the mutation were changed).  Polymer also provides a proprietary data mutation and path notification API (e.g. `notifyPath`, `set`, and array mutation API's) that allow efficient mutation and notification of deep changes in an object graph to all elements bound to the same object graph. In cases where neither immutable patterns or the data mutation API can be used, applying this mixin will cause Polymer to skip dirty checking for objects and arrays and always consider them to be "dirty".  This allows a user to make a deep modification to a bound object graph, and then either simply re-set the object (e.g. `this.items = this.items`) or call `notifyPath` (e.g. `this.notifyPath('items')`) to update the tree.  Note that all elements that wish to be updated based on deep mutations must apply this mixin or otherwise skip strict dirty checking for objects/arrays.

### Removed API
* <a name="breaking-instanceof"></a>`Polymer.instanceof` and `Polymer.isInstance`: no longer needed, use
`instanceof` and `instanceof Polymer.Element` instead.
* <a name="breaking-dom-module"></a>`dom-module`: Removed ability to use `is` and `name` attribute to
configure the module name. The only supported declarative way set the module
id is to use `id`.
* <a name="breaking-getPropertyInfo"></a>`element.getPropertyInfo`: This api returned unexpected information some of the time and was rarely used.
* <a name="breaking-getNativePrototype"></a>`element.getNativePrototype`: Removed because it is no longer needed for internal code and was unused by users.
* <a name="breaking-beforeRegister"></a>`element.beforeRegister`: This was originally added for metadata compatibility with ES6 classes. We now prefer users create ES6 classes by extending `Polymer.Element`, specifying metadata in the static `properties`, `observers`, and `is` properties. For legacy use via `Polymer({...})`, dynamic effects may still be added by using `beforeRegister` but it is now equivalent to the `registered` lifecycle method. An element's `is` property cannot be set in `beforeRegister` as it could in Polymer 1.x.
* <a name="breaking-attributeFollows"></a>`element.attributeFollows`: Removed due to disuse.
* <a name="breaking-classFollows"></a>`element.classFollows`: Removed due to disuse.
* <a name="breaking-copyOwnProperty"></a>`element.copyOwnProperty`: Removed due to disuse.
* <a name="breaking-listeners"></a>`listeners`: Removed ability to use `id.event` to add listeners to elements in local dom. Use declarative template event handlers instead.
* <a name="breaking-protected"></a>Methods starting with `_` are not guaranteed to exist (most have been removed)

### Other
* <a name="breaking-transpiling"></a>Polymer 2.0 uses ES2015 syntax, and can be run without transpilation in current Chrome, Safari 10, Safari Technology Preview, Firefox, and Edge.  Transpilation is required to run in IE11 and Safari 9 (as well as Edge for high reliability, due to certain [bugs](https://github.com/Microsoft/ChakraCore/issues/1496) in their ES6 implementation).  The [`polymer-cli`](https://github.com/Polymer/polymer-cli) tools such as `polymer serve` and `polymer build` have built-in support for transpiling when needed.
* <a name="breaking-deferred-attach"></a>The `attached` legacy callback is no longer deferred until first render time; it now runs at the time of the native `connectedCallback`, which may be before styles have resolved and measurement is possible.  Instead when measurement is needed use `Polymer.RenderStatus.beforeNextRender`.
* <a name="breaking-created-timing"></a>The legacy `created` callback is no longer called before default values in `properties` have been set.  As such, you should not rely on properties set in `created` from within `value` functions that define property defaults.  However, you can now set _any_ property defaults within the `created` callback (in 1.0 this was forbidden for observed properties) in lieu of using the `value` function in `properties`.
* <a name="breaking-boolean-attribute-binidng"></a>Binding a default value of `false` via an _attribute binding_ to a boolean property will not override a default `true` property of the target, due to the semantics of boolean attributes.  In general, property binding should always be used when possible, and will avoid such situations.
* <a name="breaking-lazyRegister"></a>`lazyRegister` option removed and all meta-programming (parsing template, creating accessors on prototype, etc.) is deferred until the first instance of the element is created
* <a name="breaking-hostAttributes-class"></a>In Polymer 1.x, the `class` attribute was explicitly blacklisted from `hostAttributes` and never serialized. This is no longer the case using the 2.0 legacy API.
* <a name="breaking-url-changes"></a>In Polymer 1.x, URLs in attributes and styles inside element templates were re-written to be relative to the element HTMLImport. Based on user feedback, we are changing this behavior.

  Two new properties are being added to `Polymer.Element`: `importPath` and `rootPath`. The `importPath` property is a static getter on the element class that defaults to the element HTMLImport document URL and is overridable. It may be useful to override `importPath` when an element `template` is not retrieved from a `dom-module` or the element is not defined using an HTMLImport. The `rootPath` property is set to the value of `Polymer.rootPath` which is globally settable and defaults to the main document URL. It may be useful to set `Polymer.rootPath` to provide a stable application mount path when using client side routing. URL's in styles are re-written to be relative to the `importPath` property. Inside element templates, URLs in element attributes are *no longer* re-written. Instead, they should be bound using `importPath` and `rootPath` where appropriate. For example:

  A Polymer 1.x template that included:

  ```html
  <img src="foo.jpg">
  ```

  in Polymer 2.x should be:

  ```html
  <img src$="[[importPath]]foo.jpg">
  ```
