const express = require('express');
let router = express.Router();
const AuthController = require("../controllers/AuthController");

const initWebRouter = (app) => {
    // page account
    router.post("/register", AuthController.register);
    router.post("/login", AuthController.login);
    router.post("/logout", AuthController.logout);
    router.post('/telegram-login', AuthController.loginWithTelegram);

    return app.use('/', router); 
}
module.exports = {
    initWebRouter,
};