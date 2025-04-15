import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// 環境変数の必須チェック
const requiredEnvVars = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET'
];

export function validateEnv() {
  let missingVars = false;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`ERROR: 環境変数 ${envVar} が設定されていません。`);
      missingVars = true;
    }
  }
  if (missingVars) {
    throw new Error('必須の環境変数が設定されていません。');
  }
  
  console.log('環境変数のバリデーションに成功しました。');
}

// ロギングのためにJWTシークレットが正しく取得できているか確認
const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret) {
  console.log(`JWT設定: シークレットキーが設定されています (長さ: ${jwtSecret.length}文字)`);
} else {
  console.error('JWT設定エラー: シークレットキーが見つかりません！');
}

interface Config {
  port: number;
  db: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
  jwt: {
    secret: string;
  };
  ssl: {
    enabled: boolean;
    sslkeypath: string;
    sslcertpath: string;
  }
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'calendar_app'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret'
  },
  ssl: {
    enabled: process.env.SSL_ENABLED === 'true',
    sslkeypath: process.env.SSL_KEY_PATH || './ssl/key.pem',
    sslcertpath: process.env.SSL_CERT_PATH || './ssl/cert.pem'
  }
};

export default config;