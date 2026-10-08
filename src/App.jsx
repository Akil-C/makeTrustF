import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'

// ── Public Pages ──────────────────────────────────────────────────────────────
const HomePage        = lazy(() => import('./pages/public/HomePage'))
const LoginPage       = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage    = lazy(() => import('./pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ProductDetailPage  = lazy(() => import('./pages/public/ProductDetailPage'))
const SellerProfilePage  = lazy(() => import('./pages/public/SellerProfilePage'))
const SearchPage         = lazy(() => import('./pages/public/SearchPage'))
const MapSearchPage      = lazy(() => import('./pages/public/MapSearchPage'))

// ── Buyer Pages ───────────────────────────────────────────────────────────────
const BuyerDashboard  = lazy(() => import('./pages/buyer/BuyerDashboard'))
const BuyerOrders     = lazy(() => import('./pages/buyer/BuyerOrders'))
const BuyerWishlist   = lazy(() => import('./pages/buyer/BuyerWishlist'))
const BuyerChat       = lazy(() => import('./pages/buyer/BuyerChat'))
const CheckoutPage    = lazy(() => import('./pages/buyer/CheckoutPage'))

// ── Seller Pages ──────────────────────────────────────────────────────────────
const SellerDashboard    = lazy(() => import('./pages/seller/SellerDashboard'))
const SellerProducts     = lazy(() => import('./pages/seller/SellerProducts'))
const CreateProduct      = lazy(() => import('./pages/seller/CreateProduct'))
const EditProduct        = lazy(() => import('./pages/seller/EditProduct'))
const SellerOrders       = lazy(() => import('./pages/seller/SellerOrders'))
const SellerKYC          = lazy(() => import('./pages/seller/SellerKYC'))
const SellerAnalytics    = lazy(() => import('./pages/seller/SellerAnalytics'))
const SellerAIInsights   = lazy(() => import('./pages/seller/SellerAIInsights'))
const SellerChat         = lazy(() => import('./pages/seller/SellerChat'))

// ── Admin Pages ───────────────────────────────────────────────────────────────
const AdminDashboard  = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminUsers      = lazy(() => import('./pages/admin/AdminUsers'))
const AdminSellers    = lazy(() => import('./pages/admin/AdminSellers'))
const AdminKYC        = lazy(() => import('./pages/admin/AdminKYC'))
const AdminProducts   = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders     = lazy(() => import('./pages/admin/AdminOrders'))
const AdminReports    = lazy(() => import('./pages/admin/AdminReports'))
const AdminDisputes   = lazy(() => import('./pages/admin/AdminDisputes'))
const AdminAds        = lazy(() => import('./pages/admin/AdminAds'))
const AdminCredits    = lazy(() => import('./pages/admin/AdminCredits'))
const AdminAnalytics  = lazy(() => import('./pages/admin/AdminAnalytics'))
const AdminAuditLogs  = lazy(() => import('./pages/admin/AdminAuditLogs'))
const AdminSettings   = lazy(() => import('./pages/admin/AdminSettings'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner size="lg" />
  </div>
)

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public ─────────────────────────────────────────────────────── */}
          <Route path="/"                  element={<HomePage />} />
          <Route path="/login"             element={<LoginPage />} />
          <Route path="/register"          element={<RegisterPage />} />
          <Route path="/forgot-password"   element={<ForgotPasswordPage />} />
          <Route path="/products/:id"      element={<ProductDetailPage />} />
          <Route path="/sellers/:id"       element={<SellerProfilePage />} />
          <Route path="/search"            element={<SearchPage />} />
          <Route path="/map-search"        element={<MapSearchPage />} />

          {/* ── Buyer ──────────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute roles={['BUYER', 'SELLER', 'ADMIN']} />}>
            <Route path="/buyer/dashboard"          element={<BuyerDashboard />} />
            <Route path="/buyer/orders"             element={<BuyerOrders />} />
            <Route path="/buyer/wishlist"           element={<BuyerWishlist />} />
            <Route path="/buyer/chat"               element={<BuyerChat />} />
            <Route path="/checkout/:productId"      element={<CheckoutPage />} />
          </Route>

          {/* ── Seller ─────────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute roles={['SELLER', 'ADMIN']} />}>
            <Route path="/seller/dashboard"             element={<SellerDashboard />} />
            <Route path="/seller/products"              element={<SellerProducts />} />
            <Route path="/seller/products/create"       element={<CreateProduct />} />
            <Route path="/seller/products/:id/edit"     element={<EditProduct />} />
            <Route path="/seller/orders"                element={<SellerOrders />} />
            <Route path="/seller/kyc"                   element={<SellerKYC />} />
            <Route path="/seller/analytics"             element={<SellerAnalytics />} />
            <Route path="/seller/ai-insights"           element={<SellerAIInsights />} />
            <Route path="/seller/chat"                  element={<SellerChat />} />
          </Route>

          {/* ── Admin ──────────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin/dashboard"   element={<AdminDashboard />} />
            <Route path="/admin/users"       element={<AdminUsers />} />
            <Route path="/admin/sellers"     element={<AdminSellers />} />
            <Route path="/admin/kyc"         element={<AdminKYC />} />
            <Route path="/admin/products"    element={<AdminProducts />} />
            <Route path="/admin/orders"      element={<AdminOrders />} />
            <Route path="/admin/reports"     element={<AdminReports />} />
            <Route path="/admin/disputes"    element={<AdminDisputes />} />
            <Route path="/admin/ads"         element={<AdminAds />} />
            <Route path="/admin/credits"     element={<AdminCredits />} />
            <Route path="/admin/analytics"   element={<AdminAnalytics />} />
            <Route path="/admin/audit-logs"  element={<AdminAuditLogs />} />
            <Route path="/admin/settings"    element={<AdminSettings />} />
          </Route>

          {/* ── Fallback ───────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}
