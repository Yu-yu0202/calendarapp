import axios from 'axios';

// 直接localhostを使用して接続を確保
const API_URL = 'http://localhost:3000/api';

console.log('API URL設定:', API_URL);

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // CORS問題を回避するためfalseに設定
});

// リクエストインターセプター
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // リクエストログ
    console.log(`[${new Date().toISOString()}] ${config.method?.toUpperCase()} ${config.url} - リクエスト送信`);
    console.log('リクエストヘッダー:', config.headers);
    console.log('リクエストURL:', `${config.baseURL}${config.url}`);
    if (config.data) {
      console.log('リクエストデータ:', config.data);
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
    // 成功レスポンスのログ
    console.log(`[${new Date().toISOString()}] ${response.config.method?.toUpperCase()} ${response.config.url} - レスポンス受信: ${response.status}`);
    console.log('レスポンスヘッダー:', response.headers);
    console.log('レスポンスデータ:', response.data);
    
    return response;
  },
  (error) => {
    if (error.response) {
      // サーバーからのレスポンスがある場合
      console.error(`[${new Date().toISOString()}] API エラー: ${error.response.status} - ${error.response.config.method?.toUpperCase()} ${error.response.config.url}`);
      console.error('エラーレスポンス:', error.response.data);
      console.error('エラーヘッダー:', error.response.headers);
      
      if (error.response.status === 401) {
        // 認証エラー時の処理
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new Error('認証情報が無効です。再ログインしてください。'));
      }
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない場合
      console.error(`[${new Date().toISOString()}] サーバーからの応答がありません。ネットワーク接続を確認してください。`);
      console.error('リクエスト詳細:', error.request);
      console.error('リクエストURL:', error.config?.url);
      console.error('ベースURL:', error.config?.baseURL);
      return Promise.reject(new Error('サーバーからの応答がありません。ネットワーク接続を確認してください。'));
    } else {
      // リクエスト設定中にエラーが発生した場合
      console.error(`[${new Date().toISOString()}] リクエスト設定エラー:`, error.message);
    }
    return Promise.reject(error);
  }
);

export default client; 