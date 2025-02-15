import { Router } from "express";
import { UpdateQuestionPaper, getExam, getParticipant, getQuestionPaperForExaminers, makeQuestionPaper, makeTimetable, scheuldeExam, updateQuestionPaperMarks } from "../controller/examiner.controller.js";
import cacheCheck from "../middelware/ExamCache.middleware.js";
import { verifyData } from "../middelware/auth.middeleware.js";
const router = Router();
router.route("/scheuldeExam").post(verifyData, scheuldeExam);
router.route("/questionPaper").get(verifyData, cacheCheck, getQuestionPaperForExaminers).post(verifyData, cacheCheck, makeQuestionPaper).put(verifyData, cacheCheck, UpdateQuestionPaper);
router.route("/afterExam").get(verifyData, cacheCheck, getParticipant).put(verifyData, cacheCheck, updateQuestionPaperMarks);
router.route("/exam").get(cacheCheck, getExam);
router.route("/timeTable").post(makeTimetable);
export default router;
