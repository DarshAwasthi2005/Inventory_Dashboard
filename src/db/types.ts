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