import { Request, Response } from "express";
import AsyncHandler from "../util/ayscHandler.js"
import prisma from "../db/database.Postgres.js"
import { findStudnet, getSubject } from "../db/Query.db.js"
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import { TimeTable } from "../models/timetable.model.nosql.js";

//get subjects for college
interface Requestany extends Request {
    user?: any
}
//@ts-ignore

const getSubjects = AsyncHandler(async (req: Request, res: Response) => {//get subject for college
    const { subjectCode, subjectName } = req.body;//taking subject name and code 
    let subjects;
    if (!(subjectCode || subjectName)) {//if it doesn't exist then return whole table or subject name or code is not provide then return all
        subjects = await prisma.Subject.findMany({//try puting pagenation here and function like it because , it can increase load on database
            select: {
                Id: true,
                subjectCode: true,
                subjectName: true,
            }
        });
    }
    if (subjects) return res.status(200).json(new ApiResponse(200, subjects, "subject found"));

    const subjectGeter = await getSubject(subjectCode, subjectName);//if subject name and code is provide then search for theme
    if (!subjectGeter) res.status(204).json(new ApiResponse(204, "no subject is there currently of this name"))
    return res.status(200).json(new ApiResponse(200, subjectGeter, "Subjects found"));
});

//this function creates subject for college
//@ts-ignore

const CreateSubject = AsyncHandler(async (req: Request, res: Response) => {
    const { subjectCode, subjectName } = req.body;//takes subject from college to create
    if (!(subjectCode & subjectName)) throw new ApiError(400, "subjectcode or subjectName is not provided");//check if value is provided or not
    //checking if subject exists or not if yes return subject exists if not then create it 
    const subjectFind = await getSubject(subjectCode, subjectName);//checking database if subject exists
    if (subjectFind) return res.status(200).json(new ApiResponse(200, subjectFind, "Subject Exists"));//if exists then return it

    const createSubject = await prisma.Subject.create({//else create subject 
        data: {
            subjectCode,
            subjectName
        }
    });
    if (!createSubject) throw new ApiError(500, "Something went wrrong while creating subject");//check if the subject is create and throw error if doesn't
    return res.status(201).json(new ApiResponse(201, createSubject, "Subject created"));//if create then return
})
//@ts-ignore

const findStudnets = AsyncHandler(async (req: Requestany, res: Response) => {
    const { Id } = req.user;
    let StudentData;
    if (Id)
        StudentData = await findStudnet(req.user);

    if (!StudentData) return res.status(200).json(new ApiResponse(200, "no student is cruently register"));
    return res.status(200).json(new ApiResponse(200, StudentData));

})
//@ts-ignore

const StudentVeryify = AsyncHandler(async (req: Requestany, res: Response) => {
    const { Id } = req.user;
    const { approve } = req.body;
    if (!Id) throw new ApiError(400, "id is not provied");
    const studentdata = await findStudnet(req.user);
    if (!studentdata) throw new ApiError(502, "error while finding student");
    const veryifyStudent = await prisma.Student.updateMany(
        {
            where: {
                collegeID: req.user?.Id
            },
            data: {
                studentVerify: approve
            }
        }
    )

    if (!veryifyStudent) throw new ApiError(503, "some thing went wrong while updating data")
    return res.status(200).json(new ApiResponse(200, veryifyStudent, "Student veryify"));
}
)
//@ts-ignore

const getExaminer = AsyncHandler(async (req: Requestany, res: Response) => {
    const { Id } = req.user;
    const findExaminer = await prisma.Examiner.findMany({
        where: {
            college: Id
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
    if (!findExaminer) return res.status(200).json(new ApiResponse(200, "no examiner register at time"));
    return res.status(200).json(new ApiResponse(200, findExaminer));



});
//@ts-ignore
const TimeTableSearch = AsyncHandler(async (req: Requestany, res: Response) => {//search's time table for college
    try {
        const CollegeData = req.user;//take college name by using it's access token


        const getTimeTable = await TimeTable.find({//finds time table of the college by using it's name only college can those timetable without approvable
            $match: {
                CollegeName: CollegeData.name//search using college name
            }
        })

        if (!getTimeTable) return res.status(200).json(new ApiResponse(200, "There is no timetable at this time"));//if there is no timetable then send ok reponse
        return res.status(200).json(new ApiResponse(200, getTimeTable));//else send time table
    } catch (error) {
        throw new ApiError(500, "some thing went wrong, while searching time table");//if error occure throw error
    }
})
//@ts-ignore
const AprroveTimeTable = AsyncHandler(async (req: Request, res: Response) => {//approve time table function
    const { approve, timetableId } = req.body;//takes data like time table id and aprrove , approve is true or false
    if (!(approve)) return res.status(200).json(new ApiResponse(200, "aprrove is false"));//if aprrove is false then there is no database operation
    else if (!(timetableId)) throw new ApiError(400, "timetableId is not provied");//if id is not given throw error that id is not given

    const updateAprrove = await TimeTable.findByIdAndUpdate({//if both of the things are given then find theme and update theme

    });

    if (!(updateAprrove)) throw new ApiError(200, "something went wrong while updating time table");//if updateAprrove fail then return error
    return res.status(200).json(new ApiResponse(200, updateAprrove));//else return updated time table
}
);
export {
    getSubjects,
    AprroveTimeTable,
    TimeTableSearch,
    CreateSubject,
    StudentVeryify,
    getExaminer
}