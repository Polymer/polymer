/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  var queue = {
    add: function(element) {
      //console.log('queueing', element.name);
      queueForElement(element).push(element);
    },
    remove: function(element) {
      var i = this.indexOf(element);
      if (i !== 0) {
        console.warn('queue order wrong', i);
        return;
      }
      queueForElement(element).shift();  
    },
    indexOf: function(element) {
      var i = queueForElement(element).indexOf(element);
      if (i >= 0 && document.contains(element)) {
        i += (HTMLImports.useNative || HTMLImports.ready) ? importQueue.length :
            1e9;
      }
      return i;  
    },
    nextElement: function() {
      return nextQueued();
    },
    check: function() {
      // next
      var element = this.nextElement();
      if (element) {
        element.registerWhenReady();
      }
      checkPolymerReady();  
    },
    isEmpty: function() {
      return !importQueue.length && !mainQueue.length;
    },
    notify: function(element) {
      this.remove(element);
      this.check();
    },
    wait: function(element) {
      if (this.indexOf(element) === -1) {
        this.add(element);
      }
      return (this.indexOf(element) !== 0);
    }
  }

  var importQueue = [];
  var mainQueue = [];

  function queueForElement(element) {
    return document.contains(element) ? mainQueue : importQueue;
  }

  function nextQueued() {
    return importQueue.length ? importQueue[0] : mainQueue[0];
  }

  var canReadyPolymer = false;
  var polymerReadied = false; 

  var readyCallbacks = [];
  function whenPolymerReady(callback) {
    canReadyPolymer = false;
    HTMLImports.whenImportsReady(function() {
      canReadyPolymer = true;
      readyCallbacks.push(callback);
      queue.check();
    });
  }

  function checkPolymerReady() {
    if (canReadyPolymer && queue.isEmpty()) {
      flushReadyCallbacks();
    }
  }

  function flushReadyCallbacks() {
    if (readyCallbacks) {
      var fn;
      while (readyCallbacks.length) {
        fn = readyCallbacks.shift();
        fn();
      }
    }
  }

  // exports
  scope.queue = queue;
  scope.whenPolymerReady = whenPolymerReady;

})(Polymer);
