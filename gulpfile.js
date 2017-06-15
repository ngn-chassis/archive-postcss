// Build "NGN Chassis Showroom"
'use strict'

// Dependencies ----------------------------------------------------------------
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const del = require('del')
const path = require('path')
const pkg = require('./package.json')
const fs = require('fs')
const sourcemaps = require('gulp-sourcemaps')
const perfectionist = require('perfectionist')

const chassis = require('./gulp-chassis/index.js')
// const detailer = require('./ngn-chassis-detailer/index.js')

// Paths ------------------------------------------------------------------
const SRC = './src'
const DEST = './showroom'

// CSS ------------------------------------------------------------------------
gulp.task('css', () => {
  return gulp.src(SRC + '/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(chassis({
      layout: {
        breakpoints: '320 small 512 medium 768 large 1024 huge 1440',
        minWidth: 320,
        maxWidth: 1920
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
