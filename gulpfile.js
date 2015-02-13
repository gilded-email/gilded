var gulp = require('gulp');
var del = require('del');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var shell = require('gulp-shell');
var livereload = require('gulp-livereload');

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
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(livereload());
});



gulp.task('copy', function () {
  gulp.src('client/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
  gulp.src('client/assets/*.*')
    .pipe(gulp.dest('dist/assets'))
    .pipe(livereload());
});

gulp.task('html', function () {
  gulp.src('client/css/*.css')
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

gulp.task('css', function () {
  gulp.src('client/css/*.css')
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});


gulp.task('assets', function () {
  gulp.src('client/css/*.css')
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('client/*.html', ['html']);
  gulp.watch('client/css/*', ['css']);
  gulp.watch('client/assets/*.*', ['assets']);
});

gulp.task('run', shell.task ([
  'nodemon server.js'
]));

gulp.task('build', ['clean', 'compile', 'copy']);
gulp.task('default', ['build', 'watch', 'run']);
