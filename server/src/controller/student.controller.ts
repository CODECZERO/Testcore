import prisma from "../db/database.Postgres.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import AsyncHandler from "../util/ayscHandler.js";


const giveExam=AsyncHandler(async(req:Request,res:Response)=>{

})

const getExam=AsyncHandler(async(req:Request,res:Response)=>{

})
const getTimeTable=AsyncHandler(async(req:Request,res:Response)=>{

})

const getResult=AsyncHandler(async(req:Request,res:Response)=>{

})

const getSubject=AsyncHandler(async(req:Request,res:Response)=>{
    return await prisma.Subject.findMany({
        where:{
            
        }
    })
})

const StudentPerformance = AsyncHandler(async (req: Request, res: Response) => {

})

