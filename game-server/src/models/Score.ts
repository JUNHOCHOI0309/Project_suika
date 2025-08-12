import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
        sessionId: {
                type: String,
                required: true,},
        score: {
                type: Number,
                required: true,
                default: 0,},
        createdAt: {
                type: Date,
                default: Date.now,},
});

export default mongoose.model("Score", scoreSchema);