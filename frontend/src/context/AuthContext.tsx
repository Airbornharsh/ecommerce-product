'use client'
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react'
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
  addToCart: (productId: number, quantity?: number) => Promise<void>
  getCartItems: (page: number) => Promise<void>
  totalCartPages: number
  removeFromCart: (id: number) => Promise<void>
  logout: () => void
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

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      setToken(token)
    }
  }, [])

  useEffect(() => {
    if (token) {
      tokenCheck()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const tokenCheck = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseData = response.data
      setUser(responseData.user)
      setIsAuthenticated(true)
    } catch (e) {
      console.log(e)
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setToken('')
    setIsAuthenticated(false)
    setUser(null)
  }

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

  const addToCart = async (productId: number, quantity?: number) => {
    setIsLoading(true)
    try {
      if (!isAuthenticated) {
        setErrorToastMessage('Please login to add to cart')
        return
      }
      await axios.post(
        `${BACKEND_URL}/api/cart`,
        { product_id: productId, quantity: quantity || 1 },
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

  const getCartItems = async (page: number) => {
    setIsLoading(true)
    try {
      if (!isAuthenticated) {
        return
      }
      const response = await axios.get(`${BACKEND_URL}/api/cart?page=${page}`, {
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

  const removeFromCart = async (id: number) => {
    setIsLoading(true)
    try {
      if (!isAuthenticated) {
        setErrorToastMessage('Please login to remove from cart')
        return
      }
      await axios.delete(`${BACKEND_URL}/api/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCartItems(cartItems.filter((item) => item.id !== id))
      setToastMessage('Removed from cart')
    } catch (e) {
      console.log(e)
      setErrorToastMessage('Failed to remove from cart')
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
    addToCart,
    removeFromCart,
    logout
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
