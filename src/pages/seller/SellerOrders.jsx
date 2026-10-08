import { useState, useEffect } from 'react'
import {
  Package,
  Truck,
  User,
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
    productTitle: 'iPhone 15 Pro Max 256GB',
    price: 950,
    buyerName: 'David K.',
    shippingAddress: '123 Market St, San Francisco CA 94103',
    status: 'CONFIRMED',
    createdAt: '2026-10-04T12:00:00Z',
    trackingNumber: '',
  },
  {
    id: 'ord-104',
    productTitle: 'Sony WH-1000XM5 Headphones',
    price: 280,
    buyerName: 'Sarah M.',
    shippingAddress: '456 Mission St, San Francisco CA 94105',
    status: 'PENDING',
    createdAt: '2026-10-05T16:45:00Z',
    trackingNumber: '',
  },
  {
    id: 'ord-105',
    productTitle: 'MacBook Air M2',
    price: 1100,
    buyerName: 'Michael P.',
    shippingAddress: '789 Howard St, San Francisco CA 94103',
    status: 'SHIPPED',
    createdAt: '2026-09-30T10:15:00Z',
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
      toast.success('Order confirmed!')
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'CONFIRMED' } : o)))
    } catch {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'CONFIRMED' } : o)))
      toast.success('Order confirmed!')
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
      toast.success('Order marked as shipped!')
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrderToShip.id ? { ...o, status: 'SHIPPED', trackingNumber } : o))
      )
      setShipModalOpen(false)
    } catch {
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrderToShip.id ? { ...o, status: 'SHIPPED', trackingNumber } : o))
      )
      toast.success('Order marked as shipped!')
      setShipModalOpen(false)
    }
  }

  const filtered = orders.filter((o) => {
    if (selectedStatus !== 'ALL' && o.status !== selectedStatus) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#070707]/10 pb-6 gap-4">
          <div>
            <span className="furniture-subtitle text-xs text-[#EF6F79]">FULFILLMENT QUEUE</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
              <Package className="w-7 h-7 text-[#EF6F79]" /> Order Fulfillment Management
            </h1>
            <p className="text-xs text-[#070707]/60 mt-1">
              Confirm incoming buyer orders, attach courier tracking codes, and verify escrow fund status.
            </p>
          </div>

          <div className="flex bg-[#F1F1ED] p-1 border border-[#070707]/10 overflow-x-auto">
            {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 font-mono text-[11px] font-bold transition-all whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-[#070707] text-white'
                    : 'text-[#070707]/60 hover:text-[#070707]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-[#070707]/10 overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
                  <tr>
                    <th className="py-4 px-6">ORDER DETAILS</th>
                    <th className="py-4 px-4">BUYER & ADDRESS</th>
                    <th className="py-4 px-4">PRICE</th>
                    <th className="py-4 px-4">TRACKING #</th>
                    <th className="py-4 px-4">STATUS</th>
                    <th className="py-4 px-6 text-right">FULFILLMENT ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#070707]/10">
                  {filtered.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#F7F7F4] transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-[10px] text-[#070707]/40 block">{ord.id}</span>
                        <span className="font-serif font-bold text-[#070707] text-sm block">{ord.productTitle}</span>
                        <span className="text-[10px] text-[#070707]/50 font-mono block mt-0.5">{formatDate(ord.createdAt)}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-[#070707] text-xs flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#070707]/40" /> {ord.buyerName}
                        </span>
                        <span className="text-[11px] text-[#070707]/60 block line-clamp-1 mt-0.5">{ord.shippingAddress}</span>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-[#EF6F79] text-sm">
                        {formatCredits(ord.price)}
                      </td>

                      <td className="py-4 px-4 font-mono text-xs text-[#070707]/70">
                        {ord.trackingNumber ? (
                          <span className="font-bold text-[#070707]">{ord.trackingNumber}</span>
                        ) : (
                          <span className="text-[#070707]/40 italic">Not Shipped</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 font-mono text-[10px] font-bold uppercase border ${getOrderStatusColor(ord.status)}`}>
                          {formatOrderStatus(ord.status)}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        {ord.status === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => handleConfirmOrder(ord.id)}
                            className="px-4 py-2 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-[10px] transition-colors"
                          >
                            CONFIRM ORDER
                          </button>
                        )}

                        {ord.status === 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => openShipModal(ord)}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white furniture-subtitle text-[10px] transition-colors flex items-center gap-1.5 inline-flex"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>MARK SHIPPED</span>
                          </button>
                        )}

                        {ord.status === 'SHIPPED' && (
                          <span className="furniture-subtitle text-[10px] text-[#070707]/60 italic">AWAITING DELIVERY</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Mark Shipped Modal */}
      <Modal isOpen={shipModalOpen} onClose={() => setShipModalOpen(false)} title="Attach Dispatch & Tracking Info">
        <form onSubmit={handleMarkShippedSubmit} className="space-y-4">
          <p className="text-xs text-[#070707]/70">
            Provide courier tracking code for shipment <strong>{selectedOrderToShip?.productTitle}</strong>.
          </p>

          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">TRACKING NUMBER</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#F1F1ED] border border-[#070707]/10 font-mono text-xs font-bold outline-none focus:border-[#070707]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#070707]/10">
            <button
              type="button"
              onClick={() => setShipModalOpen(false)}
              className="px-4 py-2 bg-[#F1F1ED] text-[#070707] furniture-subtitle text-[10px]"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-[10px] transition-colors"
            >
              CONFIRM DISPATCH
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
