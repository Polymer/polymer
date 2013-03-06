window.__exported_components_polyfill_scope__ = window;

// Testacular only loads script tags with no attributes so we have to
// just shadowdom.js here for now...
document.write('<script src="/base/platform/ShadowDOM/shadowdom.js" shadow="testing"></script>');

// Create the DOM used in the tests.
el = document.createElement('div');
el.id = 'work';
document.body.appendChild(el);
