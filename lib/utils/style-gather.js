/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * Module with utilities for collection CSS text from `<templates>`, external
 * stylesheets, and `dom-module`s.
 *
 * @summary Module with utilities for collection CSS text from various sources.
 */

import { DomModule } from '../elements/dom-module.js';
import { resolveCss } from './resolve-url.js';

const MODULE_STYLE_LINK_SELECTOR = 'link[rel=import][type~=css]';
const INCLUDE_ATTR = 'include';
const SHADY_UNSCOPED_ATTR = 'shady-unscoped';

/**
 * @param {string} moduleId .
 * @return {?DomModule} .
 */
function importModule(moduleId) {
  return /** @type {?DomModule} */(DomModule.import(moduleId));
}

function styleForImport(importDoc) {
  // NOTE: polyfill affordance.
  // under the HTMLImports polyfill, there will be no 'body',
  // but the import pseudo-doc can be used directly.
  let container = importDoc.body ? importDoc.body : importDoc;
  const importCss = resolveCss(container.textContent,
    importDoc.baseURI);
  const style = document.createElement('style');
  style.textContent = importCss;
  return style;
}

/** @typedef {{assetpath: string}} */
let templateWithAssetPath; // eslint-disable-line no-unused-vars


/**
 * Returns a list of <style> elements in a space-separated list of `dom-module`s.
 *
 * @function
 * @param {string} moduleIds List of dom-module id's within which to
 * search for css.
 * @return {!Array<!HTMLStyleElement>} Array of contained <style> elements
 */
export function stylesFromModules(moduleIds) {
 const modules = moduleIds.trim().split(/\s+/);
 const styles = [];
 for (let i=0; i < modules.length; i++) {
   styles.push(...stylesFromModule(modules[i]));
 }
 return styles;
}

/**
 * Returns a list of <style> elements in a given `dom-module`.
 * Styles in a `dom-module` can come either from `<style>`s within the
 * first `<template>`, or else from one or more
 * `<link rel="import" type="css">` links outside the template.
 *
 * @param {string} moduleId dom-module id to gather styles from
 * @return {!Array<!HTMLStyleElement>} Array of contained styles.
 */
export function stylesFromModule(moduleId) {
  const m = importModule(moduleId);

  if (!m) {
    console.warn('Could not find style data in module named', moduleId);
    return [];
  }

  if (m._styles === undefined) {
    const styles = [];
    // module imports: <link rel="import" type="css">
    styles.push(..._stylesFromModuleImports(m));
    // include css from the first template in the module
    const template = /** @type {?HTMLTemplateElement} */(
        m.querySelector('template'));
    if (template) {
      styles.push(...stylesFromTemplate(template,
        /** @type {templateWithAssetPath} */(m).assetpath));
    }

    m._styles = styles;
  }

  return m._styles;
}

/**
 * Returns the `<style>` elements within a given template.
 *
 * @param {!HTMLTemplateElement} template Template to gather styles from
 * @param {string} baseURI baseURI for style content
 * @return {!Array<!HTMLStyleElement>} Array of styles
 */
export function stylesFromTemplate(template, baseURI) {
  if (!template._styles) {
    const styles = [];
    // if element is a template, get content from its .content
    const e$ = template.content.querySelectorAll('style');
    for (let i=0; i < e$.length; i++) {
      let e = e$[i];
      // support style sharing by allowing styles to "include"
      // other dom-modules that contain styling
      let include = e.getAttribute(INCLUDE_ATTR);
      if (include) {
        styles.push(...stylesFromModules(include).filter(function(item, index, self) {
          return self.indexOf(item) === index;
        }));
      }
      if (baseURI) {
        e.textContent = resolveCss(e.textContent, baseURI);
      }
      styles.push(e);
    }
    template._styles = styles;
  }
  return template._styles;
}

/**
 * Returns a list of <style> elements  from stylesheets loaded via `<link rel="import" type="css">` links within the specified `dom-module`.
 *
 * @param {string} moduleId Id of `dom-module` to gather CSS from
 * @return {!Array<!HTMLStyleElement>} Array of contained styles.
 */
export function stylesFromModuleImports(moduleId) {
 let m = importModule(moduleId);
 return m ? _stylesFromModuleImports(m) : [];
}

/**
 * @param {!HTMLElement} module dom-module element that could contain `<link rel="import" type="css">` styles
 * @return {!Array<!HTMLStyleElement>} Array of contained styles
 */
