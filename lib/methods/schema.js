var fs = require('fs'),
	pathModule = require('path'),
	option = require('../option');

function initSchema (schema, filePath) {
	var bucketID = schema.bucketID;

	if (!schema.scope) {
		schema.scope = 'Application';
	}
	if (!bucketID) {
		bucketID = pathModule.basename(filePath);
		bucketID = bucketID.split(',')[0];
		schema.bucketID = bucketID;
	}
	schema.key = schema.scope + '/' + schema.bucketID;
}

module.exports = function (Kii) {

	Kii.prototype.addSchema = function (filePath) {
		var schema = require(filePath);
		initSchema(schema, filePath);
		this.schemas[schema.key] = schema;
	};

	Kii.prototype.loadSchemas = function (path) {
		var that = this,
			stat = fs.lstatSync(path),
			schema,
			files;

		if (!stat.isDirectory()) {
			this.addSchema(path);
		} else {
			files = fs.readdirSync(path);
			files.forEach(function (file) {
				var subPath = pathModule.join(path, file);
				that.loadSchemas(subPath);
			});
		}
	};

	Kii.prototype.getSchema = function (bucketOpts) {
		var opts = option.parse(bucketOpts),
			scope = opts.scope,
			bucketID = opts.bucketID;

		return this.schemas[scope + '/' + bucketID];
	};
};