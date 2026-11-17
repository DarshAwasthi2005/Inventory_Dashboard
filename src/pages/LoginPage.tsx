import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useAuth } from '../features/auth/useAuth'

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

// The form reveals its children one after another
const formVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/dashboard'

  // Already signed in: skip the login page
  if (user) return <Navigate to="/dashboard" replace />

  async function onSubmit(values: LoginForm) {
    setServerError('')
    try {
      await login(values.email, values.password)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Unable to sign in. Please try again.',
      )
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-white to-blue-100 p-4">
      {/* Decorative background shapes that drift slowly */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-300/40 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative w-full max-w-sm rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to manage your inventory.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              className="w-full rounded border px-3 py-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded border px-3 py-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </motion.div>

          <AnimatePresence>
            {serverError && (
              <motion.p
                key={serverError}
                role="alert"
                className="rounded bg-red-50 px-3 py-2 text-sm text-red-700"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {serverError}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting && (
                <span
                  aria-hidden
                  className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </motion.div>

          <motion.p variants={itemVariants} className="text-xs text-gray-500">
            Demo accounts: admin@demo.com / admin123 or user@demo.com / user123
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  )
}
