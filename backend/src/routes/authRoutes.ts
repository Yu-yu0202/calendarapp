import express from 'express';
import authController from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middlewares/auth';

const router = express.Router();

// 管理者によるユーザー登録（管理者権限必要）
router.post('/admin-register', requireAdmin, authController.register);
// 一般ユーザーの自己登録（誰でも登録可能）
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/change-password', authenticateToken, authController.changePassword);

export default router;