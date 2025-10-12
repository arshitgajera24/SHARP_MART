CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`price` int NOT NULL,
	`original_price` int NOT NULL,
	`ratings` int NOT NULL,
	`image` text,
	`isAvailable` boolean NOT NULL DEFAULT true,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
