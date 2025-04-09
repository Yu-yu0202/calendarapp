import bcrypt from 'bcryptjs';
import UserModel from '../models/User';
import dotenv from 'dotenv';
import pool from '../config/database';

// 環境変数のロード
dotenv.config();

async function createAdminUser() {
  try {
    console.log('管理者アカウントを作成しています...');

    // デフォルト値を設定
    const defaultUsername = 'admin';
    const defaultEmail = 'admin@example.com';
    const defaultPassword = 'admin123';
    
    // 環境変数から値を取得（存在する場合）
    const username = process.env.ADMIN_USERNAME || defaultUsername;
    const email = process.env.ADMIN_EMAIL || defaultEmail;
    const password = process.env.ADMIN_PASSWORD || defaultPassword;

    // ユーザー名が存在するか確認
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      console.log(`ユーザー名 '${username}' は既に使用されています。`);
      await pool.end();
      return;
    }

    // メールアドレスが存在するか確認
    const existingEmail = await UserModel.findByEmail(email);
    if (existingEmail) {
      console.log(`メールアドレス '${email}' は既に使用されています。`);
      await pool.end();
      return;
    }

    // パスワードのハッシュ化
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // ユーザーの作成
    const userId = await UserModel.create({
      username,
      email,
      password_hash: passwordHash,
      role: 'admin'
    });

    console.log(`管理者アカウントを作成しました。ID: ${userId}`);
    console.log(`ユーザー名: ${username}`);
    console.log(`メールアドレス: ${email}`);
    console.log(`パスワード: ${password}（このパスワードは安全な場所に保管してください）`);
    
    // 接続終了
    await pool.end();
  } catch (error) {
    console.error('管理者アカウントの作成に失敗しました:', error);
    await pool.end();
    process.exit(1);
  }
}

// スクリプトを実行
createAdminUser(); 