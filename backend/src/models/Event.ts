import pool from '../config/database';
import { Event } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class EventModel {
  async create(event: Event): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO events (title, description, start_date, end_date, is_holiday, is_recurring, recurrence_pattern, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [event.title, event.description, event.start_date, event.end_date, event.is_holiday, event.is_recurring, event.recurrence_pattern, event.created_by]
    );
    return result.insertId;
  }

  async findById(id: number): Promise<Event | null> {
    const [rows] = await pool.execute<(Event & RowDataPacket)[]>(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  async findAll(): Promise<Event[]> {
    const [rows] = await pool.execute<(Event & RowDataPacket)[]>(
      'SELECT * FROM events ORDER BY start_date'
    );
    return rows;
  }

  async update(id: number, event: Partial<Event>): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE events SET title = ?, description = ?, start_date = ?, end_date = ?, is_holiday = ?, is_recurring = ?, recurrence_pattern = ? WHERE id = ?',
      [event.title, event.description, event.start_date, event.end_date, event.is_holiday, event.is_recurring, event.recurrence_pattern, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM events WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    const [rows] = await pool.execute<(Event & RowDataPacket)[]>(
      'SELECT * FROM events WHERE start_date BETWEEN ? AND ? ORDER BY start_date',
      [startDate, endDate]
    );
    return rows;
  }
}

export default new EventModel();