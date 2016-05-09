function getDefaultClause (field, eqValues) {
	if (eqValues.length === 1) {
		return {
			type: 'eq', field: field, value: eqValues[0]
		};
	} else if (eqValues.length > 1) {
		return {
			type: 'in', field: field, values: eqValues
		};
	}
}

function getNotClause (field, neValues) {
	if (neValues.length === 1) {
		return {
			type: 'not',
			clause: {
				type: 'eq', field: field, value: neValues[0]
			}
		};
	} else if (neValues.length > 1) {
		return {
			type: 'not',
			clause: {
				type: 'in', field: field, values: neValues
			}
		};
	}
}

function buildRangeInitStatus () {
	return {
		hasUpper: false,
		upperLimit: 0,
		upperIncluded: false,
		//lower
		hasLower: false,
		lowerLimit: 0,
		lowerIncluded: false
	}
}

function getRangeClause (field, rangeStatus) {
	if (!rangeStatus.hasUpper && !rangeStatus.hasLower) {
		return null;
	}

	// only upper or lower
	if (rangeStatus.hasUpper && !rangeStatus.hasLower) {
		return {
			type: 'range',
  			field: field,
			upperLimit: rangeStatus.upperLimit,
			upperIncluded: rangeStatus.upperIncluded
		};
	} else if (!rangeStatus.hasUpper && rangeStatus.hasLower) {
		return {
			type: 'range',
  			field: field,
			lowerLimit: rangeStatus.lowerLimit,
			lowerIncluded: rangeStatus.lowerIncluded
		};
	}

	// has upper and lower 
	if (rangeStatus.upperLimit >= rangeStatus.lowerLimit) {
		return {
			type: 'range',
  			field: field,
  			upperLimit: rangeStatus.upperLimit,
			upperIncluded: rangeStatus.upperIncluded,
			lowerLimit: rangeStatus.lowerLimit,
			lowerIncluded: rangeStatus.lowerIncluded
		};
	} else {
		return {
			type: 'or',
	    	clauses : [
	       		{
	       			type: 'range', 
	       			field: field, 
	       			upperLimit: rangeStatus.upperLimit,
					upperIncluded: rangeStatus.upperIncluded
				},
	       		{
	       			type: 'range', 
	       			field: field, 
	       			lowerLimit: rangeStatus.lowerLimit,
					lowerIncluded: rangeStatus.lowerIncluded
				}
	     	]
	    };
	}
}

module.exports = {
	typeToOperator: {
		'string': ['$ne'],
		'integer': ['$ne', '$gt', '$gtn', '$lt', '$ltn'],
		'number': ['$ne', '$gt', '$gtn', '$lt', '$ltn'],
		'boolean': ['$ne'],
	},

	buildOperatorClauses: function (field, values) {
		var eq = [],
			not = [],
			range = buildRangeInitStatus(),
			clauses = [];

		if (!Array.isArray(values)) {
			values = [values];
		}

		values.forEach(function (v) {
			if (typeof v !== 'object') {
				eq.push(v);
				return;
			}

			var value = v.value,
				operator = v.operator;

			if (operator === '$ne') {
				not.push(value);
			} else if (operator === '$lt') {
				range.hasUpper = true;
				range.upperLimit = value;
				range.upperIncluded = false;
			} else if (operator === '$ltn') {
				range.hasUpper = true;
				range.upperLimit = value;
				range.upperIncluded = true;
			} else if (operator === '$gt') {
				range.hasLower = true;
				range.lowerLimit = value;
				range.lowerIncluded = false;
			} else if (operator === '$gtn') {
				range.hasLower = true;
				range.lowerLimit = value;
				range.lowerIncluded = true;
			}
		}); 

		if (eq.length > 0) {
			clauses.push(getDefaultClause(field, eq));
		}

		if (not.length > 0) {
			clauses.push(getNotClause(field, not));
		}

		if (range.hasUpper || range.hasLower) {
			clauses.push(getRangeClause(field, range));
		}

		return clauses;
	}
};