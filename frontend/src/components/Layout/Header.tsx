import { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { AccountCircle, CalendarMonth, AdminPanelSettings, PictureAsPdf } from '@mui/icons-material'
import { useAuth } from '@/contexts/AuthContext'

const Header = () => {
  const navigate = useNavigate()
  const { user, logout, isAuth } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
    navigate('/login')
  }

  const handleProfile = () => {
    handleClose()
    // プロフィールページへの遷移（未実装）
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          カレンダーアプリ
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<CalendarMonth />}
          >
            カレンダー
          </Button>

          {isAuth && (
            <Button
              color="inherit"
              component={RouterLink}
              to="/pdf"
              startIcon={<PictureAsPdf />}
            >
              PDF出力
            </Button>
          )}

          {isAuth && user?.role === 'admin' && (
            <Button
              color="inherit"
              component={RouterLink}
              to="/admin"
              startIcon={<AdminPanelSettings />}
            >
              管理
            </Button>
          )}

          {isAuth ? (
            <>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleMenu}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  {user?.username}
                </MenuItem>
                <MenuItem onClick={handleProfile}>プロフィール</MenuItem>
                <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/login"
            >
              ログイン
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header 