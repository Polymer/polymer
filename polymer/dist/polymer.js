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

    dettachedCallback: function() {
      // reserved for canonical behavior
      this.dettached();
    },

    dettached: function() {
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

  // TODO(sjmiles): now depends on `annotations` and `bind-annotations` features

  Base.addFeature({

    $$: function(slctr) {
      return this.root.querySelector(slctr);
    },

    marshalNodeReferences: function() {
      this.$ = {};
      var map = this._template && this._template.map;
      if (map) {
        map.forEach(function(annotation) {
          var binding = annotation.bindings[0];
          if (binding.kind === 'id') {
            this.$[binding.value] = 
              this.findAnnotatedNode(this.root, annotation);
          }
        }, this);
      }
      /*
      for (var n in this.$) {
        this.$[n] = this._nodes[index];
      }
      */
      /*
      var n$ = this.root.querySelectorAll("[id]");
      if (n$.length) {
        // populate $ with id->node properties from the this.root subtree
        this.$ = {};
        for (var i=0, n; (n=n$[i]); i++) {
          // TODO(sjmiles): this node could come from another host 
          this.$[n.id] = n;
        }
      }
      */
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
   * Needs new name.
   * 
   * Provides a simple data-binding API, by which a getter/setter pair
   * can be constructed in one of two modes:
   * 
   * bindMethod: constructs a getter/setter pair and a backing store 
   * from the given property, calls the bound method whenever the setter
   * is invoked.
   * 
   * bindProperty: constructs a getter/setter pair that forwards data
   * access to a property on another object.
   * 
   * This features also supports a `bind` object, which contains expressions
   * that are deconstructed into `bindMethod` or `bindProperty` calls.
   * 
   * bind {
   *   // if `method` is the name of a method on the current object, a
   *   // `bindMethod` call is made to define `property` as described above.
   *   property: 'method'
   *   // if the value is not the name of a method, it's assumed to be the
   *   // name in the `$` hash that maps to an element.
   *   // If no target property is specified, `textContent` is assumed to 
   *   // be the backing-store for `property2` accessors.
   *   property2: 'elementId'
   *   // If a path is provided, that element is dereferenced from $ as before, 
   *   // but the full path is used for the backing-store.
   *   // This declaration binds property3 to $.elementId.value  
   *   property3: 'elementId.value'
   * } 
   */
  Base.addFeature({

    init: function() {
      this._boundData = {};
    },

    register: function(prototype) {
      prototype.setupBindings();
    },

    setupBindings: function() {
      for (var n in this.bind) {
        this.setupBinding(n, this.bind[n]);
      }
    },

    setupBinding: function(property, path) {
      var paths = path.split('.');
      //
      if (paths.length === 1) {
        if (typeof this[path] === 'function') {
          this.bindMethod(property, paths);
          return;
        }
        path += '.textContent';
      }
      //
      this.bindProperty(property, 'this.$.' + path);
    },

    bindMethod: function(property, path) {
      Object.defineProperty(this, property, {
        set: function(value) {
          var old = this._boundData[path];
          this._boundData[path] = value;
          // TODO(sjmiles): NOTE: no dirty-check 
          this[path](value, old);
        },
        get: function() {
          return this._boundData[path];
        }
      });
    },

    bindProperty: function(property, path) {
      // TODO(sjmiles): using `new Function` for expediency and performance.
      // Will need an alternative algorithm for platforms without eval.
      Object.defineProperty(this, property, {
        set: new Function('value', path + ' = value;'),
        get: new Function('return ' + path + ';')
      });
    }

  });

// TODO(sjmiles): this code was ported from an earlier mutation and needs
// a cleanup to cleave closer to neoprene MO
// - events should be in a separate list
// - ids should be in a separate list
// - reduce variety of binding types
// - mutliple delegate needs to be supported (this was true before too, fwiw)

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
      bindings: [
        {
          kind: ['event'|'text'|'attribute'|'property'],
          mode: ['auto'|''], 
          name: '<name>'
          value: '<expression>'
        }
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

    register: function(prototype) {
      if (prototype._template) {
        prototype.parseTemplateAnnotations(prototype._template)
      }
    },
    
    parseTemplateAnnotations: function(template) {
      // TODO(sjmiles): it's not a map, per se
      var map = [];
      this._parseTemplateNode(template.content, map);
      if (map.length) {
        template.map = map;
      }
      return template.map;
    },

    // instance-time method
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

    _parseTemplateNode: function(node, map) {
      return node.nodeType === Node.TEXT_NODE ? 
        this._parseTemplateTextNode(node, map) : 
          this._parseTemplateElement(node, map);
    },

    _parseTemplateTextNode: function(node, map) {
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

    _parseTemplateElement: function(node, map) {
      var annotations = {
        bindings: []
      };
      this._parseTemplateNodeAnnotations(node, annotations, map);
      this._parseTemplateChildNodes(node, annotations, map);
      if (annotations.bindings.length) {
        map.push(annotations);
      }
      return annotations;
    },

    _parseTemplateNodeAnnotations: function(node, annotation) {
      if (node.attributes) {
        for (var i=0, a; (a=node.attributes[i]); i++) {
          var n = a.name, v = a.value;
          if (n === 'id') {
            annotation.bindings.push({
              kind: 'id',
              value: v
            });
            continue;
          }
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
            annotation.bindings.push({
              kind: kind,
              mode: mode,
              name: n,
              value: v
            });
          } else if (n.slice(0, 3) === 'on-') {
            annotation.bindings.push({
              kind: 'event',
              name: n.slice(3),
              value: v 
            });
          }
        }
      }
    },

    _parseTemplateChildNodes: function(root, annotations, map) {
      if (root.firstChild) {
        for (var i=0, node=root.firstChild; node; node=node.nextSibling, i++) {
          var annotation = this._parseTemplateNode(node, map);
          if (annotation) {
            annotation.parent = annotations;
            annotation.index = i;
          }
        }
      }
    }
  });

  /*
   * Parses the annotations map created by `annotations` features to perform
   * declarative desugaring.
   * 
   * Depends on `annotations` feature and `bind` feature.
   * 
   * Two tasks are supported:
   * 
   * - nodes with 'id' are described in a virtual annotation map at 
   *   registration time. This map is then concretized per instance.
   * 
   * - Simple mustache expressions consisting of a single property name
   *   in a `textContent` context are bound using `bind` features
   *   `bindMethod`. In this mode, the bound method is constructed at
   *   registration time, so marshaling is done done via the concretized 
   *   `_nodes` at every access.
   *    
   *   TODO(sjmiles): ph3ar general confusion between registration and 
   *   instance time tasks. Is there a cleaner way to disambiguate? 
   */
  Base.addFeature({

    register: function(prototype) {
      if (prototype._template && prototype._template.map) {
        this.preprocessBindAnnotations(prototype, prototype._template.map);
      }
    },

    // construct binding meta-data at *registration* time
    preprocessBindAnnotations: function(prototype, map) {
      // create a virtual annotation map, must be concretized at instance time 
      prototype._nodes = [];
      // process annotations that have been parsed from template
      map.forEach(function(annotation) {
        // where to find the node in the concretized map 
        var index = this._nodes.push(annotation) - 1;
        // TODO(sjmiles): we probably need to multiplex the bind method
        // to handle multiple binding targets, right now you
        // only get one
        var binding = annotation.bindings[0];
        // TODO(sjmiles): this is property binding only, but 
        // bind-annotations produces other kinds of annotations,
        // impedence mismatch borne of mutating the project from earlier
        // versions. 
        if (binding.kind === 'text') {
          // TODO(sjmiles): not using `bind` feature code because this is 
          // a slightly different use case. IOW, we want a combination of 
          // `bindProperty` and `bindMethod`. Consider how to unify.
          this.bindAnnotation(binding.value, index);
        }
      }, prototype);
    },

    // TODO(sjmiles): this method is absurdly specialized
    bindAnnotation: function(property, index) {
      Object.defineProperty(this, property, {
        set: function(value) {
          this._nodes[index].textContent = value;
        },
        get: function() {
          return this._nodes[index].textContent;
        }
      });
    },

    // concretize `_nodes` map at *instance* time
    marshalBoundNodes: function() {
      if (this._nodes) {
        this._nodes = this._nodes.map(function(a) {
          return this.findAnnotatedNode(this.root, a);
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
    }

  });

  Base.addFeature({

    init: function() {
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
        this.marshalNodeReferences();
        this.marshalBoundNodes();
      }
      this.listenListeners();
      this.listenKeyPresses();
      if (this._useContent) {
        this.distributeContent();
      }
    }

  });

  Polymer.noFeatures = function() {
  };

  Polymer.defaultFeatures = Base.defaultFeatures;
