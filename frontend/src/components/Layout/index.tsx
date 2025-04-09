import { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from './Header'

interface LayoutProps {
  children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        {children || <Outlet />}
      </Container>
    </Box>
  )
}

export default Layout 