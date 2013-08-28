/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  var banner = [grunt.file.read('LICENSE'), '// @version ' + grunt.file.readJSON('package.json').version, ''].join(grunt.util.linefeed);

  // recursive module builder
  var path = require('path');
  function readManifest(filename, modules) {
    modules = modules || [];
    var lines = grunt.file.readJSON(filename);
    var dir = path.dirname(filename);
    lines.forEach(function(line) {
      var fullpath = path.join(dir, line);
      if (line.slice(-5) == '.json') {
        // recurse
        readManifest(fullpath, modules);
      } else {
        modules.push(fullpath);
      }
    });
    return modules;
  }

  Polymer = readManifest('build.json');

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
    concat_sourcemap: {
      Polymer: {
        options: {
          sourcesContent: true
        },
        files: {
          'polymer.concat.js': Polymer
        }
      }
    },
    uglify: {
      options: {
        banner: banner,
        nonull: true
      },
      Polymer: {
        options: {
          sourceMap: 'polymer.min.js.map',
          sourceMapIn: 'polymer.concat.js.map'
          //mangle: false, beautify: true, compress: false
        },
        files: {
          'polymer.min.js': 'polymer.concat.js'
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
          themedir: 'tools/doc/themes/bootstrap'
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
            '../polymer-expressions',
            '../observe-js',
            '../NodeBind',
            '../TemplateBinding'
          ]
        },
        dest: 'build.log',
        src: [
          'polymer.min.js',
        ]
      }
    },
    pkg: grunt.file.readJSON('package.json')
  });

  // plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-concat-sourcemap');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-audit');

  // tasks
  grunt.registerTask('sourcemap_copy', 'Copy sourcesContent between sourcemaps', function(source, dest) {
    var sourceMap = grunt.file.readJSON(source);
    var destMap = grunt.file.readJSON(dest);
    destMap.sourcesContent = sourceMap.sourcesContent;
    grunt.file.write(dest, JSON.stringify(destMap));
  });
  grunt.registerTask('default', ['concat_sourcemap', 'uglify', 'sourcemap_copy:polymer.concat.js.map:polymer.min.js.map', 'audit']);
  grunt.registerTask('minify', ['uglify']);
  grunt.registerTask('docs', ['yuidoc']);
  grunt.registerTask('test', ['karma:polymer']);
  grunt.registerTask('test-buildbot', ['karma:buildbot']);
};

