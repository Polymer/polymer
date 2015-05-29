module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
			},
			dist: {
				files: {
					'Promise.min.uglify.js': ['Promise.js']
				}
			}
		},

    closurecompiler: {
      options: {
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
      },
      dist: {
        files: {
          'Promise.min.js': ['Promise.js']
        }
      }
    },

    bytesize: {
      dist: {
        src: ['Promise*.js']
      }
    }
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-closurecompiler');
	grunt.loadNpmTasks('grunt-bytesize');

	grunt.registerTask('build', ['closurecompiler', 'bytesize']);
};
