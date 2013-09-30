/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

  // FOUC prevention tactic
  // default list of veiled elements
  scope.veiledElements = ['body'];
  // add polymer styles
  var VEILED_CLASS = 'polymer-veiled';
  var UNVEIL_CLASS = 'polymer-unveil';
  var TRANSITION_TIME = 0.3;
  var style = document.createElement('style');
  style.textContent = '.' + VEILED_CLASS + ' { ' +
      'visibility: hidden; opacity: 0; } \n' +
      '.' + UNVEIL_CLASS +  '{ ' +
      '-webkit-transition: opacity ' + TRANSITION_TIME + 's; ' +
      'transition: opacity ' + TRANSITION_TIME +'s; }\n';
  var head = document.querySelector('head');
  head.insertBefore(style, head.firstChild);

  // apply veiled class
  function veilElements() {
    var veiled = Polymer.veiledElements;
    if (veiled) {
      for (var i=0, l=veiled.length, u; (i<l) && (u=veiled[i]); i++) {
        veilElementsBySelector(u);
      }
    }
  }

  function veilElementsBySelector(selector) {
    var nodes = document.querySelectorAll(selector);
    for (var i=0, l=nodes.length, n; (i<l) && (n=nodes[i]); i++) {
      n.classList.add(VEILED_CLASS);
    }
  }

  // apply unveil class
  function unveilElements() {
    requestAnimationFrame(function() {
      var nodes = document.querySelectorAll('.' + VEILED_CLASS);
      for (var i=0, l=nodes.length, n; (i<l) && (n=nodes[i]); i++) {
        n.classList.add(UNVEIL_CLASS);
        n.classList.remove(VEILED_CLASS);
      }
      // NOTE: depends on transition end event to remove 'unveil' class.
      if (nodes.length) {
        var removeUnveiled = function() {
          for (var i=0, l=nodes.length, n; (i<l) && (n=nodes[i]); i++) {
            n.classList.remove(UNVEIL_CLASS);
          }
          document.body.removeEventListener(endEvent, removeUnveiled, false);
        }
        document.body.addEventListener(endEvent, removeUnveiled, false);
      };
    });
  }

  // determine transition end event
  var endEvent = (document.documentElement.style.webkitTransition !== undefined) ?
      'webkitTransitionEnd' : 'transitionend';

  // hookup auto-unveiling
  document.addEventListener('DOMContentLoaded', veilElements);
  window.addEventListener('WebComponentsReady', unveilElements);

  // exports
  // can dynamically unveil elements by adding the veiled class and then 
  // calling Polymer.unveilElements
  scope.unveilElements = unveilElements;

})(Polymer);
