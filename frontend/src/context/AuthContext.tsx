'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import axios from 'axios'
import { AuthFormData, CartItem, User } from '../utils/types'
import { BACKEND_URL } from '../utils/config'
import { useLoader } from './LoaderContext'

interface AuthContextProps {
  token: string
  setToken: (token: string) => void
  isAuthenticated: boolean
  user: User | null
  setUser: (user: User) => void
  signIn: (formData: AuthFormData) => Promise<void>
  signUp: (formData: AuthFormData) => Promise<void>
  cartItems: CartItem[]
  addToCart: (productId: number) => Promise<void>
  getCartItems: () => Promise<void>
  totalCartPages: number
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
  const { setIsLoading, setErrorToastMessage, setToastMessage } = useLoader()
  const [token, setToken] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalCartPages, setTotalCartPages] = useState<number>(0)

  const signIn = async (formData: AuthFormData) => {
    setIsLoading(true)
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
      setToastMessage('Logged in successfully')
    } catch (e) {
      console.log(e)
      setErrorToastMessage('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (formData: AuthFormData) => {
    setIsLoading(true)
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
      setToastMessage('Signed up successfully')
    } catch (e) {
      console.log(e)
      setErrorToastMessage('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (productId: number) => {
    setIsLoading(true)
    try {
      if (!token) {
        setErrorToastMessage('Please login to add to cart')
        return
      }
      await axios.post(
        `${BACKEND_URL}/api/cart`,
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setToastMessage('Added to cart')
    } catch (e) {
      console.log(e)
      setErrorToastMessage('Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const getCartItems = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${BACKEND_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseData = response.data
      setCartItems(responseData.cart)
      setTotalCartPages(responseData.total_pages)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  const contextValue: AuthContextProps = {
    token,
    setToken,
    isAuthenticated,
    user: user || null,
    setUser,
    signIn,
    signUp,
    cartItems,
    getCartItems,
    totalCartPages,
    addToCart
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
