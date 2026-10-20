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
  Layers,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
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
  { id: 'rep-1', itemTitle: 'Suspicious iPhone 15 Listing', reporter: 'alex_buyer', reason: 'SCAM', status: 'PENDING', date: '2026-10-18' },
  { id: 'rep-2', itemTitle: 'Off-Platform Direct Payment Request', reporter: 'sarah_m', reason: 'OFF_PLATFORM_PAYMENT', status: 'PENDING', date: '2026-10-19' },
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
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 font-sans">
      <DemoDisclaimer />

      {/* Top Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>SUPER ADMIN OPERATIONS CONSOLE</span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            Nexora Platform Control
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Oversee marketplace liquidity, arbitrate buyer disputes, inspect KYC identity queues, and audit platform security events.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 px-4 py-3 rounded-2xl border border-emerald-200/80 shadow-xs">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              SYSTEM INTEGRITY
            </div>
            <div className="text-xs font-mono font-bold text-emerald-900">
              100% OPERATIONAL
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Financial & Moderation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>MC CIRCULATION</span>
          </span>
          <p className="text-3xl font-mono font-black text-slate-900">
            {formatCredits(stats.mcCirculation)}
          </p>
          <div className="text-xs text-slate-500 font-medium">Platform virtual liquidity reserve</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>ESCROW REVENUE</span>
          </span>
          <p className="text-3xl font-mono font-black text-emerald-600">
            {formatCredits(stats.platformFeesCollected)}
          </p>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>5% platform commission fees</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>PENDING KYC QUEUE</span>
          </span>
          <p className="text-3xl font-mono font-black text-slate-900">
            {stats.pendingKYC}
          </p>
          <Link
            to="/admin/kyc"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 pt-1"
          >
            <span>Review Verifications</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>OPEN DISPUTES</span>
          </span>
          <p className="text-3xl font-mono font-black text-rose-600">
            {stats.activeDisputes}
          </p>
          <Link
            to="/admin/disputes"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 pt-1"
          >
            <span>Arbitrate Cases</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Navigation Control Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Users', path: '/admin/users', icon: Users, desc: 'Manage Accounts' },
          { label: 'Sellers', path: '/admin/sellers', icon: UserCheck, desc: 'Merchant Registry' },
          { label: 'KYC Queue', path: '/admin/kyc', icon: ShieldAlert, desc: 'Identity Checks' },
          { label: 'Products', path: '/admin/products', icon: Package, desc: 'Moderation' },
          { label: 'Disputes', path: '/admin/disputes', icon: AlertTriangle, desc: 'Resolution' },
          { label: 'MC Economy', path: '/admin/credits', icon: Coins, desc: 'Grant / Adjust' },
        ].map((mod) => {
          const IconComponent = mod.icon
          return (
            <Link
              key={mod.label}
              to={mod.path}
              className="bg-white hover:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 hover:border-slate-900 transition-all flex flex-col items-center text-center gap-2 group shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition-colors">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-900 group-hover:text-white transition-colors">
                {mod.label}
              </div>
              <div className="text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors">
                {mod.desc}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Moderation Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-0">
        <div className="p-6 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Moderation Queue & User Flags</span>
            </h3>
            <p className="text-xs text-slate-500">Flagged listings and suspicious communication activities</p>
          </div>
          <Link
            to="/admin/reports"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>View All Reports</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Report ID</th>
                <th className="py-3.5 px-5">Flagged Item</th>
                <th className="py-3.5 px-5">Reporter</th>
                <th className="py-3.5 px-5">Flag Reason</th>
                <th className="py-3.5 px-5">Logged Date</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-mono font-bold text-slate-500">{rep.id}</td>
                  <td className="py-4 px-5 font-semibold text-slate-900">{rep.itemTitle}</td>
                  <td className="py-4 px-5 font-mono text-slate-600">{rep.reporter}</td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
                      {rep.reason}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-slate-500">{formatDate(rep.date)}</td>
                  <td className="py-4 px-5 text-right">
                    <Link
                      to="/admin/reports"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-white font-semibold text-xs transition-colors inline-block shadow-xs"
                    >
                      Arbitrate Flag
                    </Link>
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
