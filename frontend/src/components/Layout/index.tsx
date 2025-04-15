import { ReactNode, useEffect } from 'react'
import { Box, Container } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'

interface LayoutProps {
  children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  // ページ変更時にコンソールにログを出力（デバッグ用）
  useEffect(() => {
    console.log('現在のパス:', location.pathname);
  }, [location]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        width: '100%',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Header />
      <Container 
        component="main" 
        sx={{ 
          flex: 1, 
          py: 3, 
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '100%',
          height: 'calc(100vh - 64px)', // ヘッダーの高さ(64px)を引いた高さ
          overflow: 'auto'
        }}
      >
        {children || <Outlet />}
      </Container>
    </Box>
  )
}

export default Layout 