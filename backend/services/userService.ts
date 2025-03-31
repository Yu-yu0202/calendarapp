import UserModel from '../models/User';
import { User } from '../types';
import { AppError } from '../middlewares/errorHandler';
import authService from './authService';

export class UserService {
  async validateUsername(username: string): Promise<void> {
    if (!username || username.length < 3) {
      throw new AppError('ユーザー名は3文字以上である必要があります。', 400);
    }

    if (username.length > 50) {
      throw new AppError('ユーザー名は50文字以下である必要があります。', 400);
    }

    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      throw new AppError('このユーザー名は既に使用されています。', 400);
    }
  }

  async createUser(userData: {
    username: string;
    password: string;
    is_admin?: boolean;
  }): Promise<number> {
    await this.validateUsername(userData.username);

    const password_hash = await authService.hashPassword(userData.password);

    const userId = await UserModel.create({
      username: userData.username,
      password_hash,
      is_admin: userData.is_admin || false
    });

    return userId;
  }

  async updateUser(
    userId: number,
    userData: Partial<Omit<User, 'id' | 'password_hash'>>
  ): Promise<void> {
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw new AppError('ユーザーが見つかりません。', 404);
    }

    if (userData.username && userData.username !== existingUser.username) {
      await this.validateUsername(userData.username);
    }

    const success = await UserModel.update(userId, userData);
    if (!success) {
      throw new AppError('ユーザーの更新に失敗しました。', 400);
    }
  }

  async deleteUser(userId: number): Promise<void> {
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw new AppError('ユーザーが見つかりません。', 404);
    }

    if (existingUser.is_admin) {
      // 最後の管理者ユーザーかどうかを確認
      const adminUsers = await this.getAdminUsers();
      if (adminUsers.length === 1) {
        throw new AppError('最後の管理者ユーザーは削除できません。', 400);
      }
    }

    const success = await UserModel.delete(userId);
    if (!success) {
      throw new AppError('ユーザーの削除に失敗しました。', 400);
    }
  }

  async getAdminUsers(): Promise<User[]> {
    const users = await UserModel.findAll();
    return users.filter(user => user.is_admin);
  }

  async validateUserAccess(userId: number, requestingUserId: number): Promise<void> {
    if (userId !== requestingUserId) {
      const requestingUser = await UserModel.findById(requestingUserId);
      if (!requestingUser?.is_admin) {
        throw new AppError('この操作を行う権限がありません。', 403);
      }
    }
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('ユーザーが見つかりません。', 404);
    }

    await authService.validatePassword(currentPassword, user.password_hash);
    const newPasswordHash = await authService.hashPassword(newPassword);

    const success = await UserModel.updatePassword(userId, newPasswordHash);
    if (!success) {
      throw new AppError('パスワードの更新に失敗しました。', 400);
    }
  }
}

export default new UserService();