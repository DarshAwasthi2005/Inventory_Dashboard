import { describe, expect, it } from 'vitest'
import type { Product } from '../db/types'
import { toCSV } from './export'

const base: Product = {
  id: 1,
  name: 'Office Chair',
  sku: 'FUR-001',
  category: 'Furniture',
  price: 6500,
  quantity: 12,
  status: 'active',
  createdAt: 0,
  updatedAt: 0,
}

function firstRow(products: Product[]): string {
  return toCSV(products).split('\r\n')[1]
}

describe('toCSV', () => {
  it('returns only the header row for an empty list', () => {
    expect(toCSV([])).toBe(
      'id,name,sku,category,price,quantity,status,createdAt,updatedAt',
    )
  })

  it('writes one row per product with ISO timestamps', () => {
    expect(firstRow([base])).toBe(
      '1,Office Chair,FUR-001,Furniture,6500,12,active,1970-01-01T00:00:00.000Z,1970-01-01T00:00:00.000Z',
    )
  })

  it('wraps cells that contain commas in quotes', () => {
    expect(firstRow([{ ...base, name: 'Chair, large' }])).toContain('"Chair, large"')
  })

  it('escapes double quotes inside cells', () => {
    expect(firstRow([{ ...base, name: 'The "Best" Chair' }])).toContain(
      '"The ""Best"" Chair"',
    )
  })

  it('neutralizes cells that start with a formula character', () => {
    expect(firstRow([{ ...base, name: '=SUM(1+1)' }])).toContain(",'=SUM(1+1),")
  })
})
