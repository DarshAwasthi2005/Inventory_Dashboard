export type ProductStatus = 'active' | 'inactive'

export interface Product {
  id?: number // optional, kyunki create karte waqt DB khud dega
  name: string
  sku: string
  category: string
  price: number
  quantity: number
  status: ProductStatus
  createdAt: number
  updatedAt: number
}

// User/form se jo data aata hai: id aur timestamps ke bina
export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

export type Role = 'admin' | 'user'

// Database mein jo user store hota hai (password hash ke saath)
export interface User {
  id?: number
  name: string
  email: string
  passwordHash: string
  role: Role
}

// App ke andar jo user hum use karte hain (password ke bina, kabhi nahi)
export interface SessionUser {
  id: number
  name: string
  email: string
  role: Role
}
