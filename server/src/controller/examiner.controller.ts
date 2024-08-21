import AsyncHandler from "../util/ayscHandler.js";
import { ApiError } from "../util/apiError.js";
import { Request, Response } from "express";
import { ApiResponse } from "../util/apiResponse.js";
import { TimeTable } from "../models/timetable.model.nosql.js";
import { getQuestionPaperForExaminer, getSubject } from "../db/Query.sql.db.js";
import prisma from "../db/database.Postgres.js";
import { tokenGen } from "./user.controller.js";
import { examDataStore } from "../models/examDatamanage.model.nosql.js";
import { nanoid } from "nanoid";
import { cacheUpdate } from "../db/database.redis.query.js";
import { json } from "body-parser";

interface Requestany extends Request {
    examData?: any
    user?: any
}

type examdata = {
    examID: string
    QuestionPaperId: string
    SubjectID: string
}

type timetable = {
    Subject: Object
    Class: string
    CollegeName: string
}

type examdataupdata = {
    Id: string
    marks: number
    resultVerify: boolean
    passingMark: number
    obtainedMarks: number
    totalMarks: number
}

type subject = {
    subjectCode: string
    subjectName: string

}

interface examSubject extends subject {
    examName: string;
    examStart: Date;
    examEnd: Date;
    date: Date;
    examDuration: string;
    examinerID: string;

}
const scheuldeExam = AsyncHandler(async (req: Requestany, res: Response) => {
    const { Id, email } = req.user;
    const createExamdata: examSubject = req.body;
    if (!(Id || email)) throw new ApiError(401, "user is not login");
    else if (!createExamdata) throw new ApiError(401, "exam data is not provide");
    const findUser = await prisma.examiner.findUnique({
        where: {
            Id,
            email
        }
    });

    if (!(findUser)) throw new ApiError(401, "user is not allowed to scheulde exam");
    const getsubject = await getSubject(createExamdata.subjectCode, createExamdata.subjectName);
    if (!getsubject) throw new ApiError(404, "subject not found");

    const createExam = await prisma.exam.create({
       
        data: {
             //
            subjectID: getsubject?.Id,
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
    if (!createExam) throw new ApiError(406, "unbale to scheduled exam")
    const tokenID=nanoid(8);
    const saveExamToken = await examDataStore.create({
        tokenID,
        examID: createExam?.Id
    });
    if(!saveExamToken)throw new ApiError(504,"unable to save tokenID");
    const updatecache=await cacheUpdate(tokenID,createExam.Id);
    if(!updatecache) res.send(new ApiError(504,"unable to put it in cache"));
    return res.status(201).json(new ApiResponse(201,{exam:createExam,tokenID}, "Exam scheduled successfully"));
})

const makeTimetable = AsyncHandler(async (req: Requestany, res: Response) => {//create time 
    const timetable: timetable = req.body;//takes data from user subjects 
    if (!timetable) throw new ApiError(400, "timetable is not provided");//checks if subject or class is provide or not if not throw error
    const dataInsert = await TimeTable.create({//if provide then insert data in mongo db
        Class: timetable.Class,
        Subjects: timetable.Subject, // imp, subject is a nested object
        Aprrove: false,//waiting for approveable from college
        CollegeName: timetable.CollegeName
    });
    if (!dataInsert) throw new ApiError(500, "Something went wrong while inserting timetable in database");//if for some reasone data is not update throw error
    return res.status(201).json(new ApiResponse(201, dataInsert, "Time table created successfully"));//return data after inserting



}
);
const getQuestionPaperForExaminers = AsyncHandler(async (req: Requestany, res: Response) => {
    const examdata: examdata = req.examData;
    if (!examdata) throw new ApiError(400, "examID and QuestionPaperID");
    const examPaper = await getQuestionPaperForExaminer(examdata.examID);
    if (!examPaper) throw new ApiError(406, "didn't found questionpaper");
    return res.status(200).json(new ApiResponse(200, examPaper));

})

const updateQuestionPaperMarks = AsyncHandler(async (req: Requestany, res: Response) => {
    const examdata: examdata = req.examData;
    const examdataupdata: examdataupdata = req.body;
    if (!examdataupdata) throw new ApiError(400, "examId and marks are not provied");
    const findQuestionpaper = await getQuestionPaperForExaminer(examdata.examID);
    if (!findQuestionpaper) throw new ApiError(406, "no able to find question paper");
    const updatemarks = await prisma.result.updateMany({
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
    if (!updatemarks) throw new ApiError(406, "unable to update reult");
    return res.status(200).json(new ApiResponse(200, updatemarks));



})
const makeQuestionPaper = AsyncHandler(async (req: Requestany, res: Response) => {
    const extraData: examdata = req.examData;
    const { QuestionPapaerData } = req.body;
    if (!QuestionPapaerData) throw new ApiError(400, "Question paper is not provided");
    const questionPaperInsert = await prisma.questionPaper.create({
        data: {
            SubjectID: extraData.SubjectID,
            examID: extraData.examID,
            question: JSON.stringify(QuestionPapaerData), // Serialize the object/array to a string
        }
    });
    
    if (!questionPaperInsert) throw new ApiError(406, "error while making questionpaper");
    return res.status(201).json(new ApiResponse(201, questionPaperInsert));
})

const getParticipant = AsyncHandler(async (req: Requestany, res: Response) => {
    const examdata: examdata = req.examData;
    if (!examdata) throw new ApiError(400, "exam id is not provided");
    const getExamParticipation = await prisma.questionPaper.count({
        where: {
            answer: {
                not: undefined
            }
        }
    });

    if (!(getExamParticipation || getExamParticipation == 0)) throw new ApiError(406, "unable to find any participant")
    return res.status(200).json(new ApiResponse(200, getExamParticipation));

})
const UpdateQuestionPaper = AsyncHandler(async (req: Requestany, res: Response) => {
    const examData: examdata = req.examData;
    const { QuestionPapaerData } = req.body;
    if (!examData) throw new ApiError(400, "exam data is not provied");
    const updatePaper = await prisma.questionPaper.updateMany({
        where: {
            examID: examData.examID
        },
        data: {
            question: QuestionPapaerData
        }
    });
    if (!updatePaper) throw new ApiError(400, "exam paper can't be update as exam is not selected");
    return res.status(200).json(new ApiResponse(200, updatePaper, "Question update succesfuly"));
})
const getExam = AsyncHandler(async (req: Requestany, res: Response) => {
    const { Id } = req.user;
    if (!Id) throw new ApiError(400, "user data not provided");
    const findUser = await prisma.exam.findMany({
        where: {
            examinerID: Id
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
    
    
    if (!findUser) throw new ApiError(404, "Exam not found");
    const { refreshToken, accesToken } = await tokenGen(findUser);//genereating token for the user
    return res.status(200).json(new ApiResponse(200, { examdata: findUser, refreshToken, accesToken }, "Exam Found"));

})

export{
    makeQuestionPaper,
    makeTimetable,
    getExam,
    getParticipant,
    getQuestionPaperForExaminers,
    updateQuestionPaperMarks,
    UpdateQuestionPaper,
    scheuldeExam
}