var _ = require('lodash'),
	async = require('async'),
	validator = require('../validator');
	confg = require('../config');

module.exports = function (Kii) {
	//== Query ==
	Kii.prototype.queryObjects = function (bucketOpts, body, cb, paginationKey) {
		var requrl = this.getDataReqURLPrefix(bucketOpts) + 'query',
			headers = {
				Authorization: 'Bearer ' + this.adminToken.access_token,
				'content-type': confg.BUCKET_QUERY_CONTENT_TYPE
			};

		if(paginationKey) {
			body['paginationKey'] = paginationKey;
		}

		this.requestJSON('POST', requrl, headers, body, cb);
	};

	//== Create ==
	Kii.prototype.createObject = function (bucketOpts, body, cb) {
		var requrl = this.getDataReqURLPrefix(bucketOpts) + 'objects',
			headers = {
				Authorization: 'Bearer ' + this.adminToken.access_token,
				'content-type': this.OBJECT_CREATE_CONTENT_TYPE
			};
		this.requestJSON('POST', requrl, headers, body, function (err, data) {
			if (!err) {
				data._id = data.objectID;
				data = _.extend(data, body);
			}
			cb(err, data);
		});
	};

	Kii.prototype.safeCreateObject = function (bucketOpts, body, cb) {
		var that = this;

		async.waterfall([
			function (callback) {
				that.verifyKiiData(bucketOpts, body, callback);
			},
			function (body, callback) {
				that.createObject(bucketOpts, body, callback);	
			}
		], cb);
	};

	//== Retrieve ==
	Kii.prototype.retrieveObject = function (bucketOpts, objectID, cb) {
		var requrl = this.getDataReqURLPrefix(bucketOpts) + 'objects/' + objectID,
			headers = {
				Authorization: 'Bearer ' + this.adminToken.access_token
			};
		this.requestJSON('GET', requrl, headers, null, cb);
	};

	//== Update ==
	Kii.prototype.updateObject = function (bucketOpts, objectID, body, cb) {
		var requrl = this.getDataReqURLPrefix(bucketOpts) + 'objects/' + objectID,
			headers = {
				Authorization: 'Bearer ' + this.adminToken.access_token,
				'X-HTTP-Method-Override': 'PATCH' 
			};
		this.requestJSON('POST', requrl, headers, body, cb);
	};

	Kii.prototype.safeUpdateObject = function(bucketOpts, objectID, body, cb) {
		var schema = this.getSchema(bucketOpts),
			result = validator.validateJSON(schema, body, true);
		//verify schema
		if (!result.success) return cb(result.err);
		this.updateObject(bucketOpts, objectID, result.doc, cb);
	};

	//== Delete ==
	Kii.prototype.deleteObject = function (bucketOpts, objectID, cb) {
		var requrl = this.getDataReqURLPrefix(bucketOpts) + 'objects/' + objectID,
			headers = {
				Authorization: 'Bearer ' + this.adminToken.access_token
			};
		this.requestJSON('DELETE', requrl, headers, null, cb);
	};
};