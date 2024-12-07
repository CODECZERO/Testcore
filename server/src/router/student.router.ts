import {Router} from "express";
import { getExam, getQuestionPaperForStundet, getResult, getTimeTable, giveExam } from "../controller/student.controller.js";
import cacheCheck from "../middelware/ExamCache.middleware.js";
import { verifyData, verifyexamData } from "../middelware/auth.middeleware.js";


const router=Router();


router.route("/Exam").post(verifyexamData,getExam).put(verifyexamData,giveExam);
router.route("/TimeTable").post(getTimeTable);
router.route("/Result").post(verifyexamData,getResult);
router.route("/Question").post(verifyexamData,getQuestionPaperForStundet);

export default router;