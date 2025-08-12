//import express,{Express} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import scoreRoutes from './routes/scoreRoutes.js';

//import express, { Express, Request, Response } from "express";
import express from 'express';
import type {Express, Request, Response} from 'express';


const app:Express = express();

app.use(helmet());

const origin = process.env.FRONTEND_ORIGIN || '*';
app.use(cors({ origin }));


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/scores', scoreRoutes);

app.get('/health', (_req: Request, res: Response) => res.json({ok : true}));

app.use((req: Request, res:Response) => {
        res.status(404).json({ error: 'Not Found', path: req.path});
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
