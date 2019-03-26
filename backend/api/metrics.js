(function() {
    var self = module.exports = {};

    const timediff = require('timediff');

    self.clusters = { };

    var app;

    self.registerEndpoint = function(main) {
        app = main;
        app.app.post("/api/metrics", function (req, res) {
            var metrics = req.body;
            clusterName = metrics.clusterName;

            var cluster = self.clusters[clusterName];
            if(cluster === undefined) {
                cluster = { }
                self.clusters[clusterName] = cluster;
                self.clusters[clusterName].clusterStartTime = Date.now();
                cluster.clusterUptime = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
            }

            cluster.clusterStatus = "N/A";
            cluster.clusterLastLoad = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
            cluster.clusterPopulation = metrics.totalPlayerCount;
            cluster.clusterLastUpdate = Date.now();

            if(self.clusters[clusterName].clusterStartTime == null) {
                cluster.clusterStartTime = Date.now();
            }

            if (metrics.timeClusterWentIntoLoadingState > metrics.lastLoadingStateTime) {
                cluster.clusterStatus = "Loading";
            }
            else if (metrics.lastLoadingStateTime > 0) {
                cluster.clusterStatus = "Online";
                var lastLoadDate = app.utils.dateFromUTSC(metrics.lastLoadingStateTime);
                cluster.clusterLastLoad = timediff(lastLoadDate, Date.now(), 'DHmS');
            }
            else {
                self.clusters[clusterName].clusterStatus = "Offline";
                cluster.clusterStartTime = null;
                console.log("offline");
            }

            cluster.clusterUptime = timediff(cluster.clusterStartTime, Date.now(), 'DHmS');

            console.log("New Metrics: \t " +
                "Cluster: "   + clusterName               + ", " +
                "Status: "    + cluster.clusterStatus     + ", " +
                "Players: "   + cluster.clusterPopulation + ", " +
                "Last Load: " + app.utils.readableTimeDiff(cluster.clusterLastLoad) + " ago, " +
                "Uptime: "    + app.utils.readableTimeDiff(cluster.clusterUptime));

            res.json('success');
        });
        app.app.get("/api/metrics", function (req, res) {
            res.json(self.clusters);
        });
    }
}());
