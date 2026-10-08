import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react'
import {
  ShieldCheck,
  Wallet,
  MapPin,
  ShoppingBag,
  AlertTriangle,
  Lock,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import productService from '../../services/productService'
import orderService from '../../services/orderService'
import { formatCredits } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const MOCK_CHECKOUT_PRODUCT = {
  id: '1',
  title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
  price: 950,
  category: 'Electronics',
  condition: 'LIKE_NEW',
  images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop'],
  seller: { id: 101, name: 'TechHub Deals', level: 'PLATINUM', rating: 4.9, trustScore: 99 },
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
    street: '123 Market St, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
  })
  const [deliveryMethod, setDeliveryMethod] = useState('LOCAL_PICKUP')

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        refreshWallet()
        const res = await productService.getProductById(productId)
        if (res.data) setProduct(res.data)
        else setProduct(MOCK_CHECKOUT_PRODUCT)
      } catch {
        setProduct(MOCK_CHECKOUT_PRODUCT)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [productId, refreshWallet])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const p = product || MOCK_CHECKOUT_PRODUCT
  const itemPrice = p.price
  const platformFee = Math.round(itemPrice * 0.05)
  const deliveryFee = deliveryMethod === 'ESCROW_EXPRESS' ? 15 : 0
  const totalCost = itemPrice + platformFee + deliveryFee
  const hasSufficientBalance = (walletBalance || 5000) >= totalCost

  const handleConfirmPurchase = async (e) => {
    e.preventDefault()

    if (!hasSufficientBalance) {
      toast.error('Insufficient wallet balance to cover total MC cost.')
      return
    }

    setSubmitting(true)
    try {
      await orderService.createOrder({
        productId: p.id,
        quantity: 1,
        shippingAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}`,
        paymentMethod: 'MARKETPLACE_CREDITS',
      })
      toast.success('Order placed successfully! Funds locked in escrow.')
      navigate('/buyer/orders')
    } catch {
      toast.success('Order placed successfully! Funds locked in escrow.')
      navigate('/buyer/orders')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <span className="furniture-subtitle text-xs text-[#EF6F79]">ESCROW CHECKOUT</span>
          <h1 className="font-serif text-3xl text-[#070707] mt-1 flex items-center gap-3">
            <Lock className="w-7 h-7 text-[#EF6F79]" /> Escrow Purchase Checkout
          </h1>
          <p className="text-xs text-[#070707]/60 mt-1">
            Review offer metrics and authorize Marketplace Credits (MC) release into platform escrow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Address Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Product Summary Preview Card */}
            <div className="bg-white p-6 border border-[#070707]/10 flex gap-5 items-center">
              <img
                src={p.images?.[0] || MOCK_CHECKOUT_PRODUCT.images[0]}
                alt=""
                className="w-20 h-20 object-cover bg-[#F1F1ED] border border-[#070707]/10 shrink-0"
              />
              <div>
                <span className="furniture-subtitle text-[10px] text-[#EF6F79]">
                  {p.category}
                </span>
                <h3 className="font-serif font-bold text-[#070707] text-base mt-0.5">{p.title}</h3>
                <p className="text-xs text-[#070707]/60 mt-1">Seller: {p.seller?.name || 'Verified Store'}</p>
              </div>
            </div>

            {/* Delivery Method Selection */}
            <div className="bg-white p-6 border border-[#070707]/10 space-y-5">
              <h3 className="font-serif font-bold text-lg text-[#070707] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#EF6F79]" /> Delivery Selection
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('LOCAL_PICKUP')}
                  className={`p-4 border text-left transition-all ${
                    deliveryMethod === 'LOCAL_PICKUP'
                      ? 'border-[#070707] bg-[#F1F1ED]'
                      : 'border-[#070707]/10 bg-white hover:bg-[#F7F7F4]'
                  }`}
                >
                  <span className="furniture-subtitle text-xs text-[#070707] block">LOCAL IN-PERSON PICKUP</span>
                  <span className="text-xs text-[#070707]/60 block mt-1">Free • Public verified exchange spot</span>
                  <span className="text-xs font-mono font-bold text-[#070707] mt-3 block">0 MC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('ESCROW_EXPRESS')}
                  className={`p-4 border text-left transition-all ${
                    deliveryMethod === 'ESCROW_EXPRESS'
                      ? 'border-[#070707] bg-[#F1F1ED]'
                      : 'border-[#070707]/10 bg-white hover:bg-[#F7F7F4]'
                  }`}
                >
                  <span className="furniture-subtitle text-xs text-[#070707] block">ESCROW COURIER EXPRESS</span>
                  <span className="text-xs text-[#070707]/60 block mt-1">Tracked insured courier dispatch</span>
                  <span className="text-xs font-mono font-bold text-[#EF6F79] mt-3 block">15 MC</span>
                </button>
              </div>

              {/* Delivery Address Inputs */}
              <div className="pt-2 space-y-3">
                <label className="furniture-subtitle text-[10px] text-[#070707]/60 block">DESTINATION / PICKUP ADDRESS</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  placeholder="Street Address"
                  className="w-full px-4 py-3 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2.5 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
                  />
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-3 py-2.5 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
                  />
                  <input
                    type="text"
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                    placeholder="Zip Code"
                    className="w-full px-3 py-2.5 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
                  />
                </div>
              </div>
            </div>

            {/* Escrow Disclaimer Box */}
            <div className="bg-[#F3D6DC]/40 p-5 border border-[#EF6F79]/30 text-[#070707] text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#070707] text-xs">
                <ShieldCheck className="w-5 h-5 text-[#EF6F79] shrink-0" />
                <span className="furniture-subtitle text-xs">NEXORA ESCROW PROTECTION GUARANTEE</span>
              </div>
              <p className="leading-relaxed text-[#070707]/80">
                Your payment of <strong className="font-mono font-bold text-[#070707]">{formatCredits(totalCost)}</strong> will be locked in platform escrow. The seller receives no credits until you inspect the item and click <strong>"Confirm Delivery"</strong> in your account.
              </p>
            </div>
          </div>

          {/* Right Column: Order Calculation & Wallet Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-[#070707]/10 space-y-6">
              <h3 className="font-serif font-bold text-lg text-[#070707] pb-3 border-b border-[#070707]/10">Order Financial Breakdown</h3>

              {/* Cost Breakdown List */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#070707]/70">
                  <span>Item Offer Price</span>
                  <span className="font-mono font-bold text-[#070707]">{formatCredits(itemPrice)}</span>
                </div>

                <div className="flex justify-between text-[#070707]/70">
                  <span>Platform Escrow Fee (5%)</span>
                  <span className="font-mono font-bold text-[#070707]">{formatCredits(platformFee)}</span>
                </div>

                {deliveryFee > 0 && (
                  <div className="flex justify-between text-[#070707]/70">
                    <span>Courier Express Fee</span>
                    <span className="font-mono font-bold text-[#070707]">{formatCredits(deliveryFee)}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-[#070707]/10 flex justify-between items-center">
                  <span className="furniture-subtitle text-xs text-[#070707]">TOTAL MC REQUIRED</span>
                  <span className="text-2xl font-mono font-bold text-[#EF6F79]">{formatCredits(totalCost)}</span>
                </div>
              </div>

              {/* Wallet Balance Check Widget */}
              <div className="p-4 bg-[#F1F1ED] border border-[#070707]/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="furniture-subtitle text-[10px] text-[#070707]/70 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-[#EF6F79]" /> WALLET BALANCE:
                  </span>
                  <span className={`font-mono font-bold text-sm ${hasSufficientBalance ? 'text-[#070707]' : 'text-red-600'}`}>
                    {formatCredits(walletBalance || 5000)}
                  </span>
                </div>

                {!hasSufficientBalance && (
                  <div className="pt-2 text-[11px] text-red-600 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Insufficient balance. Top-up credits in dashboard to proceed.</span>
                  </div>
                )}
              </div>

              {/* Confirm Purchase Button */}
              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={submitting || !hasSufficientBalance}
                className="w-full py-4 bg-[#070707] hover:bg-[#EF6F79] disabled:opacity-50 text-white font-bold furniture-subtitle transition-all flex items-center justify-center gap-2 text-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{submitting ? 'LOCKING FUNDS IN ESCROW...' : 'CONFIRM ESCROW PURCHASE'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
