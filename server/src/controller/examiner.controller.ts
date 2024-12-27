import AsyncHandler from "../util/ayscHandler.js";
import { ApiError } from "../util/apiError.js";
import { Request, Response } from "express";
import { ApiResponse } from "../util/apiResponse.js";
import { TimeTable } from "../models/timetable.model.nosql.js";
import { getQuestionPaperForExaminer, getSubject } from "../db/Query.sql.db.js";
import prisma from "../db/database.Postgres.js";
import { examDataStore } from "../models/examDatamanage.model.nosql.js";
import { nanoid } from "nanoid";
import { cacheUpdate } from "../db/database.redis.query.js";

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
    QuestionPaperId:string
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



const scheuldeExam = AsyncHandler(async (req: Requestany, res: Response) => {//this function scheulde exam for studnet
    const { Id, email } = req.user;//takes data from user
    const createExamdata: examSubject = req.body;//takes data from user
    if (!(Id || email)) throw new ApiError(401, "user is not login");//check if data is provided or not 
    else if (!createExamdata) throw new ApiError(401, "exam data is not provide");

    const getsubject = await getSubject(createExamdata.subjectCode, createExamdata.subjectName);//then passes to it the getSubject fuction to get function
    if (!getsubject) throw new ApiError(404, "subject not found");//if not then throw error
    const createExam = await prisma.exam.create({//make data in exam table about this exam

        data: {
            //
            subjectID: getsubject.Id,
            examName: createExamdata.examName,
            date: new Date(createExamdata.date),
            examStart: new Date(createExamdata.examStart),
            examEnd: new Date(createExamdata.examEnd),
            examDuration: createExamdata.examDuration,
            examinerID: Id
        },
        select: {
            Id: true,
        }
    });
    if (!createExam) throw new ApiError(406, "unbale to scheduled exam")
    const tokenID = nanoid(8);//make a unique id 
    const saveExamToken = await examDataStore.create({//using unique id you can , find exam id and unique id is easily rememberable
        tokenID,
        examID: createExam?.Id
    });
    if (!saveExamToken) throw new ApiError(504, "unable to save tokenID");
    const updatecache = await cacheUpdate(tokenID, createExam.Id);//update data in cache for quick access
    if (!updatecache) res.send(new ApiError(504, "unable to put it in cache"));
    return res.status(201).json(new ApiResponse(201, { exam: createExam, tokenID }, "Exam scheduled successfully"));//then return data
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

const getQuestionPaperForExaminers = AsyncHandler(async (req: Requestany, res: Response) => {//this function get help examiner to get question paper
    const examdata: examdata = req.examData;//takes exam data
    if (!examdata) throw new ApiError(400, "examID and QuestionPaperID");
    const examPaper = await getQuestionPaperForExaminer(examdata.examID);//passes to the query function
    if (!examPaper) throw new ApiError(406, "didn't found questionpaper");
    return res.status(200).json(new ApiResponse(200, examPaper));//return data

})

const updateQuestionPaperMarks = AsyncHandler(async (req: Requestany, res: Response) => {//this function updates question paper data
    const examdataupdata: examdataupdata = req.body;//takes data
    if (!examdataupdata) throw new ApiError(400, "examId and marks are not provied");
    const updatemarks = await prisma.result.updateMany({//update all of the question paper, who have question paper id
        where: {
            questionPaperID: examdataupdata.QuestionPaperId
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
    return res.status(200).json(new ApiResponse(200, updatemarks));//return data
})

const makeQuestionPaper = AsyncHandler(async (req: Requestany, res: Response) => {//make question paper
    const extraData: examdata = req.examData;
    const { QuestionPaperData } = req.body;//takes data
    if (!QuestionPaperData) throw new ApiError(400, "Question paper is not provided");
    const questionPaperInsert = await prisma.questionPaper.create({//create record of the question paper in database
        data: {
            SubjectID: extraData.SubjectID,
            examID: extraData.examID,
            studentID: " ",//it's default empty as the user hadn't given exam
            answer: "",//and same here as studentID
            question: JSON.stringify(QuestionPaperData), // Serialize the object/array to a string
        }
    });

    if (!questionPaperInsert) throw new ApiError(406, "error while making questionpaper");
    return res.status(201).json(new ApiResponse(201, questionPaperInsert));//return data
})

const getParticipant = AsyncHandler(async (req: Requestany, res: Response) => {//get total count of get participant 
    const examdata: examdata = req.examData;//takes data from user
    if (!examdata) throw new ApiError(400, "exam id is not provided");
    const getExamParticipation = await prisma.questionPaper.count({//cout total number of paper wher answer is not undefined 
        where: {
            answer: {
                not: undefined
            }
        }
    });

    if (!(getExamParticipation || getExamParticipation == 0)) throw new ApiError(406, "unable to find any participant")
    return res.status(200).json(new ApiResponse(200, getExamParticipation));//return data

})

const UpdateQuestionPaper = AsyncHandler(async (req: Requestany, res: Response) => {//this function updates data or exam question paper
    const examData: examdata = req.examData;
    const { QuestionPaperData } = req.body;//takes data from user
    if (!examData) throw new ApiError(400, "exam data is not provied");
    const updatePaper = await prisma.questionPaper.updateMany({//updates all of the question where the questionpaper matchs the id exam id
        where: {
            examID: examData.examID
        },
        data: {
            question: QuestionPaperData
        }
    });
    if (!updatePaper) throw new ApiError(400, "exam paper can't be update as exam is not selected");
    return res.status(200).json(new ApiResponse(200, updatePaper, "Question update succesfuly"));//return data
})

const getExam = AsyncHandler(async (req: Requestany, res: Response) => {//this function helps us to get exam data
    const { Id } = req.user;//takes data
    if (!Id) throw new ApiError(400, "user data not provided");
    const findExams = await prisma.exam.findMany({//find all, exam for examiner where , the examiner has id 
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
            Subject: { // Including related subject data, also taking subject form subject table
                select: {
                    Id: true,
                    subjectCode: true,
                    subjectName: true,
                }
            }
        }
    });


    if (!findExams) throw new ApiError(404, "Exam not found");
    return res.status(200).json(new ApiResponse(200, { examdata: findExams }, "Exam Found"));//returing data

})

export {
    makeQuestionPaper,
    makeTimetable,
    getExam,
    getParticipant,
    getQuestionPaperForExaminers,
    updateQuestionPaperMarks,
    UpdateQuestionPaper,
    scheuldeExam
}