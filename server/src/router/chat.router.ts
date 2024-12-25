import { LeaveRoom, connectChat, createChatRoom, getChats, getUserInChat, joinChatRoom } from "../controller/chat.controller.js";
import { verifyData } from "../middelware/auth.middeleware.js";
import { SearchChatRoom } from "../middelware/chat.middeleware.js";

import { Router } from "express";

const router = Router();

router.route("/createChat").post(verifyData, createChatRoom);
router.route("/getChat").get(verifyData,getChats);
router.route("/ChatQuery/:roomName").post(verifyData,SearchChatRoom ,joinChatRoom).
    put(verifyData, SearchChatRoom, LeaveRoom).get(verifyData, SearchChatRoom, getUserInChat);
router.route("/connectChat/:roomName").post(verifyData,SearchChatRoom,connectChat);
export default router;