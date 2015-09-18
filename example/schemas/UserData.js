module.exports = {
	scope: 'User',
	bucketID: 'UserData',
	required: true,
	uniqueKeys: 'time',
	type: 'object',
	properties: {
		time: {
			required: true,
			type: 'integer'
		},
		raw_data: {
			type: 'array',
			items: {
				type: 'integer'
			}
		}
	},
	additionalProperties: false
};