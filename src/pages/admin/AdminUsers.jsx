import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Ban,
  CheckCircle,
  Coins,
  ShieldAlert,
  UserCheck,
} from 'lucide-react'
import adminService from '../../services/adminService'
import { formatCredits, formatDate } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'

const MOCK_USERS = [
  { id: 1, name: 'Admin Operations', email: 'admin@markettrust.com', role: 'ADMIN', status: 'ACTIVE', walletBalance: 500000, createdAt: '2026-08-01' },
  { id: 2, name: 'TechHub Electronics', email: 'seller1@demo.com', role: 'SELLER', status: 'ACTIVE', walletBalance: 124000, createdAt: '2026-08-10' },
  { id: 3, name: 'Alex Buyer', email: 'buyer1@demo.com', role: 'BUYER', status: 'ACTIVE', walletBalance: 25000, createdAt: '2026-08-15' },
]

export default function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  // Grant Credits Modal
  const [selectedUser, setSelectedUser] = useState(null)
  const [grantModalOpen, setGrantModalOpen] = useState(false)
  const [grantAmount, setGrantAmount] = useState(5000)
  const [grantReason, setGrantReason] = useState('Promotional Liquidity Topup')

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
      await adminService.grantCredits(selectedUser.id, grantAmount, grantReason)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, walletBalance: (u.walletBalance || 0) + Number(grantAmount) } : u
        )
      )
      toast.success(`Granted ${grantAmount} MC to ${userName}!`)
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
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 font-sans">
      <DemoDisclaimer />

      {/* Top Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
            <Users className="w-4 h-4 text-purple-600" />
            <span>PLATFORM USER DIRECTORY</span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            User Management Console
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Inspect registered accounts, review role assignments, issue credit adjustments, and enforce safety bans.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">User Account</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">MC Balance</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Member Since</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block text-sm">
                        {u?.name || u?.displayName || 'User'}
                      </span>
                      <span className="text-xs font-mono text-slate-500 block">{u?.email}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {u.role}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-rose-600 text-sm">
                      {formatCredits(u.walletBalance)}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase ${
                          u.status === 'ACTIVE'
                            ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                            : 'text-red-800 bg-red-50 border-red-200'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-slate-500">
                      {formatDate(u.createdAt)}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(u)
                          setGrantModalOpen(true)
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        <span>Grant MC</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBanToggle(u)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs ${
                          u.status === 'BANNED'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-rose-600 hover:bg-rose-700 text-white'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{u.status === 'BANNED' ? 'Unban' : 'Ban User'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grant MC Modal */}
      {grantModalOpen && (
        <Modal
          isOpen={grantModalOpen}
          onClose={() => setGrantModalOpen(false)}
          title={`Grant MC Credits to ${selectedUser?.name || selectedUser?.displayName || 'User'}`}
        >
          <form onSubmit={handleGrantCreditsSubmit} className="space-y-5 p-2 font-sans">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Credit Amount (MC)
              </label>
              <input
                type="number"
                value={grantAmount}
                onChange={(e) => setGrantAmount(e.target.value)}
                required
                min={10}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-rose-600 outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Grant Reason / Audit Note
              </label>
              <input
                type="text"
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setGrantModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Issue Credits
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
