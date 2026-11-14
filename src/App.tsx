import { useEffect } from 'react'
import { productService } from './db/productService'

export default function App() {
  useEffect(() => {
    productService
      .create({
        name: 'Laptop',
        sku: 'lap-001',
        category: 'Electronics',
        price: 55000,
        quantity: 10,
        status: 'active',
      })
      .then(() => productService.getAll())
      .then(console.log)
      .catch((e) => console.error(e.message))
  }, [])

  return <h1 className="p-4 text-2xl font-bold">Hello Dashboard</h1>
}