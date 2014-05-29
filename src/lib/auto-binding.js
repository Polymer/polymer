/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * The `auto-binding` element extends the template element. It provides a quick 
 * and easy way to do data binding without the need to setup a model. 
 * The `auto-binding` element itself serves as the model and controller for the 
 * elements it contains. Both data and event handlers can be bound. 
 *
 * The `auto-binding` element acts just like a template that is bound to 
 * a model. It stamps its content in the dom adjacent to itself. When the 
 * content is stamped, the `template-bound` event is fired.
 *
 * Example:
 *
 *     <template is="auto-binding">
 *       <div>Say something: <input value="{{value}}"></div>
 *       <div>You said: {{value}}</div>
 *       <button on-tap="{{buttonTap}}">Tap me!</button>
 *     </template>
 *     <script>
 *       var template = document.querySelector('template');
 *       template.value = 'something';
 *       template.buttonTap = function() {
 *         console.log('tap!');
 *       };
 *     </script>
 *
 * @module Polymer
 * @status stable
*/

(function() {

  var element = document.createElement('polymer-element');
  element.setAttribute('name', 'auto-binding');
  element.setAttribute('extends', 'template');
  element.init();

  Polymer('auto-binding', {

    createdCallback: function() {
      this.syntax = this.bindingDelegate = this.makeSyntax();
      // delay stamping until polymer-ready so that auto-binding is not
      // required to load last.
      Polymer.whenPolymerReady(function() {
        this.model = this;
        this.setAttribute('bind', '');
        // we don't bother with an explicit signal here, we could ust a MO
        // if necessary
        this.async(function() {
          // note: this will marshall *all* the elements in the parentNode
          // rather than just stamped ones. We'd need to use createInstance
          // to fix this or something else fancier.
          this.marshalNodeReferences(this.parentNode);
          // template stamping is asynchronous so stamping isn't complete
          // by polymer-ready; fire an event so users can use stamped elements
          this.fire('template-bound');
        });
      }.bind(this));
    },

    makeSyntax: function() {
      var events = Object.create(Polymer.api.declaration.events);
      var self = this;
      events.findController = function() { return self.model; };

      var syntax = new PolymerExpressions();
      var prepareBinding = syntax.prepareBinding;  
      syntax.prepareBinding = function(pathString, name, node) {
        return events.prepareEventBinding(pathString, name, node) ||
               prepareBinding.call(syntax, pathString, name, node);
      };
      return syntax;
    }

  });

})();
