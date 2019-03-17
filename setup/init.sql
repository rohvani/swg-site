DROP DATABASE IF EXISTS swgsite;
CREATE DATABASE swgsite;
USE swgsite;

DROP TABLE IF EXISTS `user_account`;
CREATE TABLE `user_account` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `station_id` varchar(16) NOT NULL,
  `username` varchar(16) NOT NULL,
  `email` varchar(255) NOT NULL,
  `accesslevel` varchar(16) NOT NULL,
  `password_salt` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
