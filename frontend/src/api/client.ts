import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // クッキーを含める
});

// リクエストインターセプター
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('APIリクエストエラー:', error);
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // サーバーからのレスポンスがある場合
      console.error(`API エラー: ${error.response.status} - ${error.response.data?.message || '不明なエラー'}`);
      
      if (error.response.status === 401) {
        // 認証エラー時の処理
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new Error('認証情報が無効です。再ログインしてください。'));
      }
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない場合
      console.error('サーバーからの応答がありません。ネットワーク接続を確認してください。');
      return Promise.reject(new Error('サーバーからの応答がありません。ネットワーク接続を確認してください。'));
    } else {
      // リクエスト設定中にエラーが発生した場合
      console.error('リクエスト設定エラー:', error.message);
    }
    return Promise.reject(error);
  }
);

export default client; 