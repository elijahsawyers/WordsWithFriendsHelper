/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */
'use strict';

const {dest, parallel, src, watch} = require('gulp');
const connect = require('gulp-connect');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

const watchedBrowserify = watchify(browserify()
    .add('src/scripts/main.ts')
    .plugin(tsify));

const build = parallel(copyHtml, copyStyles, copyAssets, bundle);

function startServer() {
    connect.server({
        root: './dist',
        livereload: true
    })
};

function copyHtml() {
    return src('src/**/*.html')
        .pipe(dest('dist'));
};

function copyStyles() {
    return src('src/styles/**/*.css')
        .pipe(dest('dist/styles'));
};

function copyAssets() {
    return src('src/assets/**')
        .pipe(dest('dist/assets'));
};

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(dest('dist'));
};

exports.build = build;
exports.connect = startServer;
exports.default = () => {
    watch('src/**/*.html', { ignoreInitial: false }, copyHtml);
    watch('src/styles/**/*.css', { ignoreInitial: false }, copyStyles);
    watch('src/assets/**', { ignoreInitial: false }, copyAssets);
    watch('src/scripts/**/*.ts', { ignoreInitial: false }, bundle);
    startServer();
};