-- 初期管理者ユーザーの作成
-- 使用方法:
-- 1. src/scripts/generateHash.ts を実行して管理者パスワードのハッシュを生成: 
--    npx ts-node src/scripts/generateHash.ts <password>
-- 2. 生成されたハッシュを以下の$2b$10$YourHashedPasswordHere部分に置き換え
-- 3. データベースに接続してこのSQLを実行

INSERT INTO users (
    username,
    email,
    password_hash,
    role,
    created_at,
    updated_at
) VALUES (
    'admin',
    'admin@example.com',
    -- パスワード: 'admin123' のハッシュ値（実際の運用時は適切なハッシュ値に置き換えてください）
    -- 'HashedPasswordHere and un-comment this line',
    'admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 初期管理者ユーザーのアクセス設定の作成
INSERT INTO event_access_settings (
    user_id,
    event_id,
    access_level,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM users WHERE username = 'admin'),
    NULL, -- 全イベントへのアクセス権限
    'owner',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
); 