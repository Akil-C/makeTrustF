import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShieldAlert,
  Users,
  Coins,
  DollarSign,
  Activity,
  AlertTriangle,
  UserCheck,
  Package,
} from 'lucide-react'
import adminService from '../../services/adminService'
import { formatCredits, formatDate } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const MOCK_ADMIN_STATS = {
  totalUsers: 1420,
  totalSellers: 380,
  pendingKYC: 14,
  mcCirculation: 4500000,
  platformFeesCollected: 225000,
  activeDisputes: 3,
  systemHealth: 'HEALTHY',
}

const MOCK_RECENT_REPORTS = [
  { id: 'rep-1', itemTitle: 'Suspicious iPhone 15 Listing', reporter: 'alex_buyer', reason: 'SCAM', status: 'PENDING', date: '2026-10-05' },
  { id: 'rep-2', itemTitle: 'Off-Platform Payment Request', reporter: 'sarah_m', reason: 'PROHIBITED_ITEM', status: 'PENDING', date: '2026-10-04' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(MOCK_ADMIN_STATS)
  const [reports, setReports] = useState(MOCK_RECENT_REPORTS)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadAdminStats() {
      setLoading(true)
      try {
        const res = await adminService.getDashboardStats()
        if (res.data) setStats(res.data)
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    loadAdminStats()
  }, [])

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Admin Header */}
        <div className="bg-[#070707] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#070707]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EF6F79]/20 text-[#EF6F79] text-[10px] font-mono uppercase tracking-wider mb-2 border border-[#EF6F79]/30">
              <ShieldAlert className="w-3.5 h-3.5" /> SUPER ADMIN OPERATIONS CONSOLE
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-white">Nexora Platform Control</h1>
            <p className="text-xs text-[#F1F1ED]/70 mt-1 max-w-xl">
              Oversee marketplace liquidity, KYC approvals, dispute arbitration, and audit security logs.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 border border-white/20">
            <Activity className="w-5 h-5 text-[#EF6F79] animate-pulse" />
            <div>
              <span className="furniture-subtitle text-[9px] text-[#EF6F79] block">SYSTEM STATUS</span>
              <span className="text-xs font-mono font-bold text-white">100% OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Core Financial Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 border border-[#070707]/10 space-y-2">
            <span className="furniture-subtitle text-[10px] text-[#070707]/50 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#EF6F79]" /> TOTAL MC CIRCULATION
            </span>
            <p className="text-3xl font-mono font-bold text-[#070707]">{formatCredits(stats.mcCirculation)}</p>
            <span className="text-xs text-[#070707]/60 font-mono">Virtual credit liquidity pool</span>
          </div>

          <div className="bg-white p-6 border border-[#070707]/10 space-y-2">
            <span className="furniture-subtitle text-[10px] text-[#070707]/50 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#EF6F79]" /> PLATFORM ESCROW FEES
            </span>
            <p className="text-3xl font-mono font-bold text-[#EF6F79]">{formatCredits(stats.platformFeesCollected)}</p>
            <span className="text-xs font-mono text-emerald-600 font-semibold">5% revenue margin collected</span>
          </div>

          <div className="bg-white p-6 border border-[#070707]/10 space-y-2">
            <span className="furniture-subtitle text-[10px] text-[#070707]/50 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#070707]" /> PENDING KYC QUEUE
            </span>
            <p className="text-3xl font-mono font-bold text-[#070707]">{stats.pendingKYC}</p>
            <Link to="/admin/kyc" className="furniture-subtitle text-[10px] text-[#EF6F79] hover:underline block">
              REVIEW SUBMISSIONS →
            </Link>
          </div>

          <div className="bg-white p-6 border border-[#070707]/10 space-y-2">
            <span className="furniture-subtitle text-[10px] text-[#070707]/50 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#EF6F79]" /> OPEN BUYER DISPUTES
            </span>
            <p className="text-3xl font-mono font-bold text-[#EF6F79]">{stats.activeDisputes}</p>
            <Link to="/admin/disputes" className="furniture-subtitle text-[10px] text-[#EF6F79] hover:underline block">
              ARBITRATE DISPUTES →
            </Link>
          </div>
        </div>

        {/* Quick Access Navigation Modules */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'USERS', path: '/admin/users', icon: Users },
            { label: 'SELLERS', path: '/admin/sellers', icon: UserCheck },
            { label: 'KYC QUEUE', path: '/admin/kyc', icon: ShieldAlert },
            { label: 'PRODUCTS', path: '/admin/products', icon: Package },
            { label: 'DISPUTES', path: '/admin/disputes', icon: AlertTriangle },
            { label: 'MC CREDITS', path: '/admin/credits', icon: Coins },
          ].map((mod) => {
            const IconComponent = mod.icon
            return (
              <Link
                key={mod.label}
                to={mod.path}
                className="bg-white hover:bg-[#070707] hover:text-white p-4 border border-[#070707]/10 transition-colors flex flex-col items-center text-center gap-2 group"
              >
                <IconComponent className="w-5 h-5 text-[#EF6F79] group-hover:text-white transition-colors" />
                <span className="furniture-subtitle text-[10px]">{mod.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Pending Reports Moderation Table */}
        <div className="bg-white border border-[#070707]/10 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#070707]/10">
            <h3 className="font-serif font-bold text-[#070707] text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#EF6F79]" /> Moderation Queue Reports
            </h3>
            <Link to="/admin/reports" className="furniture-subtitle text-[10px] text-[#EF6F79] hover:underline">
              VIEW ALL REPORTS
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
                <tr>
                  <th className="py-3 px-4">REPORT ID</th>
                  <th className="py-3 px-4">FLAGGED ITEM</th>
                  <th className="py-3 px-4">REPORTER</th>
                  <th className="py-3 px-4">REASON</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#070707]/10">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#F7F7F4]">
                    <td className="py-3.5 px-4 font-mono font-bold text-[10px] text-[#070707]/60">{rep.id}</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-[#070707]">{rep.itemTitle}</td>
                    <td className="py-3.5 px-4 font-mono text-[#070707]/70">{rep.reporter}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-[#F3D6DC]/60 text-[#070707] border border-[#EF6F79]/30">
                        {rep.reason}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-[#070707]/50">{formatDate(rep.date)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/admin/reports"
                        className="px-3 py-1.5 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-[10px] transition-colors inline-block"
                      >
                        REVIEW FLAG
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
