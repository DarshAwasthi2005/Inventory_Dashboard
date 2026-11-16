import type { Product } from '../../db/types'
import { LOW_STOCK_THRESHOLD } from '../../lib/constants'
import { formatCurrency } from '../../lib/format'

export default function MetricsCards({ products }: { products: Product[] }) {
  const lowStock = products.filter((p) => p.quantity < LOW_STOCK_THRESHOLD).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

  const cards = [
    { label: 'Total products', value: String(products.length) },
    { label: `Low stock (below ${LOW_STOCK_THRESHOLD})`, value: String(lowStock) },
    { label: 'Inventory value', value: formatCurrency(totalValue) },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-3" aria-label="Overview">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="mt-1 text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </section>
  )
}
