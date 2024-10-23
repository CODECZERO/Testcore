/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `College` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refreshToken]` on the table `Examiner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refreshToken]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Class` to the `Examiner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Examiner" ADD COLUMN     "Class" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "College_refreshToken_key" ON "College"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Examiner_refreshToken_key" ON "Examiner"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Student_refreshToken_key" ON "Student"("refreshToken");
