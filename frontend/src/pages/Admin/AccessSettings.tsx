import { useState } from 'react'
import {
  Box,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material'

const AccessSettings = () => {
  const [requireAuth, setRequireAuth] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = () => {
    // TODO: API呼び出しを実装
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <Box>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={requireAuth}
              onChange={(e) => setRequireAuth(e.target.checked)}
            />
          }
          label="カレンダー画面へのアクセスに認証を要求する"
        />
      </FormControl>

      <Typography variant="h6" sx={{ mb: 2 }}>
        管理者パスワードの変更
      </Typography>
      <Box component="form" onSubmit={(e) => e.preventDefault()}>
        <TextField
          type="password"
          label="新しいパスワード"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!adminPassword}
        >
          設定を保存
        </Button>
      </Box>

      {showSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          設定を保存しました
        </Alert>
      )}
    </Box>
  )
}

export default AccessSettings 