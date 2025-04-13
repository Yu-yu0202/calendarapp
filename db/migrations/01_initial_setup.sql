-- 01_initial_setup.sql
-- 初期データベース構造のセットアップ

-- データベースを選択
USE calendar_app;

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- イベントテーブル
CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_all_day BOOLEAN DEFAULT false,
    is_holiday BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSON,
    color VARCHAR(50),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- アクセス設定テーブル
CREATE TABLE IF NOT EXISTS access_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    require_auth BOOLEAN DEFAULT false,
    access_password_hash VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- イベントアクセス設定テーブル
CREATE TABLE IF NOT EXISTS event_access_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT DEFAULT NULL,
    access_level VARCHAR(50) NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- event_access_settingsテーブルにインデックスを追加
ALTER TABLE event_access_settings ADD UNIQUE INDEX (user_id, event_id);

-- PDF設定テーブル
CREATE TABLE IF NOT EXISTS pdf_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    layout_settings JSON,
    header_settings JSON,
    footer_settings JSON,
    font_settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- インデックスの追加
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_event_access_user ON event_access_settings(user_id);
CREATE INDEX idx_event_access_event ON event_access_settings(event_id); 