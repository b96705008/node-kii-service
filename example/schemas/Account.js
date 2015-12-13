module.exports = {
	scope: 'Application',
	bucketID: 'Account',
	required: true,
	uniqueKeys: 'account',
	type: 'object',
	updateProps: [
		'password'
	],
	properties: {
		account: {
			required: true,
			type: 'string'
		},
		password: {
			required: true,
			type: 'string'
		}
	},
	additionalProperties: false,

	deletePreHook: function (objectID, next) {
		console.log(objectID);
		next();
	}
};