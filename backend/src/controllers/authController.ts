import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, password, is_admin } = req.body;

      // ユーザー名の重複チェック
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'このユーザー名は既に使用されています。' });
      }

      // パスワードのハッシュ化
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // ユーザーの作成
      const userId = await UserModel.create({
        username,
        password_hash: passwordHash,
        is_admin: is_admin || false
      });

      res.status(201).json({
        message: 'ユーザーを作成しました。',
        userId
      });
    } catch (error) {
      res.status(500).json({ message: 'ユーザーの作成に失敗しました。' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // ユーザーの検索
      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'ユーザー名またはパスワードが間違っています。' });
      }

      // パスワードの検証
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'ユーザー名またはパスワードが間違っています。' });
      }

      // JWTトークンの生成
      const token = jwt.sign(
        { id: user.id, username: user.username, is_admin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'ログインに成功しました。',
        token,
        user: {
          id: user.id,
          username: user.username,
          is_admin: user.is_admin
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'ログインに失敗しました。' });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { currentPassword, newPassword } = req.body;

      // ユーザーの検索
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'ユーザーが見つかりません。' });
      }

      // 現在のパスワードの検証
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ message: '現在のパスワードが間違っています。' });
      }

      // 新しいパスワードのハッシュ化
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      // パスワードの更新
      await UserModel.updatePassword(userId, newPasswordHash);

      res.json({ message: 'パスワードを更新しました。' });
    } catch (error) {
      res.status(500).json({ message: 'パスワードの更新に失敗しました。' });
    }
  }
}

export default new AuthController();