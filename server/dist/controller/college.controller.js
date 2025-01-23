var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AsyncHandler from "../util/ayscHandler.js";
import prisma from "../db/database.Postgres.js";
import { findStudnet, getSubject } from "../db/Query.sql.db.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import { TimeTable } from "../models/timetable.model.nosql.js";
const getSubjects = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = req.body; //taking subject name and code 
    let subjects;
    if (!subject) { //if it doesn't exist then return whole table or subject name or code is not provide then return all
        subjects = yield prisma.subject.findMany({
            select: {
                Id: true,
                subjectCode: true,
                subjectName: true,
            }
        });
    }
    if (subjects)
        return res.status(200).json(new ApiResponse(200, subjects, "subject found"));
    const subjectGeter = yield getSubject(subject.subjectCode, subject.subjectName); //if subject name and code is provide then search for theme
    if (!subjectGeter)
        res.status(204).json(new ApiResponse(204, "no subject is there currently of this name"));
    return res.status(200).json(new ApiResponse(200, subjectGeter, "Subjects found"));
}));
//this function creates subject for college
const CreateSubject = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = req.body; //takes subject from college to create
    if (!subject)
        throw new ApiError(400, "subjectcode or subjectName is not provided"); //check if value is provided or not
    //checking if subject exists or not if yes return subject exists if not then create it 
    const subjectFind = yield getSubject(subject.subjectCode, subject.subjectName); //checking database if subject exists
    if (subjectFind)
        return res.status(200).json(new ApiResponse(200, subjectFind, "Subject Exists")); //if exists then return it
    const createSubject = yield prisma.subject.create({
        //@ts-ignore
        data: {
            subjectCode: subject.subjectCode,
            subjectName: subject.subjectName,
            subjectVerify: true
        }
    });
    if (!createSubject)
        throw new ApiError(500, "Something went wrrong while creating subject"); //check if the subject is create and throw error if doesn't
    return res.status(201).json(new ApiResponse(201, createSubject, "Subject created")); //if create then return
}));
const findStudnets = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Id } = req.user; //takes college id
    if (!Id)
        throw new ApiError(400, "invliad request"); //check's if provided
    const StudentData = yield findStudnet(req.user); // then call database how many student are there
    return res.status(200).json(new ApiResponse(200, StudentData)); //return if data is found
}));
const StudentVeryify = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { Id } = req.user; //take college id
    const { approve } = req.body; //check if approve is given or not 
    if (!Id)
        throw new ApiError(400, "id is not provied"); //if there not id then throw error
    const veryifyStudent = yield prisma.student.updateMany(//update studnet profile
    {
        where: {
            collegeID: (_a = req.user) === null || _a === void 0 ? void 0 : _a.Id
        },
        data: {
            studentVerify: approve
        }
    });
    if (!veryifyStudent)
        throw new ApiError(503, "some thing went wrong while updating data"); //if not able to update then throw errror
    return res.status(200).json(new ApiResponse(200, veryifyStudent, "Student veryify")); //return new data if able to update
}));
const getExaminer = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Id } = req.user; //takes college id
    if (!Id)
        throw new ApiError(400, "invlaid request");
    const findExaminer = yield prisma.examiner.findMany({
        where: {
            college: {
                some: {
                    Id: Id
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
    if (!findExaminer)
        return res.status(200).json(new ApiResponse(200, "no examiner register at time")); //if unable to find examiner then throw error
    return res.status(200).json(new ApiResponse(200, findExaminer)); //else return the data
}));
const TimeTableSearch = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CollegeData = req.user; //take college name by using it's access token
        const getTimeTable = yield TimeTable.find({
            $match: {
                CollegeName: CollegeData.name //search using college name
            }
        });
        if (!getTimeTable)
            return res.status(200).json(new ApiResponse(200, "There is no timetable at this time")); //if there is no timetable then send ok reponse
        return res.status(200).json(new ApiResponse(200, getTimeTable)); //else send time table
    }
    catch (error) {
        throw new ApiError(500, "some thing went wrong, while searching time table"); //if error occure throw error
    }
}));
const AprroveTimeTable = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const timetable = req.body; //takes data like time table id and aprrove , approve is true or false
    if (!timetable)
        return res.status(200).json(new ApiResponse(200, "aprrove is false or timetableId is not provided")); //if aprrove or id is false then there is no database operation
    const updateAprrove = yield TimeTable.findByIdAndUpdate({ //if both of the things are given then find theme and update theme
    });
    if (!(updateAprrove))
        throw new ApiError(200, "something went wrong while updating time table"); //if updateAprrove fail then return error
    return res.status(200).json(new ApiResponse(200, updateAprrove)); //else return updated time table
}));
export { getSubjects, AprroveTimeTable, TimeTableSearch, CreateSubject, StudentVeryify, getExaminer, findStudnets };
