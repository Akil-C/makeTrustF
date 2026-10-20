import { useState, useEffect } from 'react'
import {
  Zap,
  PlusCircle,
  Search,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Eye,
  MousePointer,
} from 'lucide-react'
import adminService from '../../services/adminService'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const MOCK_ADS = [
  { id: 1, title: 'MacBook Pro Super Sale', placement: 'HOMEPAGE_BANNER', status: 'ACTIVE', impressions: 1420, clicks: 124 },
  { id: 2, title: 'Audio Enthusiasts Special Collection', placement: 'CATEGORY_BANNER', status: 'ACTIVE', impressions: 840, clicks: 68 },
]

export default function AdminAds() {
  const [ads, setAds] = useState(MOCK_ADS)
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [title, setTitle] = useState('')
  const [placement, setPlacement] = useState('HOMEPAGE_BANNER')
  const [targetUrl, setTargetUrl] = useState('/')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    async function loadAds() {
      try {
        const res = await adminService.getAds()
        if (res.data?.content?.length > 0) setAds(res.data.content)
      } catch {
        // Fallback default
      }
    }
    loadAds()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const newAd = {
      title,
      placement,
      targetUrl,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE',
    }

    try {
      const res = await adminService.createAd(newAd)
      const created = res.data || { ...newAd, id: Date.now(), impressions: 0, clicks: 0 }
      setAds((prev) => [created, ...prev])
    } catch {
      setAds((prev) => [{ ...newAd, id: Date.now(), impressions: 0, clicks: 0 }, ...prev])
    }
    setShowCreateModal(false)
    setTitle('')
    toast.success('Promoted campaign created and active!')
  }

  const handleDelete = async (id) => {
    try {
      await adminService.deleteAd(id)
      setAds((prev) => prev.filter((a) => a.id !== id))
      toast.success('Campaign removed')
    } catch {
      setAds((prev) => prev.filter((a) => a.id !== id))
      toast.success('Campaign removed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Promoted Media</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <Zap className="w-7 h-7 text-amber-500" />
              <span>Promotions & Banner Campaigns</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Create, schedule, and measure homepage banners and category spotlight promotions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Promotion</span>
          </button>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Campaign Title</th>
                  <th className="py-4 px-4">Placement</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Impressions</th>
                  <th className="py-4 px-4">Clicks (CTR)</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ads.map((a) => {
                  const ctr = a.impressions > 0 ? ((a.clicks / a.impressions) * 100).toFixed(1) : '0.0'
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {a.title}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {a.placement}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {a.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-700">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {a.impressions.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-700">
                        <span className="flex items-center gap-1">
                          <MousePointer className="w-3.5 h-3.5 text-slate-400" />
                          {a.clicks.toLocaleString()} ({ctr}%)
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(a.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete promotion"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-lg text-slate-900">Create Banner Campaign</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Campaign Headline
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Festival Tech Mega Deals"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Placement
                </label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="HOMEPAGE_BANNER">Homepage Hero Banner</option>
                  <option value="CATEGORY_BANNER">Category Top Showcase</option>
                  <option value="SIDEBAR_FEATURE">Discovery Sidebar Spotlight</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Target Destination URL
                </label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="/search?category=1"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
