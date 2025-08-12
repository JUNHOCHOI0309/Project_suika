import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import Score from '../models/Score.js';

const router : Router = Router();

const postLimiter = RateLimit({
        windowMs: 10 * 1000,
        max : 5,
});

router.get('/health',(_req, res) => {
        res.json({ ok:true, now: new Date().toISOString});
});

//POST /api/socres
router.post('/', postLimiter, async (req, res, next) => {
        try {

                const { sessionId, score } = req.body ?? {};

                if (typeof sessionId !== 'string' || !sessionId.trim() || typeof score !== 'number' || !Number.isFinite(score)) {
                        return res.status(400).json({ error: 'Invalid session ID or score' });
                }

                const doc = await Score.create({ sessionId, score});
                
                return res.status(201).json(doc);
        } catch (error) {
                next(error);
        }
});

//POST /api/scores/leaderboard
router.get('/leaderboard', async (_req, res, next) => {
        try {
                const topScores = await Score.find().sort({ score: -1, createdAt: 1 }).limit(10).lean();
                res.json(topScores);
        } catch (err){
                next(err);
        }
});


export default router;
