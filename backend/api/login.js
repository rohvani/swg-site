
(function() {
    var app;
    var self = module.exports = {};

    self.registerEndpoint = function(main) {
        app = main;
        main.app.post("/api/login", function (req, res)
        {
            let login = req.body;

            // there are three different login types
            // 1) a user login by SWG LoginServer with username, password, station id, ip, and a cluster secret key
            // 2) a user login with username and password
            // 3) a user login with session id

            switch(login.type)
            {
                case "loginserver":
                    // @TODO: add cluster secret key verification
                    break;
                case "website":
                    break;
                case "sessionid":
                    if(app.managers.userManager.isSessionIdValid(login.user_name, login.session_id)) {
                        res.send( { message: "success" } );
                    } else {
                        res.send( { message: "Invalid session id" } );
                    }
                    return;
                default:
                    res.send( { message: "Unsupported login type" } );
                    return;
            }

            // @TODO: log login attempt and type

            app.managers.userManager.loginAccount(login.user_name, login.user_password, function(message, user) {
                if (message === "success") {
                    res.send( { message: message, user: user } );
                } else {
                    res.send( { message: message } );
                }
            });
        });
    }
}());