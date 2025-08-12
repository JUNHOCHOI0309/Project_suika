import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = Number(process.env.PORT || 3001);
const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI){
        console.log('Missing MONGODB_URI in .env');
        process.exit(1);
}

(async () => {
        try {
                app.listen(PORT, () => {
                        console.log(`[server] Listening on http://127.0.0.1:${PORT}`);
                });
        } catch( err ){
                console.error('[server] Startup error:', err);
                process.exit(1);
        }
})();
