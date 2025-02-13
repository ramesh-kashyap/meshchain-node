const express = require('express');
let router = express.Router();
const AuthController = require("../controllers/AuthController");
const TelegramController = require("../controllers/TelegramController");

const initWebRouter = (app) => {
    // page account
    router.post("/register", AuthController.register);
    router.post("/login", AuthController.login);
    router.post("/logout", AuthController.logout);

    // telegram api
    router.post('/telegram-login', AuthController.loginWithTelegram);
    router.post('/telegram-user-detail', TelegramController.getUserByTelegramId);


    return app.use('/', router); 
}
module.exports = {
    initWebRouter,
};