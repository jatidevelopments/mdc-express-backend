/*
  Warnings:

  - Made the column `free_messages` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "free_messages" SET NOT NULL;
