import React, { createContext, useContext, useState, useEffect } from 'react'
import { authenticateAdmin, getCurrentAdmin, logoutAdmin } from '../lib/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const adminUser = getCurrentAdmin()
    if (adminUser) {
      setIsAuthenticated(true)
      setCurrentUser(adminUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const result = await authenticateAdmin(email, password)
      
      if (result.success) {
        setIsAuthenticated(true)
        setCurrentUser(result.user)
        return { success: true }
      }
      
      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const logout = () => {
    logoutAdmin()
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  const value = {
    isAuthenticated,
    isLoading,
    currentUser,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}