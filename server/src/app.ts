import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.router.js";
import logingRouter from "./router/loging.router.js"
import { MiddlewareCount } from "./services/logging and monitoring/Grafana/grafana.service.js";
import runWebSocket from "./services/chat/chat.service.js";

const app=express();

//allowing data from specifie site to this backend
// app.use(cors({
//     origin:process.env.CROS_ORGIN,
//     credentials: true
// }))

//confing the loging service
app.use("/api/v1/superuser",logingRouter);
app.use(MiddlewareCount);


//config the app to use/send/recive json,url,cookie data 
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
app.use("/api/v1/user", userRouter);

//routes in
//exporting app
export default app;