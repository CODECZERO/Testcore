import {Router} from "express";
import { getExam, getQuestionPaperForStundet, getResult, getTimeTable, giveExam } from "../controller/student.controller.js";
import cacheCheck from "../middelware/ExamCache.middleware.js";
import { verifyData, verifyexamData } from "../middelware/auth.middeleware.js";


const router=Router();


router.route("/Exam").get(verifyexamData,getExam).put(verifyexamData,giveExam);
router.route("/TimeTalbe").put(getTimeTable);
router.route("/Result").get(verifyexamData,getResult);
router.route("/Question").get(verifyexamData,getQuestionPaperForStundet);

export default router;