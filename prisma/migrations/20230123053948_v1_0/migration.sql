/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "time_stamp" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "time_stamp" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" VARCHAR(140) NOT NULL,
ADD COLUMN     "password" VARCHAR(140) NOT NULL,
ALTER COLUMN "avatar_path" DROP NOT NULL;

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "session"("expire");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
