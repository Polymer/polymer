module.exports = function(grunt) {
  var os = require('os');
  var browsers = ['Chrome', 'Firefox'];
  if (os.type() === 'Darwin') {
    browsers.push('ChromeCanary');
  }
  if (os.type() === 'Windows_NT') {
    browsers.push('IE');
  }
  grunt.initConfig({
    pkg: '<json:package.json>',
    testacular: {
      options: {
        configFile: "testacular-shadowdom.conf.js",
        keepalive: true,
        singleRun: true
      },
      chrome: {
        options: {
          browsers: ['Chrome']
        }
      },
      chrome_canary: {
        options: {
          browsers: ['ChromeCanary']
        }
      },
      firefox: {
        options: {
          browsers: ['Firefox']
        }
      },
      ie: {
        options: {
          browsers: ['IE']
        }
      }
    },
  });
  grunt.loadNpmTasks('grunt-testacular');
}
