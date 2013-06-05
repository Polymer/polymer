/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

  // imports
  var log = window.logFlags || {};

  var doc = wrap(document);

  /**
   * Install external stylesheets loaded in <element> elements into the 
   * element's template.
   * @param inElementElement The <element> element to style.
   */
  function installSheets(elementElement) {
    installLocalSheets(elementElement);
    installGlobalStyles(elementElement);
  }
  
  /**
   * Takes external stylesheets loaded in an <element> element and moves
   * their content into a <style> element inside the <element>'s template.
   * The sheet is then removed from the <element>. This is done only so 
   * that if the element is loaded in the main document, the sheet does
   * not become active.
   * Note, ignores sheets with the attribute 'polymer-scope'.
   * @param inElementElement The <element> element to style.
   */
  function installLocalSheets(elementElement) {
    var sheets = findInElement(elementElement, SHEET_SELECTOR, function(s) {
      return !s.hasAttribute(SCOPE_ATTR);
    });
    var content = elementTemplateContent(elementElement);
    if (content) {
      // in case we're in document, remove from element
      sheets.forEach(function(sheet) {
        sheet.parentNode.removeChild(sheet);
      });
      var fragment = document.createDocumentFragment();
      sheets.forEach(function(sheet) {
        var style = createStyleElementFromSheet(sheet);
        if (style) {
          fragment.appendChild(style);
        }
      });
      content.insertBefore(fragment, content.firstChild);
    }
  }
  
  /**
   * Promotes external stylesheets and <style> elements with the attribute 
   * polymer-scope='global' into global scope.
   * This is particularly useful for defining @keyframe rules which 
   * currently do not function in scoped or shadow style elements.
   * (See wkb.ug/72462)
   * @param inElementElement The <element> element to style.
  */
  // TODO(sorvell): remove when wkb.ug/72462 is addressed.
  function installGlobalStyles(elementElement) {
    applyStylesToScope(findStyles(elementElement, 'global'), doc.head);
  }
  
  /**
   * Installs external stylesheets and <style> elements with the attribute 
   * polymer-scope='controller' into the scope of inElement. This is intended
   * to be a called during custom element construction. Note, this incurs a per
   * instance cost and should be used sparingly.
   * The need for this type of styling should go away when the shadowDOM spec
   * addresses these issues:
   * 
   * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21391
   * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21390
   * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21389
   * 
   * @param inElement The custom element instance into whose controller (parent)
   * scope styles will be installed.
   * @param inElementElement The <element> containing controller styles.
  */
  // TODO(sorvell): remove when spec issues are addressed
  function installControllerStyles(element, elementElement) {
      if (!elementElement.controllerStyles) {
        elementElement.controllerStyles = findStyles(elementElement, 
          'controller');
      }
      var styles = elementElement.controllerStyles;
      async.queue(function() {
        var scope = findStyleController(element);
        if (scope) {
          Polymer.shimPolyfillDirectives(styles, element.localName);
          applyStylesToScope(styles, scope);
        }
      });
  }
  
  // queue a series of functions to occur async.
  var async = {
    list: [],
    queue: function(inFn) {
      if (inFn) {
        async.list.push(inFn);
      }
      async.queueFlush();
    },
    queueFlush: function() {
      if (!async.flushing) {
        async.flushing = true;
        requestAnimationFrame(async.flush);
      }
    },
    flush: function() {
      async.list.forEach(function(fn) {
        fn();
      });
      async.list = [];
      async.flushing = false;
    }
    
  }
  
  function findStyleController(node) {
    // find the shadow root that contains inNode
    var n = node;
    while (n.parentNode && n.localName != 'shadow-root') {
      n = n.parentNode;
    }
    return n == doc ? doc.head : n;
  };

  function createStyleElementFromSheet(sheet) {
    if (sheet.__resource) {
      var style = doc.createElement('style');
      style.textContent = sheet.__resource;
      return style;
    } else {
      console.warn('Could not find content for stylesheet', sheet);
    }
  }

  function applyStylesToScope(styles, scope) {
    styles.forEach(function(style) {
      scope.appendChild(style.cloneNode(true));
    });
  }
  
  var eltProto = HTMLElement.prototype;
  var matches = eltProto.matches || eltProto.matchesSelector || 
      eltProto.webkitMatchesSelector || eltProto.mozMatchesSelector;
  function matchesSelector(node, inSelector) {
    if (matches) {
      return matches.call(node, inSelector);
    }
  }
  
  // TODO(sorvell): it would be better to identify blocks of rules within
  // style declarations than require different style/link elements.
  function findStyles(elementElement, descriptor) {
    var styleList = [];
    // handle stylesheets
    var selector = '[' + SCOPE_ATTR + '=' + descriptor + ']';
    var matcher = function(s) {
      return matchesSelector(s, selector);
    };
    var sheets = findInElement(elementElement, SHEET_SELECTOR, matcher);
    sheets.forEach(function(sheet) {
      // in case we're in document, remove from element
      sheet.parentNode.removeChild(sheet);
      styleList.push(createStyleElementFromSheet(sheet));
    });
    // handle style elements
    var styles = findInElement(elementElement, STYLE_SELECTOR, matcher);
    styles.forEach(function(style) {
      // in case we're in document, remove from element
      style.parentNode.removeChild(style);
      styleList.push(style);
    });
    return styleList;
  }
  
  
  function findInElement(elementElement, selector, matcher) {
    var nodes = arrayFromNodeList(elementElement
      .querySelectorAll(selector));
    var content = elementTemplateContent(elementElement);
    if (content) {
      var templateNodes = arrayFromNodeList(content
        .querySelectorAll(selector));
      nodes = nodes.concat(templateNodes);
    }
    return nodes.filter(matcher);
  }
  
  function elementTemplateContent(elementElement) {
    var template = elementElement.querySelector('template');
    return template && templateContent(template);
  }
  
  var STYLE_SELECTOR = 'style';
  var SHEET_SELECTOR = '[rel=stylesheet]';
  var SCOPE_ATTR = 'polymer-scope';
  function arrayFromNodeList(nodeList) {
    return Array.prototype.slice.call(nodeList || [], 0);
  }
  
  // exports
  Polymer.installSheets = installSheets;
  Polymer.installControllerStyles = installControllerStyles;
})();