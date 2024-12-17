var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import prisma from "../db/database.Postgres.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import AsyncHandler from "../util/ayscHandler.js";
import { TimeTable } from "../models/timetable.model.nosql.js";
import { findSingleCollegeForStudent, getQuestionPaper } from "../db/Query.sql.db.js";
const giveExam = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const examdata = req.examData; //takes data from user
    const { Answer, QuestionPapaerData } = req.body;
    const answerQuestion = yield prisma.questionPaper.create({
        data: {
            SubjectID: examdata.findTokenInDb.SubjectID,
            studentID: examdata.userData.Id,
            examID: examdata.findTokenInDb.Id,
            answer: Answer,
            question: JSON.stringify(QuestionPapaerData)
        }
    });
    if (!answerQuestion)
        throw new ApiError(421, "answer was not updated"); //if unable to update then throw error
    return res.status(201).json(new ApiResponse(201, answerQuestion, "answer saved")); //else return successfuly message
}));
const getExam = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const examData = req.examData; //takes parameters from user
    if (!examData.findTokenInDb.Id)
        throw new ApiError(401, "exam data is not provied"); //throw error if not provided
    //@ts-ignore
    const findexam = prisma.exam.findFirst({
        where: {
            Id: examData.findTokenInDb.Id,
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
        } //return nested object 
    });
    if (!findexam)
        throw new ApiError(404, "exam not found"); //if not found then throw error
    return res.status(200).json(new ApiResponse(200, findexam, "Exam Found")); //else return response
}));
const getTimeTable = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user; //takes data from user
    const { Class } = req.body; //takes data from user
    console.log(user);
    console.log(user?.Id);
    const name = __rest(yield findSingleCollegeForStudent(user === null || user === void 0 ? void 0 : user.Id), []); //finds user college using his id;
    if (!Class || !name)
        throw new ApiError(400, "Invalid data"); //if not provided then throw error
    const findtimetable = yield TimeTable.findOne({
        Class: Class,
        CollegeName: name.college.name
    });
    if (!findtimetable)
        throw new ApiError(404, "time table not found"); //not found throw error
    return res.status(200).json(new ApiResponse(200, findtimetable, `time table of class ${Class} of ${name}`)); //else return data
}));
const getResult = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultdata = req.examData; //takes parameters from user
    if (!resultdata || !resultdata.userData.Id)
        throw new ApiError(401, "no data is provied"); //if not provided then throw error
    const findresult = yield prisma.result.findMany({
        where: {
            OR: [
                { questionPaperID: resultdata.findTokenInDb.QuestionPaperId },
                { StudentId: resultdata.userData.Id }
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
        throw new ApiError(404, "result Not found"); //throw error if not found
    return res.status(200).json(new ApiResponse(200, findresult, "result found")); //return value if found
}));
const getQuestionPaperForStundet = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const examdata = req.examData; //take parameters from studnet
    if (!examdata.findTokenInDb.Id)
        throw new ApiError(400, "examid is not provided");
    const findexam = yield getQuestionPaper(examdata.findTokenInDb.Id); //find in database
    if (!findexam)
        throw new ApiError(400, "no exam found"); //if not found throw error
    return res.status(200).json(new ApiResponse(200, findexam, "Question paper data")); //if found then return data
}));
export { getExam, getResult, getTimeTable, getQuestionPaperForStundet, giveExam };
