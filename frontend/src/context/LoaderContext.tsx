import React, { createContext, useContext, useState, ReactNode } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface LoaderContextProps {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  setToastMessage: (message: string) => void
  setErrorToastMessage: (message: string) => void
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useLoader = () => {
  const context = useContext(LoaderContext)

  if (!context) {
    throw new Error('userLoader must be used within a LoaderProvider')
  }

  return context
}

interface LoaderContextProviderProps {
  children: ReactNode
}

export const LoaderProvider: React.FC<LoaderContextProviderProps> = ({
  children
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const setToastMessage = (message: string) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 2000
    })
  }

  const setErrorToastMessage = (message: string) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 2000
    })
  }

  const contextValue: LoaderContextProps = {
    isLoading,
    setIsLoading,
    setToastMessage,
    setErrorToastMessage
  }

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </LoaderContext.Provider>
  )
}
