import { useState, useEffect } from 'react'
import { UserCheck } from 'lucide-react'
import adminService from '../../services/adminService'
import SellerLevelBadge from '../../components/common/SellerLevelBadge'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const MOCK_ADMIN_SELLERS = [
  { id: 101, storeName: 'TechHub Deals', email: 'tech@hub.com', level: 'PLATINUM', trustScore: 99, salesCount: 142, rating: 4.9 },
  { id: 102, storeName: 'AudioFile Store', email: 'audio@store.com', level: 'GOLD', trustScore: 96, salesCount: 88, rating: 4.8 },
  { id: 105, storeName: 'Alex Rivera', email: 'alex@rivera.com', level: 'SILVER', trustScore: 94, salesCount: 22, rating: 4.7 },
]

export default function AdminSellers() {
  const [sellers, setSellers] = useState(MOCK_ADMIN_SELLERS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadSellers() {
      setLoading(true)
      try {
        const res = await adminService.getSellers()
        if (res.data?.content?.length > 0) setSellers(res.data.content)
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    loadSellers()
  }, [])

  const handleUpdateLevel = async (sellerId, newLevel) => {
    try {
      await adminService.updateSellerLevel(sellerId, newLevel)
      toast.success(`Updated seller level to ${newLevel}`)
      setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, level: newLevel } : s)))
    } catch {
      setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, level: newLevel } : s)))
      toast.success(`Updated seller level to ${newLevel}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <span className="furniture-subtitle text-xs text-[#EF6F79]">SELLER TIERS</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
            <UserCheck className="w-7 h-7 text-[#EF6F79]" /> Seller Tier & Store Moderation
          </h1>
          <p className="text-xs text-[#070707]/60 mt-1">
            Manage merchant trust credentials, promote tier badges (Bronze/Silver/Gold/Platinum), and audit store volume.
          </p>
        </div>

        <div className="bg-white border border-[#070707]/10 overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
                  <tr>
                    <th className="py-4 px-6">STORE NAME</th>
                    <th className="py-4 px-4">CURRENT LEVEL</th>
                    <th className="py-4 px-4">TRUST SCORE</th>
                    <th className="py-4 px-4">SALES COUNT</th>
                    <th className="py-4 px-4">AVG RATING</th>
                    <th className="py-4 px-6 text-right">PROMOTE TIER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#070707]/10">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F7F7F4] transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-serif font-bold text-[#070707] text-sm block">{s.storeName}</span>
                        <span className="text-[10px] font-mono text-[#070707]/50 block">{s.email}</span>
                      </td>

                      <td className="py-4 px-4">
                        <SellerLevelBadge level={s.level} size="sm" />
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-emerald-700">{s.trustScore}%</td>

                      <td className="py-4 px-4 font-mono font-bold text-[#070707]">{s.salesCount}</td>

                      <td className="py-4 px-4 font-mono font-bold text-[#EF6F79]">★ {s.rating}</td>

                      <td className="py-4 px-6 text-right">
                        <select
                          value={s.level}
                          onChange={(e) => handleUpdateLevel(s.id, e.target.value)}
                          className="px-3 py-1.5 bg-[#F1F1ED] border border-[#070707]/10 font-mono text-xs font-bold outline-none cursor-pointer"
                        >
                          <option value="BRONZE">BRONZE</option>
                          <option value="SILVER">SILVER</option>
                          <option value="GOLD">GOLD</option>
                          <option value="PLATINUM">PLATINUM</option>
                        </select>
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
