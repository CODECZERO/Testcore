import { Router } from "express";
import { signup, login, getCollege,updatePassword } from "../controller/user.controller.js";
import { verifyData } from "../middelware/auth.middeleware.js";

const router = Router();

router.route("/signup").post(signup).get(getCollege);
router.route("/login").post(login);
router.route("/userData").put(verifyData,updatePassword);

export default router;
