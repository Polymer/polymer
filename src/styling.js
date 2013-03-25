/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

  // imports

  var log = window.logFlags || {};

  function createStyleElementFromSheet(inSheet) {
    if (inSheet.__resource) {
      var style = document.createElement('style');
      style.textContent = inSheet.__resource;
      return style;
    } else {
      console.warn('Could not find content for stylesheet', inSheet);
    }
    
  }

  function installLocalSheets(inElementElement) {
    if (inElementElement == window) {
      return;
    }
    var sheets = inElementElement.querySelectorAll('[rel=stylesheet]');
    var template = inElementElement.querySelector('template');
    if (template) {
      Array.prototype.forEach.call(sheets, function(sheet) {
        if (!sheet.hasAttribute('toolkit-scope')) {
          // in case we're in document, remove from element
          sheet.parentNode.removeChild(sheet);
          var style = createStyleElementFromSheet(sheet);
          if (style) {
            template.content.insertBefore(style, template.content.firstChild);
          }
        }
      });
    }
  }
  
  
  /*
    Promote stylesheet links and style tags with the global attribute 
    into global scope.
  
    This is particularly useful for defining @keyframe rules which 
    currently do not function in scoped or shadow style elements.
    (See wkb.ug/72462)
  */
  function globalizeStyles(inElementElement, inScope) {
    var styles = inElementElement.globalStyles || 
      (inElementElement.globalStyles = findStyles(inElementElement, 'global'));
    applyStylesToScope(styles, inScope);
  }
  
  
  function applyStylesToScope(inStyles, inScope) {
    inStyles.forEach(function(style) {
      inScope.appendChild(style.cloneNode(true));
    });
  }
  
  // TODO(sorvell): polyfill this better
  function matchesSelector(inNode, inSelector) {
    var matcher = inNode.matches || inNode.matchesSelector || 
      inNode.webkitMatchesSelector || inNode.mozMatchesSelector;
    if (matcher) {
      return matcher.call(inNode, inSelector);
    }
  }
  
  // TODO(sorvell): it would be better to identify blocks of rules within
  // style declarations than require different style/link elements.
  function findStyles(inElementElement, inDescriptor) {
    var styleList = [];
    // handle stylesheets
    var sheets = inElementElement.querySelectorAll('[rel=stylesheet]');
    var selector = '[toolkit-scope=' + inDescriptor + ']';
    Array.prototype.forEach.call(sheets, function(sheet) {
      if (matchesSelector(sheet, selector)) {
        // in case we're in document, remove from element
        sheet.parentNode.removeChild(sheet);
        styleList.push(createStyleElementFromSheet(sheet));
      }
    });
    // handle style elements
    var styles = inElementElement.querySelectorAll('style');
    Array.prototype.forEach.call(styles, function(style) {
      if (matchesSelector(style, selector)) {
        // in case we're in document, remove from element
        style.parentNode.removeChild(style);
        styleList.push(style);
      }
    });
    return styleList;
  }
  
  function installSheets(inElementElement) {
    installLocalSheets(inElementElement);
    globalizeStyles(inElementElement, document.head);
  }
  
  var findStyleController = function(inNode) {
    // find the shadow root that contains inNode
    var n = inNode;
    while (n.parentNode && n.localName !== 'shadow-root') {
      n = n.parentNode;
    }
    return n == document ? document.head : n;
  };
  
  function installControllerStyles(inElement, inElementElement) {
    webkitRequestAnimationFrame(function() {
      var styles = inElementElement.controllerStyles || 
        (inElementElement.controllerStyles = findStyles(inElementElement, 'controller'));
      var scope = findStyleController(inElement);
      if (scope) {
        applyStylesToScope(styles, scope);
      }
    });
  }

  // exports
  Toolkit.installSheets = installSheets;
  Toolkit.installControllerStyles = installControllerStyles;
})();