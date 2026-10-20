import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  Check,
  Ban,
} from 'lucide-react'
import adminService from '../../services/adminService'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await adminService.getReports({ size: 50 })
      const list = res.data?.content || res.data || []
      setReports(list)
    } catch {
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleResolve = async (id) => {
    try {
      await adminService.resolveReport(id, { resolution: 'RESOLVED', actionTaken: 'Listing reviewed and actioned' })
      toast.success('Report marked as resolved')
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'RESOLVED' } : r)))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve report')
    }
  }

  const handleDismiss = async (id) => {
    try {
      await adminService.rejectReport(id, 'Deemed compliant with marketplace policies')
      toast.success('Report dismissed as non-violating')
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r)))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dismiss report')
    }
  }

  const filtered = reports.filter((r) => {
    const matchSearch =
      !searchTerm ||
      r.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportedProduct?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reporter?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content & Fraud Safety</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <ShieldAlert className="w-7 h-7 text-rose-600" />
              <span>Moderation & Incident Reports</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Triage user reports against fraud, counterfeit listings, prohibited categories, and off-platform payment attempts.
            </p>
          </div>

          <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 self-start sm:self-auto">
            {reports.length} Total Incidents Logged
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by reason, item, or reporter..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-16 flex justify-center items-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <span className="font-bold text-slate-800 block">Queue Clear</span>
              <span>No incident reports pending in this filter category.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Incident ID</th>
                    <th className="py-4 px-4">Violation Reason</th>
                    <th className="py-4 px-4">Subject</th>
                    <th className="py-4 px-4">Reporter</th>
                    <th className="py-4 px-4">AI Risk Score</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Moderator Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((r) => {
                    const subject = r.reportedProduct?.title || r.reportedUser?.name || 'Platform Entity'
                    const reporter = r.reporter?.name || 'Anonymous'

                    return (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-slate-900">
                          #{r.id}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-xs">
                            {r.reason || 'SUSPICIOUS'}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900 max-w-xs truncate">
                          {subject}
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-medium">
                          {reporter}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              (r.aiRiskScore || 0) > 70
                                ? 'bg-rose-100 text-rose-800'
                                : (r.aiRiskScore || 0) > 30
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {r.aiRiskScore || 15} / 100
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                            {r.status || 'OPEN'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          {r.status !== 'RESOLVED' && (
                            <button
                              type="button"
                              onClick={() => handleResolve(r.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Action & Resolve</span>
                            </button>
                          )}
                          {r.status !== 'REJECTED' && (
                            <button
                              type="button"
                              onClick={() => handleDismiss(r.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Dismiss</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
