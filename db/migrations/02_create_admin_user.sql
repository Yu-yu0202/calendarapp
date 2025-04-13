-- 02_create_admin_user.sql
-- 初期管理者ユーザーの作成

-- データベースを選択
USE calendar_app;

-- 初期管理者ユーザーの作成
INSERT INTO users (
    username,
    email,
    password_hash,
    role,
    created_at,
    updated_at
) VALUES (
    'admin',
    NULL, -- emailを省略
    -- パスワード: 'admin123' のハッシュ値
    -- 実際の運用時は generateHash.ts で生成したハッシュ値に置き換えてください
    '$2a$10$XrVIlm83WrbdgNfFXmCQderyLVXX8LW/49LoA9Nq0d3K7SeZa40/G',
    'admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 管理者の全イベントアクセス権限の設定
INSERT INTO event_access_settings (
    user_id,
    event_id,
    access_level,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM users WHERE username = 'admin'),
    NULL, -- NULL は全イベントへのアクセス権限を意味する
    'owner',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
); 