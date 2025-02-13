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

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const passport = require("passport");
const winston = require("winston");
const initWebRouter = require("./routes/web");


// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3001;
const PORT = process.env.PORT || 3002;

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: "https://17ed-2405-201-5802-909b-5512-fc3d-9b90-957b.ngrok-free.app", // Adjust as needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// Apply CORS middleware for Express
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*", credentials: true }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests from this IP' });
// app.use(limiter);
// Rate Limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: "Too many requests from this IP" });
app.use(limiter);

// Logger Configuration
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});

// Session Setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || "your-secret-key",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Initialize Web Routes
// routes.initWebRouter(app);

// Default Route

app.get("/", (req, res) => {
    res.send({ message: "Secure Node.js API with MySQL" });
});


// const initWebRouter = (app) => {
//     app.use('/', router);  // Apply the router to the app, starting from the root
// };
initWebRouter(app);


// Start Server
app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
});
module.exports = initWebRouter;