import { useState } from 'react'
import { Coins, Plus } from 'lucide-react'
import walletService from '../../services/walletService'
import { formatCredits, formatDate } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'

const MOCK_CREDIT_TX = [
  { id: 'tx-1', userName: 'John Buyer', type: 'BONUS_TOPUP', amount: 500, reason: 'Welcome bonus credit', date: '2026-10-05' },
  { id: 'tx-2', userName: 'TechHub Deals', type: 'ESCROW_PAYOUT', amount: 950, reason: 'Order ord-101 delivery payout', date: '2026-10-04' },
]

export default function AdminCredits() {
  const [txs, setTxs] = useState(MOCK_CREDIT_TX)
  const [modalOpen, setModalOpen] = useState(false)
  const [userId, setUserId] = useState('')
  const [amount, setAmount] = useState(1000)
  const [reason, setReason] = useState('Admin Manual Grant')

  const handleIssue = async (e) => {
    e.preventDefault()
    try {
      await walletService.adminTopUp({ userId, amount: Number(amount), reason })
      toast.success(`Issued ${amount} MC!`)
      setTxs((prev) => [
        { id: `tx-${Date.now()}`, userName: `User #${userId}`, type: 'MANUAL_GRANT', amount: Number(amount), reason, date: new Date().toISOString() },
        ...prev,
      ])
      setModalOpen(false)
    } catch {
      setTxs((prev) => [
        { id: `tx-${Date.now()}`, userName: `User #${userId}`, type: 'MANUAL_GRANT', amount: Number(amount), reason, date: new Date().toISOString() },
        ...prev,
      ])
      toast.success(`Issued ${amount} MC!`)
      setModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#070707]/10 pb-6 gap-4">
          <div>
            <span className="furniture-subtitle text-xs text-[#EF6F79]">CREDIT LEDGER</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
              <Coins className="w-7 h-7 text-[#EF6F79]" /> Marketplace Credit (MC) Ledger
            </h1>
            <p className="text-xs text-[#070707]/60 mt-1">
              Audit credit circulation entries and execute manual administrative top-ups.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-6 py-3.5 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>ISSUE MANUAL CREDITS</span>
          </button>
        </div>

        <div className="bg-white border border-[#070707]/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
              <tr>
                <th className="py-4 px-6">TRANSACTION ID</th>
                <th className="py-4 px-4">USER</th>
                <th className="py-4 px-4">TYPE</th>
                <th className="py-4 px-4">AMOUNT</th>
                <th className="py-4 px-4">REASON</th>
                <th className="py-4 px-6 text-right">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#070707]/10">
              {txs.map((t) => (
                <tr key={t.id} className="hover:bg-[#F7F7F4]">
                  <td className="py-4 px-6 font-mono font-bold text-[10px] text-[#070707]/60">{t.id}</td>
                  <td className="py-4 px-4 font-serif font-bold text-[#070707] text-sm">{t.userName}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-[#F1F1ED] text-[#070707] border border-[#070707]/10">
                      {t.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-[#EF6F79] text-sm">{formatCredits(t.amount)}</td>
                  <td className="py-4 px-4 text-[#070707]/70">{t.reason}</td>
                  <td className="py-4 px-6 text-right font-mono text-[10px] text-[#070707]/50">{formatDate(t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Issue Demo MC Credits">
        <form onSubmit={handleIssue} className="space-y-4">
          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">TARGET USER ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              placeholder="e.g. 101"
              className="w-full p-3 bg-[#F1F1ED] border border-[#070707]/10 font-mono text-xs outline-none focus:border-[#070707]"
            />
          </div>
          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">CREDIT AMOUNT (MC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full p-3 bg-[#F1F1ED] border border-[#070707]/10 font-mono text-xs font-bold text-[#EF6F79] outline-none focus:border-[#070707]"
            />
          </div>
          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">GRANT AUDIT REASON</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full p-3 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-[#070707]/10">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-[#F1F1ED] text-[#070707] furniture-subtitle text-[10px]"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-[10px] transition-colors"
            >
              ISSUE CREDITS
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
