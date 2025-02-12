const express = require('express');
let router = express.Router();
const AuthController = require("../controllers/AuthController");
const TelegramController = require("../controllers/TelegramController");

const passport = require('passport');


const googleController = require('../controllers/googleController');
const teamController = require('../controllers/teamController');



router.post('/google', googleController.verifyGoogleToken);
router.post('/register', AuthController.register);
router.get("/direct-income", authMiddleware, IncomeController.getDirectIncome);
router.get("/level-income", authMiddleware, IncomeController.getLevelIncome);
router.get("/Roi-income", authMiddleware, IncomeController.getRoiIncome);
router.post("/team",teamController.getTeam);
router.post('/list',  teamController.list);






// Mount the router on /api/auth so that /register becomes /api/auth/register
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
    app.use('/api/auth', router);
  };

  module.exports = initWebRouter;

