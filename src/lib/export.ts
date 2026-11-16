import type { Product } from '../db/types'

const COLUMNS = [
  'id',
  'name',
  'sku',
  'category',
  'price',
  'quantity',
  'status',
  'createdAt',
  'updatedAt',
] as const

function escapeCell(value: string | number | undefined): string {
  let text = String(value ?? '')
  // CSV injection se bachav: Excel "=" ya "+" se shuru cell ko formula samajhta hai
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  // Comma, quote ya new line ho to cell ko quotes mein band karo
  if (/[",\n\r]/.test(text)) text = `"${text.replace(/"/g, '""')}"`
  return text
}

export function toCSV(products: Product[]): string {
  const header = COLUMNS.join(',')
  const rows = products.map((p) =>
    COLUMNS.map((col) => {
      const value = p[col]
      const isDate = col === 'createdAt' || col === 'updatedAt'
      return escapeCell(isDate ? new Date(value as number).toISOString() : value)
    }).join(','),
  )
  return [header, ...rows].join('\r\n')
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url) // memory free karo
}

function stamp(): string {
  return new Date().toISOString().slice(0, 10)
}

export function exportCSV(products: Product[]) {
  // BOM (\uFEFF) Excel ko batata hai ki file UTF-8 hai
  downloadFile(
    '\uFEFF' + toCSV(products),
    `products-${stamp()}.csv`,
    'text/csv;charset=utf-8',
  )
}

export function exportJSON(products: Product[]) {
  downloadFile(
    JSON.stringify(products, null, 2),
    `products-${stamp()}.json`,
    'application/json',
  )
}
