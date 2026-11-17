import Navbar from '../components/Navbar'
import MetricsCards from '../features/products/MetricsCards'
import ProductsPanel from '../features/products/ProductsPanel'
import { useProducts } from '../features/products/useProducts'

// Placeholder that mirrors the final layout while data loads
function DashboardSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading products...</span>
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-white/80" />
        ))}
      </div>
      <div className="mt-6 h-72 animate-pulse rounded-xl bg-white/80" />
    </div>
  )
}

export default function DashboardPage() {
  const products = useProducts()

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-6 p-4">
        {products === undefined ? (
          <DashboardSkeleton />
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
