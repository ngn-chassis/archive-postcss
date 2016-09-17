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
// var wrench = require('wrench')
// var header = require('gulp-header')
// var headerComment = '/**\n  * v' + pkg.version + ' generated on: ' + (new Date()) + '\n  * Copyright (c) 2014-' + (new Date()).getFullYear() + ', Ecor Ventures LLC. All Rights Reserved.\n  */\n'

// var ChassisProject = require('./chassis-postcss.js')

var chassis = require('./postcss-ngn-chassis/index.js')

// var CHASSIS = new ChassisProject()
// var CHASSIS_FUNCTIONS = {
//   getLayoutGutter: CHASSIS.getLayoutGutter,
//   getLayoutMinWidth: CHASSIS.getLayoutMinWidth,
//   getLayoutMaxWidth: CHASSIS.getLayoutMaxWidth,
//   getViewportWidthBound: CHASSIS.getViewportWidthBound,
//   getMediaQueryValue: CHASSIS.getMediaQueryValue,
//   getViewportWidthRangesList: CHASSIS.getViewportWidthRangesList,
//   getNumViewportWidthRanges: CHASSIS.getNumViewportWidthRanges,
//   getViewportWidthRangeName: CHASSIS.getViewportWidthRangeName,
//   getUnit: CHASSIS.getUnit,
//   warn: CHASSIS.warn
// }

// Sass Paths ------------------------------------------------------------------
var SOURCE = {
  CHASSIS: './chassis'
}

var DEST = './showroom'

// CSS ------------------------------------------------------------------------
gulp.task('css', function () {
  return gulp.src(SOURCE.CHASSIS + '/**/*.css')
    .pipe( sourcemaps.init() )
    .pipe( postcss([
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
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest(DEST + '/css') );
})

// Cleanup ---------------------------------------------------------------------
gulp.task('clean', function (next) {
  fs.exists(DEST + '/css', function (exists) {
    exists && del.sync(DEST + '/css')
    next()
  })
})

// gulp.task('make', function () {
//   // Recreate dist directory
//   if (fs.existsSync(DIST)) {
//     del.sync(DIST)
//   }
//   // fs.mkdirSync(DIST)
//
//   wrench.copyDirSyncRecursive(SOURCE, DIST, {
//     forceDelete: true, // Whether to overwrite existing directory or not
//     excludeHiddenUnix: false, // Whether to copy hidden Unix files or not (preceding .)
//     preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
//     preserveTimestamps: true, // Preserve the mtime and atime when copying files
//     inflateSymlinks: true // Whether to follow symlinks or not when copying files
//   })
// })

// Build -----------------------------------------------------------------------
gulp.task('build', ['clean', 'css'])

// Watch -----------------------------------------------------------------------
gulp.task('watch', function () {
  gulp.watch(path.resolve(SOURCE.CHASSIS + '/**/*.css'), ['clean', 'css'])
})

// Dev -------------------------------------------------------------------------
gulp.task('dev', ['build', 'watch'])
