import { useState } from 'react'
import { Package } from 'lucide-react'
import { formatCredits, getOrderStatusColor, formatOrderStatus } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const MOCK_ADMIN_ORDERS = [
  { id: 'ord-101', productTitle: 'iPhone 15 Pro Max 256GB', price: 950, buyerName: 'David K.', sellerName: 'TechHub Deals', status: 'SHIPPED' },
  { id: 'ord-102', productTitle: 'Sony WH-1000XM5 Headphones', price: 280, buyerName: 'Sarah M.', sellerName: 'AudioFile Store', status: 'DELIVERED' },
]

export default function AdminOrders() {
  const [orders] = useState(MOCK_ADMIN_ORDERS)
  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <span className="furniture-subtitle text-xs text-[#EF6F79]">ESCROW MONITOR</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
            <Package className="w-7 h-7 text-[#EF6F79]" /> Escrow Orders & Settlement Monitor
          </h1>
          <p className="text-xs text-[#070707]/60 mt-1">
            Real-time audit log of all active and completed marketplace escrow purchase transactions.
          </p>
        </div>

        <div className="bg-white border border-[#070707]/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
              <tr>
                <th className="py-4 px-6">ORDER ID</th>
                <th className="py-4 px-4">ITEM</th>
                <th className="py-4 px-4">BUYER</th>
                <th className="py-4 px-4">SELLER</th>
                <th className="py-4 px-4">ESCROW AMOUNT</th>
                <th className="py-4 px-6 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#070707]/10">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#F7F7F4]">
                  <td className="py-4 px-6 font-mono font-bold text-[10px] text-[#070707]/60">{o.id}</td>
                  <td className="py-4 px-4 font-serif font-bold text-[#070707] text-sm">{o.productTitle}</td>
                  <td className="py-4 px-4 font-mono text-[#070707]/70">{o.buyerName}</td>
                  <td className="py-4 px-4 font-mono text-[#070707]/70">{o.sellerName}</td>
                  <td className="py-4 px-4 font-mono font-bold text-[#EF6F79] text-sm">{formatCredits(o.price)}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase border ${getOrderStatusColor(o.status)}`}>
                      {formatOrderStatus(o.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
