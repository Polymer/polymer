/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
module.exports = function(grunt) {
  var readManifest = require('../tools/loader/readManifest.js');
  var Polymer = readManifest('build.json');

  grunt.initConfig({
    'wct-test': {
      local: {
        options: {remote: false},
      },
      remote: {
        options: {remote: true},
      },
    },
    'wct-sauce-tunnel': {
      default: {},
    },
    concat_sourcemap: {
      Polymer: {
        options: {
          sourcesContent: true,
          nonull: true
        },
        files: {
          'build/polymer.concat.js': readManifest('build.json')
        }
      }
    },
    uglify: {
      options: {
        nonull: true
      },
      Polymer: {
        options: {
          beautify: {
            ascii_only: true,
          },
          sourceMap: true,
          sourceMapName: 'build/polymer.js.map',
          sourceMapIncludeSources: true,
          banner: grunt.file.read('banner.txt') + '// @version: <%= buildversion %>'
          //mangle: false, beautify: true, compress: false
        },
        /*files: {
          'build/polymer.js': Polymer
        }*/
        files: {
          'build/polymer.js': 'build/polymer.concat.js'
        }
      }
    },
    audit: {
      polymer: {
        options: {
          repos: [
            '../polymer-expressions',
            '../polymer-gestures',
            '../polymer-dev'
          ]
        },
        files: {
          'build/build.log': 'build/polymer.js'
        }
      }
    },
    'string-replace': {
      polymer: {
        files: {
          'build/polymer-versioned.js': 'src/polymer.js'
        },
        options: {
          replacements: [
            {
              pattern: 'master',
              replacement: '<%= buildversion %>'
            }
          ]
        }
      }
    },
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadTasks('../tools/tasks');
  // plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-concat-sourcemap');
  grunt.loadNpmTasks('grunt-audit');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('web-component-tester');

  grunt.registerTask('stash', 'prepare for testing build', function() {
    grunt.option('force', true);
    grunt.task.run('move:polymer.html:polymer.html.bak');
    grunt.task.run('move:build/polymer.html:polymer.html');
  });
  grunt.registerTask('restore', function() {
    grunt.task.run('move:polymer.html:build/polymer.html');
    grunt.task.run('move:polymer.html.bak:polymer.html');
    grunt.option('force', false);
  });

  grunt.registerTask('default', ['minify']);
  grunt.registerTask('minify', ['concat_sourcemap', 'version', 'string-replace', 'uglify']);
  grunt.registerTask('test', ['wct-test:local']);
  grunt.registerTask('test-remote', ['wct-test:remote']);
  grunt.registerTask('test-build', ['minify', 'stash', 'test', 'restore']);
  grunt.registerTask('test-buildbot', ['test-build']);
  grunt.registerTask('release', function() {
    grunt.option('release', true);
    grunt.task.run('minify');
    grunt.task.run('audit');
  });
};

