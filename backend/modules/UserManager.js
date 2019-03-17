
(function() {
    var exports = module.exports = {};

    var app;

    exports.userSessions = { };

    exports.userIsValid = function (user)
    {
        var userSession = exports.userSessions[user.username];
        if(userSession !== undefined) {
            return user.sessionId === userSession.sessionId;
        }
        return false;
    };
    
    exports.startManager = function(main)
    {
        app = main;
    };
}());