import express from 'express';
import userController from '../controllers/userController';
import { authMiddleware, adminAuthMiddleware } from '../middlewares/auth';

const router = express.Router();

// 管理者権限が必要なルート
router.use(authMiddleware, adminAuthMiddleware);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/admin', userController.toggleAdminStatus);

export default router;