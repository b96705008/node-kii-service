var _ = require('lodash'),
	config = require('../config');

module.exports = function (Kii) {
	/**
	 * User login in
	 */
	Kii.prototype.signup = function (body, cb) {
		var requrl = 'apps/' + this.APP_ID + '/users',
			headers = {
				'content-type': config.REGISTER_CONTENT_TYPE
			};

		this.requestJSON('POST', requrl, headers, body, cb);
	};

	/**
	 * User login in
	 */
	Kii.prototype.login = function (username, password, cb) {
		var requrl = 'oauth2/token',
			headers = {
				'content-type': 'application/json'
			};

		this.requestJSON('POST', requrl, headers, {
			username: username,
			password: password
		}, cb);
	};

	/**
	 * Change pwd
	 */
	Kii.prototype.changePwd = function (userToken, oldPwd, newPwd, cb) {
		var requrl = this.getDataReqURLPrefix({userQuery: true}) + 'me/password',
			headers = {
				Authorization: 'Bearer ' + userToken,
				'content-type': config.CHANGE_PWD_CONTENT_TYPE
			};

		console.log(requrl);
		this.requestJSON('PUT', requrl, headers, {
			newPassword: newPwd,
			oldPassword: oldPwd
		}, cb);
	};

	/**
	 * Reset pwd
	 */
	Kii.prototype.resetPwd = function (method, value, cb) {
		var requrl = 'apps/' + this.APP_ID + '/users/',
			headers = {
				'content-type': config.RESET_PWD_CONTENT_TYPE
			},
			body = {};

		if (method === 'email') {
			requrl = requrl + 'EMAIL:' + value;
			body.notificationMethod = 'EMAIL';
		} else if (method === 'sms') {
			requrl = requrl + 'PHONE:' + value;
			body.notificationMethod = 'SMS';
		} else {
			return cb('only email or sms is accepted.');
		}
		requrl = requrl + '/password/request-reset';

		this.requestJSON('POST', requrl, headers, body, cb);
	};
};