var kiiConf = require('./config');

var path = require('path'),
	Kii = require('../lib/kii-service'),
	kiiService = new Kii(kiiConf.APP_ID, kiiConf.APP_KEY);

/*
 * Load schemas
 */
kiiService.loadSchemas(path.join(__dirname, 'schemas'));

/*
 * BucketOpts can be 'string' or 'object'
 */
kiiService.getSchema('Account')
kiiService.getSchema({
	scope: 'User',
	bucketID: 'UserData'
});

/*
 * Set admin token 
 */
kiiService.setAdminToken(kiiConf.ADMIN_ACCESS_TOKEN);

/* 
 *Get token by client info
 */
// kiiService.getAdminToken(kiiConf.CLIENT_ID, kiiConf.CLIENT_SECRET, function (err, data) {
// 	console.log(data);
// });

// kiiService.queryObjects('ProfileImage', {
// 	bucketQuery: {
// 		clause: {type: 'all'}
// 	}
// }, function (err, data) {
// 	console.log(err || data);
// });

/*
 * Dowload Object
 */
var tmpPath = require('path').join(__dirname, 'tmp', 'file');

kiiService.dowloadObject('FileBucket', 'ObjectID', tmpPath, function (err) {
	if (err) {
		console.error(err);
	} else {
		console.log('download to', tmpPath);
	}
});