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
