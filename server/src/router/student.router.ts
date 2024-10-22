import {Router} from "express";
import { getExam, getQuestionPaperForStundet, getResult, getTimeTable, giveExam } from "../controller/student.controller.js";
import cacheCheck from "../middelware/ExamCache.middleware.js";
import { verifyData } from "../middelware/auth.middeleware.js";


const router=Router();


router.route("/Exam").get(verifyData,getExam).put(verifyData,giveExam);
router.route("/TimeTalbe").put(getTimeTable);
router.route("/Result").get(getResult);
router.route("/Question").get(getQuestionPaperForStundet);

export default router;