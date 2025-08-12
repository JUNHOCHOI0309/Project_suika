import express from 'express';
import Score from '../models/Score';
import { v4 as uuidv4 } from 'uuid';

console.log('scoreRoutes loaded');
const router = express.Router();

router.get('/session', (req, res) => {
        const sessionId = uuidv4();
        res.json({ sessionId });
});

router.post('/', async (req, res) => {
        console.log('📥 /api payload:', req.body);
        const { sessionId, score } = req.body;

        if (!sessionId || typeof score !== 'number') {
                return res.status(400).json({ error: 'Invalid session ID or score' });
        }

        try {
                const newScore = new Score({ sessionId, score });
                await newScore.save();
                res.status(201).json(newScore);
        } catch (error) {
                console.error('Error saving score:', error);
                res.status(500).json({ error: 'Internal server error' });
        }
});

router.get('/leaderboard', async (_req, res) => {
        const topScores = await Score.find().sort({ score: -1 }).limit(10);
        res.json(topScores);
});


export default router;