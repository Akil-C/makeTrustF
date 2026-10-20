import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'
import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Route guard that checks authentication and optional role restrictions.
 * Automatically wraps authenticated pages with persistent Navbar and Footer.
 *
 * @param {{ roles?: string[] }} props
 */
export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F4]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0 && !hasRole(roles)) {
    // Authenticated but wrong role → redirect to their home portal
    const primaryRole = (user?.role || (user?.roles && user.roles[0]) || '').replace(/^ROLE_/, '').toUpperCase()
    const roleHome = {
      BUYER:  '/buyer/dashboard',
      SELLER: '/seller/dashboard',
      ADMIN:  '/admin/dashboard',
    }
    return <Navigate to={roleHome[primaryRole] ?? '/'} replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F4] text-[#070707]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
