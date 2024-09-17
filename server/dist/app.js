import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.router.js";
import logingRouter from "./router/loging.router.js";
import ChatRouter from "./router/chat.router.js";
import NotificationRouter from "./router/notification.router.js";
import { MiddlewareCount } from "./services/logging and monitoring/Grafana/grafana.service.js";
import rateLimit from "express-rate-limit";
const app = express();
// allowing data from specifie site to this backend
app.use(cors({
    origin: process.env.CROS_ORGIN,
    credentials: true
}));
//limiting the rate of the user per node
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // limit each IP to 100 requests per windowMs
    message: 'Too many connections from this IP, please try again later',
});
//applying to whole server
app.use(limiter);
//config the app to use/send/recive json,url,cookie data 
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
//routes import
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", ChatRouter);
app.use("/api/v1/notification", NotificationRouter);
//confing the loging service
app.use("/api/v1/superuser", logingRouter);
app.use(MiddlewareCount);
//routes in
//exporting app
export default app;
