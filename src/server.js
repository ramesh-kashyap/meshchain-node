require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2/promise');
const winston = require('winston');
const routes = require('./routes/web');
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mysql from 'mysql2/promise';
import winston from 'winston';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
// ✅ Fix CORS issue

// ✅ Fix CORS issue
app.use(cors({ origin: "*" })); // Allow all origins
// Apply CORS middleware for Express
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests from this IP' });
// app.use(limiter);

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});

// Initialize Web Routes
const initWebRouter = (app) => {
    // Define your routes here
    app.get('/api/example', (req, res) => {
        res.send({ message: 'This is an example route' });
    });

    // You can add more routes as needed
};

// Export the function as the default export
export default initWebRouter;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});