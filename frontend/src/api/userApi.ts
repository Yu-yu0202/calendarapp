import client from './client';
import { User } from '../types/user';

const USERS_URL = '/users';

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await client.get(USERS_URL);
    return response.data;
  } catch (error) {
    console.error('ユーザーの取得に失敗しました:', error);
    throw error;
  }
};

export const fetchUserById = async (id: number): Promise<User> => {
  try {
    const response = await client.get(`${USERS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ユーザー(ID: ${id})の取得に失敗しました:`, error);
    throw error;
  }
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await client.put(`${USERS_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`ユーザー(ID: ${id})の更新に失敗しました:`, error);
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await client.delete(`${USERS_URL}/${id}`);
  } catch (error) {
    console.error(`ユーザー(ID: ${id})の削除に失敗しました:`, error);
    throw error;
  }
}; 