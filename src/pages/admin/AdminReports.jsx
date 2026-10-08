import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import adminService from '../../services/adminService'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const MOCK_REPORTS = [
  { id: 'rep-101', itemTitle: 'Suspicious Cheap iPhone', reporter: 'john_b', reason: 'SCAM', status: 'PENDING' },
  { id: 'rep-102', itemTitle: 'Prohibited Weapon Replica', reporter: 'sarah_m', reason: 'PROHIBITED_ITEM', status: 'PENDING' },
]

export default function AdminReports() {
  const [reports, setReports] = useState(MOCK_REPORTS)

  const handleResolve = async (id) => {
    try {
      await adminService.resolveReport(id, 'REMOVE_LISTING')
      toast.success('Report resolved!')
      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch {
      setReports((prev) => prev.filter((r) => r.id !== id))
      toast.success('Report resolved!')
    }
  }

  const handleDismiss = async (id) => {
    try {
      await adminService.dismissReport(id)
      toast.success('Report dismissed!')
      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch {
      setReports((prev) => prev.filter((r) => r.id !== id))
      toast.success('Report dismissed!')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <span className="furniture-subtitle text-xs text-[#EF6F79]">FLAGGED CONTENT</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-[#EF6F79]" /> Moderation Reports Queue
          </h1>
          <p className="text-xs text-[#070707]/60 mt-1">
            Review user-reported listings and enforce platform content safety policies.
          </p>
        </div>

        <div className="bg-white border border-[#070707]/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
              <tr>
                <th className="py-4 px-6">REPORT ID</th>
                <th className="py-4 px-4">FLAGGED ITEM</th>
                <th className="py-4 px-4">REPORTER</th>
                <th className="py-4 px-4">REASON</th>
                <th className="py-4 px-6 text-right">MODERATION DECISION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#070707]/10">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-[#F7F7F4]">
                  <td className="py-4 px-6 font-mono font-bold text-[10px] text-[#070707]/60">{r.id}</td>
                  <td className="py-4 px-4 font-serif font-bold text-[#070707] text-sm">{r.itemTitle}</td>
                  <td className="py-4 px-4 font-mono text-[#070707]/70">{r.reporter}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 font-mono text-[10px] font-bold bg-[#F3D6DC]/60 text-[#070707] border border-[#EF6F79]/30">
                      {r.reason}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleResolve(r.id)}
                      className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white furniture-subtitle text-[10px] transition-colors"
                    >
                      REMOVE LISTING
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismiss(r.id)}
                      className="px-3.5 py-1.5 bg-[#F1F1ED] hover:bg-[#E4E5E0] text-[#070707] furniture-subtitle text-[10px] border border-[#070707]/10 transition-colors"
                    >
                      DISMISS
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
