import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-100 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="font-sans font-black text-3xl tracking-tight text-white block hover:text-rose-400 transition-colors">
              NEXORA
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-normal">
              Compare smarter. Buy with confidence. The trusted peer-to-peer marketplace with built-in escrow.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/search" className="text-slate-300 hover:text-white transition-colors">
                  Discover Products
                </Link>
              </li>
              <li>
                <Link to="/search?compare=true" className="text-slate-300 hover:text-white transition-colors">
                  Compare Offers
                </Link>
              </li>
              <li>
                <Link to="/search?type=sellers" className="text-slate-300 hover:text-white transition-colors">
                  Verified Sellers
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-300 hover:text-white transition-colors">
                  Sell on Nexora
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Account & Support */}
          <div>
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-4">Portals & Account</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-300 hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/buyer/orders" className="text-slate-300 hover:text-white transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/buyer/wishlist" className="text-slate-300 hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust Statement */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-4">The Nexora Trust</h4>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Every transaction on Nexora is backed by escrow protection, Marketplace Credit verification, and post-delivery buyer confirmation.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                100% Escrow Protected
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            &copy; 2026 Nexora Marketplace. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-200 cursor-pointer">Escrow Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
