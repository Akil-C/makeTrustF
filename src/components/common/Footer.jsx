import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-near-black text-plaster pt-16 pb-12 hairline-t border-near-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 hairline-b border-plaster/10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="font-bodoni font-bold text-3xl tracking-tighter text-plaster block">
              NEXORA
            </Link>
            <p className="furniture-text text-plaster/60 leading-relaxed max-w-xs">
              COMPARE SMARTER. BUY WITH CONFIDENCE. THE TRUST-FIRST MARKETPLACE.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="furniture-text text-accent mb-4">MARKETPLACE</h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link to="/search" className="text-plaster/80 hover:text-white transition-colors">
                  Discover Products
                </Link>
              </li>
              <li>
                <Link to="/search?compare=true" className="text-plaster/80 hover:text-white transition-colors">
                  Compare Offers
                </Link>
              </li>
              <li>
                <Link to="/search?type=sellers" className="text-plaster/80 hover:text-white transition-colors">
                  Verified Sellers
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-plaster/80 hover:text-white transition-colors">
                  Sell on Nexora
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Account & Support */}
          <div>
            <h4 className="furniture-text text-accent mb-4">ACCOUNT & PORTAL</h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link to="/login" className="text-plaster/80 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-plaster/80 hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/buyer/orders" className="text-plaster/80 hover:text-white transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/buyer/wishlist" className="text-plaster/80 hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust Statement */}
          <div className="space-y-3">
            <h4 className="furniture-text text-accent mb-4">THE NEXORA TRUST</h4>
            <p className="text-xs text-plaster/60 leading-relaxed">
              Every transaction on Nexora is backed by escrow protection, Marketplace Credit verification, and post-delivery buyer confirmation.
            </p>
            <div className="pt-2">
              <span className="font-caveat text-accent text-xl rotate-[-2deg] inline-block">
                your choice
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-plaster/50">
          <div>
            &copy; 2026 NEXORA. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6 furniture-text">
            <span>TERMS OF SERVICE</span>
            <span>PRIVACY POLICY</span>
            <span>ESCROW GUARANTEE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
