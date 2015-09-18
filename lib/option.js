var _ = require('lodash');

exports.parse = function (bucketOpts) {
	var scope,
		bucketID,
		userQuery,
		loginName;

	if (typeof bucketOpts === 'string') {
		scope = 'Application';
		bucketID = bucketOpts;
		userQuery = false;
		loginName = false;
	} else {
		bucketID = bucketOpts.bucketID;
		userQuery = bucketOpts.userQuery || false;
		loginName =  bucketOpts.loginName || false;
		if (!bucketOpts.scope && loginName) {
			scope = 'User';
		} else {
			scope = bucketOpts.scope || 'Application';
		}
	}

	return {
		scope: scope,
		bucketID: bucketID,
		userQuery: userQuery,
		loginName: loginName
	};
};