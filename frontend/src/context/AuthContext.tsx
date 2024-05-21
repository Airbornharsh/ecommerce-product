'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import axios from 'axios'
import { AuthFormData, User } from '../utils/types'
import { BACKEND_URL } from '../utils/config'

interface AuthContextProps {
  token: string
  setToken: (token: string) => void
  isAuthenticated: boolean
  user: User | null
  setUser: (user: User) => void
  signIn: (formData: AuthFormData) => Promise<void>
  signUp: (formData: AuthFormData) => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('userAuth must be used within a AuthProvider')
  }

  return context
}

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthContextProviderProps> = ({
  children
}) => {
  const [token, setToken] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>()

  const signIn = async (formData: AuthFormData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/signin`, {
        email: formData.email,
        password: formData.password
      })
      const responseData = response.data
      const access_token = responseData.access_token
      localStorage.setItem('access_token', access_token)
      setToken(access_token)
      setUser(responseData.user)
      setIsAuthenticated(true)
    } catch (e) {
      console.log(e)
    }
  }

  const signUp = async (formData: AuthFormData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      const responseData = response.data
      const access_token = responseData.access_token
      localStorage.setItem('access_token', access_token)
      setToken(access_token)
      setUser(responseData.user)
      setIsAuthenticated(true)
    } catch (e) {
      console.log(e)
    }
  }

  const contextValue: AuthContextProps = {
    token,
    setToken,
    isAuthenticated,
    user: user || null,
    setUser,
    signIn,
    signUp
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
