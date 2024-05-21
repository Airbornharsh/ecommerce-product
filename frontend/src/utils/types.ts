export interface User {
  id: number
  name: string
  email: string
}

export interface AuthFormData {
  name?: string
  email: string
  password: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
}

export interface CartItem {
  id: number
  product: Product
  price: number
  quantity: number
}
