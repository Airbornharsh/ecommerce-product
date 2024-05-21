import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './env/HomePage'
import { LoaderProvider } from './context/LoaderContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'

const App: React.FC = () => {
  return (
    <LoaderProvider>
      <AuthProvider>
        <div>
          <Navbar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </LoaderProvider>
  )
}

export default App
