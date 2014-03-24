/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  var queue = {
    // tell the queue to wait for an element to be ready
    wait: function(element, check, go) {
      if (this.indexOf(element) === -1) {
        this.add(element);
        element.__check = check;
        element.__go = go;
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
        i += (HTMLImports.useNative || HTMLImports.ready) ? 
          importQueue.length : 1e9;
      }
      return i;  
    },
    // tell the queue an element is ready to be registered
    go: function(element) {
      var readied = this.remove(element);
      if (readied) {
        readied.__go.call(readied);
        readied.__check = readied.__go = null;
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
        element.__check.call(element);
      }
      if (this.canReady()) {
        this.ready();
        return true;
      }
    },
    nextElement: function() {
      return nextQueued();
    },
    canReady: function() {
      return !this.waitToReady && this.isEmpty();
    },
    isEmpty: function() {
      return !importQueue.length && !mainQueue.length;
    },
    ready: function() {
      // TODO(sorvell): As an optimization, turn off CE polyfill upgrading
      // while registering. This way we avoid having to upgrade each document
      // piecemeal per registration and can instead register all elements
      // and upgrade once in a batch. Without this optimization, upgrade time
      // degrades significantly when SD polyfill is used. This is mainly because
      // querying the document tree for elements is slow under the SD polyfill.
      if (CustomElements.ready === false) {
        CustomElements.upgradeDocumentTree(document);
        CustomElements.ready = true;
      }
      if (readyCallbacks) {
        var fn;
        while (readyCallbacks.length) {
          fn = readyCallbacks.shift();
          fn();
        }
      }
    },
    addReadyCallback: function(callback) {
      if (callback) {
        readyCallbacks.push(callback);
      }
    },
    waitToReady: true
  };

  var importQueue = [];
  var mainQueue = [];
  var readyCallbacks = [];

  function queueForElement(element) {
    return document.contains(element) ? mainQueue : importQueue;
  }

  function nextQueued() {
    return importQueue.length ? importQueue[0] : mainQueue[0];
  }

  var polymerReadied = false; 

  document.addEventListener('WebComponentsReady', function() {
    CustomElements.ready = false;
  });
  
  function whenPolymerReady(callback) {
    queue.waitToReady = true;
    CustomElements.ready = false;
    HTMLImports.whenImportsReady(function() {
      queue.addReadyCallback(callback);
      queue.waitToReady = false;
      queue.check();
    });
  }

  // exports
  scope.queue = queue;
  scope.whenPolymerReady = whenPolymerReady;
})(Polymer);
