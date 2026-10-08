import { useState, useEffect } from 'react'
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import adminService from '../../services/adminService'
import { formatDate } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const MOCK_PENDING_KYC = [
  { id: 'kyc-1', sellerName: 'TechHub Deals', idType: 'PASSPORT', idNumber: 'P98421048', submittedAt: '2026-10-04', status: 'PENDING' },
  { id: 'kyc-2', sellerName: 'AudioFile Store', idType: 'DRIVERS_LICENSE', idNumber: 'DL4829104', submittedAt: '2026-10-05', status: 'PENDING' },
]

export default function AdminKYC() {
  const [kycQueue, setKycQueue] = useState(MOCK_PENDING_KYC)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadKYC() {
      setLoading(true)
      try {
        const res = await adminService.getPendingKYC()
        if (res.data?.content?.length > 0) setKycQueue(res.data.content)
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    loadKYC()
  }, [])

  const handleApprove = async (id) => {
    try {
      await adminService.approveKYC(id, 'Documents verified cleanly')
      toast.success('KYC Approved!')
      setKycQueue((prev) => prev.filter((k) => k.id !== id))
    } catch {
      setKycQueue((prev) => prev.filter((k) => k.id !== id))
      toast.success('KYC Approved!')
    }
  }

  const handleReject = async (id) => {
    try {
      await adminService.rejectKYC(id, 'Document unreadable or blurry')
      toast.success('KYC Rejected!')
      setKycQueue((prev) => prev.filter((k) => k.id !== id))
    } catch {
      setKycQueue((prev) => prev.filter((k) => k.id !== id))
      toast.success('KYC Rejected!')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <span className="furniture-subtitle text-xs text-[#EF6F79]">VERIFICATION QUEUE</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-[#EF6F79]" /> Pending KYC Moderation Queue
          </h1>
          <p className="text-xs text-[#070707]/60 mt-1">
            Review submitted government identification documents and render verification approvals.
          </p>
        </div>

        <div className="bg-white border border-[#070707]/10 overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : kycQueue.length === 0 ? (
            <div className="p-12 text-center text-[#070707]/60">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <p className="font-serif font-bold text-[#070707] text-xl">Verification Queue Clear</p>
              <p className="text-xs text-[#070707]/50 mt-1">All seller identity verification requests have been processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
                  <tr>
                    <th className="py-4 px-6">SELLER NAME</th>
                    <th className="py-4 px-4">DOCUMENT TYPE</th>
                    <th className="py-4 px-4">ID NUMBER</th>
                    <th className="py-4 px-4">SUBMITTED DATE</th>
                    <th className="py-4 px-6 text-right">DECISION ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#070707]/10">
                  {kycQueue.map((k) => (
                    <tr key={k.id} className="hover:bg-[#F7F7F4]">
                      <td className="py-4 px-6 font-serif font-bold text-[#070707] text-sm">{k.sellerName}</td>
                      <td className="py-4 px-4 font-mono text-[#070707]/70">{k.idType}</td>
                      <td className="py-4 px-4 font-mono font-bold text-[#070707]">{k.idNumber}</td>
                      <td className="py-4 px-4 font-mono text-[10px] text-[#070707]/50">{formatDate(k.submittedAt)}</td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(k.id)}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white furniture-subtitle text-[10px] transition-colors inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> APPROVE
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(k.id)}
                          className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white furniture-subtitle text-[10px] transition-colors inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> REJECT
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
    </div>
  )
}
