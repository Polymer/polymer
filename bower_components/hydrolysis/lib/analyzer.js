/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// jshint node: true
'use strict';
// jshint -W079
var Promise = global.Promise || require('es6-promise').Promise;
require("setimmediate");
// jshint +W079

var dom5 = require('dom5');
var jsParse = require('./ast-utils/js-parse');
var importParse = require('./ast-utils/import-parse');
var url = require('url');

function reduceMetadata(m1, m2) {
  return {
    elements: m1.elements.concat(m2.elements),
    features: m1.features.concat(m2.features),
  };
}

var EMPTY_METADATA = {elements: [], features: []};

/**
* Parse5's representation of a parsed html document
* @typedef {Object} DocumentAST
*/

/**
* The metadata for a single polymer element
* @typedef {Object} ElementDescriptor
*/

/**
* The metadata for a Polymer feature.
* @typedef {Object} FeatureDescriptor
*/

/**
 * The metadata for all features and elements defined in one document
 * @typedef {Object} DocumentDescriptor
 * @property {Array<ElementDescriptor>} elements The elements from the document
 * @property {Array<FeatureDescriptor>}  features The features from the document
 */

/**
* The metadata of an entire HTML document, in promises.
* @typedef {Object} AnalyzedDocument
* @property {string} href The url of the document.
* @property {Promise<ParsedImport>}  htmlLoaded The parsed representation of
*                                                the doc. Use the `ast`
*                                                property to get the full
*                                                `parse5` ast
*
* @property {Promise<Array<string>>} depsLoaded Resolves to the list of this
*                                                 Document's import
*                                                 dependencies
*
* @property {Promise<DocumentDescriptor>} metadataLoaded Resolves to the list of
*                                                         this Document's import
*                                                         dependencies
*/

/**
* A database of polymer elements and features defined in HTML
*
* @param  {boolean} attachAST  If true, attach a parse5 compliant AST
* @param  {FileLoader=} loader An optional `FileLoader` used to load external
*                              resources
*/
var Analyzer = function Analyzer(attachAST,
                                 loader) {
  this.attachAST = attachAST;
  this.loader = loader;

  /**
   * Elements by tag name.
   * @type {Object<string,ElementDescriptor>}
   */
  this.elements = {};

  /** @type {Array<FeatureDescriptor>} */
  this.features = [];

  /**
   * A map, keyed by absolute path, of Document metadata.
   * @type {Object<string,AnalyzedDocument>}
   */
  this.html = {};
};

Analyzer.prototype.load = function load(href) {
  return this.loader.request(href).then(function(content) {
    return new Promise(function(resolve, reject) {
      setImmediate(function() {
        resolve(this._parseHTML(content, href));
      }.bind(this));
    }.bind(this));
  }.bind(this));
};

/**
 * Returns an `AnalyzedDocument` representing the provided document
 * @param  {string} htmlImport Raw text of an HTML document
 * @param  {string} href       The document's URL.
 * @return {AnalyzedDocument}       An  `AnalyzedDocument`
 */
Analyzer.prototype._parseHTML = function _parseHTML(htmlImport,
                                                  href) {
  if (href in this.html) {
    return this.html[href];
  }
  var depsLoaded = [];
  var depHrefs = [];
  var metadataLoaded = Promise.resolve(EMPTY_METADATA);
  var parsed;

  try {
    parsed = importParse(htmlImport);
  } catch (err) {
    console.log(err);
    console.log('Error parsing!');
    throw err;
  }
  var htmlLoaded = Promise.resolve(parsed);
  if (parsed.script) {
    metadataLoaded = this._processScripts(parsed.script, href);
    depsLoaded.push(metadataLoaded);
  }

  if (this.loader) {
    var baseUri = href;
    if (parsed.base.length > 1) {
      console.error("Only one base tag per document!");
      throw "Multiple base tags in " + href;
    } else if (parsed.base.length == 1) {
      var baseHref = dom5.getAttribute(parsed.base[0], "href");
      if (baseHref) {
        baseHref = baseHref + "/";
        baseUri = url.resolve(baseUri, baseHref);
      }
    }
    parsed.import.forEach(function(link) {
      var linkurl = dom5.getAttribute(link, 'href');
      if (linkurl) {
        var resolvedUrl = url.resolve(baseUri, linkurl);
        depHrefs.push(resolvedUrl);
        var dep = this.load(resolvedUrl).then(function(monomer) {
          return monomer.depsLoaded;
        }.bind(this));
        depsLoaded.push(dep);
      }
    }.bind(this));
  }
  depsLoaded = Promise.all(depsLoaded)
        .then(function() {return depHrefs;})
        .catch(function(err) {throw err;});
  this.html[href] = {
      href: href,
      htmlLoaded: htmlLoaded,
      metadataLoaded: metadataLoaded,
      depsLoaded: depsLoaded
  };
  return this.html[href];
};

