let cfg = require("./config.json");
let Injector = require("./Injector");


let inj = new Injector(cfg);

inj.init_n1ql()
	.then((res) => {
		return inj.upsert();
	})
	.then((res) => {
		console.log("Done!");
		process.exit();
	})
	.catch((err) => {
		console.log("ERR", err.stack);
		process.exit(1);
	});
