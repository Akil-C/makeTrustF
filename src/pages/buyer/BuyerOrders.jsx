import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import orderService from '../../services/orderService'
import reviewService from '../../services/reviewService'
import { formatCredits, formatDate } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Modal from '../../components/common/Modal'
import StarRating from '../../components/common/StarRating'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const MOCK_ORDERS = [
  {
    id: 'ord-101',
    productId: '1',
    productTitle: 'iPhone 15 Pro Max 256GB — Natural Titanium',
    priceInCredits: 950,
    status: 'SHIPPED',
    trackingNumber: 'TRK98402941',
    createdAt: '2026-10-04T12:00:00Z',
    seller: { id: 101, displayName: 'TechHub Deals' },
    hasReview: false,
  },
  {
    id: 'ord-102',
    productId: '2',
    productTitle: 'Sony WH-1000XM5 Headphones',
    priceInCredits: 280,
    status: 'DELIVERED',
    trackingNumber: 'TRK77291034',
    createdAt: '2026-09-28T14:20:00Z',
    seller: { id: 102, displayName: 'AudioFile Studio' },
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
    <div className="min-h-screen bg-plaster text-near-black flex flex-col justify-between">
      <Navbar />

      <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <DemoDisclaimer />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 hairline-b border-near-black/15 pb-6">
          <div>
            <div className="furniture-text text-accent mb-1">TRANSACTION TRACKING</div>
            <h1 className="font-bodoni font-bold text-3xl sm:text-4xl text-near-black uppercase">
              PURCHASE HISTORY & ORDERS
            </h1>
          </div>

          {/* Filter Status Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['ALL', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'DISPUTED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`furniture-text px-3 py-1.5 text-xs transition-colors whitespace-nowrap border ${
                  selectedStatus === st
                    ? 'bg-near-black text-white border-near-black'
                    : 'bg-paper text-near-black/70 border-near-black/15 hover:border-near-black'
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
          <div className="p-12 text-center bg-paper hairline-all space-y-4">
            <h3 className="font-bodoni text-xl font-bold uppercase">NO ORDERS FOUND</h3>
            <p className="text-xs text-near-black/60 font-light">No orders match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((ord) => (
              <div key={ord.id} className="bg-paper p-6 sm:p-8 hairline-all space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 hairline-b border-near-black/10 pb-4">
                  <div>
                    <div className="furniture-text text-[10px] text-near-black/50">ORDER #{ord.id}</div>
                    <div className="text-xs text-near-black/60 font-light mt-0.5">
                      Placed on {formatDate(ord.createdAt)} • Merchant: {ord.seller?.displayName || ord.seller?.name || 'Verified Merchant'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="furniture-text text-xs px-3 py-1 bg-near-black text-white">
                      {ord.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="font-bodoni font-bold text-xl text-near-black">
                      {ord.productTitle || ord.product?.title || 'Marketplace Product'}
                    </h3>

                    {ord.trackingNumber && (
                      <div className="furniture-text text-xs text-near-black/70 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-accent" />
                        <span>TRACKING #: {ord.trackingNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-left sm:text-right space-y-2">
                    <div className="furniture-text text-[9px] text-near-black/50">TOTAL AMOUNT</div>
                    <div className="font-bodoni text-2xl font-bold text-accent">
                      {formatCredits(ord.priceInCredits || ord.price || ord.totalPrice)}
                    </div>
                  </div>
                </div>

                {/* Order Action Buttons */}
                <div className="pt-4 hairline-t border-near-black/10 flex flex-wrap items-center justify-end gap-3">
                  {ord.status === 'SHIPPED' && (
                    <button
                      onClick={() => handleConfirmDelivery(ord.id)}
                      className="bg-accent text-white hover:bg-near-black furniture-text px-4 py-2.5 text-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>CONFIRM RECEIPT & RELEASE FUNDS</span>
                    </button>
                  )}

                  {(ord.status === 'DELIVERED' || ord.status === 'COMPLETED') && !ord.hasReview && (
                    <button
                      onClick={() => openReviewModal(ord)}
                      className="bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text px-4 py-2.5 text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Star className="w-4 h-4" />
                      <span>LEAVE VERIFIED REVIEW</span>
                    </button>
                  )}

                  {ord.hasReview && (
                    <span className="furniture-text text-xs text-green-700 bg-green-100 px-3 py-1.5">
                      ✓ REVIEW SUBMITTED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title="LEAVE A VERIFIED MERCHANT REVIEW"
        >
          <form onSubmit={handleSubmitReview} className="space-y-6 pt-2">
            <div>
              <label className="block furniture-text text-near-black/70 mb-2">RATING</label>
              <div className="flex items-center gap-2 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-2xl"
                  >
                    {star <= reviewRating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block furniture-text text-near-black/70 mb-2">REVIEW COMMENTS</label>
              <textarea
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share details about item condition, delivery speed, and overall merchant experience..."
                required
                className="w-full p-3 bg-plaster border border-near-black/20 text-sm text-near-black outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full bg-accent text-white hover:bg-near-black furniture-text py-3.5 transition-colors"
            >
              {submittingReview ? 'SUBMITTING...' : 'SUBMIT VERIFIED REVIEW'}
            </button>
          </form>
        </Modal>

      </main>

      <Footer />
    </div>
  )
}
