const express = require("express");
const bodyParser = require("body-parser");
const timediff = require('timediff');
const crypto = require('crypto');

const CONFIG = require('./config.json');
const database = require("./database.js");

// ---------------------------------------------------------------

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

// ---------------------------------------------------------------

app.post("/api/auth", function (req, res) {
	var login = req.body;
	
	console.log("New Login: \t" +
				"User: " + login.user_name + ", " + 
				"IP: "   + login.ip);

	database.getUser(login.user_name, function(err, user) {
		if (user !== undefined) {
			if (user.password_hash === getHash(login.user_password, user.password_salt)) {
				res.send( { message: 'success' } );
			} else {
				res.send( { message: 'Invalid password' } );
			}
		} else {
			// @TODO: cfg option to allow auto account creation if account doesnt exist 
			res.send( { message: 'Unknown username' } );
		}
	});
});

app.post("/api/createUser", function (req, res) {
	// @TODO: implement
	res.json('success');
});

app.post("/api/sendMetrics", function (req, res) {
	var metrics = req.body;
	
	var clusterName = metrics.clusterName;
	var clusterStatus = "N/A";
	var clusterUptime = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
	
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
				"Cluster: "     + clusterName               + ", " + 
				"Status: "      + clusterStatus             + ", " + 
				"Players: "     + metrics.totalPlayerCount  + ", " + 
				"Last Load: "   + JSON.stringify(clusterUptime));
	
	res.json('success');
});

// ---------------------------------------------------------------

app.listen(3000);