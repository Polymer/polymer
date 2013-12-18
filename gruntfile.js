/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  var readManifest = require('../tools/loader/readManifest.js');
  var Polymer = readManifest('build.json');

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
          'build/polymer.concat.js': Polymer
        }
      }
    },
    uglify: {
      options: {
        nonull: true
      },
      Polymer: {
        options: {
          sourceMap: 'build/polymer.js.map',
          sourceMapIn: 'build/polymer.concat.js.map',
          sourceMappingURL: 'polymer.js.map',
          banner: grunt.file.read('LICENSE') + '// @version: <%= buildversion %>'
          //mangle: false, beautify: true, compress: false
        },
        files: {
          'build/polymer.js': 'build/polymer.concat.js'
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
            '.'
          ]
        },
        files: {
          'build/build.log': 'build/polymer.js'
        }
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

  grunt.registerTask('stash', 'prepare for testing build', function() {
    grunt.option('force', true);
    grunt.task.run('move:polymer.js:polymer.js.bak');
    grunt.task.run('move:build/polymer.js:polymer.js');
  });
  grunt.registerTask('restore', function() {
    grunt.task.run('move:polymer.js:build/polymer.js');
    grunt.task.run('move:polymer.js.bak:polymer.js');
    grunt.option('force', false);
  });

  grunt.registerTask('test-build', ['minify', 'stash', 'test', 'restore']);

  grunt.registerTask('default', ['minify', 'audit']);
  grunt.registerTask('minify', ['concat_sourcemap', 'version', 'uglify', 'sourcemap_copy:build/polymer.concat.js.map:build/polymer.js.map']);
  grunt.registerTask('docs', ['yuidoc']);
  grunt.registerTask('test', ['override-chrome-launcher', 'karma:polymer']);
  grunt.registerTask('test-buildbot', ['override-chrome-launcher', 'karma:buildbot', 'minify', 'stash', 'karma:buildbot', 'restore']);
};

