/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // get prototype mapped to node <tag>
  HTMLElement.getPrototypeForTag = function(tag) {
    return !tag ? HTMLElement.prototype :
      // TODO(sjmiles): creating <tag> is likely to have wasteful 
      // side-effects, we need a better way to access the prototype
      Object.getPrototypeOf(document.createElement(tag));
  };

  // we have to flag propagation stoppage for the event dispatcher
  var originalStopPropagation = Event.prototype.stopPropagation;
  Event.prototype.stopPropagation = function() {
    this.cancelBubble = true;
    originalStopPropagation.apply(this, arguments);
  };
  
  HTMLImports.importer.preloadSelectors += 
      ', polymer-element link[rel=stylesheet]';

})(Polymer);
