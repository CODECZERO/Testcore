import { config } from "dotenv";
config();
import app from "./app.js";
import connectAll from "./util/appStarupt.util.js";
connectAll().then(() => {
    app.listen(4008, () => { console.log(`App running on port:${4008}`); });
}).catch((error) => {
    console.log(`Database connection fail ${error}`);
});
