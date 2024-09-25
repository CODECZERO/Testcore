import { Router } from "express";
import { signup, login, getCollege,updatePassword, SessionActive } from "../controller/user.controller.js";
import { verifyData } from "../middelware/auth.middeleware.js";
import validateAndSanitize from "../middelware/security.middeleware.js";
// import connectChat from "../middelware/chatConnect.middeleware.js";

const router = Router();

router.route("/signup").post(validateAndSanitize,signup).get(getCollege);
router.route("/login").post(login);
router.route("/userData").put(verifyData,updatePassword).get(verifyData,SessionActive);
// router.route("/chat/:college/:branch").get(connectChat);

export default router;
