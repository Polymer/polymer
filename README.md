# Polymer

[![Build Status](https://travis-ci.org/Polymer/polymer.svg?branch=master)](https://travis-ci.org/Polymer/polymer)
[![Published on npm](https://img.shields.io/npm/v/@polymer/polymer.svg)](https://www.npmjs.com/package/@polymer/polymer)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@polymer/polymer)

> ℹ️ Note: This is the current stable version of the Polymer library.  At Google I/O 2018 we announced a new Web Component base class, [`LitElement`](https://github.com/Polymer/lit-element), as a successor to the `PolymerElement` base class in this library.
>
> If you're starting a new project, we recommend that you consider using LitElement instead.
>
> If you have a project you've built with an earlier version of the Polymer library, we recommend that you [migrate](#about-polymer-30) to 3.0 for best compatibility with the JavaScript ecosystem. Thanks to the interoperability of Web Components, elements built with Polymer 3.0 and LitElement can be mixed and matched in the same app, so once you have updated your project to Polymer 3.0, you can migrate to LitElement incrementally, one element at a time.  See our blog post on the [Polymer Project roadmap](https://www.polymer-project.org/blog/2018-05-02-roadmap-update.html) for more information.

Polymer lets you build encapsulated, reusable [Web Components](https://www.webcomponents.org/introduction) that work just like standard HTML elements, to use in building web applications.  Using a Web Component built with Polymer is as simple as importing its definition then using it like any other HTML element:

```html
<!-- Import a component -->
<script src="https://unpkg.com/@polymer/paper-checkbox@next/paper-checkbox.js?module" type="module" ></script>

<!-- Use it like any other HTML element -->
<paper-checkbox>Web Components!</paper-checkbox>
```

Web Components are now implemented natively on Safari and Chrome (~70% of installed browsers), and run well on Firefox, Edge, and IE11 using [polyfills](https://github.com/webcomponents/webcomponentsjs).  Read more [below](#overview).

## Getting started

 * The easiest way to try out Polymer is to use one of these online tools:

    * Runs in all [supported](#supported-browsers) browsers: [StackBlitz](https://stackblitz.com/edit/polymer-element-example?file=index.js), [Glitch](https://glitch.com/edit/#!/polymer-element-example?path=index.html)

    * Runs in browsers with [JavaScript Modules](https://caniuse.com/#search=modules): [JSBin](https://jsbin.com/wuxejiz/edit?html,output),
 [CodePen](https://codepen.io/kevinpschaaf/pen/BxdErp?editors=1000).

 * You can also save [this HTML file](https://gist.githubusercontent.com/kevinpschaaf/8a5acbea7b25d2bb5e82eeea2b105669/raw/c3a86872f07603e2d0ddae736687e52a5c8c499f/index.html) to a local file and run it in any browser that supports [JavaScript Modules]((https://caniuse.com/#search=modules)).

 * When you're ready to use Polymer in a project, install it via [npm](https://www.npmjs.com/). To run the project in the browser,
 a module-compatible toolchain is required. We recommend installing the [Polymer CLI](https://github.com/Polymer/tools/tree/master/packages/cli) to and using its development server as follows.

    1. Add Polymer to your project:

        ```npm i @polymer/polymer```

    1. Create an element by extending PolymerElement and calling `customElements.define` with your class (see the examples below).

    1. Install the Polymer CLI:

        ```npm i -g polymer-cli```

    1. Run the development server and open a browser pointing to its URL:

        ```polymer serve --npm```

    > Polymer 3.0 is published on [npm](https://www.npmjs.com/package/@polymer/polymer) using JavaScript Modules.
    This means it can take advantage of the standard native JavaScript module loader available in all current major browsers.
    >
    > However, since Polymer uses npm conventions to reference dependencies by name, a light transform to rewrite specifiers to URLs is required to run in the browser. The polymer-cli's development server `polymer serve`, as well as `polymer build` (for building an optimized app for deployment)  automatically handles this transform.

    Tools like [webpack](https://webpack.js.org/) and [Rollup](https://rollupjs.org/) can also be used to serve and/or bundle Polymer elements.


## Minimal Example

  1. Create a class that extends `PolymerElement`.
  1. Implement a static `properties` getter that describes the element's public property/attribute API
  (these automatically become observed attributes).
  1. Then implement a `template` getter that returns an `HTMLTemplateElement` describing the element's rendering, including encapsulated styling and any property bindings.

```html
  <script src="node_modules/@webcomponents/webcomponents-loader.js"></script>
  <script type="module">
    import {PolymerElement, html} from '@polymer/polymer';

    class MyElement extends PolymerElement {
      static get properties() { return { mood: String }}
      static get template() {
        return html`
          <style> .mood { color: green; } </style>
          Web Components are <span class="mood">[[mood]]</span>!
        `;
      }
    }

    customElements.define('my-element', MyElement);
  </script>

  <my-element mood="happy"></my-element>
```

## Overview

Web components are an incredibly powerful new set of primitives baked into the web platform, and open up a whole new world of possibility when it comes to componentizing front-end code and easily creating powerful, immersive, app-like experiences on the web.

Polymer is a lightweight library built on top of the web standards-based [Web Components](http://webcomponents.org/introduction) APIs, and makes it easier to build your very own custom HTML elements. Creating reusable custom elements - and using elements built by others - can make building complex web applications easier and more efficient.

By being based on the Web Components APIs built in the browser (or [polyfilled](https://github.com/webcomponents/webcomponentsjs) where needed), elements built with Polymer are:

* Built from the platform up
* Self-contained
* Re-usable
* Interoperable across frameworks

Among many ways to leverage custom elements, they can be particularly useful for building reusable UI components. Instead of continually re-building a specific navigation bar or button in different frameworks and for different projects, you can define this element once using Polymer, and then reuse it throughout your project or in any future project.

Polymer provides a declarative syntax to easily create your own custom elements, using all standard web technologies - define the structure of the element with HTML, style it with CSS, and add interactions to the element with JavaScript.

Polymer also provides optional two-way data-binding, meaning:

1. When properties in the model for an element get updated, the element can update itself in response.
2. When the element is updated internally, the changes can be propagated back to the model.

Polymer is designed to be flexible, lightweight, and close to the web platform - the library doesn't invent complex new abstractions and magic, but uses the best features of the web platform in straightforward ways to simply sugar the creation of custom elements.

## About Polymer 3.0

Polymer 3.0 is now released to stable, and introduces a major change to how Polymer is distributed: from HTML Imports on Bower, to JS modules on npm.  Otherwise, the API is almost entirely backward compatible with Polymer 2.0 (the only changes are removing APIs related to HTML Imports like `importHref`, and converting Polymer's API to be module-based rather than globals-based).

Migrating to Polymer 3.0 by hand is mostly mechanical:
* Components should be defined in JS modules instead of in HTML
* Templates should be encoded in JS modules using a `static get template()` getter on PolymerElement subclasses using the `html` tagged template literal function (which parses `HTMLTemplateElement`s out of strings in JS) rather than using `<template>` elements in a `<dom-module>`
* All dependencies should be imported JS module imports rather than HTML Imports.

However, the [`polymer-modulizer`](https://github.com/Polymer/polymer-modulizer) tool automates the vast majority of this migration work.  Please see details on that repo for automated conversion of Polymer 2.0 apps and elements to Polymer 3.0.

👀 **Looking for Polymer v2.x?** Please see the [the v2 branch](https://github.com/Polymer/polymer/tree/2.x).

👀 **Looking for Polymer v1.x?** Please see the [the v1 branch](https://github.com/Polymer/polymer/tree/1.x).

## Contributing

The Polymer team loves contributions from the community! Take a look at our [contributing guide](CONTRIBUTING.md) for more information on how to contribute.  Please file issues on the Polymer issue tracker following the issue template and contributing guide [issues](https://github.com/Polymer/polymer/issues/new).

## Communicating with the Polymer team

Beyond GitHub, we try to have a variety of different lines of communication available:

* [Blog](https://blog.polymer-project.org/)
* [Twitter](https://twitter.com/polymer)
* [Google+ community](https://plus.google.com/communities/115626364525706131031)
* [Mailing list](https://groups.google.com/forum/#!forum/polymer-dev)
* [Slack channel](https://bit.ly/polymerslack)

# License

The Polymer library uses a BSD-like license that is available [here](./LICENSE.txt)
