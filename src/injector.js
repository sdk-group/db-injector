'use strict'
let RDFcb = require("cbird-rdf")
	.RD;
let Couchbird = require("couchbird");

class Injector {
	constructor(cfg) {
		this.db = new RDFcb(cfg.couchbird);
		this.cfg = cfg;
		this.main_bucket = this.db.bucket(cfg.buckets.main);
	}

	init_n1ql() {
		return this.main_bucket.N1QL(Couchbird.N1qlQuery.fromString("CREATE PRIMARY INDEX ON " + this.cfg.buckets.main + ";"));
	}

	upsert(data) {
		return this.main_bucket.upsertNodes(data);
	}

	remove(keys) {
		return this.main_bucket.removeNodes(keys);
	}

}


module.exports = Injector;
