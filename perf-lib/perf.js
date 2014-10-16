console.perf = function() {
  console.timeline();
  console.profile();
  console.perf.time = Date.now();  
}

console.perfEnd = function() {
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        var time = (Date.now() - console.perf.time) + 'ms';
        console.profileEnd();
        document.title += ' (' + time + ')';
        if (window.top !== window) {
          window.top.postMessage(time, '*');
        }
        //console.log('From start to after first paint (?): ' + time);
      });
    });
  });
}
