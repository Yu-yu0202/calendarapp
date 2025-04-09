import { Request, Response } from 'express';
import { catchAsync } from '../middlewares/errorHandler';
import UserModel from '../models/User';
import { AppError } from '../middlewares/errorHandler';

export class UserController {
  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await UserModel.findAll();
    res.json(users);
  });

  getUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserModel.findById(parseInt(req.params.id));
    if (!user) {
      throw new AppError('ユーザーが見つかりません。', 404);
    }
    res.json(user);
  });

  updateUser = catchAsync(async (req: Request, res: Response) => {
    const { username } = req.body;
    const userId = parseInt(req.params.id);

    const success = await UserModel.update(userId, { username });
    if (!success) {
      throw new AppError('ユーザーの更新に失敗しました。', 400);
    }

    res.json({ message: 'ユーザー情報を更新しました。' });
  });

  deleteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const success = await UserModel.delete(userId);

    if (!success) {
      throw new AppError('ユーザーの削除に失敗しました。', 400);
    }

    res.json({ message: 'ユーザーを削除しました。' });
  });

  toggleAdminStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const { is_admin } = req.body;

    const success = await UserModel.update(userId, { role: is_admin ? 'admin' : 'user' });
    if (!success) {
      throw new AppError('管理者権限の更新に失敗しました。', 400);
    }

    res.json({
      message: `ユーザーの管理者権限を${is_admin ? '付与' : '解除'}しました。`
    });
  });
}

export default new UserController();