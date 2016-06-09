'use strict';

import {argv} from 'yargs';
import autoprefixer from 'autoprefixer';
import del from 'del';
import ghpages from 'gh-pages';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';

const $ = gulpLoadPlugins();
const browserSync = require('browser-sync').create();

const isDist = process.argv.indexOf('serve') === -1;

gulp.task('build', ['js', 'html', 'css', 'fonts', 'images']);

gulp.task('clean', (done) => {
  del('dist', done);
});

gulp.task('clean:html', (done) => {
  del('dist/index.html', done);
});

gulp.task('clean:js', (done) => {
  del('dist/build/build.js', done);
});

gulp.task('clean:css', (done) => {
  del('dist/build/build.css', done);
});

gulp.task('clean:fonts', (done) => {
  del('dist/fonts', done);
});

gulp.task('clean:images', (done) => {
  del('dist/images', done);
});

gulp.task('css', ['clean:css'], () => {
  return gulp.src('src/styles/main.styl')
    .pipe($.if(!isDist, $.plumber()))
    .pipe($.stylus({
      'include css': true,
      'paths': ['./node_modules', './bower_components']
    }))
    .pipe($.autoprefixer('last 2 versions', { map: false }))
    .pipe($.if(isDist, $.csso()))
    .pipe($.rename('build.css'))
    .pipe(gulp.dest('dist/build'));
});

gulp.task('deploy', ['build'], (done) => {
  ghpages.publish(path.join(__dirname, 'dist'), { logger: $.util.log }, done);
});

gulp.task('fonts', ['clean:fonts'],  () => {
  return gulp.src('bower_components/font-awesome/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('html', ['clean:html'], () => {
  return gulp.src('src/index.jade')
    .pipe($.if(!isDist, $.plumber()))
    .pipe($.jade({ pretty: true }))
    .pipe($.rename('index.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', ['clean:images'], () => {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images'));
});

gulp.task('js', ['clean:js'], () => {
  return gulp.src('src/scripts/main.js')
    .pipe($.if(!isDist, $.plumber()))
    .pipe($.browserify({ transform: ['debowerify'], debug: !isDist }))
    .pipe($.if(isDist, $.uglify()))
    .pipe($.rename('build.js'))
    .pipe(gulp.dest('dist/build'));
});

gulp.task('serve', ['build'], () => {
  browserSync.init({
    // tunnel: true,
    // open: false,
    server: ['dist']
  });

  gulp.watch('src/**/*.jade', ['html', browserSync.reload]);
  gulp.watch('src/styles/**/*.styl', ['css']);
  gulp.watch('src/images/**/*', ['images', browserSync.reload]);
  gulp.watch([
    'src/scripts/**/*.js',
    'bespoke-theme-*/dist/*.js' // Allow themes to be developed in parallel
  ], ['js']);
});

gulp.task('default', ['build']);
