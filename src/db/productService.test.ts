import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './database'
import { productService } from './productService'
import type { ProductInput } from './types'

const laptop: ProductInput = {
  name: 'Laptop',
  sku: 'ELE-001',
  category: 'Electronics',
  price: 55000,
  quantity: 10,
  status: 'active',
}

const mouse: ProductInput = { ...laptop, name: 'Mouse', sku: 'ELE-002', price: 799 }

// Each test starts from an empty table so tests never depend on each other
beforeEach(async () => {
  await db.products.clear()
})

describe('productService', () => {
  it('creates a product and reads it back', async () => {
    const id = await productService.create(laptop)
    const saved = await productService.getById(id)

    expect(saved?.name).toBe('Laptop')
    expect(saved?.createdAt).toBeTypeOf('number')
  })

  it('normalizes the SKU to uppercase on create', async () => {
    const id = await productService.create({ ...laptop, sku: 'ele-001' })
    expect((await productService.getById(id))?.sku).toBe('ELE-001')
  })

  it('rejects invalid input before it reaches the database', async () => {
    await expect(productService.create({ ...laptop, price: -1 })).rejects.toThrow()
    expect(await productService.getAll()).toHaveLength(0)
  })

  it('rejects a duplicate SKU with a clear message', async () => {
    await productService.create(laptop)
    await expect(productService.create(laptop)).rejects.toThrow('already exists')
  })

  it('updates a product and allows saving it with its own SKU', async () => {
    const id = await productService.create(laptop)
    await productService.update(id, { ...laptop, name: 'Gaming Laptop' })

    expect((await productService.getById(id))?.name).toBe('Gaming Laptop')
  })

  it('rejects an update that would duplicate another product SKU', async () => {
    await productService.create(laptop)
    const mouseId = await productService.create(mouse)

    await expect(
      productService.update(mouseId, { ...mouse, sku: 'ELE-001' }),
    ).rejects.toThrow('already exists')
  })

  it('removes a product', async () => {
    const id = await productService.create(laptop)
    await productService.remove(id)

    expect(await productService.getById(id)).toBeUndefined()
  })
})
