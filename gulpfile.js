var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var babel = require('gulp-babel');
var minify = require('gulp-minify');

function css_style(done) {
	gulp.src('./_dev/css/style.scss')
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./'));
	done();
}

function scripts(done) {
	gulp.src('./_dev/js/*.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(minify({
			noSource: true,
		}))
		.pipe(gulp.dest('./js'));
	done();
}

function watchFiles() {
	gulp.watch('./_dev/**/*.scss', css_style);
	gulp.watch('./_dev/js/*.js', scripts);
}

gulp.task('default', watchFiles);
