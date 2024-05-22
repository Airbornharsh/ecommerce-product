import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { LoaderProvider } from './context/LoaderContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import { ProductProvider } from './context/ProductContext'
import Cart from './pages/Cart'
import ProductPage from './pages/Product'
import CreateProductPage from './pages/CreateProduct'

const App: React.FC = () => {
  return (
    <LoaderProvider>
      <ProductProvider>
        <AuthProvider>
          <div className="w-screen overflow-hidden">
            <Navbar />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/create-product" element={<CreateProductPage />} />
                <Route path="*" element={<div>Not Found</div>} />
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
