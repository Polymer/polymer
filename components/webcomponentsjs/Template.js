/*
 * Copyright 2012 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

// minimal template polyfill
if (typeof HTMLTemplateElement === 'undefined') {
  (function() {

    var TEMPLATE_TAG = 'template';

    HTMLTemplateElement = function() {}
    HTMLTemplateElement.prototype = Object.create(HTMLElement.prototype);

    HTMLTemplateElement.decorate = function(template) {
      if (template.content) {
        return;
      }
      template.content = template.ownerDocument.createDocumentFragment();
      var child;
      while (child = template.firstChild) {
        template.content.appendChild(child);
      }
    }

    HTMLTemplateElement.bootstrap = function(doc) {
      var templates = doc.querySelectorAll(TEMPLATE_TAG);
      Array.prototype.forEach.call(templates, function(template) {
        HTMLTemplateElement.decorate(template);
      });
    }

    // auto-bootstrapping
    // boot main document
    addEventListener('DOMContentLoaded', function() {
      HTMLTemplateElement.bootstrap(document);
    });
    
  })();
}
