module.exports = function(grunt) {
  grunt.initConfig({

    clean: ['dist'],

    ejs: {
      all: {
        options: {
          // site-wide vars here
        },
        src: ['**/*.ejs', '!node_modules/**/*', '!_*/**/*'],
        dest: 'dist/',
        expand: true,
        ext: '.html',
      },
    },

    copy: {
      all: {
        src: ['*.css', '*.html', 'images/**/*', 'img/**/*', '!Gruntfile.js', 'textures/**/*', 'models/**/*', 'src/physijs_worker.js', 'src/ammo.js'],
        dest: 'dist/',
      },
    },

    browserify: {
      all: {
        src: ['src/**/*.js', '!src/physijs_worker.js', '!src/ammo.js'],
        dest: 'dist/app.js'
      },
      options: {
        transform: [['babelify', {presets: ['es2015']}]]
      }
    },

    less: {
      all: {
        src: 'styles/**/*.less',
        dest: 'dist/style.css'
      }
    },

    connect: {
      options: {
        port: process.env.PORT || 3131,
        host: '0.0.0.0',
        hostname: '0.0.0.0',
        base: 'dist/',
      },

      all: {},
    },

    watch: {
      options: {
        livereload: true
      },

      html: {
        files: '<%= ejs.all.src %>',
        tasks: ['ejs'],
      },

      js: {
        files: '<%= browserify.all.src %>',
        tasks: ['browserify'],
      },

      less: {
        files: '<%= less.all.src %>',
        tasks: ['less']
      },

      assets: {
        files: ['assets/**/*', '*.css', 'images/**/*', 'img/**/*', '!Gruntfile.js'],
        tasks: ['copy'],
      }
    },

    'gh-pages': {
      options: {
        base: 'dist/'
      },
      src: ['**/*']
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['clean', 'ejs', 'less', 'browserify', 'copy']);

  grunt.registerTask('server', ['default', 'connect', 'watch']);

  grunt.registerTask('deploy', ['default', 'gh-pages']);

};
