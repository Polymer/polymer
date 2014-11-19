  // a tiny bit of sugar for `document.currentScript.ownerDocument`
  // sadly `import` is reserved, so we need another name or
  // you have to refer to this value `window.import`
  Object.defineProperty(window, 'import', {
    enumerable: true,
    configurable: true,
    get: function() {
      return (document._currentScript || document.currentScript).ownerDocument;
    }
  });

  // copy own properties from 'api' to 'prototype, with name hinting for 'super'
  function extend(prototype, api) {
    if (prototype && api) {
      // use only own properties of 'api'
      Object.getOwnPropertyNames(api).forEach(function(n) {
        // acquire property descriptor
        var pd = Object.getOwnPropertyDescriptor(api, n);
        if (pd) {
          // clone property via descriptor
          Object.defineProperty(prototype, n, pd);
          // cache name-of-method for 'super' engine
          /*
          if (typeof pd.value == 'function') {
            // hint the 'super' engine
            pd.value.nom = n;
          }
          */
        }
      });
    }
    return prototype;
  };

  Event.prototype.keys = {
    ESC_KEY: 27,
    ENTER_KEY: 13
  };

  Base = {

    // (semi-)pluggable features for Base
    _features: [],

    addFeature: function(feature) {
      this._features.push(feature);
      extend(Base, feature);
      delete Base.init;
      delete Base.register;
    },

    registerCallback: function() {
      // `this` context is a prototype, not an instance
      var prototype = this;
      this.registerFeatures(prototype);
      this.registered(prototype);
    },

    registered: function(prototype) {
      // for overriding
    },

    registerFeatures: function(prototype) {
      var f$ = this._features;
      for (var i=0, n=f$.length; i<n && (f=f$[i]); i++) {
        f.register && f.register(prototype);
      }
    },

    createdCallback: function() {
      this.root = this;
      this.beforeCreated();
      this.initFeatures();
      this.created();
      this.afterCreated();
    },

    beforeCreated: function() {
      // for overriding
    },

    initFeatures: function() {
      var f$ = this._features;
      for (var i=0, n=f$.length; i<n && (f=f$[i]); i++) {
        f.init && f.init.call(this);
      }
    },

    created: function() {
      // for overriding
    },

    afterCreated: function() {
      // for overriding
    },

    attachedCallback: function() {
      // reserved for canonical behavior
      this.attached();
    },

    attached: function() {
      // for overriding
    },

    detachedCallback: function() {
      // reserved for canonical behavior
      this.detached();
    },

    detached: function() {
      // for overriding
    },

    attributeChangedCallback: function() {
      // reserved for canonical behavior
      this.attributeChanged.apply(this, arguments);
    },

    attributeChanged: function() {
      // for overriding
    }

  };

  Base.__proto__ = HTMLElement.prototype;

  Polymer = function(prototype) {
    prototype.__proto__ = Base;
    prototype.registerCallback();
    document.registerElement(prototype.name, {prototype: prototype});
  };

  Polymer.log = {
  };

  Base.addFeature({
    log: function() {
      var args = Array.prototype.slice.call(arguments, 0);
      args[0] = '[%s]: ' + args[0];
      args.splice(1, 0, this.localName);
      console.log.apply(console, args);
    }
  });

  /*
   * Define public property API.
   *
   * published: {
   *   <property>: <Type || Object>,
   *   ...
   *
   *   // `foo` property can be assigned via attribute, will be deserialized to
   *   // the specified data-type. All `published` properties have this behavior.
   *   foo: String,
   *
   *   // `bar` property has additional behavior specifiers.
   *   //   type: type for (de-)serialization
   *   //   notify: true to send a signal when a value is set to this property
   *   //   reflect: true to serialize the property to an attribute
   *   //   readOnly: if true, the property has no setter
   *   bar: {
   *     type: Boolean,
   *     notify: true
   *   }
   * }
   *
   */
  Base.addFeature({

    published: {
    },

    nob: Object.create(null),

    register: function(prototype) {
      // TODO(sjmiles): improve layering
      if (prototype.addPropertyEffect) {
        for (var n in prototype.published) {
          if (prototype.isNotifyProperty(n)) {
            prototype.addPropertyEffect(n, 'notify');
          }
        }
      }
    },

    getPublishInfo: function(property) {
      var p = this.published[property];
      if (typeof(p) === 'function') {
        p = this.published[property] = {
          type: p
        };
      }
      return p || Base.nob;
    },

    getPublishedPropertyType: function(property) {
      return this.getPublishInfo(property).type;
    },

    isReadOnlyProperty: function(property) {
      return this.getPublishInfo(property).readOnly;
    },

    isNotifyProperty: function(property) {
      return this.getPublishInfo(property).notify;
    },

    isReflectedProperty: function(property) {
      return this.getPublishInfo(property).reflect;
    }

  });

  /*
   * Support for `hostAttributes` property.
   *
   * `hostAttributes` is a space separated string of attributes to
   * install on every instance.
   *
   * There is room for addition `attributes` features, namely:
   *
   * - potentially automatic handling of attributeChanged
   * - capturing initial configuration values from attributes
   *
   */
  Base.addFeature({

    init: function() {
      if (this.hostAttributes) {
        this.cloneAttributes(this, this.hostAttributes);
      }
    },

    cloneAttributes: function(node, attr$) {
      attr$.split(' ').forEach(function(a) {
        node.setAttribute(a, '');
      });
    }

  });

  /*
   * Support for `published` property.
   *
   * `published` object maps the names of attributes that the user
   * wants mapped as inputs to properties to the data-type of that property.
   *
   * This feature overwrites `attributeChanged` to support automatic
   * propagation of attribute values at run-time.
   *
   * Static values in attributes at creation time can be captured by
   * `takeAttributes`.
   *
   * Example:
   *
   * published: {
   *   // values set to index attribute are converted to Number and propagated
   *   // to index property
   *   index: Number,
   *   // values set to label attribute are propagated to index property
   *   label: String
   * }
   *
   * Supported types:
   *
   * - Number
   * - Boolean
   * - String
   * - Object (JSON)
   * - Array (JSON)
   * - Date
   *
   */
  Base.addFeature({

    /* attribute publishing feature, requires `published` feature */

    takeAttributes: function() {
      for (var n in this.published) {
        this.attributeChanged(n);
      }
    },

    attributeChanged: function(name) {
      var type = this.getPublishedPropertyType(name);
      if (type) {
        this.deserialize(name, type);
      }
    },

    deserialize: function(name, type) {
      var value = this.getAttribute(name);
      switch(type) {

        case Number:
          value = Number(value) || this[name];
          break;

        case Boolean:
          value = this.hasAttribute(name);
          break;

        case Object:
        case Array:
          try {
            value = JSON.parse(value);
          } catch(x) {
            return;
          }
          break;

        case Date:
          value = Date.parse(value);
          break;

        case String:
        default:
          break;

      }
      this[name] = value;
    }

  });

  Base.addFeature({

    register: function(prototype) {
      var script = (document._currentScript || document.currentScript);
      var prev = script.previousElementSibling;
      if (prev && prev.localName === 'template') {
        prototype._template = prev;
        // TODO(sjmiles): probably should be it's own feature
        //this.decorateTemplateNodes(prototype._template.content,
          //prototype.name);
      }
    },

    /*decorateTemplateNodes: function(root, name) {
      for (var node = root.firstElementChild; node;
        node = node.nextElementSibling) {
        node.setAttribute(name, '');
        this.decorateTemplateNodes(node, name);
      }
    },*/

    stampTemplate: function(template) {
      this._stampTemplate(template || this._template, this.root);
      // TODO(sjmiles): hello prollyfill
      if (window.CustomElements && CustomElements.upgradeSubtree) {
        CustomElements.upgradeSubtree(this.root);
      }
    },

    _stampTemplate: function(template, target) {
      // TODO(sorvell): light dom children will invalidate annotations.
      target.insertBefore(this.instanceTemplate(template),
        target.firstElementChild);
    },

    instanceTemplate: function(template) {
      return document.importNode(template.content, true);
    }

  });

  Base.addFeature({

    // TODO(sjmiles): ad-hoc signal for `ShadowDOM-lite-enhanced` nodes
    isHost: true,

    register: function(prototype) {
      var t = prototype._template;
      // TODO(sorvell): is qsa is wrong here due to distribution?
      // TODO(sjmiles): No element should ever actually stamp a <content> node
      // into it's composed tree, so I believe this is actually correct.
      // However, I wonder if it's more efficient to capture during annotation
      // parsing, since the parse step does a tree walk in any case, and the
      // tree is smaller before element expansion.
      prototype._useContent = Boolean(t && t.content.querySelector('content'));
    },

    poolContent: function() {
      // pool the light dom
      var pool = document.createDocumentFragment();
      while (this.firstChild) {
        pool.appendChild(this.firstChild);
      }
      this.contentPool = pool;
      // capture lightChildren to help reify dom scoping
      this.lightChildren =
        Array.prototype.slice.call(this.contentPool.childNodes, 0);
    },

    distributeContent: function() {
      var content, pool = this.contentPool;
      // replace <content> with nodes teleported from pool
      while (content = this.querySelector('content')) {
        var select = content.getAttribute('select');
        var frag = pool;
        if (select) {
          frag = document.createDocumentFragment();
          // TODO(sjmiles): diverges from ShadowDOM spec behavior: ShadowDOM
          // only selects top level nodes from pool. Iterate children and match
          // manually instead.
          var nodes = pool.querySelectorAll(select);
          for (var i=0, l=nodes.length; i<l; i++) {
            frag.appendChild(nodes[i]);
          }
        }
        // content self-destructs
        content.parentNode.replaceChild(frag, content);
      }
    }

  });

