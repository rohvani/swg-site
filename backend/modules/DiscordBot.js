(function() {
    var app;
    var self = module.exports = {};

    const discord = require('discord.js');
    const client = new discord.Client();
    const config = require('../config.json');
    const utils = require('../utils');
    const timediff = require('timediff');

    self.startManager = function(main) {
        app = main;

        // Status checker
        setInterval(function() {
            for(var clusterName in app.apis.apiMetrics.clusters) {
                let cluster = app.apis.apiMetrics.clusters[clusterName];
                // if we haven't received an update in twice as long as the interval, the server isn't responding
                if(Date.now() - cluster.clusterLastUpdate > (config.discordStatusInterval * 2 * 1000)) {
                    cluster.clusterStatus = "Offline";
                    cluster.clusterLastLoad = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
                    cluster.clusterUptime = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
                    cluster.clusterPopulation = 0;
                    cluster.clusterStartTime = null;
                } else {
                    cluster.clusterUptime = timediff(cluster.clusterStartTime, Date.now(), 'DHmS');
                }
            }
        }, 5 * 1000)

        client.on('ready', () => {
            var channel = client.channels.find("name", config.discordBotChannelName);
            setInterval(function() {
                for(var clusterName in  app.apis.apiMetrics.clusters) {
                    let cluster =  app.apis.apiMetrics.clusters[clusterName];
                    channel.sendMessage(
                        "**Cluster** `"   + clusterName               + "`  " +
                        "**Status** `"    + cluster.clusterStatus     + "`  " +
                        "**Players** `"   + cluster.clusterPopulation + "`  " +
                        "**Last Load** `" + utils.readableTimeDiff(cluster.clusterLastLoad) + " ago`  " +
                        "**Uptime** `"    + utils.readableTimeDiff(cluster.clusterUptime)   + "` ");
                }
            }, config.discordStatusInterval * 1000)
        });
        client.login(config.discordBotToken);
    }
}());