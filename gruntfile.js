/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  Platform = [
    '../platform/platform.min.js'
  ];
  
  PlatformNative = [
    '../platform/platform.native.min.js'
  ];

  PlatformSandbox = [
    '../platform/platform.sandbox.min.js'
  ];
  
  Polymer = [
    "polymer.js",
    "boot.js",
    "shimStyling.js",
    "lib/lang.js",
    "lib/dom.js",
    "lib/deserialize.js",
    "lib/job.js",
    "lib/super.js",
    "api.js",
    "instance/utils.js",
    "instance/events.js",
    "instance/properties.js",
    "instance/attributes.js",
    "instance/mdv.js",
    "instance/base.js",
    "instance/styles.js",
    "declaration/path.js",
    "declaration/styles.js",
    "declaration/events.js",
    "declaration/properties.js",
    "declaration/attributes.js",
    "declaration/polymer-element.js"
  ].map(function(n) {
    return "src/" + n;
  });

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
        banner: grunt.file.read('LICENSE'),
        nonull: true
      },
      Polymer: {
        options: {
          sourceMap: 'polymer.min.js.map',
          //mangle: false, beautify: true, compress: false
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
          //mangle: false, beautify: true, compress: false
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
    audit: {
      polymer: {
        options: {
          repos: [
            '.',
            '../platform',
            '../ShadowDOM',
            '../HTMLImports',
            '../CustomElements',
            '../PointerEvents',
            '../PointerGestures',
            '../mdv'
          ]
        },
        dest: 'build.log',
        src: [
          'polymer.min.js',
          'polymer.native.min.js',
          'polymer.sandbox.min.js'
        ]
      }
    },
    pkg: grunt.file.readJSON('package.json')
  });

  // plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-audit');

  // tasks
  grunt.registerTask('default', ['uglify', 'audit']);
  grunt.registerTask('minify', ['uglify']);
  grunt.registerTask('docs', ['yuidoc']);
  grunt.registerTask('test', ['karma:polymer']);
  grunt.registerTask('test-buildbot', ['karma:buildbot']);
};

