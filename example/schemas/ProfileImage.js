module.exports = {
	scope: 'Application',
	bucketID: 'ProfileImage',
	required: true,
	uniqueKeys: 'name',
	type: 'object',
	updateProps: [
	],
	properties: {
		name: {
			required: true,
			type: 'string'
		},
		time: {
			required: true,
			type: 'integer'
		},
		MD5: {
			equired: true,
			type: 'string'
		}
	},
	additionalProperties: false
};