
(function() {
    var app;
    var self = module.exports = {};

    const cp = require("child_process");

    self.startServer = function() {
        cp.exec(app.config.restartCommand, {cwd: app.config.restartWorkingPath}, function (error, stdout, stderr) {
            console.log(error);
        });
    };

    self.startManager = function(main) {
        app = main;

        setInterval(function () {
            let cluster =  app.managers.metricsManager.clusters[app.config.restartClusterName];
            if(cluster !== undefined)
            {
                if(cluster.clusterStatus === "Offline")
                {
                    console.log("[****] Restarting server!!!");
                    self.startServer();
                    // @TODO: send message to discord manager if enabled
                }
            } else {
                console.log("[****] Starting server!!!");
                self.startServer();
            }
        }, 15 * 1000)
    }
}());