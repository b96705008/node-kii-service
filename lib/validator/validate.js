var _ = require('lodash'),
	validator = require('is-my-json-valid'),
	parser = require('./parser');

function getUpdateSchema (schema, jsonDoc) {
	var updateSchema = _.extend({}, schema),
		existUpdateProps = [];

	//partial update
	schema.updateProps.forEach(function (updateProp) {
		if (jsonDoc[updateProp] !== undefined) existUpdateProps.push(updateProp);
	});
	updateSchema.properties = _.pick(schema.properties, existUpdateProps);
	return updateSchema;
}

exports.validateJSON = function (schema, jsonDoc, update) {
	var validate,
		filter;

	try {
		//initialize validator
		if (update) schema = getUpdateSchema(schema, jsonDoc);
		validate = validator(schema, {
			verbose: true,
			greedy: true 
		});
		filter = validator.filter(schema);

		//parse & filter json
		parser.parseJSON(schema, jsonDoc);
		jsonDoc = filter(jsonDoc);
	} catch (e) {
		return {
			success: false,
			err: 'Schema Error:' + e
		};
	}

	//validate json
	if (!validate(jsonDoc)) {
		return {
			success: false,
			err: validate.errors
		};
	} else {
		return {
			success: true,
			doc: jsonDoc,
			schema: schema
		};
	}
};

exports.getUniqueQueryBody = function (unique_keys, body) {
	var queryBody = {
			bucketQuery: {
				clause: {}
			}
		},

		getClause = function (key) {
			var keys,
				clauses = [];

			if (typeof key === 'string') {
				return {
					type: 'eq', field: key, value: body[key]
				};
			} else if (typeof key === 'object') {
				keys = key.$and;
				if (!keys || !Array.isArray(keys)) return null;
				keys.forEach(function (k) {
					if (typeof k !== 'string') return;
					clauses.push({
						type: 'eq', field: k, value: body[k]
					});
				});
				if (!clauses.length) return null;
				return {
					type: 'and',
					clauses: clauses
				};
			}
		};

	//construct query body for check unique keys issue
	if (Array.isArray(unique_keys)) {
		queryBody.bucketQuery.clause = {
			type: 'or',
			clauses: []
		};

		unique_keys.forEach(function (key) {
			var clause = getClause(key);
			if (clause) queryBody.bucketQuery.clause.clauses.push(clause);
		});
	} else {
		queryBody.bucketQuery.clause = getClause(unique_keys);
	}

	return queryBody;
};