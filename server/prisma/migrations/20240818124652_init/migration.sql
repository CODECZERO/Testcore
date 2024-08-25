/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `College` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subjectName]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `examDuration` on the `Exam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `answer` to the `QuestionPaper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `QuestionPaper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "examDuration",
ADD COLUMN     "examDuration" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Examiner" ALTER COLUMN "examinerVerify" SET DEFAULT true;

-- AlterTable
ALTER TABLE "QuestionPaper" ADD COLUMN     "answer" TEXT NOT NULL,
ADD COLUMN     "question" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Result" ALTER COLUMN "resultVerify" SET DEFAULT false,
ALTER COLUMN "passingMark" SET DEFAULT 35,
ALTER COLUMN "obtainedMarks" SET DEFAULT 0,
ALTER COLUMN "totalMarks" SET DEFAULT 100;

-- CreateTable
CREATE TABLE "_StudentToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StudentToSubject_AB_unique" ON "_StudentToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentToSubject_B_index" ON "_StudentToSubject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "College_name_key" ON "College"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_subjectName_key" ON "Subject"("subjectName");

-- AddForeignKey
ALTER TABLE "_StudentToSubject" ADD CONSTRAINT "_StudentToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Student"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToSubject" ADD CONSTRAINT "_StudentToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
