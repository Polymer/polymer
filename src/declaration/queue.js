/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  var queue = {
    // tell the queue to wait for an element to be ready
    wait: function(element) {
      if (this.indexOf(element) === -1 && 
          (flushQueue.indexOf(element) === -1)) {
        this.add(element);
      }
      return (this.indexOf(element) !== 0);
    },
    add: function(element) {
      //console.log('queueing', element.name);
      queueForElement(element).push(element);
    },
    indexOf: function(element) {
      var i = queueForElement(element).indexOf(element);
      if (i >= 0 && document.contains(element)) {
        i += (HTMLImports.useNative || HTMLImports.ready) ? importQueue.length :
            1e9;
      }
      return i;  
    },
    // tell the queue an element is ready to be registered
    register: function(element) {
      var readied = this.remove(element);
      if (readied) {
        flushQueue.push(readied);
        this.check();
      }
    },
    remove: function(element) {
      var i = this.indexOf(element);
      if (i !== 0) {
        //console.warn('queue order wrong', i);
        return;
      }
      return queueForElement(element).shift();  
    },
    check: function() {
      // next
      var element = this.nextElement();
      if (element) {
        element.registerWhenReady();
      }
      if (this.canFlush()) {
        this.flush();
        return true;
      }
    },
    nextElement: function() {
      return nextQueued();
    },
    canFlush: function() {
      return !this.waitToFlush && this.isEmpty();
    },
    isEmpty: function() {
      return !importQueue.length && !mainQueue.length;
    },
    flush: function() {
      // TODO(sorvell): As an optimization, turn off CE polyfill upgrading
      // while registering. This way we avoid having to upgrade each document
      // piecemeal per registration and can instead register all elements
      // and upgrade once in a batch. Without this optimization, upgrade time
      // degrades significantly when SD polyfill is used. This is mainly because
      // querying the document tree for elements is slow under the SD polyfill.
      CustomElements.ready = false;
      var element;
      while (flushQueue.length) {
        element = flushQueue.shift();
        element._register();
      }
      CustomElements.upgradeDocumentTree(document);
      CustomElements.ready = true;
      this.flushReadyCallbacks();
    },
    flushReadyCallbacks: function() {
      if (readyCallbacks) {
        var fn;
        while (readyCallbacks.length) {
          fn = readyCallbacks.shift();
          fn();
        }
      }
    },
    addReadyCallback: function(callback) {
      readyCallbacks.push(callback);
    },
    waitToFlush: true
  };

  var importQueue = [];
  var mainQueue = [];
  var flushQueue = [];
  var readyCallbacks = [];

  function queueForElement(element) {
    return document.contains(element) ? mainQueue : importQueue;
  }

  function nextQueued() {
    return importQueue.length ? importQueue[0] : mainQueue[0];
  }

  var polymerReadied = false; 
  
  function whenPolymerReady(callback) {
    queue.waitToFlush = true;
    HTMLImports.whenImportsReady(function() {
      queue.addReadyCallback(callback);
      queue.waitToFlush = false;
      queue.check();
    });
  }

  // exports
  scope.queue = queue;
  scope.whenPolymerReady = whenPolymerReady;
})(Polymer);
