/*
 * Copyright 2012 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

/*
  This is a limited shim for shadowDOM css styling.
  https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#styles
  
  The intention here is to support only the styling features which can be 
  relatively simply implemented. The goal is to allow users to avoid the 
  most obvious pitfalls and do so without compromising performance significantly. 
  For shadowDOM styling that's not covered here, a set of best practices
  can be provided that should allow users to accomplish more complex styling.

  The following is a list of specific shadowDOM styling features and a brief
  discussion of the approach used to shim.

  Shimmed features:

  * @host: ShadowDOM allows styling of the shadowRoot's host element using the 
  @host rule. To shim this feature, the @host styles are reformatted and 
  prefixed with a given scope name and promoted to a document level stylesheet.
  For example, given a scope name of .foo, a rule like this:
  
    @host {
      * {
        background: red;
      }
    }
  
  becomes:
  
    .foo {
      background: red;
    }
  
  * encapsultion: Styles defined within shadowDOM, apply only to 
  dom inside the shadowDOM. To shim this feature, non-@host rules within 
  style elements are scoped by adding an attribute selector suffix to each
  simple selector that contains the scope name. Each element in the definition
  template content is also given the scope attribute. Thus, these rules match
  only elements that have the scope attribute.
  For example, given a scope name of x-foo, a rule like this:
  
    div {
      font-weight: bold;
    }
  
  becomes:
  
    div[x-foo] {
      font-weight: bold;
    }

  Note that elements that are dynamically added to a scope must have the scope
  selector added to them manually.

  * ::pseudo: These rules are converted to rules that take advantage of the
  pseudo attribute. For example, a shadowRoot like this inside an x-foo

    <div pseudo="x-special">Special</div>

  with a rule like this:

    x-foo::x-special { ... }

  becomes:

    x-foo [pseudo=x-special] { ... }
  
  Unaddressed shadowDOM styling features:
  
  * upper/lower bound encapsulation: Styles which are defined outside a
  shadowRoot should not cross the shadowDOM boundary and should not apply
  inside a shadowRoot.

  This styling behavior is not emulated. Some possible ways to do this that 
  were rejected due to complexity and/or performance concerns include: (1) reset
  every possible property for every possible selector for a given scope name;
  (2) re-implement css in javascript.
  
  As an alternative, users should make sure to use selectors
  specific to the scope in which they are working.
  
  * ::distributed: This behavior is not emulated. It's often not necessary
  to style the contents of a specific insertion point and instead, descendants
  of the host element can be styled selectively. Users can also create an 
  extra node around an insertion point and style that node's contents
  via descendent selectors. For example, with a shadowRoot like this:
  
    <style>
      content::-webkit-distributed(div) {
        background: red;
      }
    </style>
    <content></content>
  
  could become:
  
    <style>
      / *@polyfill .content-container div * / 
      content::-webkit-distributed(div) {
        background: red;
      }
    </style>
    <div class="content-container">
      <content></content>
    </div>
  
  Note the use of @polyfill in the comment above a shadowDOM specific style
  declaration. This is a directive to the styling shim to use the selector 
  in comments in lieu of the next selector when running under polyfill.
*/
(function(scope) {

var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
var concat = Array.prototype.concat.call.bind(Array.prototype.concat);
var slice = Array.prototype.slice.call.bind(Array.prototype.slice);

var stylizer = {
  hostRuleRe: /@host[^{]*{(([^}]*?{[^{]*?}[\s\S]*?)+)}/gim,
  selectorRe: /([^{]*)({[\s\S]*?})/gim,
  hostElementRe: /(\*)|(\:scope)/,
  hostFixableRe: /^[.\[:]/,
  cssCommentRe: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
  cssPolyfillCommentRe: /\/\*\s*@polyfill ([^*]*\*+([^/*][^*]*\*+)*\/)([^{]*?){/gim,
  cssPseudoRe: /::(x-[^\s{,(]*)/gim,
  selectorReSuffix: '([>\\s~+\[.,{:][\\s\\S]*)?$',
  hostRe: /@host/gim,
  cache: {},
  shimStyling: function(element) {
    if (window.ShadowDOMPolyfill && element) {
      // use caching to make working with styles nodes easier and to facilitate
      // lookup of extendee
      var name = element.options.name;
      stylizer.cacheDefinition(element);
      stylizer.applyScopeToContent(element.templateContent, name);
      stylizer.shimPolyfillDirectives(element.styles, name);
      // find styles and apply shimming...
      stylizer.applyShimming(stylizer.stylesForElement(element), name);
    }
  },
  // Shim styles to be placed inside a shadowRoot.
  // 1. shim @host rules and inherited @host rules
  // 2. shim scoping: apply .scoped when available or pseudo-scoping when not 
  // (e.g. a selector 'div' becomes 'x-foo div')
  shimShadowDOMStyling: function(styles, name) {
    if (window.ShadowDOMPolyfill) {
      stylizer.shimPolyfillDirectives(styles, name);
      stylizer.applyShimming(styles, name);
    }
  },
  applyShimming: function(styles, name) {
    var cssText = this.shimAtHost(styles, name);
    cssText += this.shimScoping(styles, name);
    this.addCssToDocument(cssText);
  },
  //TODO(sorvell): use SideTable
  cacheDefinition: function(element) {
    var name = element.options.name;
    var template = element.querySelector('template');
    var content = template && templateContent(template);
    var styles = content && content.querySelectorAll('style');
    element.styles = styles ? slice(styles) : [];
    element.templateContent = content;
    stylizer.cache[name] = element;
  },
  applyScopeToContent: function(root, name) {
    if (root) {
      forEach(root.querySelectorAll('*'), function(node) {
        node.setAttribute(name, '');
      });
      forEach(root.querySelectorAll('template'), function(template) {
        this.applyScopeToContent(templateContent(template), name);
      }, this);
    }
  },
  stylesForElement: function(element) {
    var styles = element.styles;
    var shadow = element.templateContent && 
      element.templateContent.querySelector('shadow');
    if (shadow || (element.templateContent === null)) {
      var extendee = this.findExtendee(element.options.name);
      if (extendee) {
        var extendeeStyles = this.stylesForElement(extendee);
        styles = concat(slice(extendeeStyles), slice(styles));
      }
    }
    return styles;
  },
  findExtendee: function(name) {
    var element = this.cache[name];
    return element && this.cache[element.options.extends];
  },
  /*
   * Process styles to convert native ShadowDOM rules that will trip
   * up the css parser; we rely on decorating the stylesheet with comments.
   * 
   * For example, we convert this rule:
   * 
   * (comment start) @polyfill @host g-menu-item (comment end)
   * shadow::-webkit-distributed(g-menu-item) {
   * 
   * to this:
   * 
   * scopeName g-menu-item {
   *
  **/
  shimPolyfillDirectives: function(styles, name) {
    if (window.ShadowDOMPolyfill) {
      if (styles) {
        forEach(styles, function(s) {
          s.textContent = this.convertPolyfillDirectives(s.textContent, name);
        }, this);
      }
    }
  },
  // form: @host { .foo { declarations } }
  // becomes: scopeName.foo { declarations }
  shimAtHost: function(styles, name) {
    if (styles) {
      return this.convertAtHostStyles(styles, name);
    }
  },
  /* Ensure styles are scoped. Pseudo-scoping takes a rule like:
   * 
   *  .foo {... } 
   *  
   *  and converts this to
   *  
   *  scopeName .foo { ... }
  */
  shimScoping: function(styles, name) {
    if (styles) {
      return this.convertScopedStyles(styles, name);
    }
  },
  convertPolyfillDirectives: function(cssText, name) {
    var r = '', l = 0, matches;
    while (matches=this.cssPolyfillCommentRe.exec(cssText)) {
      r += cssText.substring(l, matches.index);
      // remove end comment delimiter (*/)
      r += name + ' ' + matches[1].slice(0, -2) + '{';
      l = this.cssPolyfillCommentRe.lastIndex;
    }
    r += cssText.substring(l, cssText.length);
    return r;
  },
  // consider styles that do not include component name in the selector to be
  // unscoped and in need of promotion; 
  // for convenience, also consider keyframe rules this way.
  findAtHostRules: function(cssRules, matcher) {
    return Array.prototype.filter.call(cssRules, 
      this.isHostRule.bind(this, matcher));
  },
  isHostRule: function(matcher, cssRule) {
    return (cssRule.selectorText && cssRule.selectorText.match(matcher)) ||
      (cssRule.cssRules && this.findAtHostRules(cssRule.cssRules, matcher).length) ||
      (cssRule.type == CSSRule.WEBKIT_KEYFRAMES_RULE);
  },
  convertAtHostStyles: function(styles, name) {
    var cssText = this.stylesToCssText(styles);
    var r = '', l=0, matches;
    while (matches=this.hostRuleRe.exec(cssText)) {
      r += cssText.substring(l, matches.index);
      r += this.scopeHostCss(matches[1], name);
      l = this.hostRuleRe.lastIndex;
    }
    r += cssText.substring(l, cssText.length);
    var selectorRe = new RegExp('^' + name + this.selectorReSuffix, 'm');
    var cssText = this.rulesToCss(this.findAtHostRules(this.cssToRules(r),
      selectorRe));
    return cssText;
  },
  scopeHostCss: function(cssText, name) {
    var r = '', matches;
    while (matches = this.selectorRe.exec(cssText)) {
      r += this.scopeHostSelector(matches[1], name) +' ' + matches[2] + '\n\t';
    }
    return r;
  },
  scopeHostSelector: function(selector, name) {
    var r = [], parts = selector.split(',');
    parts.forEach(function(p) {
      p = p.trim();
      // selector: *|:scope -> name
      if (p.match(this.hostElementRe)) {
        p = p.replace(this.hostElementRe, name);   
      // selector: .foo -> name.foo, [bar] -> name[bar]
      } else if (p.match(this.hostFixableRe)) {
        p = name + p;
      }
      r.push(p);
    }, this);
    return r.join(', ');
  },
  convertScopedStyles: function(styles, name) {
    forEach(styles, function(s) {
      if (s.parentNode) {
        s.parentNode.removeChild(s);
      }
    });
    // TODO(sorvell): remove @host rules (use cssom rather than regex?)
    var cssText = this.stylesToCssText(styles).replace(this.hostRuleRe, '');
    var rules = this.cssToRules(cssText);
    cssText = this.scopeRules(rules, name);
    return this.convertPseudos(cssText);
  },
  convertPseudos: function(cssText) {
    return cssText.replace(this.cssPseudoRe, ' [pseudo=$1]');
  },
  // change a selector like 'div' to 'name div'
  scopeRules: function(cssRules, name) {
    var cssText = '';
    forEach(cssRules, function(rule) {
      if (rule.selectorText && (rule.style && rule.style.cssText)) {
        cssText += this.scopeSelector(rule.selectorText, name) + ' {\n\t';
        cssText += rule.style.cssText + '\n}\n\n';
      } else if (rule.media) {
        cssText += '@media ' + rule.media.mediaText + ' {\n';
        cssText += this.scopeRules(rule.cssRules, name);
        cssText += '\n}\n\n';
      } else if (rule.cssText) {
        cssText += rule.cssText + '\n\n';
      }
    }, this);
    return cssText;
  },
  scopeSelector: function(selector, name) {
    var r = [], parts = selector.split(','), t;
    var selectorRe = new RegExp('^' + name + this.selectorReSuffix, 'm');
    parts.forEach(function(p) {
      t = p.trim();
      if (t.match(selectorRe)) {
        r.push(t);
      } else {
        r.push(this.scopeCompoundSelector(t, name));
      }
    }, this);
    return r.join(', ');
  },
  // return a selector with [name] suffix on each simple selector
  // e.g. .foo.bar > .zot becomes .foo[name].bar[name] > .zot[name]
  scopeCompoundSelector: function(selector, name) {
    // TODO(sorvell): process complete set of complex selector markers
    var splits = [' ', '.', '>'],
      scoped = selector,
      attrName = '[' + name + ']';
    splits.forEach(function(sep) {
      var parts = scoped.split(sep);
      scoped = parts.map(function(p) {
        var t = p.trim();
        if (t && (splits.indexOf(t) < 0) && (t.indexOf(attrName) < 0)) {
          p = t.replace(/([^:]*)(:*)(.*)/, '$1' + attrName + '$2$3')
        }
        return p;
      }).join(sep);
    });
    return scoped;
  },
  stylesToCssText: function(styles, preserveComments) {
    var cssText = '';
    forEach(styles, function(s) {
      cssText += s.textContent + '\n\n';
    });
    // strip comments for easier processing
    if (!preserveComments) {
      cssText = this.stripCssComments(cssText);
    }
    return cssText;
  },
  stripCssComments: function(cssText) {
    return cssText.replace(this.cssCommentRe, '');
  },
  cssToRules: function(cssText) {
    var style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
    var rules = style.sheet.cssRules;
    style.parentNode.removeChild(style);
    return rules;
  },
  rulesToCss: function(cssRules) {
    for (var i=0, css=[]; i < cssRules.length; i++) {
      css.push(cssRules[i].cssText);
    }
    return css.join('\n\n');
  },
  addCssToDocument: function(cssText) {
    if (cssText) {
      this.getSheet().appendChild(document.createTextNode(cssText));
    }
  },
  // support for creating @host rules
  getSheet: function() {
    if (!this.sheet) {
      this.sheet = document.createElement("style");
      this.sheet.setAttribute('polymer-polyfill', '');
    }
    return this.sheet;
  },
  addSheetToDocument: function() {
    this.addCssToDocument('style { display: none !important; }\n');
    var head = document.querySelector('head');
    head.insertBefore(this.getSheet(), head.childNodes[0]);
  }
};

// add polyfill stylesheet to document
if (window.ShadowDOMPolyfill) {
  stylizer.addSheetToDocument();
}

// exports
Polymer.shimStyling = stylizer.shimStyling;
Polymer.shimShadowDOMStyling = stylizer.shimShadowDOMStyling;
Polymer.shimPolyfillDirectives = stylizer.shimPolyfillDirectives.bind(stylizer);

})(window);