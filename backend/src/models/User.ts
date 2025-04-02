import pool from '../config/database';
import { User } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class UserModel {
  async findAll(): Promise<User[]> {
    const [rows] = await pool.execute<(User & RowDataPacket)[]>(
      'SELECT * FROM users'
    );
    return rows;
  }

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

  async update(id: number, user: Partial<User>): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET ? WHERE id = ?',
      [user, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async updatePassword(id: number, password_hash: string): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [password_hash, id]
    );
    return result.affectedRows > 0;
  }
}

export default new UserModel();