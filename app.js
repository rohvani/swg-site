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

var clusters = { };

app.post("/api/sendMetrics", function (req, res) {
	var metrics = req.body;
	clusterName = metrics.clusterName;

	var cluster = clusters[clusterName];
	if(cluster === undefined) { 
		cluster = { }
		clusters[clusterName] = cluster;
		clusters[clusterName].clusterStartTime = Date.now();
		cluster.clusterUptime = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
	}

	cluster.clusterStatus = "N/A";
	cluster.clusterLastLoad = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
	cluster.clusterPopulation = metrics.totalPlayerCount;
	cluster.clusterLastUpdate = Date.now();

	if(clusters[clusterName].clusterStartTime == null) {
		cluster.clusterStartTime = Date.now();
	}

	if (metrics.timeClusterWentIntoLoadingState > metrics.lastLoadingStateTime) {
		cluster.clusterStatus = "Loading";
	}
	else if (metrics.lastLoadingStateTime > 0) {
		cluster.clusterStatus = "Online"; 
		var lastLoadDate = dateFromUTSC(metrics.lastLoadingStateTime);
		cluster.clusterLastLoad = timediff(lastLoadDate, Date.now(), 'DHmS');
	}
	else { 
		clusters[clusterName].clusterStatus = "Offline";
		cluster.clusterStartTime = null;
		console.log("offline");
	}

	console.log("New Metrics: \t" +
				"Cluster: "   + clusterName               + ", " + 
				"Status: "    + cluster.clusterStatus     + ", " + 
				"Players: "   + cluster.clusterPopulation + ", " + 
				"Last Load: " + readableTimeDiff(cluster.clusterLastLoad) + " ago, " +
				"Uptime: "    + readableTimeDiff(cluster.clusterUptime));

	res.json('success');
});

// ---------------------------------------------------------------

if(CONFIG.discordBot) {

	// Status checker
	setInterval(function() {
		for(var clusterName in clusters) {
			let cluster = clusters[clusterName];
			// if we haven't received an update in twice as long as the interval, the server isn't responding
			if(Date.now() - cluster.clusterLastUpdate > (CONFIG.discordStatusInterval * 2 * 1000)) {
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
		var channel = client.channels.find("name", CONFIG.discordBotChannelName);
		setInterval(function() {
			for(var clusterName in clusters) {
				let cluster = clusters[clusterName];
				channel.sendMessage(
						"**Cluster** `"   + clusterName               + "`  " + 
						"**Status** `"    + cluster.clusterStatus     + "`  " + 
						"**Players** `"   + cluster.clusterPopulation + "`  " + 
						"**Last Load** `" + readableTimeDiff(cluster.clusterLastLoad) + " ago`  " + 
						"**Uptime** `"    + readableTimeDiff(cluster.clusterUptime)   + "` ");
			}
		}, CONFIG.discordStatusInterval * 1000)
	});


	client.login(CONFIG.discordBotToken);
}

// ---------------------------------------------------------------

if(CONFIG.restartServer) {
	var cp = require("child_process");

	setInterval(function() {
		var cluster = clusters[CONFIG.restartClusterName];
		if(cluster !== undefined) {
			if(cluster.clusterStatus === "Offline") {
				console.log("[****] Restarting server!!!");
				cp.exec(CONFIG.restartCommand, {cwd: CONFIG.restartWorkingPath}, function(error,stdout,stderr){ });
				if(CONFIG.discordBot) {
					var channel = client.channels.find("name", CONFIG.discordBotChannelName);
					channel.sendMessage("@here **Restarting cluster `" + CONFIG.restartClusterName + "` due to detected offline status!**");
				}
			}
		} else {
			console.log("[****] Starting server!!!");
			cp.exec(CONFIG.restartCommand, {cwd: CONFIG.restartWorkingPath}, function(error,stdout,stderr){ });
		}
	}, 60 * 1000)
}

// ---------------------------------------------------------------

app.listen(3000);