Analyzer.prototype._processScripts = function _processScripts(scripts, href) {
  var scriptPromises = [];
  scripts.forEach(function(script) {
    scriptPromises.push(this._processScript(script, href));
  }.bind(this));
  return Promise.all(scriptPromises).then(function(metadataList) {
    return metadataList.reduce(reduceMetadata, EMPTY_METADATA);
  });
};

Analyzer.prototype._processScript = function _processScript(script, href) {
  var src = dom5.getAttribute(script, 'src');
  var parsedJs;
  if (!src) {
    parsedJs = jsParse(script.childNodes[0].value, this.attachAST);
    if (parsedJs.elements) {
      parsedJs.elements.forEach(function(element) {
        if (element.is in this.elements) {
          throw new Error('Duplicate element definition: ' + element.is);
        } else {
          this.elements[element.is] = element;
        }
      }.bind(this));
    }
    if (parsedJs.features) {
      this.features = this.features.concat(parsedJs.features);
    }
    return parsedJs;
  }
  if (this.loader) {
    var resolvedSrc = url.resolve(href, src);
    return this.loader.request(resolvedSrc).then(function(content) {
      var resolvedScript = Object.create(script);
      resolvedScript.childNodes = [{value: content}];
      resolvedScript.attrs = resolvedScript.attrs.slice();
      dom5.removeAttribute(resolvedScript, 'src');
      return this._processScript(resolvedScript, href);
    }.bind(this)).catch(function(err) {throw err;});
  } else {
    return Promise.resolve(EMPTY_METADATA);
  }
};

/**
 * Returns a promise that resolves to a POJO representation of the import
 * tree.
 */
Analyzer.prototype.metadataTree = function metadataTree(href) {
  return this.load(href).then(function(monomer){
    var loadedHrefs = {};
    loadedHrefs[href] = true;
    return this._metadataTree(monomer, loadedHrefs);
  }.bind(this));
};

Analyzer.prototype._metadataTree = function _metadataTree(htmlMonomer,
                                                          loadedHrefs) {
  if (loadedHrefs === undefined) {
    loadedHrefs = {};
  }
  return htmlMonomer.metadataLoaded.then(function(metadata) {
    metadata = {
      elements: metadata.elements,
      features: metadata.features,
      href: htmlMonomer.href
    };
    return htmlMonomer.depsLoaded.then(function(hrefs) {
      var depMetadata = [];
      hrefs.forEach(function(href) {
        if (!loadedHrefs[href]) {
          loadedHrefs[href] = true;
          var metadataPromise = Promise.resolve(true);
          if (depMetadata.length > 0) {
            metadataPromise = depMetadata[depMetadata.length - 1];
          }
          metadataPromise = metadataPromise.then(function() {
            return this._metadataTree(this.html[href], loadedHrefs);
          }.bind(this));
          depMetadata.push(metadataPromise);
        } else {
          depMetadata.push(Promise.resolve({}));
        }
      }.bind(this));
      return Promise.all(depMetadata).then(function(importMetadata) {
        metadata.imports = importMetadata;
        return htmlMonomer.htmlLoaded.then(function(parsedHtml) {
          metadata.html = parsedHtml;
          if (metadata.elements) {
            metadata.elements.forEach(function(element) {
              attachDomModule(parsedHtml, element);
            });
          }
          return metadata;
        });
      });
    }.bind(this));
  }.bind(this));
};

function attachDomModule(parsedImport, element) {
  var domModules = parsedImport['dom-module'];
  for (var i = 0, domModule; i < domModules.length; i++) {
    domModule = domModules[i];
    if (dom5.getAttribute(domModule, 'id') === element.is) {
      element.domModule = domModule;
      return;
    }
  }
}

module.exports = Analyzer;
