import prisma from "../db/database.Postgres.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import AsyncHandler from "../util/ayscHandler.js";
import { Request, Response } from "express";
import { TimeTable } from "../models/timetable.model.nosql.js";
import { findSingleCollegeForStudent, getQuestionPaper } from "../db/Query.sql.db.js";
import { ClassModel } from "../models/class.model.nosql.js";


//here change logic , of exam data or make function for examdata with token intergation with other user id and college id , exam-college - college will check student and add data on student table which is sql id of exam or can take unqiue exam from user as input then find that exam
type examdata = {
    examID: string
    QuestionPaperId: string
    SubjectID: string
    Answer: string
    StudentId: string
    QuestionPapaerData: string
    findTokenInDb:any//refers to exam data
    userData:any//refers to user data
}

type user = {
    Id: string
}

interface Requestany extends Request {
    examData?: any
    user?: any
}


const giveExam = AsyncHandler(async (req: Requestany, res: Response) => {//this function saves question data in database
    const examdata: examdata = req.examData;//takes data from user
    const {Answer,QuestionPapaerData}=req.body;
    const answerQuestion = await prisma.questionPaper.create({//updates question paper answer col
        data: {
            SubjectID: examdata.findTokenInDb.SubjectID,
            studentID: examdata.userData.Id,
            examID: examdata.findTokenInDb.Id,
            answer: Answer,
            question: JSON.stringify(QuestionPapaerData)
        }
    });
    if (!answerQuestion) throw new ApiError(421, "answer was not updated");//if unable to update then throw error
    return res.status(201).json(new ApiResponse(201, answerQuestion, "answer saved"));//else return successfuly message


})

const getExam = AsyncHandler(async (req: Requestany, res: Response) => {//get exam data
    const examData: examdata = req.examData;//takes parameters from user
    if (!examData.findTokenInDb.Id) throw new ApiError(401, "exam data is not provied");//throw error if not provided
    //@ts-ignore
    const findexam = prisma.exam.findFirst({//find first data which matchs examID
        where: {
            Id:examData.findTokenInDb.Id,
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

const getTimeTable = AsyncHandler(async (req: Requestany, res: Response) => {//get tiem table from mongodb
    const user: user = req.user;//takes data from user
    const {Class}=req.body;//takes data from user
    const {...name}=await findSingleCollegeForStudent(user?.Id);//finds user college using his id;
    if (!Class || !name) throw new ApiError(400, "Invalid data");//if not provided then throw error
    const findtimetable = await TimeTable.findOne({//find only one data which have class and college name provided
        Class: Class,
        CollegeName:name
    })
    if (!findtimetable) throw new ApiError(404, "time table not found");//not found throw error
    return res.status(200).json(new ApiResponse(200, findtimetable, `time table of class ${Class} of ${name}`));//else return data
})

const getResult = AsyncHandler(async (req: Requestany, res: Response) => {//get result for student
    const resultdata: examdata = req.examData;//takes parameters from user
    if (!resultdata||!resultdata.userData.Id) throw new ApiError(401, "no data is provied");//if not provided then throw error
    const findresult = await prisma.result.findMany({//find all data realted to that student or question paper
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
    if (!resultdata) throw new ApiError(404, "result Not found");//throw error if not found
    return res.status(200).json(new ApiResponse(200, findresult, "result found"));//return value if found
})

const getQuestionPaperForStundet = AsyncHandler(async (req: Requestany, res: Response) => {//get question for studnet
    const examdata: examdata = req.examData;//take parameters from studnet
    if (!examdata.findTokenInDb.Id) throw new ApiError(400, "examid is not provided");
    const findexam = await getQuestionPaper(examdata.findTokenInDb.Id);//find in database
    if (!findexam) throw new ApiError(400, "no exam found");//if not found throw error
    return res.status(200).json(new ApiResponse(200, findexam, "Question paper data"));//if found then return data
})

export {
    getExam,
    getResult,
    getTimeTable,
    getQuestionPaperForStundet,
    giveExam
}