-- ユーザーテーブルにemailとroleカラムを追加
ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';

-- 既存のデータを移行: is_admin=1のユーザーをrole='admin'に設定
UPDATE users SET role = 'admin' WHERE is_admin = 1;

-- is_adminカラムを削除（オプション）
-- ALTER TABLE users DROP COLUMN is_admin;

-- 変更を確認
SELECT id, username, email, role FROM users; 