/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

scope = scope || {};

// imports

var CustomDOMElements = scope.CustomDOMElements;
var path = scope.ComponentDocuments.path;
var componentLoader = scope.ComponentDocuments.loader.componentLoader;

// debuggable script injection
//
// this technique allows the component scripts to be
// viewable and debuggable in inspector scripts
// tab (each script is named "(program)" unless
// the user-agent supports source maps).

var context;

// invoke inScript in inContext scope
var inject = function(inScript, inContext, inName, inSourceUrl) {
  // set (highlander) context
  context = inContext;
  // compose script
  var code = "componentScript('" 
    + inName 
    + "', function(){"
    + inScript 
    + "});"
    + "\n//@ sourceURL=" + inSourceUrl + "\n"
  ;
  scope.ComponentDocuments.parser.injectScript(code);
};

// global necessary for script injection
window.componentScript = function(inName, inFunc) {
  inFunc.call(context);
};

// Custom DOM Elements SECTION 7.2

window.HTMLElementElement = function(inElement) {
  this.element = inElement;
  this.name = inElement.getAttribute("name");
  this.constructorName = inElement.getAttribute("constructor");
  this.extendsName = inElement.getAttribute("extends") || "div";
  this.template = inElement.querySelector("template");
  // TODO(sjmiles): ad hoc polyfill for <template> element
  this.template = elementParser.normalizeTemplate(this.template);
  this.generatedConstructor = function() {
    return this.instantiate();
  }
  if (!this.name) {
    console.error('name attribute is required.');
    return;
  }
  this.register(inElement);
};

HTMLElementElement.prototype = {
  lifecycle: function(inLifecycle) {
    this.lifecycleImpl = inLifecycle;
  },
  instantiate: function() {
    return CustomDOMElements.instantiate(this.prototype, this.template,
      this.lifecycleImpl);
  },
  register: function(element) {
    // fix css paths for inline style elements
    elementParser.adjustTemplateCssPaths(element, this.template);
    elementParser.adjustTemplateAttrPaths(element, this.template);
    // load component stylesheets
    elementParser.sheets(element, this.template);
    // ensure all style tags are scoped.
    elementParser.scopeStyles(element, this.template);
    //
    // to register a custom element, I need
    //
    //  prototype
    //  lifcycle
    //  template
    //
    // I have template right away
    //
    // I don't get lifecycle or prototype until
    // executing user's code
    //
    // so, execute user's code right away
    //
    // but user may want to cache the reference to generatedConstructor
    // so I have to make a 'real one', but I cannot use the canonical
    // constructor-generation algorithm because I am missing pieces
    //
    // Gambit: make a custom generatedConstructor that binds
    // to an object that is filled in later (instead of
    // a closure)
    //
    // evaluate components scripts
    //
    elementParser.scripts(element, this);
    //
    // now we have the user supplied prototype and lifecycle
    //console.log("registering", this.name);
    //console.log(this.generatedConstructor.prototype);
    //console.log(this.lifecycleImpl);
    //
    // we need to reprocess the prototype (cheating because
    // prototype is not a property defintion object as called for
    // by the spec; it happens to work now due CustomDOMElements is
    // implemented to take a regular map)
    //
    this.prototype = CustomDOMElements.generatePrototype(this.extendsName,
      this.generatedConstructor.prototype);
    // TODO(sjmiles): putting name on prototype not in spec
    this.prototype.is = this.name;
    //
    // can't use canonical register method because we've already
    // generated a constructor
    //
    // we almost implement 'definition', except for lifecycleImpl
    //
    var definition = {
      name: this.name,
      path: elementParser.calcElementPath(element),
      prototype: this.prototype,
      template: this.template,
      lifecycle: this.lifecycleImpl || {}
    };
    CustomDOMElements.addDefinition(this.name, definition);
    // apply @host styles and pseudo scope css if style.scoped is unavailable
    elementParser.applyComponentStyles(definition);
    CustomDOMElements.upgradeElements(document, definition);
    //
    // optionally install the constructor on the global object
    if (this.constructorName) {
      window[this.constructorName] = this.generatedConstructor;
    }
  }
};

var URL_ATTRS = ['href', 'src', 'action'];
var URL_ATTRS_SELECTOR = '[' + URL_ATTRS.join('],[') + ']';
var URL_TEMPLATE_SEARCH = '{{.*}}';

