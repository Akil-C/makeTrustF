import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Menu,
  X,
  ArrowUpRight,
  LogOut,
  LayoutDashboard,
  Coins,
  PlusCircle,
} from 'lucide-react'
import { formatCredits } from '../../utils/formatters'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, walletBalance, hasRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const isAdmin = hasRole('ADMIN')
  const isSeller = hasRole('SELLER')
  const isBuyer = !isAdmin && !isSeller

  const getDashboardRoute = () => {
    if (!user) return '/login'
    if (isAdmin) return '/admin/dashboard'
    if (isSeller) return '/seller/dashboard'
    return '/buyer/dashboard'
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navLinkClass = (path) =>
    `px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium tracking-normal transition-all ${
      isActive(path)
        ? 'text-slate-950 bg-slate-900/10 font-bold'
        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-900/5'
    }`

  return (
    <header className="sticky top-0 z-50 bg-[#F1F1ED]/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-colors duration-200">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 lg:gap-6">
        
        {/* Left: Brand Logo & Real-time Role Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 group transition-all"
            aria-label="Nexora Homepage"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-xs group-hover:bg-rose-600 transition-colors">
              N
            </div>
            <span className="font-sans font-black text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
              NEXORA
            </span>
          </Link>

          {/* Real-time Role Badge */}
          {isAuthenticated && (
            <div className="hidden sm:inline-flex items-center ml-1">
              {isAdmin && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-700 font-sans font-bold text-[11px] tracking-wide rounded-full border border-rose-200 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  ADMIN
                </span>
              )}
              {isSeller && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-sans font-bold text-[11px] tracking-wide rounded-full border border-emerald-200 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SELLER
                </span>
              )}
              {isBuyer && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 font-sans font-bold text-[11px] tracking-wide rounded-full border border-blue-200 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  BUYER
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center: Contextual Role Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center max-w-2xl">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/admin/users" className={navLinkClass('/admin/users')}>
                    Users
                  </Link>
                  <Link to="/admin/sellers" className={navLinkClass('/admin/sellers')}>
                    Sellers
                  </Link>
                  <Link to="/admin/kyc" className={navLinkClass('/admin/kyc')}>
                    KYC
                  </Link>
                  <Link to="/admin/products" className={navLinkClass('/admin/products')}>
                    Products
                  </Link>
                  <Link to="/admin/orders" className={navLinkClass('/admin/orders')}>
                    Orders
                  </Link>
                  <Link to="/admin/disputes" className={navLinkClass('/admin/disputes')}>
                    Disputes
                  </Link>
                  <Link to="/admin/credits" className={navLinkClass('/admin/credits')}>
                    Credits
                  </Link>
                </>
              )}
              {isSeller && (
                <>
                  <Link to="/seller/dashboard" className={navLinkClass('/seller/dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/seller/products" className={navLinkClass('/seller/products')}>
                    My Listings
                  </Link>
                  <Link
                    to="/seller/products/create"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/80 transition-all flex items-center gap-1 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Listing</span>
                  </Link>
                  <Link to="/seller/orders" className={navLinkClass('/seller/orders')}>
                    Orders
                  </Link>
                  <Link to="/seller/kyc" className={navLinkClass('/seller/kyc')}>
                    KYC
                  </Link>
                  <Link to="/seller/ai-insights" className={navLinkClass('/seller/ai-insights')}>
                    AI
                  </Link>
                  <Link to="/seller/analytics" className={navLinkClass('/seller/analytics')}>
                    Analytics
                  </Link>
                </>
              )}
              {isBuyer && (
                <>
                  <Link to="/buyer/dashboard" className={navLinkClass('/buyer/dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/buyer/orders" className={navLinkClass('/buyer/orders')}>
                    My Orders
                  </Link>
                  <Link to="/buyer/wishlist" className={navLinkClass('/buyer/wishlist')}>
                    Wishlist
                  </Link>
                  <Link to="/buyer/chat" className={navLinkClass('/buyer/chat')}>
                    Messages
                  </Link>
                  <Link to="/search" className={navLinkClass('/search')}>
                    Discover
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/search" className={navLinkClass('/search')}>
                Discover
              </Link>
              <Link to="/search?compare=true" className={navLinkClass('/search?compare=true')}>
                Compare Offers
              </Link>
              <Link to="/search?type=sellers" className={navLinkClass('/search?type=sellers')}>
                Verified Sellers
              </Link>
              <a
                href="/#how-it-works"
                className="px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-900/5 transition-all"
              >
                How It Works
              </a>
            </>
          )}
        </nav>

        {/* Right: Credits, User Dashboard & Auth CTAs */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Universal Credits Pill: 0 MC until login, actual balance when authenticated */}
          <Link
            to={
              isAuthenticated
                ? isAdmin
                  ? '/admin/credits'
                  : isSeller
                  ? '/seller/dashboard'
                  : '/buyer/dashboard'
                : '/login'
            }
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100/90 text-amber-900 border border-amber-300/80 rounded-lg text-xs font-bold transition-all shadow-xs"
            title={
              isAuthenticated
                ? `Active Wallet Balance: ${formatCredits(walletBalance || 0)}`
                : 'Marketplace Credits: 0 MC (Sign in to view your wallet balance)'
            }
          >
            <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-mono font-bold tracking-tight">
              {isAuthenticated ? formatCredits(walletBalance || 0) : '0 MC'}
            </span>
          </Link>

          {isAuthenticated ? (
            <>
              {/* User Dashboard Button */}
              <Link
                to={getDashboardRoute()}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:border-slate-800 text-slate-800 font-semibold transition-all flex items-center gap-1.5 text-xs shadow-xs"
                title="Account Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate max-w-[100px]">
                  {(user?.name || user?.displayName || user?.email || 'Account').split(' ')[0]}
                </span>
              </Link>

              {/* Exit / Sign Out Button */}
              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-medium transition-all flex items-center gap-1 text-xs shadow-xs"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Exit</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Explore Market CTA Button (visible on xl screens to maintain clean spacing) */}
          <Link
            to="/search"
            className="hidden xl:flex bg-slate-900 text-white hover:bg-rose-600 rounded-lg px-3.5 py-1.5 transition-all duration-200 items-center gap-1.5 text-xs font-semibold group shadow-xs"
          >
            <span>Explore</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile View: Credits + Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile Credits pill: 0 MC until login */}
          <Link
            to={isAuthenticated ? getDashboardRoute() : '/login'}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300/80 rounded-md text-[11px] font-mono font-bold"
            title={
              isAuthenticated
                ? `Active Wallet Balance: ${formatCredits(walletBalance || 0)}`
                : 'Marketplace Credits: 0 MC'
            }
          >
            <Coins className="w-3 h-3 text-amber-600 shrink-0" />
            <span>{isAuthenticated ? formatCredits(walletBalance || 0) : '0 MC'}</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-800 hover:text-slate-950 hover:bg-slate-200/60 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 top-16 bg-[#F1F1ED] z-50 flex flex-col justify-between p-5 border-t border-slate-200/80 overflow-y-auto">
          <div className="space-y-5">
            {/* User Session Bar in Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isAuthenticated ? `Signed in as ${user?.role || 'User'}` : 'Guest Menu'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-300/70">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>{isAuthenticated ? formatCredits(walletBalance || 0) : '0 MC'}</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 text-base font-sans font-medium">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <>
                      <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50 flex items-center justify-between">
                        <span>Admin Dashboard</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </Link>
                      <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        User Management
                      </Link>
                      <Link to="/admin/sellers" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        Seller Registry
                      </Link>
                      <Link to="/admin/kyc" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        KYC Queue
                      </Link>
                      <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        Product Moderation
                      </Link>
                      <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        Order Registry
                      </Link>
                      <Link to="/admin/disputes" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        Disputes Arbitration
                      </Link>
                      <Link to="/admin/credits" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        Credits & Economy
                      </Link>
                    </>
                  )}
                  {isSeller && (
                    <>
                      <Link to="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50 flex items-center justify-between">
                        <span>Seller Dashboard</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </Link>
                      <Link to="/seller/products" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        My Listings
                      </Link>
                      <Link to="/seller/products/create" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/60 flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4" /> Add New Listing
                      </Link>
                      <Link to="/seller/orders" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        Orders Management
                      </Link>
                      <Link to="/seller/kyc" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        KYC Verification
                      </Link>
                      <Link to="/seller/ai-insights" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        AI Seller Assistant
                      </Link>
                      <Link to="/seller/analytics" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        Store Analytics
                      </Link>
                    </>
                  )}
                  {isBuyer && (
                    <>
                      <Link to="/buyer/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50 flex items-center justify-between">
                        <span>Buyer Dashboard</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </Link>
                      <Link to="/buyer/orders" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        My Orders
                      </Link>
                      <Link to="/buyer/wishlist" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        Saved Wishlist
                      </Link>
                      <Link to="/buyer/chat" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        Messages & Inquiries
                      </Link>
                      <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                        Browse Marketplace
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50 flex items-center justify-between">
                    <span>Discover Products</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link to="/search?compare=true" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                    Compare Offers
                  </Link>
                  <Link to="/search?type=sellers" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                    Verified Sellers
                  </Link>
                  <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-200/50">
                    How Nexora Works
                  </a>
                </>
              )}
            </nav>
          </div>

          {/* Bottom Drawer CTAs */}
          <div className="space-y-3 pt-6 border-t border-slate-200/80">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-slate-900 text-white font-bold text-center py-3 rounded-lg block text-sm shadow-xs"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full border border-slate-300 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-medium text-center py-3 rounded-lg block text-sm transition-colors shadow-xs"
                >
                  Sign Out (Exit)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border border-slate-300 text-slate-800 hover:bg-slate-200/50 font-semibold text-center py-3 rounded-lg block text-sm shadow-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-center py-3 rounded-lg block text-sm shadow-xs"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
