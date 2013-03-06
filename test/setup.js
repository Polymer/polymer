mocha.setup({ui: 'tdd'});

// Load components.
components = [
  "test/g-foo.html",
  "components/g-icon.html",
  "components/g-icon-button.html",
  "components/g-selection.html",
  "components/g-selector.html",
  "components/g-togglebutton.html",
  "components/g-menu-item.html",
  "components/g-menu.html",
  "components/g-ajax.html"
];
for (var i = 0, c; c = components[i]; i++) {
  document.write('<link rel="components" href="/base/' + c + '">');
}

// Wait until components are loaded to run tests.
window.__testacular__.loaded = function() {};

window.addEventListener('WebComponentsReady', function() {
  window.__testacular__.start();
});

// Create the DOM used in the tests.
el = document.createElement('div');
el.id = 'work';
document.body.appendChild(el);
