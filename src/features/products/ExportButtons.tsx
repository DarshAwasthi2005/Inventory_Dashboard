import type { Product } from '../../db/types'
import { exportCSV, exportJSON } from '../../lib/export'

export default function ExportButtons({ products }: { products: Product[] }) {
  const disabled = products.length === 0

  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportCSV(products)}
        disabled={disabled}
        className="rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-40"
      >
        Export CSV
      </button>
      <button
        onClick={() => exportJSON(products)}
        disabled={disabled}
        className="rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-40"
      >
        Export JSON
      </button>
    </div>
  )
}
