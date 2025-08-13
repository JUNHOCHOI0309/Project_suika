"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_js_1 = __importDefault(require("./app.js"));
dotenv_1.default.config();
const PORT = Number(process.env.PORT || 3001);
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.log('Missing MONGODBURI in .env');
    process.exit(1);
}
(async () => {
    try {
        await mongoose_1.default.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        app_js_1.default.listen(PORT, () => {
            console.log(`[server] Listening on http://127.0.0.1:${PORT}`);
        });
    }
    catch (err) {
        console.error('[server] Startup error:', err);
        process.exit(1);
    }
})();
