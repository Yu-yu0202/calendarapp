export const config = {
  // サーバー設定
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  // データベース設定
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'calendar_app',
  },
  // JWT設定
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: '24h',
  },
  // CORS設定
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  // パスワードハッシュ設定
  password: {
    saltRounds: 10,
  }
};

export default config;