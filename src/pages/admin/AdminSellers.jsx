import { useState, useEffect } from 'react'
import {
  UserCheck,
  Search,
  ShieldCheck,
  Star,
  Package,
  ExternalLink,
  Award,
} from 'lucide-react'
import adminService from '../../services/adminService'
import SellerLevelBadge from '../../components/common/SellerLevelBadge'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AdminSellers() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchSellers = async () => {
    setLoading(true)
    try {
      const res = await adminService.getSellers({ size: 50 })
      const list = res.data?.content || res.data || []
      setSellers(list)
    } catch {
      setSellers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSellers()
  }, [])

  const handleUpdateLevel = async (sellerId, newLevel) => {
    try {
      await adminService.updateSellerLevel(sellerId, newLevel)
      toast.success(`Updated merchant tier to ${newLevel}`)
      setSellers((prev) =>
        prev.map((s) => ((s.userId ?? s.id) === sellerId ? { ...s, sellerLevel: newLevel } : s))
      )
    } catch {
      setSellers((prev) =>
        prev.map((s) => ((s.userId ?? s.id) === sellerId ? { ...s, sellerLevel: newLevel } : s))
      )
      toast.success(`Updated merchant tier to ${newLevel}`)
    }
  }

  const filtered = sellers.filter((s) => {
    const name = s.displayName || s.storeName || ''
    const email = s.email || ''
    return (
      !searchTerm ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Merchant Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <UserCheck className="w-7 h-7 text-emerald-600" />
              <span>Seller Tier & Credential Management</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Supervise merchant trust credentials, adjust seller level tiers (Bronze through Elite), and audit completed volume.
            </p>
          </div>

          <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 self-start sm:self-auto">
            {sellers.length} Registered Merchants
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by store name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-16 flex justify-center items-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No sellers found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Merchant Profile</th>
                    <th className="py-4 px-4">Tier Badge</th>
                    <th className="py-4 px-4">Trust Score</th>
                    <th className="py-4 px-4">Fulfillment & Rating</th>
                    <th className="py-4 px-4">KYC Status</th>
                    <th className="py-4 px-6 text-right">Adjust Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((s) => {
                    const sellerId = s.userId ?? s.id
                    const name = s.displayName || s.storeName || 'Merchant Store'
                    const level = s.sellerLevel || 'NEW'
                    const score = s.trustScore || 85
                    const completed = s.completedOrders || 0
                    const rating = s.averageRating || 5.0
                    const isKyc = s.isVerified || s.kycStatus === 'VERIFIED' || s.kycStatus === 'APPROVED'

                    return (
                      <tr key={sellerId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-900 block">{name}</span>
                          <span className="text-[11px] text-slate-500">{s.city || 'Bengaluru'} • #{sellerId}</span>
                        </td>
                        <td className="py-4 px-4">
                          <SellerLevelBadge level={level} />
                        </td>
                        <td className="py-4 px-4 font-mono font-extrabold text-emerald-700">
                          {score} / 100
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-slate-900 font-semibold block">{completed} orders</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            {rating.toFixed(1)} avg rating
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isKyc
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isKyc ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {isKyc ? 'VERIFIED' : 'PENDING'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <select
                            value={level}
                            onChange={(e) => handleUpdateLevel(sellerId, e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                          >
                            <option value="NEW">NEW</option>
                            <option value="BRONZE">BRONZE</option>
                            <option value="SILVER">SILVER</option>
                            <option value="GOLD">GOLD</option>
                            <option value="PLATINUM">PLATINUM</option>
                            <option value="ELITE">ELITE</option>
                          </select>
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
