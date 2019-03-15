const express = require("express");
const bodyParser = require("body-parser");

var app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000);

// ---------------------------------------------------------------

var apis = {};
apis.apiAuth = require('./api/auth.js');
apis.apiAuth.registerEndpoint(app);
apis.apiCreateUser = require('./api/createUser.js');
apis.apiCreateUser.registerEndpoint(app);
apis.apiSendMetrics = require('./api/sendMetrics.js');
apis.apiSendMetrics.registerEndpoint(app);

// ---------------------------------------------------------------

const config = require('./config.json');

var managers = {};
managers.discordBot = require('./modules/DiscordBot.js');
managers.serverManager = require('./modules/ServerManager.js');

if(config.discordBot) {
    managers.discordBot.startManager(apis, managers);
}
if(config.restartServer) {
    managers.serverManager.startManager(apis, managers);
}