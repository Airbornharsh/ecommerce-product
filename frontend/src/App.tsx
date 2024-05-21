import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { LoaderProvider } from './context/LoaderContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Loader from './components/Loader'

const App: React.FC = () => {
  return (
    <LoaderProvider>
      <AuthProvider>
        <div>
          <Navbar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
          <Loader />
        </div>
      </AuthProvider>
    </LoaderProvider>
  )
}

export default App
