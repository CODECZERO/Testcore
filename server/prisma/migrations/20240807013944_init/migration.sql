/*
  Warnings:

  - Added the required column `password` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Examiner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "College" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Examiner" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "password" TEXT NOT NULL;
