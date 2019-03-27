(function() {
    var self = module.exports = {};

    var app;

    self.registerEndpoint = function(main) {
        app = main;

        if(app.config.webRegistration)
        {
            app.app.post("/api/register", function (req, res)
            {
                let login = req.body;

                app.managers.userManager.createAccount(login.user_name, login.user_password, login.user_email, function(message, user) {
                    if (message === "success") {
                        res.send( { message: message, user: user } );
                    } else {
                        res.send( { message: message } );
                    }
                })
            });
        }
    }
}());