import express from 'express';
import authController from '../controllers/authController';
import { authMiddleware, adminAuthMiddleware } from '../middlewares/auth';

const router = express.Router();

router.post('/register', adminAuthMiddleware, authController.register);
router.post('/login', authController.login);
router.post('/change-password', authMiddleware, authController.changePassword);

export default router;