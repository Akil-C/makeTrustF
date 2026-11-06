import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  ShieldCheck,
  Lock,
  X,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Scale,
} from 'lucide-react'

export default function Footer() {
  const [modalTopic, setModalTopic] = useState(null) // 'terms' | 'escrow' | 'privacy' | null

  return (
    <footer className="bg-slate-950 text-slate-100 pt-16 pb-12 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="font-sans font-black text-3xl tracking-tight text-white block hover:text-rose-400 transition-colors">
              NEXORA
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-normal">
              Compare smarter. Buy with confidence. The trusted peer-to-peer marketplace with built-in financial escrow and verified sellers.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-rose-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Escrow Protected
              </span>
            </div>
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

          {/* Col 3: Account & Portals */}
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
                  Track Orders & Escrow
                </Link>
              </li>
              <li>
                <Link to="/buyer/wishlist" className="text-slate-300 hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust Policies & Service Guarantees (Interactive Detail Cards) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-4">Trust & Legal Guarantees</h4>
            <div className="space-y-2.5 text-xs">
              {/* Card 1: Terms & Conditions */}
              <button
                type="button"
                onClick={() => setModalTopic('terms')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-200 block group-hover:text-white">Terms of Service</span>
                    <span className="text-[10px] text-slate-400">Authentic goods & rules</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Card 2: Escrow Guarantee */}
              <button
                type="button"
                onClick={() => setModalTopic('escrow')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-700/60 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-200 block group-hover:text-white">Escrow Guarantee</span>
                    <span className="text-[10px] text-slate-400">Funds held until inspection</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Card 3: Privacy Policy */}
              <button
                type="button"
                onClick={() => setModalTopic('privacy')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-200 block group-hover:text-white">Privacy Policy</span>
                    <span className="text-[10px] text-slate-400">Encrypted & zero tracking</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with direct href links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            &copy; 2026 Nexora Marketplace. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-slate-400 text-xs">
            <Link
              to="/terms"
              className="hover:text-white transition-colors underline decoration-slate-700 hover:decoration-white"
            >
              Terms of Service
            </Link>
            <Link
              to="/escrow-guarantee"
              className="hover:text-white transition-colors underline decoration-slate-700 hover:decoration-white"
            >
              Escrow Guarantee
            </Link>
            <Link
              to="/privacy"
              className="hover:text-white transition-colors underline decoration-slate-700 hover:decoration-white"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE DETAIL CARD MODAL                                             */}
      {/* ========================================================================= */}
      {modalTopic && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 font-sans">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                {modalTopic === 'terms' && <FileText className="w-5 h-5 text-rose-600" />}
                {modalTopic === 'escrow' && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
                {modalTopic === 'privacy' && <Lock className="w-5 h-5 text-blue-600" />}
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                    {modalTopic === 'terms' && 'Terms of Service & Marketplace Conditions'}
                    {modalTopic === 'escrow' && '100% Escrow Guarantee & Financial Protection'}
                    {modalTopic === 'privacy' && 'Privacy Policy & Data Security'}
                  </h3>
                  <span className="text-[11px] text-slate-500">Nexora Trust & Verification Framework</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalTopic(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                aria-label="Close modal card"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {modalTopic === 'terms' && (
                <>
                  <div className="p-3.5 bg-rose-50/80 rounded-xl border border-rose-200/80 text-rose-900 text-xs font-semibold">
                    Nexora connects authentic buyers and verified sellers under a strict financial escrow contract. Every transaction is legally protected.
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">1. Authentic Goods Guarantee</h4>
                      <p>Sellers must upload real, unedited photos of the actual item. Counterfeit or misdescribed products are strictly prohibited and result in permanent seller ban and total buyer refund.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">2. 48-Hour Buyer Inspection Window</h4>
                      <p>Buyers have 48 hours following delivery or handover to inspect the item. Funds remain safely held in escrow until the buyer confirms delivery satisfaction.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">3. Credits Currency (100 Credits = ₹100)</h4>
                      <p>All trades are conducted in Marketplace Credits at a 1:1 INR peg. A standard 2 Credit platform maintenance fee applies upon completed settlement.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">4. Prohibited Off-Platform Payments</h4>
                      <p>Any attempt to divert transactions outside of Nexora escrow (e.g. direct UPI or wire transfer requests) constitutes fraud and leads to immediate account deactivation.</p>
                    </div>
                  </div>
                </>
              )}

              {modalTopic === 'escrow' && (
                <>
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-semibold">
                    100% Reimbursement Guarantee: If your order is counterfeit, damaged, or not delivered, 100% of your credits are refunded to your wallet.
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">1. Atomic Purchase Hold</h4>
                      <p>When you click "Buy Now", your credits are isolated in a double-entry hold ledger. The seller never touches your funds until you receive and verify the item.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">2. Delivery & GPS Verification</h4>
                      <p>All listings record verified municipal GPS coordinates to prevent phantom orders. Dispatch is confirmed with real-time tracking timestamps.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">3. Final Release on Your Approval</h4>
                      <p>You inspect the item in person. You tap "Confirm Delivery" only when completely satisfied. The seller is then paid securely with zero chargeback risk.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">4. Impartial Admin Dispute Arbitration</h4>
                      <p>If an issue arises, filing a dispute instantly freezes escrow funds until Nexora moderators review photo evidence and enforce resolution.</p>
                    </div>
                  </div>
                </>
              )}

              {modalTopic === 'privacy' && (
                <>
                  <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-xs font-semibold">
                    Zero Data Selling: We never sell your personal information or phone numbers to third-party ad brokers.
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">1. Cryptographic Security</h4>
                      <p>Passwords are salted and hashed with BCrypt (10 rounds). User sessions are secured with 256-bit HMAC-SHA256 stateless tokens with 15-minute expirations.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">2. KYC Identity Protection</h4>
                      <p>Seller identity documents (government ID, selfie verification) are isolated in private cloud storage and audited solely for compliance and fraud prevention.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">3. Approximate Location Privacy</h4>
                      <p>To preserve your home privacy, marketplace search queries use approximate municipal radius centroids rather than exact residential coordinates.</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer with Href Link */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
              <Link
                to={modalTopic === 'terms' ? '/terms' : modalTopic === 'escrow' ? '/escrow-guarantee' : '/privacy'}
                onClick={() => setModalTopic(null)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <span>Read Full Document Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setModalTopic(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
