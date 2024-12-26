import { Router } from "express";
import { verifyData } from "../middelware/auth.middeleware.js";
import { AprroveTimeTable, CreateSubject, StudentVeryify, TimeTableSearch, findStudnets, getExaminer, getSubjects } from "../controller/college.controller.js";
const router=Router();

router.route("/subject").get(verifyData,TimeTableSearch).post(getSubjects).put(AprroveTimeTable)
router.route("/createSubject").post(CreateSubject);
router.route("/student").get(verifyData,findStudnets).put(verifyData,StudentVeryify);
router.route("/examiner").get(verifyData,getExaminer);

export default router;