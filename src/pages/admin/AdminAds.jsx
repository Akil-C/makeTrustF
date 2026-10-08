import { useState } from 'react'
import { Zap } from 'lucide-react'
import adminService from '../../services/adminService'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const MOCK_ADS = [
  { id: 'ad-1', productTitle: 'Sony WH-1000XM5 Headphones', sellerName: 'AudioFile Store', durationDays: 7, status: 'PENDING' },
]

export default function AdminAds() {
  const [ads, setAds] = useState(MOCK_ADS)

  const handleApprove = async (id) => {
    try {
      await adminService.approveAd(id)
      toast.success('Ad campaign approved!')
      setAds((prev) => prev.filter((a) => a.id !== id))
    } catch {
      setAds((prev) => prev.filter((a) => a.id !== id))
      toast.success('Ad campaign approved!')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <span className="furniture-subtitle text-xs text-[#EF6F79]">PROMOTIONS</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
            <Zap className="w-7 h-7 text-[#EF6F79]" /> Promoted Campaign Moderation
          </h1>
          <p className="text-xs text-[#070707]/60 mt-1">
            Review and approve seller campaign requests for homepage and discovery stage featured placement.
          </p>
        </div>

        <div className="bg-white border border-[#070707]/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
              <tr>
                <th className="py-4 px-6">AD ID</th>
                <th className="py-4 px-4">PROMOTED LISTING</th>
                <th className="py-4 px-4">SELLER STORE</th>
                <th className="py-4 px-4">DURATION</th>
                <th className="py-4 px-6 text-right">APPROVAL DECISION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#070707]/10">
              {ads.map((a) => (
                <tr key={a.id} className="hover:bg-[#F7F7F4]">
                  <td className="py-4 px-6 font-mono font-bold text-[10px] text-[#070707]/60">{a.id}</td>
                  <td className="py-4 px-4 font-serif font-bold text-[#070707] text-sm">{a.productTitle}</td>
                  <td className="py-4 px-4 font-mono text-[#070707]/70">{a.sellerName}</td>
                  <td className="py-4 px-4 font-mono font-bold text-[#070707]">{a.durationDays} Days</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleApprove(a.id)}
                      className="px-3.5 py-1.5 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-[10px] transition-colors"
                    >
                      APPROVE PROMOTION
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
