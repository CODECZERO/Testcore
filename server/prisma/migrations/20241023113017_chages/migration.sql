/*
  Warnings:

  - You are about to drop the column `Class` on the `Student` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Student_Class_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "Class";

-- CreateTable
CREATE TABLE "Class" (
    "Id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Class_name_key" ON "Class"("name");
