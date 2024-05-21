import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '../utils/types'
import { useLoader } from './LoaderContext'
import axios from 'axios'

interface ProductContextProps {
  products: Product[]
  setProducts: (page: number, search: string) => void
  totalProductPages: number
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useProduct = () => {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error('userProduct must be used within a ProductProvider')
  }

  return context
}

interface ProductContextProviderProps {
  children: ReactNode
}

export const ProductProvider: React.FC<ProductContextProviderProps> = ({
  children
}) => {
  const { setIsLoading } = useLoader()
  const [products, setProducts] = useState<Product[]>([])
  const [totalProductPages, setTotalProductPages] = useState<number>(0)

  const setProductsFn = async (page: number, search: string) => {
    setIsLoading(true)
    const newPage = page || 1
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/products?page=${newPage}&search=${search}`
      )
      const responseData = response.data
      setProducts(responseData.products)
      setTotalProductPages(responseData.total_pages)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  const contextValue: ProductContextProps = {
    products,
    setProducts: setProductsFn,
    totalProductPages
  }

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}
