import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

const loginSchema = z.object({
  email: z.email('Sahi email daalo'),
  password: z.string().min(6, 'Password kam se kam 6 characters ka ho'),
})

type LoginForm = z.infer<typeof loginSchema>

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

  // Pehle se logged in ho to login page dikhane ka koi matlab nahi
  if (user) return <Navigate to="/dashboard" replace />

  async function onSubmit(values: LoginForm) {
    setServerError('')
    try {
      await login(values.email, values.password)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login nahi ho paya')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow"
        noValidate
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            className="w-full rounded border px-3 py-2"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded border px-3 py-2"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-xs text-gray-500">
          Demo: admin@demo.com / admin123 ya user@demo.com / user123
        </p>
      </form>
    </div>
  )
}
