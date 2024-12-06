import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.router.js";
import logingRouter from "./router/loging.router.js";
import ChatRouter from "./router/chat.router.js"
import NotificationRouter from "./router/notification.router.js"
import { MiddlewareCount } from "./services/logging and monitoring/Grafana/grafana.service.js";
import rateLimit from "express-rate-limit";
import collegeRouter from "./router/college.router.js";
import studnetRouter from "./router/student.router.js";
import { Request } from "express";
const app = express();

// allowing data from specifie site to this backend
app.use(cors({
    origin: true,  // This allows all origins
    credentials: true
}));


//limiting the rate of the user per node
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
    keyGenerator: (req: Request): string => req.ip as string // Use the IP address as the key
});

//applying to whole server
app.use(limiter);
app.set('trust proxy', 1);
//config the app to use/send/recive json,url,cookie data 
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat",ChatRouter);
app.use("/api/v1/notification",NotificationRouter);
app.use("/api/v1/college",collegeRouter);
app.use("/api/v1/student",studnetRouter);

//confing the loging service
app.use("/api/v1/superuser", logingRouter);
app.use(MiddlewareCount);

//exporting app
export default app;
