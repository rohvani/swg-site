(function() {
    var app;
    var self = module.exports = {};

    self.registerEndpoint = function(main) {
        app = main;

        app.app.post("/api/metrics", function (req, res) {
            let metrics = req.body;
            console.log(JSON.stringify(metrics));
            // @TODO: add cluster secret key verification
            app.managers.metricsManager.processNewMetrics(metrics);
            res.json('success');
        });

        app.app.get("/api/metrics", function (req, res) {
            res.json(app.managers.metricsManager.clusters);
        });
    }
}());
