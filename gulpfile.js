var gulp = require('gulp');
var del = require('del');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var less = require('gulp-less');

var shell = require('gulp-shell');

var livereload = require('gulp-livereload');

var paths = {
  scripts: ['./client/js/**/*.js'],
  html: ['public/**/*.html'],
  server: ['server/**/*.js'],
  test: ['specs/**/*.js']
};

gulp.task('clean', function () {
  del.sync([
    './dist/assets',
    './dist/css',
    './dist/js',
    './dist/*.html'
    ]);
});

gulp.task('compile', function () {
  var b = browserify();
  b.transform(reactify);
  b.add('./client/js/main.js');
  return b.bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(livereload());
});

gulp.task('less', function() {
  return gulp.src('./client/less/main.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'))
    .pipe(livereload());
});

gulp.task('html', function () {
  return gulp.src('./client/*.html')
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload());
});

gulp.task('css', function () {
  return gulp.src('./client/css/*.css')
    .pipe(gulp.dest('./dist/css'))
    .pipe(livereload());
});


gulp.task('assets', function () {
  return gulp.src('./client/assets/*')
    .pipe(gulp.dest('./dist/assets'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./client/js/**/*.js', ['compile']);
  gulp.watch('./client/*.html', ['html']);
  gulp.watch('./client/css/**/*.css', ['css']);
  gulp.watch('./client/assets/*.*', ['assets']);
  gulp.watch('./client/less/**/*.less', ['less']);
});

gulp.task('run', ['build', 'compile'], shell.task ([
  'nodemon server.js'
]));

gulp.task('build', ['clean', 'compile', 'assets', 'less', 'css', 'html']);
gulp.task('default', ['build', 'watch', 'run']);
