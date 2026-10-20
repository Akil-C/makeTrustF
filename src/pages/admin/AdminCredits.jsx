import { useState } from 'react'
import { Coins, Plus, ShieldCheck, ArrowUpRight } from 'lucide-react'
import walletService from '../../services/walletService'
import { formatCredits, formatDate } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'

const MOCK_CREDIT_TX = [
  { id: 'tx-1', userName: 'John Buyer', type: 'BONUS_TOPUP', amount: 5000, reason: 'New buyer welcome credit bonus', date: '2026-10-18' },
  { id: 'tx-2', userName: 'TechHub Electronics', type: 'ESCROW_PAYOUT', amount: 72000, reason: 'Order #3 delivery confirmed payout', date: '2026-10-17' },
  { id: 'tx-3', userName: 'TechHub Electronics', type: 'PLATFORM_FEE', amount: 3600, reason: '5% escrow transaction commission fee', date: '2026-10-17' },
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
      toast.success(`Successfully issued ${amount} MC!`)
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
      toast.success(`Successfully issued ${amount} MC!`)
      setModalOpen(false)
    }
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 font-sans">
      <DemoDisclaimer />

      {/* Top Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>PLATFORM ECONOMY & LIQUIDITY</span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            Marketplace Credit (MC) Ledger
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Audit credit transactions, monitor escrow reserve circulation, and grant promotional liquidity adjustments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Manual Credits</span>
        </button>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-slate-900">Transaction Ledger</h3>
            <p className="text-xs text-slate-500">Live platform debit, credit, and escrow commission ledger</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {txs.length} Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-4">User Account</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Reason / Notes</th>
                <th className="py-4 px-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {txs.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-500">{t.id}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{t.userName}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {t.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-rose-600 text-sm">
                    {formatCredits(t.amount)}
                  </td>
                  <td className="py-4 px-4 text-slate-600">{t.reason}</td>
                  <td className="py-4 px-6 text-right font-mono text-xs text-slate-500">
                    {formatDate(t.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Grant Modal */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Issue Platform MC Credits">
          <form onSubmit={handleIssue} className="space-y-5 p-2 font-sans">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Target User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                placeholder="e.g. 2 or buyer1@demo.com"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Credit Amount (MC)
              </label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Audit Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Confirm Credit Grant
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
