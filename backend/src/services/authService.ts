import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import config from '../config/config';
import { User } from '../types';
import PasswordUtil from '../utils/password';
import { AppError } from '../middlewares/errorHandler';

export class AuthService {
  generateToken(user: Partial<User>): string {
    const payload = {
      id: user.id,
      username: user.username,
      is_admin: user.is_admin
    };
    const secret: Secret = config.jwt.secret as string;
    const options: SignOptions = { expiresIn: config.jwt.expiresIn };

    return jwt.sign(payload, secret, options);
  }

  verifyToken(token: string): any {
    const secret: Secret = config.jwt.secret as string;
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw new AppError('無効なトークンです。', 401);
    }
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const isValid = await PasswordUtil.verify(plainPassword, hashedPassword);
    if (!isValid) {
      throw new AppError('パスワードが一致しません。', 401);
    }
    return true;
  }

  async hashPassword(password: string): Promise<string> {
    const validation = PasswordUtil.validateStrength(password);
    if (!validation.isValid) {
      throw new AppError(validation.message, 400);
    }
    return await PasswordUtil.hash(password);
  }
}

export default new AuthService();