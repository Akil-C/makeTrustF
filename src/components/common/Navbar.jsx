import { useState, useEffect, useRef } from 'react'
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
  Bell,
  CheckCheck,
} from 'lucide-react'
import { formatCredits } from '../../utils/formatters'
import notificationService from '../../services/notificationService'
import { prewarmServer } from '../../services/api'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const notifRef = useRef(null)

  const { user, isAuthenticated, logout, walletBalance, hasRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Close mobile drawer upon route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setNotifOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileMenuOpen(false)
    setNotifOpen(false)
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

  // Load unread notification count
  useEffect(() => {
    if (!isAuthenticated) return

    let isMounted = true
    const fetchNotifs = async () => {
      try {
        const countRes = await notificationService.getUnreadCount()
        if (isMounted) setUnreadCount(countRes.data?.count || 0)

        const listRes = await notificationService.getNotifications({ size: 8 })
        const list = listRes.data?.content || listRes.data || []
        if (isMounted) setNotifications(list)
      } catch {
        // quiet
      }
    }

    fetchNotifs()
    const timer = setInterval(fetchNotifs, 15000)
    return () => {
      isMounted = false
      clearInterval(timer)
    }
  }, [isAuthenticated])

  // Click outside to close notification popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch {
      setUnreadCount(0)
    }
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navLinkClass = (path) =>
    `h-8 px-2 xl:px-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center justify-center whitespace-nowrap shrink-0 ${
      isActive(path)
        ? 'text-slate-950 bg-slate-900/10 font-bold'
        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-900/5'
    }`

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-colors duration-200 font-sans">
      {/* Primary Top Bar - Exact max-w-7xl alignment with page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        
        {/* Left: Brand Logo & Role Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-all"
            aria-label="Nexora Homepage"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-xs group-hover:bg-rose-600 transition-colors shrink-0">
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
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-700 font-bold text-[11px] tracking-wide rounded-full border border-rose-200 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  ADMIN
                </span>
              )}
              {isSeller && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[11px] tracking-wide rounded-full border border-emerald-200 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SELLER
                </span>
              )}
              {isBuyer && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[11px] tracking-wide rounded-full border border-blue-200 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  BUYER
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center: Contextual Role Navigation Links (Desktop: lg screens and up) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center min-w-0 px-2">
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
                    Listings
                  </Link>
                  <Link to="/seller/orders" className={navLinkClass('/seller/orders')}>
                    Orders
                  </Link>
                  <Link to="/seller/kyc" className={navLinkClass('/seller/kyc')}>
                    KYC
                  </Link>
                  <Link to="/seller/chat" className={navLinkClass('/seller/chat')}>
                    Messages
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
                className="h-8 px-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-900/5 transition-all flex items-center justify-center shrink-0"
              >
                How It Works
              </a>
            </>
          )}
        </nav>

        {/* Right: Credits, Notifications, User Dashboard & Auth CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Universal Credits Pill: 100 Credits = ₹100 */}
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
            className="flex items-center gap-1.5 h-9 px-2.5 sm:px-3 bg-amber-50 hover:bg-amber-100/90 text-amber-900 border border-amber-300/80 rounded-lg text-xs font-bold transition-all shadow-xs"
            title={
              isAuthenticated
                ? `Active Wallet Balance: ₹${(walletBalance || 0).toLocaleString('en-IN')} (${(walletBalance || 0).toLocaleString('en-IN')} Credits) — 100 Credits = ₹100`
                : 'Marketplace Wallet: 100 Credits = ₹100 (1 Credit = ₹1 INR)'
            }
          >
            <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-mono font-bold tracking-tight">
              {isAuthenticated ? `₹${(walletBalance || 0).toLocaleString('en-IN')}` : '₹0'}
            </span>
            <span className="hidden sm:inline text-[11px] text-amber-700/80 font-mono font-normal">
              ({isAuthenticated ? `${(walletBalance || 0).toLocaleString('en-IN')} Cr` : '0 Cr'})
            </span>
          </Link>

          {/* Real-time Notification Popover Button (Authenticated) */}
          {isAuthenticated && (
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 hover:border-slate-800 bg-white text-slate-700 transition-colors shadow-xs"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Popover Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        No new notifications at this time.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 transition-colors ${
                            !n.isRead ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-xs text-slate-900 block truncate">{n.title}</span>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Desktop User Account Dashboard & Exit Actions */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to={getDashboardRoute()}
                className="h-9 px-3 rounded-lg border border-slate-200 hover:border-slate-800 bg-white text-slate-800 font-semibold transition-all flex items-center gap-1.5 text-xs shadow-xs"
                title="Account Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate max-w-[95px]">
                  {(user?.name || user?.displayName || user?.email || 'Account').split(' ')[0]}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="h-9 px-2.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-medium transition-all flex items-center gap-1 text-xs shadow-xs"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/login"
                onMouseEnter={() => prewarmServer()}
                onTouchStart={() => prewarmServer()}
                className="h-9 text-xs font-semibold text-slate-700 hover:text-slate-950 px-3 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onMouseEnter={() => prewarmServer()}
                onTouchStart={() => prewarmServer()}
                className="h-9 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-3.5 rounded-lg flex items-center justify-center transition-colors shadow-xs"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Explore Market CTA Button (Large screens) */}
          <Link
            to="/search"
            className="hidden xl:flex h-9 bg-slate-900 text-white hover:bg-rose-600 rounded-lg px-3.5 transition-all duration-200 items-center gap-1.5 text-xs font-semibold group shadow-xs shrink-0"
          >
            <span>Explore</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Responsive Hamburger Toggle Button: Displays whenever desktop nav is hidden */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 flex items-center justify-center text-slate-800 hover:text-slate-950 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors focus:outline-none shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white/98 backdrop-blur-xl z-50 flex flex-col justify-between p-5 border-t border-slate-200/90 shadow-xl overflow-y-auto">
          <div className="space-y-5">
            {/* User Session Bar in Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/90">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isAuthenticated ? `Signed in as ${user?.role || 'User'}` : 'Guest Menu'}
                </span>
                {isAuthenticated && (
                  <span className="text-xs font-bold text-slate-800">
                    ({(user?.name || user?.email || 'User').split(' ')[0]})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300/70">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>{isAuthenticated ? `₹${(walletBalance || 0).toLocaleString('en-IN')}` : '₹0'}</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 text-base font-sans font-medium">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <>
                      <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100 flex items-center justify-between">
                        <span>Admin Dashboard</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </Link>
                      <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        User Management
                      </Link>
                      <Link to="/admin/sellers" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        Seller Registry
                      </Link>
                      <Link to="/admin/kyc" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        KYC Queue
                      </Link>
                      <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        Product Moderation
                      </Link>
                      <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        Order Registry
                      </Link>
                      <Link to="/admin/disputes" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        Disputes Arbitration
                      </Link>
                      <Link to="/admin/credits" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        Credits & Economy
                      </Link>
                    </>
                  )}
                  {isSeller && (
                    <>
                      <Link to="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100 flex items-center justify-between">
                        <span>Seller Dashboard</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </Link>
                      <Link to="/seller/products" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        My Listings
                      </Link>
                      <Link to="/seller/products/create" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4" /> Add New Listing
                      </Link>
                      <Link to="/seller/orders" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        Orders Management
                      </Link>
                      <Link to="/seller/kyc" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        KYC Verification
                      </Link>
                      <Link to="/seller/chat" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        Messages & Dialogues
                      </Link>
                      <Link to="/seller/ai-insights" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        AI Seller Assistant
                      </Link>
                      <Link to="/seller/analytics" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        Store Analytics
                      </Link>
                    </>
                  )}
                  {isBuyer && (
                    <>
                      <Link to="/buyer/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100 flex items-center justify-between">
                        <span>Buyer Dashboard</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </Link>
                      <Link to="/buyer/orders" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        My Orders
                      </Link>
                      <Link to="/buyer/wishlist" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        Saved Wishlist
                      </Link>
                      <Link to="/buyer/chat" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        Messages & Inquiries
                      </Link>
                      <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                        Browse Marketplace
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100 flex items-center justify-between">
                    <span>Discover Products</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link to="/search?compare=true" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                    Compare Offers
                  </Link>
                  <Link to="/search?type=sellers" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                    Verified Sellers
                  </Link>
                  <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-slate-800 hover:bg-slate-100">
                    How Nexora Works
                  </a>
                </>
              )}
            </nav>
          </div>

          {/* Bottom Drawer CTAs */}
          <div className="space-y-3 pt-6 border-t border-slate-200/90">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 bg-slate-900 text-white font-bold rounded-lg flex items-center justify-center text-sm shadow-xs hover:bg-slate-800 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full h-11 border border-slate-300 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-medium rounded-lg flex items-center justify-center text-sm transition-colors shadow-xs"
                >
                  Sign Out (Exit)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onMouseEnter={() => prewarmServer()}
                  onTouchStart={() => prewarmServer()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-11 border border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold rounded-lg flex items-center justify-center text-sm shadow-xs transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onMouseEnter={() => prewarmServer()}
                  onTouchStart={() => prewarmServer()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-11 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg flex items-center justify-center text-sm shadow-xs transition-colors"
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
