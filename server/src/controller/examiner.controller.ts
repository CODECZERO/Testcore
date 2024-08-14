import AsyncHandler from "../util/ayscHandler.js";
import { ApiError } from "../util/apiError.js";
import { Request, Response } from "express";
import { ApiResponse } from "../util/apiResponse.js";
import { TimeTable } from "../models/timetable.model.nosql.js";
import { getQuestionPaper, getQuestionPaperForExaminer, getSubject } from "../db/Query.db.js";
import prisma from "../db/database.Postgres.js";

interface Requestany extends Request {
    examData?: any
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
    marks: Number
    resultVerify: Boolean
    passingMark: Number
    obtainedMarks: Number
    totalMarks: Number
}

type subject = {
    subjectCode: string
    subjectName: string

}

const scheuldeExam = AsyncHandler(async (req: Requestany, res: Response) => {

})

//@ts-ignore
const getSubjects = AsyncHandler(async (req: Requestany, res: Response) => {
    const subject: subject = req.body;//taking subject name and code 
    let subjects;
    if (!subject) {//if it doesn't exist then return whole table or subject name or code is not provide then return all
        subjects = await prisma.Subject.findMany({//try puting pagenation here and function like it because , it can increase load on database
            select: {
                Id: true,
                subjectCode: true,
                subjectName: true,
            }
        });
    }
    if (subjects) return res.status(200).json(new ApiResponse(200, subjects, "subject found"));

    const subjectGeter = await getSubject(subject.subjectCode, subject.subjectName);//if subject name and code is provide then search for theme
    if (!subjectGeter) res.status(204).json(new ApiResponse(204, "no subject is there currently of this name"))
    return res.status(200).json(new ApiResponse(200, subjectGeter, "Subjects found"));
})

const makeTimetable = async (req: Requestany, res: Response) => {//create time 
    const timetable: timetable = req.body;//takes data from user subjects 
    if (!timetable) throw new ApiError(400, "timetable is not provided");//checks if subject or class is provide or not if not throw error
    const dataInsert = await TimeTable.create({//if provide then insert data in mongo db
        Class: timetable.Class,
        Subjects: timetable.Subject, // imp, subject is a nested object
        Aprrove: false,//waiting for approveable from college
        CollegeName: timetable.CollegeName
    });
    if (!dataInsert) throw new ApiError(500, "Something went wrong while inserting timetable in database");//if for some reasone data is not update throw error
    return res.status(201).json(new ApiResponse(201, dataInsert));//return data after inserting



}

//@ts-ignore
const getQuestionPaperForExaminers = AsyncHandler(async (req: Requestany, res: Response) => {
    const examdata: examdata = req.examData;
    if (!examdata) throw new ApiError(400, "examID and QuestionPaperID");
    const examPaper = await getQuestionPaperForExaminer(examdata.examID, examdata.QuestionPaperId);
    if (!examPaper) throw new ApiError(406, "didn't found questionpaper");
    return res.status(200).json(new ApiResponse(200, examPaper));

})

//@ts-ignore
const UpdateQuestionPaperMarks = AsyncHandler(async (req: Requestany, res: Response) => {
    const examdata: examdata = req.examData;
    const examdataupdata: examdataupdata = req.body;
    if (!examdataupdata) throw new ApiError(400, "examId and marks are not provied");
    const findQuestionpaper = await getQuestionPaperForExaminer(examdata.examID, examdata.QuestionPaperId);
    if (!findQuestionpaper) throw new ApiError(406, "no able to find question paper");
    const updatemarks = await prisma.Result.update({
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
//@ts-ignore
const makeQuestionPaper = AsyncHandler(async (req: Requestany, res: Response) => {
    const extraData: examdata = req.examData;
    const { QuestionPapaerData } = req.body;
    if (!QuestionPapaerData) throw new ApiError(400, "Question paper is not provided");
    const questionPaperInsert = await prisma.QuestionPaper.create({
        data: {
            SubjectID: extraData.SubjectID,
            examID: extraData.examID,
            question: {
                create: QuestionPapaerData
            }
        }
    });

    if (!questionPaperInsert) throw new ApiError(406, "error while making questionpaper");
    return res.status(201).json(new ApiResponse(201, questionPaperInsert));
})

//@ts-ignore
const getParticipant = AsyncHandler(async (req: Requestany, res: Response) => {
    const examdata: examdata = req.examData;
    if (!examdata) throw new ApiError(400, "exam id is not provided");
    const getExamParticipation = await prisma.QuestionPaper.count({
            where: {
                answer: {
                    not: null
                }
            }
            ,
            select: {
                Id: true,
            }
    });

    if(!(getExamParticipation||getExamParticipation==0))throw new ApiError(406,"unable to find any participant")
    return res.status(200).json(new ApiResponse(200,getExamParticipation));

})

const UpdateQuestionPaper = AsyncHandler(async (req: Request, res: Response) => {

})