// Testacular configuration
// Generated on Wed Feb 20 2013 11:13:59 GMT-0800 (PST)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  'third_party/expect.js/expect.js',
  {pattern: 'platform/**/!(platform).js', included: false},
  {pattern: 'components/*.html', included: false},
  {pattern: 'test/*.html', included: false},
  'platform/platform.js',
  'test/setup.js',
  'test/!(setup).js'
];


// list of files to exclude
exclude = [
  'platform/PointerGestures/**/expect.js/**',
  'platform/**/test/**',
  'platform/**/smokeTests/**'
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
logLevel = LOG_DEBUG;


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
