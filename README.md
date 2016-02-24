# Polymer

[![Build Status](https://travis-ci.org/Polymer/polymer.svg?branch=master)](https://travis-ci.org/Polymer/polymer)

Polymer lets you build encapsulated, re-usable elements that work just like standard HTML elements, to use in building web applications.

```html
<!-- Polyfill Web Components for older browsers -->
<script src="webcomponentsjs/webcomponents-lite.min.js"></script>

<!-- Import element -->
<link rel="import" href="google-map.html">

<!-- Use element -->
<google-map latitude="37.790" longitude="-122.390"></google-map>
```

Check out [polymer-project.org](https://www.polymer-project.org) for all of the library documentation, including getting started guides, tutorials, developer reference, and more.

Or if you'd just like to download the library, check out our [releases page](https://github.com/polymer/polymer/releases).

## Overview

Polymer is a lightweight library built on top of the web standards-based [Web Components](http://webcomponents.org/) API's, and makes it easier to build your very own custom HTML elements. Creating re-usable custom elements - and using elements built by others - can make building complex web applications easier and more efficient. By being based on the Web Components API's built in the browser (or [polyfilled](https://github.com/webcomponents/webcomponentsjs) where needed), Polymer elements are interoperable at the browser level, and can be used with other frameworks or libraries that work with modern browsers.

Among many ways to leverage custom elements, they can be particularly useful for building re-usable UI components. Instead of continually re-building a specific navigation bar or button in different frameworks and for different projects, you can define this element once using Polymer, and then reuse it throughout your project or in any future project.

Polymer provides a declarative syntax to easily create your own custom elements, using all standard web technologies - define the structure of the element with HTML, style it with CSS, and add interactions to the element with JavaScript. 

Polymer also provides optional two-way data-binding, meaning:

1. When properties in the model for an element get updated, the element can update itself in response.
2. When the element is updated internally, the changes can be propagated back to the model.

Polymer is designed to be flexible, lightweight, and close to the web platform - the library doesn't invent complex new abstractions and magic, but uses the best features of the web platform in straightforward ways to simply sugar the creation of custom elements.

In addition to the Polymer library for building your own custom elements, the Polymer project includes a collection of [pre-built elements](https://elements.polymer-project.org) that you can  drop on a page and use immediately, or use as starting points for your own custom elements.

## Polymer in 1 Minute

Polymer adds convenient features to make it easy to build complex elements:

**Create and register a custom element**

```js
/**
 * A not-very-useful inline element
 */
Polymer({
    is: 'my-element'
});
```

```html
<!-- use the element -->
<my-element></my-element>
```

**Add markup to your element**

```html
<!-- define the markup that your element will use -->
<dom-module id="my-simple-namecard">
  <template>
    <div>
      Hi! My name is <span>Jane</span>
    </div>
  </template>

  <script>
    Polymer({
        is: 'my-simple-namecard'
    });
  </script>
</dom-module>
```

**Configure properties on your element...**

```js
// Create an element that takes a property
Polymer({
    is: 'my-property-namecard',
    properties: {
      myName: {
        type: String
      }
    },
    ready: function() {
      this.textContent = 'Hi! My name is ' + this.myName;
    }
});
```

**...and have them set using declarative attributes**

```html
<!-- using the element -->
<my-property-namecard my-name="Jim"></my-property-namecard>
```

> Hi! My name is Jim

**Bind data into your element using the familiar mustache-syntax**

```html
<!-- define markup with bindings -->
<dom-module id="my-bound-namecard">
  <template>
    <div>
      Hi! My name is <span>{{myName}}</span>
    </div>
  </template>

  <script>
    Polymer({
      is: 'my-bound-namecard',
      properties: {
        myName: {
          type: String
        }
      }
    });
  </script>
</dom-module>
```

```html
<!-- using the element -->
<my-bound-namecard my-name="Josh"></my-bound-namecard>
```

> Hi! My name is Josh

**Style the internals of your element, without the style leaking out**

```html
<!-- add style to your element -->
<dom-module id="my-styled-namecard">
  <template>
    <style>
      /* This would be crazy in non webcomponents. */
      span {
        font-weight: bold;
      }
    </style>

    <div>
      Hi! My name is <span>{{myName}}</span>
    </div>
  </template>

  <script>
    Polymer({
      is: 'my-styled-namecard',
      properties: {
        myName: {
          type: String
        }
      }
    });
  </script>
</dom-module>
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

The Polymer library uses a BSD-like license available [here](./LICENSE.txt)
