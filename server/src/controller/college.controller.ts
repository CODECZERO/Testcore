import { Request, Response } from "express";
import AsyncHandler from "../util/ayscHandler.js"
import prisma from "../db/database.Postgres.js"
import { findStudnet, getSubject } from "../db/Query.sql.db.js"
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import { TimeTable } from "../models/timetable.model.nosql.js";

//get subjects for college
interface Requestany extends Request {
    user?: any
}
type subject = {
    subjectCode: string
    subjectName: string

}
type timetable = {
    timetableId: string,
    approve: boolean
}

const getSubjects = AsyncHandler(async (req: Request, res: Response) => {//get subject for college
    const subject: subject = req.body;//taking subject name and code 
    let subjects;
    if (!subject) {//if it doesn't exist then return whole table or subject name or code is not provide then return all
        subjects = await prisma.subject.findMany({//try puting pagenation here and function like it because , it can increase load on database
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
});

//this function creates subject for college

const CreateSubject = AsyncHandler(async (req: Request, res: Response) => {
    const subject: subject = req.body;//takes subject from college to create
    if (!subject) throw new ApiError(400, "subjectcode or subjectName is not provided");//check if value is provided or not
    //checking if subject exists or not if yes return subject exists if not then create it 
    const subjectFind = await getSubject(subject.subjectCode, subject.subjectName);//checking database if subject exists
    if (subjectFind) return res.status(200).json(new ApiResponse(200, subjectFind, "Subject Exists"));//if exists then return it

    const createSubject = await prisma.subject.create({//else create subject 
        //@ts-ignore
        data: {
            subjectCode: subject.subjectCode,
            subjectName: subject.subjectName,
            subjectVerify:true
        }
    });
    if (!createSubject) throw new ApiError(500, "Something went wrrong while creating subject");//check if the subject is create and throw error if doesn't
    return res.status(201).json(new ApiResponse(201, createSubject, "Subject created"));//if create then return
})

const findStudnets = AsyncHandler(async (req: Requestany, res: Response) => {//finds studnet for college
    const { Id } = req.user;//takes college id
    if (!Id) throw new ApiError(400,"invliad request")//check's if provided
    const StudentData = await findStudnet(req.user);// then call database how many student are there
    return res.status(200).json(new ApiResponse(200, StudentData));//return if data is found

})

const StudentVeryify = AsyncHandler(async (req: Requestany, res: Response) => {//college can verify student
    const { Id } = req.user;//take college id
    const { approve } = req.body;//check if approve is given or not 
    if (!Id) throw new ApiError(400, "id is not provied");//if there not id then throw error
    const veryifyStudent = await prisma.student.updateMany(//update studnet profile
        {
            where: {
                collegeID: req.user?.Id
            },
            data: {
                studentVerify: approve
            }
        }
    )

    if (!veryifyStudent) throw new ApiError(503, "some thing went wrong while updating data");//if not able to update then throw errror
    return res.status(200).json(new ApiResponse(200, veryifyStudent, "Student veryify"));//return new data if able to update
});

const getExaminer = AsyncHandler(async (req: Requestany, res: Response) => {//get examiner for college
    const { Id } = req.user;//takes college id
    if(!Id) throw new ApiError(400,"invlaid request");

    const findExaminer = await prisma.examiner.findMany({//find examiner
        where: {
            college:{
                some:{
                    Id:Id
                }
            }
        },
        select: {
            Id: true,
            name: true,
            email: true,
            phoneNumber: true,
            examinerVerify: true,
            address: true
        }
    });
    if (!findExaminer) return res.status(200).json(new ApiResponse(200, "no examiner register at time"));//if unable to find examiner then throw error
    return res.status(200).json(new ApiResponse(200, findExaminer));//else return the data



});

const TimeTableSearch = AsyncHandler(async (req: Requestany, res: Response) => {//search's time table for college
    try {
        const CollegeData = req.user;//take college name by using it's access token
        

        const getTimeTable = await TimeTable.find({//finds time table of the college by using it's name only college can those timetable without approvable
                CollegeName: CollegeData.name//search using college name
        })

        if (!getTimeTable) return res.status(200).json(new ApiResponse(200, "There is no timetable at this time"));//if there is no timetable then send ok reponse
        return res.status(200).json(new ApiResponse(200, getTimeTable));//else send time table
    } catch (error) {
        throw new ApiError(500, "some thing went wrong, while searching time table");//if error occure throw error
    }
})


const AprroveTimeTable = AsyncHandler(async (req: Request, res: Response) => {//approve time table function
    const timetable: timetable = req.body;//takes data like time table id and aprrove , approve is true or false
    if (!timetable) return res.status(200).json(new ApiResponse(200, "aprrove is false or timetableId is not provided"));//if aprrove or id is false then there is no database operation

    const updateAprrove = await TimeTable.findByIdAndUpdate({//if both of the things are given then find theme and update theme

    });

    if (!(updateAprrove)) throw new ApiError(200, "something went wrong while updating time table");//if updateAprrove fail then return error
    return res.status(200).json(new ApiResponse(200, updateAprrove));//else return updated time table
});

export {
    getSubjects,
    AprroveTimeTable,
    TimeTableSearch,
    CreateSubject,
    StudentVeryify,
    getExaminer,
    findStudnets
}