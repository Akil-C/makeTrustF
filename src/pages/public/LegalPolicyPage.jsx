import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  FileText,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Coins,
  ChevronRight,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

export default function LegalPolicyPage() {
  const location = useLocation()

  // Determine initial active tab based on pathname
  const getInitialTab = () => {
    if (location.pathname.includes('privacy')) return 'privacy'
    if (location.pathname.includes('escrow') || location.pathname.includes('guarantee')) return 'escrow'
    return 'terms'
  }

  const [activeTab, setActiveTab] = useState(getInitialTab)

  useEffect(() => {
    setActiveTab(getInitialTab())
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between font-sans page-swift">
      <Navbar />

      <main className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8 flex-1">
        <DemoDisclaimer />

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold uppercase tracking-wider">
            {activeTab === 'terms' ? 'Terms of Service' : activeTab === 'escrow' ? 'Escrow Guarantee' : 'Privacy Policy'}
          </span>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200">
              <Scale className="w-3.5 h-3.5 text-rose-600" />
              <span>NEXORA LEGAL & GOVERNANCE FRAMEWORK</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Effective Date: November 2026 • Version 2.4
            </span>
          </div>

          <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            Trust, Terms & Protection Policies
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Nexora is engineered around financial security, verified identities, and decentralized physical escrow.
            Review our detailed operating conditions, buyer escrow guarantee, and cryptographic data protection policies below.
          </p>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'terms'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Terms of Service</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('escrow')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'escrow'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>100% Escrow Guarantee</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'privacy'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Privacy Policy</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TERMS OF SERVICE                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'terms' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-slate-800" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Nexora Marketplace Terms & Service Conditions</h2>
                  <p className="text-xs text-slate-500">Binding guidelines governing transactions, buyer and seller conduct, and platform moderation.</p>
                </div>
              </div>

              {/* Clause 1 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Scope of Service & Marketplace Intermediary</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
                  Nexora provides a peer-to-peer technology infrastructure that allows authenticated buyers and verified sellers to discover products, negotiate offers, arrange local or regional delivery, and execute payments via the Nexora Escrow Ledger. Nexora acts as an independent financial escrow intermediary to guarantee mutual delivery satisfaction.
                </p>
              </div>

              {/* Clause 2 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Seller Obligations & Authentic Listing Standards</span>
                </h3>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7 space-y-2">
                  <p>When creating a product listing, sellers represent and warrant that:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>All photographs uploaded represent the actual physical item in the seller's possession. Stock illustrations or misleading media are prohibited.</li>
                    <li>The item's cosmetic condition, specifications, brand, and faults are truthfully documented.</li>
                    <li>All products are 100% authentic; counterfeit goods, unauthorized replicas, or illegal items incur immediate account termination and forfeiture of funds.</li>
                    <li>Sellers must ship or prepare items for physical handover within 48 hours of order confirmation.</li>
                  </ul>
                </div>
              </div>

              {/* Clause 3 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Buyer Responsibilities & Inspection Windows</span>
                </h3>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7 space-y-2">
                  <p>Buyers agree to inspect items immediately upon delivery or meet-up handover. Buyers enjoy a mandatory <strong>48-hour inspection protection window</strong>:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>If the item is verified as authentic and matching description, the buyer clicks <em>Confirm Delivery</em> to release funds to the seller.</li>
                    <li>If the item is defective, counterfeit, or misrepresented, the buyer must immediately initiate a dispute within the 48-hour window to freeze escrow release.</li>
                  </ul>
                </div>
              </div>

              {/* Clause 4 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">4</span>
                  <span>Marketplace Credits & Platform Economy</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
                  All commerce transactions on Nexora are settled in Nexora Marketplace Credits pegged at a fixed 1:1 ratio: <strong>100 Credits = ₹100 INR</strong>. Credits can be topped up via authorized payment gateways and withdrawn by verified sellers upon KYC approval. A flat 2 Credit platform maintenance fee is deducted upon completed escrow settlement.
                </p>
              </div>

              {/* Clause 5 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">5</span>
                  <span>Zero-Tolerance Anti-Fraud & Off-Platform Evasion</span>
                </h3>
                <div className="text-xs sm:text-sm text-slate-700 bg-rose-50/70 p-4 rounded-xl border border-rose-200/90 leading-relaxed ml-7 space-y-2">
                  <p className="font-bold text-rose-900">
                    Off-Platform Payment Evasion Strictly Prohibited:
                  </p>
                  <p>
                    Attempting to bypass the Nexora Escrow ledger by requesting direct WhatsApp payments, bank transfers, UPI transfers, or direct cash transfers forfeits all escrow protection and triggers automated anti-fraud account suspension. Nexora chat messages are audited with automated pattern recognition to protect buyers from scam operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ESCROW GUARANTEE                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'escrow' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">The Nexora 100% Escrow Guarantee</h2>
                  <p className="text-xs text-slate-500">Every credit is locked in cryptographic escrow until you physically inspect and approve your order.</p>
                </div>
              </div>

              {/* The 4-Step Escrow Timeline Visual */}
              <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/90 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  How Your Purchase Is Protected Step-by-Step
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">Step 01</span>
                    <h4 className="text-xs font-bold text-slate-900">Purchase Hold</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Your credits are locked in an atomic double-entry hold. The seller cannot withdraw or touch these funds.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">Step 02</span>
                    <h4 className="text-xs font-bold text-slate-900">Dispatch & Tracking</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Seller prepares and ships the item with verified GPS coordinates and secure tracking confirmation.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">Step 03</span>
                    <h4 className="text-xs font-bold text-slate-900">Physical Inspection</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      You receive the product and have 48 hours to test functionality, inspect cosmetics, and confirm authenticity.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-emerald-300 bg-emerald-50/30 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">Step 04</span>
                    <h4 className="text-xs font-bold text-emerald-900">Buyer Release</h4>
                    <p className="text-[11px] text-emerald-700 leading-snug">
                      Only after you tap "Confirm Delivery" are credits released to the seller. 100% risk-free.
                    </p>
                  </div>
                </div>
              </div>

              {/* Escrow Coverage Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">100% Reimbursement Coverage Scenarios</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-900">Item Not Received</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      If the seller fails to dispatch or proof of delivery is absent, 100% of held credits are refunded to your wallet immediately.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-900">Counterfeit or Fake Item</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      If an item is proven counterfeit or replica, the transaction is reversed, seller score is penalized, and you receive a full refund.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-900">Damaged / Not as Described</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      If the item has undisclosed physical defects or faulty internal electronics, dispute arbitration freezes payout until resolved.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seller Protection Note */}
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs sm:text-sm text-blue-900 space-y-1">
                <span className="font-bold block">Seller Protection Against Chargeback Fraud:</span>
                <p className="text-blue-800 leading-relaxed">
                  Legitimate sellers are also protected: once delivery is confirmed by the buyer, funds are guaranteed with zero risk of retroactive bank chargebacks or clawbacks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PRIVACY POLICY                                                     */}
        {/* ========================================================================= */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-slate-800" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Nexora Privacy & Cryptographic Governance</h2>
                  <p className="text-xs text-slate-500">How personal information, KYC identity credentials, and transaction records are encrypted and protected.</p>
                </div>
              </div>

              {/* Privacy Item 1 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>1. Data We Collect to Secure Marketplace Trade</span>
                </h3>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-4 space-y-2">
                  <p>To prevent fraud and maintain verified trust scores, Nexora collects:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>Account Credentials:</strong> Full name, verified email, and hashed password credentials (BCrypt 10 rounds).</li>
                    <li><strong>Seller KYC Verification:</strong> Government-issued identification (Aadhaar, Passport, Driving License) and live biometric selfie for seller registry authorization.</li>
                    <li><strong>Location Data:</strong> Approximate municipal coordinates (latitude/longitude) to calculate spherical Haversine distances for local product pickup. Exact street addresses are never publicly published.</li>
                    <li><strong>Chat Transcripts:</strong> Encrypted WebSocket message records audited strictly for scam pattern detection.</li>
                  </ul>
                </div>
              </div>

              {/* Privacy Item 2 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>2. How Your Data Is Secured</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-4">
                  All communications between your browser and Nexora are encrypted via TLS 1.3 / HTTPS. Session authentication utilizes 256-bit HMAC-SHA256 stateless JSON Web Tokens with short 15-minute expirations and database-backed refresh tokens capable of instant single-device revocation. KYC identity documents are segregated in private cloud storage and accessible only by vetted platform compliance officers.
                </p>
              </div>

              {/* Privacy Item 3 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>3. Zero Data Monetization Commitment</span>
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed ml-4 space-y-1">
                  <span className="font-bold text-slate-900 block">We Never Sell Your Personal Information:</span>
                  <p>
                    Nexora does not sell, rent, or lease personal identifiers, phone numbers, or browsing habits to third-party advertisers or data brokers. Data is processed exclusively to deliver verified marketplace escrow services.
                  </p>
                </div>
              </div>

              {/* Privacy Item 4 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>4. Your Data Rights & Deletion Inquiries</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-4">
                  Under applicable digital data protection standards, you have the right to request an export of your transaction history, correct inaccurate profile information, or request permanent deletion of your account and credentials once all active escrow orders are completed. Contact <span className="font-mono text-slate-900 font-bold">privacy@nexora.marketplace</span> for formal compliance requests.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
