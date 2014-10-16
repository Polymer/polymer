console.perf = function() {
  console.timeline();
  console.profile();
  console.perf.time = Date.now();  
};

console.perfEnd = function() {
  // force layout
  document.body.offsetWidth;
  var time = (Date.now() - console.perf.time) + 'ms';
  console.profileEnd();
  document.title += ' (' + time + ')';
  if (window.top !== window) {
    window.top.postMessage(time, '*');
  }
};
