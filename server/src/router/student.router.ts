import {Router} from "express";
import { getExam, getQuestionPaperForStundet, getResult, getTimeTable, giveExam } from "../controller/student.controller.js";
import cacheCheck from "../middelware/ExamCache.middleware.js";


const router=Router();

router.use(cacheCheck);

router.route("/Exam").get(getExam).put(giveExam);
router.route("/TimeTalbe").put(getTimeTable);
router.route("/Result").get(getResult);
router.route("/Question").get(getQuestionPaperForStundet);

export default router;