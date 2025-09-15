/*
  Warnings:

  - You are about to drop the column `amount` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `purchasePrice` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the `daily_growth` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `assets` DROP COLUMN `amount`,
    DROP COLUMN `purchasePrice`;

-- DropTable
DROP TABLE `daily_growth`;
