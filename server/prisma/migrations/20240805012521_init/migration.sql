/*
  Warnings:

  - You are about to drop the `College` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Examiner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionPaper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Result` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollegeToExaminer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExamToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_examinerID_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_subjectID_fkey";

-- DropForeignKey
ALTER TABLE "QuestionPaper" DROP CONSTRAINT "QuestionPaper_examID_fkey";

-- DropForeignKey
ALTER TABLE "QuestionPaper" DROP CONSTRAINT "QuestionPaper_studentID_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_StudentId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_examExamID_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_questionPaperID_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_collegeID_fkey";

-- DropForeignKey
ALTER TABLE "_CollegeToExaminer" DROP CONSTRAINT "_CollegeToExaminer_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollegeToExaminer" DROP CONSTRAINT "_CollegeToExaminer_B_fkey";

-- DropForeignKey
ALTER TABLE "_ExamToStudent" DROP CONSTRAINT "_ExamToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExamToStudent" DROP CONSTRAINT "_ExamToStudent_B_fkey";

-- DropTable
DROP TABLE "College";

-- DropTable
DROP TABLE "Exam";

-- DropTable
DROP TABLE "Examiner";

-- DropTable
DROP TABLE "QuestionPaper";

-- DropTable
DROP TABLE "Result";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "_CollegeToExaminer";

-- DropTable
DROP TABLE "_ExamToStudent";
