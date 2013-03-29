/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

/*
  This is a limited shim for shadowDOM css styling.
  https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#styles
  
  The intention here is to support only the features which can be relatively 
  simply implemented. The goal is to allow users to avoid the most obvious 
  pitfalls and do so without compromising performance. For shadowDOM styling 
  that's not covered here, a set of best practices can be provided that should
  allow users to accomplish more complex styling if they adhere to a
  restricted set of patterns.

  The following is a list of specific shadowDOM styling features and a brief
  discussion of the approach used to shim.

  Shimmed features:

  * @host: ShadowDOM allows styling of the shadowRoot's host element using the 
  @host rule. To shim this feature for a given shadowRoot, the @host styles
  are reformatted and prefixed with a given scope name and promoted to a 
  document level stylesheet. For example, given a scope name of .foo,
  a rule like this:
  
    @host {
      * {
        background: red;
      }
    }
  
  is shimmed to:
  
    .foo {
      background: red;
    }
  
  * functional encapsultion: Styles defined within shadowDOM, apply only to 
  dom inside the shadowDOM. To shim this feature, non-@host rules within the 
  style elements in a given shadowRoot are prefixed with a given scope name. 
  Thus, they apply via a descendent selector to the dom inside the shadowRoot.
  For example, given a scope name of .foo, a rule like this:
  
    div {
      font-weight: bold;
    }
  
  is shimmed to:
  
    .foo div {
      font-weight: bold;
    }
  
  Un-shimmed features:
  
  * upper/lower bound encapsulation: Styles which are defined outside a
  shadowRoot should not cross the shadowDOM boundary and should not apply
  inside a shadowRoot.

  This feature is not shimmed. Some possible ways to do this that 
  were rejected due to complexity and/or performance concerns include: (1) reset
  every possible property for every possible selector for a given scope name;
  (2) re-implement css in javascript.
  
  Instead of shimming this feature, users can make sure to use selectors
  specific to the scope in which they are working.
  
  * ::distributed: Not shimmed. Users can create an extra node around an 
  insertion point and style that node's contents via descendent selectors.
  For example, with a shadowRoot like this:
  
    <style>
      content::-webkit-distributed(div) {
        background: red;
      }
    </style>
    <content></content>
  
  could be made like tihs:
  
    <style>
      content::-webkit-distributed(div) {
        background: red;
      }
  
      .content-container div {
        background: red;
      }
    </style>
    <div class="content-container">
      <content></content>
    </div>
  
  This shim could automate this.
  
  * ::pseudo: Not shimmed. Users can create an extra rule to target the 
  pseudo node directly. Given a shadowRoot like this:
  
    <div pseudo="x-special">Special</div>
  
  This can be styled using native and polyfilled shadowDOM as follows:
  
    x-foo::x-special {
      color: orange;
    }
    
    x-foo [pseudo=x-special] {
      color: orange;
    }
  
  This shim could automate this.

*/
(function(scope) {

var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
var concat = Array.prototype.concat.call.bind(Array.prototype.concat);

var doc = window.ShadowDOMPolyfill ? ShadowDOMPolyfill.wrap(document) : document;

var stylizer = {
  supportsCssScoped: (document.createElement('style').scoped === false),
  hostRuleRe: /@host[^{]*{(([^}]*?{[^{]*?}[\s\S]*?)+)}/gim,
  selectorRe: /([^{]*)({[\s\S]*?})/gim,
  hostFixableRe: /^[\.|\[]/,
  cssCommentRe: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim, 
  hostRe: /@host/gim,
  shimStyling: function(inElementElement) {
    if (window.ShadowDOMPolyfill) {
      var template = inElementElement.querySelector('template');
      var content = template && templateContent(template);
      if (content) {
        var scope = inElementElement.options.name;
        stylizer.shimShadowDomStyling(content, scope);
      }
    }
  },
  // Shim styles contained in a shadowRoot.
  // TODO(sorvell) could also be template.content that will become a shadowRoot.
  // 1. shim @host rules and inherited @host rules
  // 2. shim scoping: apply .scoped when available or pseudo-scoping when not 
  // (e.g. a selector 'div' becomes 'x-foo div')
  shimShadowDomStyling: function(inRoot, inScope) {
    this.shimAtHost.call(stylizer, inRoot, inScope);
    this.shimScoping.call(stylizer, inRoot, inScope);
  },
  // form: @host { .foo { declarations } }
  shimAtHost: function(inRoot, inScope) {
    var styles = this.findAtHostStyles(inRoot);
    var cssText = this.convertAtHostStyles(styles, inScope);
    this.addCssToDocument(cssText);
  },
  convertAtHostStyles: function(inStyles, inScope) {
    var cssText = this.stylesToCssText(inStyles);
    //
    var r = '', l=0, matches;
    while (matches=this.hostRuleRe.exec(cssText)) {
      r += cssText.substring(l, matches.index);
      r += this.scopeHostCss(matches[1], inScope);
      l = this.hostRuleRe.lastIndex;
    }
    r += cssText.substring(l, cssText.length);
    //
    var cssText = this.rulesToCss(this.findAtHostRules(this.cssToRules(r),
      inScope));
    return cssText;
  },
  scopeHostCss: function(cssText, inScope) {
    var r = '', matches;
    while (matches = this.selectorRe.exec(cssText)) {
      r += this.scopeHostSelector(matches[1], inScope) +' ' + matches[2] + '\n\t';
    }
    return r;
  },
  scopeHostSelector: function(selector, inScope) {
    var r = [], parts = selector.split(',');
    parts.forEach(function(p) {
      p = p.trim();
      // selector: * -> name
      if (p.indexOf('*') >= 0) {
        p = p.replace('*', inScope);   
      // selector: .foo -> name.foo, [bar] -> name[bar]
      } else if (p.match(this.hostFixableRe)) {
        p = inScope + p;
      }
      r.push(p);
    });
    return r.join(', ');
  },
  findAtHostStyles: function(inRoot, inScope) {
    var styles = inRoot.querySelectorAll('style') || [];
    var shadow = inRoot.querySelector('shadow');
    if (shadow) {
      var olderShadowRoot = this.findOlderShadowRoot(shadow, inScope);
      if (olderShadowRoot) {
        styles = concat(this.findAtHostStyles(olderShadowRoot, inScope));
      }
    }
    return styles;
  },
  // TODO(sorvell): If inRoot is a shadowRoot, we can look for 
  // olderShadowRoot. We will also need to support inRoot being 
  // template.content. In this case, we need another way to find olderShadowRoot.
  findOlderShadowRoot: function(inShadow, inScope) {
    return inShadow.olderShadowRoot;
  },
  // consider styles that do not include component name in the selector to be
  // unscoped and in need of promotion; 
  // for convenience, also consider keyframe rules this way.
  findAtHostRules: function(cssRules, name) {
    return Array.prototype.filter.call(cssRules, this.isHostRule.bind(this, name));
  },
  isHostRule: function(name, cssRule) {
    return (cssRule.selectorText && cssRule.selectorText.indexOf(name) >= 0) ||
      (cssRule.cssRules && this.findAtHostRules(cssRule.cssRules, name).length) ||
      (cssRule.type == CSSRule.WEBKIT_KEYFRAMES_RULE);
  },
  shimScoping: function(inRoot, inScope) {
    var styles = inRoot.querySelectorAll('style');
    if (this.supportsCssScoped) {
      this.applyScopedAttribute(styles);
    } else {
      //console.warn('No support detected for css scoped');
      this.applyPseudoScoping(styles, inScope);
    }
  },
  applyScopedAttribute: function(inStylesList) {
    forEach(inStylesList, function(s) {
      s.setAttribute("scoped", "");
    });
  },
  applyPseudoScoping: function(inStyles, inScope) {
    // remove the un-psuedoscoped orignal style element...
    // TODO(sorvell): if this is done on a template.content, then styles
    // must be cached.
    forEach(inStyles, function(s) {
      s.parentNode.removeChild(s);
    });
    // TODO(sorvell): remove @host rules (use cssom rather than regex?)
    var cssText = this.stylesToCssText(inStyles).replace(this.hostRuleRe, '');
    var rules = this.cssToRules(cssText);
    this.pseudoScopeRules(rules, inScope);
    var cssText = this.rulesToCss(rules);
    this.addCssToDocument(cssText);
  },
  // change a selector like 'div' to 'name div'
  pseudoScopeRules: function(cssRules, inScope) {
    forEach(cssRules, function(rule) {
      if (rule.selectorText && (rule.selectorText.indexOf(inScope) < 0)) {
        rule.selectorText = this.pseudoScopeSelector(rule.selectorText, inScope);
      } else if (rule.cssRules) {
        this.pseudoScopeRules(rule.cssRules, inScope);
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
  stylesToCssText: function(inStyles) {
    var cssText = '';
    forEach(inStyles, function(s) {
      cssText += s.textContent + '\n\n';
    });
    // strip comments for easier processing
    cssText = this.stripCssComments(cssText);
    return cssText;
  },
  stripCssComments: function(inCssText) {
    return inCssText.replace(this.cssCommentRe, '');
  },
  cssToRules: function(inCssText) {
    var style = document.createElement('style');
    style.textContent = inCssText;
    doc.head.appendChild(style);
    var rules = style.sheet.cssRules;
    style.parentNode.removeChild(style);
    return rules;
  },
  rulesToCss: function(inRules) {
    for (var i=0, css=[]; i < inRules.length; i++) {
      css.push(inRules[i].cssText);
    }
    return css.join('\n\n');
  },
  addCssToDocument: function(inCssText) {
    if (inCssText) {
      this.getSheet().appendChild(document.createTextNode(inCssText));
    }
  },
  // support for creating @host rules
  getSheet: function() {
    if (!this.sheet) {
      this.sheet = document.createElement("style");
    }
    return this.sheet;
  },
  apply: function() {
    this.addCssToDocument('style { display: none !important; }\n');
    doc.head.insertBefore(this.getSheet(), doc.head.children[0]);
  }
};

doc.addEventListener('WebComponentsReady', function() {
  stylizer.apply();
})

// exports
Toolkit.shimStyling = stylizer.shimStyling;

})(window);