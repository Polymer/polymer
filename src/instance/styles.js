/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports

  var log = window.logFlags || {};
  
  // magic words
  
  var STYLE_SCOPE_ATTRIBUTE = 'element';
  var STYLE_CONTROLLER_SCOPE = 'controller';
  
  var styles = {
    STYLE_SCOPE_ATTRIBUTE: STYLE_SCOPE_ATTRIBUTE,
    /**
     * Installs external stylesheets and <style> elements with the attribute 
     * polymer-scope='controller' into the scope of element. This is intended
     * to be a called during custom element construction. Note, this incurs a 
     * per instance cost and should be used sparingly.
     *
     * The need for this type of styling should go away when the shadowDOM spec
     * addresses these issues:
     * 
     * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21391
     * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21390
     * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21389
     * 
     * @param element The custom element instance into whose controller (parent)
     * scope styles will be installed.
     * @param elementElement The <element> containing controller styles.
    */
    // TODO(sorvell): remove when spec issues are addressed
    installControllerStyles: function() {
      // apply controller styles, but only if they are not yet applied
      var scope = this.findStyleController();
      if (scope && !this.scopeHasElementStyle(scope, STYLE_CONTROLLER_SCOPE)) {
        // allow inherited controller styles
        var proto = Object.getPrototypeOf(this), cssText = '';
        while (proto && proto.element) {
          cssText += proto.element.cssTextForScope(STYLE_CONTROLLER_SCOPE);
          proto = Object.getPrototypeOf(proto);
        }
        if (cssText) {
          var style = this.element.cssTextToScopeStyle(cssText,
              STYLE_CONTROLLER_SCOPE);
          // shim styling under ShadowDOMPolyfill
          if (window.ShadowDOMPolyfill) {
            Platform.ShadowCSS.shimPolyfillDirectives([style],
                this.localName);
          }
          Polymer.applyStyleToScope(style, scope);
        }
      }
    },
    scopeHasElementStyle: function(scope, descriptor) {
      var rule = STYLE_SCOPE_ATTRIBUTE + '=' + this.localName + '-' + descriptor;
      return scope.querySelector('style[' + rule + ']');
    },
    findStyleController: function() {
      if (window.ShadowDOMPolyfill) {
        return wrap(document.head);
      } else {
        // find the shadow root that contains this element
        var n = this;
        while (n.parentNode) {
          n = n.parentNode;
        }
        return n === document ? document.head : n;
      }
    }
  };

  // exports

  scope.api.instance.styles = styles;
  
})(Polymer);
