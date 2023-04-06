-- CreateTable
CREATE TABLE `languages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `code` VARCHAR(5) NOT NULL,

    UNIQUE INDEX `languages_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `roles_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_bank_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `users_id` INTEGER NOT NULL,
    `account_name` VARCHAR(191) NOT NULL,
    `account_number` VARCHAR(20) NOT NULL,
    `bank_name` VARCHAR(50) NOT NULL,
    `ifsc_code` VARCHAR(20) NOT NULL,
    `account_type` ENUM('current', 'savings', 'salary') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `allow_billing` BOOLEAN NOT NULL DEFAULT true,
    `allow_gst_billing` BOOLEAN NOT NULL DEFAULT false,
    `primary_contact` VARCHAR(15) NOT NULL,
    `secondary_contact` VARCHAR(15) NULL,
    `logo_url` VARCHAR(191) NULL,
    `gst_no` VARCHAR(191) NULL,
    `gst_tax_percentage` INTEGER NULL,
    `address` VARCHAR(191) NULL,
    `country_id` INTEGER NULL,
    `country_name` VARCHAR(191) NULL,
    `state_id` INTEGER NULL,
    `state_name` VARCHAR(191) NULL,
    `city_id` INTEGER NULL,
    `city_name` VARCHAR(191) NULL,
    `pin_code` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `allow_login` BOOLEAN NOT NULL DEFAULT true,
    `user_name` VARCHAR(50) NULL,
    `password` VARCHAR(191) NULL,
    `email_id` VARCHAR(100) NULL,
    `user_role_id` INTEGER NOT NULL,
    `language_id` INTEGER NOT NULL,
    `primary_contact` VARCHAR(15) NULL,
    `secondary_contact` VARCHAR(15) NULL,
    `date_of_birth` DATETIME(3) NULL,
    `anniversary_date` DATETIME(3) NULL,
    `gst_no` VARCHAR(30) NULL,
    `gst_type` ENUM('unregistered', 'registered_business_regular', 'registered_business_composition') NULL,
    `address` VARCHAR(191) NULL,
    `country_id` INTEGER NULL,
    `country_name` VARCHAR(50) NULL,
    `state_id` INTEGER NULL,
    `state_name` VARCHAR(50) NULL,
    `city_id` INTEGER NULL,
    `city_name` VARCHAR(50) NULL,
    `pin_code` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,
    `updated_at` DATETIME(3) NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` INTEGER NULL,

    UNIQUE INDEX `users_user_name_key`(`user_name`),
    UNIQUE INDEX `users_email_id_key`(`email_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `company_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `todo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `task_for_user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_user` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `item_code` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_bank_details` ADD CONSTRAINT `user_bank_details_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_user_role_id_fkey` FOREIGN KEY (`user_role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_language_id_fkey` FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_company` ADD CONSTRAINT `users_company_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_company` ADD CONSTRAINT `users_company_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_task_for_user_id_fkey` FOREIGN KEY (`task_for_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_created_by_user_fkey` FOREIGN KEY (`created_by_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
