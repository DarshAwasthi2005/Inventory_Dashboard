import { productService } from './productService'
import type { ProductInput } from './types'

const SAMPLES: ProductInput[] = [
  {
    name: 'Gaming Laptop',
    sku: 'ELE-001',
    category: 'Electronics',
    price: 75000,
    quantity: 8,
    status: 'active',
  },
  {
    name: 'Wireless Mouse',
    sku: 'ELE-002',
    category: 'Electronics',
    price: 799,
    quantity: 3,
    status: 'active',
  },
  {
    name: 'Office Chair',
    sku: 'FUR-001',
    category: 'Furniture',
    price: 6500,
    quantity: 12,
    status: 'active',
  },
  {
    name: 'Study Table',
    sku: 'FUR-002',
    category: 'Furniture',
    price: 9200,
    quantity: 2,
    status: 'inactive',
  },
  {
    name: 'Notebook Pack',
    sku: 'STA-001',
    category: 'Stationery',
    price: 250,
    quantity: 60,
    status: 'active',
  },
  {
    name: 'Gel Pen Box',
    sku: 'STA-002',
    category: 'Stationery',
    price: 120,
    quantity: 4,
    status: 'active',
  },
  {
    name: 'Basmati Rice 5kg',
    sku: 'GRO-001',
    category: 'Grocery',
    price: 650,
    quantity: 25,
    status: 'active',
  },
  {
    name: 'Cotton T-Shirt',
    sku: 'CLO-001',
    category: 'Clothing',
    price: 499,
    quantity: 40,
    status: 'active',
  },
]

// Products with a duplicate SKU are skipped, so this is safe to run repeatedly
export async function seedProducts(): Promise<number> {
  let added = 0
  for (const sample of SAMPLES) {
    try {
      await productService.create(sample)
      added++
    } catch {
      // SKU already exists; skip
    }
  }
  return added
}
