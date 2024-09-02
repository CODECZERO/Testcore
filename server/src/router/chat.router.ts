import { LeaveRoom, connectChat, createChatRoom, deleteChat, getUserInChat, joinChatRoom } from "../controller/chat.controller.js";
import { verifyData } from "../middelware/auth.middeleware.js";
import { SearchChatRoom } from "../middelware/chat.middeleware.js";

import { Router } from "express";

const router = Router();

router.route("/createChat").post(verifyData, createChatRoom);
router.route("/ChatQuery/:College/:Branch").post(verifyData, joinChatRoom).
    put(verifyData, SearchChatRoom, LeaveRoom).delete(verifyData, deleteChat).get(verifyData, SearchChatRoom, getUserInChat);
router.route("/connectChat/:College/:Branch").post(verifyData,SearchChatRoom,connectChat);
export default router;