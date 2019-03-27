(function() {
    var app;
    var self = module.exports = {};

    const discord = require('discord.js');
    const client = new discord.Client();

    self.sendMessage = function(channelName, message) {
        let channel = client.channels.find("name", channelName);
        channel.sendMessage(message);
    };

    self.startManager = function(main) {
        app = main;

        client.on('ready', () =>
        {
            setInterval(function()
            {
                for(let clusterName in app.managers.metricsManager.clusters)
                {
                    let cluster =  app.managers.metricsManager.clusters[clusterName];
                    self.sendMessage(app.config.discordBotChannelName,
                        "**Cluster** `"   + clusterName      + "`  " +
                        "**Status** `"    + cluster.clusterStatus     + "`  " +
                        "**Players** `"   + cluster.clusterPopulation + "`  " +
                        "**Last Load** `" + app.utils.readableTimeDiff(cluster.clusterLastLoad) + " ago`  " +
                        "**Uptime** `"    + app.utils.readableTimeDiff(cluster.clusterUptime)   + "`");
                }
            }, app.config.discordStatusInterval * 1000)
        });
        client.login(app.config.discordBotToken);
    }
}());