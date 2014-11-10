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
  var banner = grunt.file.read('banner.txt') + '// @version <%= buildversion %>\n';

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
    copy: {
      Polymer: {
        src: ['layout.html', 'bower.json', 'README.md'],
        dest: 'dist/'
      }
    },
    concat: {
      Polymer: {
        options: {
          nonull: true,
          banner: banner,
          stripBanners: true
        },
        files: {
          'dist/polymer.js': readManifest('build.json')
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
          banner: banner
        },
        files: {
          'dist/polymer.min.js': 'dist/polymer.js'
        }
      }
    },
    audit: {
      polymer: {
        options: {
          repos: [
            '../polymer-expressions',
            '../polymer-gestures',
            '../polymer'
          ]
        },
        files: {
          'dist/build.log': ['dist/polymer.js', 'dist/polymer.min.js', 'dist/layout.html']
        }
      }
    },
    'string-replace': {
      polymer: {
        files: {
          'dist/polymer-versioned.js': 'src/polymer.js'
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-audit');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('web-component-tester');

  grunt.registerTask('default', ['minify']);
  grunt.registerTask('minify', ['version', 'string-replace', 'concat', 'uglify', 'copy', 'clean-bower', 'audit']);
  grunt.registerTask('test', ['wct-test:local']);
  grunt.registerTask('test-remote', ['wct-test:remote']);
  grunt.registerTask('test-buildbot', ['test']);
  grunt.registerTask('release', function() {
    grunt.option('release', true);
    grunt.task.run('minify');
  });

  grunt.registerTask('clean-bower', function() {
    var config = grunt.file.readJSON('./dist/bower.json');
    delete config.dependencies['polymer-expressions'];
    delete config.dependencies['polymer-gestures'];
    delete config.dependencies.URL;
    grunt.file.write('./dist/bower.json', JSON.stringify(config, null, 2));
  });
};
