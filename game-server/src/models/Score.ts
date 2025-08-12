import mongoose, {Schema, InferSchemaType } from "mongoose";

const scoreSchema = new Schema({
        sessionId: {
                type: String,
                required: true,
                index : true
        },
        score: {
                type: Number,
                required: true,
                index: -1,
                default: 0,},
},{
        timestamps: { createdAt: true, updatedAt:false }
});

scoreSchema.index({ score: -1, createdAt: 1});

export type ScoreDoc = InferSchemaType<typeof scoreSchema>;

export default mongoose.model<ScoreDoc>('Score', scoreSchema);