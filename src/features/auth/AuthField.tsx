import type { ComponentProps } from 'react'
import { motion } from 'motion/react'
import { itemVariants } from './authMotion'

interface AuthFieldProps extends ComponentProps<'input'> {
  id: string
  label: string
  error?: string
}

export default function AuthField({ id, label, error, ...inputProps }: AuthFieldProps) {
  return (
    <motion.div variants={itemVariants}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded border px-3 py-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </motion.div>
  )
}
