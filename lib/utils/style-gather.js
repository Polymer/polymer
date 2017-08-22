import { resolveCss } from './resolve-url.js';

const MODULE_STYLE_LINK_SELECTOR = 'link[rel=import][type~=css]';
const INCLUDE_ATTR = 'include';

function importModule(moduleId) {
  const /** Polymer.DomModule */ PolymerDomModule = customElements.get('dom-module');
  if (!PolymerDomModule) {
    return null;
  }
  return PolymerDomModule.import(moduleId);
}

/** @typedef {{assetpath: string}} */
let templateWithAssetPath; // eslint-disable-line no-unused-vars

export function cssFromModules(moduleIds) {
  let modules = moduleIds.trim().split(/\s+/);
  let cssText = '';
  for (let i=0; i < modules.length; i++) {
    cssText += cssFromModule(modules[i]);
  }
  return cssText;
}

export function cssFromModule(moduleId) {
  let m = importModule(moduleId);
  if (m && m._cssText === undefined) {
    // module imports: <link rel="import" type="css">
    let cssText = _cssFromModuleImports(m);
    // include css from the first template in the module
    let t = m.querySelector('template');
    if (t) {
      cssText += cssFromTemplate(t, /** @type {templateWithAssetPath} */(m).assetpath);
    }
    m._cssText = cssText || null;
  }
  if (!m) {
    console.warn('Could not find style data in module named', moduleId);
  }
  return m && m._cssText || '';
}

export function cssFromTemplate(template, baseURI) {
  let cssText = '';
  // if element is a template, get content from its .content
  let e$ = template.content.querySelectorAll('style');
  for (let i=0; i < e$.length; i++) {
    let e = e$[i];
    // support style sharing by allowing styles to "include"
    // other dom-modules that contain styling
    let include = e.getAttribute(INCLUDE_ATTR);
    if (include) {
      cssText += cssFromModules(include);
    }
    e.parentNode.removeChild(e);
    cssText += baseURI ?
      resolveCss(e.textContent, baseURI) : e.textContent;
  }
  return cssText;
}

export function cssFromModuleImports(moduleId) {
  let m = importModule(moduleId);
  return m ? _cssFromModuleImports(m) : '';
}

export function _cssFromModuleImports(module) {
  let cssText = '';
  let p$ = module.querySelectorAll(MODULE_STYLE_LINK_SELECTOR);
  for (let i=0; i < p$.length; i++) {
    let p = p$[i];
    if (p.import) {
      let importDoc = p.import;
      // NOTE: polyfill affordance.
      // under the HTMLImports polyfill, there will be no 'body',
      // but the import pseudo-doc can be used directly.
      let container = importDoc.body ? importDoc.body : importDoc;
      cssText +=
        resolveCss(container.textContent,
          importDoc.baseURI);
    }
  }
  return cssText;
}
