CREATE DATABASE IF NOT EXISTS `boutsdefisel` CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `boutsdefisel`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `usernameCanonical` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `emailCanonical` varchar(255) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `salt` varchar(255),
  `password` varchar(255),
  `lastLogin` datetime,
  `confirmationToken` varchar(255),
  `passwordRequestedAt` datetime,
  `role` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_usernameCanonical` (`usernameCanonical`),
  UNIQUE KEY `key_emailCanonical` (`emailCanonical`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
