
(function() {
    var app;
    var self = module.exports = {};
    var clusters = self.clusters = {};

    const timediff = require('timediff');

    self.startManager = function(main) {
        app = main;

        // Status checker
        setInterval(function() {
            for(let clusterName in clusters)
            {
                let cluster = clusters[clusterName];
                // if we haven't received an update in twice as long as the interval, the server isn't responding
                if(Date.now() - cluster.clusterLastUpdate > (app.config.discordStatusInterval * 2 * 1000)) {
                    cluster.clusterStatus = "Offline";
                    cluster.clusterLastLoad = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
                    cluster.clusterUptime = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
                    cluster.clusterPopulation = 0;
                    cluster.clusterStartTime = null;
                }
            }
        }, 15 * 1000)
    };

    self.processNewMetrics = function (metrics)
    {
        let clusterName = metrics.clusterName;
        let cluster = self.clusters[clusterName];

        if(cluster === undefined) {
            cluster = { };
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
            let lastLoadDate = app.utils.dateFromUTSC(metrics.lastLoadingStateTime);
            cluster.clusterLastLoad = timediff(lastLoadDate, Date.now(), 'DHmS');
        }
        else {
            self.clusters[clusterName].clusterStatus = "Offline";
            cluster.clusterStartTime = null;
        }

        cluster.clusterUptime = timediff(cluster.clusterStartTime, Date.now(), 'DHmS');

        console.log("New Metrics: \t " +
                    "Cluster: "   + clusterName               + ", " +
                    "Status: "    + cluster.clusterStatus     + ", " +
                    "Players: "   + cluster.clusterPopulation + ", " +
                    "Last Load: " + app.utils.readableTimeDiff(cluster.clusterLastLoad) + " ago, " +
                    "Uptime: "    + app.utils.readableTimeDiff(cluster.clusterUptime));
    };
}());