var elementParser = {
  parse: function(element) {
    new HTMLElementElement(element);
  },
  scripts: function(element, htmlElementElement) {
    // accumulate all script content from the element declaration
    var script = [];
    forEach($$(element, "script"), function(s) {
      script.push(s.textContent);
    });
    // if there is any code, inject it
    if (script.length) {
      inject(script.join(';\n'), htmlElementElement, htmlElementElement.name,
        htmlElementElement.element.ownerDocument.name);
    }
  },
  normalizeTemplate: function(inTemplate) {
    if (inTemplate && !inTemplate.content) {
      HTMLTemplateElement.bootstrap(inTemplate);
    }
    return inTemplate;
  },
  adjustTemplateCssPaths: function(element, template) {
    if (template) {
      var docUrl = path.documentUrlFromNode(element);
      forEach($$(template.content, "style"), function(s) {
        s.textContent = this.makeCssUrlsRelative(s.textContent, docUrl);
      }.bind(this));
    }
  },
  makeCssUrlsRelative: function(inCssText, inBaseUrl) {
    return inCssText.replace(/url\([^)]*\)/g, function(inMatch) {
      // find the url path, ignore quotes in url string
      var urlPath = inMatch.replace(/["']/g, "").slice(4, -1);
      urlPath = path.resolveUrl(inBaseUrl, urlPath);
      urlPath = path.makeRelPath(document.URL, urlPath);
      return "url(" + urlPath + ")";
    });
  },
  calcElementPath: function(element) {
    var docUrl = path.documentUrlFromNode(element);
    return path.makeRelPath(document.URL, path.urlToPath(docUrl));
  },
  adjustTemplateAttrPaths: function(element, template) {
    if (template) {
      var docUrl = path.documentUrlFromNode(element);
      this._adjustTemplateAttrPaths(template, docUrl);
    }
  },
  _adjustTemplateAttrPaths: function(template, inUrl) {
    var templateContent = template.content || template;
    // search for attributes that host urls in templates
    forEach($$(templateContent, URL_ATTRS_SELECTOR), function(n) {
      URL_ATTRS.forEach(function(v) {
        var attr = n.attributes[v];
        if (attr && attr.value && (attr.value.search(URL_TEMPLATE_SEARCH) < 0)) {
          attr.value = path.resolveUrl(inUrl, attr.value);
        }
      });
    }.bind(this));
    // now search for templates in templates
    forEach($$(templateContent, 'template'), function(n) {
      this._adjustTemplateAttrPaths(n, inUrl);
    }.bind(this));
  },
  sheets: function(element, template) {
    var sheet = [];
    if (template) {
      forEach($$(element, "link[rel=stylesheet]"), function(s) {
        var styles = componentLoader.fetch(s);
        styles = this.makeCssUrlsRelative(styles, path.nodeUrl(s));
        sheet.push(styles);
      }.bind(this));
      if (sheet.length) {
        var style = document.createElement("style");
        style.style.display = "none !important;";
        style.innerHTML = sheet.join('');
        template.content.appendChild(style);
      }
    }
  },
  scopeStyles: function(element, template) {
    if (template) {
      forEach($$(template.content, "style"), function(s) {
        s.setAttribute("scoped", "");
      });
    }
  },
  needsPsuedoStyleScoping: ShadowDOM.shim && 
    (document.createElement('style').scoped !== false),
  hostRuleRe: /@host[^{]*{(([^}]*?{[^{]*?}[\s\S]*?)+)}/gim,
  simpleHostRuleRe: /(@host[^{]*)({[\s\S]*?})/gim,
  selectorRe: /([^{]*)({[\s\S]*?})/gim,
  hostFixableRe: /^[\.|\[]/,
  hostRe: /@host/gim,
  // Apply styles to component. This includes:
  // 1. @host rules and inherited @host rules
  // 2. psuedo-scoped (e.g. a selector 'div' becomes 'x-foo div' where
  // x-foo is the component name) rules when style.scoped is not supported.
  applyComponentStyles: function(definition) {
    this.cacheDefinitionStyles(definition);
    this.applyHostStyles(definition);
    if (this.needsPsuedoStyleScoping) {
      this.applyPseudoScopedStyles(definition);
    }
  },
  cacheDefinitionStyles: function(definition) {
    definition.styles = [];
    if (definition.template) {
      var styles = Array.prototype.slice.call(
        $$(definition.template.content, "style"), 0);
      definition.styles = styles.filter(function(s) {
        return !s.id;
      });
    }
    definition.inheritedStyles = this.findInheritedStyles(definition) || [];
  },
  stylesToCssText: function(styles) {
    var cssText = '';
    forEach(styles, function(s) {
      cssText += s.textContent + '\n\n';
    });
    return cssText;
  },
  // TODO(sorvell): host styles don't need promotion when scoped is supported.
  applyHostStyles: function(definition) {
    var cssText = this.stylesToCssText((definition.inheritedStyles).concat(
      definition.styles));
    // form: @host { .foo { declarations } }
    //if (ShadowDOM.shim) {
      cssText = this.convertHostCss(cssText, definition.name);
    //}
    // form: @host { declarations }
    cssText = this.convertSimpleHostCss(cssText, definition.name)
    // TODO(sorvell): use cssom to interrogate component rules, 
    // requires being attached to document or ?
    var style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
    cssText = this.rulesToCss(this.findHostRules(style.sheet.cssRules,
      definition.name));
    style.parentNode.removeChild(style);
    this.addCss(cssText);
  },
  convertHostCss: function(cssText, name) {
    var r = '', l=0, matches;
    while (matches=this.hostRuleRe.exec(cssText)) {
      r += cssText.substring(l, matches.index);
      r += this.psuedoHostScopeCss(matches[1], name);
      l = this.hostRuleRe.lastIndex;
    }
    r += cssText.substring(l, cssText.length);
    return r;
  },
  psuedoHostScopeCss: function(cssText, name) {
    var r = '', matches;
    while (matches=this.selectorRe.exec(cssText)) {
      r += this.psuedoHostScopeSelector(matches[1], name) +' ' + matches[2] + '\n\t';
    }
    return r;
  },
  psuedoHostScopeSelector: function(selector, name) {
    var r = [], parts = selector.split(',');
    parts.forEach(function(p) {
      p = p.trim();
      // selector: * -> name
      if (p.indexOf('*') >= 0) {
        p = p.replace('*', name);   
      // selector: .foo -> name.foo, [bar] -> name[bar]
      } else if (p.match(this.hostFixableRe)) {
        p = name + p;
      }
      r.push(p);
    });
    return r.join(', ');
  },
  convertSimpleHostCss: function(cssText, name) {
   return cssText.replace(this.hostRe, name);
  },
  // consider styles that do not include component name in the selector to be
  // unscoped and in need of promotion; 
  // for convenience, also consider keyframe rules this way.
  findHostRules: function(cssRules, name) {
    return Array.prototype.filter.call(cssRules, this.isHostRule.bind(this, name));
  },
  isHostRule: function(name, cssRule) {
    return (cssRule.selectorText && cssRule.selectorText.indexOf(name) >= 0) ||
      (cssRule.cssRules && this.findHostRules(cssRule.cssRules, name).length) ||
      (cssRule.type == CSSRule.WEBKIT_KEYFRAMES_RULE);
  },
  // @host styles are inherited IFF a <shadow> element
  // exists in the shadowRoot.
  findInheritedStyles: function(definition) {
    var styles = [];
    if (this.templateHasShadow(definition.template)) {
      var extendor = this.findExtendor(definition);
      styles = (extendor.styles || []).slice(0);
      var inherited = extendor.inheritedStyles || 
        this.findInheritedStyles(extendor);
      Array.prototype.unshift.apply(styles, inherited);
    }
    return styles;
  },
  templateHasShadow: function(template) {
    if (template) {
      return template.content.querySelector('shadow');
    }
  },
  findExtendor: function(definition) {
    return CustomDOMElements.registry[definition.prototype.extendsName];
  },
  applyPseudoScopedStyles: function(definition) {
    // remove the un-psuedoscoped orignal style element from template 
    forEach(definition.styles, function(s) {
      s.parentNode.removeChild(s);
    });
    var cssText = this.stylesToCssText(definition.styles);
    // TODO(sorvell): use cssom rather than regex to remove @host rules?
    cssText = cssText.replace(this.hostRuleRe, '').replace(this.simpleHostRuleRe, '');
    var style = document.createElement('style');
    style.textContent = cssText;
    // TODO(sorvell): use cssom to interrogate component rules, 
    // requires being attached to document or ?
    document.head.appendChild(style);
    this.pseudoScopeRules(style.sheet.cssRules, definition.name);
    var css = this.rulesToCss(style.sheet.cssRules);
    style.parentNode.removeChild(style);
    this.addCss(css);
  },
  // change a selector like 'div' to 'name div'
  pseudoScopeRules: function(cssRules, name) {
    forEach(cssRules, function(rule) {
      if (rule.selectorText && (rule.selectorText.indexOf(name) < 0)) {
        rule.selectorText = this.pseudoScopeSelector(rule.selectorText, name);
      } else if (rule.cssRules) {
        this.pseudoScopeRules(rule.cssRules, name);
      }
    }, this);
  },
  pseudoScopeSelector: function(selector, name) {
    var r = [], parts = selector.split(',');
    parts.forEach(function(p) {
      r.push(name + ' ' + p.trim());
    });
    return r.join(', ');
  },
  rulesToCss: function(cssRules) {
    for (var i=0, css=[]; i < cssRules.length; i++) {
      css.push(cssRules[i].cssText);
    }
    return css.join('\n\n');
  },
  addCss: function(inCssText) {
    if (inCssText) {
      this.getComponentsSheet().appendChild(document.createTextNode(inCssText));
    }
  },
  // support for creating @host rules
  getComponentsSheet: function() {
    if (!this.componentsSheet) {
      this.componentsSheet = document.createElement("style");
      // make sure stylesheets aren't rendered
      this.addCss('style { display: none !important; }\n');
      //this.insertComponentsSheet();
    }
    return this.componentsSheet;
  },
  insertComponentsSheet: function() {
    document.head.insertBefore(this.getComponentsSheet(), document.head.children[0]);
  }
};

var elementUpgrader = {
  initialize: function() {
    this._upgradeElements = CustomDOMElements.upgradeElements;
    CustomDOMElements.upgradeElements = nop;
  },
  go: function() {
    elementParser.insertComponentsSheet();
    CustomDOMElements.upgradeElements = this._upgradeElements;
    CustomDOMElements.upgradeAll(document);
    CustomDOMElements.watchDOM(document);
  }
};

// exports

scope.CustomDOMElements.elementParser = elementParser;
scope.CustomDOMElements.elementUpgrader = elementUpgrader;

})(window.__exported_components_polyfill_scope__);