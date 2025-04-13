# PowerShell スクリプト for Windows

# データベース接続情報
param(
    [string]$DbUser = "root",
    [string]$DbPassword = ""
)

$DbName = "calendar_app"

# データベースが存在しない場合は作成
Write-Host "データベース作成..."
mysql -u $DbUser --password=$DbPassword -e "CREATE DATABASE IF NOT EXISTS $DbName;"

# マイグレーションディレクトリ内のSQLファイルを順番に実行
Write-Host "マイグレーション実行..."
$sqlFiles = Get-ChildItem -Path "migrations" -Filter "*.sql" | Sort-Object Name

foreach ($file in $sqlFiles) {
    Write-Host "実行中: $($file.FullName)"
    mysql -u $DbUser --password=$DbPassword $DbName -e "source $($file.FullName)"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $($file.Name) 成功" -ForegroundColor Green
    } else {
        Write-Host "✗ $($file.Name) 失敗" -ForegroundColor Red
        exit 1
    }
}

Write-Host "マイグレーション完了" -ForegroundColor Green 