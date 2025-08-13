"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import express,{Express} from 'express';
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const scoreRoutes_js_1 = __importDefault(require("./routes/scoreRoutes.js"));
//import express, { Express, Request, Response } from "express";
const express_1 = __importDefault(require("express"));
console.log("abcde");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const origin = process.env.FRONTEND_ORIGIN || '*';
app.use((0, cors_1.default)({ origin }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`, req.headers['content-type'], req.body);
    next();
});
app.use('/api/scores', scoreRoutes_js_1.default);
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.path });
});
app.use((err, _req, res, _next) => {
    console.log('[error]', err);
    res.status(500).json({ error: String(err?.message ?? err) });
});
exports.default = app;
