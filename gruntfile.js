/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  Platform = [
    'platform/platform.min.js'
  ];
  
  PlatformNative = [
    'platform/platform.native.min.js'
  ];

  PlatformSandbox = [
    'platform/platform.sandbox.min.js'
  ];
  
  Polymer = [
    'src/lang.js',
    'src/oop.js',
    'src/register.js',
    'src/base.js',
    'src/trackObservers.js',
    'src/bindProperties.js',
    'src/bindMDV.js',
    'src/polymerSyntaxMDV.js',
    'src/attrs.js',
    'src/marshal.js',
    'src/events.js',
    'src/observeProperties.js',
    'src/styling.js',
    'src/shimStyling.js',
    'src/path.js',
    'src/job.js',
    'src/boot.js'
  ];

  // karma setup
  var browsers;
  (function() {
    try {
      var config = grunt.file.readJSON('local.json');
      if (config.browsers) {
        browsers = config.browsers;
      }
    } catch (e) {
      var os = require('os');
      browsers = ['Chrome', 'Firefox'];
      //browsers = ['Chrome'];
      if (os.type() === 'Darwin') {
        browsers.push('ChromeCanary');
      }
      if (os.type() === 'Windows_NT') {
        browsers.push('IE');
      }
    }
  })();
  
  grunt.initConfig({
    karma: {
      options: {
        configFile: 'conf/karma.conf.js',
        keepalive: true
      },
      browserstack: {
        browsers: ["BrowserStack:IE:Win"]
      },
      buildbot: {
        browsers: browsers,
        reporters: ['crbot'],
        logLevel: 'OFF'
      },
      polymer: {
        browsers: browsers
      }
    },
    uglify: {
      options: {
        banner: '/* Copyright 2013 The Polymer Authors. All rights reserved. Use of this source code is governed by a BSD-style license that can be found in the LICENSE file. */\n'
      },
      Polymer: {
        options: {
          sourceMap: 'polymer.min.js.map'
        },
        files: {
          'polymer.min.js': [].concat(Platform, Polymer)
        }
      },
      PolymerNative: {
        options: {
          sourceMap: 'polymer.native.min.js.map'
        },
        files: {
          'polymer.native.min.js': [].concat(PlatformNative, Polymer)
        }
      },
      PolymerSandbox: {
        options: {
          sourceMap: 'polymer.sandbox.min.js.map',
          mangle: false,
          beautify: true,
          compress: false
        },
        files: {
          'polymer.sandbox.min.js': [].concat(PlatformSandbox, Polymer)
        }
      }
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          exclude: 'third_party',
          extension: '.js,.html',
          paths: '.',
          outdir: 'docs',
          linkNatives: 'true',
          tabtospace: 2,
          themedir: '../docs/doc_themes/bootstrap'
        }
      }
    },
    pkg: grunt.file.readJSON('package.json')
  });

  // plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-karma-0.9.1');

  // tasks
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('minify', ['uglify']);
  grunt.registerTask('docs', ['yuidoc']);
  grunt.registerTask('test', ['karma:polymer']);
  grunt.registerTask('test-buildbot', ['karma:buildbot']);
};

