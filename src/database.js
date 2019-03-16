(function() {
	var exports = module.exports = {};
	
	const config = require('./config.json');
	const mysql = require('mysql');

	var con = exports.instance  = mysql.createConnection({
		host: config.dbHost,
		database: config.dbName,
		user: config.dbUser,
		password: config.dbPassword
	});
}());