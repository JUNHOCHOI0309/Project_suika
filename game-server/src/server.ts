import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI! || "mongodb://localhost:27017/suika-game";

mongoose.connect(MONGO_URI).then(() => {
        app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
                });
        }).catch((error) => {
                console.error("MongoDB connection error:", error);
                process.exit(1);
        });