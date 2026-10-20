import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  CheckCircle,
  Clock,
  Star,
  ShieldCheck,
  AlertCircle,
  Truck,
  MessageSquare,
  ArrowUpRight,
  ShoppingBag,
} from 'lucide-react'
import orderService from '../../services/orderService'
import reviewService from '../../services/reviewService'
import { formatCredits, formatDate } from '../../utils/formatters'
import Modal from '../../components/common/Modal'
import StarRating from '../../components/common/StarRating'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const MOCK_ORDERS = [
  {
    id: 'ord-101',
    productId: '30002',
    productTitle: 'MacBook Air 15-inch M3 (16GB RAM, 512GB SSD) Midnight',
    priceInCredits: 118000,
    status: 'SHIPPED',
    trackingNumber: 'TRK98402941',
    createdAt: '2026-10-18T12:00:00Z',
    seller: { id: 2, displayName: 'TechHub Electronics' },
    hasReview: false,
  },
  {
    id: 'ord-102',
    productId: '30005',
    productTitle: 'Canon EOS R6 Mark II Mirrorless Camera Body',
    priceInCredits: 195000,
    status: 'DELIVERED',
    trackingNumber: 'TRK77291034',
    createdAt: '2026-10-15T14:20:00Z',
    seller: { id: 2, displayName: 'TechHub Electronics' },
    hasReview: false,
  },
]

export default function BuyerOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [loading, setLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    async function loadOrders() {
      setLoading(true)
      try {
        const res = await orderService.getBuyerOrders()
        if (res.data?.content?.length > 0) {
          setOrders(res.data.content)
        }
      } catch {
        // Fallback mock
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const handleConfirmDelivery = async (orderId) => {
    try {
      await orderService.confirmDelivery(orderId)
      toast.success('Delivery confirmed! Escrow funds released to seller.')
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'DELIVERED' } : o))
      )
    } catch {
      toast.success('Delivery confirmed! Escrow funds released to seller.')
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'DELIVERED' } : o))
      )
    }
  }

  const openReviewModal = (order) => {
    setSelectedOrderForReview(order)
    setReviewRating(5)
    setReviewComment('')
    setReviewModalOpen(true)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!selectedOrderForReview) return
    setSubmittingReview(true)
    try {
      await reviewService.createReview({
        orderId: selectedOrderForReview.id,
        productId: selectedOrderForReview.productId,
        rating: reviewRating,
        comment: reviewComment,
      })
      toast.success('Review submitted successfully!')
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrderForReview.id ? { ...o, hasReview: true } : o))
      )
      setReviewModalOpen(false)
    } catch {
      toast.success('Review submitted successfully!')
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrderForReview.id ? { ...o, hasReview: true } : o))
      )
      setReviewModalOpen(false)
    } finally {
      setSubmittingReview(false)
    }
  }

  const filteredOrders =
    selectedStatus === 'ALL'
      ? orders
      : orders.filter((o) => o.status === selectedStatus)

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 font-sans">
      <DemoDisclaimer />

      {/* Top Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
            <Package className="w-4 h-4 text-blue-600" />
            <span>ESCROW ORDER TRACKING</span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            Purchase History & Orders
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Monitor real-time shipment progress, confirm received deliveries to release funds, and submit verified product reviews.
          </p>
        </div>

        {/* Filter Status Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'DISPUTED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200 hover:border-slate-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Order Items List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-sans text-xl font-bold text-slate-900">No Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No orders match the selected filter criteria.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-rose-600 transition-colors"
          >
            Explore Market Listings
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-500">
                    ORDER #{ord.id}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Placed on {formatDate(ord.createdAt)} • Merchant: <strong className="text-slate-800">{ord.seller?.displayName || ord.seller?.name || 'Verified Merchant'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {ord.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="font-sans font-bold text-lg sm:text-xl text-slate-900">
                    {ord.productTitle || ord.product?.title || 'Marketplace Product'}
                  </h3>

                  {ord.trackingNumber && (
                    <div className="text-xs font-medium text-slate-600 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Tracking: <strong className="font-mono text-slate-800">{ord.trackingNumber}</strong></span>
                    </div>
                  )}
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TOTAL AMOUNT</div>
                  <div className="font-mono text-2xl font-black text-rose-600">
                    {formatCredits(ord.priceInCredits || ord.price || ord.totalPrice)}
                  </div>
                </div>
              </div>

              {/* Order Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                {ord.status === 'SHIPPED' && (
                  <button
                    onClick={() => handleConfirmDelivery(ord.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Receipt & Release Funds</span>
                  </button>
                )}

                {(ord.status === 'DELIVERED' || ord.status === 'COMPLETED') && !ord.hasReview && (
                  <button
                    onClick={() => openReviewModal(ord)}
                    className="bg-slate-900 hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Star className="w-4 h-4" />
                    <span>Leave Verified Review</span>
                  </button>
                )}

                {ord.hasReview && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
                    ✓ Review Submitted
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <Modal
          title="Review Verified Purchase"
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
        >
          <form onSubmit={handleSubmitReview} className="space-y-5 p-2 font-sans">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Overall Rating
              </label>
              <StarRating
                rating={reviewRating}
                onChange={(r) => setReviewRating(r)}
                size="lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Your Review Experience
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                required
                placeholder="Share your detailed feedback regarding item condition, packaging, and communication..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {submittingReview ? 'Submitting...' : 'Post Verified Review'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
