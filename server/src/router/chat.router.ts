import { LeaveRoom, connectChat,createChatRoom, deleteChat, getUserInChat, joinChatRoom} from "../controller/chat.controller.js";
import { verifyData } from "../middelware/auth.middeleware.js";
import { SearchChatRoom } from "../middelware/chat.middeleware.js";

import { Router } from "express";

const router=Router();

router.route("/createChat").post(verifyData,createChatRoom);
router.route("/ChatQuery").post(verifyData,SearchChatRoom,joinChatRoom).put(verifyData,LeaveRoom).delete(verifyData,deleteChat);
router.route("/:College/:Branch").post(verifyData,SearchChatRoom,getUserInChat);

export default router;