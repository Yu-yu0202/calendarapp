import bcrypt from 'bcryptjs';
import config from '../config/config';

export class PasswordUtil {
  /**
   * パスワードをハッシュ化します
   * @param password ハッシュ化する平文のパスワード
   * @returns ハッシュ化されたパスワード
   */
  static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(config.password.saltRounds);
    return bcrypt.hash(password, salt);
  }

  /**
   * パスワードを検証します
   * @param password 検証する平文のパスワード
   * @param hash 比較対象のハッシュ化されたパスワード
   * @returns パスワードが一致する場合はtrue
   */
  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * パスワードの強度を検証します
   * @param password 検証するパスワード
   * @returns 検証結果のオブジェクト
   */
  static validateStrength(password: string): {
    isValid: boolean;
    message: string;
  } {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return {
        isValid: false,
        message: `パスワードは${minLength}文字以上である必要があります。`,
      };
    }

    if (!hasUpperCase || !hasLowerCase) {
      return {
        isValid: false,
        message: 'パスワードは大文字と小文字を含む必要があります。',
      };
    }

    if (!hasNumbers) {
      return {
        isValid: false,
        message: 'パスワードは数字を含む必要があります。',
      };
    }

    if (!hasSpecialChar) {
      return {
        isValid: false,
        message: 'パスワードは特殊文字を含む必要があります。',
      };
    }

    return {
      isValid: true,
      message: 'パスワードは要件を満たしています。',
    };
  }
}

export default PasswordUtil;