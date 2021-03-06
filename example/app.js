var kiiConf = require('./config');

var path = require('path'),
	Kii = require('../lib/kii-service'),
	kiiService = new Kii(kiiConf.APP_ID, kiiConf.APP_KEY);

/**
 * Load schemas
 */
kiiService.loadSchemas(path.join(__dirname, 'schemas'));

/**
 * BucketOpts can be 'string' or 'object'
 */
// kiiService.getSchema('Account')
// kiiService.getSchema({
// 	scope: 'User',
// 	bucketID: 'UserData'
// });

/**
 * User signup
 */
// kiiService.signup({
// 	loginName: 'loginName',
// 	emailAddress: 'email',
// 	password: "password"
// }, function (err, data) {
// 	console.log(err || data);
// });

/**
 * User login
 */
// kiiService.login('username', 'pwd', function (err, data) {
// 	console.log(err || data);
// });

/**
 * Reset Pwd
 */
// kiiService.resetPwd('email', 'my@xxx.com', function (err, data) {
// 	if (err) {
// 		console.error(err);
// 	} else {
// 		console.log('ok!');
// 	}
// });

/**
 * Change Pwd
 */
// kiiService.changePwd('user access token', 'oldPwd', 'newPwd', function (err, data) {
// 	console.log(err || data);
// });

/*
 * Set admin token 
 */
kiiService.setAdminToken(kiiConf.ADMIN_ACCESS_TOKEN);

/** 
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

// kiiService.queryObjsByCond('ProfileImage', {
// 	bestEffortLimit: 5,
// 	paginationKey: '200/5',
// 	//orderBy: '-time',
// 	name: 'wpwmimi'
// 	//time: ['$gtn:1461694952', '$ltn:1461857270']
// }, function (err, data) {
// 	console.log(err || data);
// });

kiiService.findAll('ProfileImage', {
	//bestEffortLimit: 5,
	//paginationKey: '200/5'
	orderBy: '-time',
	MD5: 'xxxxxxxxx',
	name: '$ne:xxxxx', //$ne
	time: ['$gtn:1461694952', '$lt:1461857270'] //$gt, $gtn, $lt, $ltn
	//time: ['$gtn:1461855327', '$lt:1434945764']
}, function (err, data) {
	console.log(err || data);
});

/**
 * Dowload Object
 */
// var tmpPath = require('path').join(__dirname, 'tmp', 'file');

// kiiService.dowloadObject('FileBucket', 'ObjectID', tmpPath, function (err) {
// 	if (err) {
// 		console.error(err);
// 	} else {
// 		console.log('download to', tmpPath);
// 	}
// });

/**
 * Query Users
 */
// kiiService.queryUsersByCond({
// 	loginName: ['a', 'b']
// }, function (err, data) {
// 	console.log(err || data);
// });

/**
 * Save obj
 */
// kiiService.saveObject('FriendRequest', {
// 	from: 'Roger',
// 	to: 'Marry',
// 	message: 'Hello'
// }, function (err, data) {
// 	console.log(err || data);
// });

// kiiService.findOne('FriendRequest', {
// 	from: 'a',
// 	to: 'b'
// }, function (err, data) {
// 	console.log(err || data);
// });

// kiiService.findAll('FriendRequest', {
// 	from: 'a'
// }, function (err, data) {
// 	console.log(err || data);
// });

// kiiService.deleteObject('Account', '123', function (err) {
// 	console.log(err || 'success');
// });
