
(function() {
    var app;
    var self = module.exports = {};

    const cp = require("child_process");

    self.startManager = function(main) {
        app = main;
        setInterval(function() {
            var cluster =  app.apis.apiMetrics.clusters[app.config.restartClusterName];
            if(cluster !== undefined) {
                if(cluster.clusterStatus === "Offline") {
                    console.log("[****] Restarting server!!!");
                    cp.exec(app.config.restartCommand, {cwd: app.config.restartWorkingPath}, function(error,stdout,stderr){ });
                    if(app.config.discordBot) {
                        var channel = client.channels.find("name", app.config.discordBotChannelName);
                        channel.sendMessage("@here **Restarting cluster `" + app.config.restartClusterName + "` due to detected offline status!**");
                    }
                }
            } else {
                console.log("[****] Starting server!!!");
                cp.exec(app.config.restartCommand, {cwd: app.config.restartWorkingPath}, function(error,stdout,stderr){
                    console.log(error);
                });
            }
        }, 15 * 1000)
    }
}());