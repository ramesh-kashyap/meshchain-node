const express = require('express');
let router = express.Router();
<<<<<<< HEAD
const AuthController = require("../controllers/AuthController");
const IncomeController = require("../controllers/incomeController");
const authMiddleware = require("../middleware/authMiddleware"); // JWT Auth Middleware
=======
const passport = require('passport');
>>>>>>> 8074ed35cd4ffec8c890ce4ec9a8fb022e03bbe4


const googleController = require('../controllers/googleController');

const authController = require('../controllers/AuthController');

router.post('/google', googleController.verifyGoogleToken);
router.post('/register', authController.register);

// Mount the router on /api/auth so that /register becomes /api/auth/register
const initWebRouter = (app) => {
<<<<<<< HEAD
    // page account
    router.post("/register", AuthController.register);
    router.post("/login", AuthController.login);
    router.post("/logout", AuthController.logout);
    router.get("/income", IncomeController.income);
    router.get("/income", authMiddleware, IncomeController.getDirectIncome);

=======
    app.use('/api/auth', router);
  };
>>>>>>> 8074ed35cd4ffec8c890ce4ec9a8fb022e03bbe4

  module.exports = initWebRouter;

<<<<<<< HEAD

module.exports = {
    initWebRouter,
};

=======
>>>>>>> 8074ed35cd4ffec8c890ce4ec9a8fb022e03bbe4
