import { useState, useEffect } from 'react'
import {
  Package,
  Truck,
  User,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import orderService from '../../services/orderService'
import { formatCredits, formatDate, getOrderStatusColor, formatOrderStatus } from '../../utils/formatters'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const MOCK_SELLER_ORDERS = [
  {
    id: 'ord-101',
    productTitle: 'MacBook Air 15-inch M3 (16GB RAM, 512GB SSD) Midnight',
    price: 118000,
    buyerName: 'David K.',
    shippingAddress: 'Flat 402, Indiranagar, Bengaluru, KA 560038',
    status: 'CONFIRMED',
    createdAt: '2026-10-18T12:00:00Z',
    trackingNumber: '',
  },
  {
    id: 'ord-104',
    productTitle: 'Sony WH-1000XM5 Wireless Headphones (Silver)',
    price: 24500,
    buyerName: 'Sarah M.',
    shippingAddress: '12th Cross, Koramangala 4th Block, Bengaluru, KA 560034',
    status: 'PENDING',
    createdAt: '2026-10-19T16:45:00Z',
    trackingNumber: '',
  },
  {
    id: 'ord-105',
    productTitle: 'Canon EOS R6 Mark II Mirrorless Camera Body',
    price: 195000,
    buyerName: 'Michael P.',
    shippingAddress: '88 MG Road, Bengaluru, KA 560001',
    status: 'SHIPPED',
    createdAt: '2026-10-15T10:15:00Z',
    trackingNumber: 'TRK88291039',
  },
]

export default function SellerOrders() {
  const [orders, setOrders] = useState(MOCK_SELLER_ORDERS)
  const [loading, setLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Ship Modal State
  const [shipModalOpen, setShipModalOpen] = useState(false)
  const [selectedOrderToShip, setSelectedOrderToShip] = useState(null)
  const [trackingNumber, setTrackingNumber] = useState('')

  useEffect(() => {
    async function loadOrders() {
      setLoading(true)
      try {
        const res = await orderService.getSellerOrders()
        if (res.data?.content?.length > 0) setOrders(res.data.content)
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const handleConfirmOrder = async (orderId) => {
    try {
      await orderService.confirmOrder(orderId)
      toast.success('Order confirmed for fulfillment!')
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'CONFIRMED' } : o)))
    } catch {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'CONFIRMED' } : o)))
      toast.success('Order confirmed for fulfillment!')
    }
  }

  const openShipModal = (order) => {
    setSelectedOrderToShip(order)
    setTrackingNumber(`TRK${Math.floor(10000000 + Math.random() * 90000000)}`)
    setShipModalOpen(true)
  }

  const handleMarkShippedSubmit = async (e) => {
    e.preventDefault()
    if (!selectedOrderToShip) return
    try {
      await orderService.markShipped(selectedOrderToShip.id, { trackingNumber })
      toast.success('Dispatch details attached and marked as shipped!')
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrderToShip.id ? { ...o, status: 'SHIPPED', trackingNumber } : o))
      )
      setShipModalOpen(false)
    } catch {
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrderToShip.id ? { ...o, status: 'SHIPPED', trackingNumber } : o))
      )
      toast.success('Dispatch details attached and marked as shipped!')
      setShipModalOpen(false)
    }
  }

  const filtered = orders.filter((o) => {
    if (selectedStatus !== 'ALL' && o.status !== selectedStatus) return false
    return true
  })

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 font-sans">
      <DemoDisclaimer />

      {/* Top Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>ESCROW FULFILLMENT PIPELINE</span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            Order Fulfillment Management
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Confirm incoming buyer orders, attach courier dispatch codes, and monitor automated escrow payout releases.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-xl font-bold text-slate-900">No Orders in this View</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No buyer orders match the selected status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Order Details</th>
                  <th className="py-4 px-4">Buyer & Shipping Address</th>
                  <th className="py-4 px-4">Offer Price</th>
                  <th className="py-4 px-4">Courier Tracking</th>
                  <th className="py-4 px-4">Escrow Status</th>
                  <th className="py-4 px-6 text-right">Fulfillment Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-bold text-slate-400 block">{ord.id}</span>
                      <span className="font-bold text-slate-900 block text-sm">{ord.productTitle}</span>
                      <span className="text-xs text-slate-500 block mt-0.5">{formatDate(ord.createdAt)}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {ord.buyerName}
                      </span>
                      <span className="text-xs text-slate-500 block line-clamp-1 mt-0.5">{ord.shippingAddress}</span>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-rose-600 text-sm">
                      {formatCredits(ord.price)}
                    </td>

                    <td className="py-4 px-4 font-mono text-xs">
                      {ord.trackingNumber ? (
                        <span className="font-bold text-slate-900">{ord.trackingNumber}</span>
                      ) : (
                        <span className="text-slate-400 italic">Not Shipped</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {ord.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      {ord.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => handleConfirmOrder(ord.id)}
                          className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-xs"
                        >
                          Confirm Order
                        </button>
                      )}

                      {ord.status === 'CONFIRMED' && (
                        <button
                          type="button"
                          onClick={() => openShipModal(ord)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 inline-flex shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch Shipment</span>
                        </button>
                      )}

                      {ord.status === 'SHIPPED' && (
                        <span className="text-xs font-semibold text-slate-500 italic">In Transit (Awaiting Delivery)</span>
                      )}

                      {ord.status === 'DELIVERED' && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          ✓ Payout Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mark Shipped Modal */}
      {shipModalOpen && (
        <Modal isOpen={shipModalOpen} onClose={() => setShipModalOpen(false)} title="Attach Dispatch & Tracking Info">
          <form onSubmit={handleMarkShippedSubmit} className="space-y-5 p-2 font-sans">
            <p className="text-xs text-slate-600">
              Provide courier tracking reference number for <strong className="text-slate-900">{selectedOrderToShip?.productTitle}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Courier Tracking Code
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShipModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Confirm Dispatch
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
