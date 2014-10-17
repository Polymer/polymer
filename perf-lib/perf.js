// x-browser compat.
if (!window.performance) {
  var start = Date.now();
  // only at millisecond precision
  window.performance = {now: function(){ return Date.now() - start }};
}

console.perf = function() {
  if (console.timeline) {
    console.timeline();
  }
  console.profile();
  console.perf.time = performance.now();  
};

console.perfEnd = function() {
  // force layout
  document.body.offsetWidth;
  var time = performance.now() - console.perf.time;
  console.profileEnd();
  document.title += ' (' + time.toFixed(1) + 'ms)';
  if (window.top !== window) {
    window.top.postMessage(time + 'ms', '*');
  }
};
