var validator = require('../validator');

module.exports = function (Kii) {
	/**
	 * Build filter kii query body
	 */
	Kii.prototype.buildListQueryBody = function (queryParams, fields) {
		var clauses = [],
			queryBody = {
				bucketQuery: {}
			};

		if (typeof fields === 'string') fields = [fields];

		//build clauses
		fields.forEach(function (field) {
			var value = queryParams[field];
			if (!value) {
				return;
			} else if (Array.isArray(value)) {
				clauses.push({
					type: 'in', field: field, values: value
				});
			} else {
				clauses.push({
					type: 'eq', field: field, value: value
				});
			}
		});

		//build queryBody
		if (!clauses.length) {
			queryBody.bucketQuery = {
				clause: {type: 'all'},
				orderBy: '_created',
				descending: true
			};
		} else if (clauses.length === 1) {
			queryBody.bucketQuery.clause = clauses[0];
		} else {
			queryBody.bucketQuery.clause = {
				type: 'and',
				clauses: clauses
			};
		}

		return queryBody;
	};
	
	/**
	 * Verify kii data using validator
	 */
	Kii.prototype.verifyKiiData = function (bucketOpts, body, cb) {
		var unique_keys = null,
			queryBody = null,
			schema = this.getSchema(bucketOpts),
			result = validator.validateJSON(schema, body);

		//verify schema
		if (!result.success) return cb(result.err);
		body = result.doc;
		unique_keys = result.schema.uniqueKeys;

		if (!unique_keys) return cb(null, body);
		//construct query body for check unique keys issue
		queryBody = validator.getUniqueQueryBody(unique_keys, body);

		//query
		this.queryObjects(bucketOpts, queryBody, function (err, data) {
			if (err) {
				cb(err);
			} else if (data.results && data.results.length) {
				cb({
					field: unique_keys,
					message: 'DUPLICATE_UNIQUE_KEYS'
				});
			} else {
				cb(null, body);
			}
		});
	}; 

};