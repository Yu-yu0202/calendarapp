import { Event } from '../types';
import EventModel from '../models/Event';
import { AppError } from '../middlewares/errorHandler';

export class EventService {
  async validateEvent(event: Partial<Event>): Promise<void> {
    if (!event.title) {
      throw new AppError('タイトルは必須です。', 400);
    }

    if (!event.start_date || !event.end_date) {
      throw new AppError('開始日と終了日は必須です。', 400);
    }

    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (startDate > endDate) {
      throw new AppError('開始日は終了日より前である必要があります。', 400);
    }
  }

  async createEvent(event: Event): Promise<number> {
    await this.validateEvent(event);
    return await EventModel.create(event);
  }

  async updateEvent(id: number, event: Partial<Event>): Promise<void> {
    await this.validateEvent(event);
    const success = await EventModel.update(id, event);
    if (!success) {
      throw new AppError('予定の更新に失敗しました。', 400);
    }
  }

  async deleteEvent(id: number): Promise<void> {
    const success = await EventModel.delete(id);
    if (!success) {
      throw new AppError('予定の削除に失敗しました。', 400);
    }
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    if (startDate > endDate) {
      throw new AppError('開始日は終了日より前である必要があります。', 400);
    }
    return await EventModel.findByDateRange(startDate, endDate);
  }
}

export default new EventService();