
(function() {
    var exports = module.exports = {};

    const cp = require("child_process");
    const config = require('../config.json');

    module.exports.startManager = function(apis, managers) {
        setInterval(function() {
            var cluster =  apis.apiSendMetrics.clusters[config.restartClusterName];
            if(cluster !== undefined) {
                if(cluster.clusterStatus === "Offline") {
                    console.log("[****] Restarting server!!!");
                    cp.exec(config.restartCommand, {cwd: config.restartWorkingPath}, function(error,stdout,stderr){ });
                    if(config.discordBot) {
                        var channel = client.channels.find("name", config.discordBotChannelName);
                        channel.sendMessage("@here **Restarting cluster `" + config.restartClusterName + "` due to detected offline status!**");
                    }
                }
            } else {
                console.log("[****] Starting server!!!");
                cp.exec(config.restartCommand, {cwd: config.restartWorkingPath}, function(error,stdout,stderr){
                    console.log(error);
                });
            }
        }, 15 * 1000)
    }
}());