/**
 * Constructor
 */
function Kii (appId, appKey) {
	//require property
	this.APP_ID = appId;
	this.APP_KEY = appKey;
	this.OBJECT_CREATE_CONTENT_TYPE = 'application/vnd.' + appId + '.mydata+json';
	
	//init null value
	this.adminToken = {
		access_token: null
	};

	//schemas
	this.schemas = {};
}

// Append methods for service
require('./methods/request')(Kii);
require('./methods/schema')(Kii);
require('./methods/admin')(Kii);
require('./methods/object')(Kii);
require('./methods/user')(Kii);
require('./methods/utils')(Kii);

module.exports = Kii;