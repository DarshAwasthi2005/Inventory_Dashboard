import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Name kam se kam 2 characters ka ho'),
  sku: z.string().trim().min(3, 'SKU kam se kam 3 characters ka ho').toUpperCase(),
  category: z.string().trim().min(1, 'Category chunna zaroori hai'),
  price: z.number().positive('Price 0 se zyada ho'),
  quantity: z.number().int().min(0, 'Quantity negative nahi ho sakti'),
  status: z.enum(['active', 'inactive']),
})