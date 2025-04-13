import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import { login } from '@/api/authApi'
import { useAuth } from '@/contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // URLからリダイレクト情報を取得
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await login({ username, password })
      console.log('ログイン成功:', response)
      
      // ユーザー情報をコンテキストに設定
      if (response && response.user) {
        setUser(response.user)
      }
      
      // 成功メッセージをコンソールに表示
      console.log('ログインに成功しました。トップページにリダイレクトします。')
      
      // ホームページにリダイレクト
      navigate('/', { replace: true })
    } catch (err: any) {
      console.error('ログインエラー:', err)
      setError(
        err.response?.data?.message || 'ログインに失敗しました。ユーザー名とパスワードを確認してください。'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          カレンダーアプリ
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          ログイン
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="ユーザー名"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'ログイン'}
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            アカウント登録は管理者にお問い合わせください。
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Login 