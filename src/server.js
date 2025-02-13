require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2/promise');
const winston = require('winston');
const routes = require('./routes/web');
const app = express();
const PORT = process.env.PORT || 3000;

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


// Init Web Routes
routes.initWebRouter(app);



app.get('/', (req, res) => {
    res.send({ message: 'Secure Node.js API with MySQL' });
});

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});