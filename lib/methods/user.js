var _ = require('lodash'),
	config = require('../config');

module.exports = function (Kii) {
	/**
	 * Query users
	 */
	Kii.prototype.queryUsers = function (body, cb, paginationKey) {
		var requrl = this.getDataReqURLPrefix({userQuery: true}) + 'query',
			headers = {
				Authorization: 'Bearer ' + this.adminToken.access_token,
				'content-type': config.USER_QUERY_CONTENT_TYPE,
				accept: config.USER_ACCEPT_CONTENT_TYPE
			};

			if(paginationKey) {
				body['paginationKey'] = paginationKey;
			}

		this.requestJSON('POST', requrl, headers, body, cb);
	};

	Kii.prototype.queryUsersByCond = function (cond, cb, paginationKey) {
		var keys = _.keys(cond),
			queryBody = this.buildListQueryBody(cond, keys, {
				querySourse: 'userQuery'
			});

		this.queryUsers(queryBody, cb, paginationKey);
	};

	/**
	 * Update user with loginName
	 */
	Kii.prototype.updateUser = function (loginName, body, onlyCustom, cb) {
		var requrl = this.getDataReqURLPrefix({userQuery: true}) + 'LOGIN_NAME:' + loginName,
			headers = {
				Authorization: 'Bearer ' + this.adminToken.access_token,
				'content-type': config.USER_UPDATE_CONTENT_TYPE
			};

		if (onlyCustom) {
			body = _.omit(body, [
				'userID',
				'internalUserID',
				'emailAddressVerified',
				'_hasPassword',
				'_disabled',
				'country',
				'displayName',
				'password',
				'loginName',
				'emailAddress',
				'phoneNumber'
			]);
		}
		this.requestJSON('POST', requrl, headers, body, cb);
	};

	/**
	 * Get a user by Login Name
	 */
	Kii.prototype.retrieveUser = function (loginName, cb) {
		var requrl = this.getDataReqURLPrefix({userQuery: true}) + 'LOGIN_NAME:' + loginName,
			headers = {
				Authorization: 'Bearer ' + this.adminToken.access_token
			};

		this.requestJSON('GET', requrl, headers, null, cb);
	};

	/**
	 * Get a me by access token
	 */
	Kii.prototype.retrieveMe = function (token, cb) {
		var requrl = this.getDataReqURLPrefix({userQuery: true}) + 'me',
			headers = {
				Authorization: 'Bearer ' + token
			};

		this.requestJSON('GET', requrl, headers, null, cb);
	};
};