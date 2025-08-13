//import { Router, type Request, type Response, type NextFunction  } from 'express';
import { Router, type Request, type Response, type NextFunction } from 'express';
import RateLimit from 'express-rate-limit';
import Score from '../models/Score.js';

const router : Router = Router();

const postLimiter = RateLimit({
        windowMs: 10 * 1000,
        max : 5,
});

router.get('/health',(_req: Request, res : Response ) => {
        res.json({ ok:true, now: new Date().toISOString()});
});

//POST /api/socres
router.post('/', postLimiter, async (req :Request , res: Response , next: NextFunction) => {
        try {

                const { sessionId, score } = req.body ?? {};
		console.log('[DEBUG] req.headers:', req.headers);
		console.log('[DEBUG] req.body:', req.body);
                if (typeof sessionId !== 'string' || !sessionId.trim() || typeof score !== 'number' || !Number.isFinite(score)) {
                        return res.status(400).json({ error: 'Invalid session ID or score' });
                }

                const doc = await Score.create({ sessionId, score});
                
                return res.status(201).json({
			_id: doc._id,
			sessionId:doc.sessionId,
			score: doc.score,
			createdAt: doc.createdAt,
		});
        } catch (error) {
                next(error);
        }
});

//POST /api/scores/leaderboard
router.get('/leaderboard', async (_req: Request, res: Response, next: NextFunction) => {
        try {
		if(mongoose.connection.readyState !== 1) {
			return res.status(503).json({ error: ' DB not connected' , state: mongoose.connection.readyState});
		}
		const topScores = await Score.find({}, {sessionId: 1, score: 1, createdAt: 1 }).sort({ score: -1, createdAt: 1 }).limit(10).lean().exec();
		const safe = topScores.map((r) => ({
			...r,
			createdAt: r.createdAt ?? new Date(0),
		}));
                res.json(safe);
        } catch (err){
                next(err);
        }
});


export default router;
