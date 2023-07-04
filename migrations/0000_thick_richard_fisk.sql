CREATE TABLE `jokes` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX `nameIdx` ON `jokes` (`name`);