var gulp = require('gulp');
var del = require('del');
var browserify = require('browserify');
var reactify = require('reactify');
var shell = require('gulp-shell');
var $ = require('gulp-load-plugins');

var paths = {
  scripts: ['./client/js/**/*.js'],
  html: ['public/**/*.html'],
  server: ['server/**/*.js'],
  test: ['specs/**/*.js']
};

gulp.task('clean', function () {
  del([
    'dist/js/**/*'
    ]);
});

gulp.task('compile', function () {
  var b = browserify();
  b.transform(reactify);
  b.add('./client/js/main.js');
  return b.bundle()
    .pipe(gulp.src('main.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy', function() {
  gulp.src('client/*.html')
    .pipe(gulp.dest('dist'));
  gulp.src('client/css/*.css')
    .pipe(gulp.dest('dist/css'));
  gulp.src('client/assets/*.*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('watch', function() {
  gulp.watch('client/**/*', ['build']);
});

gulp.task('run', shell.task ([
  'nodemon server.js'
]));

gulp.task('build', ['clean', 'compile', 'copy']);
gulp.task('default', ['build', 'watch', 'run']);
