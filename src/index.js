let cfg = require("./config.json");
let Injector = require("./injector.js");
let data = require(cfg.filename);

let inj = new Injector(cfg);

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
