import { Router } from "express";
import { messageHandler } from "../controller/notification.controller.js";
const router = Router();
router.route("/sendNotification").post(messageHandler);
export default router;
