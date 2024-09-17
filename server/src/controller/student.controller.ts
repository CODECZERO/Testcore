import prisma from "../db/database.Postgres.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import AsyncHandler from "../util/ayscHandler.js";
import { Request, Response } from "express";
import { TimeTable } from "../models/timetable.model.nosql.js";
import { getQuestionPaper } from "../db/Query.sql.db.js";

type examdata = {
    examID: string
    QuestionPaperId: string
    SubjectID: string
    Answer: string
    StudentId:string
}

interface Requestany extends Request {
    examData?: any
    user?: any
}
type classData = {
    Class: string
    CollegeName: string
}

const giveExam = AsyncHandler(async (req: Requestany, res: Response) => {//this function saves question data in database
    const examdata: examdata = req.examData;//takes data from user
    const answerQuestion = await prisma.questionPaper.update({//updates question paper answer col
        where: {
            Id: examdata.examID
        },
        data: {
            answer: examdata.Answer
        }
    });
    if (!answerQuestion) throw new ApiError(421, "answer was not updated");//if unable to update then throw error
    return res.status(201).json(new ApiResponse(201, answerQuestion, "answer saved"));//else return successfuly message


})

//@ts-ignore
const getExam = AsyncHandler(async (req: Requestany, res: Response) => {//get exam data
    const examdata: examdata = req.examData;//takes parameters from user
    if (!examdata||!examdata.examID) throw new ApiError(401, "exam data is not provied");//throw error if not provided
    //@ts-ignore
    const findexam = prisma.exam.findFirst({//find first data which matchs examID
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
        include: {//query subject table too
            Subject: {
                select: {//takes this values from subject table
                    Id: true,
                    subjectCode: true,
                    subjectName: true,
                }
            }
        }//return nested object 
    });
    if (!findexam) throw new ApiError(404, "exam not found");//if not found then throw error
    return res.status(200).json(new ApiResponse(200, findexam, "Exam Found"));//else return response

})

const getTimeTable = AsyncHandler(async (req: Request, res: Response) => {//get tiem table from mongodb
    const classdata: classData = req.body;//takes data from user
    if (!classdata||!classdata.Class||!classdata.CollegeName) throw new ApiError(400, "Invalid data");//if not provided then throw error
    const findtimetable = await TimeTable.findOne({//find only one data which have class and college name provided
        Class: classdata.Class,
        CollegeName: classdata.CollegeName
    })
    if (!findtimetable) throw new ApiError(404, "time table not found");//not found throw error
    return res.status(200).json(new ApiResponse(200, findtimetable, `time table of class ${classdata.Class} of ${classdata.CollegeName}`));//else return data
})

const getResult = AsyncHandler(async (req: Requestany, res: Response) => {//get result for student
    const resultdata:examdata=req.examData;//takes parameters from user
    if(!resultdata)throw new ApiError(401,"no data is provied");//if not provided then throw error
    const findresult=await prisma.result.findMany({//find all data realted to that student or question paper
        where:{
            OR:[
                {questionPaperID:resultdata.QuestionPaperId},
                {StudentId:resultdata.StudentId}
            ]
        },
        select:{
            Id:true,                     
            marks:true,          
            resultVerify:true,   
            passingMark:true,     
            obtainedMarks:true,   
            totalMarks:true,      
            questionPaperID:true ,
            StudentId:true
        }
    });
    if(!resultdata)throw new ApiError(404,"result Not found");//throw error if not found
    return res.status(200).json(new ApiResponse(200,findresult,"result found"));//return value if found
})

const getQuestionPaperForStundet = AsyncHandler(async (req: Requestany, res: Response) => {//get question for studnet
    const examdata: examdata = req.examData;//take parameters from studnet
    if(!examdata.examID) throw new ApiError(400,"exmaid is not provided");
    const findexam = await getQuestionPaper(examdata.examID);//find in database
    if (!findexam) throw new ApiError(400, "no exam found");//if not found throw error
    return res.status(200).json(new ApiResponse(200, findexam, "Question papre data"));//if found then return data
})

export {
    getExam,
    getResult,
    getTimeTable,
    getQuestionPaperForStundet,
    giveExam
}