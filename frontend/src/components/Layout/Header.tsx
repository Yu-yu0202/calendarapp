import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          カレンダーアプリ
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          カレンダー
        </Button>
        <Button color="inherit" component={RouterLink} to="/admin">
          管理画面
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header 