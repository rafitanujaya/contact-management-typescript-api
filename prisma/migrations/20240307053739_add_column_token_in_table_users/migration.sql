-- AlterTable
ALTER TABLE `addresses` MODIFY `steet` VARCHAR(100) NULL,
    MODIFY `city` VARCHAR(100) NULL,
    MODIFY `province` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `token` VARCHAR(100) NULL;
