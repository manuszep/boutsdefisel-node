CREATE DATABASE IF NOT EXISTS `boutsdefisel` CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `boutsdefisel`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `usernameCanonical` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `emailCanonical` varchar(255) NOT NULL,
  `enabled` boolean NOT NULL,
  `locked` boolean NOT NULL,
  `salt` varchar(255),
  `password` varchar(255),
  `lastLogin` datetime,
  `confirmationToken` varchar(255),
  `passwordRequestedAt` datetime,
  `role` varchar(50) NOT NULL,
  `street` varchar(100),
  `streetNumber` varchar(15),
  `streetBox` varchar(15),
  `city` varchar(100),
  `zip` smallint,
  `phone` varchar(15),
  `mobile` varchar(15),
  `mobile2` varchar(15),
  `balance` decimal(5,2),
  `picture` varchar(255),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_usernameCanonical` (`usernameCanonical`),
  UNIQUE KEY `key_emailCanonical` (`emailCanonical`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `lvl` int(11) NOT NULL,
  `parent` int(11),
  `slug` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `body` text,
  `user` int(11) NOT NULL,
  `type` int(2) NOT NULL,
  `domain` int(2) NOT NULL,
  `category` int(11) NOT NULL,
  `picture` varchar(255),
  `expiresAt` datetime,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_slug` (`slug`),
  FOREIGN KEY (`user`) REFERENCES users(`id`),
  FOREIGN KEY (`category`) REFERENCES categories(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `exchanges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `creditUser` int(11) NOT NULL,
  `debitUser` int(11) NOT NULL,
  `message` text,
  `amount` float(4,2) NOT NULL,
  `hidden` boolean NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`creditUser`) REFERENCES users(`id`),
  FOREIGN KEY (`debitUser`) REFERENCES users(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;