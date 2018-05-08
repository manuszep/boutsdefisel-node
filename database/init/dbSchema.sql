CREATE DATABASE IF NOT EXISTS `boutsdefisel` CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `boutsdefisel`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_username` (`username`),
  UNIQUE KEY `key_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;