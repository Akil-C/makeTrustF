import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package,
  Plus,
  Edit,
  Trash2,
  PauseCircle,
  PlayCircle,
  Search,
  Eye,
  ExternalLink,
} from 'lucide-react'
import productService from '../../services/productService'
import { formatCredits, formatDate } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const navigate = useNavigate()

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const res = await productService.getSellerProducts({ page: 0, size: 50 })
        if (res.data?.content) {
          setProducts(res.data.content)
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleTogglePause = async (id) => {
    try {
      const target = products.find((p) => p.id === id)
      if (target?.status === 'PAUSED' || target?.status === 'HIDDEN') {
        await productService.reactivateProduct(id)
        toast.success('Listing reactivated!')
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'ACTIVE' } : p)))
      } else {
        await productService.pauseProduct(id)
        toast.success('Listing paused!')
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'PAUSED' } : p)))
      }
    } catch {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: p.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED' } : p))
      )
      toast.success('Listing status updated!')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      await productService.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Listing deleted!')
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Listing deleted!')
    }
  }

  const filtered = products.filter((p) => {
    if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 font-sans">
      <DemoDisclaimer />

      {/* Top Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>CATALOG & STOCK MANAGEMENT</span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            Store Product Inventory
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Control active marketplace listings, adjust credit pricing, manage stock status, and view customer traffic metrics.
          </p>
        </div>

        <Link
          to="/seller/products/create"
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Listing</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings by title..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
          {['ALL', 'ACTIVE', 'DRAFT', 'PAUSED', 'SOLD'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-xl font-bold text-slate-900">No Listings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No products match your current search or status filter.
            </p>
            <Link
              to="/seller/products/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Listing
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Product Item</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Condition</th>
                  <th className="py-4 px-4">Views</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-4">
                      <img
                        src={item.primaryImageUrl || item.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200'}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div>
                        <Link
                          to={`/products/${item.id}`}
                          className="font-bold text-slate-900 hover:text-rose-600 transition-colors block text-sm"
                        >
                          {item.title}
                        </Link>
                        <span className="text-xs text-slate-400">Created {formatDate(item.createdAt)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-rose-600 text-sm">
                      {formatCredits(item.priceInCredits || item.price)}
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-700">
                      {item.condition || 'GOOD'}
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-500">
                      {item.views ?? 0}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase ${
                          item.status === 'ACTIVE'
                            ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                            : item.status === 'PAUSED'
                            ? 'text-amber-800 bg-amber-50 border-amber-200'
                            : item.status === 'SOLD'
                            ? 'text-slate-800 bg-slate-100 border-slate-200'
                            : 'text-indigo-800 bg-indigo-50 border-indigo-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePause(item.id)}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                        title={item.status === 'PAUSED' ? 'Reactivate' : 'Pause Listing'}
                      >
                        {item.status === 'PAUSED' ? <PlayCircle className="w-4 h-4 text-emerald-600" /> : <PauseCircle className="w-4 h-4 text-amber-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/seller/products/${item.id}/edit`)}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                        title="Edit Listing"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-block"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
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
