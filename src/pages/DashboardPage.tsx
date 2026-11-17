import Navbar from '../components/Navbar'
import MetricsCards from '../features/products/MetricsCards'
import ProductsPanel from '../features/products/ProductsPanel'
import { useProducts } from '../features/products/useProducts'

export default function DashboardPage() {
  const products = useProducts()

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-6 p-4">
        {products === undefined ? (
          <p role="status" className="py-10 text-center text-gray-500">
            Loading products...
          </p>
        ) : (
          <>
            <MetricsCards products={products} />
            <ProductsPanel products={products} />
          </>
        )}
      </main>
    </div>
  )
}
