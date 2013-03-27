/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  Toolkit = [
    'src/lang.js',
    'src/oop.js',
    'src/register.js',
    'src/bindProperties.js',
    'src/bindMDV.js',
    'src/attrs.js',
    'src/marshal.js',
    'src/events.js',
    'src/observeProperties.js',
    'src/styling.js',
    'src/path.js',
    'src/boot.js'
  ];
  grunt.initConfig({
    uglify: {
      Toolkit: {
        options: {
        },
        files: {
          'toolkit.min.js': Toolkit
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
          paths: '.',
          outdir: 'docs',
          linkNatives: 'true',
          tabtospace: 2,
          themedir: '../docs/doc_themes/simple'
        }
      }
    },
    pkg: grunt.file.readJSON('package.json')
  });

  // plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');

  // tasks
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('minify', ['uglify']);
  grunt.registerTask('docs', ['yuidoc']);
};

