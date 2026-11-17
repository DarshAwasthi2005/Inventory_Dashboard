import { AnimatePresence, motion } from 'motion/react'
import { itemVariants } from './authMotion'

export function AuthAlert({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          key={message}
          role="alert"
          className="rounded bg-red-50 px-3 py-2 text-sm text-red-700"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

interface AuthSubmitButtonProps {
  loading: boolean
  idleLabel: string
  busyLabel: string
}

export function AuthSubmitButton({
  loading,
  idleLabel,
  busyLabel,
}: AuthSubmitButtonProps) {
  return (
    <motion.div variants={itemVariants}>
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading && (
          <span
            aria-hidden
            className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
        )}
        {loading ? busyLabel : idleLabel}
      </button>
    </motion.div>
  )
}
