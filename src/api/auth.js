
(function() {
    var exports = module.exports = {};

    const config = require('../config.json');
    const database = require("../database.js");
    const utils = require('../utils');

    module.exports.registerEndpoint = function(app) {
        app.post("/api/auth", function (req, res) {
            var login = req.body;

            console.log("New Login: \t" +
                "User: " + login.user_name + ", " +
                "IP: "   + login.ip);

            var loginHandler = function (err, user) {
                if (user !== undefined && user !== null) {
                    if (user.password_hash === utils.getHash(login.user_password, user.password_salt)) {
                        res.send( { message: 'success' } );
                    } else {
                        res.send( { message: 'Invalid password' } );
                    }
                } else {
                    if ( config.autoRegistration ) {
                        database.createUser(login.user_name, utils.getHash(login.user_password, "aaaa"), "@todo:email", loginHandler);
                    } else {
                        res.send( { message: 'Unknown username' } );
                    }
                }
            }
            database.getUser(login.user_name, loginHandler);
        });
    }
}());