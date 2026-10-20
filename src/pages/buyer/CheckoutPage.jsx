import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ShieldCheck,
  Wallet,
  MapPin,
  ShoppingBag,
  AlertTriangle,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Truck,
  Package,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import productService from '../../services/productService'
import orderService from '../../services/orderService'
import { formatCredits } from '../../utils/formatters'
import { getProductImage, getProductById } from '../../utils/productsData'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const MOCK_CHECKOUT_PRODUCT = {
  id: 1,
  title: 'Apple MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)',
  priceInCredits: 245000,
  categoryName: 'Electronics',
  condition: 'LIKE_NEW',
  primaryImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  seller: { id: 2, displayName: 'TechHub Official', sellerLevel: 'PLATINUM', averageRating: 5.0, isVerified: true },
}

export default function CheckoutPage() {
  const { productId } = useParams()
  const { walletBalance, refreshWallet } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [shippingAddress, setShippingAddress] = useState({
    street: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560038',
  })
  const [deliveryMethod, setDeliveryMethod] = useState('LOCAL_PICKUP')

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        if (refreshWallet) await refreshWallet()
        const res = await productService.getProductById(productId)
        if (res.data) {
          setProduct(res.data)
        } else {
          setProduct(getProductById(productId) || MOCK_CHECKOUT_PRODUCT)
        }
      } catch {
        setProduct(getProductById(productId) || MOCK_CHECKOUT_PRODUCT)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [productId, refreshWallet])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const p = product || MOCK_CHECKOUT_PRODUCT
  const itemPrice = Number(p.priceInCredits ?? p.price ?? 0)
  const platformFee = Math.max(2, Math.round(itemPrice * 0.02))
  const deliveryFee = deliveryMethod === 'ESCROW_EXPRESS' ? 25 : 0
  const totalCost = itemPrice + platformFee + deliveryFee
  const currentBalance = Number(walletBalance || 0)
  const hasSufficientBalance = currentBalance >= totalCost

  const handleConfirmPurchase = async (e) => {
    e.preventDefault()

    if (!shippingAddress.street.trim() || !shippingAddress.city.trim()) {
      toast.error('Please enter a valid street address and city.')
      return
    }

    if (!hasSufficientBalance) {
      toast.error('Insufficient wallet balance to cover total MC cost.')
      return
    }

    setSubmitting(true)
    try {
      const fullAddress = `${shippingAddress.street.trim()}, ${shippingAddress.city.trim()}, ${shippingAddress.state.trim()} ${shippingAddress.zip.trim()}`
      const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `ord-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      await orderService.createOrder({
        productId: Number(p.id),
        quantity: 1,
        deliveryAddress: fullAddress,
        notes: `Delivery Method: ${deliveryMethod === 'ESCROW_EXPRESS' ? 'Escrow Insured Courier' : 'Local In-Person Verified Exchange'}`,
        idempotencyKey,
      })

      if (refreshWallet) await refreshWallet()
      toast.success('Escrow purchase authorized! Funds safely locked.')
      navigate('/buyer/orders')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unable to place order'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const productImage = getProductImage(p)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to={productId ? `/products/${productId}` : '/search'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Listing</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            100% Encrypted Escrow Vault
          </span>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Escrow Checkout Authorization</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Authorize locking marketplace credits into Nexora Smart Escrow. Funds are never released to the merchant until you receive, inspect, and confirm delivery.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Product Info & Delivery Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Product Card Preview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex gap-5 items-center">
              <img
                src={productImage}
                alt={p.title}
                className="w-24 h-24 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = getProductImage(p)
                }}
              />
              <div className="min-w-0 flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                  {p.categoryName || p.category || 'Classified'}
                </span>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate">{p.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span>Merchant: <strong className="text-slate-700">{p.seller?.displayName || p.seller?.name || 'Verified Seller'}</strong></span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">KYC Verified</span>
                </div>
              </div>
            </div>

            {/* Delivery Method Selection */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                <span>Select Fulfillment Option</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('LOCAL_PICKUP')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'LOCAL_PICKUP'
                      ? 'border-slate-900 bg-slate-900/5 ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-slate-700" />
                      Local Pickup
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-700">0 MC</span>
                  </div>
                  <p className="text-xs text-slate-500">Meet seller at verified public exchange safe point.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('ESCROW_EXPRESS')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'ESCROW_EXPRESS'
                      ? 'border-slate-900 bg-slate-900/5 ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-rose-600" />
                      Escrow Express
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900">25 MC</span>
                  </div>
                  <p className="text-xs text-slate-500">Tracked, insured direct door-to-door courier.</p>
                </button>
              </div>

              {/* Delivery Address Form */}
              <div className="pt-2 space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Delivery Destination / Meeting Point
                </label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  placeholder="Street Address or Public Safe Point Location"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                  <input
                    type="text"
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                    placeholder="Postal Code"
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Escrow Guarantee Callout */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-900 uppercase tracking-wide">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Nexora Zero-Risk Escrow Guarantee</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Your payment of <strong className="font-mono font-bold text-emerald-950">{formatCredits(totalCost)}</strong> remains in cold platform escrow. The seller only receives payout after you inspect the product and tap <strong>"Confirm Delivery"</strong>. If an issue occurs, full credits are refunded immediately.
              </p>
            </div>
          </div>

          {/* Right Column: Order Calculation & Wallet Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
              <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
                Payment Summary
              </h3>

              {/* Cost Breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Item Agreed Price</span>
                  <span className="font-mono font-bold text-slate-900">{formatCredits(itemPrice)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Platform Protection Fee (Escrow)</span>
                  <span className="font-mono font-bold text-slate-900">{formatCredits(platformFee)}</span>
                </div>

                {deliveryFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Express Insured Courier</span>
                    <span className="font-mono font-bold text-slate-900">{formatCredits(deliveryFee)}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Total Locked</span>
                  <span className="text-2xl font-mono font-extrabold text-slate-900">{formatCredits(totalCost)}</span>
                </div>
              </div>

              {/* Wallet Balance Widget */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-slate-700" />
                    Available Balance:
                  </span>
                  <span className={`font-mono font-bold text-sm ${hasSufficientBalance ? 'text-slate-900' : 'text-rose-600'}`}>
                    {formatCredits(currentBalance)}
                  </span>
                </div>

                {!hasSufficientBalance ? (
                  <div className="pt-2 text-xs text-rose-600 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Insufficient MC balance. Please add credits before checkout.</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Remaining after escrow lock: {formatCredits(currentBalance - totalCost)}</span>
                  </div>
                )}
              </div>

              {/* Confirm Purchase Button */}
              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={submitting || !hasSufficientBalance}
                className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{submitting ? 'Locking Escrow Funds...' : 'Authorize Escrow Order'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
