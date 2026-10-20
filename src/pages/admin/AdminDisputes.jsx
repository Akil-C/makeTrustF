import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  RotateCcw,
  Check,
} from 'lucide-react'
import orderService from '../../services/orderService'
import { formatCredits } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchDisputes = async () => {
    setLoading(true)
    try {
      const res = await orderService.getAllOrders({ status: 'DISPUTED' })
      const list = res.data?.content || res.data || []
      setDisputes(list)
    } catch {
      setDisputes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDisputes()
  }, [])

  const handleRefundBuyer = async (orderId, orderNo) => {
    if (!window.confirm(`Issue full refund to buyer for order ${orderNo}? Escrow credits will be returned to the buyer wallet.`)) {
      return
    }

    try {
      await orderService.adminUpdateStatus(orderId, {
        newStatus: 'REFUNDED',
        notes: 'Admin dispute arbitration: Claim favored buyer. 100% Escrow refund executed.',
      })
      toast.success(`Dispute resolved: Full refund returned to buyer for ${orderNo}`)
      setDisputes((prev) => prev.filter((d) => d.id !== orderId))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to refund buyer')
    }
  }

  const handleReleaseSeller = async (orderId, orderNo) => {
    if (!window.confirm(`Release escrow funds to seller for order ${orderNo}? Funds will be credited to the merchant.`)) {
      return
    }

    try {
      await orderService.adminUpdateStatus(orderId, {
        newStatus: 'COMPLETED',
        notes: 'Admin dispute arbitration: Seller evidence verified. Escrow funds released to merchant.',
      })
      toast.success(`Dispute resolved: Escrow payout released to merchant for ${orderNo}`)
      setDisputes((prev) => prev.filter((d) => d.id !== orderId))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to release escrow funds')
    }
  }

  const filtered = disputes.filter((d) => {
    return (
      !searchTerm ||
      d.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Arbitration & Settlement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <AlertTriangle className="w-7 h-7 text-rose-600" />
              <span>Dispute Resolution Bench</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Examine contested escrow purchases, inspect buyer proof vs merchant fulfillment tracking, and execute binding arbitration decisions.
            </p>
          </div>

          <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 self-start sm:self-auto">
            {disputes.length} Contested Cases Pending
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order #, product, or buyer..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Disputes Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-16 flex justify-center items-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <span className="font-bold text-slate-800 block">No Active Disputes</span>
              <span>All escrow transactions are currently smooth with zero open arbitration cases.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-4">Item & Parties</th>
                    <th className="py-4 px-4">Contested Escrow</th>
                    <th className="py-4 px-4">Delivery Notes</th>
                    <th className="py-4 px-6 text-right">Arbitration Ruling</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((d) => {
                    const price = d.totalPrice ?? d.price ?? 0
                    const orderNo = d.orderNumber || `#${d.id}`
                    const productTitle = d.product?.title || 'Marketplace Item'
                    const buyerName = d.buyer?.name || 'Buyer'
                    const sellerName = d.seller?.name || d.seller?.displayName || 'Merchant'

                    return (
                      <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-mono font-bold text-slate-900 block">{orderNo}</span>
                          <span className="text-[11px] text-slate-500">
                            {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 block truncate max-w-xs">{productTitle}</span>
                          <span className="text-xs text-slate-500">
                            Buyer: <strong>{buyerName}</strong> vs Seller: <strong>{sellerName}</strong>
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-extrabold text-rose-600">
                          {formatCredits(price)}
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-600 max-w-xs">
                          {d.notes || d.deliveryAddress || 'Buyer reported condition mismatch or delayed shipment'}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleRefundBuyer(d.id, orderNo)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Refund Buyer</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReleaseSeller(d.id, orderNo)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Release to Seller</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
