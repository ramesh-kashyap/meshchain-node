import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; // ✅ Correct Import Path
import AuthController from '../controllers/AuthController.js'; // ✅ Ensure .js extension

const router = express.Router();

const initWebRouter = (app) => {
    // Account Routes
    router.post("/register", AuthController.register);
    router.post("/login", AuthController.login);
    router.post("/logout", AuthController.logout);

    return app.use('/', router);
};

export { initWebRouter }; // ✅ Correct Export
