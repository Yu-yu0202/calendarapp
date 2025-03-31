import pool from '../config/database';
import { AccessSetting } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class AccessSettingModel {
  async get(): Promise<AccessSetting | null> {
    const [rows] = await pool.execute<(AccessSetting & RowDataPacket)[]>(
      'SELECT * FROM access_settings ORDER BY id DESC LIMIT 1'
    );
    return rows[0] || null;
  }

  async update(settings: Partial<AccessSetting>): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO access_settings (require_auth, access_password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE require_auth = VALUES(require_auth), access_password_hash = VALUES(access_password_hash)',
      [settings.require_auth, settings.access_password_hash]
    );
    return result.affectedRows > 0;
  }
}

export default new AccessSettingModel();