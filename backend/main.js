const express = require("express");
const bodyParser = require("body-parser");

// ---------------------------------------------------------------

var app = express();
app.use(express.json());
app.use(express.static('../www'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000);

// ---------------------------------------------------------------

var mainApp = {};

mainApp.app = app;
var managers = mainApp.managers = {};
var apis = mainApp.apis = {};
var config = mainApp.config = require('./config.json');
var database = mainApp.database = require("./database.js");
var utils = mainApp.utils = require('./utils');

// ---------------------------------------------------------------

managers.discordBot = require('./managers/DiscordBot.js');
managers.serverManager = require('./managers/ServerManager.js');
managers.userManager = require('./managers/UserManager.js');

// ---------------------------------------------------------------

managers.userManager.startManager(mainApp);

if(config.discordBot) {
    managers.discordBot.startManager(mainApp);
}
if(config.restartServer) {
    managers.serverManager.startManager(mainApp);
}

// ---------------------------------------------------------------

apis.apiLogin = require('./api/login.js');
apis.apiRegister = require('./api/register.js');
apis.apiMetrics = require('./api/metrics.js');

apis.apiLogin.registerEndpoint(mainApp);
apis.apiRegister.registerEndpoint(mainApp);
apis.apiMetrics.registerEndpoint(mainApp);