/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "College" (
    "collegeID" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "collegeAddress" TEXT NOT NULL,
    "collegeVerify" BOOLEAN NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("collegeID")
);

-- CreateTable
CREATE TABLE "Examiner" (
    "examinerID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "examinerAddress" TEXT NOT NULL,
    "examinerVerify" BOOLEAN NOT NULL,
    "refreshToken" TEXT NOT NULL,

    CONSTRAINT "Examiner_pkey" PRIMARY KEY ("examinerID")
);

-- CreateTable
CREATE TABLE "Student" (
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "studentAddress" TEXT NOT NULL,
    "studentVerify" BOOLEAN NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "collegeID" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "Exam" (
    "examID" TEXT NOT NULL,
    "subjectID" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "examStart" TIMESTAMP(3) NOT NULL,
    "examEnd" TIMESTAMP(3) NOT NULL,
    "examDuration" INTEGER NOT NULL,
    "examinerID" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("examID")
);

-- CreateTable
CREATE TABLE "Subject" (
    "subjectID" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "subjectVerify" BOOLEAN NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("subjectID")
);

-- CreateTable
CREATE TABLE "QuestionPaper" (
    "questionPaperID" TEXT NOT NULL,
    "examID" TEXT NOT NULL,
    "studentID" TEXT NOT NULL,
    "SubjectID" TEXT NOT NULL,

    CONSTRAINT "QuestionPaper_pkey" PRIMARY KEY ("questionPaperID")
);

-- CreateTable
CREATE TABLE "Result" (
    "resultID" TEXT NOT NULL,
    "marks" DOUBLE PRECISION NOT NULL,
    "resultVerify" BOOLEAN NOT NULL,
    "passingMark" DOUBLE PRECISION NOT NULL,
    "obtainedMarks" DOUBLE PRECISION NOT NULL,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "questionPaperID" TEXT NOT NULL,
    "StudentId" TEXT NOT NULL,
    "examExamID" TEXT,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("resultID")
);

-- CreateTable
CREATE TABLE "_CollegeToExaminer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExamToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CollegeToExaminer_AB_unique" ON "_CollegeToExaminer"("A", "B");

-- CreateIndex
CREATE INDEX "_CollegeToExaminer_B_index" ON "_CollegeToExaminer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExamToStudent_AB_unique" ON "_ExamToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ExamToStudent_B_index" ON "_ExamToStudent"("B");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_collegeID_fkey" FOREIGN KEY ("collegeID") REFERENCES "College"("collegeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_examinerID_fkey" FOREIGN KEY ("examinerID") REFERENCES "Examiner"("examinerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_subjectID_fkey" FOREIGN KEY ("subjectID") REFERENCES "Subject"("subjectID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionPaper" ADD CONSTRAINT "QuestionPaper_examID_fkey" FOREIGN KEY ("examID") REFERENCES "Exam"("examID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionPaper" ADD CONSTRAINT "QuestionPaper_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_questionPaperID_fkey" FOREIGN KEY ("questionPaperID") REFERENCES "QuestionPaper"("questionPaperID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_examExamID_fkey" FOREIGN KEY ("examExamID") REFERENCES "Exam"("examID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollegeToExaminer" ADD CONSTRAINT "_CollegeToExaminer_A_fkey" FOREIGN KEY ("A") REFERENCES "College"("collegeID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollegeToExaminer" ADD CONSTRAINT "_CollegeToExaminer_B_fkey" FOREIGN KEY ("B") REFERENCES "Examiner"("examinerID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToStudent" ADD CONSTRAINT "_ExamToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Exam"("examID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToStudent" ADD CONSTRAINT "_ExamToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("studentId") ON DELETE CASCADE ON UPDATE CASCADE;
