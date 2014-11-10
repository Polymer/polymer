
  /*
   * Needs new name.
   * 
   * Provides a data-binding API, by which a getter/setter pair
   * can be constructed in one of two imperative modes:
   * 
   * bindMethod(property, methodName): constructs a getter/setter pair and a 
   * backing store for the given property; calls the method when the setter
   * is invoked and the value has changed from what is in the backing store.
   * 
   * bindProperty(property, path): constructs a getter/setter pair that 
   * forwards data access to a property on another object.
   * 
   * This feature also supports a `bind` object, which contains expressions
   * that are deconstructed into `bindMethod` or `bindProperty` calls, or
   * into a `multiBinding` construct. `multiBinding` constructs support 
   * multiple side-effects.
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
   *   // If the specified property is also `published`, a multi-binding 
   *   // construct is created which sends a change notification in addition
   *   // to whatever user side-effect is specified. 
   *   publishedProperty: <method name or element property>
   *   // Specify multiple side-effects directly as an array. Only one
   *   // callback method is allowed.
   *   property4: [
   *     'nameOfMethod',
   *     'elementId',
   *     'elementId.property',
   *     ...
   *   ] 
   * } 
   * 
   * Methods bound into multi-bind contexts support a validation feature. If
   * the method returns a value that does not === undefined side-effects are
   * prevented, and the triggering property is set to the returned value, and
   * a new round of side-effects is initiated.
   * 
   * Multi-bind = multiple side-effects for one signal.
   * Note: `signal` today is `set-trap`, should we generalize?
   * Side-effects can be registered by multiple subsystems:
   *   - bind feature
   *   - bind-annotations feature
   *   - computed feature
   *   - published feature
   * We need to accumulate all side-effects for a particular property 
   * before constructing the handler.
   * 
   */
  Base.addFeature({

    // per prototype
    
    // TODO(sjmiles): initialization of `_propertyEffects` and the
    // `addPropertyEffect` itself are really the domain of bind-effects
    // but these things needs to happen before bind-effects itself initializes.
    // We need to factor bind-effects into before and after features instead
    // and let this feature be for dealing with `bind` object.
    
    register: function(prototype) {
      prototype._addPropertyBindEffects();
    },

    // TODO(sjmiles): really ad hoc self-modifying code
    // to resolve initialization ordering around optional
    // module 
    addPropertyEffect: function(property, kind, effect) {
      // prepare storage on first invocation
      this._propertyEffects = {};
      // add the effect
      this._addPropertyEffect(property, kind, effect);
      // subsequent invocations skip preparation step implementation
      this.addPropertyEffect = this._addPropertyEffect; 
    },

    _addPropertyEffect: function(property, kind, effect) {
      var fx = this._propertyEffects[property];
      if (!fx) {
        fx = this._propertyEffects[property] = [];
      }
      fx.push({
        kind: kind,
        effect: effect
      });
    },

    _addPropertyBindEffects: function() {
      for (var n in this.bind) {
        var bind = this.bind[n];
        if (typeof bind === 'object') {
          // multiplexed definition
          for (var nn in bind) {
            this._addPropertyBindEffect(n, bind[nn]);
          }
        } else {
          // single definition
          this._addPropertyBindEffect(n, bind);
        }
      }
    },

    _addPropertyBindEffect: function(property, bindEffect) {
      this.addPropertyEffect(property, 'bind', bindEffect);
    }

  });

