//Deklaration der verwendeten Zusatzmodule
var gulp = require('gulp');
var util = require('gulp-util');
var SystemBuilder = require('systemjs-builder');
var watch = require('gulp-watch');
var ts = require('gulp-typescript');
var tsConfig = require('./tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var inlineNg2Template = require('gulp-inline-ng2-template');
var runSequence = require('run-sequence');
var del = require('del');
var maven = require('gulp-maven-deploy');
var war= require('gulp-war');

var tsProject = ts.createProject(tsConfig.compilerOptions);

// Kopiert alle externen JS-Dateien in den Ziel Ordner (dist/vendor)
gulp.task('copy:deps', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/angular2/bundles/angular2.dev.js',
        'node_modules/angular2/bundles/http.js',
        'node_modules/angular2/bundles/router.js',
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/systemjs/dist/system.js',
        'node_modules/bootstrap/dist/js/bootstrap.js'
    ]).pipe(gulp.dest('dist/vendor'));
});

// Kopiert alle externen CSS-Dateien in den Ziel Ordner (dist/app/assets/css)
gulp.task('copy:styledeps', function () {
    gulp.src([
        'node_modules/bootstrap/dist/fonts/*',
        'node_modules/font-awesome/fonts/*'
    ]).pipe(gulp.dest('dist/app/assets/fonts/'));

    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/font-awesome/css/font-awesome.css'
    ]).pipe(gulp.dest('dist/app/assets/css'));
});

// Kopiert unsere statischen Dateien in den Ziel Ordner (dist)
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

// Unser extrem simples "Hello World" Beispiel
gulp.task('copy:helloworld', function () {
    return gulp.src([
        'src/helloworld/**/*'
    ])
            .pipe(gulp.dest('dist/helloworld'))
            .pipe(connect.reload());
});



// Zielverzeichnis löschen
gulp.task('clean', function (cb) {
    del('dist');
});

// Kompiliet alle TypeScript Dateien ins Zielverzeichnis
gulp.task('compile:app', function () {
    return gulp.src('src/**/*.ts')
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./dist'))
            .pipe(connect.reload());
});

// erzeugt aus den HTML/CSS Dateien der Komponenten Inline-Elemente
// = aus templateUrl: 'some/url' wird template: '<html>....'
// = Minimierung der Requests
gulp.task('build:inline', function () {
    return gulp.src('src/**/*.ts')
            .pipe(inlineNg2Template({
                base: '/src',
                target: 'es5'
            }))
            .pipe(ts(tsProject))
            .pipe(gulp.dest('dist'));
});

// Minimierung der Dateigrößen von JavaScript Dateien
gulp.task('build:uglify', function () {
    return gulp.src(['dist/*.js', 'dist/**/*.js'])
            .pipe(uglify())
            .pipe(gulp.dest('./dist'));
});

// Minimierung der Dateigrößen von CSS Dateien
gulp.task('build:cssnano', function () {
    return gulp.src('dist/**/*.css')
            .pipe(cssnano())
            .pipe(gulp.dest('./dist'));
});

// Ersetzt die Script/CSS Referenzen in der HTML Datei mit unseren minimierten Versionen
// Dazu existieren in der index.html speziell ausgezeichnete Bereiche
gulp.task('build:useref', function () {
    return gulp.src('dist/index.html')
            .pipe(useref())
            .pipe(gulp.dest('dist'));
});

// Entfernen der nicht minimierten Versionen und Komponenten Dateien 
gulp.task('build:clean', function () {
    del(['dist/vendor', 'dist/app/assets/css', 'dist/app/components/**/*.html', 'dist/app/components/**/*.css']);
});

// generriert eine web.xml für unser Angular-WAR
gulp.task('build:webxml', function () {
    return gulp.src('./dist')
        .pipe(war({
            welcome: 'index.html',
            displayName: 'angular2-magazin',
            webappExtras: [
                '<error-page><error-code>404</error-code><location>/index.html</location></error-page>'
            ]
        }))
        .pipe(gulp.dest("./dist"));
});



// Erzeugt aus dem Zielverzeichnis ein Maven-Artefakt und installiert dies im lokalen Repository
gulp.task('build:deploy-local', function () {
    gulp.src('dist')
            .pipe(maven.install({
                'config': {
                    'groupId': 'de.gedoplan',
                    'type': 'war',
                    'artifactId': 'angular2-magazin',
                    'finalName': 'angular2-magazin'
                }
            }));
});


// Default Task = Kompilieren und Kopieren der Dateien + Webserver starten
gulp.task('default', ['server'], function () {
    gulp.watch(['src/**/*.ts'], ['compile:app']);
    gulp.watch(['src/**/.js', 'src/**/*.html', 'src/**/*.css'], ['copy:src']);
});

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

// Produktions-Artefakt erzeugen: zusätzlich zu den Default-Tasks werden Code Optimierungen durchgeführt
gulp.task('package', function () {
    runSequence('copy:deps', 'copy:styledeps', 'copy:src', 'build:inline', 'build:uglify', 'build:cssnano', 'build:useref', 'build:clean', 'build:webxml',  'build:deploy-local');
});

