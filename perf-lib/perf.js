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
  if (window.WebComponents) {
    // TODO(sjmiles): we need some kind of 'whenReady' or other signal
    // that will work if this function is called after the event has fired
    addEventListener('WebComponentsReady', function() {
      console._perfEnd();
    });    
  } else {
    console._perfEnd();
  }
};

console._perfEnd = function() {
  // force layout
  document.body.offsetWidth;
  var time = performance.now() - console.perf.time;
  console.profileEnd();
  if (console.timeline) {
    console.timelineEnd();
  }
  document.title = time.toFixed(1) + 'ms: ' + document.title;
  if (window.top !== window) {
    window.top.postMessage(time + 'ms', '*');
  }
};
