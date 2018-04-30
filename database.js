(function() {
	var exports = module.exports = {};
	
	const CONFIG = require('./config.json');
	const mysql = require('mysql');
	
	var con = mysql.createConnection({
		host: CONFIG.dbHost,
		database: CONFIG.dbName,
		user: CONFIG.dbUser,
		password: CONFIG.dbPassword
	});
	
	// callback = function(err, user)
	module.exports.getUser = function(username, callback) {
		var sql = "SELECT * FROM user_account WHERE username = " + mysql.escape(username);
		con.query(sql, function (err, result) {
			var user = result[0];
			callback(err, user);
		});
	}
	
	// callback = function(err, user)
	module.exports.createUser = function(username, callback) {
		// @TODO: implement
	}
}());