"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import mongoose, {Schema, InferSchemaType } from "mongoose";
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const scoreSchema = new Schema({
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    score: {
        type: Number,
        required: true,
        index: -1,
        default: 0,
    },
    createdAt: { type: Date, default: Date.now, index: true },
}, { collection: 'scores', versionKey: false, });
scoreSchema.index({ score: -1, createdAt: 1 });
exports.default = mongoose_1.default.models.Score || mongoose_1.default.model('Score', scoreSchema, 'scores');
