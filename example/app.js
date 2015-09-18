var APP_ID = 'd7f7fb4d',
	APP_KEY ='2d2294dd57374c566423464496ec8eb3',
	CLIENT_ID = 'a019b1433f86281326f15b5c4a122a7b',
	CLIENT_SECRET = '2e162341557b0b2472053231c51f367e98969e51a6cc2f011d1d732b7b108e38';

var path = require('path'),
	Kii = require('../lib/kii-service');
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
