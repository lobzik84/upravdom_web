/* eslint-env node */
const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const concat = require('gulp-concat');
const uglifyjs = require('gulp-uglifyjs');
const streamify = require('gulp-streamify');

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const	rename = require('gulp-rename');
const glob = require('glob');

const htmlmin = require('gulp-htmlmin');

const less = require('gulp-less');
const cssmin = require('gulp-cssmin');

const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const path = require('path');

var paths = {
    scripts: [
        'public_html/assets/js/crypto/*.js',
        'public_html/assets/js/crypto/aes/*.js',
        'public_html/assets/js/crypto/rsa/*.js',
        'public_html/assets/js/crypto/srp/*.js',
        'public_html/assets/js/crypto/scrypt/*.js',
        'public_html/assets/js/crypto/keyfile/*.js',
        'node_modules/jquery/dist/jquery.min.js',
        'public_html/assets/js/vendors/chartist.min.js',
        'public_html/assets/js/vendors/chartist-plugin-tooltip.js',
        'public_html/assets/js/vendors/inputmask.js',
        'public_html/assets/js/bundle.js'
    ]
};
// 'public_html/assets/js/src/*.js' - там лежат рудименты

gulp.task('default', ['dev'], function() {
  gulp.watch('public_html/assets/sprite/*.svg', ['svgstore']);
  gulp.watch('public_html/assets/less/**/*.less', ['styles']);
  gulp.watch('public_html/assets/js/modules/**/*.js', ['build']);
	gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(['public_html/assets/index.html','public_html/assets/templates/*'], ['copy-html']);
	gulp.watch('public_html/assets/dist/index.html').on('change', browserSync.reload);

	browserSync.init({
		server: 'public_html/dist'
	});
});

gulp.task('dev', [
	'copy-html',
	'copy-images',
  'copy-fonts',
  'svgstore',
	'styles',
  'build',
  'scripts'
]);

gulp.task('production', [
	'copy-html',
	'copy-images',
  'copy-fonts',
  'svgstore',
	'styles',
  'build',
  'scripts-prod'
]);


gulp.task('build', function() {
  glob('public_html/assets/js/modules/**/*.js', function(err, files) {
    return browserify(files)
      .transform('babelify', {presets: ['es2015']})
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(streamify(uglifyjs()))
      .pipe(gulp.dest('public_html/assets/js/'))
  });
});

gulp.task('scripts', function() {
  const options = {
      compress: {
          global_defs: {
              DEBUG: true
          }
      }
  };
  gulp.src(paths.scripts)
    .pipe(concat('x.min.js'))
    .pipe(uglifyjs(options))
    .pipe(gulp.dest('public_html/dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('copy-html', function() {
	gulp.src(['public_html/assets/index.html','public_html/assets/templates/*'])
    .pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('public_html/dist'))
    .pipe(browserSync.stream());
});

gulp.task('copy-fonts', function() {
	gulp.src('public_html/assets/fonts/*')
		.pipe(gulp.dest('public_html/dist/fonts'));
});

gulp.task('copy-images', function() {
	gulp.src('public_html/assets/img/*')
		.pipe(gulp.dest('public_html/dist/img'));
});

gulp.task('styles', function() {
	gulp.src('public_html/assets/less/*.less')
		.pipe(less())
    .pipe(concat('style.css'))
    .pipe(cssmin())
		.pipe(gulp.dest('public_html/dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('svgstore', function () {
  return gulp
      .src('public_html/assets/sprite/*.svg')
      .pipe(cheerio({
          run: function ($) {
              $('[fill]').removeAttr('fill');
          },
          parserOptions: { xmlMode: true }
      }))
      .pipe(svgmin(function (file) {
          var prefix = path.basename(file.relative, path.extname(file.relative));
          return {
              plugins: [{
                  cleanupIDs: {
                      prefix: prefix + '-',
                      minify: true
                  }
              }]
          }
      }))
      .pipe(svgstore())
      .pipe(gulp.dest('public_html/dist'));
});



gulp.task('scripts-prod', function() {
  const options = {
      compress: {
          dead_code: true,
          properties: true,
          global_defs: {
              DEBUG: false
          }
      }
  };
  gulp.src(paths.scripts)
    .pipe(concat('x.min.js'))
    .pipe(uglifyjs(options))
    .pipe(gulp.dest('public_html/dist/js'));
});
