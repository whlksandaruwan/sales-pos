-- AlterTable
ALTER TABLE `sale` ADD COLUMN `deliveryDate` DATETIME(3) NULL,
    ADD COLUMN `deliveryNote` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Ref` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefDelivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `refId` INTEGER NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `billNumber` VARCHAR(191) NULL,
    `billDate` DATETIME(3) NULL,
    `billImageUrl` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RefDelivery_refId_idx`(`refId`),
    INDEX `RefDelivery_companyName_idx`(`companyName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefDelivery` ADD CONSTRAINT `RefDelivery_refId_fkey` FOREIGN KEY (`refId`) REFERENCES `Ref`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
