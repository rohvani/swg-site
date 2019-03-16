(function() {
    var exports = module.exports = {};

    const crypto = require("crypto");

    var app;

    exports.createAccount = function(username, password, email, callback)
    {
        var salt = crypto.randomBytes(8).toString('hex');

        var user = {
            username : username,
            password_hash: app.utils.getHash(password, salt),
            password_salt: salt,
            accesslevel: 'standard'
        };

        app.database.instance.query("INSERT INTO user_account SET ?", user, function (err, result) {
            if (err) {
                callback(err, undefined);
            }
            else {
                app.apis.apiLogin.loginAccount(username, password, callback);
            }
        });
    };

    exports.registerEndpoint = function(main) {
        app = main;

        if(app.config.webRegistration) {
            app.app.post("/api/register", function (req, res) {
                var login = req.body;
                module.exports.createAccount(login.user_name, login.user_password, login.user_email, function(err, user){
                    app.apis.apiLogin.loginResponseHandler(res, err, user, login);
                })
            });
        }
    }
}());