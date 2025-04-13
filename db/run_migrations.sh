#!/bin/bash

# データベース接続情報
DB_USER=${1:-root}
DB_PASSWORD=${2:-""}
DB_NAME="calendar_app"

# データベースが存在しない場合は作成
echo "データベース作成..."
mysql -u "$DB_USER" --password="$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

# マイグレーションディレクトリ内のSQLファイルを順番に実行
echo "マイグレーション実行..."
for sql_file in migrations/*.sql; do
  echo "実行中: $sql_file"
  mysql -u "$DB_USER" --password="$DB_PASSWORD" "$DB_NAME" < "$sql_file"
  if [ $? -eq 0 ]; then
    echo "✓ $sql_file 成功"
  else
    echo "✗ $sql_file 失敗"
    exit 1
  fi
done

echo "マイグレーション完了" 