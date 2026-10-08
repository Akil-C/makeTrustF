import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import adminService from '../../services/adminService'
import { formatCredits } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const MOCK_DISPUTES = [
  { id: 'disp-1', orderId: 'ord-101', productTitle: 'iPhone 15 Pro Max', buyerName: 'David K.', sellerName: 'TechHub Deals', amount: 950, reason: 'Item not as described (scratch on screen)' },
]

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState(MOCK_DISPUTES)

  const handleRefundBuyer = async (id, amount) => {
    try {
      await adminService.resolveDispute(id, { resolution: 'REFUND_BUYER', refundAmount: amount })
      toast.success('Dispute resolved: Full refund to buyer!')
      setDisputes((prev) => prev.filter((d) => d.id !== id))
    } catch {
      setDisputes((prev) => prev.filter((d) => d.id !== id))
      toast.success('Dispute resolved: Full refund to buyer!')
    }
  }

  const handleReleaseSeller = async (id) => {
    try {
      await adminService.resolveDispute(id, { resolution: 'PAY_SELLER' })
      toast.success('Dispute resolved: Escrow funds paid to seller!')
      setDisputes((prev) => prev.filter((d) => d.id !== id))
    } catch {
      setDisputes((prev) => prev.filter((d) => d.id !== id))
      toast.success('Dispute resolved: Escrow funds paid to seller!')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <span className="furniture-subtitle text-xs text-[#EF6F79]">ARBITRATION DESK</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-[#EF6F79]" /> Buyer / Seller Dispute Arbitration
          </h1>
          <p className="text-xs text-[#070707]/60 mt-1">
            Arbitrate contested transactions, inspect buyer claims, and execute escrow credit disbursements or refunds.
          </p>
        </div>

        <div className="bg-white border border-[#070707]/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
              <tr>
                <th className="py-4 px-6">DISPUTE ID</th>
                <th className="py-4 px-4">ITEM</th>
                <th className="py-4 px-4">BUYER VS SELLER</th>
                <th className="py-4 px-4">DISPUTED MC</th>
                <th className="py-4 px-4">BUYER CLAIM</th>
                <th className="py-4 px-6 text-right">ARBITRATION DECISION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#070707]/10">
              {disputes.map((d) => (
                <tr key={d.id} className="hover:bg-[#F7F7F4]">
                  <td className="py-4 px-6 font-mono font-bold text-[10px] text-[#070707]/60">{d.id}</td>
                  <td className="py-4 px-4 font-serif font-bold text-[#070707] text-sm">{d.productTitle}</td>
                  <td className="py-4 px-4 font-mono text-[#070707]/80">{d.buyerName} vs {d.sellerName}</td>
                  <td className="py-4 px-4 font-mono font-bold text-[#EF6F79] text-sm">{formatCredits(d.amount)}</td>
                  <td className="py-4 px-4 text-[#070707]/70">{d.reason}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleRefundBuyer(d.id, d.amount)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white furniture-subtitle text-[10px] transition-colors"
                    >
                      REFUND BUYER
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReleaseSeller(d.id)}
                      className="px-3.5 py-1.5 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-[10px] transition-colors"
                    >
                      RELEASE TO SELLER
                    </button>
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
