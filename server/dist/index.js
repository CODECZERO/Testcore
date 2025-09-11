import { config } from "dotenv";
config();
import app from "./app.js";
import connectAll from "./util/appStarupt.util.js";
connectAll().then(() => {
    app.listen(process.env.PORTMAIN || 4008, () => { console.log(`App running on port:${process.env.PORTMAIN || 4008}`); });
}).catch((error) => {
    console.log(`Database connection fail ${error}`);
});
