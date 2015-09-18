var confg = require('../config');

module.exports = function (Kii) {
	/**
	 * Query users
	 */
	Kii.prototype.queryUsers = function (bucketOpts, body, cb, paginationKey) {
		var requrl = this.getDataReqURLPrefix(bucketOpts) + 'query',
			headers = {
				Authorization: 'Bearer ' + this.adminToken.access_token,
				'content-type': confg.USER_QUERY_CONTENT_TYPE,
				accept: confg.USER_ACCEPT_CONTENT_TYPE,
			};

			if(paginationKey) {
				body['paginationKey'] = paginationKey;
			}

		this.requestJSON('POST', requrl, headers, body, cb);
	};

	/**
	 * Update user with loginName
	 */
	Kii.prototype.updateUser = function (loginName, body, cb) {
		var requrl = this.getDataReqURLPrefix({userQuery: true}) + 'LOGIN_NAME:' + loginName,
			headers = {
				Authorization: 'Bearer ' + this.adminToken.access_token,
				'content-type': confg.USER_UPDATE_CONTENT_TYPE
			};

		this.requestJSON('POST', requrl, headers, body, cb);
	};
};