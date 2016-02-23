var gulp = require('gulp');
var util = require('gulp-util');
var SystemBuilder = require('systemjs-builder');
var watch = require('gulp-watch');
var ts = require('gulp-typescript');
var tsConfig = require('./tsconfig.json');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var inlineNg2Template = require('gulp-inline-ng2-template');
var runSequence = require('run-sequence');
var del = require('del');
var maven = require('gulp-maven-deploy');

var tsProject = ts.createProject(tsConfig.compilerOptions);

//copy dependencies to dist folder
gulp.task('copy:deps', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/angular2/bundles/angular2.dev.js',
        'node_modules/angular2/bundles/http.js',
        'node_modules/angular2/bundles/router.js',
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/systemjs/dist/system.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
    ]).pipe(gulp.dest('dist/vendor'));
});

//copy css dependencies to dist folder
gulp.task('copy:styledeps', function () {
    gulp.src([
        'node_modules/bootstrap/dist/fonts/*',
        'node_modules/font-awesome/fonts/*',
    ]).pipe(gulp.dest('dist/app/assets/fonts/'));

    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/font-awesome/css/font-awesome.css',
    ]).pipe(gulp.dest('dist/app/assets/css'));
});

//copy html/css/js files
gulp.task('copy:src', function () {
    return gulp.src([
        'src/boot.js',
        'src/index.html',
        'src/**/*.html',
        'src/**/*.css',
        'src/**/*.png'
    ])
            .pipe(gulp.dest('dist'))
            .pipe(connect.reload());
});

//clean the dist folder
gulp.task('clean', function (cb) {
    del('dist');
})

//compile app typescript files
gulp.task('compile:app', function () {
    return gulp.src('src/**/*.ts')
            .pipe(ts(tsProject))
            .pipe(gulp.dest('./dist'))
            .pipe(connect.reload());
});

//build deployment version
gulp.task('build:inline', function () {
    return gulp.src('src/**/*.ts')
            .pipe(inlineNg2Template({
                base: '/src',
                target: 'es5'
            }))
            .pipe(ts(tsProject))
            .pipe(gulp.dest('dist'))
});

gulp.task('build:uglify', function () {
    return gulp.src(['dist/*.js', 'dist/**/*.js'])
            .pipe(uglify())
            .pipe(gulp.dest('./dist'));
});

gulp.task('build:cssnano', function () {
    return gulp.src('dist/**/*.css')
            .pipe(cssnano())
            .pipe(gulp.dest('./dist'));
});

gulp.task('build:useref', function () {
    return gulp.src('dist/index.html')
            .pipe(useref())
            .pipe(gulp.dest('dist'));
});

gulp.task('build:clean', function () {
    del(['dist/vendor', 'dist/app/assets/css', 'dist/app/components/**/*.html', 'dist/app/components/**/*.css'])
});

gulp.task('build:deploy-local', function () {
    gulp.src('dist')
            .pipe(maven.install({
                'config': {
                    'groupId': 'de.gedoplan',
                    'type': 'war'
                }
            }))
});


//live reload server
gulp.task('server', ['copy:deps', 'copy:styledeps', 'copy:src', 'compile:app'], function () {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 3000,
        fallback: 'dist/index.html',
        middleware: function (connect, opt) {
            return [
                proxy('/webresources', {
                    target: 'http://localhost:8080'
                })
            ];
        }
    });
});
gulp.task('package', function () {
    runSequence('copy:deps', 'copy:styledeps', 'copy:src', 'build:inline', 'build:uglify', 'build:cssnano', 'build:useref', 'build:clean', 'build:deploy-local');
});
//default task
gulp.task('default', ['server'], function () {
    gulp.watch(['src/**/*.ts'], ['compile:app']);
    gulp.watch(['src/**/.js', 'src/**/*.html', 'src/**/*.css'], ['copy:src']);
});
