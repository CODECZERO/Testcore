import { Router } from "express";
import { UpdateQuestionPaper, getExam, getParticipant, getQuestionPaperForExaminers,makeQuestionPaper,makeTimetable,scheuldeExam, updateQuestionPaperMarks } from "../controller/examiner.controller.js";
import cacheCheck from "../middelware/ExamCache.middleware.js";

const router=Router();
router.use(cacheCheck)
router.route("/scheuldeExam").post(scheuldeExam);
router.route("/questionPaper").get(getQuestionPaperForExaminers).post(makeQuestionPaper).put(UpdateQuestionPaper);
router.route("/afterExam").get(getParticipant).put(updateQuestionPaperMarks);
router.route("/exam").get(getExam)
router.route("/timeTable").post(makeTimetable);

export default router;