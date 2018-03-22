import './boot.js';

// run a callback when HTMLImports are ready or immediately if
// this api is not available.
function whenImportsReady(cb) {
  if (window.HTMLImports) {
    HTMLImports.whenReady(cb);
  } else {
    cb();
  }
}

export const importHref = function(href, onload, onerror, optAsync) {
  let link = /** @type {HTMLLinkElement} */
    (document.head.querySelector('link[href="' + href + '"][import-href]'));
  if (!link) {
    link = /** @type {HTMLLinkElement} */ (document.createElement('link'));
    link.rel = 'import';
    link.href = href;
    link.setAttribute('import-href', '');
  }
  // always ensure link has `async` attribute if user specified one,
  // even if it was previously not async. This is considered less confusing.
  if (optAsync) {
    link.setAttribute('async', '');
  }
  // NOTE: the link may now be in 3 states: (1) pending insertion,
  // (2) inflight, (3) already loaded. In each case, we need to add
  // event listeners to process callbacks.
  let cleanup = function() {
    link.removeEventListener('load', loadListener);
    link.removeEventListener('error', errorListener);
  };
  let loadListener = function(event) {
    cleanup();
    // In case of a successful load, cache the load event on the link so
    // that it can be used to short-circuit this method in the future when
    // it is called with the same href param.
    link.__dynamicImportLoaded = true;
    if (onload) {
      whenImportsReady(() => {
        onload(event);
      });
    }
  };
  let errorListener = function(event) {
    cleanup();
    // In case of an error, remove the link from the document so that it
    // will be automatically created again the next time `importHref` is
    // called.
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
    if (onerror) {
      whenImportsReady(() => {
        onerror(event);
      });
    }
  };
  link.addEventListener('load', loadListener);
  link.addEventListener('error', errorListener);
  if (link.parentNode == null) {
    document.head.appendChild(link);
  // if the link already loaded, dispatch a fake load event
  // so that listeners are called and get a proper event argument.
  } else if (link.__dynamicImportLoaded) {
    link.dispatchEvent(new Event('load'));
  }
  return link;
};
