//import mongoose, {Schema, InferSchemaType } from "mongoose";
import mongoose from 'mongoose';
import type {InferSchemaType} from 'mongoose';
const { Schema } = mongoose;

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
	createdAt: { type: Date, default: Date.now, index: true  },
},
{ collection: 'scores', versionKey: false,}
);

scoreSchema.index({ score: -1, createdAt: 1});

export type ScoreDoc = InferSchemaType<typeof scoreSchema>;

export default (mongoose.models.Score as mongoose.Model<ScoreDoc>) || mongoose.model<ScoreDoc>('Score', scoreSchema, 'scores');
