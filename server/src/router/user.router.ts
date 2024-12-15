import { Router, RequestHandler } from "express";
import { signup, login, getCollege, updatePassword, SessionActive, getClass, createClass, updateProfileImage, getProfileImage } from "../controller/user.controller.js";
import { verifyData } from "../middelware/auth.middeleware.js";
import validateAndSanitize from "../middelware/security.middeleware.js";
import { upload } from "../middelware/fileUpload.middelware.js";
// import connectChat from "../middelware/chatConnect.middeleware.js";

const router = Router();

router.route("/signup").post(validateAndSanitize as RequestHandler[], signup).get(getCollege);
router.route("/login").post(login);
router.route("/userData").put(verifyData, updatePassword).get(verifyData, SessionActive)
router.route("/class").get(getClass).post(createClass);
// router.route("/chat/:college/:branch").get(connectChat);

router.route("/profile").get(verifyData, getProfileImage).post(verifyData,
    upload.single("ProfileImage"), updateProfileImage
);

export default router;
