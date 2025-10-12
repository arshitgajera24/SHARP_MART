ALTER TABLE `orders` ADD `status` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `payment` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL;