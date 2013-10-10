/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  var temporary = require('temporary');
  var tmp = new temporary.File();

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

  var Polymer = readManifest('build.json', [tmp.path]);

  grunt.initConfig({
    karma: {
      options: {
        configFile: 'conf/karma.conf.js',
        keepalive: true
      },
      buildbot: {
        reporters: ['crbot'],
        logLevel: 'OFF'
      },
      polymer: {
      }
    },
    concat_sourcemap: {
      Polymer: {
        options: {
          sourcesContent: true,
          nonull: true
        },
        files: {
          'polymer.concat.js': Polymer
        }
      }
    },
    uglify: {
      options: {
        nonull: true,
        preserveComments: 'some'
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
          themedir: '../tools/doc/themes/bootstrap'
        }
      }
    },
    audit: {
      polymer: {
        options: {
          repos: [
            '.',
            '../platform',
            '../WeakMap',
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

  grunt.loadTasks('../tools/tasks');
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
    destMap.sourcesContent = [];
    var ssources = sourceMap.sources;
    // uglify may reorder sources, make sure sourcesContent matches new order
    destMap.sources.forEach(function(source) {
      var j = ssources.indexOf(source);
      destMap.sourcesContent.push(sourceMap.sourcesContent[j]);
    });
    grunt.file.write(dest, JSON.stringify(destMap));
  });

  // Workaround for banner + sourceMap + uglify: https://github.com/gruntjs/grunt-contrib-uglify/issues/22
  grunt.registerTask('gen_license', function() {
    var banner = [
      '/* @license',
      grunt.file.read('LICENSE'),
      '@version ' + grunt.file.readJSON('package.json').version,
      '*/'
    ].join(grunt.util.linefeed);
    grunt.file.write(tmp.path, banner);
  });

  grunt.registerTask('clean_license', function() {
    tmp.unlinkSync();
  });

  grunt.registerTask('default', ['minify', 'audit']);
  grunt.registerTask('minify', ['gen_license', 'concat_sourcemap', 'uglify', 'sourcemap_copy:polymer.concat.js.map:polymer.min.js.map', 'clean_license']);
  grunt.registerTask('docs', ['yuidoc']);
  grunt.registerTask('test', ['override-chrome-launcher', 'karma:polymer']);
  grunt.registerTask('test-buildbot', ['override-chrome-launcher', 'karma:buildbot']);
};

