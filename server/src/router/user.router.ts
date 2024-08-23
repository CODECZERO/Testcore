import { Router } from "express";
import { signup, login, getCollege,updatePassword } from "../controller/user.controller.js";
import { verifyData } from "../middelware/auth.middeleware.js";
import runWebSocket from "../services/chat/chat.service.js";
import connectChat from "../middelware/chatConnect.middeleware.js";

const router = Router();

router.route("/signup").post(signup).get(getCollege);
router.route("/login").post(login);
router.route("/userData").put(verifyData,updatePassword);
router.route("/chat/:college/:branch").put(connectChat);

export default router;
