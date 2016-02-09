# Polymer

[![Build Status](https://travis-ci.org/Polymer/polymer.svg?branch=master)](https://travis-ci.org/Polymer/polymer)

Polymer lets you build encapsulated, re-usable elements that work just like HTML elements, to use in building web applications.

Polymer is a library built on top of Web Components that makes it easier to build your very own custom HTML elements, which can be reused for any project. It makes building complex web applications easier and more efficient.  Imagine you have a specific navigation bar or a hamburger menu that you like to create and use in all of your projects.   Instead of having to build that navigation bar or menu for every project, you can utilize Polymer to easily create that element just once and then reuse throughout your project or in any project of your choosing.

Polymer provides a declarative syntax (defining what needs to be done and letting the computer figure out how to do it), to easily create your own custom elements.  It allows one to easily develop the structure of the element with HTML, style it with CSS, and add interactions with the element using JavaScript.  It also provides two-way data-binding.

Two-way binding just means that:

1. When properties in the model get updated, so does the UI.
2. When UI elements get updated, the changes get propagated back to the model.

If you don’t want to build your own custom elements Polymer comes with a collection of pre-built elements that you can just drop on a page and use immediately.  You can even use Polymer catalog of elements as a starting point for you own elements.  Just include it in a project, expand upon it customizing the element to your liking and thus creating your own custom element.  

```html
<!-- Polyfill Web Components for older browsers -->
<script src="webcomponentsjs/webcomponents-lite.min.js"></script>

<!-- Import element -->
<link rel="import" href="google-map.html">

<!-- Use element -->
<google-map latitude="37.790" longitude="-122.390"></google-map>
```

## Getting Started

Check out [polymer-project.org](https://www.polymer-project.org) for all of the library documentation, including getting started guides, tutorials, developer reference, and more.

Or if you'd just like to download the library, check out our [releases page](https://github.com/polymer/polymer/releases).

## Polymer in 1 Minute

The Polymer library is a lightweight sugaring layer on top of the [web components](http://webcomponents.org/) API's to help in building your own web components. It adds convenient features to make it easy to build complex elements:

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
