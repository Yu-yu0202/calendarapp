import client from './client';
import { Event, CreateEventPayload, UpdateEventPayload } from '../types/event';

const EVENTS_URL = '/events';

export const fetchEvents = async (startDate?: string, endDate?: string): Promise<Event[]> => {
  try {
    let url = EVENTS_URL;
    
    // デバッグログの追加
    console.log('イベント取得リクエスト開始', { startDate, endDate });
    
    // バックエンドのAPIのクエリパラメータ名を修正
    if (startDate && endDate) {
      url = `${url}/range?startDate=${startDate}&endDate=${endDate}`;
    }
    
    console.log('イベント取得URL:', url);
    
    const response = await client.get(url);
    
    // データ変換: バックエンドの日付フィールドをフロントエンドのフォーマットに合わせる
    const events = response.data.map((event: any) => ({
      ...event,
      start: event.start_date || event.start,
      end: event.end_date || event.end
    }));
    
    console.log('取得したイベント（変換後）:', events);
    
    return events;
  } catch (error) {
    console.error('イベントの取得に失敗しました:', error);
    // エラーの詳細情報を表示
    if ((error as any).response) {
      console.error('エラーレスポンス:', (error as any).response.data);
      console.error('ステータスコード:', (error as any).response.status);
    }
    throw error;
  }
};

export const fetchEventById = async (id: number): Promise<Event> => {
  try {
    const response = await client.get(`${EVENTS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`イベント(ID: ${id})の取得に失敗しました:`, error);
    throw error;
  }
};

export const createEvent = async (eventData: CreateEventPayload): Promise<Event> => {
  try {
    // バックエンドのフィールド名に合わせて変換
    const backendData = {
      title: eventData.title,
      description: eventData.description,
      start_date: eventData.start,
      end_date: eventData.end,
      color: eventData.color
    };
    
    console.log('送信するイベントデータ:', backendData);
    
    const response = await client.post(EVENTS_URL, backendData);
    return response.data;
  } catch (error) {
    console.error('イベントの作成に失敗しました:', error);
    throw error;
  }
};

export const updateEvent = async (eventData: UpdateEventPayload): Promise<Event> => {
  try {
    // バックエンドのフィールド名に合わせて変換
    const backendData = {
      title: eventData.title,
      description: eventData.description,
      start_date: eventData.start,
      end_date: eventData.end,
      color: eventData.color
    };
    
    console.log(`イベント更新データ (ID: ${eventData.id}):`, backendData);
    
    const response = await client.put(`${EVENTS_URL}/${eventData.id}`, backendData);
    return response.data;
  } catch (error) {
    console.error(`イベント(ID: ${eventData.id})の更新に失敗しました:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: number): Promise<void> => {
  try {
    await client.delete(`${EVENTS_URL}/${id}`);
  } catch (error) {
    console.error(`イベント(ID: ${id})の削除に失敗しました:`, error);
    throw error;
  }
}; 