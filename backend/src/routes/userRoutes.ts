import express from 'express';
import userController from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middlewares/auth';

const router = express.Router();

// 基本認証が必要なエンドポイント（認証のみ）
router.use(authenticateToken);

// 現在のユーザー情報を取得（認証があれば誰でも可能）
router.get('/me', (req, res) => {
  try {
    // req.userは認証ミドルウェアで設定されています
    const user = req.user;
    res.json(user);
  } catch (error) {
    console.error('ユーザー情報取得エラー:', error);
    res.status(500).json({ message: 'ユーザー情報の取得に失敗しました。' });
  }
});

// ここから先は管理者権限が必要
router.use(requireAdmin);

// 全ユーザーを取得（管理者のみ）
router.get('/', userController.getAllUsers);

// 特定のユーザーを取得（管理者のみ）
router.get('/:id', userController.getUser);

// ユーザーを更新（管理者のみ）
router.put('/:id', userController.updateUser);

// ユーザーを削除（管理者のみ）
router.delete('/:id', userController.deleteUser);

// 管理者権限の切り替え（管理者のみ）
router.post('/:id/toggle-admin', userController.toggleAdminStatus);

export default router;