// TODO(sjmiles): this code was ported from an earlier mutation and needs
// a cleanup to cleave closer to neoprene MO

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

    // registration-time

    register: function(prototype) {
      if (prototype._template && prototype._template.map) {
        this._preprocessBindAnnotations(prototype, prototype._template.map);
      }
    },

    // construct binding meta-data at *registration* time
    _preprocessBindAnnotations: function(prototype, map) {
      // create a virtual annotation map, must be concretized at instance time 
      prototype._nodes = [];
      // process annotations that have been parsed from template
      map.forEach(function(annotation) {
        // where to find the node in the concretized map 
        var index = prototype._nodes.push(annotation) - 1;
        // TODO(sjmiles): we need to support multi-bind, right now you only get 
        // one (not including kind === `id`)
        annotation.bindings.forEach(function(binding) {
          prototype._bindAnnotationBinding(binding, index);
        });
      });
    },

    _bindAnnotationBinding: function(binding, index) {
      // add to the list of property side-effects
      binding.index = index;
      this.addPropertyEffect(binding.value, 'annotation', binding);
    }

  });

  Base.addFeature({

    /* computed property feature */

    computed: {
    },

    register: function(prototype) {
      prototype.defineComputedProperties(prototype.computed);
    },

    defineComputedProperties: function(computed) {
      for (var n in computed) {
        this.defineComputedProperty(n, computed[n]);
      }
    },

    defineComputedProperty: function(name, expression) {
      var index = expression.indexOf('(');
      var method = expression.slice(0, index);
      var args = expression.slice(index + 1, -1).replace(/ /g, '').split(',');
      console.log('%c on [%s] compute [%s] via [%s]', 'color: green', args[0], name, method);
      this.addPropertyEffect(args[0], 'compute', {
        property: name,
        method: method
      });
      /*
      this.compoundWatch(args, function() {
        Polymer.log.watches && console.log('[compute] [%s]', name, arguments);
        this[name] = method.apply(this, arguments);
      });
      */
    }

  });

  Base.addFeature({

    // per instance
    
    init: function() {
      this._data = Object.create(null);
    },

    _setupBindListeners: function() {
      var bl = this._bindListeners;
      for (var n in bl) {
        bl[n].targets.forEach(function(target) {
          this._setupBindListener(n, target);
        }, this);
      }
    },

    _setupBindListener: function(property, target) {
      //console.log('[bind]: [%s][%s] listening for [%s][%s-changed]', this.localName, property, target.id || target.index, target.property);
      var host = this, property;
      var node = target.id ? this.$[target.id] : this._nodes[target.index];
      node.addEventListener(target.property + '-changed', function(e) {
        //console.log('[bind]:[%s] heard [%s-changed] this.[%s] = [%s]', host.localName, source, property, e.detail);
        host[property] = e.detail;
      });
    },

    _notifyChange: function(property) {
      this.fire(property + '-changed', this[property], null, false);
    },

    _setData: function(property, value) {
      var old = this._data[property];
      if (old !== value) {
        this._data[property] = value;
      }
      return old;
    },

    // per prototype
    
    register: function(prototype) {
      prototype._bindListeners = {};
      prototype._createBindings();
    },

    _createBindings: function() {
      //console.group(this.name);
      var fx = this._propertyEffects;
      for (var n in fx) {
        //console.group(n);
        var compiledEffects = fx[n].map(function(x) {
          return this._buildEffect(n, x);
        }, this);
        this._bindPropertyEffects(n, compiledEffects);
        //console.log(fxt.join('\n'));
        //console.groupEnd();
      }
      //console.groupEnd();
    },

    _buildEffect: function(property, fx) {
      return this['_' + fx.kind + 'EffectBuilder'](property, fx.effect);
    },

    _bindEffectBuilder: function(source, effect) {
      // TODO(sjmiles): validation system requires a blessed
      // validator effect which needs to be processed first.
      /*
      if (typeof this[effect] === 'function') {
        return [
          'var validated = this.' + effect + '(value, old)',
          'if (validated !== undefined) {',
          '  // recurse',
          '  this[property] = validated;',
          '  return;',
          '}'
        ].join('\n');
      }
      */
      //
      // TODO(sjmiles): try/catch is temporary
      //try {
        if (typeof this[effect] === 'function') {
          return 'this.' + effect + '(this._data.' + source + ', old);'
        }
      //} catch(x) {}
      //
      var paths = effect.split('.');
      var id = paths.shift();
      var property = paths.join('.');
      //
      if (property) {
        // TODO(sjmiles): awkward: store data for instance-time listeners.
        // _addBindListener is in bind.html, if we did the path processing
        // in that module we could contain all the listener logic there too.
        this._addBindListener(source, id, property);
      } else {
        property = 'textContent';
      }
      //
      return 'this.$.' + id + '.' + property + ' = ' 
        + 'this._data.' + source + ';'
    },

    _bindPropertyEffects: function(property, effects) {
      var defun = {
        get: function() {
          return this._data[property];
        }
      }
      if (effects.length) {
        // combine effects
        effects = effects.join('\n\t\t');
        // construct effector
        var effector = '_' + property + 'Effector';
        this[effector] = new Function('old', effects);
        // construct setter body
        var body  = '\tvar old = this._setData(\'' + property + '\', value);\n'
          + '\tif (value !== old) {\n'
            + '\t\tthis.' + effector + '(old);\n' 
          + '\t}';
        var setter = new Function('value', body);
        // ReadOnly properties have a private setter only
        if (this.isReadOnlyProperty(property)) {
          this['_set_' + property] = setter;
        }
        // other properties have a proper setter 
        else {
          defun.set = setter;
        }
      }
      Object.defineProperty(this, property, defun);
      //var prop = Object.getOwnPropertyDescriptor(this, property);
      //console.log(prop.set ? prop.set.toString() : '(read-only)');
    },

    _notifyEffectBuilder: function(source) {
      return 'this._notifyChange(\'' + source + '\')';
    },

    _computeEffectBuilder: function(source, effect) {
      return 'this.' + effect.property 
        + ' = this.' + effect.method + '(this._data.' + source + ');';
    },

    _annotationEffectBuilder: function(source, binding) {
      var target = binding.name || 'textContent';
      if (binding.kind !== 'text' && binding.kind !== 'attribute') {
        console.warn(binding.kind);
        return;
      }
      if (target !== 'textContent') {
        this._addAnnotatedListener(source, binding.index, target);
      }
      return this._bindAnnotationProperty(source, target, binding.index);
    },

    _bindAnnotationProperty: function(source, target, index) {
      return 'this._nodes[' + index + '].' + target 
          + ' = this._data.' + source + ';';
    },

    _addBindListener: function(source, id, property) {
      var bl = this._requireBindListeners(source);
      bl.targets.push({
        id: id,
        property: property
      });
    },

    _addAnnotatedListener: function(source, index, property) {
      var bl = this._requireBindListeners(source);
      bl.targets.push({
        index: index,
        property: property
      });
    },

    _requireBindListeners: function(source) {
      var bl = this._bindListeners[source];
      if (!bl) {
        bl = this._bindListeners[source] = {targets: []};
      }
      return bl;
    }

});
