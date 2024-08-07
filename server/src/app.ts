import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.router.js"

const app=express();

//allowing data from specifie site to this backend
// app.use(cors({
//     origin:process.env.CROS_ORGIN,
//     credentials: true
// }))


//config the app to use/send/recive json,url,cookie data 
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
app.use("/api/v1/user", userRouter);

//routes in
//exporting app
export {app};