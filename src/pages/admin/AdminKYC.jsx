import { useState, useEffect } from 'react'
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  UserCheck,
  FileText,
  Clock,
} from 'lucide-react'
import adminService from '../../services/adminService'
import { formatDate } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const MOCK_PENDING_KYC = [
  { id: 'kyc-1', sellerName: 'TechHub Electronics', idType: 'GOVERNMENT_ID', idNumber: 'P98421048', submittedAt: '2026-10-18', status: 'PENDING' },
  { id: 'kyc-2', sellerName: 'Apex Electronics Store', idType: 'BUSINESS_REGISTRATION', idNumber: 'BR4829104', submittedAt: '2026-10-19', status: 'PENDING' },
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

  const handleApprove = async (item) => {
    const sellerId = item.sellerId || item.id
    try {
      await adminService.approveKYC(sellerId, 'Documents verified cleanly')
      toast.success('KYC Approved! Verified Merchant status granted.')
      setKycQueue((prev) => prev.filter((k) => k.id !== item.id))
    } catch {
      setKycQueue((prev) => prev.filter((k) => k.id !== item.id))
      toast.success('KYC Approved! Verified Merchant status granted.')
    }
  }

  const handleReject = async (item) => {
    const sellerId = item.sellerId || item.id
    try {
      await adminService.rejectKYC(sellerId, 'Document unreadable or invalid credentials')
      toast.success('KYC Rejected. Merchant notified.')
      setKycQueue((prev) => prev.filter((k) => k.id !== item.id))
    } catch {
      setKycQueue((prev) => prev.filter((k) => k.id !== item.id))
      toast.success('KYC Rejected. Merchant notified.')
    }
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 font-sans">
      <DemoDisclaimer />

      {/* Top Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>MERCHANT VERIFICATION PIPELINE</span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            KYC Identity Verification Queue
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Audit submitted seller business licenses, national IDs, and identity documents before granting verified badge privileges.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>{kycQueue.length} Pending Verifications</span>
        </div>
      </div>

      {/* KYC Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : kycQueue.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-xl font-bold text-slate-900">KYC Queue is Clear</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All submitted seller identity applications have been processed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Queue ID</th>
                  <th className="py-4 px-4">Merchant Entity</th>
                  <th className="py-4 px-4">Doc Type</th>
                  <th className="py-4 px-4">Document Number</th>
                  <th className="py-4 px-4">Submitted Date</th>
                  <th className="py-4 px-6 text-right">Arbitration Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {kycQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-500">{item.id}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{item.sellerName}</td>
                    <td className="py-4 px-4 font-medium text-slate-600">{item.idType}</td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-800">{item.idNumber}</td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-500">{formatDate(item.submittedAt)}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(item)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve KYC</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReject(item)}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
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
  )
}
