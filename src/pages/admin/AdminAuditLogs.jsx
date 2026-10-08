import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const MOCK_LOGS = [
  { id: 'log-1', admin: 'super_admin', action: 'APPROVE_KYC', target: 'TechHub Deals', ip: '192.168.1.1', date: '2026-10-06T10:30:00Z' },
  { id: 'log-2', admin: 'super_admin', action: 'GRANT_MC', target: 'John Buyer (+500 MC)', ip: '192.168.1.1', date: '2026-10-05T14:15:00Z' },
  { id: 'log-3', admin: 'moderator_2', action: 'BAN_USER', target: 'spam_bot_99', ip: '10.0.0.42', date: '2026-10-04T09:00:00Z' },
]

export default function AdminAuditLogs() {
  const [logs] = useState(MOCK_LOGS)
  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <span className="furniture-subtitle text-xs text-[#EF6F79]">SECURITY LOGS</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-[#EF6F79]" /> Admin Audit Security Logs
          </h1>
          <p className="text-xs text-[#070707]/60 mt-1">
            Immutable log of all administrative actions, ban events, credit minting, and KYC approvals.
          </p>
        </div>

        <div className="bg-white border border-[#070707]/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
              <tr>
                <th className="py-4 px-6">LOG ID</th>
                <th className="py-4 px-4">ADMIN OPERATIVE</th>
                <th className="py-4 px-4">ACTION</th>
                <th className="py-4 px-4">TARGET PAYLOAD</th>
                <th className="py-4 px-4">IP ADDRESS</th>
                <th className="py-4 px-6 text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#070707]/10 font-mono text-xs">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-[#F7F7F4]">
                  <td className="py-4 px-6 text-[#070707]/50">{l.id}</td>
                  <td className="py-4 px-4 font-bold text-[#070707]">{l.admin}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 bg-[#070707] text-white font-bold text-[10px] uppercase">
                      {l.action}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#070707]/80">{l.target}</td>
                  <td className="py-4 px-4 text-[#070707]/50">{l.ip}</td>
                  <td className="py-4 px-6 text-right text-[#070707]/50">{formatDate(l.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
