# node-kii-service
kii backend management in nodejs 

## How to use

```
npm install node-kii-service
```

## Require modules

```
var Kii = require('node-kii-service'),
	kiiService = new Kii(APP_ID, APP_KEY);
```

## Load schema

```
kiiService.loadSchemas(path.join(__dirname, 'schemas'));
```

## Set admin token

```
kiiService.setAdminToken(ADMIN_ACCESS_TOKEN);

or

kiiService.getAdminToken(CLIENT_ID, CLIENT_SECRET, function (err, data) {
	console.log(data);
});
```

## Safe create and update

```
kiiService.safeCreateObject('Account', params, function (err, data) {
	...
});

KiiService.safeUpdateObject('Account', objectId, params, function (err, data) {
	...
});
```

## Query with operator ($gt, $gtn, $lt, $ltn, $ne)
```
kiiService.findAll('ProfileImage', {
	orderBy: '-time',
	MD5: 'xxxxxxxxx',
	name: '$ne:MyPhoto', // not "Myphoto"
	time: ['$gtn:1461694952', '$lt:1461857270'] // Range operator: 1461694952 <= time < 1461857270
	...											// url query: ?time=$gtn:1461694952&time=$lt:1461857270
}, function (err, data) {
	console.log(err || data);
});
```