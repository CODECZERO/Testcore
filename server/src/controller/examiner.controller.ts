import AsyncHandler from "../util/ayscHandler";
import { ApiError } from "../util/apiError";
import { Request, Response } from "express";
import { ApiResponse } from "../util/apiResponse";
import { TimeTable } from "../models/timetable.model.nosql";
import { getQuestionPaper,getQuestionPaperForEaxaminer } from "../db/Query.db";
import prisma from "../db/database.Postgres";

interface Requestany extends Request {
    examData?: any
}

type examdata={
    examID:string
    QuestionPaperId:string
}

type timetable={
    Subject:Object
    Class:string
    CollegeName:string
}

type examdataupdata={
    marks: Number           
    resultVerify: Boolean  
    passingMark:  Number   
    obtainedMarks: Number   
    totalMarks: Number
}

const scheuldeExam = AsyncHandler(async (req: Requestany, res: Response) => {

})


const getSubject = AsyncHandler(async (req: Requestany, res: Response) => {

})

const makeTimetable = async (req: Requestany, res: Response) => {//create time 
    const timetable:timetable = req.body;//takes data from user subjects 
    if (!timetable) throw new ApiError(400, "timetable is not provided");//checks if subject or class is provide or not if not throw error
    const dataInsert = await TimeTable.create({//if provide then insert data in mongo db
        Class:timetable.Class,
        Subjects: timetable.Subject, // imp, subject is a nested object
        Aprrove: false,//waiting for approveable from college
        CollegeName:timetable.CollegeName
    });
    if (!dataInsert) throw new ApiError(500, "Something went wrong while inserting timetable in database");//if for some reasone data is not update throw error
    return res.status(200).json(new ApiResponse(200, dataInsert));//return data after inserting



}

//@ts-ignore
const getQuestionPaperForEaxaminers = AsyncHandler(async (req: Requestany, res: Response) => {
    const examdata:examdata=req.examData;
    if(!examdata) throw new ApiError(400,"examID and QuestionPaperID");
    const examPaper=await getQuestionPaperForEaxaminer(examdata.examID,examdata.QuestionPaperId);
    if(!examPaper)throw new ApiError(406,"didn't found questionpaper");
    return res.status(200).json(new ApiResponse(200,examPaper));
  
})

//@ts-ignore
const UpdateQuestionPaperMarks = AsyncHandler(async (req: Requestany, res: Response) => {
    const examdata:examdata= req.examData;
    const examdataupdata:examdataupdata = req.body;
    if (!examdataupdata) throw new ApiError(400, "examId and marks are not provied");
    const findQuestionpaper = await getQuestionPaperForEaxaminer(examdata.examID,examdata.QuestionPaperId);
    if(!findQuestionpaper)throw new ApiError(406,"no able to find question paper");
    const updatemarks=await prisma.Result.update({
        where:{
            questionPaperID:examdata.QuestionPaperId
        },
        data:{
            marks:examdataupdata.marks,           
            resultVerify:examdataupdata.resultVerify,    
            passingMark:examdataupdata.passingMark,     
            obtainedMarks:examdataupdata.obtainedMarks,   
            totalMarks:examdataupdata.totalMarks, 
        }
    });
    if(!updatemarks)throw new ApiError(406,"unable to update reult");
    return res.status(200).json(new ApiResponse(200,updatemarks));



})

