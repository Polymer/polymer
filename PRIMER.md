# Polymer 0.8 Primer

Table of Contents:

* [Feature list](#feature-list)
* [Migration notes](#migration-notes)

# Feature list

<a name="feature-list"></a>
Below is a description of the current Polymer features, followed by individual feature guides.

<a name="polymer-micro"></a>
**Bare-minum Custom Element sugaring**

| Feature | Usage
|---------|-------
| [Custom element constructor](#element-constructor) | Polymer.Class({ … });
| [Custom element registration](#register-element) | Polymer({ is: ‘...’,  … }};
| [Bespoke constructor support](#bespoke-constructor) | constructor: function() { … }
| [Basic lifecycle callbacks](#basic-callbacks) | created, attached, detached, attributeChanged
| [Native HTML element extension](#type-extension) | extends: ‘…’
| [Configure properties](#property-config) | properties: { … }
| [Attribute deserialization to property](#attribute-deserialization) | properties: { \<property>: \<Type> }
| [Static attributes on host](#host-attributes) | hostAttributes: { \<attribute>: \<value> }
| [Prototype mixins](#prototype-mixins) | mixins: [ … ]

<a name="polymer-mini"></a>
**Template stamped into "local DOM" and tree lifecycle**

| Feature | Usage
|---------|-------
| [Template stamping into local DOM](#template-stamping) | \<dom-module>\<template>...\</template>\</dom-module>
| [Scoped styling](#scoped-styling) | \<style> in \<dom-module>, Shadow-DOM styling rules (:host, ...)
| [DOM (re-)distribution](#dom-distribution) | \<content>
| [DOM API](#dom-api)  | Polymer.dom
| [Configuring default values](#configure-values)  | properties: \<prop>: { value: \<primitive>\|\<function> }
| [Bottom-up callback after configuration](#ready-method) | ready: function() { … }

<a name="polymer-standard"></a>
**Declarative data binding, events, and property effects**

| Feature | Usage
|---------|-------
| [Local node marshalling](#node-marshalling) | this.$.\<id>
| [Event listener setup](#event-listeners)| listeners: { ‘\<node>.\<event>’: ‘function’, ... }
| [Annotated event listener setup](#annotated-listeners) | \<element on-[event]=”function”>
| [Property change callbacks](#change-callbacks) | properties: \<prop>: { observer: ‘function’ }
| [Annotated property binding](#property-binding) | \<element prop=”{{property\|path}}”>
| [Property change notification](#property-notification) | properties: { \<prop>: { notify: true } }
| [Binding to structured data](#path-binding) | \<element prop=”{{obj.sub.path}}”>
| [Path change notification](#set-path) | setPathValue(\<path>, \<value>)
| [Declarative attribute binding](#attribute-binding) | \<element attr$=”{{property\|path}}”>
| [Binding to native element attributes](#native-binding) | class$="{{...}}", style$="{{...}}">
| [Reflecting properties to attributes](#attribute-reflection) | properties: \<prop>: { reflectToAttribute: true } }
| [Computed properties](#computed-properties) | computed: { \<property>: ‘computeFn(dep1, dep2)’ }
| [Annotated computed properties](#annotated-computed) | \<span>{{computeFn(dep1, dep2)}}\</span>
| [Read-only properties](#read-only) |  properties: { \<prop>: { readOnly: true } }
| [Utility functions](#utility-functions) | toggleClass, toggleAttribute, fire, async, …
| [General polymer settings](#settings) | \<script> Polymer = { ... }; \</script>

<a name="polymer-experimental"></a>
**Experimental elements and features**

**<span style="color:red">These features are experimental and there is a higher liklihood for future API change.</span>**  Names for custom elements starting with `x-` are placeholders while in experimental status; these will be renamed prior to 1.0.

| Feature | Usage
|---------|-------
| [Template repeater](#x-repeat) | \<template is="x-repeat" items="{{arr}}">
| [Array selector](#x-array-selector) | \<x-array-selector items="{{arr}}" selected="{{selected}}">
| [Auto-binding template](#x-autobind) | \<template is="x-autobind">
| [Cross-scope styling](#xscope-styling) | --custom-prop: value, var(--custom-prop), mixin(--custom-mixin)
| [Custom element for styling features](#x-style) | \<style is="x-style">
| [External stylesheets](#external-stylesheets) | \<link rel="import" type="css" href="...">
| [Polymer feature layers](#feature-layering) | polymer-micro.html, polymer-mini.html, polymer.html

# Bare-minum Custom Element sugaring

<a name="element-constructor"></a>
## Custom Element Constructor

The most basic Polymer API is `Polymer.Class({...})`, which takes an object expressing the prototype of your custom element, chains it to Polymer's `Base` prototype (which provides value-add features described below), and returns a constructor that can be passed to `document.registerElement()` to register your element with the HTML parser, and after which can be used to instantiate new instances of your element via code.

The only requirement for the prototype passed to `Polymer.Class` is that `is` property specifies the HTML tag name the element will be registered as.

Example:

```js
var MyElement = Polymer.Class({

  is: 'my-element',

  // See below for lifecycle callbacks
  created: function() {
    this.innerHTML = 'My element!';
  }

});

document.registerElement('my-element', MyElement);

// Equivalent:
var el1 = new MyElement();
var el2 = document.createElement('my-element');
```

`Polymer.Class` is designed to provide similar ergonomics to a speculative future where an ES6 class may be defined and provided to `document.registerElement` to achieve the same effect.

<a name="register-element"></a>
## Custom Element Registration

Because the vast majority of users will always want to register the custom element prototype generated by Polymer, Polymer provides a `Polymer({ ... })` function that wraps calling `Polymer.Class` and `document.registerElement`.

Example:

```js
MyElement = Polymer({

  is: 'my-element',

  // See below for lifecycle callbacks
  created: function() {
    this.innerHTML = 'My element!';
  }

});

var el1 = new MyElement();
var el2 = document.createElement('my-element');
```

<a name="bespoke-constructor"></a>
## Bespoke constructor support

While the standard `Polymer.Class()` and `Polymer()` functions return a basic constructor that can be used to instance the custom element, Polymer also supports providing a bespoke `constructor` function on the prototype that can, for example, accept arguments to configure the element.  In this case, the actual constructor returned from `Polymer` will first create an instance using `document.createElement`, then invoke the user-supplied `constructor` function with `this` bound to the element instance.

Example:

```js
MyElement = Polymer({

  is: 'my-element',

  constructor: function(foo, bar) {
    el.foo = foo;
    el.configureWithBar(bar);
  },

  configureWithBar: function(bar) {
    ...
  }

});

var el = new MyElement(42, 'octopus');
```

<a name="type-extension"></a>
## Native HTML element extension

Polymer 0.8 currently only supports extending native HTML elements (e.g. `input`, `button`, etc., as opposed to [extending other custom elements](#todo-inheritance)).  To extend a native HTML element, set the `extends` property to the tag name of the element to extend.


Example:

```js
MyInput = Polymer({

  is: 'my-input',

  extends: 'input',

  created: function() {
    this.style.border = '1px solid red';
  }

});

var el1 = new MyInput();
console.log(el1 instanceof HTMLInputElement); // true

var el2 = document.createElement('input', 'my-input');
console.log(el2 instanceof HTMLInputElement); // true
```

<a name="basic-callbacks"></a>
## Basic lifecycle callbacks

Polymer's Base prototype implements the standard Custom Element lifecycle callbacks to perform tasks necessary for Polymer's built-in features.  The hooks in turn call shorter-named lifecycle methods on your prototype.

- `created` instead of `createdCallback`
- `attached` instead of `attachedCallback`
- `detached` instead of `detachedCallback`
- `attributeChanged` instead of `attributeChangedCallback`

You can always fallback to using the low-level methods if you wish (in other words, you could simply implement `createdCallback` in your prototype).

Example:

```js
MyElement = Polymer({

  is: 'my-element',

  created: function() {
    console.log(this.localName + '#' + this.id + ' was created');
  },

  attached: function() {
    console.log(this.localName + '#' + this.id + ' was attached');
  },

  detached: function() {
    console.log(this.localName + '#' + this.id + ' was detached');
  },

  attributeChanged: function(name, type) {
    console.log(this.localName + '#' + this.id + ' attribute ' + name +
      ' was changed to ' + this.getAttribute(name));
  }

});
```

`Polymer.Base` also implements `registerCallback`, which will be called by `Polymer()` to allow `Polymer.Base` to supply a layering system for Polymer abstractions.

See the [section on configuring elements](#configuring-elements) for a more in-depth description of the practical uses of each callback.


<a name="property-config"></a>
## Configuring properties

Placing an object-valued `properties` property on your prototype allows you to define metadata regarding your Custom Element's properties, which can then be accessed via an API for use by other Polymer features.

By itself, the `properties` feature **doesn't do anything**. It only provides API for asking questions about these special properties (see featues below for details).

Example:

```js
Polymer({

  is: 'x-custom',

  properties: {
    user: String,
    isHappy: Boolean,
    count: {
      type: Number,
      readOnly: true,
      notify: true
    }
  },

  ready: function() {
    this.innerHTML = 'Hello World, I am a <b>Custom Element!</b>';
  }

});
```

Remember that the fields assigned to `count`, such as `readOnly` and `notify` don't do anything by themselves, it requires other features to give them life, and may depend on which layer of Polymer is in use.

<a name="attribute-deserialization"></a>
## Attribute deserialization

If a property is configured in the `properties` object with a `type` field, an attribute on the instance matching the property name will be deserialized according to the type specified and assigned to a property of the same name on the element instance.  If no other `properties` options are specified for a property, the `type` (specified using the type constructor, e.g. `Object`, `String`, etc.) can be set directly as the value of the property in the `properties` object; otherwise it should be provided as the value to the `type` key in the `properties` configuration object.

The type system includes support for Object and Array values expressed as JSON, or Date objects expressed as any Date-parsable string representation. Boolean properties set based on the existence of the attribute: if the attribute exists at all, its value is true, regardless of its string-value (and the value is only false if the attribute does not exist).

Example:

```html
<script>

  Polymer({

    is: 'x-custom',

    properties: {
      user: String,
      manager: {
        type: Boolean,
        notify: true
      }
    },

    attached: function() {
      // render
      this.innerHTML = 'Hello World, my user is ' + (this.user || 'nobody') + '.\n' +
        'This user is ' + (this.manager ? '' : 'not') + ' a manager.';
    }

  });

</script>

<x-custom user="Scott" manager></x-custom>
<!--
<x-custom>'s innerHTML becomes:
Hello World, my user is Scott.
This user is a manager.
-->
```

In order to configure camel-case properties of elements using attributes, dash-case should be used in the attribute name.  Example:

```html
<script>

  Polymer({

    is: 'x-custom',

    properties: {
      userName: String,
    }

  });

</script>

<x-custom user-name="Scott"></x-custom>
<!-- Sets <x-custom>.userName = 'Scott';  -->
```


Note: Deserialization occurs both at create time, as well as at runtime, e.g. when the attribute is changed via `setAttribute`.  However, it is encouraged that attributes only be used for configuring properties in static markup, and instead that properties are set directly for changes at runtime.

<a name="host-attributes"></a>
## Static attributes on host

If a custom elements needs HTML attributes set on it at create-time, these may be declared in a `hostAttributes` property on the prototype, where keys are the attribtue name and values are the values to be assigned.  Values should typically be provided as strings, as HTML attributes can only be strings; however, the standard `serialize` method is used to convert values to strings, so `true` will serialize to an empty attribute, and `false` will result in no attribtue set, and so forth (see [here](#attribute-serialization) for more details).

Example:

```html
<script>

  Polymer({

    is: 'x-custom',

    hostAttributes: {
      role: 'button',
      'aria-disabled': true
      tabindex: 0
    }

  });

</script>
```

Results in:

```html
<x-custom role="button" aria-disabled tabindex="0"></x-custom>
```

<a name="prototype-mixins"></a>
## Prototype mixins

Polymer will "mixin" objects specified in a `mixin` array into the prototype.  This can be useful for adding common code between multiple elements.

The current mixin feature in 0.8 is basic; it simply loops over properties in the provided object and adds property descriptors for those on the prototype (such that `set`/`get` accessors are copied in addition to properties and functions).  Note that there is currently no support for configuring properties or hooking lifecycle callbacks directly via mixins.  The general pattern is for the mixin to supply functions to be called by the target element as part of its usage contract (and should be documented as such).  These limitations will likely be revisited in the future.


Example: `fun-mixin.html`

```js
FunMixin = {

    funCreatedCallback: function() {
      this.makeElementFun();
    },

    makeElementFun: function() {
      this.style.border = 'border: 20px dotted fuchsia;';
    }
  };

});
```

Example: `my-element.html`

```html
<link rel="import" href="fun-mixin.html">

<script>
  Polymer({

    is: 'my-element',

    mixins: [FunMixin],

    created: function() {
      this.funCreatedCallback();
    }

  });
</script>
```

# Template stamping and tree lifecycle

<a name="template-stamping"></a>
## Template stamping into local DOM

We call the dom which an element is in charge of creating and managing its `local DOM`. This is distinct from the element's children which are sometimes called its `light DOM` for clarity.

When native Shadow DOM is used, "local DOM" is actually contained in a shadow root.  When the Shady DOM system is used, "local DOM" is a virtual notion maintained by Polymer with similar semantics to Shadow DOM.  Polymer normalizes these two systems via a common API, such that you can always think about the "local DOM" and "light DOM" trees in the same way regardless of the underlying implementation.

To specify dom to use for an element's local DOM, use the `<dom-module>` element.
Give the `<dom-module>` an `id` attribute that matches its element's
`is` property and put a `<template>` inside the `<dom-module>`.
Polymer will automatically stamp this template into the element's local DOM.

Example:

```html
<dom-module id="x-foo">
  <template>I am x-foo!</template>
</dom-module>

<script>
  Polymer({
    is: 'x-foo'
  });
</script>
```

We say that an element definition has an imperative and declarative portion. The imperative
portion is the call to `Polymer({...})`, and the declarative portion is the `<dom-module>`
element. The imperative and declarative portions of an element's definition may be placed
in the same html file or in separate files.

**NOTE:** Defining an element in the main html document is not currently supported.

<a name="scoped-styling"></a>
## Scoped styling

Polymer 0.8 uses "[Shadow DOM styling rules](http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-201/)" for providing scoped styling of the element's local DOM.  Scoped styles should be provided via `<style>` tags placed inside the `<dom-module>` for an element (but not inside the `<template>` -- note this is a slight deviation from typical Shadow DOM rules).

```html

<dom-module id="my-element">
  
  <style>
    :host {
      display: block;
      border: 1px solid red;
    }
    #child-element {
      background: yellow;
    }
    /* styling elements distributed to content (via ::content) requires */
    /* selecting the parent of the <content> element for compatibility with */
    /* shady DOM . This can be :host or a wrapper element. */
    .content-wrapper > ::content .special {
      background: orange;
    }
  </style>
  
  <template>
    <div id="child-element">In local Dom!</div>
    <div class="content-wrapper"><content></content></div>
  </template>
  
</dom-module>

<script>

    Polymer({
        is: 'my-element'
    });

</script>
```

Loading external stylesheets (as opposed to defining them inline in HTML) for styling local DOM is currently supported via an [experimental feature](#external-stylesheets).

<a name="dom-distribution"></a>
## DOM (re-)distribution

To support composition of an element's light DOM with its local DOM, Polymer supports the `<content>` element. The `<content>` element provides an insertion point at which an element's light DOM is combined with its local DOM. The `<content>` element supports a `select` attribute which filters nodes via a simple selector.

Polymer supports multiple local DOM implementations. On browsers that support ShadowDOM, ShadowDOM may be used to create local DOM. On other supported browsers, Polymer provides local DOM via a custom implementation called ShadyDOM which is inspired by and compatible with ShadowDOM.

Example:

```html
<template>
  <header>Local dom header followed by distributed dom.</header>
  <content select=".content"></content>
  <footer>Footer after distributed dom.</footer>
</template>
```
<a name="dom-api"></a>
## DOM API

Polymer provides custom API for manipulating DOM such that local DOM and light DOM trees are properly maintained.

**<div style="color:red">Note: All DOM manipulation must use this API, as opposed to DOM API directly on nodes.</div>**

The following methods are provided:

  * `Polymer.dom(parent).appendChild(node)`
  * `Polymer.dom(parent).insertBefore(node, beforeNode)`
  * `Polymer.dom(parent).removeChild(node)`
  * `Polymer.dom(parent).querySelector(selector)`
  * `Polymer.dom(parent).querySelectorAll(selector)`
  * `Polymer.dom(parent).childNodes`
  * `Polymer.dom(node).parentNode`
  * `Polymer.dom(contentElement).getDistributedNodes()`
  * `Polymer.dom(node).getDestinationInsertionPoints()`
  * `Polymer.dom.flush()` - The insert, append, and remove operations are trasnacted lazily in certain cases for performance.  In order to interrogate the dom (e.g. `offsetHeight`, `getComputedStyle`, etc.) immediately after one of these operations, call `Polymer.dom.flush()` first.

Calling `append`/`insertBefore` where `parent` is a custom Polymer element adds the node to the light DOM of the element.  In order to insert/append into the shadow root of a custom element, use `this.root` as the parent.

`Polymer.dom` properties and methods that return a list of nodes return an `Array`, not a `NodeList` like the standard DOM equivalent.

Example:

```js
var toLight = document.createElement('div');
Polymer.dom(this).appendChild(toLight);

var toLocal = document.createElement('div');
var beforeNode = Polymer.dom(this.root).childNodes[0];
Polymer.dom(this.root).insertBefore(toLocal, beforeNode);

var allSpans = Polymer.dom(this).querySelectorAll('span');
```

You can use `Polymer.dom` on any node, whether or not it has a local DOM tree:

Example:

```html
<template>
  <div id="container">
     <div id="first"></div>
     <content></content>
  </div>
</template>

...

var insert = document.createElement('div');
Polymer.dom(this.$.container).insertBefore(insert, this.$.first);

```

Sometimes it's necessary to access the elements which have been distributed to a given `<content>` insertion point or to know to which `<content>` a given node has been distributed. The `getDistributedNodes` and `getDestinationInsertionPoints` respectively provide this information.

Example:

```html
<x-foo>
  <div></div>
</x-foo>

// x-foo's template
<template>
  <content></content>
</template>
```

```js
var div = Polymer.dom(xFoo).querySelector('div');
var content = Polymer.dom(xFoo.root).querySelector('content');
var distributed = Polymer.dom(content).getDistributedNodes()[0];
var insertedTo = Polymer.dom(div).getDestinationInsertionPoints();

// the following should be true:
assert.equal(distributed, div);
assert.equal(insertedTo, content)
```

<a name="configure-values"></a>
## Configuring default property values

Default values for properties may be specified in the `properties` object using the `value` field.  The value may either be a primitive value, or a function that returns a value (which should be used for initializing Objects and Arrays to avoid shared objects on instances).

Example:

```js
Polymer({

  is: 'x-custom',
   
  properties: {
  
    mode: {
      type: String,
      value: 'auto'
    },
    
    data: {
      type: Object,
      notify: true,
      value: function() { return {}; }
    }
  
  }

});
```


<!--
<a name="configure-method"></a>
## Configure callback

The `configure` method is part of an element's lifecycle and is automatically called 'top-down' and should be used to initialize default values for properties.  The function must return an object containing key/value pairs that will be used to set properties (keys) to default values.

Example:

```js
configure: function() {
  // return default values of properties
  return {
      mode: 'auto',
      employees: []
  };
}
```
In general, the configure method should only return the object containing default values, and not cause any side-effects on `this` that may interact with children, as these will still be in an un-configured state at this point.  Such actions should be done in the [ready callback](#ready-method).
-->

<a name="ready-method"></a>
## Ready callback

The `ready` method is part of an element's lifecycle and is automatically called 'bottom-up' after the element's template has been stamped and all elements inside the element's local DOM have been configured (with values bound from parents, deserialized attributes, or else default values) and had their `ready` method called. Implement `ready` when it's necessary to manipulate an element's local DOM when the element is constructed.

Example:

```js
ready: function() {
  this.$.ajax.go();
}
```

# Declarative data binding, event handlers, and property effects

<a name="node-marshalling"></a>
## Local node marshalling

Polymer automatically builds a map of instance nodes stamped into its local DOM, to provide convenient access to frequently used nodes without the need to query for (and memoize) them manually.  Any node specified in the element's template with an `id` is stored on the `this.$` hash by `id`.

Example:

```html
<dom-module id="x-custom">
  <template>
    Hello World from <span id="name"></span>!
  </template>
</dom-module>

<script>

  Polymer({

    is: 'x-custom',

    created: function() {
      this.$.name.textContent = this.name;
    }

  });

</script>
```

<a name="event-listeners"></a>
## Event listener setup

Event listeners can be added to the host element by providing an object-valued `listeners` property that maps events to event handler function names.

Example:

```html
<dom-module id="x-custom">
  <template>
    <div>I will respond</div>
    <div>to a click on</div>
    <div>any of my children!</div>
  </template>
</dom-module>

<script>

  Polymer({

    is: 'x-custom',

    listeners: {
      'click': 'handleClick'
    },

    handleClick: function(e) {
      alert("Thank you for clicking");
    }

  });

</script>
```

<a name="annotated-listeners"></a>
## Annotated event listener setup

For adding event listeners to local-DOM children, a more convenient `on-<event>` annotation syntax is supported directly in the template.  This often eliminates the need to give an element an `id` solely for the purpose of binding an event listener.

Example:

```html
<dom-module id="x-custom">
  <template>
    <button on-click="handleClick">Kick Me</button>
  </template>
</dom-module>

<script>

  Polymer({

    is: 'x-custom',

    handleClick: function() {
      alert('Ow!');
    }

  });

</script>
```

<a name="change-callbacks"></a>
## Property change callbacks (observers)

Custom element properties may be observed for changes by specifying `observer` property in the `properties` for the property that gives the name of a funciton to call.  When the property changes, the change handler will be called with the new and old values as arguments.

Example:

```js
Polymer({

  is: 'x-custom',

  properties: {
    disabled: {
      type: Boolean,
      observer: 'disabledChanged'
    },
    highlight: {
      observer: 'highlightChanged'
    }
  },

  disabledChanged: function(newValue, oldValue) {
    this.toggleClass('disabled', newValue);
    this.highlight = true;
  },

  highlightChanged: function() {
    this.classList.add('highlight');
    setTimeout(function() {
      this.classList.remove('highlight');
    }, 300);
  }

});
```

Property change observation is achieved in Polymer by installing setters on the custom element prototype for properties with registered interest (as opposed to observation via Object.observe or dirty checking, for example).

Observing changes to multiple properties is supported via the `observers` object, by specifying a string-separated list of dependent properties that should result in a change function being called.  These observers differ from single-property observers in that the change handler is called asynchronously.

Example:

```js
Polymer({

  is: 'x-custom',

  properties: {
    preload: Boolean,
    src: String,
    size: String
  },

  observers: {
    'preload src size': 'updateImage'
  },

  updateImage: function(preload, src, size) {
    // ... do work using dependent values
  }

});
```

Additionally, observing changes to object sub-properties is also supported via the same `observers` object, by specifying a full (e.g. `user.manager.name`) or partial path (`user.*`) and function name to call.  In this case, the third argument will indicate the path that changed.  Note that currently the second argument (old value) will not be valid.

Example:

```js
Polymer({

  is: 'x-custom',

  properties: {
    user: Object
  },

  observers: {
    'user.manager.*': 'userManagerChanged'
  },

  userManagerChanged: function(newValue, oldValue, path) {
    if (path) {
      // sub-property of user.manager changed
      console.log('manager ' + path.split('.').pop() + ' changed to ' + newValue);
    } else {
      // user.manager object itself changed
      console.log('new manager name is ' + newValue.name);
    }
  }

});
```

Note that observing changes to paths (object sub-properties) is dependent on one of two requirements: either the value at the path in question changed via a Polymer [property binding](#property-binding) to another element, or the value was changed using the [`setPathValue`](#set-path) API, which provides the required notification to elements with registered interest.

<a name="property-binding"></a>
## Annotated property binding

### Basic property binding

Properties of the custom element may be bound into text content or properties of local DOM elements using binding annotations in the template.

To bind to textContent, the binding annotation must currently span the entire content of the tag:

```html
<dom-module id="user-view">
    <template>

      <!-- Supported -->
      First: <span>{{first}}</span><br>
      Last: <span>{{last}}</span>

      <!-- Not currently supported! -->
      <div>First: {{first}}</div>
      <div>Last: {{last}}</div>

    </template>
</dom-module>

<script>

  Polymer({

    is: 'user-view',

    properties: {
      first: String,
      last: String
    }

  });

</script>

<user-view first="Samuel" last="Adams"></user-view>

```

To bind to properties, the binding annotation should be provided as the value to an attribute with the same name of the JS property to bind to:

```html
<dom-module id="main-view">
  <template>
    <user-view first="{{user.first}}" last="{{user.last}}"></user-view>
  </template>
</dom-module>

<script>

  Polymer({

    is: 'main-view',

    properties: {
      user: Object
    }

  });

</script>
```

As in the example above, paths to object sub-properties may also be specified in templates.  See [Binding to structured data](#path-binding) for details.

In order to bind to camel-case properties of elements, dash-case should be used in the attribute name.  Example:

```html
<user-view first-name="{{managerName}}"></user-view>
<!-- will set <user-view>.firstName = this.managerName; -->
```

Note that while HTML attributes are used to specify bindings, values are assigned directly to JS properties, not to the HTML attributes of the elements unless specific [attribute bindings](#attribute-binding) are used.

<a name="property-notification"></a>
### Property change notification and Two-way binding

Polymer supports cooperative two-way binding between elements, allowing elements that "produce" data or changes to data to propagate those changes upwards to hosts when desired.

When a Polymer elements changes a property that was configured in `properties` with the `notify` flag set to true, it automatically fires a non-bubbling DOM event to indicate those changes to interested hosts.  These events follow a naming convention of `<property>-changed`, and contain a `value` property in the `event.detail` object indicating the new value.

As such, one could attach an `on-<property>-changed` listener to an element to be notified of changes to such properties, set the `event.detail.value` to a property on itself, and take necessary actions based on the new value.  However, given this is a common pattern, bindings using "curly-braces" (e.g. `{{property}}`) will automatically perform this upwards binding automatically without the user needing to perform those tasks.  This can be defeated by using "square-brace" syntax (e.g. `[[property]]`), which results in only one-way (downward) data-binding.

To summarize, two-way data-binding is achieved when both the host and the child agree to participate, satisfying these three conditions:

1. The host must use curly-brace `{{property}}` syntax.  Square-brace `[[property]]` syntax results in one-way downward binding, regardless of the notify state of the child's property.
2. The child property being bound to must be configured with the `notify` flag set to true (or otherwise send a `<property>-changed` custom event).  If the property being bound does not have the `notify` flag set, only one-way (downward) binding will occur.
3. The child property being bound to must not be configured with the `readOnly` flag set to true.  If the child property is `notify: true` and `readOnly:true`, and the host binding uses curly-brace syntax, the binding will effectively be one-way (upward).

Example 1: Two-way binding

```html
<script>

  Polymer({
    is: 'custom-element',
    properties: {
      prop: {
        type: String,
        notify: true
      }
    }
  });

</script>
...

<!-- changes to `value` propagate downward to `prop` on child -->
<!-- changes to `prop` propagate upward to `value` on host  -->
<custom-element prop="{{value}}"></custom-element>
```

Example 2: One-way binding (downward)

```html
<script>
  Polymer({
    is: 'custom-element',
    properties: {
      prop: {
        type: String,
        notify: true
      }
    }
  });
</script>

...

<!-- changes to `value` propagate downward to `prop` on child -->
<!-- changes to `prop` are ignored by host due to square-bracket syntax -->
<custom-element prop="[[value]]"></custom-element>
```

Example 3: One-way binding (downward)

```html
<script>

  Polymer({
    is: 'custom-element',
    properties: {
      prop: String    // no `notify:true`!
    }
  });

</script>
...

<!-- changes to `value` propagate downward to `prop` on child -->
<!-- changes to `prop` are not notified to host due to notify:falsey -->
<custom-element prop="{{value}}"></custom-element>
```

Example 4: One-way binding (upward)

```html
<script>
  Polymer({
    is: 'custom-element',
    properties: {
      prop: {
          type: String,
          notify: true,
          readOnly: true
        }
    }
  });
</script>

...

<!-- changes to `value` are ignored by child due to readOnly:true -->
<!-- changes to `prop` propagate upward to `value` on host  -->
<custom-element prop="{{value}}"></custom-element>
```

Example 5: Error / non-sensical state

```html
<script>

  Polymer({
    is: 'custom-element',
    properties: {
      prop: {
          type: String,
          notify: true,
          readOnly: true
        }
    }
  });

</script>

...

<!-- changes to `value` are ignored by child due to readOnly:true -->
<!-- changes to `prop` are ignored by host due to square-bracket syntax -->
<!-- binding serves no purpose -->
<custom-element prop="[[value]]"></custom-element>
```

### Custom notify event and binding to native elements

As mentioned above, Polymer uses an event naming convention to achieve two-way binding.  The act of two-way binding to a property using `target-prop={{hostProp}}` syntax results in Polymer adding a `<target-prop>-changed` event listener to the element by default.  All properties of a Polymer element with `notify: true` send events using this convention to notify of changes.

In order to two-way bind to native elements or non-Polymer elements that do not follow this event naming convention when notifying changes, you may specify a custom event name in the curley braces, delimited with `::`.

Example:

```html
<!-- Listens for `input` event and sets hostValue to <input>.value -->
<input value="{{hostValue::input}}">

<!-- Listens for `change` event and sets hostChecked to <input>.checked -->
<input type="checkbox" checked="{{hostChecked::change}}">

<!-- Listens for `timeupdate ` event and sets hostTime to <video>.currentTime -->
<video url="..." current-time="{{hostTime::timeupdate}}">
```

Note: When binding to standard notifying properties on Polymer elements, specifying the event name is unnecessary, as the default convention will be used.  The following constructions are equivalent:

```html

<!-- Listens for `value-changed` event -->
<my-element value="{{hostValue::value-changed}}">

<!-- Listens for `value-changed` event using Polymer convention by default -->
<my-element value="{{hostValue}}">

```


<a name="path-binding"></a>
### Binding to structured data

Sub-properties of objects may be two-way bound to properties of custom elements as well by specifying the path of interest to the binding annotation.

Example:

```html
<template>
  <div>{{user.manager.name}}</div>
  <user-element user="{{user}}"></user-element>
</template>
```

As with change handlers for paths, bindings to paths (object sub-properties) are dependent on one of two requirements: either the value at the path in question changed via a Polymer [property binding](#property-binding) to another element, or the value was changed using the [`setPathValue`](#set-path) API, which provides the required notification to elements with registered interest, as discussed below.

Note that path bindings are distinct from property bindings in a subtle way: when a property's value changes, an assignment must occur for the value to propagate to the property on the element at the other side of the binding.  However, if two elements are bound to the same path of a shared object and the value at that path changes (via a property binding or via `setPathValue`), the value seen by both elements actually changes with no additional assignment necessary, by virtue of it being a property on a shared object reference.  In this case, the element who changed the path must notify the system so that other elements who have registered interest in the same path may take side effects.  However, there is no concept of one-way binding in this case, since there is no concept of propagation.  That is, all bindings and change handlers for the same path will always be notified and update when the value of the path changes.

<a name="set-path"></a>
### Path change notification

Two-way data-binding and observation of paths in Polymer is achieved using a similar strategy to the one described above for [2-way property binding](#property-notification): When a sub-property of a property configured with `type: Object` changes, an element fires a non-bubbling `<property>-changed` DOM event with a `detail.path` value indicating the path on the object that changed.  Elements that have registered interest in that object (either via binding or change handler) may then take side effects based on knowledge of the path having changed.  Finally, those elements will forward the notification on to any children they have bound the object to, and will also fire a new `<property>-changed` event where `property` is the root object, to notify any hosts that may have bound root object down.  Through this method, a notification will reach any part of the tree that has registered interest in that path so that side effects occur.

This system "just works" to the extent that changes to object sub-properties occur as a result of being bound to a notifying custom element property that changed.  However, sometimes imperative code needs to "poke" at an object's sub-properties directly.  As we avoid more sophisticated observation mechanisms such as Object.observe or dirty-checking in order to achieve the best startup and runtime performance cross-platform for the most common use cases, changing an object's sub-properties directly requires cooperation from the user.

Specifically, Polymer provides two API's that allow such changes to be notified to the system: `notifyPath(path, value)` and `setPathValue(path, value)`.

Example:

```html
<dom-module id="custom-element">
  <template>
    <div>{{user.manager.name}}</div>
  </template>
</dom-module>

<script>
  Polymer({

    is: 'custom-element',

    reassignManager: function(newManager) {
      this.user.manager = newManager;
      // Notification required for binding to update!
      this.notifyPath('user.manager', this.user.manager);
    }

  });
</script>
```

Since in the majority of cases, notifyPath will be called directly after an assignment, a convenience function `setPathValue` is provided that performs both actions:

```js
reassignManager: function(newManager) {
  this.setPathValue('user.manager', newManager);
}
```

### Expressions in binding annotations

Currently the only binding expression supported in Polymer binding annotations is negation using `!`:

Example:

```html
<template>
  <div hidden="{{!enabled}}"></div>
</template>
```

<a name="attribute-binding"></a>
## Declarative attribute binding

In the vast majority of cases, binding data to other elements should use property binding described above, where changes are propagated by setting the new value to the JavaScript property on the element.

However, there may be cases where a user actually needs to set an attribute on an element, as opposed to a property.  These include a handful of [problematic native HTML attributes](#native-binding), when attribute selectors are used for CSS or for for interoperability with elements that require using attribute-based API.

Polymer provides an alternate binding annotation syntax to make it explicit when binding values to attributes is desired by using `$=` rather than `=`.  This results in in a call to `element.setAttribute('<attr>', value);`, as opposed to `element.property = value;`.

```html
<template>

  <!-- Attribute binding -->
  <my-element selected$="{{value}}"></my-element>
  <!-- results in <my-element>.setAttribute('selected', this.value); -->

  <!-- Property binding -->
  <my-element selected="{{value}}"></my-element>
  <!-- results in <my-element>.selected = this.value; -->

</template>
```

Values will be serialized according to type: Arrays/Objects will be `JSON.stringify`'ed, booleans will result in a non-valued attribute to be either set or removed, and `Dates` and all primitive types will be serialized using the value returned from `toString`.

Again, as values must be serialized to strings when binding to attributes, it is always more performant to use property binding for pure data propagation.

<a name="native-binding"></a>
## Binding to native element attributes

There are a handful of extremely common native element attributes which can also be modified as properties.  Due to cross-browser limitations with the ability to place binding braces `{{...}}` in some of these attribute values, as well as the fact that some of these attributes map to differently named JS properties, it is recommended to always use attribute binding (using `$=`) when binding dynamic values to these specific attributes, rather than binding to their property names.

Normal attribute assignment to static values:

```html
<!-- class -->
<div class="foo"></div>

<!-- style -->
<div style="background: red;"></div>

<!-- href -->
<a href="http://foo.com">

<!-- label for -->
<label for="bar"></label>

<!-- dataset -->
<div data-bar="baz"></div>
```

Attribute binding to dynamic values (use `$=`):

```html
<!-- class -->
<div class$="{{foo}}"></div>

<!-- style -->
<div style$="{{background}}"></div>

<!-- href -->
<a href$="{{url}}">

<!-- label for -->
<label for$="{{bar}}"></label>

<!-- dataset -->
<div data-bar$="{{baz}}"></div>
```

<a name="attribute-reflection"></a>
## Reflecting properties to attributes

In specific cases, it may be useful to keep an HTML attribute value in sync with a property value.  This may be achieved by setting `reflectToAttribute: true` on a property in the `properties` configuration object.  This will cause any change to the property to be serialized out to an attribute of the same name.

```html
<script>
  Polymer({

    properties: {
     response: {
        type: Object,
        reflectToAttribute: true
     }
    },

    responseHandler: function(response) {
      this.response = 'loaded';
      // results in this.setAttribute('response', 'loaded');
    }

  });
</script>
```

<a name="attribute-serialization'></a>
Values will be serialized according to type; by default Arrays/Objects will be `JSON.stringify`'ed, booleans will result in a non-valued attribute to be either set or removed, and `Dates` and all primitive types will be serialized using the value returned from `toString`.  The `serialize` method may be overridden to supply custom object serialization.

<a name="computed-properties"></a>
## Computed properties

Polymer supports virtual properties whose values are calculated from other properties.  Computed properties can be defined in the `properties` object by providing a `computed` key mapping to a computing function.  The name of the function to compute the value is provided as a string with dependent properties as arguments in parenthesis.  The function will be called once (asynchronously) for any change to the dependent properties.

```html
<dom-module id="x-custom">
  <template>
    My name is <span>{{fullName}}</span>
  </template>
<dom-module id="x-custom">

<script>
  Polymer({

    is: 'x-custom',

    properties: {

      first: String,

      last: String,

      fullName: {
        type: String,
        // when `first` or `last` changes `computeFullName` is called once
        // (asynchronously) and the value it returns is stored as `fullName`
        computed: 'computeFullName(first, last)'
      } 

    },

    computeFullName: function(first, last) {
      return first + ' ' + last;
    }

    ...

  });
</script>
```

Note: Only direct properties of the element (as opposed to sub-properties of an object) can be used as dependencies at this time.

<a name="annotated-computed"></a>
## Annotated computed properties

Anonymous computed properties may also be placed directly in template binding annotations.  This is useful when the property need not be a part of the element's API or otherwise used by logic in the element, and is only used for downward data propagation.  Note: this is the only form of functions allowed in template bindings.

Example:

```html
<dom-module id="x-custom">
  <template>
    My name is <span>{{computeFullName(first, last)}}</span>
  </template>
<dom-module id="x-custom">

<script>
  Polymer({

    is: 'x-custom',

    properties: {

      first: String,

      last: String
      
    },

    computeFullName: function(first, last) {
      return first + ' ' + last;
    }

    ...

  });
</script>
```



<a name="read-only"></a>
## Read-only properties

When a property only "produces" data and never consumes data, this can be made explicit to avoid accidental changes from the host by setting the `readOnly` flag to `true` in the `properties` property definition.  In order for the element to actually change the value of the property, it must use a private generated setter of the convention `_set<Property>(value)`.

```html
<script>
  Polymer({

    properties: {
      response: {
        type: Object,
        readOnly: true,
        notify: true
      }
    },

    responseHandler: function(response) {
      this._setResponse(response);
    }

    ...

  });
</script>
```

Generally, read-only properties should also be set to `notify: true` such that their changes are observable from above.

<a name="utility-functions"></a>
## Utility Functions

Polymer's Base prototype provides a set of useful convenience/utility functions for instances to use.  See API documentation for more details.

* toggleClass: function(name, bool, [node])
* toggleAttribute: function(name, bool, [node])
* attributeFollows: function(name, neo, old)
* fire: function(type, [detail], [onNode], [bubbles], [cancelable])
* async: function(method)
* transform: function(node, transform)
* translate3d: function(node, x, y, z)
* importHref: function(href, onload, onerror)

<a name="settings"></a>
## Global Polymer settings

Document-level global Polymer settings can be set before loading by setting a `Polymer` object on window as the first script in the main document:

```html
<html>
<head>
  <meta charset="utf-8">
  <script> Polymer = { dom: 'shadow' }; </script>
  <script src="../../../webcomponentsjs/webcomponents-lite.js"></script>
  <link rel="import" href="components/my-app.html">
</head>
<body>

  ...
    
```

Settings can also be switched on the URL query string:

```
http://myserver.com/test-app/index.html?dom=shadow
```

Available settings:

* `dom` - options:
    * `shady` - all local DOM will be rendered using Shady DOM (even where shadow-DOM supported (current default)
    * `shadow` - local DOM will be rendered using Shadow DOM where supported (this will be made default soon)

# Experimental Features & Elements

<a name="x-repeat"></a>
## Template repeater (x-repeat)
EXPERIMENTAL - API MAY CHANGE

Elements in a template can be automatically repeated and bound to array items using a custom `HTMLTemplateElement` type extension called `x-repeat`.  `x-repeat` accepts an `items` property, and one instance of the template is stamped for each item into the DOM at the location of the `x-repeat` element.  The `item` property will be set on each instance's binding scope, thus templates should bind to sub-properties of `item`.  Example:

```html
<dom-module id="employee-list">

  <template>

    <div> Employee list: </div>
    <template is="x-repeat" items="{{employees}}">
        <div>First name: <span>{{item.first}}</span></div>
        <div>Last name: <span>{{item.last}}</span></div>
    </template>

  </template>

  <script>
    Polymer({
      is: 'employee-list',
      ready: function() {
        this.employees = [
            {first: 'Bob', last: 'Smith'},
            {first: 'Sally', last: 'Johnson'},
            ...
        ];
      }
    });
  </script>

</dom-module>
``` 

Notifications for changes to items sub-properties will be forwarded to template instances, which will update via the normal [structured data notification system](#path-binding).

Mutations to the `items` array itself (`push`, `pop`, `splice`, `shift`, `unshift`) are observed via `Array.observe` (where supported, or an experimental shim of this API on unsupported browsers), and template instances are kept in sync with the data in the array.

A view-specific filter/sort may be applied to each `x-repeat` by supplying a `filter` and/or `sort` property.  This may be a string that names a function on the host, or a function may be assigned to the property directly.  The functions should implemented following the standard `Array` filter/sort API.

In order to re-run the filter or sort functions based on changes to sub-fields of `items`, the `observe` property may be set as a space-separated list of `item` sub-fields that should cause a re-filter/sort when modified.

For example, for an `x-repeat` with a filter of the following:

```js
isEngineer: function(item) {
    return item.type == 'engineer' || item.manager.type == 'engineer';
}
```

Then the `observe` property should be configured as follows:

```html
<template is="x-repeat" items="{{employees}}" 
          filter="isEngineer" observe="type manager.type">
```

<a name="x-array-selector"></a>
## Array selector (x-array-selector)
EXPERIMENTAL - API MAY CHANGE

Keeping structured data in sync requires that Polymer understand the path associations of data being bound.  The `x-array-selector` element ensures path linkage when selecting specific items from an array (either single or multiple).  The `items` property accepts an array of user data, and via the `select(item)` and `deselect(item)` API, updates the `selected` property which may be bound to other parts of the application, and any changes to sub-fields of `selected` item(s) will be kept in sync with items in the `items` array.  When `multi` is false, `selected` is a property representing the last selected item.  When `multi` is true, `selected` is an array of multiply selected items.

```html
<dom-module id="employee-list">

  <template>

    <div> Employee list: </div>
    <template is="x-repeat" id="employeeList" items="{{employees}}">
        <div>First name: <span>{{item.first}}</span></div>
        <div>Last name: <span>{{item.last}}</span></div>
        <button on-click="toggleSelection">Select</button>
    </template>
    
    <x-array-selector id="selector" items="{{employees}}" selected="{{selected}}" multi toggle></x-array-selector>
    
    <div> Selected employees: </div>
    <template is="x-repeat" items="{{selected}}">
        <div>First name: <span>{{item.first}}</span></div>
        <div>Last name: <span>{{item.last}}</span></div>
    </template>
    
  </template>

  <script>
    Polymer({
      is: 'employee-list',
      ready: function() {
        this.employees = [
            {first: 'Bob', last: 'Smith'},
            {first: 'Sally', last: 'Johnson'},
            ...
        ];
      },
      toggleSelection: function(e) {
        var item = this.$.employeeList.itemForElement(e.target);
        this.$.selector.select(item);
      }
    });
  </script>

</dom-module>
``` 

<a name="x-autobind"></a>
## Auto-binding template
EXPERIMENTAL - API MAY CHANGE

Polymer's binding features are only available within templates that are managed by Polymer.  As such, these features are available in templates used to define Polymer elements, for example, but not for elements placed directly in the main document.

In order to use Polymer bindings without defining a new custom element, you may wrap the elements utilizing bindings with a custom template extension called `x-autobind`.  This template will immediately stamp itself into the main document and bind elements to the template itself as the binding scope.

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="components/webcomponentsjs/webcomponents-lite.js"></script>
  <link rel="import" href="components/polymer/polymer.html">
  <link rel="import" href="components/core-ajax/core-ajax.html">

</head>
<body>

  <!-- Wrap elements in with auto-binding template to -->
  <!-- allow use of Polymer bindings main document -->
  <template is="x-autobind">
    
    <core-ajax url="http://..." lastresponse="{{data}}"></core-ajax>
    
    <template is="x-repeat" items="{{data}}">
        <div><span>{{item.first}}</span> <span>{{item.last}}</span></div>
    </template>
    
  </template>

</body>
</html>
```

<a name="xscope-styling"></a>
## Cross-scope styling
EXPERIMENTAL - API MAY CHANGE

### Background

Shadow DOM (and its approximation via Shady DOM) bring much needed benefits of scoping and style encapsulation to web development, making it safer and easier to reason about the effects of CSS on parts of your application.  Styles do not leak into the local DOM from above, and styles do not leak from one local DOM into the local DOM of other elements inside.

This is great for *protecting* scopes from unwanted style leakage.  But what about when you intentionally want to *customize* the style of a custom element's local DOM, as the user of an element?  This often comes up under the umbrella of "theming".  For example a "custom-checkbox" element that may interally use a `.checked` class can protect itself from being affected by CSS from other components that may also happen to use a `.checked` class.  However, as the user of the checkbox you may wish to intentionally change the color of the check to match your product's branding, for example.  The "protection" that Shadow DOM provides at the same time introduces a practical barrier to "theming" use cases.

One solution the Shadow DOM spec authors provided to address the theming problem are the `/deep/` and `::shadow` combinators, which allow writing rules that pierce through the Shadow DOM encapsulation boundary.  Although Polymer 0.5 promoted this mechanism for theming, it was ultimately unsatisfying for several reasons: 

* Using `/deep/` and `::shadow` for theming leaks details of an otherwise encapsulated element to the user, leading to brittle selectors piercing into the internal details of an element's Shadow DOM that are prone to breakage when the internal implementation changes.  As a result, the structure of of an element's Shadow DOM inadvertently becomes API surface subject to breakage, diminishing the practical effectiveness of Shadow DOM as an encapsulation primitive.
* Although Shadow DOM's style encapsulation *improves* the predictability of style recalc performance since the side effects of a style change are limited to a small subset of the document, using `/deep/` and `::shadow` re-open the style invalidation area and reduce Shadow DOM's effectiveness as a performance primitive.
* Using `/deep/` and `::shadow` lead to verbose and difficult to understand selectors.

For the reasons above, the Polymer team is currently exploring other options for theming that address the shortcomings above and provide a possible path to obsolescence of `/deep/` and `::shadow` altogether.

<a name="xscope-styling-details"></a>
### Custom CSS properties

Polymer 0.8 includes a highly experimental and opt-in shim for custom CSS properties inspired by (and compatible with) the future W3C [CSS Custom Properties for Cascading Variables](http://dev.w3.org/csswg/css-variables/) specification (see [explainer on MDN here](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables)).

Rather than exposing the details of an element's internal implementation for theming, instead an element author would define one or more custom CSS properties as part of the element's API which it would consume to style internals of the element deemed important for theming by the element's author.  These custom properties can be defined similar to other standard CSS properties and will inherit from the point of definition down the composed DOM tree, similar to the effect of `color` and `font-family`.

In the simple example below, the author of `my-toolbar` identified the need for users of the toolbar to be able to change the color of the toolbar title.  The author exposed a custom property called `--my-toolbar-title-color` which is assigned to the `color` property of the selector for the title element.  Users of the toolbar may define this variable in a CSS rule anywhere up the tree, and the value of the property will inherit down to the toolbar where it is used if defined, similar to other standard inheriting CSS properties.

Example:

```html
<dom-module id="my-toolbar">

  <style>
    :host {
      padding: 4px;
      background-color: gray;
    }
    .title {
      color: var(--my-toolbar-title-color);
    }
  </style>
  
  <template>
    <span class="title">{{title}}</span>
  </template>
  
  <script>
    Polymer({
      is: 'my-toolbar',
      properties: {
        title: String
      },
      // The custom properties shim is currently an opt-in feature
      enableCustomStyleProperties: true
    });
  </script>

</dom-module>
```

Example usage of `my-toolbar`:

```html
<dom-module id="my-element">

  <style>

    /* Make all toolbar titles in this host green by default */
    :host {
      --my-toolbar-title-color: green;
    }

    /* Make only toolbars with the .warning class red */
    .warning {
      --my-toolbar-title-color: red;
    }

  </style>
  
  <template>
  
    <my-toolbar title="This one is green."></my-toolbar>
    <my-toolbar title="This one is green too."></my-toolbar>

    <my-toolbar class="warning" title="This one is red."></my-toolbar>
  
  </template>

</dom-module>
```

The `--my-toolbar-title-color` property will only affect the color of the title element encapsulated in `my-toolbar`'s internal implementation.  If in the future the `my-toolbar` author chose to rename the `.title` class or otherwise restructure the internal details of `my-toolbar`, users are shielded from this change via the indirection afforded by custom properties.

Thus, custom CSS properties introduce a powerful way for element authors to expose a theming API to their users in a way that naturally fits right alongside normal CSS styling and avoids the problems with `/deep/` and `::shadow`, and is already on a standards track with shipping implementation by Mozilla and planned support by Chrome.

However, it may be tedious (or impossible) for an element author to anticipate and expose every possible CSS property that may be important for theming an element as individual CSS properties (for example, what if a user needed to adjust the `opacity` of the toolbar title?).  For this reason, the custom properties shim included in Polymer includes an experimental extension allowing a bag of CSS properties to be defined as a custom property and allowing all properties in the bag to be applied to a specific CSS rule in an element's local DOM.  For this, we introduce a `mixin` capability that is analogous to `var`, but allows an entire bag of properties to be mixed in.

Example:

```html
<dom-module id="my-toolbar">

  <style>
    :host {
      padding: 4px;
      background-color: gray;
      mixin(--my-toolbar-theme);
    }
    .title {
      mixin(--my-toolbar-title-theme);
    }
  </style>
  
  <template>
    <span class="title">{{title}}</span>
  </template>
  
  ...
  
</dom-module>
```

Example usage of `my-toolbar`:

```html
<dom-module id="my-element">

  <style>

    /* Apply custom theme to toolbars */
    :host {
      --my-toolbar-theme: {
        background-color: green;
        border-radius: 4px;
        border: 1px solid gray;
      }
      --my-toolbar-title-theme: {
        color: green;
      }
    }

    /* Make only toolbars with the .warning class red and bold */
    .warning {
      --my-toolbar-title-theme: {
        color: red;
        font-weight: bold;
      }
    }

  </style>
  
  <template>
  
    <my-toolbar title="This one is green."></my-toolbar>
    <my-toolbar title="This one is green too."></my-toolbar>

    <my-toolbar class="warning" title="This one is red."></my-toolbar>
  
  </template>

</dom-module>
```

### Custom Properties Shim - Limitations and API details

Experimental cross-platform support for custom properties is provided in Polymer by a Javascript library that approximates the capabilities of the CSS Variables specification  *for the specific use case of theming custom elements*, while also extending it to add the mixin capability described above.  **It is important to note that this is not a full polyfill**, as doing so would be prohibitively expensive; rather this is a shim that is inspired by that specification and trades off aspects of the full dynamism possible in CSS with practicality and performance.

Below are current limitations of this experimental system.  Improvements to performance and dynamism will continue to be explored. 

* As this feature is still experimental, custom properties are not currently applied to elements by default.  To enable *usage* of custom properties, set an `enableCustomStyleProperties: true` property on the Polymer element prototype.

* Only rules which match the element at *creation time* are applied. Any dynamic changes that update variable values are not applied automatically.

    ```html
    <div class="container">
      <x-foo class="a"></x-foo>
    </div>
    ```
    
    ```css
    /* applies */
    x-foo.a {
      --foo: brown;
    }
    /* does not apply */
    x-foo.b {
      --foo: orange;
    }
    /* does not apply to x-foo */
    .container {
      --nog: blue;
    }
    ```
* Re-evaluation of custom property styles does not currently occur as a result of changes to the DOM.  Re-evaluation can be forced by calling `this.updateStyles()` on a Polymer element.  For example, if class `b` was added to `x-foo` above, the scope must call `this.updateStyles()` to apply the styling. This re-calcs/applies styles down the tree from this point.

* Dynamic effects are reflected at the point of a variable’s application, but not its definition.  

    For the following example, adding/removing the `highlighted` class on the `#title` element will have the desired effect, since the dynamism is related to *application* of a custom property.

    ```css
    #title {
      background-color: var(--title-background-normal);
    }

    #title.highlighted {
      background-color: var(--title-background-highlighted);
    }
    ```
    
    However, the shim does not currently support dynamism at the point of *definition* of a custom property.  In the following example, `this.updateStyles()` would be required to update the value of `--title-background` being applied to `#title` when the `highlighted` class was added or removed.
    
    ```css
    #title {
      --title-background: gray;
    }

    #title.highlighted {
      --title-background: yellow;
    }
    ```

<a name="x-style"></a>
## Custom element for document styling (x-style)
EXPERIMENTAL - API MAY CHANGE

An experimental `<style is="x-style">` custom element is provided for defining styles in the main document that can take advantage of several special features of Polymer's styling system:

* Document styles defined in an `x-style` will be shimmed to ensure they do not leak into local DOM when running on browsers without non-native Shadow DOM.
* Shadow DOM-specific `/deep/` and `::shadow` combinators will be shimmed on browsers without non-native Shadow DOM.
* Custom properties used by Polymer's experimental [shim for cross-scope styling](#xscope-styling-details) may be defined in an `x-style`.

Example:

```html
<!doctype html>
<html>
<head>
  <script src="components/webcomponentsjs/webcomponents-lite.js"></script>
  <link rel="import" href="components/polymer/polymer.html">

  <style is="x-style">
    
    /* Will be prevented from affecting local DOM of Polymer elements */
    * {
      box-sizing: border-box;
    }
    
    /* Can use /deep/ and ::shadow combinators */
    body /deep/ .my-special-view::shadow #thing-inside {
      background: yellow;
    }
    
    /* Custom properties that inherit down the document tree may be defined */
    * {
      --my-toolbar-title-color: green;
    }
    
  </style>

</head>
<body>

    ...

</body>
</html>
```

Note, all features of `x-style` are available when defining styles as part of Polymer elements (e.g. `<style>` elements within `<dom-module>`'s used for defining Polymer elements. The `x-style` extension should only be used for defining document styles, outside of a custom element's local DOM.

<a name="external-stylesheets"></a>
## External stylesheets
EXPERIMENTAL - API MAY CHANGE

Polymer includes an experimental feature to support loading external stylesheets that will be applied to the local DOM of an element.  This is typically convenient for developers who like to separate styles, share common styles between elements, or use style pre-processing tools.  The syntax is slightly different from how stylesheets are typically loaded, as the feature leverages HTML Imports (or the HTML Imports polyfill, where appropriate) to load the stylesheet text such that it may be properly shimmed and/or injected as an inline style.

To include a remote stylesheet that applies to your Polymer element's local DOM, place a special HTML import `<link>` tag with `type="css"` in your `<dom-module>` that refers to the external stylesheet to load.

Example:

```html
<dom-module id="my-awesome-button">

  <!-- special import with type=css used to load remote CSS -->
  <link rel="import" type="css" href="my-awesome-button.css">
  
  <template>
    ...
  </template>
  
  <script>
    Polymer({
      is: 'my-awesome-button',
      ...
    });
  </script>

</dom-module>
```

<a name="feature-layering"></a>
## Feature layering
EXPERIMENTAL - API MAY CHANGE

Polymer 0.8 is currently layered into 3 sets of features provided as 3 discrete HTML imports, such that an individual element developer can depend on a version of Polymer whose feature set matches their tastes/needs.  For authors who opt out of the more opinionated local DOM or data-binding features, their element's dependencies would not be payload- or runtime-burdened by these higher-level features, to the extent that a user didn't depend on other elements using those features on that page.  That said, all features are designed to have low runtime cost when unused by a given element.

Higher layers depend on lower layers, and elements requiring lower layers will actually be imbued with features of the highest-level version of Polymer used on the page (those elements would simply not use/take advantage of those features).  This provides a good tradeoff between element authors being able to avoid direct dependencies on unused features when their element is used standalone, while also allowing end users to mix-and-match elements created with different layers on the same page.

* polymer-micro.html: [Polymer micro features](#polymer-micro) (bare-minum Custom Element sugaring)
* polymer-mini.html: [Polymer mini features](#polymer-mini) (template stamped into "local DOM" and tree lifecycle)
* polymer.html: [Polymer standard features](#polymer-standard) (all other features: declarative data binding and event handlers, property nofication, computed properties, and experimental features)

This layering is subject to change in the future and the number of layers may be reduced.

---

<a name="migration-notes"></a>
# Migration Notes

This section covers how to deal with yet-unimplemented and/or de-scoped features in Polymer 0.8 as compared to 0.5.  Many of these are simply un-implemented; that is, we will likely have a final "solution" that addresses the need, we just haven't tackled that feature yet as we address items in priority order.  Other solutions in 0.8 may be lower-level as compared to 0.5, and will be explained here.

As the final 0.8 API solidifies, this section will be updated accordingly.  As such, this section should be considered answers "how do I solve problem xyz <em>TODAY</em>", rather than a representation of the final Polymer 0.8 API.

## Property casing

TL;DR: When binding to camel-cased properties, use "dash-case" attribute names to indicate the "camelCase" property to bind to.

Example: bind `this.myValue` to `<x-foo>.thatValue`:

BEFORE: 0.5

```html
<x-foo thatValue="{{myValue}}"></x-foo>
```

AFTER: 0.8

```html
<x-foo that-value="{{myValue}}"></x-foo>
```

In 0.5, binding annotations were allowed to mixed-case properties (despite the fact that attribute names always get converted to lower-case by the HTML parser), and the Node.bind implementation at the "receiving end" of the binding automatically inferred the mixed-case property it was assumed to refer to at instance time.

In 0.8, "binding" is done at prorotype time before the type of the element being bound to is known, hence knowing the exact JS property to bind to allows better efficiency.

## Binding limitations

Current limitations that are on the backlog for evaluation/improvement are listed below, with current workarounds:

* Sub-textContent/property binding
    * You cannot currrently do any of the following:
    
      ```html
      <div> stuff here: {{stuff}}</div>
      <div class$="{{thing}} {{another}}"></div>
      <x-custom prop="{{thing}} {{another}}"></x-custom>
      ```
    
    * Instead, use `<span>`'s to break up textContent into discrete elements:

      ```html
      <div> stuff here: <span>{{stuff}}</span></div>
      ```
      
    * Use computed properties for concatenating into properties/attributes:

      ```html
      <div class$="{{computeDivClass(thing, another)}}"></div>
      <x-custom prop="{{computeCustomProp(thing, another}}"></x-custom>
      ```

* CSS class binding:
    * May bind entire class list from one property to `class` _attribute_:
      `<div class$="{{classes}}">`
    * Otherwise, `this.classList.add/remove` from change handlers
* CSS inline-style binding:
    * May bind entire inline style from one property to `style` _attribute_:
      `<div style$="{{styles}}">`
    * Otherwise, assign `this.style.props` from change handlers

## Structured data and path notification

To notify non-bound structured data changes, use `setPathValue` and `notifyPath`:

```js
this.setPathValue('user.manager', 'Matt');
```

Which is equivalent to:

```js
this.user.manager = 'Matt';
this.notifyPath('user.manager', this.user.manager);
```

## Repeating elements

Repeating templates is moved to a custom element (HTMLTemplateElement type extension called `x-repeat`):

```html
<template is="x-repeat" items="{{users}}">
  <div>{{item.name}}</div>
</template>
```

## Array notification

This area is in high flux.  Arrays bound to `x-repeat` are currently observed using `Array.observe` (or equivalent shim) and `x-repeat` will reflect changes to array mutations (push, pop, shift, unshift, splice) asynchronously.

**In-place sort of array is not supported**.  Sorting/filtering will likely be provided as a feature of `x-repeat` (and possibly other array-aware elements such as `x-list`) in the future.

Implementation and usage details will likely change, stay tuned.

<a name="todo-inheritance"></a>
## Mixins / Inheritance

TODO - use composition for now

## Gesture support

TODO - use standard DOM for now until gesture support is ported
