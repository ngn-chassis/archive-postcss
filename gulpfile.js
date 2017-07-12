// Build "NGN Chassis Showroom"
'use strict'

// Dependencies ----------------------------------------------------------------
require('ngn')

const autoprefixer = require('gulp-autoprefixer')
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const del = require('del')
const path = require('path')
const pkg = require('./package.json')
const fs = require('fs')
const sourcemaps = require('gulp-sourcemaps')

let chassis = require('./gulp-chassis/index.js')
// const detailer = require('./ngn-chassis-detailer/index.js')

// Paths ------------------------------------------------------------------
const SRC = './src'
const DEST = './showroom'

// CSS ------------------------------------------------------------------------
gulp.task('css', () => {
  return gulp.src(SRC + '/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(chassis({
      // basePath: path.resolve('../')
      theme: path.resolve('./theme.css'),
      // legacy: false,
      // customProperties: {},
    	layout: {
    		minWidth: 320,
    		maxWidth: 1600
    	}
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST + '/css'))
})

// Cleanup ---------------------------------------------------------------------
gulp.task('clean', (next) => {
  fs.exists(DEST + '/css', (exists) => {
    exists && del.sync(DEST + '/css')
    next()
  })
})

// Build -----------------------------------------------------------------------
gulp.task('build', ['clean', 'css'])

// Watch -----------------------------------------------------------------------
gulp.task('watch', () => {
  gulp.watch(path.resolve(SRC + '/**/*.css'), ['clean', 'css'])
})

// Dev -------------------------------------------------------------------------
gulp.task('dev', ['build', 'watch'])
