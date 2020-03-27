/* eslint-disable */
/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

'use strict';

const {dest, parallel, src, watch} = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

const build = parallel(copyPython, copyHtml, copyStyles, copyAssets, bundle);

/**
 * Moves source python files into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function copyPython() {
  return src('src/**/*.py')
      .pipe(dest('dist'));
};

/**
 * Moves source html files into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function copyHtml() {
  return src('src/**/*.html')
      .pipe(dest('dist'));
};

/**
 * Moves source css files into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function copyStyles() {
  return src('src/static/styles/**/*.css')
      .pipe(dest('dist/static/styles'));
};

/**
 * Moves source asset files into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function copyAssets() {
  return src('src/static/assets/**')
      .pipe(dest('dist/static/assets'));
};

/**
 * Bundles all source typescript files into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function bundle() {
  return browserify()
      .add('src/static/scripts/main.ts')
      .plugin(tsify)
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(dest('dist/static/scripts'));
};

exports.default = build;
