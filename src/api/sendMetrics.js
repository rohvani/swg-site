(function() {
    var exports = module.exports = {};

    const timediff = require('timediff');
    const utils = require('../utils');

    exports.clusters = { };

    exports.registerEndpoint = function(app) {
        app.post("/api/sendMetrics", function (req, res) {
            var metrics = req.body;
            clusterName = metrics.clusterName;

            var cluster = exports.clusters[clusterName];
            if(cluster === undefined) {
                cluster = { }
                exports.clusters[clusterName] = cluster;
                exports.clusters[clusterName].clusterStartTime = Date.now();
                cluster.clusterUptime = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
            }

            cluster.clusterStatus = "N/A";
            cluster.clusterLastLoad = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
            cluster.clusterPopulation = metrics.totalPlayerCount;
            cluster.clusterLastUpdate = Date.now();

            if(exports.clusters[clusterName].clusterStartTime == null) {
                cluster.clusterStartTime = Date.now();
            }

            if (metrics.timeClusterWentIntoLoadingState > metrics.lastLoadingStateTime) {
                cluster.clusterStatus = "Loading";
            }
            else if (metrics.lastLoadingStateTime > 0) {
                cluster.clusterStatus = "Online";
                var lastLoadDate = utils.dateFromUTSC(metrics.lastLoadingStateTime);
                cluster.clusterLastLoad = timediff(lastLoadDate, Date.now(), 'DHmS');
            }
            else {
                exports.clusters[clusterName].clusterStatus = "Offline";
                cluster.clusterStartTime = null;
                console.log("offline");
            }

            console.log("New Metrics: \t" +
                "Cluster: "   + clusterName               + ", " +
                "Status: "    + cluster.clusterStatus     + ", " +
                "Players: "   + cluster.clusterPopulation + ", " +
                "Last Load: " + utils.readableTimeDiff(cluster.clusterLastLoad) + " ago, " +
                "Uptime: "    + utils.readableTimeDiff(cluster.clusterUptime));

            res.json('success');
        });
    }
}());
