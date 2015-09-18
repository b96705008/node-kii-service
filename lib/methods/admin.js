module.exports = function (Kii) {
	/**
	 * Set admin token manually
	 */
	Kii.prototype.setAdminToken = function (token) {
		this.adminToken.access_token = token;
	};

	/**
	 * Get admin token
	 */
	Kii.prototype.getAdminToken = function (clientId, secret, cb) {
		var that = this,
			reqData = {
                client_id: clientId,
                client_secret: secret
            };
		this.requestJSON('POST', 'oauth2/token', {}, reqData, function (err, data) {
			if (err) {
				console.error(err);
			} else {
				that.adminToken = data;
			}
			if (cb) cb(err, data);
		});
	};
};