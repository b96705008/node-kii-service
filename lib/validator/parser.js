var _ = require('lodash'),
	typeToOperator = require('../operators').typeToOperator;

function parseStrToNumber (str, type) {
	var val;
	if (!str) return null;
	type = type || 'integer';

	if (type === 'float') {
		val = parseFloat(str);
	} else {
		val = parseInt(str, 10);
	}
	return isNaN(val) ? null : val;
}

function parseStrToBoolean (str) {
	var val;
	try {
		val = JSON.parse(str);
	} catch (e) {
		return null;
	}
	if (typeof val === 'boolean') {
		return val;
	} else {
		return null;
	}
}

function extractOperator (value, valid_prop_type) {
	var values = value.split(':'),
		operator = values[0];

	if (values.length !== 2 || 
		operator.indexOf('$') !== 0 ||
		!typeToOperator[valid_prop_type] || 
		typeToOperator[valid_prop_type].indexOf(operator) < 0) {
		return {
			operator: false, 
			value: value
		};
	}

	return {
		operator: operator, 
		value: values[1]
	};
}

function getParseValue (json_prop_val, valid_prop_type) {
	if (typeof json_prop_val !== 'string') return json_prop_val;

	var extractVal = extractOperator(json_prop_val, valid_prop_type),
		operator = extractVal.operator,
		value = extractVal.value,
		parse_val = value;

	if (valid_prop_type === 'integer') {
		//parse string to integer
		parse_val = parseStrToNumber(value);
	} else if (valid_prop_type === 'number') {
		//parse string to float
		parse_val = parseStrToNumber(value, 'float');
	} else if (valid_prop_type === 'boolean') {
		//parse string to boolean
		parse_val = parseStrToBoolean(value);
	} 

	if (parse_val == null) {
		return null;
	} else if (operator) {
		return {
			operator: operator, 
			value: parse_val
		};
	} else {
		return parse_val;
	}
}

exports.parseJSON = function (schema, jsonDoc) {
	var properties = schema.properties;

	_.forOwn(properties, function (propOpts, propName) {
		var jsonPropVal = jsonDoc[propName],
			parse_val;

		if (!jsonPropVal) {
			return;
		} else if (Array.isArray(jsonPropVal)) {
			if (propOpts.type !== 'array' ||
				!propOpts.items || 
				!propOpts.items.type) return;
	
			jsonDoc[propName] = jsonPropVal.map(function (elem, index) {
				var parse_elem_val = getParseValue(elem, propOpts.items.type);
				return parse_elem_val !== null ? parse_elem_val : jsonDoc[propName][index];
			});
		} else {
			parse_val = getParseValue(jsonPropVal, propOpts.type);
			if (parse_val !== null) jsonDoc[propName] = parse_val;
		}
	});
};

//not check array type field
exports.parseQuery = function (schema, queryParams, fields) {
	var properties = schema.properties,
		filterParams = {};

	//build clauses
	fields.forEach(function (field) {
		var propOpts = properties[field],
			value = queryParams[field],
			parse_val;

		if (!value || !propOpts || propOpts.type === 'array') return;

		if (Array.isArray(value)) {
			//value is array
			filterParams[field] = [];

			_.forEach(value, function (v) {
				var parse_v = getParseValue(v, propOpts.type);
				if (parse_v !== null) filterParams[field].push(parse_v);
			});
		} else {
			//value is string
			parse_val = getParseValue(value, propOpts.type);
			if (parse_val !== null) filterParams[field] = parse_val;
		}
	});
	return filterParams;
};