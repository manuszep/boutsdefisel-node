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
  `lft` int(11) NOT NULL,
  `rgt` int(11) NOT NULL,
  `parent` int(11),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime,
  PRIMARY KEY (`id`)
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

INSERT INTO categories (title, lft, rgt, parent, createdAt, updatedAt, deletedAt) VALUES ("root", 0, 1, NULL, NOW(), NOW(), NULL);

CREATE VIEW `vw_lftrgt` AS select `categories`.`lft` AS `lft` from `categories` union select `categories`.`rgt` AS `rgt` from `categories`

DELIMITER $$

CREATE PROCEDURE `r_tree_traversal`(

  IN ptask_type VARCHAR(10),
  IN pnode_id INT,
  IN pparent_id INT,
  IN title VARCHAR(255),
  IN createdAt DATETIME,
  IN updatedAt DATETIME,
  IN deletedAt DATETIME

)
BEGIN

  DECLARE new_lft, new_rgt, width, has_leafs, superior, superior_parent, old_lft, old_rgt, parent_rgt, subtree_size SMALLINT;

  CASE ptask_type

    WHEN 'insert' THEN

      SELECT rgt INTO new_lft FROM categories WHERE id = pparent_id;
      UPDATE categories SET rgt = rgt + 2 WHERE rgt >= new_lft;
      UPDATE categories SET lft = lft + 2 WHERE lft > new_lft;
      INSERT INTO categories (title, lft, rgt, parent, createdAt, updatedAt, deletedAt) VALUES (title, new_lft, (new_lft + 1), pparent_id, createdAt, updatedAt, deletedAt);
        SELECT LAST_INSERT_ID();

    WHEN 'delete' THEN

      SELECT lft, rgt, (rgt - lft), (rgt - lft + 1), parent
        INTO new_lft, new_rgt, has_leafs, width, superior_parent
        FROM categories WHERE id = pnode_id;

      DELETE FROM tree_content WHERE id = pnode_id;

      IF (has_leafs = 1) THEN
        DELETE FROM categories WHERE lft BETWEEN new_lft AND new_rgt;
        UPDATE categories SET rgt = rgt - width WHERE rgt > new_rgt;
        UPDATE categories SET lft = lft - width WHERE lft > new_rgt;
      ELSE
        DELETE FROM categories WHERE lft = new_lft;
        UPDATE categories SET rgt = rgt - 1, lft = lft - 1, parent = superior_parent
          WHERE lft BETWEEN new_lft AND new_rgt;
        UPDATE categories SET rgt = rgt - 2 WHERE rgt > new_rgt;
        UPDATE categories SET lft = lft - 2 WHERE lft > new_rgt;
      END IF;

    WHEN 'move' THEN

      IF (pnode_id != pparent_id) THEN
        CREATE TEMPORARY TABLE IF NOT EXISTS working_tree_map (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `title` varchar(255) NOT NULL,
          `lft` int(11) NOT NULL,
          `rgt` int(11) NOT NULL,
          `parent` int(11),
          `createdAt` datetime NOT NULL,
          `updatedAt` datetime NOT NULL,
          `deletedAt` datetime,
          PRIMARY KEY (`id`)
        );

        INSERT INTO working_tree_map (id, title, lft, rgt, parent, createdAt, updatedAt, deletedAt)
          SELECT t1.id, t1.title,
            (t1.lft - (SELECT MIN(lft) FROM categories WHERE id = pnode_id)) AS lft,
            (t1.rgt - (SELECT MIN(lft) FROM categories WHERE id = pnode_id)) AS rgt,
          t1.parent, t1.createdAt, t1.updatedAt, t1.deletedAt
          FROM categories AS t1, categories AS t2
          WHERE t1.lft BETWEEN t2.lft AND t2.rgt AND t2.id = pnode_id;

        DELETE FROM categories WHERE id IN (SELECT id FROM working_tree_map);

        SELECT rgt INTO @parent_rgt FROM categories WHERE id = pparent_id;
        SET @subtree_size = (SELECT (MAX(rgt) + 1) FROM working_tree_map);

        UPDATE categories
          SET lft = (CASE WHEN lft > @parent_rgt THEN lft + @subtree_size ELSE lft END),
              rgt = (CASE WHEN rgt >= @parent_rgt THEN rgt + @subtree_size ELSE rgt END)
          WHERE rgt >= @parent_rgt;

        INSERT INTO categories (id, title, lft, rgt, parent, createdAt, updatedAt, deletedAt)
          SELECT id, title, lft + @parent_rgt, rgt + @parent_rgt, parent, createdAt, updatedAt, deletedAt
          FROM working_tree_map;

        UPDATE categories
          SET lft = (SELECT COUNT(*) FROM vw_lftrgt AS v WHERE v.lft <= categories.lft),
              rgt = (SELECT COUNT(*) FROM vw_lftrgt AS v WHERE v.lft <= categories.rgt);

        DELETE FROM working_tree_map;
        UPDATE categories SET parent = pparent_id WHERE id = pnode_id;
      END IF;

    WHEN 'order' THEN

      SELECT lft, rgt, (rgt - lft + 1), parent INTO old_lft, old_rgt, width, superior
        FROM categories WHERE id = pnode_id;

      SELECT parent INTO superior_parent FROM categories WHERE id = pparent_id;

      IF (superior = superior_parent) THEN
        SELECT (rgt + 1) INTO new_lft FROM categories WHERE id = pparent_id;
      ELSE
        SELECT (lft + 1) INTO new_lft FROM categories WHERE id = pparent_id;
      END IF;

      IF (new_lft != old_lft) THEN
        CREATE TEMPORARY TABLE IF NOT EXISTS working_tree_map (
          `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
          `lft` smallint(5) unsigned DEFAULT NULL,
          `rgt` smallint(5) unsigned DEFAULT NULL,
          `parent` smallint(5) unsigned NOT NULL,
          PRIMARY KEY (`id`)
        );

        INSERT INTO working_tree_map (id, lft, rgt, parent)
          SELECT t1.id,
            (t1.lft - (SELECT MIN(lft) FROM categories WHERE id = pnode_id)) AS lft,
            (t1.rgt - (SELECT MIN(lft) FROM categories WHERE id = pnode_id)) AS rgt,
            t1.parent
          FROM categories AS t1, categories AS t2
          WHERE t1.lft BETWEEN t2.lft AND t2.rgt AND t2.id = pnode_id;

        DELETE FROM categories WHERE id IN (SELECT id FROM working_tree_map);

        IF(new_lft < old_lft) THEN -- move up
          UPDATE categories SET lft = lft + width WHERE lft >= new_lft AND lft < old_lft;
          UPDATE categories SET rgt = rgt + width WHERE rgt > new_lft AND rgt < old_rgt;
          UPDATE working_tree_map SET lft = new_lft + lft, rgt = new_lft + rgt;
        END IF;

        IF(new_lft > old_lft) THEN -- move down
          UPDATE categories SET lft = lft - width WHERE lft > old_lft AND lft < new_lft;
          UPDATE categories SET rgt = rgt - width WHERE rgt > old_rgt AND rgt < new_lft;
          UPDATE working_tree_map SET lft = (new_lft - width) + lft, rgt = (new_lft - width) + rgt;
        END IF;

        INSERT INTO categories (id, lft, rgt, parent)
          SELECT id, lft, rgt, parent
            FROM working_tree_map;

        DELETE FROM working_tree_map;
      END IF;
  END CASE;

END
