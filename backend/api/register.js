(function() {
    var self = module.exports = {};

    var app;

    self.registerEndpoint = function(main) {
        app = main;

        if(app.config.webRegistration)
        {
            app.app.post("/api/register", function (req, res)
            {
                var login = req.body;

                app.managers.userManager.createAccount(login.user_name, login.user_password, login.user_email, function(err, user) {
                    if(err)
                    {
                        res.send( { message: err } );
                    }
                    else {
                        app.apis.apiLogin.loginResponseHandler(res, err, user, login);
                    }
                })
            });
        }
    }
}());