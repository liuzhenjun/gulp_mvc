const gulp = require('gulp');
const sass = require('gulp-sass');

function test(cb) {
  console.log('test 任务');
  cb();
};

function style() {
  console.log('style 任务');
  gulp.src('./src/styles/scss/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('./src/styles/css/'));
};

function dev() {
  gulp.watch('./src/styles/scss/**/*.scss', gulp.series(test, style));
}

gulp.task('dev', dev);

gulp.task('default', gulp.series(test, style));
