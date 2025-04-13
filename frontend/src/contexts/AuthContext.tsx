import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/user'
import { getCurrentUser, isAuthenticated, logout } from '@/api/authApi'
import axios from 'axios'
import client from '@/api/client'

interface AuthContextType {
  user: User | null
  isAuth: boolean
  loading: boolean
  logout: () => void
  setUser: (user: User | null) => void
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  loading: true,
  logout: () => {},
  setUser: () => {},
  refreshAuth: async () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const validateToken = async () => {
    try {
      // JWTトークンの検証
      const token = localStorage.getItem('token')
      if (!token) return false

      // トークンの有効性チェック（簡易的なAPI呼び出し）
      const response = await client.get('/users/me')
      return !!response.data
    } catch (error) {
      console.error('トークン検証エラー:', error)
      // トークンが無効または期限切れの場合
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return false
    }
  }

  const refreshAuth = async () => {
    setLoading(true)
    try {
      const isValid = await validateToken()
      
      if (isValid) {
        const currentUser = getCurrentUser()
        console.log('現在のユーザー:', currentUser)
        setUser(currentUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('認証更新エラー:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 初期化時に認証状態を確認
    refreshAuth()
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  const value = {
    user,
    isAuth: !!user,
    loading,
    logout: handleLogout,
    setUser,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext 