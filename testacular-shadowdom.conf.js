// Testacular configuration
// Generated on Wed Feb 20 2013 11:13:59 GMT-0800 (PST)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  'third_party/expect.js/expect.js',
  {pattern: 'platform/lib/lang.js', included: false},
  {pattern: 'platform/ShadowDOM/inspector/*.js', included: false},
  {pattern: 'platform/ShadowDOM/polyfill/*.js', included: false},
  {pattern: 'platform/ShadowDOM/shim/*.js', included: false},
  {pattern: 'platform/ShadowDOM/webkit/*.js', included: false},
  {pattern: 'platform/ShadowDOM/*.js', included: false},
  'platform/ShadowDOM/test/setup.js',
  'platform/ShadowDOM/test/Component.js',
  'platform/ShadowDOM/test/utils.js',
  'platform/ShadowDOM/test/*-*.js'
];


// list of files to exclude
exclude = [
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 8080;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
