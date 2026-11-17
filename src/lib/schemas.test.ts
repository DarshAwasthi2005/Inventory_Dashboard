import { describe, expect, it } from 'vitest'
import { productSchema } from './schemas'

const valid = {
  name: 'Laptop',
  sku: 'lap-001',
  category: 'Electronics',
  price: 55000,
  quantity: 10,
  status: 'active',
}

describe('productSchema', () => {
  it('accepts valid input and normalizes the SKU to uppercase', () => {
    expect(productSchema.parse(valid).sku).toBe('LAP-001')
  })

  it('trims surrounding whitespace from text fields', () => {
    expect(productSchema.parse({ ...valid, name: '  Laptop  ' }).name).toBe('Laptop')
  })

  it('rejects a name shorter than 2 characters', () => {
    expect(productSchema.safeParse({ ...valid, name: 'A' }).success).toBe(false)
  })

  it('rejects a price of zero or less', () => {
    expect(productSchema.safeParse({ ...valid, price: 0 }).success).toBe(false)
    expect(productSchema.safeParse({ ...valid, price: -5 }).success).toBe(false)
  })

  it('rejects negative or fractional quantities', () => {
    expect(productSchema.safeParse({ ...valid, quantity: -1 }).success).toBe(false)
    expect(productSchema.safeParse({ ...valid, quantity: 1.5 }).success).toBe(false)
  })

  it('rejects an unknown status', () => {
    expect(productSchema.safeParse({ ...valid, status: 'archived' }).success).toBe(false)
  })
})
