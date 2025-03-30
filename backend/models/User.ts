import pool from '../config/database';
import { User } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';

export class UserModel {
  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, ?)',
      [user.username, user.password_hash, user.is_admin]
    );
    return result.insertId;
  }

  async findByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.execute<(User & RowDataPacket)[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<(User & RowDataPacket)[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  async updatePassword(id: number, passwordHash: string): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, id]
    );
    return result.affectedRows > 0;
  }
}

export default new UserModel();