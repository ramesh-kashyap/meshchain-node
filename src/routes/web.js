const express = require('express');
let router = express.Router();
const passport = require('passport');


const googleController = require('../controllers/googleController');

const authController = require('../controllers/AuthController');

router.post('/google', googleController.verifyGoogleToken);
router.post('/register', authController.register);

// Mount the router on /api/auth so that /register becomes /api/auth/register
const initWebRouter = (app) => {
    app.use('/api/auth', router);
  };

  module.exports = initWebRouter;

