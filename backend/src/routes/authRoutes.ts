import express from 'express';
import authController from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middlewares/auth';

const router = express.Router();

router.post('/register', requireAdmin, authController.register);
router.post('/login', authController.login);
router.post('/change-password', authenticateToken, authController.changePassword);

export default router;