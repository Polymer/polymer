# Polymer

[![Build Status](https://travis-ci.org/Polymer/polymer.svg?branch=master)](https://travis-ci.org/Polymer/polymer)

Polymer lets you build encapsulated, re-usable elements that work just like HTML elements, to use in building web applications.

```html
<!-- Polyfill Web Components for older browsers -->
<script src="webcomponentsjs/webcomponents-lite.min.js"></script>

<!-- Import element -->
<link rel="import" href="google-map.html">

<!-- Use element -->
<google-map latitude="37.790" longitude="-122.390"></google-map>
```

#What to Use Polymer for and When to Use It?

As *Taylor Savage* says in [The Polymer Summit 2015](https://www.polymer-project.org/summit) , "LEGOs are a great metaphor for the kind of things that Polymer lets you build and that Web Components lets you build. They're composable, modular and reusable. You can use the same kinds of pieces to build really incredible things." Polymer provides the pieces to build components easier.

You can use Polymer for any Web Application or project. With Polymer, you can craft your own HTML elements and add them together to create complex web applications that are scalable and maintainable. You can use the custom elements made by the Polymer team or mix and match these elements to make your own custom elements. The custom elements you create for your application are treated as any other element in a web page. You can use any other JavaScript framework or libraries to access their properties and methods. 

Polymer becomes extremely useful when you have a complex element that you want to reuse throughout your site. It makes implementing that feature much easier, as you need to only create it once and then include it, where necessary, throughout your application.  Polymer gives you the tools to build extraordinary things in many ways and your imagination is the limit.

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
