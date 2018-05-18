const express = require("express");
const bodyParser = require("body-parser");
const timediff = require('timediff');
const crypto = require('crypto');

const CONFIG = require('./config.json');
const database = require("./database.js");

const Discord = require('discord.js');

// ---------------------------------------------------------------

const client = new Discord.Client();

var app = express();

app.use(express.json());
app.use(express.static('public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---------------------------------------------------------------

function getHash(string, salt) {
	var hash = crypto.createHash('sha1').update(string + salt).digest();
	var salt = Buffer.from(salt, "utf8")
	return Buffer.concat([hash, salt]).toString('base64');
}

function dateFromUTSC(utscTime) {
	var d = new Date(0);
	d.setUTCSeconds(utscTime);
	return d;
}

function readableTimeDiff(timeDiff) {
	var result = "";
	if(timeDiff.days > 0) result += timeDiff.days + " days, ";
	if(timeDiff.hours > 0) result += timeDiff.hours + " hours, ";
	if(timeDiff.minutes > 0) result += timeDiff.minutes + " minutes, ";
	return result + timeDiff.seconds + " seconds";
}

// ---------------------------------------------------------------

app.post("/api/auth", function (req, res) {
	var login = req.body;
	
	console.log("New Login: \t" +
				"User: " + login.user_name + ", " + 
				"IP: "   + login.ip);

	var loginHandler = function (err, user) {
		if (user !== undefined && user !== null) {
			if (user.password_hash === getHash(login.user_password, user.password_salt)) {
				res.send( { message: 'success' } );
			} else {
				res.send( { message: 'Invalid password' } );
			}
		} else {
			if ( CONFIG.autoRegistration ) {
				database.createUser(login.user_name, getHash(login.user_password, "aaaa"), "@todo:email", loginHandler);
			} else { 
				res.send( { message: 'Unknown username' } );
			}
		}
	}

	database.getUser(login.user_name, loginHandler);
});

app.post("/api/createUser", function (req, res) {
	// @TODO: implement
	res.json('success');
});

var clusterName = "N/A";
var clusterStatus = "N/A";
var clusterUptime = "N/A";
var clusterPopulation = "N/A";

app.post("/api/sendMetrics", function (req, res) {
	var metrics = req.body;

	clusterName = metrics.clusterName;
	clusterStatus = "N/A";
	clusterUptime = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
	clusterPopulation = metrics.totalPlayerCount;

	if (metrics.timeClusterWentIntoLoadingState > metrics.lastLoadingStateTime) {
		clusterStatus = "Loading";
	}
	else if (metrics.lastLoadingStateTime > 0) {
		clusterStatus = "Online"; 
		var lastLoadDate = dateFromUTSC(metrics.lastLoadingStateTime);
		clusterUptime = timediff(lastLoadDate, Date.now(), 'DHmS');
	}
	else { 
		clusterStatus = "Offline"; 
	}

	console.log("New Metrics: \t" +
				"Cluster: "   + clusterName       + ", " + 
				"Status: "    + clusterStatus     + ", " + 
				"Players: "   + clusterPopulation + ", " + 
				"Last Load: " + readableTimeDiff(clusterUptime) + " ago");

	res.json('success');
});

// ---------------------------------------------------------------

client.on('ready', () => {
	var channel = client.channels.find("name", CONFIG.discordBotChannelName);
	setInterval(function() {
		channel.sendMessage(
				"**Cluster** `"   + clusterName       + "`  " + 
				"**Status** `"    + clusterStatus     + "`  " + 
				"**Players** `"   + clusterPopulation + "`  " + 
				"**Last Load** `" + readableTimeDiff(clusterUptime) + " ago`");
	}, CONFIG.discordStatusInterval * 1000)
});

client.login(CONFIG.discordBotToken);

// ---------------------------------------------------------------

app.listen(3000);