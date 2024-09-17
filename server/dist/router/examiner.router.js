import { Router } from "express";
import { UpdateQuestionPaper, getExam, getParticipant, getQuestionPaperForExaminers, makeQuestionPaper, makeTimetable, scheuldeExam, updateQuestionPaperMarks } from "../controller/examiner.controller.js";
const router = Router();
router.route("/scheuldeExam").post(scheuldeExam);
router.route("/questionpaper").get(getQuestionPaperForExaminers).post(makeQuestionPaper).put(UpdateQuestionPaper);
router.route("/QuestionPaper").get(getParticipant).put(updateQuestionPaperMarks);
router.route("/Exam").get(getExam);
router.route("/TimeTable").post(makeTimetable);
export default router;
