var gulp = require('gulp');
var del = require('del');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var shell = require('gulp-shell');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');

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

gulp.task('compile', ['lint-client'], function () {
  var b = browserify();
  b.transform(reactify);
  b.add('./client/js/main.js');
  return b.bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(livereload());
});

gulp.task('lint-client', function () {
  return gulp.src([
    './client/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint-server', function () {
  return gulp.src([
    './*.js',
    './server/**/*.js',
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('less', function () {
  return gulp.src('./client/less/main.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'))
    .pipe(livereload());
});

gulp.task('html', function () {
  return gulp.src('./client/**/*.html')
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

gulp.task('watch', ['build'], function () {
  livereload.listen();
  gulp.watch('./client/*.html', ['html']);
  gulp.watch('./client/css/**/*.css', ['css']);
  gulp.watch('./client/assets/*.*', ['assets']);
  gulp.watch('./client/less/**/*.less', ['less']);
  gulp.watch('./client/js/**/*.js', ['lint-client', 'compile']);
  gulp.watch(['./*.js', './server/*.js'], ['lint-server']);
});

gulp.task('run', ['build'], function () {
  nodemon({
    script: 'server.js',
    env: { 'NODE_ENV': 'test' },
    ext: 'js',
    ignore: [
      'gulpfile.js',
      'client/**/*.js',
      'dist/**/*.js'
    ]
  });
});

gulp.task('lint', ['lint-server', 'lint-client']);

gulp.task('build', ['clean', 'compile', 'lint', 'assets', 'less', 'css', 'html']);

gulp.task('default', ['build', 'watch', 'run']);
