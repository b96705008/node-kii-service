var validator = require('../validator');

module.exports = function (Kii) {
	/**
	 * Build filter kii query body
	 */
	Kii.prototype.buildListQueryBody = function (queryParams, fields, opts) {
		var clauses = [],
			options = opts || {},
			querySourse = options.querySourse || 'bucketQuery',
			bucketOpts = options.bucketOpts || null,
			orderBy = options.orderBy || null,
			orderField = '_created',
			descending = false,
			schema = null,
			queryBody = {};

		//bucketQuery or userQuery
		queryBody[querySourse] = {};

		//fields
		if (typeof fields === 'string') fields = [fields];

		//schema
		if (bucketOpts) {
			schema = this.getSchema(bucketOpts);
			queryParams = validator.parseQuery(schema, queryParams, fields);
		}

		//build clauses
		fields.forEach(function (field) {
			var value = queryParams[field];
			if (!value) {
				return;
			} else if (Array.isArray(value)) {
				//value is array
				clauses.push({
					type: 'in', field: field, values: value
				});
			} else {
				//value is string
				clauses.push({
					type: 'eq', field: field, value: value
				});
			}
		});

		//build queryBody
		if (!clauses.length) {
			queryBody[querySourse].clause = {
				type: 'all'
			};
		} else if (clauses.length === 1) {
			queryBody[querySourse].clause = clauses[0];
		} else {
			queryBody[querySourse].clause = {
				type: 'and',
				clauses: clauses
			};
		}

		if (orderBy) {
			if (orderBy.indexOf('-') === 0) {
				descending = true;
				orderField = orderBy.substring(1);
			} else {
				orderField = orderBy;
			}
		}

		queryBody[querySourse].orderBy = orderField;
		queryBody[querySourse].descending = descending;

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
				}, data.results[0]);
			} else {
				cb(null, body);
			}
		});
	}; 

};