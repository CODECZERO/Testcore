/*
  Warnings:

  - Changed the type of `question` on the `QuestionPaper` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Examiner" ALTER COLUMN "examinerVerify" DROP DEFAULT;

-- AlterTable
ALTER TABLE "QuestionPaper" DROP COLUMN "question",
ADD COLUMN     "question" JSONB NOT NULL;
