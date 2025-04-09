import client from './client';
import { LoginPayload, RegisterPayload, AuthResponse, User } from '../types/user';

const AUTH_URL = '/auth';

export const login = async (credentials: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await client.post(`${AUTH_URL}/login`, credentials);
    
    // トークンとユーザー情報をローカルストレージに保存
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    console.error('ログインに失敗しました:', error);
    throw error;
  }
};

export const register = async (userData: RegisterPayload): Promise<AuthResponse> => {
  try {
    const response = await client.post(`${AUTH_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('ユーザー登録に失敗しました:', error);
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
}; 