'use strict'

let gulp = require("gulp");
let watch = require('gulp-watch');
let changed = require('gulp-changed');
let plumber = require('gulp-plumber');
let path = require('path');
let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));

let cfg = require("./src/config.json");
let Injector = require("./src/injector.js");

let inj = new Injector(cfg);

gulp.task('inject', () => {
	inj.init_n1ql()
		.then((res) => {
			console.log("UPSERT");
			return inj.upsert(data);
		})
		.then((res) => {
			console.log("Done!");
			process.exit();
		})
		.catch((err) => {
			console.log("ERR", err.stack);
			process.exit(1);
		});
});


gulp.task('extract', () => {
	inj.init_n1ql()
		.then((res) => {
			console.log("EXTRACT");
			return inj.pullAll();
		})
		.then((res) => {
			let data = JSON.stringify(res, null, 4);
			return fs.writeFileAsync("output.json", data)
		})
		.then((res) => {
			console.log("Done!");
			process.exit();
		})
		.catch((err) => {
			console.log("ERR", err.stack);
			process.exit(1);
		});
});
