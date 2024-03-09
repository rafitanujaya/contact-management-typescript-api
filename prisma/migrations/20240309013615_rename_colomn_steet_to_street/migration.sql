/*
  Warnings:

  - You are about to drop the column `steet` on the `addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `steet`,
    ADD COLUMN `street` VARCHAR(100) NULL;
