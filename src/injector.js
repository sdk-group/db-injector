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

	makeCounters(cnt) {
		return Promise.all(_.map(cnt, (c, key) => {
			console.log(c, key, this.cfg.couchbird)
			return this.main_bucket.counter(key, _.parseInt(c), {
				initial: 0
			})
		}));
	}

	getCounters(cnt) {}

	pullAll() {
		// return this.main_bucket.N1QL(Couchbird.N1qlQuery.fromString("SELECT * FROM `" + this.cfg.buckets.main + "` WHERE \`@type\`='Ticket' ;"))
		return this.main_bucket.N1QL(Couchbird.N1qlQuery.fromString("SELECT meta(d) FROM `" + this.cfg.buckets.main + "` d WHERE meta(d).id LIKE 'counter-ticket%' ;"))
			// return this.main_bucket.N1QL(Couchbird.N1qlQuery.fromString("SELECT * FROM `" + this.cfg.buckets.main + "` WHERE NOT ARRAY_CONTAINS(['Task', 'Plan','Ticket', 'History', 'Cache'], \`@type\`) AND meta().id NOT LIKE 'counter%';"))
			.then(res => _.map(res, this.cfg.buckets.main));
	}

}


module.exports = Injector;