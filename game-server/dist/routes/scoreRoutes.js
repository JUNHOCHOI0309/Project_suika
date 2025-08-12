"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const Score_js_1 = __importDefault(require("../models/Score.js"));
const router = (0, express_1.Router)();
const postLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 1000,
    max: 5,
});
router.get('/health', (_req, res) => {
    res.json({ ok: true, now: new Date().toISOString });
});
//POST /api/socres
router.post('/', postLimiter, async (req, res, next) => {
    try {
        const { sessionId, score } = req.body ?? {};
        if (typeof sessionId !== 'string' || !sessionId.trim() || typeof score !== 'number' || !Number.isFinite(score)) {
            return res.status(400).json({ error: 'Invalid session ID or score' });
        }
        const doc = await Score_js_1.default.create({ sessionId, score });
        return res.status(201).json(doc);
    }
    catch (error) {
        next(error);
    }
});
//POST /api/scores/leaderboard
router.get('/leaderboard', async (_req, res, next) => {
    try {
        const topScores = await Score_js_1.default.find().sort({ score: -1, createdAt: 1 }).limit(10).lean();
        res.json(topScores);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
