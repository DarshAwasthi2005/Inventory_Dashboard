import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // In a production app this is where the error would be sent to a monitoring service
    console.error('Unhandled application error:', error, info.componentStack)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 p-6 text-center"
        >
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="max-w-md text-gray-600">
            An unexpected error occurred. Reloading the page usually resolves it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