function _stylesFromModuleImports(module) {
  const styles = [];
  const p$ = module.querySelectorAll(MODULE_STYLE_LINK_SELECTOR);
  for (let i=0; i < p$.length; i++) {
    let p = p$[i];
    if (p.import) {
      const importDoc = p.import;
      const unscoped = p.hasAttribute(SHADY_UNSCOPED_ATTR);
      if (unscoped && !importDoc._unscopedStyle) {
        const style = styleForImport(importDoc);
        style.setAttribute(SHADY_UNSCOPED_ATTR, '');
        importDoc._unscopedStyle = style;
      } else if (!importDoc._style) {
        importDoc._style = styleForImport(importDoc);
      }
      styles.push(unscoped ? importDoc._unscopedStyle : importDoc._style);
    }
  }
  return styles;
}

/**
 *
 * Returns CSS text of styles in a space-separated list of `dom-module`s.
 * Note: This method is deprecated, use `stylesFromModules` instead.
 *
 * @deprecated
 * @param {string} moduleIds List of dom-module id's within which to
 * search for css.
 * @return {string} Concatenated CSS content from specified `dom-module`s
 */
export function cssFromModules(moduleIds) {
 let modules = moduleIds.trim().split(/\s+/);
 let cssText = '';
 for (let i=0; i < modules.length; i++) {
   cssText += cssFromModule(modules[i]);
 }
 return cssText;
}

/**
 * Returns CSS text of styles in a given `dom-module`.  CSS in a `dom-module`
 * can come either from `<style>`s within the first `<template>`, or else
 * from one or more `<link rel="import" type="css">` links outside the
 * template.
 *
 * Any `<styles>` processed are removed from their original location.
 * Note: This method is deprecated, use `styleFromModule` instead.
 *
 * @deprecated
 * @param {string} moduleId dom-module id to gather styles from
 * @return {string} Concatenated CSS content from specified `dom-module`
 */
export function cssFromModule(moduleId) {
  let m = importModule(moduleId);
  if (m && m._cssText === undefined) {
    // module imports: <link rel="import" type="css">
    let cssText = _cssFromModuleImports(m);
    // include css from the first template in the module
    let t = /** @type {?HTMLTemplateElement} */(m.querySelector('template'));
    if (t) {
      cssText += cssFromTemplate(t,
        /** @type {templateWithAssetPath} */(m).assetpath);
    }
    m._cssText = cssText || null;
  }
  if (!m) {
    console.warn('Could not find style data in module named', moduleId);
  }
  return m && m._cssText || '';
}

/**
 * Returns CSS text of `<styles>` within a given template.
 *
 * Any `<styles>` processed are removed from their original location.
 * Note: This method is deprecated, use `styleFromTemplate` instead.
 *
 * @deprecated
 * @param {!HTMLTemplateElement} template Template to gather styles from
 * @param {string} baseURI Base URI to resolve the URL against
 * @return {string} Concatenated CSS content from specified template
 */
export function cssFromTemplate(template, baseURI) {
  let cssText = '';
  const e$ = stylesFromTemplate(template, baseURI);
  // if element is a template, get content from its .content
  for (let i=0; i < e$.length; i++) {
    let e = e$[i];
    if (e.parentNode) {
      e.parentNode.removeChild(e);
    }
    cssText += e.textContent;
  }
  return cssText;
}

/**
 * Returns CSS text from stylesheets loaded via `<link rel="import" type="css">`
 * links within the specified `dom-module`.
 *
 * Note: This method is deprecated, use `stylesFromModuleImports` instead.
 *
 * @deprecated
 *
 * @param {string} moduleId Id of `dom-module` to gather CSS from
 * @return {string} Concatenated CSS content from links in specified `dom-module`
 */
export function cssFromModuleImports(moduleId) {
  let m = importModule(moduleId);
  return m ? _cssFromModuleImports(m) : '';
}

/**
 * @deprecated
 * @param {!HTMLElement} module dom-module element that could contain `<link rel="import" type="css">` styles
 * @return {string} Concatenated CSS content from links in the dom-module
 */
function _cssFromModuleImports(module) {
  let cssText = '';
  let styles = _stylesFromModuleImports(module);
  for (let i=0; i < styles.length; i++) {
    cssText += styles[i].textContent;
  }
  return cssText;
}
