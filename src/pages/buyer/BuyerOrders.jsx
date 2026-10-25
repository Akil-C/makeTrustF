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
  RotateCcw,
} from 'lucide-react'
import orderService from '../../services/orderService'
import reviewService from '../../services/reviewService'
import { formatCredits, formatDate } from '../../utils/formatters'
import Modal from '../../components/common/Modal'
import StarRating from '../../components/common/StarRating'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

export default function BuyerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('Great product and verified delivery')
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  // Dispute Modal State
  const [disputeModalOpen, setDisputeModalOpen] = useState(false)
  const [selectedOrderForDispute, setSelectedOrderForDispute] = useState(null)
  const [disputeReason, setDisputeReason] = useState('WRONG_DESCRIPTION')
  const [disputeDescription, setDisputeDescription] = useState('')
  const [submittingDispute, setSubmittingDispute] = useState(false)

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await orderService.getBuyerOrders()
      const list = Array.isArray(res.data) ? res.data : (res.data?.content || [])
      setOrders(list)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleConfirmDelivery = async (orderId) => {
    try {
      await orderService.confirmDelivery(orderId)
      toast.success('Delivery confirmed! Escrow funds released to seller.')
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'BUYER_CONFIRMED' } : o))
      )
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error confirming delivery')
    }
  }

  const openReviewModal = (order) => {
    setSelectedOrderForReview(order)
    setReviewRating(5)
    setReviewTitle('Verified Purchase Experience')
    setReviewComment('Item was exactly as described and delivered safely.')
    setReviewModalOpen(true)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!selectedOrderForReview) return

    if (reviewComment.trim().length < 10) {
      toast.error('Review comment must be at least 10 characters long.')
      return
    }

    setSubmittingReview(true)
    try {
      await reviewService.createReview({
        orderId: selectedOrderForReview.id,
        rating: reviewRating,
        title: reviewTitle.trim() || 'Verified Experience',
        comment: reviewComment.trim(),
        productConditionRating: reviewRating,
        sellerCommunicationRating: reviewRating,
        accuracyRating: reviewRating,
      })
      toast.success('Review submitted! Thank you for strengthening marketplace trust.')
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrderForReview.id ? { ...o, hasReview: true } : o))
      )
      setReviewModalOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const openDisputeModal = (order) => {
    setSelectedOrderForDispute(order)
    setDisputeReason('WRONG_DESCRIPTION')
    setDisputeDescription('')
    setDisputeModalOpen(true)
  }

  const handleSubmitDispute = async (e) => {
    e.preventDefault()
    if (!selectedOrderForDispute) return

    if (disputeDescription.trim().length < 10) {
      toast.error('Please provide a detailed dispute description (min 10 characters).')
      return
    }

    setSubmittingDispute(true)
    try {
      await orderService.raiseDispute(selectedOrderForDispute.id, {
        reason: disputeReason,
        description: disputeDescription.trim(),
        evidence: 'Reported via buyer orders panel',
      })
      toast.success('Dispute case opened. Funds frozen until admin arbitration.')
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrderForDispute.id ? { ...o, status: 'DISPUTED' } : o))
      )
      setDisputeModalOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to open dispute')
    } finally {
      setSubmittingDispute(false)
    }
  }

  const filteredOrders =
    selectedStatus === 'ALL'
      ? orders
      : orders.filter((o) => o.status === selectedStatus)

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6 font-sans page-swift">
      <DemoDisclaimer />

      {/* Top Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
            <Package className="w-3.5 h-3.5 text-blue-600" />
            <span>ESCROW ORDER TRACKING</span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Purchase History & Orders
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Monitor real-time fulfillment milestones, inspect products, confirm received delivery to release funds, and submit verified merchant reviews.
          </p>
        </div>

        {/* Filter Status Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'BUYER_CONFIRMED', 'DISPUTED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs swift-interactive ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Empty State */}
      {loading ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-200 flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-3">
          <Package className="w-12 h-12 text-slate-400 mx-auto opacity-70" />
          <h3 className="font-bold text-slate-800 text-lg">No Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You don't have any purchase orders under this status. Explore verified product listings to place an order.
          </p>
          <div className="pt-2">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-xs swift-interactive"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isConfirmed = order.status === 'BUYER_CONFIRMED' || order.status === 'COMPLETED'
            const isDelivered = order.status === 'DELIVERED'
            const isShipped = order.status === 'SHIPPED'
            const isDisputed = order.status === 'DISPUTED'

            const title = order.product?.title || order.productTitle || 'Marketplace Item'
            const price = order.totalPrice ?? order.priceInCredits ?? order.price ?? 0
            const orderNo = order.orderNumber || `#${order.id}`
            const sellerName = order.seller?.displayName || order.seller?.name || 'Verified Merchant'

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 hover:border-slate-300 transition-colors"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900">{orderNo}</span>
                    <span className="text-xs text-slate-500">
                      Placed on {order.createdAt ? formatDate(order.createdAt) : 'Recent'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isDelivered || isShipped
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : isDisputed
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isConfirmed ? 'bg-emerald-500' : isDisputed ? 'bg-rose-500' : 'bg-blue-500'
                        }`}
                      />
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Main Item Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900">{title}</h3>
                    <p className="text-xs text-slate-500">
                      Merchant: <strong className="text-slate-700">{sellerName}</strong>
                      {order.trackingNumber && (
                        <span className="ml-3 font-mono text-slate-600">Tracking: #{order.trackingNumber}</span>
                      )}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Escrow Amount</span>
                    <span className="text-xl font-mono font-extrabold text-slate-900">{formatCredits(price)}</span>
                  </div>
                </div>

                {/* Mini Escrow Progress Stepper */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className={`p-2 rounded-lg text-[11px] font-bold ${
                      order.status !== 'CANCELLED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                    }`}>
                      ✓ 1. Escrow Locked
                    </div>
                    <div className={`p-2 rounded-lg text-[11px] font-bold ${
                      ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'BUYER_CONFIRMED', 'COMPLETED'].includes(order.status)
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'CONFIRMED'
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : 'bg-slate-200/70 text-slate-500'
                    }`}>
                      2. Handover / Courier
                    </div>
                    <div className={`p-2 rounded-lg text-[11px] font-bold ${
                      ['DELIVERED', 'BUYER_CONFIRMED', 'COMPLETED'].includes(order.status)
                        ? isDelivered ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200/70 text-slate-500'
                    }`}>
                      3. Inspect Item
                    </div>
                    <div className={`p-2 rounded-lg text-[11px] font-bold ${
                      ['BUYER_CONFIRMED', 'COMPLETED'].includes(order.status)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200/70 text-slate-500'
                    }`}>
                      4. Payout Released
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protected by Nexora Escrow</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Confirm Delivery button if item delivered */}
                    {isDelivered && (
                      <button
                        type="button"
                        onClick={() => handleConfirmDelivery(order.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors swift-interactive"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Confirm Delivery (Release Funds)</span>
                      </button>
                    )}

                    {/* Review Button if confirmed */}
                    {isConfirmed && !order.hasReview && (
                      <button
                        type="button"
                        onClick={() => openReviewModal(order)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors swift-interactive"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Write Verified Review</span>
                      </button>
                    )}

                    {/* Open Dispute Button if shipped or delivered but problem arises */}
                    {(isShipped || isDelivered) && !isDisputed && (
                      <button
                        type="button"
                        onClick={() => openDisputeModal(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Report Issue</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">Verified Product Review</h3>
            <p className="text-xs text-slate-500">Rate your experience for {selectedOrderForReview?.product?.title || selectedOrderForReview?.productTitle}.</p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summary headline"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Feedback</label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about condition, packaging, and fulfillment..."
                  className="w-full p-3.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors swift-interactive"
                >
                  {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">Open Escrow Arbitration Dispute</h3>
            <p className="text-xs text-slate-500">Opening a dispute will freeze escrow funds until an administrator reviews both parties' evidence.</p>

            <form onSubmit={handleSubmitDispute} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dispute Reason</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="NOT_RECEIVED">Product Not Received</option>
                  <option value="WRONG_PRODUCT">Wrong Item Delivered</option>
                  <option value="DAMAGED">Item Arrived Damaged / Defective</option>
                  <option value="FAKE_PRODUCT">Suspected Counterfeit Item</option>
                  <option value="DESCRIPTION_MISMATCH">Substantial Description Mismatch</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Describe the Issue</label>
                <textarea
                  rows={4}
                  required
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  placeholder="Detail the issue with tracking, photos, or delivery notes..."
                  className="w-full p-3.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDispute}
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {submittingDispute ? 'Opening Case...' : 'Submit Dispute Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
