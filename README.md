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
