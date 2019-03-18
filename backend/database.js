(function() {
	var self = module.exports = {};
	
	const config = require('./config.json');
	const mysql = require('mysql');

	var con = self.instance  = mysql.createConnection({
		host: config.dbHost,
		database: config.dbName,
		user: config.dbUser,
		password: config.dbPassword
	});
}());