
(function() {
    var app;
    var self = module.exports = {};

    const crypto = require("crypto");
    const mysql = require('mysql');
    const uuid = require("uuid");


    var userSessions = self.userSessions = { };

    self.startManager = function(main)
    {
        app = main;
    };

    self.isSessionIdValid = function(username, sessionId)
    {
        var userSession = self.userSessions[username];
        if(userSession !== undefined) {
            return userSession.sessionId === sessionId;
        }
        return false;
    };

    self.createAccount = function(username, password, email, callback)
    {
        if(username.length == 0) {
            callback("Tried to create an account with no username", undefined);
            return;
        }

        if(password.length == 0) {
            callback("Tried to create an account with no password", undefined);
            return;
        }

        var salt = crypto.randomBytes(8).toString('hex');

        var user = {
            username : username,
            email: email,
            accesslevel: 'standard',
            password_hash: app.utils.getHash(password, salt),
            password_salt: salt,
        };

        app.database.instance.query("INSERT INTO user_account SET ?", user, function (err, result) {
            if (err) {
                if(err.code == "ER_DUP_ENTRY") {
                    callback("Someone else already registered that username. Please pick a different username.", undefined);
                }
                else {
                    console.error(err);
                }
            }
            else {
                self.loginAccount(username, password, callback);
            }
        });
    };

    // result: null=incorrect password, undefined=account does not exist
    self.loginAccount = function(username, password, callback)
    {
        var sql = "SELECT * FROM user_account WHERE username = " + mysql.escape(username);
        app.database.instance.query(sql, function (err, result)
        {
            if(err) {
                console.log(err);
                callback("An unknown error has occurred, please report this to an administrator", undefined);
            }
            else {
                var message = "Incorrect username or password";
                var user = (result.length >= 1 ? result[0] : undefined);

                if (user !== undefined) {
                    if (user.password_hash !== app.utils.getHash(password, user.password_salt)){
                        user = null;
                    }
                    else {
                        message = "success";
                        user = {
                            userid: user.user_id,
                            username : user.username,
                            sessionid : uuid.v4(),
                            accesslevel : user.accesslevel
                        };
                        userSessions[user.username] = user;
                    }
                }

                callback(message, user);
            }
        });
    };
}());