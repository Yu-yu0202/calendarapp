import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { fetchUsers, deleteUser } from '@/api/userApi'
import { register } from '@/api/authApi'
import { User, RegisterPayload } from '@/types/user'
import EventSettings from './EventSettings'
import AccessSettings from './AccessSettings'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  }
}

const Admin = () => {
  const [value, setValue] = useState(0)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  // 新規ユーザー登録用のフォームの状態
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('user')
  
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (err) {
      console.error('ユーザー取得エラー:', err)
      setError('ユーザー情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchUserData()
  }, [])
  
  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user)
      setUsername(user.username)
      setEmail(user.email)
      setRole(user.role)
    } else {
      setSelectedUser(null)
      resetForm()
    }
    setOpenDialog(true)
  }
  
  const handleCloseDialog = () => {
    setOpenDialog(false)
    resetForm()
  }
  
  const resetForm = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setRole('user')
    setError(null)
  }
  
  const handleAddUser = async () => {
    // 入力検証
    if (!username || !email || !password) {
      setError('すべての必須項目を入力してください')
      return
    }
    
    if (password !== confirmPassword) {
      setError('パスワードが一致していません')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const userData: RegisterPayload = {
        username,
        email,
        password,
        role
      }
      
      await register(userData)
      setSuccess('ユーザーを登録しました')
      handleCloseDialog()
      fetchUserData()
    } catch (err: any) {
      console.error('ユーザー登録エラー:', err)
      setError(err.response?.data?.message || 'ユーザー登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDeleteUser = async (userId: number) => {
    if (!confirm('このユーザーを削除してもよろしいですか？')) return
    
    setLoading(true)
    try {
      await deleteUser(userId)
      setSuccess('ユーザーを削除しました')
      fetchUserData()
    } catch (err) {
      console.error('ユーザー削除エラー:', err)
      setError('ユーザーの削除に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        管理画面
      </Typography>
      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="予定設定" {...a11yProps(0)} />
            <Tab label="アクセス設定" {...a11yProps(1)} />
            <Tab label="ユーザー管理" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <EventSettings />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AccessSettings />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">ユーザー管理</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                ユーザー追加
              </Button>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                {success}
              </Alert>
            )}
            
            <TableContainer>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>ユーザー名</TableCell>
                      <TableCell>メールアドレス</TableCell>
                      <TableCell>権限</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          ユーザーが存在しません
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role === 'admin' ? '管理者' : 'ユーザー'}
                              color={user.role === 'admin' ? 'primary' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleOpenDialog(user)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Paper>
          
          {/* ユーザー追加/編集ダイアログ */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {selectedUser ? 'ユーザー編集' : 'ユーザー追加'}
            </DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="ユーザー名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="メールアドレス"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!selectedUser && (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="パスワード"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="パスワード（確認）"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </>
                )}
                <TextField
                  select
                  margin="normal"
                  fullWidth
                  label="権限"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="user">ユーザー</option>
                  <option value="admin">管理者</option>
                </TextField>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>キャンセル</Button>
              <Button 
                onClick={handleAddUser}
                variant="contained" 
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : '保存'}
              </Button>
            </DialogActions>
          </Dialog>
        </TabPanel>
      </Paper>
    </Box>
  )
}

export default Admin 