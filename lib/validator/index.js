var _ = require('lodash');

module.exports = _.extend(
	require('./validate'), 
	require('./unique'),
	require('./parser')
);