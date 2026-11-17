import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../features/auth/useAuth'
import AuthField from '../features/auth/AuthField'
import AuthLayout from '../features/auth/AuthLayout'
import { AuthAlert, AuthSubmitButton } from '../features/auth/AuthControls'
import { formVariants, itemVariants } from '../features/auth/authMotion'
import { registerSchema, type RegisterInput } from '../lib/authSchemas'

export default function RegisterPage() {
  const { user, register: registerAccount } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  // Already signed in: skip the sign-up page
  if (user) return <Navigate to="/dashboard" replace />

  async function onSubmit(values: RegisterInput) {
    setServerError('')
    try {
      await registerAccount({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'Unable to create the account. Please try again.',
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
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set up your account to start managing inventory.
          </p>
        </motion.div>

        <AuthField
          id="name"
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />

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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <motion.p variants={itemVariants} className="-mt-2 text-xs text-gray-500">
          At least 8 characters, including a letter and a number.
        </motion.p>

        <AuthField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <AuthAlert message={serverError} />

        <AuthSubmitButton
          loading={isSubmitting}
          idleLabel="Create account"
          busyLabel="Creating account..."
        />

        <motion.p variants={itemVariants} className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Login
          </Link>
        </motion.p>
      </motion.form>
    </AuthLayout>
  )
}
