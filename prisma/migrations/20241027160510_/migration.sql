/*
  Warnings:

  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ROLE_ENUM" AS ENUM ('DEFAULT_USER', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "SOCIAL_ACCOUNT_ENUM" AS ENUM ('FACEBOOK', 'GOOGLE', 'TWITTER');

-- DropIndex
DROP INDEX "Post_id_key";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "published",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "passwordResetCode" TEXT,
ADD COLUMN     "role" "ROLE_ENUM" NOT NULL DEFAULT 'DEFAULT_USER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" SERIAL NOT NULL,
    "accountType" "SOCIAL_ACCOUNT_ENUM" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "tokenExpiry" TIMESTAMP(3),
    "refreshToken" TEXT,
    "accountID" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_id_idx" ON "Post"("id");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
