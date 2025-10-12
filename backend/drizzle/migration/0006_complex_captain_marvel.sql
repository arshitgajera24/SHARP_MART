CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` varchar(255) NOT NULL,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
