import { config } from "dotenv";
config();

import app from "./app.js";
import connectAll from "./util/appStarupt.util.js";

connectAll().then(() => {
    app.listen(process.env.PORT || 8080, () => { console.log(`App running on port:${process.env.PORT}`) });
}).catch((error) => {
    console.log(`Database connection fail ${error}`);
})





