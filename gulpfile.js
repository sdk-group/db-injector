'use strict'

let gulp = require("gulp");
let watch = require('gulp-watch');
let changed = require('gulp-changed');
let plumber = require('gulp-plumber');
let path = require('path');
let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));

let cfg = require("./src/config.json");
let inj_cfg = require("./src/config-inj.json");
let Injector = require("./src/injector.js");


gulp.task('inject', () => {
	let inj = new Injector(inj_cfg);
	inj.init_n1ql()
		.then((res) => {
			let data = require(inj_cfg.filename);
			console.log("UPSERT", inj_cfg.couchbird);
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
	let inj = new Injector(cfg);
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

gulp.task('counters', () => {
	let ext = new Injector(cfg);
	let inj = new Injector(inj_cfg);
	inj.init_n1ql()
		.then((res) => {
			console.log("COUNTERS");
			return inj.makeCounters({
				"counter-ticket-department-1-2016-04-11": 37
			});
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