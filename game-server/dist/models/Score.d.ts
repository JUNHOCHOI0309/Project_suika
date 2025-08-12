import mongoose from 'mongoose';
import type { InferSchemaType } from 'mongoose';
declare const scoreSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: {
        createdAt: true;
        updatedAt: false;
    };
}, {
    createdAt: NativeDate;
} & {
    sessionId: string;
    score: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
} & {
    sessionId: string;
    score: number;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
} & {
    sessionId: string;
    score: number;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export type ScoreDoc = InferSchemaType<typeof scoreSchema>;
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
} & {
    sessionId: string;
    score: number;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
} & {
    sessionId: string;
    score: number;
}, {}> & {
    createdAt: NativeDate;
} & {
    sessionId: string;
    score: number;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
