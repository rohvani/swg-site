(function() {
    var exports = module.exports = {};
    module.exports.registerEndpoint = function(app) {
        app.post("/api/createUser", function (req, res) {
            // @TODO: implement
            res.json('success');
        });
    }
}());