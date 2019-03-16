
(function() {
    var exports = module.exports = {};

    const mysql = require('mysql');
    const uuid = require("uuid");

    var app;

    // result: null=incorrect password, undefined=account does not exist
    module.exports.loginAccount = function(username, password, callback)
    {
        var sql = "SELECT * FROM user_account WHERE username = " + mysql.escape(username);
        app.database.instance.query(sql, function (err, result)
        {
            if(err != null) console.log(err);
            else {
                var user = (result.length >= 1 ? result[0] : undefined);

                if (user !== undefined) {
                    if (user.password_hash !== app.utils.getHash(password, user.password_salt)) {
                        user = null;
                    } else {
                        user = {
                            username : user.username,
                            sessionId : uuid.v4(),
                            accesslevel : user.accesslevel
                        };
                        app.managers.userManager.userSessions[user.username] = user;
                    }
                }

                callback(err, user);
            }
        });

    };

    module.exports.loginResponseHandler = function(res, err, user, login)
    {
        if(err != null) {
            res.send( { message: 'An error has been encountered, please try again.' } );
            return
        }

        if (user !== undefined)
        {
            if(user !== null) {
                console.log("New Login: \t User: " + login.user_name + ", IP: "   + login.ip);
                res.send( { message: 'success', user: user } );
            }
            else {
                console.log("Failed Login: \t User: " + login.user_name + ", IP: "   + login.ip);
                res.send( { message: 'Invalid password' } );
            }
        }
        else {
            if ( app.config.autoRegistration )
            {
                app.apis.apiRegister.createAccount(login.user_name, login.user_password, "", function(err, user){
                    module.exports.loginResponseHandler(res, err, user, login);
                });
            }
            else {
                res.send( { message: 'Unknown username' } );
            }
        }
    };

    module.exports.registerEndpoint = function(main) {
        app = main;
        main.app.post("/api/login", function (req, res) {
            var login = req.body;
            module.exports.loginAccount(login.user_name, login.user_password, function(err, user){
                module.exports.loginResponseHandler(res, err, user, login);
            });
        });
    }
}());