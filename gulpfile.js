'use strict';

var gulp = require('gulp'),
    slim = require('gulp-slim'),
    stylus = require('gulp-stylus'),
    coffee = require('gulp-coffee'),
    livereload = require('gulp-livereload'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    nib = require('nib');


gulp.task('stylus', function() {
    gulp.src('./styl/*.styl')
    	.pipe(stylus({use: nib(), compress: true}))
	    .on('error', console.log)
	    .pipe(gulp.dest('./public/css/'));
});


gulp.task('slim', function(){
	gulp.src('./*.slim')
		.pipe(slim({pretty: true}))
		.on('error', console.log)
		.pipe(gulp.dest('./public/'))
		.pipe(livereload());
});

gulp.task('coffee',function(){
	gulp.src('./coffee/*.coffee')
		.pipe(coffee({bare: true}))
		.on('error', console.log)
		.pipe(gulp.dest('./public/js/'));
});

gulp.task('concat-js', function() {
	gulp.task('coff');
	gulp.src('./public/js/scripts.js')
		.pipe(concat('scripts.min.js'))
		.pipe(gulp.dest('./public/min/'))
		.pipe(livereload());
});

gulp.task('concat-css', function() {
	gulp.task('styl');
	gulp.src(['./public/css/styles.css'])
		.pipe(concat('styles.min.css'))
		.pipe(gulp.dest('./public/min/'))
		.pipe(livereload());
});

gulp.task('imagemin',function(){
	gulp.src('./img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./public/img/'));
});


gulp.task('server', function() {
	connect()
		.use(require('connect-livereload')())
		.use(serveStatic(__dirname + '/public'))
		.listen('3333');

	console.log('Сервер работает по адресу http://localhost:3333');
});

gulp.task('watch', function(){
  	livereload.listen();
	gulp.watch('./styl/*.styl',['stylus']);
	gulp.watch('./*.slim',['slim']);
	gulp.watch('./coffee/*.coffee',['coffee']);
	gulp.watch(['./public/js/*.js'],['concat-js']);
	gulp.watch(['./public/css/*.css'],['concat-css']);
	gulp.watch('./img/**/*',['imagemin']);
  	gulp.start('server');
});

gulp.task('default',['watch','stylus','slim','coffee','concat-js','concat-css','imagemin']);
