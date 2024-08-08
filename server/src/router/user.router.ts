import { Router } from "express";
import { signup, login, getCollege } from "../controller/user.controller.js";

const router = Router();

router.route("/signup").post(signup).get(getCollege);
router.route("/login").post(login);

export default router;
