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
			if(err == null) {
				var user = (result.length >= 1 ? result[0] : null);
				callback(err, user);
			} else {
				console.log(err);
			}
		});
	}

	// callback = function(err, user)
	module.exports.createUser = function(username, password, email, callback) {
		var user = { username : username, password_hash: password, password_salt: "aaaa", accesslevel: 'standard' }
		con.query("INSERT INTO user_account SET ?", user, function (err, result) {
			if (err) throw err;
			module.exports.getUser(username, callback);
		});
	}
}());