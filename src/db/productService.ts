import { db } from './database'
import type { Product, ProductInput } from './types'
import { productSchema } from '../lib/schemas'

function toFriendlyError(err: unknown, sku: string): Error {
  if (err instanceof Error && err.name === 'ConstraintError') {
    return new Error(`SKU "${sku}" pehle se exist karta hai`)
  }
  return err instanceof Error ? err : new Error('Kuch galat ho gaya')
}

export const productService = {
  getAll(): Promise<Product[]> {
    return db.products.orderBy('createdAt').reverse().toArray()
  },

  getById(id: number): Promise<Product | undefined> {
    return db.products.get(id)
  },

  async create(input: ProductInput): Promise<number> {
    const data = productSchema.parse(input) // galat data yahin ruk jayega
    const now = Date.now()
    let id: number | undefined
    try {
      id = await db.products.add({ ...data, createdAt: now, updatedAt: now })
    } catch (err) {
      throw toFriendlyError(err, data.sku)
    }
    if (id === undefined) throw new Error('Product save nahi ho paya')
    return id
  },

  async update(id: number, input: ProductInput): Promise<void> {
    const data = productSchema.parse(input)
    try {
      await db.products.update(id, { ...data, updatedAt: Date.now() })
    } catch (err) {
      throw toFriendlyError(err, data.sku)
    }
  },

  async remove(id: number): Promise<void> {
    await db.products.delete(id)
  },
}
