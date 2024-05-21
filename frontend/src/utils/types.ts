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
