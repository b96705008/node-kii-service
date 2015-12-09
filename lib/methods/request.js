var _ = require('lodash'),
	curl = require('curlrequest'),
	config = require('../config'),
	option = require('../option');

module.exports = function (Kii) {
	/**
	 * Get reqest URL by bucket options 
	 */
	Kii.prototype.getDataReqURLPrefix = function (bucketOpts) {
		var opts = option.parse(bucketOpts),
			scope = opts.scope,
			bucketID = opts.bucketID,
			loginName = opts.loginName,
			userQuery = opts.userQuery,
			reqURL = 'apps/' + this.APP_ID;


		//if (bucketOpts.loginName) scope = 'User';

		if (userQuery) {
			return  reqURL + '/users/';
		} else if (scope === 'Application') {
			return reqURL + '/buckets/' + bucketID + '/';
		} else if (scope === 'User') {
			return reqURL + '/users/LOGIN_NAME:' + loginName + '/buckets/' + bucketID + '/';
		} else {
			return '/';
		}
	};

	/**
	 * Request resource from Kii Cloud
	 */
	Kii.prototype.requestJSON = function (method, requrl, headers, reqData, callback) {
		var options = {
				url: config.API_PREFIX + requrl,
				method: method
			},
			base_headers = {
				'x-kii-appid': this.APP_ID,
		        'x-kii-appkey': this.APP_KEY 
			};

		if (method === 'POST') {
			base_headers['content-type'] = 'application/json';
		} else if (method === 'DELETE') {
			base_headers['Accept'] = 'application/json, application/*+json';
		}
		options.headers = _.extend(base_headers, headers);
		
		//data
		try {
	        options.data = JSON.stringify(reqData);
	    } catch (e) {
	        options.data = null;
	    }

		curl.request(options, function (err, data) {
			if (method === 'DELETE' && !err && !data) return callback(null);
	    	if (err) return callback(err);
	        var jsonData;
	        try {
	            jsonData = JSON.parse(data);
	        } catch (e) {
	        	jsonData = {};
	        }
	        if (jsonData.error) return callback(jsonData.error_description);
	        if (jsonData.errorCode) return callback(jsonData.message);
	        callback(null, jsonData);
	    });
	};

	Kii.prototype.requestObjectBody = function (method, requrl, headers, body, contentType, callback) {
		var options = {
				url: config.API_PREFIX + requrl,
				method: method,	
				data: body	
			},
			base_headers = {
				'x-kii-appid': this.APP_ID,
		        'x-kii-appkey': this.APP_KEY, 
			};

		if(method === 'GET') {
			base_headers['Accept'] = '*/*'
		}
		else if(method === 'PUT'){
			base_headers['Content-Type'] = contentType;
		}

		options.headers = _.extend(base_headers, headers);
		
		curl.request(options, function (err, data) {
			if (err) return callback(err);
			if(method === 'GET') {
				callback(null, data);
			}
			else if(method === 'PUT'){
		        var jsonData;
		        try {
		            jsonData = JSON.parse(data);
		        } catch (e) {
		        	jsonData = {};
		        }
		        if (jsonData.error) return callback(jsonData.error_description);
		        if (jsonData.errorCode) return callback(jsonData.message);
		        callback(null, jsonData);
		    }
	    });
	};

	Kii.prototype.requestFile = function (method, requrl, headers, outputPath, callback) {
		var options = {
				url: config.API_PREFIX + requrl,
				method: method,
				output: outputPath
			},
			base_headers = {
				'x-kii-appid': this.APP_ID,
		        'x-kii-appkey': this.APP_KEY,
		        'Accept': '*/*'
			};
		options.headers = _.extend(base_headers, headers);
		curl.request(options, function (err, data) {
			callback(err || null);
	    });
	};
};