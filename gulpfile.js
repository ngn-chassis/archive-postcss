// Build "NGN Chassis Showroom"
'use strict'

// Dependencies ----------------------------------------------------------------
var gulp = require('gulp')
var postcss = require('gulp-postcss')
var del = require('del')
var path = require('path')
var pkg = require('./package.json')
var fs = require('fs')
var sourcemaps = require('gulp-sourcemaps')

var chassis = require('./gulp-chassis/index.js')
var detailer = require('./ngn-chassis-detailer/index.js')

// Paths ------------------------------------------------------------------
var SOURCE = {
  CHASSIS: './chassis'
}

var DEST = './showroom'

// CSS ------------------------------------------------------------------------
gulp.task('css', function () {
  return gulp.src(SOURCE.CHASSIS + '/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(chassis({
      plugins: [detailer]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST + '/css'))
})

// Cleanup ---------------------------------------------------------------------
gulp.task('clean', function (next) {
  fs.exists(DEST + '/css', function (exists) {
    exists && del.sync(DEST + '/css')
    next()
  })
})

// Build -----------------------------------------------------------------------
gulp.task('build', ['clean', 'css'])

// Watch -----------------------------------------------------------------------
gulp.task('watch', function () {
  gulp.watch(path.resolve(SOURCE.CHASSIS + '/**/*.css'), ['clean', 'css'])
})

// Dev -------------------------------------------------------------------------
gulp.task('dev', ['build', 'watch'])
