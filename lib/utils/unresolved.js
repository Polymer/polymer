function resolve() {
  document.body.removeAttribute('unresolved');
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  resolve();
} else {
  window.addEventListener('DOMContentLoaded', resolve);
}
