import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import './index.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './features/auth/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {/* "user" disables transform animations when the OS requests reduced motion */}
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  </StrictMode>,
)
