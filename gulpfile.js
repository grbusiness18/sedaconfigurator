
'use strict'

// Gulpfile.js 
var gulp = require('gulp')
var nodemon = require('gulp-nodemon')
var jsdoc = require('gulp-jsdoc3')
//var jshint = require('gulp-jshint')
 
// gulp.task('lint', function () {
//   gulp.src('./**/*.js')
//     .pipe(jshint())
// })

gulp.task('doc', function (cb) {
    gulp.src(['README.md', './server/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});
 
gulp.task('default', function () {
  var stream = nodemon({ script: 'app.js'
          , ext: 'js'
          , ignore: ['gulpfile.js']
          , tasks: ['doc'] })
 
  stream
      .on('restart', function () {
        console.log('restarted!')
      })
      .on('crash', function() {
        console.error('Application has crashed!\n')
         stream.emit('restart', 10)  // restart the server in 10 seconds 
      })
})