# SWG Site Suite
Star Wars: Galaxies authentication/community suite, written in node.js

## Instructions (Automated)
1. Install Debian 9 x64-bit (I used `debian-9.4.0-amd64-netinst.iso`)
2. Run `sudo apt-get update`
3. Run `./setup/dependencies.sh`

## Setting up MySQL
1. The MySQL database can be created and imported via running `cd setup && ./setup_database.sh`

## Configuration
1. Copy `setup/config.json.example` to `backend/config.json`
2. Update `backend/config.json` with your settings
3. Update SWG game server configs with below settings; *make sure you replace 
   the port and IP with where it's actually listening!*
```
[CentralServer]
metricsDataURL=http://127.0.0.1:3000/api/metrics
webUpdateIntervalSeconds=5

[LoginServer]
externalAuthURL=http://127.0.0.1:3000/api/login
useExternalAuth=true
useJsonWebApi=true
```

## Building
1. To build the project, run `./build.sh`

## Running
1. After setting up the database and your configuration file, `./run.sh`

## Credits
* Seefo