// TODO(sjmiles): this code was ported from an earlier mutation and needs
// a cleanup to cleave closer to polymer MO

/*

Scans a template to produce an annotation map that stores expression metadata
and information that can be used to associate that metadata with the
corresponding nodes in a template instance.

Supported annotations are:

  * id attributes
  * binding annotations in text nodes
    * double-mustache expressions: {{expression}}
    * double-bracket expressions: [[expression]]
  * binding annotations in attributes
    * attribute-bind expressions: name="{{expression}} || [[expression]]"
    * property-bind expressions: name*="{{expression}} || [[expression]]"
    * property-bind expressions: name:="expression"
  * event annotations
    * event delegation directives: on-<eventName>="expression"

Generated data-structure:

  [
    {
      id: '<id>',
      events: [
        {
          mode: ['auto'|''],
          name: '<name>'
          value: '<expression>'
        }, ...
      ],
      bindings: [
        {
          kind: ['text'|'attribute'|'property'],
          mode: ['auto'|''],
          name: '<name>'
          value: '<expression>'
        }, ...
      ],
      // TODO(sjmiles): confusingly, this is annotation-parent, not node-parent
      parent: <reference to parent annotation>,
      index: <integer index in parent's childNodes collection>
    },
    ...
  ]

TODO(sjmiles): this module should produce either syntactic metadata
(e.g. double-mustache, double-bracket, star-attr), or semantic metadata
(e.g. manual-bind, auto-bind, property-bind). Right now it's half and half.

*/

  Base.addFeature({

    // instance-time

    findAnnotatedNode: function(root, annote) {
      if (!annote.parent) {
        return root;
      }
      var parent = this.findAnnotatedNode(root, annote.parent);
      // enforce locality.
      var nodes = (parent === this) ? parent.childNodes :
        (parent.lightChildren || parent.childNodes);
      return nodes[annote.index];
    },

    // registration-time

    register: function(prototype) {
      if (prototype._template) {
        prototype.parseAnnotations(prototype._template)
      }
    },

    parseAnnotations: function(template) {
      // TODO(sjmiles): it's not a map, per se
      var map = [];
      this._parseNodeAnnotations(template.content, map);
      if (map.length) {
        template.map = map;
      }
      return template.map;
    },

    _parseNodeAnnotations: function(node, map) {
      return node.nodeType === Node.TEXT_NODE ?
        this._parseTextNodeAnnotation(node, map) :
          this._parseElementAnnotations(node, map);
    },

    _parseTextNodeAnnotation: function(node, map) {
      var v = node.textContent, escape = v.slice(0, 2);
      if (escape === '{{' || escape === '[[') {
        var annotation = {
          bindings: [{
            kind: 'text',
            mode: escape === '{{' ? 'auto' : '',
            value: v.slice(2, -2)
          }]
        };
        map.push(annotation);
        return annotation;
      }
    },

    _parseElementAnnotations: function(node, map) {
      var annote = {
        bindings: [],
        events: []
      };
      this._parseChildNodesAnnotations(node, annote, map);
      if (node.attributes) {
        this._parseNodeAttributeAnnotations(node, annote, map);
      }
      if (annote.bindings.length || annote.events.length || annote.id) {
        map.push(annote);
      }
      return annote;
    },

    _parseChildNodesAnnotations: function(root, annotation, map) {
      if (root.firstChild) {
        for (var i=0, node=root.firstChild; node; node=node.nextSibling, i++) {
          var childAnnotation = this._parseNodeAnnotations(node, map);
          if (childAnnotation) {
            childAnnotation.parent = annotation;
            childAnnotation.index = i;
          }
        }
      }
    },

    _parseNodeAttributeAnnotations: function(node, annotation) {
      for (var i=0, a; (a=node.attributes[i]); i++) {
        var n = a.name, v = a.value;
        // id
        if (n === 'id') {
          annotation.id = v;
        }
        // on-* (event)
        else if (n.slice(0, 3) === 'on-') {
          annotation.events.push({
            name: n.slice(3),
            value: v
          });
        }
        // other attribute
        else {
          var b = this._parseNodeAttributeAnnotation(node, n, v);
          if (b) {
            annotation.bindings.push(b);
          }
        }
      }
    },

    _parseNodeAttributeAnnotation: function(node, n, v) {
      var escape = v.slice(0, 2), lastChar = n[n.length-1];
      var kind = 'attribute', mode = '';
      if (lastChar === '*' || lastChar === ':') {
          n = n.slice(0, -1);
          kind = 'property';
          mode = 'auto';
      }
      if (escape === '{{') {
        mode = 'auto';
        v = v.slice(2, -2);
      }
      if (escape === '[[') {
        mode = 'manual';
        v = v.slice(2, -2);
      }
      if (mode) {
        if (n === 'style') {
          kind = 'style';
        }
        return {
          kind: kind,
          mode: mode,
          name: n,
          value: v
        };
      }
    }

  });

  // depends on `annotations` feature

  Base.addFeature({

    $$: function(slctr) {
      return this.root.querySelector(slctr);
    },

    // construct $ map (id based)
    _marshalNodeReferences: function() {
      this.$ = {};
      var map = this._template && this._template.map;
      if (map) {
        map.forEach(function(annotation) {
          var id = annotation.id;
          if (id) {
            this.$[id] = this.findAnnotatedNode(this.root, annotation);
          }
        }, this);
      }
    },

    // concretize `_nodes` map (annotation based)
    _marshalAnnotatedNodes: function() {
      if (this._nodes) {
        this._nodes = this._nodes.map(function(a) {
          return this.findAnnotatedNode(this.root, a);
        }, this);
      }
    }

  });

  Base.addFeature({

    listeners: {},

    init: function() {
    },

    // TODO(sjmiles): support for '.' notation requires 'nodes' feature
    listenListeners: function() {
      for (var key in this.listeners) {
        var node = this, name = key;
        if (name.indexOf('.') >= 0) {
          name = name.split('.');
          node = this.$[name[0]];
          name = name[1];
        }
        this.listen(node, name, this.listeners[key]);
      }
    },

    listen: function(node, eventName, methodName) {
      node.addEventListener(eventName, function(e) {
        this[methodName](e, e.detail);
      }.bind(this));
    },

    // TODO(sjmiles): use a dictionary for options after `detail`
    fire: function(type, detail, onNode, bubbles, cancelable) {
      var node = onNode || this;
      var detail = (detail === null || detail === undefined) ? {} : detail;
      var event = new CustomEvent(type, {
        bubbles: bubbles !== undefined ? bubbles : true,
        cancelable: cancelable !== undefined ? cancelable : true,
        detail: detail
      });
      node.dispatchEvent(event);
      return event;
    }

  });

  Base.addFeature({

    keyPresses: {},

    listenKeyPresses: function() {
      // for..in here to gate empty keyPresses object (iterates once or never)
      for (var n in this.keyPresses) {
        // only get here if there is something in keyPresses
        this.addEventListener('keypress', this.keyPressesFeatureHandler);
        // map string keys to numeric codes
        for (n in this.keyPresses) {
          if (typeof n === 'string') {
            this.keyPresses[Event.prototype.keys[n]] = this.keyPresses[n];
          }
        }
        break;
      }
    },

    keyPressesFeatureHandler: function(e) {
      var method = this.keyPresses[e.keyCode];
      if (method && this[method]) {
        return this[method](e.keyCode, e);
      }
    }

  });

  /*
   * Parses the annotations map created by `annotations` features to support
   * declarative events.
   *
   * Depends on `annotations` and `events` features.
   *
   */
  Base.addFeature({

    // instance-time

    _setupAnnotatedListeners: function() {
      var map = this._template.map;
      if (map) {
        map.forEach(function(annotation) {
          var events = annotation.events;
          if (events && events.length) {
            var node = this.findAnnotatedNode(this.root, annotation);
            events.forEach(function(e) {
              //console.log('[%s] listening for [%s] on [%s]', e.value, e.name, node.localName);
              this.listen(node, e.name, e.value);
            }, this)
          }
        }, this);
      }
    }

  });

  Base.addFeature({

    async: function(method) {
      var handled = false;
      var handle = function() {
        if (!handled) {
          handled = true;
          method.call(this);
        }
      }.bind(this);
      // minimize latency by racing requests
      setTimeout(handle);
      requestAnimationFrame(handle);
    },

    toggleAttribute: function(name, value) {
      this[value ? 'setAttribute' : 'removeAttribute'](name, '');
    },

    attributeFollows: function(name, neo, old) {
      if (old) {
        old.removeAttribute(name);
      }
      if (neo) {
        neo.setAttribute(name, '');
      }
    }

  });

  // TODO(sjmiles): hack
  Base.originalInitFeatures = Base.initFeatures;

  Base.addFeature({

    initFeatures: function() {
      this.originalInitFeatures(this);
      this.features();
    },

    features: function() {
      this.defaultFeatures();
    },

    defaultFeatures: function() {
      if (this._useContent) {
        this.poolContent();
      }
      if (this._template) {
        this.stampTemplate();
        this._marshalNodeReferences();
        this._marshalAnnotatedNodes();
        this._setupAnnotatedListeners();
        if (this._setupBindListeners) {
          this._setupBindListeners();
        }
      }
      this.listenListeners();
      this.listenKeyPresses();
      if (this._useContent) {
        this.distributeContent();
      }
      this.takeAttributes();
    }

  });

  Polymer.noFeatures = function() {
  };

  Polymer.defaultFeatures = Base.defaultFeatures;

