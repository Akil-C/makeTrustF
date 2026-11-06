import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Compass,
  Package,
  Store,
  ShieldCheck,
  Home,
  ArrowLeft,
  Search,
  AlertTriangle,
  HelpCircle,
  FileText,
} from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    } else {
      navigate('/search')
    }
  }

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between font-sans page-swift">
      <Navbar />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center space-y-10">
        <DemoDisclaimer className="w-full max-w-2xl" />

        {/* 404 Visual & Status Badge */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold tracking-wider uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>HTTP 404 • ROUTE UNRESOLVED</span>
          </div>

          <div className="relative select-none py-2">
            <span className="text-8xl sm:text-9xl font-black text-slate-900 tracking-tighter block leading-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-[14rem] sm:text-[18rem] font-serif font-black text-slate-900">
                N
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Listing, Portal, or Page Not Found
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            The requested link may have moved, expired, or does not exist on Nexora's verified marketplace network. Your wallet credits and escrow balances remain safely held.
          </p>
        </div>

        {/* Interactive Search Bar */}
        <div className="w-full max-w-xl">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-white rounded-2xl border border-slate-300 hover:border-slate-400 focus-within:border-slate-900 shadow-md transition-all p-1.5"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verified products, categories, or merchants..."
              className="w-full px-3 py-2.5 text-sm bg-transparent outline-none text-slate-900 placeholder-slate-400 font-medium"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition-colors shrink-0 shadow-xs"
            >
              Search
            </button>
          </form>
        </div>

        {/* Quick Navigation Cards */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/search"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-900 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                Marketplace Catalog
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Discover thousands of verified electronics, fashion, and hardware listings.
              </p>
            </div>
          </Link>

          <Link
            to="/buyer/orders"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-900 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                Orders & Escrow Vault
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Inspect active deliveries, escrow status, and seller dispatch updates.
              </p>
            </div>
          </Link>

          <Link
            to="/seller/dashboard"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-900 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors">
                Merchant Operations
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Access seller dashboard, upload new listings, and manage sales analytics.
              </p>
            </div>
          </Link>

          <Link
            to="/escrow-guarantee"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-900 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
                Escrow Guarantee
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Learn how Nexora protects every transaction with milestone multi-sig security.
              </p>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition-colors flex items-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <button
            type="button"
            onClick={handleGoBack}
            className="px-6 py-3 rounded-xl border border-slate-300 hover:border-slate-900 bg-white text-slate-800 font-bold text-xs tracking-wide transition-colors flex items-center gap-2 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back One Step</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
