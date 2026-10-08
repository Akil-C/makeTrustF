import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Menu, X, ArrowUpRight, User, ShoppingBag, ShieldCheck, LogOut, LayoutDashboard, Heart } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const getDashboardRoute = () => {
    if (!user) return '/login'
    if (user.role === 'ADMIN' || user.roles?.includes('ADMIN')) return '/admin/dashboard'
    if (user.role === 'SELLER' || user.roles?.includes('SELLER')) return '/seller/dashboard'
    return '/buyer/dashboard'
  }

  return (
    <header className="sticky top-0 z-50 bg-plaster/90 backdrop-blur-md hairline-b transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bodoni font-bold text-2xl tracking-tighter text-near-black hover:opacity-80 transition-opacity">
            NEXORA
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/search" className="furniture-text text-near-black/70 hover:text-near-black transition-colors">
              DISCOVER
            </Link>
            <Link to="/search?compare=true" className="furniture-text text-near-black/70 hover:text-near-black transition-colors">
              COMPARE
            </Link>
            <Link to="/search?type=sellers" className="furniture-text text-near-black/70 hover:text-near-black transition-colors">
              SELLERS
            </Link>
            <a href="/#how-it-works" className="furniture-text text-near-black/70 hover:text-near-black transition-colors">
              HOW IT WORKS
            </a>
          </nav>
        </div>

        {/* Right: Auth & CTA */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to={getDashboardRoute()}
                className="furniture-text px-3 py-1.5 border border-near-black/20 hover:border-near-black text-near-black transition-all flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>DASHBOARD ({(user?.name || user?.displayName || user?.email || 'ACCOUNT').split(' ')[0].toUpperCase()})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="furniture-text text-near-black/60 hover:text-accent transition-colors flex items-center gap-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>EXIT</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="furniture-text text-near-black/70 hover:text-near-black transition-colors">
                SIGN IN
              </Link>
              <Link to="/register" className="furniture-text text-near-black/70 hover:text-near-black transition-colors">
                CREATE ACCOUNT
              </Link>
            </div>
          )}

          <Link
            to="/search"
            className="bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text px-4 py-2 transition-all duration-300 flex items-center gap-1 group"
          >
            <span>EXPLORE MARKETPLACE</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/search" className="furniture-text text-xs text-accent font-semibold pr-1">
            EXPLORE
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-near-black focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-plaster z-50 flex flex-col justify-between p-6 hairline-t overflow-y-auto">
          <div className="space-y-6">
            <div className="furniture-text text-accent tracking-widest text-xs">MENU</div>
            <nav className="flex flex-col gap-4 text-2xl font-bodoni">
              <Link
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-near-black/10 text-near-black hover:text-accent transition-colors"
              >
                DISCOVER PRODUCTS
              </Link>
              <Link
                to="/search?compare=true"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-near-black/10 text-near-black hover:text-accent transition-colors"
              >
                COMPARE OFFERS
              </Link>
              <Link
                to="/search?type=sellers"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-near-black/10 text-near-black hover:text-accent transition-colors"
              >
                VERIFIED SELLERS
              </Link>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-near-black/10 text-near-black hover:text-accent transition-colors"
              >
                HOW NEXORA WORKS
              </a>
            </nav>
          </div>

          <div className="space-y-4 pt-6 border-t border-near-black/10">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-near-black text-plaster text-center py-3 furniture-text block"
                >
                  GO TO DASHBOARD
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full border border-near-black text-near-black text-center py-3 furniture-text block"
                >
                  SIGN OUT
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border border-near-black text-near-black text-center py-3 furniture-text block"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-accent text-white text-center py-3 furniture-text block"
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
