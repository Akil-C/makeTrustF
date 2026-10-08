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
} from 'lucide-react'
import productService from '../../services/productService'
import { formatCredits, formatDate } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const MOCK_SELLER_PRODUCTS = [
  {
    id: 'f1',
    title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    price: 950,
    category: 'Electronics',
    condition: 'LIKE_NEW',
    status: 'ACTIVE',
    views: 342,
    createdAt: '2026-10-04T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop',
  },
  {
    id: 'f2',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    price: 280,
    category: 'Electronics',
    condition: 'NEW',
    status: 'ACTIVE',
    views: 189,
    createdAt: '2026-10-02T15:30:00Z',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop',
  },
  {
    id: 'f3',
    title: 'MacBook Air M2 16GB / 512GB Space Gray',
    price: 1100,
    category: 'Electronics',
    condition: 'LIKE_NEW',
    status: 'PAUSED',
    views: 512,
    createdAt: '2026-09-25T08:00:00Z',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop',
  },
  {
    id: 'f4',
    title: 'Herman Miller Aeron Ergonomic Chair',
    price: 650,
    category: 'Furniture',
    condition: 'GOOD',
    status: 'SOLD',
    views: 620,
    createdAt: '2026-09-10T11:20:00Z',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&auto=format&fit=crop',
  },
]

export default function SellerProducts() {
  const [products, setProducts] = useState(MOCK_SELLER_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const navigate = useNavigate()

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const res = await productService.getSellerProducts()
        if (res.data?.content?.length > 0) {
          setProducts(res.data.content)
        }
      } catch {
        // Fallback
      } fontFinally: {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleTogglePause = async (id) => {
    try {
      const target = products.find((p) => p.id === id)
      if (target?.status === 'PAUSED') {
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
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#070707]/10 pb-6 gap-4">
          <div>
            <span className="furniture-subtitle text-xs text-[#EF6F79]">STORE INVENTORY</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
              <Package className="w-7 h-7 text-[#EF6F79]" /> Manage Store Inventory
            </h1>
            <p className="text-xs text-[#070707]/60 mt-1">
              Control active Nexora marketplace listings, edit prices, pause items or adjust stock status.
            </p>
          </div>

          <Link
            to="/seller/products/create"
            className="px-6 py-3.5 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW LISTING</span>
          </Link>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 border border-[#070707]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96 flex items-center">
            <Search className="w-4 h-4 text-[#070707]/40 absolute left-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search listings by title..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
            />
          </div>

          <div className="flex bg-[#F1F1ED] p-1 border border-[#070707]/10 overflow-x-auto w-full md:w-auto">
            {['ALL', 'ACTIVE', 'DRAFT', 'PAUSED', 'SOLD'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 text-[11px] font-mono font-bold transition-all whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-[#070707] text-white'
                    : 'text-[#070707]/60 hover:text-[#070707]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Table */}
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
                    <th className="py-4 px-6">PRODUCT</th>
                    <th className="py-4 px-4">PRICE</th>
                    <th className="py-4 px-4">CATEGORY</th>
                    <th className="py-4 px-4">VIEWS</th>
                    <th className="py-4 px-4">STATUS</th>
                    <th className="py-4 px-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#070707]/10">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F7F7F4] transition-colors">
                      <td className="py-4 px-6 flex items-center gap-4">
                        <img src={item.image} alt="" className="w-12 h-12 object-cover bg-[#F1F1ED] border border-[#070707]/10 shrink-0" />
                        <div>
                          <span className="font-serif font-bold text-[#070707] block text-sm">{item.title}</span>
                          <span className="text-[10px] text-[#070707]/50 font-mono">Created {formatDate(item.createdAt)}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-[#EF6F79] text-sm">{formatCredits(item.price)}</td>

                      <td className="py-4 px-4 font-mono text-[#070707]/70">{item.category}</td>

                      <td className="py-4 px-4 font-mono text-[#070707]/60">{item.views}</td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 font-mono text-[10px] font-bold border uppercase ${
                            item.status === 'ACTIVE'
                              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                              : item.status === 'PAUSED'
                              ? 'text-amber-800 bg-amber-50 border-amber-200'
                              : item.status === 'SOLD'
                              ? 'text-gray-800 bg-gray-100 border-gray-200'
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
                          className="p-2 text-[#070707]/60 hover:text-[#070707] hover:bg-[#F1F1ED] transition-colors"
                          title={item.status === 'PAUSED' ? 'Reactivate' : 'Pause Listing'}
                        >
                          {item.status === 'PAUSED' ? <PlayCircle className="w-4 h-4 text-emerald-600" /> : <PauseCircle className="w-4 h-4 text-amber-600" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/seller/products/${item.id}/edit`)}
                          className="p-2 text-[#070707]/60 hover:text-[#070707] hover:bg-[#F1F1ED] transition-colors"
                          title="Edit Listing"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-[#070707]/60 hover:text-red-600 hover:bg-red-50 transition-colors"
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
    </div>
  )
}
