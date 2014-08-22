var gulp       = require('gulp');
    gutil      = require('gulp-util')
    watch      = require('gulp-watch');
    merge      = require('merge-stream');
    plumber    = require('gulp-plumber');
    mbf        = require('main-bower-files');
    concat     = require('gulp-concat');
    jshint     = require('gulp-jshint');
    stylish    = require('jshint-stylish');
    less       = require('gulp-less');
    sourcemaps = require('gulp-sourcemaps');
    removeUst  = require('gulp-remove-use-strict');

var onError = function (err) {
  gutil.beep();
  gutil.log(err);
};

gulp.task("compile_public", function() {
    return merge(
      gulp.src(['app/scripts/**/*.js', 'app/scripts/*.js'])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(sourcemaps.init())
        .pipe(concat('tf-site.js'))
        .pipe(sourcemaps.write())
        .pipe(removeUst())
        .pipe(gulp.dest('./build/scripts')),
      gulp.src(['app/assets/**/*']).pipe(gulp.dest('./build'))
    );
});

gulp.task("compile_bower", function() {
  return merge(
    gulp.src(mbf(), { base: 'app/bower_components'}).pipe(concat('vendor.js')).pipe(gulp.dest('build/scripts')),
    gulp.src(['app/bower_components/**/*']).pipe(gulp.dest('./build/bower_components')) // copy all of them until we figure out something better
    );
});

gulp.task("compile_less", function() {
    return merge(
      gulp.src('app/vendor/**/*.less').pipe(less()).pipe(concat('vendor.css')).pipe(gulp.dest('build/styles')),
      gulp.src('app/styles/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/styles')) 
    );
});


gulp.task('compile', ['compile_less', 'compile_public', 'compile_bower']);

gulp.task("watch", function() {
    watch({ glob: 'app/styles/**/*.less' },     ['compile_less']);
    watch({ glob: 'app/scripts/**/*.js'},       ['compile_public']);
    watch({ glob: 'app/assets/**/*' },          ['compile_public']); 
    watch({ glob: 'app/bower_components/**/*'}, ['compile_bower']);
});
