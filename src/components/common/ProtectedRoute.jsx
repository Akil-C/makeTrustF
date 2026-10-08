import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

/**
 * Route guard that checks authentication and optional role restrictions.
 *
 * Usage:
 *   <Route element={<ProtectedRoute roles={['SELLER', 'ADMIN']} />}>
 *     <Route path="/seller/dashboard" element={<SellerDashboard />} />
 *   </Route>
 *
 * @param {{ roles?: string[] }} props
 */
export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    // Authenticated but wrong role → redirect to their home
    const roleHome = {
      BUYER:  '/buyer/dashboard',
      SELLER: '/seller/dashboard',
      ADMIN:  '/admin/dashboard',
    }
    return <Navigate to={roleHome[user?.role] ?? '/'} replace />
  }

  return <Outlet />
}
