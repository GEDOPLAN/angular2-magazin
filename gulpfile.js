//Deklaration der verwendeten Zusatzmodule
var gulp = require('gulp'),
        util = require('gulp-util'),
        SystemBuilder = require('systemjs-builder'),
        watch = require('gulp-watch'),
        ts = require('gulp-typescript'),
        tsConfig = require('./tsconfig.json'),
        sourcemaps = require('gulp-sourcemaps'),
        connect = require('gulp-connect'),
        uglify = require('gulp-uglify'),
        useref = require('gulp-useref'),
        cssnano = require('gulp-cssnano'),
        inlineNg2Template = require('gulp-inline-ng2-template'),
        del = require('del'),
        maven = require('gulp-maven-deploy'),
        war = require('gulp-war'),
        gulpif = require('gulp-if'),
        lazypipe = require('lazypipe'),
        replace = require('gulp-replace-task'),
        tsProject = ts.createProject(tsConfig.compilerOptions);

// Kopiert alle externen Fonts den Ziel Ordner (dist/app/assets/fonts)
gulp.task('copy:fonts', function () {
    return gulp.src([
        'node_modules/bootstrap/dist/fonts/*',
        'node_modules/font-awesome/fonts/*'
    ]).pipe(gulp.dest('dist/app/assets/fonts/'));
});

// Kopiert unsere statischen Dateien in den Ziel Ordner (dist)
// für die Entwicklungszeit und refresht den Browser
gulp.task('development:copy', function () {
    return gulp.src([
        '!src/index.html',
        'src/**/*.html',
        'src/**/*.png',
        'src/**/*.css'
    ])
            .pipe(gulp.dest('dist'))
            .pipe(connect.reload());
});

// Kopiert die index.xhtml und generriert die korrigierten CSS- und JS-Referenzen
gulp.task('development:html', function () {
    return gulp.src('src/index.html')
            .pipe(useref())
            .pipe(replace({
                patterns: [
                    {
                        match: 'basehref',
                        replacement: "/"
                    }
                ]
            }))
            .pipe(gulp.dest('dist'))
            .pipe(connect.reload());
});

// Kompiliet alle TypeScript Dateien ins Zielverzeichnis
gulp.task('development:compile', function () {
    return gulp.src('src/**/*.ts')
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./dist'))
            .pipe(connect.reload());
});

// Kopiert die index.xhtml und generriert die korrigierten CSS- und JS-Referenzen
// dabei wird eine Minimierung der Sourcen durchgeführt
gulp.task('package:html', function () {
    return gulp.src('src/index.html')
            .pipe(useref())
            .pipe(replace({
                patterns: [
                    {
                        match: 'basehref',
                        replacement: "/angular2-magazin/"
                    }
                ]
            }))
            .pipe(gulpif('*.js', uglify()))
            .pipe(gulpif('*.css', cssnano()))
            .pipe(gulp.dest('dist'));
});

// Kompiliert und Minimiert unsere Komponenten
// Erzeugt aus den HTML/CSS Dateien der Komponenten Inline-Elemente
// = aus templateUrl: 'some/url' wird template: '<html>....'
gulp.task('package:compile', function () {
    return gulp.src('src/**/*.ts')
            .pipe(inlineNg2Template({
                base: '/src',
                target: 'es5'
            }))
            .pipe(ts(tsProject))
            .pipe(uglify())
            .pipe(gulp.dest('dist'));
});

// Kopiert unsere statischen Dateien (Bilder) für den Produktions-Build
gulp.task('build:copy', function () {
    return gulp.src([
        'src/**/*.png'
    ])
            .pipe(gulp.dest('dist'));
});

// Unser extrem simples "Hello World" Beispiel wird hier separat behandelt
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

// Default Task = Kompilieren und Kopieren der Dateien + Webserver starten
gulp.task('default', ['server'], function () {
    gulp.watch(['src/**/*.ts'], ['development:compile']);
    gulp.watch(['src/**/.js', 'src/index.html', 'src/app/template.html', 'src/app/assets/*.css'], ['development:html']);
    gulp.watch(['src/app/components/**/*.html', 'src/app/components/**/*.css'], ['development:copy']);
});

gulp.task('server', ['copy:fonts', 'development:copy', 'development:html', 'development:compile'], function () {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 3000,
        fallback: 'dist/index.html'
    });
});

// Produktions-Artefakt erzeugen: zusätzlich zu den Default-Tasks werden Code Optimierungen durchgeführt
gulp.task('package', ['package:compile', 'copy:fonts', 'package:html', 'build:copy'], function () {
    return gulp.src('dist')
            .pipe(maven.install({
                config: {
                    groupId: 'de.gedoplan',
                    type: 'war',
                    artifactId: 'angular2-magazin',
                    version: '0.0.1'
                }
            }));
});

