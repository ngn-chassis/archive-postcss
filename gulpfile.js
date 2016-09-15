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

var ChassisProject = require('./chassis-postcss.js')

var CHASSIS = new ChassisProject()
var CHASSIS_FUNCTIONS = {
  getUiGutter: CHASSIS.getUiGutter,
  getUiMinWidth: CHASSIS.getUiMinWidth,
  getUiMaxWidth: CHASSIS.getUiMaxWidth,
  getViewportWidthRange: CHASSIS.getViewportWidthRange
}

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
      require('autoprefixer'), 
      require('precss'),
      require('postcss-functions')({
        functions: CHASSIS_FUNCTIONS
      })
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
