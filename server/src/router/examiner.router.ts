import { Router } from "express";
import { UpdateQuestionPaper, getExam, getParticipant, getQuestionPaperForExaminers,makeQuestionPaper,makeTimetable,scheuldeExam, updateQuestionPaperMarks } from "../controller/examiner.controller.js";
import cacheCheck from "../middelware/ExamCache.middleware.js";

const router=Router();

router.route("/scheuldeExam").post(scheuldeExam);
router.route("/questionPaper").get(cacheCheck,getQuestionPaperForExaminers).post(cacheCheck,makeQuestionPaper).put(cacheCheck,UpdateQuestionPaper);
router.route("/afterExam").get(cacheCheck,getParticipant).put(cacheCheck,updateQuestionPaperMarks);
router.route("/exam").get(cacheCheck,getExam)
router.route("/timeTable").post(makeTimetable);

export default router;