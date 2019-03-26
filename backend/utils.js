(function() {
    var exports = module.exports = {};

    const crypto = require('crypto');

    module.exports.getHash = function(string, salt) {
        var hash = crypto.createHash('sha1').update(string + salt).digest();
        var salt = Buffer.from(salt, "utf8")
        return Buffer.concat([hash, salt]).toString('base64');
    };

    module.exports.dateFromUTSC = function(utscTime) {
        var d = new Date(0);
        d.setUTCSeconds(utscTime);
        return d;
    };

    module.exports.readableTimeDiff = function(timeDiff) {
        var result = "";
        if(timeDiff.days > 0) result += timeDiff.days + " days, ";
        if(timeDiff.hours > 0) result += timeDiff.hours + " hours, ";
        if(timeDiff.minutes > 0) result += timeDiff.minutes + " minutes, ";
        return result + timeDiff.seconds + " seconds";
    };
}());


