import AsyncHandler from "../util/ayscHandler";
import { ApiError } from "../util/apiError";
import { Request,Response } from "express";
import { ApiResponse } from "../util/apiResponse";
import prisma from "../db/database.Postgres";
import mongoose from "mongoose";
import { TimeTable } from "../models/timetable.model.nosql";



const scheuldeExam = AsyncHandler(async (req: Request, res: Response) => {

})


const postTimeTable = AsyncHandler(async (req: Request, res: Response) => {

})

const getSubject = AsyncHandler(async (req: Request, res: Response) => {

})

const makeTimetable = async (req: Request, res: Response) => {//create time 
    const {Subjects,Class,CollegeName}  =req.body;//takes data from user subjects 
    if (!(Subjects||Class)) throw new ApiError(400, "timetable is not provided");//checks if subject or class is provide or not if not throw error
    const dataInsert=await TimeTable.create({//if provide then insert data in mongo db
        Class,
        Subjects:Subjects, // imp, subject is a nested object
        Aprrove:false,//waiting for approveable from college
        CollegeName
    });
    if(!dataInsert)throw new ApiError(500,"Something went wrong while inserting timetable in database");//if for some reasone data is not update throw error
    return res.status(200).json(new ApiResponse(200,dataInsert));//return data after inserting



}