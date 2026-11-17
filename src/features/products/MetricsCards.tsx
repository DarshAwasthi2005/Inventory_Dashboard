import { motion, type Variants } from 'motion/react'
import AnimatedNumber from '../../components/AnimatedNumber'
import type { Product } from '../../db/types'
import { LOW_STOCK_THRESHOLD } from '../../lib/constants'
import { formatCurrency } from '../../lib/format'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function MetricsCards({ products }: { products: Product[] }) {
  const lowStock = products.filter((p) => p.quantity < LOW_STOCK_THRESHOLD).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

  const cards = [
    { label: 'Total products', value: products.length, format: undefined },
    {
      label: `Low stock (below ${LOW_STOCK_THRESHOLD})`,
      value: lowStock,
      format: undefined,
    },
    { label: 'Inventory value', value: totalValue, format: formatCurrency },
  ]

  return (
    <motion.section
      className="grid gap-4 sm:grid-cols-3"
      aria-label="Overview"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          variants={cardVariants}
          whileHover={{ y: -3 }}
          className="rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="mt-1 text-2xl font-bold">
            <AnimatedNumber value={card.value} format={card.format} />
          </p>
        </motion.div>
      ))}
    </motion.section>
  )
}
