var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AsyncHandler from "../util/ayscHandler.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import { TimeTable } from "../models/timetable.model.nosql.js";
import { getQuestionPaperForExaminer, getSubject } from "../db/Query.sql.db.js";
import prisma from "../db/database.Postgres.js";
import { examDataStore } from "../models/examDatamanage.model.nosql.js";
import { nanoid } from "nanoid";
import { cacheUpdate } from "../db/database.redis.query.js";
const scheuldeExam = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Id, email } = req.user;
    const createExamdata = req.body;
    if (!(Id || email))
        throw new ApiError(401, "user is not login");
    else if (!createExamdata)
        throw new ApiError(401, "exam data is not provide");
    const findUser = yield prisma.examiner.findUnique({
        where: {
            Id,
            email
        }
    });
    if (!(findUser))
        throw new ApiError(401, "user is not allowed to scheulde exam");
    const getsubject = yield getSubject(createExamdata.subjectCode, createExamdata.subjectName);
    if (!getsubject)
        throw new ApiError(404, "subject not found");
    const createExam = yield prisma.exam.create({
        data: {
            //
            subjectID: getsubject.Id,
            examName: createExamdata.examName,
            date: createExamdata.date,
            examStart: createExamdata.examStart,
            examEnd: createExamdata.examEnd,
            examDuration: createExamdata.examDuration,
            examinerID: createExamdata.examinerID
        },
        select: {
            Id: true,
        }
    });
    if (!createExam)
        throw new ApiError(406, "unbale to scheduled exam");
    const tokenID = nanoid(8);
    const saveExamToken = yield examDataStore.create({
        tokenID,
        examID: createExam === null || createExam === void 0 ? void 0 : createExam.Id
    });
    if (!saveExamToken)
        throw new ApiError(504, "unable to save tokenID");
    const updatecache = yield cacheUpdate(tokenID, createExam.Id);
    if (!updatecache)
        res.send(new ApiError(504, "unable to put it in cache"));
    return res.status(201).json(new ApiResponse(201, { exam: createExam, tokenID }, "Exam scheduled successfully"));
}));
const makeTimetable = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const timetable = req.body; //takes data from user subjects 
    if (!timetable)
        throw new ApiError(400, "timetable is not provided"); //checks if subject or class is provide or not if not throw error
    const dataInsert = yield TimeTable.create({
        Class: timetable.Class,
        Subjects: timetable.Subject, // imp, subject is a nested object
        Aprrove: false, //waiting for approveable from college
        CollegeName: timetable.CollegeName
    });
    if (!dataInsert)
        throw new ApiError(500, "Something went wrong while inserting timetable in database"); //if for some reasone data is not update throw error
    return res.status(201).json(new ApiResponse(201, dataInsert, "Time table created successfully")); //return data after inserting
}));
const getQuestionPaperForExaminers = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const examdata = req.examData;
    if (!examdata)
        throw new ApiError(400, "examID and QuestionPaperID");
    const examPaper = yield getQuestionPaperForExaminer(examdata.examID);
    if (!examPaper)
        throw new ApiError(406, "didn't found questionpaper");
    return res.status(200).json(new ApiResponse(200, examPaper));
}));
const updateQuestionPaperMarks = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const examdata = req.examData;
    const examdataupdata = req.body;
    if (!examdataupdata)
        throw new ApiError(400, "examId and marks are not provied");
    const findQuestionpaper = yield getQuestionPaperForExaminer(examdata.examID);
    if (!findQuestionpaper)
        throw new ApiError(406, "no able to find question paper");
    const updatemarks = yield prisma.result.updateMany({
        where: {
            questionPaperID: examdata.QuestionPaperId
        },
        data: {
            marks: examdataupdata.marks,
            resultVerify: examdataupdata.resultVerify,
            passingMark: examdataupdata.passingMark,
            obtainedMarks: examdataupdata.obtainedMarks,
            totalMarks: examdataupdata.totalMarks,
        }
    });
    if (!updatemarks)
        throw new ApiError(406, "unable to update reult");
    return res.status(200).json(new ApiResponse(200, updatemarks));
}));
const makeQuestionPaper = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const extraData = req.examData;
    const { QuestionPapaerData } = req.body;
    if (!QuestionPapaerData)
        throw new ApiError(400, "Question paper is not provided");
    const questionPaperInsert = yield prisma.questionPaper.create({
        data: {
            SubjectID: extraData.SubjectID,
            examID: extraData.examID,
            studentID: " ",
            answer: "",
            question: JSON.stringify(QuestionPapaerData), // Serialize the object/array to a string
        }
    });
    if (!questionPaperInsert)
        throw new ApiError(406, "error while making questionpaper");
    return res.status(201).json(new ApiResponse(201, questionPaperInsert));
}));
const getParticipant = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const examdata = req.examData;
    if (!examdata)
        throw new ApiError(400, "exam id is not provided");
    const getExamParticipation = yield prisma.questionPaper.count({
        where: {
            answer: {
                not: undefined
            }
        }
    });
    if (!(getExamParticipation || getExamParticipation == 0))
        throw new ApiError(406, "unable to find any participant");
    return res.status(200).json(new ApiResponse(200, getExamParticipation));
}));
const UpdateQuestionPaper = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const examData = req.examData;
    const { QuestionPapaerData } = req.body;
    if (!examData)
        throw new ApiError(400, "exam data is not provied");
    const updatePaper = yield prisma.questionPaper.updateMany({
        where: {
            examID: examData.examID
        },
        data: {
            question: QuestionPapaerData
        }
    });
    if (!updatePaper)
        throw new ApiError(400, "exam paper can't be update as exam is not selected");
    return res.status(200).json(new ApiResponse(200, updatePaper, "Question update succesfuly"));
}));
const getExam = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Id } = req.user;
    if (!Id)
        throw new ApiError(400, "user data not provided");
    const findExams = yield prisma.exam.findMany({
        where: {
            examinerID: Id
        },
        select: {
            Id: true,
            date: true,
            examStart: true,
            examEnd: true,
            examDuration: true,
            examinerID: true,
            Subject: {
                select: {
                    Id: true,
                    subjectCode: true,
                    subjectName: true,
                }
            }
        }
    });
    if (!findExams)
        throw new ApiError(404, "Exam not found");
    return res.status(200).json(new ApiResponse(200, { examdata: findExams }, "Exam Found"));
}));
export { makeQuestionPaper, makeTimetable, getExam, getParticipant, getQuestionPaperForExaminers, updateQuestionPaperMarks, UpdateQuestionPaper, scheuldeExam };
