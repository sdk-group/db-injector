'use strict'
let RDFcb = require("cbird-rdf")
	.RD;
let Couchbird = require("couchbird");
let _ = require('lodash');

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

	pullAll() {
		return this.main_bucket.N1QL(Couchbird.N1qlQuery.fromString("SELECT * FROM `" + this.cfg.buckets.main + "` WHERE NOT ARRAY_CONTAINS(['Task', 'Ticket', 'Plan', 'History', 'Cache'], \`@type\`) AND meta().id NOT LIKE 'counter%';"))
			.then(res => _.map(res, this.cfg.buckets.main));
	}

}


module.exports = Injector;
