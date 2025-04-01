import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface PdfSetting {
  id?: number;
  userId: number;
  layoutSettings: {
    format: 'A4' | 'A3';
    orientation: 'portrait' | 'landscape';
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  };
  headerSettings: {
    enabled: boolean;
    height: number;
    content: string;
  };
  footerSettings: {
    enabled: boolean;
    height: number;
    content: string;
  };
  fontSettings: {
    family: string;
    size: number;
  };
  created_at?: Date;
  updated_at?: Date;
}

export class PdfSettingModel {
  async findByUserId(userId: number): Promise<PdfSetting | null> {
    const [rows] = await pool.execute<(PdfSetting & RowDataPacket)[]>(
      'SELECT * FROM pdf_settings WHERE userId = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (rows[0]) {
      rows[0].layoutSettings = JSON.parse(rows[0].layoutSettings as any);
      rows[0].headerSettings = JSON.parse(rows[0].headerSettings as any);
      rows[0].footerSettings = JSON.parse(rows[0].footerSettings as any);
      rows[0].fontSettings = JSON.parse(rows[0].fontSettings as any);
    }

    return rows[0] || null;
  }

  async create(setting: PdfSetting): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO pdf_settings (
        userId,
        layoutSettings,
        headerSettings,
        footerSettings,
        fontSettings
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        setting.userId,
        JSON.stringify(setting.layoutSettings),
        JSON.stringify(setting.headerSettings),
        JSON.stringify(setting.footerSettings),
        JSON.stringify(setting.fontSettings)
      ]
    );
    return result.insertId;
  }

  async update(userId: number, setting: Partial<PdfSetting>): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];

    if (setting.layoutSettings) {
      updates.push('layoutSettings = ?');
      values.push(JSON.stringify(setting.layoutSettings));
    }
    if (setting.headerSettings) {
      updates.push('headerSettings = ?');
      values.push(JSON.stringify(setting.headerSettings));
    }
    if (setting.footerSettings) {
      updates.push('footerSettings = ?');
      values.push(JSON.stringify(setting.footerSettings));
    }
    if (setting.fontSettings) {
      updates.push('fontSettings = ?');
      values.push(JSON.stringify(setting.fontSettings));
    }

    values.push(userId);

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE pdf_settings SET ${updates.join(', ')},
      updated_at = CURRENT_TIMESTAMP
      WHERE userId = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  async delete(userId: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM pdf_settings WHERE userId = ?',
      [userId]
    );
    return result.affectedRows > 0;
  }

  async getDefaultSettings(): Promise<PdfSetting> {
    return {
      userId: 0,
      layoutSettings: {
        format: 'A4',
        orientation: 'portrait',
        marginTop: 20,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 20
      },
      headerSettings: {
        enabled: true,
        height: 50,
        content: '#{title} - #{date}'
      },
      footerSettings: {
        enabled: true,
        height: 30,
        content: 'ページ #{pageNumber} / #{totalPages}'
      },
      fontSettings: {
        family: 'Noto Sans JP',
        size: 12
      }
    };
  }
}

export default new PdfSettingModel();