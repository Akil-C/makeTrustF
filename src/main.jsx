import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          gutter={10}
          containerClassName="!z-[99999]"
          toastOptions={{
            duration: 4000,
            className: 'nexora-themed-toast',
            style: {
              background: '#0F172A',
              color: '#F8FAFC',
              border: '1px solid rgba(51, 65, 85, 0.75)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: '600',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.01em',
              maxWidth: '440px',
            },
            success: {
              duration: 3800,
              iconTheme: {
                primary: '#10B981',
                secondary: '#0F172A',
              },
            },
            error: {
              duration: 4800,
              iconTheme: {
                primary: '#E11D48',
                secondary: '#0F172A',
              },
            },
            loading: {
              iconTheme: {
                primary: '#6366F1',
                secondary: '#0F172A',
              },
            },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
