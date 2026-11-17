import Dexie, { type EntityTable } from 'dexie'
import type { Product, User } from './types'

export const db = new Dexie('InventoryDB') as Dexie & {
  products: EntityTable<Product, 'id'>
  users: EntityTable<User, 'id'>
}

db.version(1).stores({
  products: '++id, &sku, name, category, status, createdAt',
})

// Schema migration: only new or changed tables are declared
db.version(2).stores({
  users: '++id, &email',
})
