import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mysql from 'mysql2/promise';
import winston from 'winston';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', credentials: true }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests from this IP' });
app.use(limiter);

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