module.exports = {
	scope: 'Application',
	bucketID: 'FriendRequest',
	required: true,
	uniqueKeys: {
		$and: ['from', 'to']
	},
	type: 'object',
	updateProps: [
		'message'
	],
	properties: {
		from: {
			required: true,
			type: 'string'
		},
		to: {
			required: true,
			type: 'string'
		},
		message: {
			type: 'string'
		}
	},
	additionalProperties: false
};