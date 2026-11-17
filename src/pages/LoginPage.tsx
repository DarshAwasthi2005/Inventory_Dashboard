import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../features/auth/useAuth'
import AuthField from '../features/auth/AuthField'
import AuthLayout from '../features/auth/AuthLayout'
import { AuthAlert, AuthSubmitButton } from '../features/auth/AuthControls'
import { formVariants, itemVariants } from '../features/auth/authMotion'
import { loginSchema, type LoginInput } from '../lib/authSchemas'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/dashboard'

  // Already signed in: skip the login page
  if (user) return <Navigate to="/dashboard" replace />

  async function onSubmit(values: LoginInput) {
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
    <AuthLayout>
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
          <p className="mt-1 text-sm text-gray-500">Sign in to manage your inventory.</p>
        </motion.div>

        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="username"
          error={errors.email?.message}
          {...register('email')}
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <AuthAlert message={serverError} />

        <AuthSubmitButton
          loading={isSubmitting}
          idleLabel="Login"
          busyLabel="Logging in..."
        />

        <motion.p variants={itemVariants} className="text-center text-sm text-gray-600">
          New here?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Create an account
          </Link>
        </motion.p>

        {import.meta.env.DEV && (
          <motion.p variants={itemVariants} className="text-xs text-gray-500">
            Development demo accounts: admin@demo.com / admin123 or user@demo.com /
            user123
          </motion.p>
        )}
      </motion.form>
    </AuthLayout>
  )
}
