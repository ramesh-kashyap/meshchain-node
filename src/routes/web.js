const express = require('express');
let router = express.Router();
const AuthController = require("../controllers/AuthController");
const IncomeController = require("../controllers/incomeController");
const authMiddleware = require("../middleware/authMiddleware"); // JWT Auth Middleware

const initWebRouter = (app) => {
    // page account
    router.post("/register", AuthController.register);
    router.post("/login", AuthController.login);
    router.post("/logout", AuthController.logout);
    router.get("/income", IncomeController.income);
    router.get("/income", authMiddleware, IncomeController.getDirectIncome);


    
    return app.use('/', router); 
}


module.exports = {
    initWebRouter,
};

