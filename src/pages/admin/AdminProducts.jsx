import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Search,
  Trash2,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import adminService from '../../services/adminService'
import { formatCredits } from '../../utils/formatters'
import { getProductImage } from '../../utils/productsData'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await adminService.getProducts({ size: 50 })
      const list = res.data?.content || res.data || []
      setProducts(list)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleRemove = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove and hide "${title}" from the public marketplace?`)) {
      return
    }

    try {
      await adminService.removeProduct(id, 'Moderator policy enforcement')
      toast.success('Listing deactivated from catalog')
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'HIDDEN' } : p)))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove product')
    }
  }

  const filtered = products.filter((p) => {
    const matchSearch =
      !searchTerm ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.seller?.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter
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
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog Compliance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <Package className="w-7 h-7 text-rose-600" />
              <span>Listing Moderation Console</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Audit active seller listings across categories, verify product descriptions, and enforce fraud prevention guidelines.
            </p>
          </div>

          <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 self-start sm:self-auto">
            {products.length} Total Registered Listings
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or seller..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['ALL', 'ACTIVE', 'HIDDEN', 'SOLD'].map((st) => (
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
                {st}
              </button>
            ))}
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
              No product listings found matching your search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Product Details</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Condition</th>
                    <th className="py-4 px-4">Merchant</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p) => {
                    const price = p.priceInCredits ?? p.price ?? 0
                    const sellerName = p.seller?.displayName || p.sellerName || 'Verified Merchant'
                    const image = getProductImage(p)

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={image}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = getProductImage(p)
                              }}
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate max-w-xs">{p.title}</span>
                              <span className="text-[11px] text-slate-500">{p.city || 'Bengaluru'} • #{p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          {formatCredits(price)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                            {p.condition || 'GOOD'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-700 font-medium">
                          {sellerName}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              p.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : p.status === 'SOLD'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/products/${p.id}`}
                              target="_blank"
                              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Inspect listing page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {p.status !== 'HIDDEN' && (
                              <button
                                type="button"
                                onClick={() => handleRemove(p.id, p.title)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hide</span>
                              </button>
                            )}
                          </div>
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
