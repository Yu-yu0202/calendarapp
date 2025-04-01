import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// データベース接続設定
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'calendar_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;