import { useState } from 'react'
import { ShieldAlert, Search, Filter } from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const MOCK_LOGS = [
  { id: 'LOG-8812', admin: 'system_admin', action: 'APPROVE_KYC', target: 'TechHub Official (#2)', ip: '127.0.0.1', date: '2026-10-20T12:55:00Z' },
  { id: 'LOG-8811', admin: 'system_admin', action: 'GRANT_CREDITS', target: 'David Buyer (+10,000 MC)', ip: '127.0.0.1', date: '2026-10-20T11:40:00Z' },
  { id: 'LOG-8810', admin: 'system_admin', action: 'MINT_GENESIS_CATALOG', target: '21 Verified Products Live', ip: '127.0.0.1', date: '2026-10-20T10:15:00Z' },
  { id: 'LOG-8809', admin: 'moderator_desk', action: 'RESOLVE_DISPUTE', target: 'Order #ORD-7712 (Favor Buyer)', ip: '10.0.4.12', date: '2026-10-19T18:22:00Z' },
]

export default function AdminAuditLogs() {
  const [logs] = useState(MOCK_LOGS)
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = logs.filter(
    (l) =>
      !searchTerm ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.target.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <ShieldAlert className="w-7 h-7 text-slate-900" />
              <span>Immutable Administrative Audit Trail</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Cryptographically signed log of all administrative actions, KYC decisions, wallet adjustments, and moderation events.
            </p>
          </div>

          <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 self-start sm:self-auto">
            {logs.length} Immutable Records
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter audit logs..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Event ID</th>
                  <th className="py-4 px-4">Operator</th>
                  <th className="py-4 px-4">Action</th>
                  <th className="py-4 px-4">Target Entity</th>
                  <th className="py-4 px-4">Client IP</th>
                  <th className="py-4 px-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-500">
                      {l.id}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {l.admin}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold tracking-wide">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {l.target}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500 text-xs">
                      {l.ip}
                    </td>
                    <td className="py-4 px-6 text-right text-slate-500 font-mono text-xs">
                      {formatDate(l.date)}
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
