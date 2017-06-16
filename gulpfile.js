// Build "NGN Chassis Showroom"
'use strict'

// Dependencies ----------------------------------------------------------------
require('ngn')

const gulp = require('gulp')
const postcss = require('gulp-postcss')
const del = require('del')
const path = require('path')
const pkg = require('./package.json')
const fs = require('fs')
const sourcemaps = require('gulp-sourcemaps')
const perfectionist = require('perfectionist')
const unrequire = require('clear-require')
let chassis = require('./gulp-chassis/index.js')
// const detailer = require('./ngn-chassis-detailer/index.js')

// Paths ------------------------------------------------------------------
const SRC = './ngn-chassis/src'
const DEST = './showroom'

// CSS ------------------------------------------------------------------------
gulp.task('css', () => {

  unrequire('./gulp-chassis/index.js')

  chassis = require('./gulp-chassis/index.js')

  return gulp.src(SRC + '/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(chassis({
      layout: {
        minWidth: 320,
        maxWidth: 1440
      },
      theme: {
        typography: {
          'font-family': 'Arial'
        }
      }
    }))
    .pipe(postcss([perfectionist]))
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
  gulp.watch(path.resolve(`${process.cwd()}/${SRC}/**/*.css`), ['build'])
  gulp.watch(path.resolve(`${process.cwd()}/${SRC}/**/*.js`), ['build'])
})

// Dev -------------------------------------------------------------------------
gulp.task('dev', ['build', 'watch'])
