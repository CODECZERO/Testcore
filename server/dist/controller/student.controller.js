var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../db/database.Postgres.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import AsyncHandler from "../util/ayscHandler.js";
import { TimeTable } from "../models/timetable.model.nosql.js";
import { getQuestionPaper } from "../db/Query.sql.db.js";
//@ts-ignore
const giveExam = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const examdata = req.examData;
    const answerQuestion = yield prisma.QuestionPaper.update({
        where: {
            Id: examdata.examID
        },
        data: {
            answer: examdata.Answer
        }
    });
    if (!answerQuestion)
        throw new ApiError(421, "answer was not updated");
    return res.status(201).json(new ApiResponse(201, answerQuestion, "answer saved"));
}));
//@ts-ignore
const getExam = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const examdata = req.examData;
    if (!examdata)
        throw new ApiError(401, "exam data is not provied");
    const findexam = prisma.Exam.findFirst({
        where: {
            Id: examdata.examID
        },
        select: {
            Id: true,
            examName: true,
            date: true,
            examStart: true,
            examEnd: true,
            examDuration: true,
            examinerID: true
        },
        include: {
            Subject: {
                select: {
                    Id: true,
                    subjectCode: true,
                    subjectName: true,
                }
            }
        }
    });
    if (!findexam)
        throw new ApiError(404, "exam not found");
    return res.status(200).json(new ApiResponse(200, findexam, "Exam Found"));
}));
//@ts-ignore
const getTimeTable = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classdata = req.body;
    if (!classdata)
        throw new ApiError(400, "Invalid data");
    const findtimetable = yield TimeTable.findOne({
        Class: classdata.Class,
        CollegeName: classdata.CollegeName
    });
    if (!findtimetable)
        throw new ApiError(404, "time table not found");
    return res.status(200).json(new ApiResponse(200, findtimetable, `time table of class ${classdata.Class} of ${classdata.CollegeName}`));
}));
//@ts-ignore
const getResult = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultdata = req.examData;
    if (!resultdata)
        throw new ApiError(401, "no data is provied");
    const findresult = yield prisma.Result.findMany({
        where: {
            OR: [
                { questionPaperID: resultdata.QuestionPaperId },
                { StudentId: resultdata.StudentId }
            ]
        },
        select: {
            Id: true,
            marks: true,
            resultVerify: true,
            passingMark: true,
            obtainedMarks: true,
            totalMarks: true,
            questionPaperID: true,
            StudentId: true
        }
    });
    if (!resultdata)
        throw new ApiError(404, "result Not found");
    return res.status(200).json(new ApiResponse(200, findresult, "result found"));
}));
//@ts-ignore
const getQuestionPaperForStundet = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const examdata = req.examData;
    const findexam = yield getQuestionPaper(examdata.examID);
    if (!findexam)
        throw new ApiError(400, "no exam found");
    return res.status(200).json(new ApiResponse(200, findexam, "Question papre data"));
}));
export { getExam, getResult, getTimeTable, getQuestionPaperForStundet, giveExam };
