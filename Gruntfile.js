module.exports = function(grunt) {
  grunt.initConfig({
    pkg: '<json:package.json>',
    testacular: {
      options: {
        browsers: ['Chrome', 'ChromeCanary', 'Firefox'],
        keepalive: true,
        singleRun: true
      },
      shadowdom: {
        options: {
          configFile: "testacular-shadowdom.conf.js",
        }
      },
      component: {
        options: {
          configFile: "testacular.conf.js",
        }
      }
    },
  });
  grunt.loadNpmTasks('grunt-testacular');
  grunt.registerTask('test', ['testacular']);
}
