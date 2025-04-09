import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/user'
import { getCurrentUser, isAuthenticated, logout } from '@/api/authApi'

interface AuthContextType {
  user: User | null
  isAuth: boolean
  loading: boolean
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  loading: true,
  logout: () => {},
  setUser: () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = () => {
      const isAuth = isAuthenticated()
      if (isAuth) {
        const currentUser = getCurrentUser()
        setUser(currentUser)
      }
      setLoading(false)
    }

    initAuth()
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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext 