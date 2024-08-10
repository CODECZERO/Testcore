-- CreateTable
CREATE TABLE "College" (
    "Id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "collegeVerify" BOOLEAN NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Examiner" (
    "Id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "examinerVerify" BOOLEAN NOT NULL,
    "refreshToken" TEXT NOT NULL,

    CONSTRAINT "Examiner_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Student" (
    "Id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "studentVerify" BOOLEAN NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "collegeID" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "Id" TEXT NOT NULL,
    "subjectID" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "examStart" TIMESTAMP(3) NOT NULL,
    "examEnd" TIMESTAMP(3) NOT NULL,
    "examDuration" INTEGER NOT NULL,
    "examinerID" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "Id" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "subjectVerify" BOOLEAN NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "QuestionPaper" (
    "Id" TEXT NOT NULL,
    "examID" TEXT NOT NULL,
    "studentID" TEXT NOT NULL,
    "SubjectID" TEXT NOT NULL,

    CONSTRAINT "QuestionPaper_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Result" (
    "Id" TEXT NOT NULL,
    "marks" DOUBLE PRECISION NOT NULL,
    "resultVerify" BOOLEAN NOT NULL,
    "passingMark" DOUBLE PRECISION NOT NULL,
    "obtainedMarks" DOUBLE PRECISION NOT NULL,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "questionPaperID" TEXT NOT NULL,
    "StudentId" TEXT NOT NULL,
    "examExamID" TEXT,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("Id")
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
CREATE UNIQUE INDEX "College_email_key" ON "College"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Examiner_email_key" ON "Examiner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_subjectCode_key" ON "Subject"("subjectCode");

-- CreateIndex
CREATE UNIQUE INDEX "_CollegeToExaminer_AB_unique" ON "_CollegeToExaminer"("A", "B");

-- CreateIndex
CREATE INDEX "_CollegeToExaminer_B_index" ON "_CollegeToExaminer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExamToStudent_AB_unique" ON "_ExamToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ExamToStudent_B_index" ON "_ExamToStudent"("B");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_collegeID_fkey" FOREIGN KEY ("collegeID") REFERENCES "College"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_examinerID_fkey" FOREIGN KEY ("examinerID") REFERENCES "Examiner"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_subjectID_fkey" FOREIGN KEY ("subjectID") REFERENCES "Subject"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionPaper" ADD CONSTRAINT "QuestionPaper_examID_fkey" FOREIGN KEY ("examID") REFERENCES "Exam"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionPaper" ADD CONSTRAINT "QuestionPaper_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_questionPaperID_fkey" FOREIGN KEY ("questionPaperID") REFERENCES "QuestionPaper"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "Student"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_examExamID_fkey" FOREIGN KEY ("examExamID") REFERENCES "Exam"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollegeToExaminer" ADD CONSTRAINT "_CollegeToExaminer_A_fkey" FOREIGN KEY ("A") REFERENCES "College"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollegeToExaminer" ADD CONSTRAINT "_CollegeToExaminer_B_fkey" FOREIGN KEY ("B") REFERENCES "Examiner"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToStudent" ADD CONSTRAINT "_ExamToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Exam"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToStudent" ADD CONSTRAINT "_ExamToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
