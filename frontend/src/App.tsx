import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Calendar from '@/pages/Calendar'
import Admin from '@/pages/Admin'
import Login from '@/pages/Auth/Login'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'
import PdfExport from '@/pages/PDF/PdfExport'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/ja';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* 公開ルート */}
            <Route path="/login" element={<Login />} />

            {/* 保護されたルート */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Calendar />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/pdf" element={<PdfExport />} />
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </LocalizationProvider>
    </AuthProvider>
  )
}

export default App 