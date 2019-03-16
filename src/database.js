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