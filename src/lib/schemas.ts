import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  sku: z.string().trim().min(3, 'SKU must be at least 3 characters').toUpperCase(),
  category: z.string().trim().min(1, 'Category is required'),
  price: z
    .number({ error: 'Price is required' })
    .positive('Price must be greater than 0'),
  quantity: z
    .number({ error: 'Quantity is required' })
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
  status: z.enum(['active', 'inactive']),
})
