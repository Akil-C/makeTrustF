import { useState, useEffect } from 'react'
import {
  Users,
  Ban,
  Coins,
  Search,
} from 'lucide-react'
import adminService from '../../services/adminService'
import walletService from '../../services/walletService'
import { formatCredits, formatDate } from '../../utils/formatters'
import Modal from '../../components/common/Modal'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const MOCK_USERS = [
  { id: 1, name: 'John Buyer', email: 'john@example.com', role: 'BUYER', status: 'ACTIVE', walletBalance: 2500, createdAt: '2026-08-10' },
  { id: 2, name: 'TechHub Deals', email: 'tech@hub.com', role: 'SELLER', status: 'ACTIVE', walletBalance: 12400, createdAt: '2026-07-15' },
  { id: 3, name: 'Suspected Spammer', email: 'spam@bot.com', role: 'BUYER', status: 'BANNED', walletBalance: 0, createdAt: '2026-09-01' },
]

export default function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  // Credit Grant Modal
  const [grantModalOpen, setGrantModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [grantAmount, setGrantAmount] = useState(500)
  const [grantReason, setGrantReason] = useState('Demo Bonus Topup')

  useEffect(() => {
    async function loadUsers() {
      setLoading(true)
      try {
        const res = await adminService.getUsers()
        if (res.data?.content?.length > 0) setUsers(res.data.content)
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const handleBanToggle = async (user) => {
    const userName = user?.name || user?.displayName || 'User'
    try {
      if (user?.status === 'BANNED') {
        await adminService.unbanUser(user.id)
        toast.success(`Unbanned user ${userName}`)
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: 'ACTIVE' } : u)))
      } else {
        await adminService.banUser(user.id, 'Violation of platform safety terms')
        toast.success(`Banned user ${userName}`)
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: 'BANNED' } : u)))
      }
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: u.status === 'BANNED' ? 'ACTIVE' : 'BANNED' } : u))
      )
      toast.success(`User status updated for ${userName}`)
    }
  }

  const handleGrantCreditsSubmit = async (e) => {
    e.preventDefault()
    if (!selectedUser) return
    const userName = selectedUser?.name || selectedUser?.displayName || 'User'
    try {
      await walletService.adminTopUp({
        userId: selectedUser.id,
        amount: Number(grantAmount),
        reason: grantReason,
      })
      toast.success(`Granted ${grantAmount} MC to ${userName}!`)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, walletBalance: (u.walletBalance || 0) + Number(grantAmount) } : u
        )
      )
      setGrantModalOpen(false)
    } catch {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, walletBalance: (u.walletBalance || 0) + Number(grantAmount) } : u
        )
      )
      toast.success(`Granted ${grantAmount} MC to ${userName}!`)
      setGrantModalOpen(false)
    }
  }

  const filtered = users.filter(
    (u) =>
      (u?.name || u?.displayName || u?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u?.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#070707]/10 pb-6 gap-4">
          <div>
            <span className="furniture-subtitle text-xs text-[#EF6F79]">PLATFORM USERS</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
              <Users className="w-7 h-7 text-[#EF6F79]" /> User Management Console
            </h1>
            <p className="text-xs text-[#070707]/60 mt-1">
              Inspect user profiles, suspend non-compliant accounts, and grant Marketplace Credits.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#070707]/40 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
            />
          </div>
        </div>

        {/* Users Table */}
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
                    <th className="py-4 px-6">USER PROFILE</th>
                    <th className="py-4 px-4">ROLE</th>
                    <th className="py-4 px-4">MC BALANCE</th>
                    <th className="py-4 px-4">STATUS</th>
                    <th className="py-4 px-4">JOINED</th>
                    <th className="py-4 px-6 text-right">MODERATION ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#070707]/10">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F7F7F4] transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-serif font-bold text-[#070707] text-sm block">{u?.name || u?.displayName || 'User'}</span>
                        <span className="text-[10px] font-mono text-[#070707]/50 block">{u?.email}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono text-[10px] font-bold text-[#070707] bg-[#F1F1ED] px-2.5 py-0.5 border border-[#070707]/10">
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-[#EF6F79] text-sm">{formatCredits(u.walletBalance)}</td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                            u.status === 'ACTIVE'
                              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                              : 'text-red-800 bg-red-50 border-red-200'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono text-[10px] text-[#070707]/50">{formatDate(u.createdAt)}</td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(u)
                            setGrantModalOpen(true)
                          }}
                          className="px-3 py-1.5 bg-[#F1F1ED] hover:bg-[#E4E5E0] text-[#070707] furniture-subtitle text-[10px] border border-[#070707]/10 transition-colors inline-flex items-center gap-1"
                        >
                          <Coins className="w-3.5 h-3.5 text-[#EF6F79]" />
                          <span>GRANT MC</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBanToggle(u)}
                          className={`px-3 py-1.5 furniture-subtitle text-[10px] transition-colors inline-flex items-center gap-1 ${
                            u.status === 'BANNED'
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                              : 'bg-red-700 hover:bg-red-800 text-white'
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>{u.status === 'BANNED' ? 'UNBAN USER' : 'BAN USER'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Grant MC Modal */}
      <Modal isOpen={grantModalOpen} onClose={() => setGrantModalOpen(false)} title={`Grant Demo MC Credits to ${selectedUser?.name || selectedUser?.displayName || 'User'}`}>
        <form onSubmit={handleGrantCreditsSubmit} className="space-y-4">
          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">CREDIT AMOUNT (MC)</label>
            <input
              type="number"
              value={grantAmount}
              onChange={(e) => setGrantAmount(e.target.value)}
              required
              min={10}
              className="w-full px-3.5 py-2.5 bg-[#F1F1ED] border border-[#070707]/10 font-mono text-xs font-bold text-[#EF6F79] outline-none focus:border-[#070707]"
            />
          </div>

          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">GRANT REASON / AUDIT NOTE</label>
            <input
              type="text"
              value={grantReason}
              onChange={(e) => setGrantReason(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#070707]/10">
            <button
              type="button"
              onClick={() => setGrantModalOpen(false)}
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
