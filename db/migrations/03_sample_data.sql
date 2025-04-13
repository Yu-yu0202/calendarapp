-- 03_sample_data.sql
-- サンプルデータの登録

-- データベースを選択
USE calendar_app;

-- テストユーザーの作成
INSERT INTO users (
    username,
    email,
    password_hash,
    role,
    created_at,
    updated_at
) VALUES (
    'testuser',
    NULL, -- emailを省略
    -- パスワード: 'password' のハッシュ値
    '$2a$10$XrVIlm83WrbdgNfFXmCQderyLVXX8LW/49LoA9Nq0d3K7SeZa40/G',
    'user',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- サンプルイベントの作成
INSERT INTO events (
    title,
    description,
    start_date,
    end_date,
    is_all_day,
    is_holiday,
    is_recurring,
    color,
    created_by,
    created_at,
    updated_at
) VALUES (
    'プロジェクトミーティング',
    'プロジェクト進捗確認ミーティング',
    '2023-12-01 10:00:00',
    '2023-12-01 11:00:00',
    false,
    false,
    false,
    '#4285F4',
    (SELECT id FROM users WHERE username = 'admin'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '年末休暇',
    '年末年始休暇期間',
    '2023-12-29 00:00:00',
    '2024-01-03 23:59:59',
    true,
    true,
    false,
    '#0F9D58',
    (SELECT id FROM users WHERE username = 'admin'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '週次レポート提出',
    '週次業務レポートの提出期限',
    '2023-12-08 17:00:00',
    '2023-12-08 18:00:00',
    false,
    false,
    true,
    '#DB4437',
    (SELECT id FROM users WHERE username = 'testuser'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- アクセス設定
INSERT INTO access_settings (
    require_auth,
    access_password_hash,
    updated_at
) VALUES (
    false,
    NULL,
    CURRENT_TIMESTAMP
);

-- テストユーザーのイベントアクセス権限
INSERT INTO event_access_settings (
    user_id,
    event_id,
    access_level,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM users WHERE username = 'testuser'),
    (SELECT id FROM events WHERE title = '週次レポート提出'),
    'owner',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
); 