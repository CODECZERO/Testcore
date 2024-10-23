/*
  Warnings:

  - You are about to drop the column `Class` on the `Examiner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Class]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Class` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Examiner" DROP COLUMN "Class";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "Class" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_Class_key" ON "Student"("Class");
