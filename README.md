# SWG Site Suite
Star Wars: Galaxies authentication/community suite, written in node.js

## Instructions (Manual)
1. Install Debian 9 x64-bit (I used `debian-9.4.0-amd64-netinst.iso`)
2. Run `sudo apt-get update`
3. Run `sudo apt-get install -y curl mysql-server`
4. Run `curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -`
5. Run `sudo apt-get install -y nodejs`
6. Run `npm install express`
 
## Instructions (Automated)
1. Install Debian 9 x64-bit (I used `debian-9.4.0-amd64-netinst.iso`)
2. Run `sudo apt-get update`
3. Run `./setup.sh`

## Setting up MySQL
1. First you must create the database in MySQL that the site will use 
2. In terminal, `$ mysql -u root -p` 
3. In the MySQL tool, `mysql> CREATE DATABASE database_name;`
4. Back in terminal, `$ mysql -u username -p database_name < docs/init.sql`

## Configuration
1. Copy `docs/config.json.example` to `src/config.json`
2. Update `src/config.json` with your settings
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

## Running
1. After setting up the database and your configuration file, `./run.sh`

## Credits
* Seefo