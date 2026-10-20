import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Menu,
  X,
  ArrowUpRight,
  LogOut,
  LayoutDashboard,
  Coins,
  ShieldAlert,
  ShoppingBag,
  Store,
  Heart,
  MessageSquare,
  Package,
  PlusCircle,
  Users,
  CheckCircle,
} from 'lucide-react'
import { formatCredits } from '../../utils/formatters'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, walletBalance, hasRole } = useAuth()
  const navigate = useNavigate()

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

  return (
    <header className="sticky top-0 z-50 bg-[#F1F1ED]/95 backdrop-blur-md border-b border-[#070707]/15 transition-colors duration-300">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Role Badge */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-serif font-black text-2xl sm:text-3xl tracking-tighter text-[#070707] hover:opacity-85 transition-opacity"
          >
            NEXORA
          </Link>

          {/* Real-time Role Badge */}
          {isAuthenticated && (
            <div className="hidden sm:inline-flex items-center">
              {isAdmin && (
                <span className="px-2 py-0.5 bg-[#EF6F79]/15 text-[#EF6F79] font-mono font-bold text-[10px] tracking-widest border border-[#EF6F79]/30">
                  ADMIN
                </span>
              )}
              {isSeller && (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] tracking-widest border border-emerald-300">
                  SELLER
                </span>
              )}
              {isBuyer && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold text-[10px] tracking-widest border border-blue-200">
                  BUYER
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center: Contextual Role Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-mono font-semibold tracking-wider">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="text-[#070707]/75 hover:text-[#EF6F79] transition-colors">
                    DASHBOARD
                  </Link>
                  <Link to="/admin/users" className="text-[#070707]/75 hover:text-[#EF6F79] transition-colors">
                    USERS
                  </Link>
                  <Link to="/admin/sellers" className="text-[#070707]/75 hover:text-[#EF6F79] transition-colors">
                    SELLERS
                  </Link>
                  <Link to="/admin/kyc" className="text-[#070707]/75 hover:text-[#EF6F79] transition-colors">
                    KYC QUEUE
                  </Link>
                  <Link to="/admin/products" className="text-[#070707]/75 hover:text-[#EF6F79] transition-colors">
                    PRODUCTS
                  </Link>
                  <Link to="/admin/orders" className="text-[#070707]/75 hover:text-[#EF6F79] transition-colors">
                    ORDERS
                  </Link>
                  <Link to="/admin/disputes" className="text-[#070707]/75 hover:text-[#EF6F79] transition-colors">
                    DISPUTES
                  </Link>
                  <Link to="/admin/credits" className="text-[#070707]/75 hover:text-[#EF6F79] transition-colors">
                    CREDITS
                  </Link>
                </>
              )}
              {isSeller && (
                <>
                  <Link to="/seller/dashboard" className="text-[#070707]/75 hover:text-[#070707] transition-colors">
                    DASHBOARD
                  </Link>
                  <Link to="/seller/products" className="text-[#070707]/75 hover:text-[#070707] transition-colors">
                    MY LISTINGS
                  </Link>
                  <Link to="/seller/products/create" className="text-emerald-700 font-bold hover:text-emerald-900 transition-colors flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" /> ADD ITEM
                  </Link>
                  <Link to="/seller/orders" className="text-[#070707]/75 hover:text-[#070707] transition-colors">
                    ORDERS
                  </Link>
                  <Link to="/seller/kyc" className="text-[#070707]/75 hover:text-[#070707] transition-colors">
                    KYC
                  </Link>
                  <Link to="/seller/ai-insights" className="text-[#070707]/75 hover:text-[#070707] transition-colors">
                    AI INSIGHTS
                  </Link>
                  <Link to="/seller/analytics" className="text-[#070707]/75 hover:text-[#070707] transition-colors">
                    ANALYTICS
                  </Link>
                </>
              )}
              {isBuyer && (
                <>
                  <Link to="/buyer/dashboard" className="text-[#070707]/75 hover:text-[#070707] transition-colors">
                    DASHBOARD
                  </Link>
                  <Link to="/buyer/orders" className="text-[#070707]/75 hover:text-[#070707] transition-colors">
                    MY ORDERS
                  </Link>
                  <Link to="/buyer/wishlist" className="text-[#070707]/75 hover:text-[#070707] transition-colors">
                    WISHLIST
                  </Link>
                  <Link to="/buyer/chat" className="text-[#070707]/75 hover:text-[#070707] transition-colors">
                    MESSAGES
                  </Link>
                  <Link to="/search" className="text-[#070707]/75 hover:text-[#070707] transition-colors">
                    DISCOVER
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/search" className="text-[#070707]/70 hover:text-[#070707] transition-colors">
                DISCOVER
              </Link>
              <Link to="/search?compare=true" className="text-[#070707]/70 hover:text-[#070707] transition-colors">
                COMPARE
              </Link>
              <Link to="/search?type=sellers" className="text-[#070707]/70 hover:text-[#070707] transition-colors">
                SELLERS
              </Link>
              <a href="/#how-it-works" className="text-[#070707]/70 hover:text-[#070707] transition-colors">
                HOW IT WORKS
              </a>
            </>
          )}
        </nav>

        {/* Right: Wallet Balance, Session & CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Live Wallet Balance */}
              <Link
                to={isAdmin ? '/admin/credits' : isSeller ? '/seller/dashboard' : '/buyer/dashboard'}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 font-mono text-xs font-bold transition-colors"
                title="Live Wallet Balance (MarketTrust Credits)"
              >
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>{formatCredits(walletBalance)}</span>
              </Link>

              {/* User Dashboard Link */}
              <Link
                to={getDashboardRoute()}
                className="furniture-text px-3 py-1.5 border border-[#070707]/20 hover:border-[#070707] text-[#070707] transition-all flex items-center gap-1.5 text-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="font-mono">{(user?.name || user?.displayName || user?.email || 'ACCOUNT').split(' ')[0].toUpperCase()}</span>
              </Link>

              {/* One-click Logout Button */}
              <button
                onClick={handleLogout}
                className="furniture-text px-3 py-1.5 border border-[#070707]/20 hover:border-[#EF6F79] hover:text-[#EF6F79] text-[#070707]/70 transition-colors flex items-center gap-1.5 text-xs"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>EXIT</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="furniture-text text-xs text-[#070707]/75 hover:text-[#070707] transition-colors px-2 py-1"
              >
                SIGN IN
              </Link>
              <Link
                to="/register"
                className="furniture-text text-xs bg-[#070707] text-[#F1F1ED] hover:bg-[#EF6F79] px-3.5 py-1.5 transition-colors"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          )}

          <Link
            to="/search"
            className="hidden md:flex bg-[#070707] text-[#F1F1ED] hover:bg-[#EF6F79] hover:text-white furniture-text px-3.5 py-1.5 transition-all duration-300 items-center gap-1 text-xs group"
          >
            <span>MARKET</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          {isAuthenticated && (
            <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-500/20 px-2 py-1 border border-amber-500/30">
              {formatCredits(walletBalance)}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#070707] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 top-16 bg-[#F1F1ED] z-50 flex flex-col justify-between p-6 border-t border-[#070707]/10 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#070707]/10">
              <span className="furniture-text text-[#EF6F79] tracking-widest text-xs">
                {isAuthenticated ? `LOGGED IN AS ${user?.role || 'USER'}` : 'MENU'}
              </span>
              {isAuthenticated && (
                <span className="font-mono text-xs font-bold text-amber-800">
                  {formatCredits(walletBalance)}
                </span>
              )}
            </div>

            <nav className="flex flex-col gap-3 font-serif text-lg">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <>
                      <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Admin Dashboard
                      </Link>
                      <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        User Management
                      </Link>
                      <Link to="/admin/sellers" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Seller Registry
                      </Link>
                      <Link to="/admin/kyc" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        KYC Queue
                      </Link>
                      <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Product Moderation
                      </Link>
                      <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Order Registry
                      </Link>
                      <Link to="/admin/disputes" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Disputes
                      </Link>
                      <Link to="/admin/credits" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Credits & Economy
                      </Link>
                    </>
                  )}
                  {isSeller && (
                    <>
                      <Link to="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Seller Dashboard
                      </Link>
                      <Link to="/seller/products" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        My Listings
                      </Link>
                      <Link to="/seller/products/create" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-emerald-700 font-bold">
                        + Add New Listing
                      </Link>
                      <Link to="/seller/orders" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Orders Management
                      </Link>
                      <Link to="/seller/kyc" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        KYC Verification
                      </Link>
                      <Link to="/seller/ai-insights" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        AI Insights
                      </Link>
                      <Link to="/seller/analytics" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Store Analytics
                      </Link>
                    </>
                  )}
                  {isBuyer && (
                    <>
                      <Link to="/buyer/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Buyer Dashboard
                      </Link>
                      <Link to="/buyer/orders" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        My Orders
                      </Link>
                      <Link to="/buyer/wishlist" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Saved Wishlist
                      </Link>
                      <Link to="/buyer/chat" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Messages & Inquiries
                      </Link>
                      <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#070707]/10 text-[#070707]">
                        Browse Marketplace
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#070707]/10 text-[#070707]">
                    Discover Products
                  </Link>
                  <Link to="/search?compare=true" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#070707]/10 text-[#070707]">
                    Compare Offers
                  </Link>
                  <Link to="/search?type=sellers" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#070707]/10 text-[#070707]">
                    Verified Sellers
                  </Link>
                  <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#070707]/10 text-[#070707]">
                    How Nexora Works
                  </a>
                </>
              )}
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#070707]/10">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[#070707] text-[#F1F1ED] text-center py-3 furniture-text block text-xs"
                >
                  GO TO DASHBOARD
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full border border-[#070707] text-[#070707] hover:bg-[#EF6F79] hover:text-white hover:border-[#EF6F79] text-center py-3 furniture-text block text-xs transition-colors"
                >
                  SIGN OUT (EXIT)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border border-[#070707] text-[#070707] text-center py-3 furniture-text block text-xs"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#EF6F79] text-white text-center py-3 furniture-text block text-xs"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
