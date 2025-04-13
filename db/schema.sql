-- カレンダーアプリデータベーススキーマ
-- 実行方法: mysql -u username -p calendar_app < schema.sql

-- データベースを作成
CREATE DATABASE IF NOT EXISTS calendar_app;
USE calendar_app;

-- 既存のテーブルを削除（開発時のみ使用、本番では注意）
DROP TABLE IF EXISTS event_access_settings;
DROP TABLE IF EXISTS access_settings;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS pdf_settings;
DROP TABLE IF EXISTS users;

-- ユーザーテーブル
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'user' または 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- イベントテーブル
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_all_day BOOLEAN DEFAULT false,
    is_holiday BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSON,  -- 繰り返しパターンをJSON形式で保存
    color VARCHAR(50),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- アクセス設定テーブル
CREATE TABLE access_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    require_auth BOOLEAN DEFAULT false,
    access_password_hash VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- イベントアクセス設定テーブル
CREATE TABLE event_access_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT,
    access_level VARCHAR(50) NOT NULL DEFAULT 'viewer', -- 'viewer', 'editor', 'owner'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, event_id)
);

-- PDF設定テーブル
CREATE TABLE pdf_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    layout_settings JSON,  -- フォーマット、向き、マージンなどのレイアウト設定
    header_settings JSON,  -- ヘッダーの設定
    footer_settings JSON,  -- フッターの設定
    font_settings JSON,    -- フォント設定
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- インデックスの追加
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_event_access_user ON event_access_settings(user_id);
CREATE INDEX idx_event_access_event ON event_access_settings(event_id); 