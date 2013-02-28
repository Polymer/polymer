(function(scope) {

scope.WebkitShadowDOM = {
  ShadowRoot: function(inElement) {
    var root = inElement.webkitCreateShadowRoot();
    // TODO(sjmiles): .shadow, .host, .olderSubtree are supposed to be native,
    // at least for public ShadowDOMs
    root.olderSubtree = inElement.shadow;
    inElement.shadow = root;
    root.host = inElement;
    // Set up gesture events on shadow
    if (window.PointerGestures) {
      PointerGestures.register(root);
      // Set up pointerevents on shadow
      if (window.PointerEventsPolyfill) {
        PointerEventsPolyfill.setTouchAction(root, inElement.getAttribute('touch-action'));
      }
    }
    // TODO(sjmiles): enabled by default so that @host polyfills will
    // work under composition. Can remove when @host is implemented
    // natively.
    root.applyAuthorStyles = true;
    return root;
  },
  distribute: function() {},
  localQuery: function(inElement, inSlctr) {
    return inElement.querySelector(inSlctr);
  },
  localQueryAll: function(inElement, inSlctr) {
    return inElement.querySelectorAll(inSlctr);
  },
  deref: function(inNode) {
    return inNode;
  },
  localNodes: function(inNode) {
    return inNode.childNodes;
  },
  localParent: function(inNode) {
    return inNode.parentNode;
  },
  forEach: Array.prototype.forEach.call.bind(Array.prototype.forEach)
};

})(window.__exported_components_polyfill_scope__);
