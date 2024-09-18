import { Router } from "express";
import { verifyData } from "../middelware/auth.middeleware.js";
import { AprroveTimeTable, CreateSubject, StudentVeryify, TimeTableSearch, findStudnet, getExaminer, getSubjects } from "../controller/college.controller.js";
const router = Router();
router.route("/Subject").get(verifyData, TimeTableSearch).put(getSubjects).put(AprroveTimeTable);
router.route("/createSubject").put(CreateSubject);
router.route("/Student").get(verifyData, findStudnet).put(verifyData, StudentVeryify);
router.route("/Examiner").get(verifyData, getExaminer);
export default router;
