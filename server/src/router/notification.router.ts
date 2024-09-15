import { Router } from "express";
import { verifyData } from "../middelware/auth.middeleware.js";
import { messageHandler } from "../controller/notification.controller.js";

const router=Router();

router.route("/sendNotification").post(messageHandler)

export default router;