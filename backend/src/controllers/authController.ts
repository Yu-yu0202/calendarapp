import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;

      // ユーザー名の必須チェック
      if (!username) {
        return res.status(400).json({ message: 'ユーザー名は必須です。' });
      }

      // ユーザー名の重複チェック
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'このユーザー名は既に使用されています。' });
      }

      // メールアドレスの重複チェック（メールアドレスがある場合のみ）
      if (email) {
        const existingEmail = await UserModel.findByEmail(email);
        if (existingEmail) {
          return res.status(400).json({ message: 'このメールアドレスは既に使用されています。' });
        }
      }

      // パスワードのハッシュ化
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // ユーザーの作成
      const userId = await UserModel.create({
        username,
        email, // emailはnullでも可
        password_hash: passwordHash,
        role: role || 'user'
      });

      res.status(201).json({
        message: 'ユーザーを作成しました。',
        userId
      });
    } catch (error) {
      console.error('ユーザー作成エラー:', error);
      res.status(500).json({ message: 'ユーザーの作成に失敗しました。' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // ユーザーの検索（ユーザー名かメールアドレスで検索）
      let user;
      if (username) {
        user = await UserModel.findByUsername(username);
      } else if (email) {
        user = await UserModel.findByEmail(email);
      } else {
        return res.status(400).json({ message: 'ユーザー名またはメールアドレスが必要です。' });
      }

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
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'ログインに成功しました。',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('ログインエラー:', error);
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
      console.error('パスワード更新エラー:', error);
      res.status(500).json({ message: 'パスワードの更新に失敗しました。' });
    }
  }
}

export default new AuthController();