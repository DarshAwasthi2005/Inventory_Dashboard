import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '../../lib/schemas'
import { CATEGORIES } from '../../lib/constants'
import { productService } from '../../db/productService'
import type { Product, ProductInput } from '../../db/types'

const inputClass = 'mt-1 w-full rounded border px-3 py-2'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {children}
      {error && (
        <span className="mt-1 block text-sm font-normal text-red-600">{error}</span>
      )}
    </label>
  )
}

interface ProductFormProps {
  product?: Product // diya to edit mode, nahi diya to add mode
  onDone: () => void
}

export default function ProductForm({ product, onDone }: ProductFormProps) {
  const [serverError, setServerError] = useState('')
  const isEdit = product?.id !== undefined

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
          status: product.status,
        }
      : { name: '', sku: '', category: '', status: 'active' },
  })

  async function onSubmit(values: ProductInput) {
    setServerError('')
    try {
      if (product?.id !== undefined) {
        await productService.update(product.id, values)
      } else {
        await productService.create(values)
      }
      onDone()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Save nahi ho paya')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <Field label="Name" error={errors.name?.message}>
        <input className={inputClass} {...register('name')} />
      </Field>

      <Field label="SKU" error={errors.sku?.message}>
        <input className={inputClass} placeholder="ELE-100" {...register('sku')} />
      </Field>

      <Field label="Category" error={errors.category?.message}>
        <select className={inputClass} {...register('category')}>
          <option value="">Chuno...</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (₹)" error={errors.price?.message}>
          <input
            type="number"
            step="0.01"
            className={inputClass}
            {...register('price', { valueAsNumber: true })}
          />
        </Field>
        <Field label="Quantity" error={errors.quantity?.message}>
          <input
            type="number"
            className={inputClass}
            {...register('quantity', { valueAsNumber: true })}
          />
        </Field>
      </div>

      <Field label="Status" error={errors.status?.message}>
        <select className={inputClass} {...register('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </Field>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Save product'}
        </button>
      </div>
    </form>
  )
}
