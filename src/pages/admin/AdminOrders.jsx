import { useState, useEffect } from 'react'
import {
  Package,
  Search,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Truck,
  ExternalLink,
} from 'lucide-react'
import adminService from '../../services/adminService'
import { formatCredits, formatOrderStatus } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await adminService.getAllOrders({ size: 50 })
      const list = res.data?.content || res.data || []
      setOrders(list)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filtered = orders.filter((o) => {
    const matchSearch =
      !searchTerm ||
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Escrow Settlement Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <Package className="w-7 h-7 text-blue-600" />
              <span>Platform Escrow Transactions</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Real-time audit log of all active purchases, locked escrow vaults, transit milestones, and seller settlements.
            </p>
          </div>

          <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 self-start sm:self-auto">
            {orders.length} Total Escrow Orders
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
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

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'BUYER_CONFIRMED', 'COMPLETED', 'DISPUTED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-16 flex justify-center items-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No orders found matching your search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Order ID & Date</th>
                    <th className="py-4 px-4">Product</th>
                    <th className="py-4 px-4">Buyer</th>
                    <th className="py-4 px-4">Merchant</th>
                    <th className="py-4 px-4">Escrow Amount</th>
                    <th className="py-4 px-6 text-right">Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((o) => {
                    const price = o.totalPrice ?? o.price ?? 0
                    const orderNo = o.orderNumber || `#${o.id}`
                    const productTitle = o.product?.title || o.productTitle || 'Marketplace Item'
                    const buyerName = o.buyer?.name || o.buyerName || 'Buyer'
                    const sellerName = o.seller?.name || o.seller?.displayName || o.sellerName || 'Merchant'

                    return (
                      <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-mono font-bold text-slate-900 block">{orderNo}</span>
                          <span className="text-[11px] text-slate-500">
                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900 max-w-xs truncate">
                          {productTitle}
                        </td>
                        <td className="py-4 px-4 text-slate-700 font-medium">
                          {buyerName}
                        </td>
                        <td className="py-4 px-4 text-slate-700 font-medium">
                          {sellerName}
                        </td>
                        <td className="py-4 px-4 font-mono font-extrabold text-slate-900">
                          {formatCredits(price)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                              o.status === 'BUYER_CONFIRMED' || o.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : o.status === 'SHIPPED' || o.status === 'DELIVERED'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : o.status === 'DISPUTED'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                o.status === 'BUYER_CONFIRMED' || o.status === 'COMPLETED'
                                  ? 'bg-emerald-500'
                                  : o.status === 'DISPUTED'
                                  ? 'bg-rose-500'
                                  : 'bg-blue-500'
                              }`}
                            />
                            {formatOrderStatus(o.status)}
                          </span>
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
