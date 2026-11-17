import type { Product } from '../../db/types'
import { LOW_STOCK_THRESHOLD } from '../../lib/constants'
import { formatCurrency } from '../../lib/format'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete?: (product: Product) => void // when omitted, the Delete button is hidden
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return <p className="py-10 text-center text-gray-500">No products found.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">SKU</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2 text-right">Price</th>
            <th className="px-3 py-2 text-right">Qty</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b last:border-0">
              <td className="px-3 py-2 font-medium">{p.name}</td>
              <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
              <td className="px-3 py-2">{p.category}</td>
              <td className="px-3 py-2 text-right">{formatCurrency(p.price)}</td>
              <td
                className={`px-3 py-2 text-right ${
                  p.quantity < LOW_STOCK_THRESHOLD ? 'font-semibold text-red-600' : ''
                }`}
              >
                {p.quantity}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    p.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-3 py-2 text-right whitespace-nowrap">
                <button
                  onClick={() => onEdit(p)}
                  aria-label={`Edit ${p.name}`}
                  className="rounded px-2 py-1 text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </button>
                {onDelete && (
                  <button
                    onClick={() => onDelete(p)}
                    aria-label={`Delete ${p.name}`}
                    className="ml-1 rounded px-2 py-1 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
