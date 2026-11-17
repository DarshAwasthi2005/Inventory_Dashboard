import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Product } from '../../db/types'
import { productService } from '../../db/productService'
import { seedProducts } from '../../db/seedProducts'
import { PAGE_SIZE } from '../../lib/constants'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../auth/useAuth'
import ExportButtons from './ExportButtons'
import ProductForm from './ProductForm'
import ProductTable from './ProductTable'

export default function ProductsPanel({ products }: { products: Product[] }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) =>
      [p.name, p.sku, p.category].some((v) => v.toLowerCase().includes(q)),
    )
  }, [products, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages) // keep the page in range after deletions
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  async function confirmDelete() {
    if (deleting?.id === undefined) return
    await productService.remove(deleting.id)
    setDeleting(null)
  }

  return (
    <motion.section
      className="rounded-xl bg-white p-4 shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1) // reset to the first page on a new search
          }}
          placeholder="Search by name, SKU or category"
          aria-label="Search products"
          className="min-w-52 flex-1 rounded border px-3 py-2 text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
        <ExportButtons products={filtered} />
        {import.meta.env.DEV && (
          <button
            onClick={() => seedProducts()}
            className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Add sample data
          </button>
        )}
        <button
          onClick={() => setIsAddOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add product
        </button>
      </div>

      <ProductTable
        products={visible}
        onEdit={setEditing}
        onDelete={isAdmin ? setDeleting : undefined}
      />

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {filtered.length} product{filtered.length === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAddOpen && (
          <Modal
            key="add-product"
            title="Add product"
            onClose={() => setIsAddOpen(false)}
          >
            <ProductForm onDone={() => setIsAddOpen(false)} />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editing && (
          <Modal key="edit-product" title="Edit product" onClose={() => setEditing(null)}>
            <ProductForm product={editing} onDone={() => setEditing(null)} />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleting && (
          <ConfirmDialog
            key="delete-product"
            title="Delete product?"
            message={`"${deleting.name}" (${deleting.sku}) will be permanently deleted. This action cannot be undone.`}
            onConfirm={confirmDelete}
            onCancel={() => setDeleting(null)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  )
}
