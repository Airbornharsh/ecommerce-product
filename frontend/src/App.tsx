import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { LoaderProvider } from './context/LoaderContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import { ProductProvider } from './context/ProductContext'
import Cart from './pages/Cart'

const App: React.FC = () => {
  return (
    <LoaderProvider>
      <ProductProvider>
        <AuthProvider>
          <div>
            <Navbar />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </BrowserRouter>
            <Loader />
          </div>
        </AuthProvider>
      </ProductProvider>
    </LoaderProvider>
  )
}

export default App
