var gulp = require('gulp');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var ts = require('gulp-typescript');
var browserify = require('browserify');
var watchify = require('watchify');
var uglifyify = require('uglifyify');
var source = require('vinyl-source-stream');

var scripts = [
    '!src/typescript/**/*.d.ts',
    'src/typescript/**/*.ts'
];

gulp.task('compileTypescript', function () {
    var tsResult = gulp.src(scripts)
        .pipe(ts({
            out: 'typescript.js'
        }));

    return tsResult.js.pipe(gulp.dest('src'));
});

function bundle(b){
    console.log('Bundling...');
    return b
        .bundle()
        .pipe(source('game.js'))
        .pipe(gulp.dest('public'))
        .pipe(livereload());
}

gulp.task('browserify', ['watchTypescript'], function(){
    var b = watchify(browserify({
        entries: ['./src/typescript.js'],
        debug: true
    }));

    b.transform({
        global: true
    }, 'uglifyify');

    b.on('update', bundle.bind(null, b));

    return bundle(b);

});

gulp.task('watchTypescript', ['compileTypescript'], function () {
    watch(scripts, batch(function (events, done) {
        gulp.start('compileTypescript', done);
    }));
});

gulp.task('watch', ['compileTypescript', 'watchTypescript', 'browserify', 'webserver'], function(){
    livereload.listen();
});

gulp.task('webserver', function(){
    connect.server({
        root: 'public'
    });
});

gulp.task('default', ['webserver']);
