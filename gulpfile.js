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

var chassis = require('./postcss-ngn-chassis/index.js')

// Sass Paths ------------------------------------------------------------------
var SOURCE = {
  CHASSIS: './chassis'
}

var DEST = './showroom'

// CSS ------------------------------------------------------------------------
gulp.task('css', function () {
  return gulp.src(SOURCE.CHASSIS + '/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([
      chassis
      // require('autoprefixer'),
      // require('postcss-partial-import'),
      // require('postcss-mixins'),
      // require('postcss-functions')({
      //   functions: CHASSIS_FUNCTIONS
      // }),
      // require('postcss-at-rules-variables'),
      // require('postcss-advanced-variables'),
      // require('postcss-custom-media'),
      // require('postcss-custom-properties'),
      // require('postcss-media-minmax'),
      // require('postcss-color-function'),
      // require('postcss-nesting'),
      // require('postcss-nested'),
      // require('postcss-custom-selectors'),
      // require('postcss-atroot'),
      // require('postcss-property-lookup'),
      // require('postcss-extend'),
      // require('postcss-selector-matches'),
      // require('postcss-selector-not')
    ]))
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
