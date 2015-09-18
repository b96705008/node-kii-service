var APP_ID = '',
	APP_KEY ='',
	CLIENT_ID = '',
	CLIENT_SECRET = '';

var path = require('path'),
	Kii = require('../lib/kii-service'),
	kiiService = new Kii(APP_ID, APP_KEY);

// Load schemas
kiiService.loadSchemas(path.join(__dirname, 'schemas'));

// BucketOpts can be 'string' or 'object'
console.log(kiiService.getSchema('Account'));
console.log(kiiService.getSchema({
	scope: 'User',
	bucketID: 'UserData'
}));

// Set admin token
//kiiService.setAdminToken(ADMIN_ACCESS_TOKEN);

// Get token by client info
kiiService.getAdminToken(CLIENT_ID, CLIENT_SECRET, function (err, data) {
	console.log(data);
});
