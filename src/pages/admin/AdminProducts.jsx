import { useState } from 'react'
import { Package } from 'lucide-react'
import adminService from '../../services/adminService'
import { formatCredits } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const MOCK_ADMIN_PRODUCTS = [
  { id: 'f1', title: 'iPhone 15 Pro Max 256GB', price: 950, category: 'Electronics', sellerName: 'TechHub Deals', status: 'ACTIVE' },
  { id: 'f2', title: 'Sony WH-1000XM5 Headphones', price: 280, category: 'Electronics', sellerName: 'AudioFile Store', status: 'ACTIVE' },
]

export default function AdminProducts() {
  const [products, setProducts] = useState(MOCK_ADMIN_PRODUCTS)

  const handleRemove = async (id) => {
    try {
      await adminService.removeProduct(id, 'Policy violation')
      toast.success('Product removed')
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Product removed')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <span className="furniture-subtitle text-xs text-[#EF6F79]">CATALOG MODERATION</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
            <Package className="w-7 h-7 text-[#EF6F79]" /> Admin Product Catalog Moderation
          </h1>
          <p className="text-xs text-[#070707]/60 mt-1">
            Audit and moderate active marketplace product listings across all store vendors.
          </p>
        </div>

        <div className="bg-white border border-[#070707]/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
              <tr>
                <th className="py-4 px-6">PRODUCT TITLE</th>
                <th className="py-4 px-4">PRICE</th>
                <th className="py-4 px-4">SELLER</th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#070707]/10">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#F7F7F4]">
                  <td className="py-4 px-6 font-serif font-bold text-[#070707] text-sm">{p.title}</td>
                  <td className="py-4 px-4 font-mono font-bold text-[#EF6F79] text-sm">{formatCredits(p.price)}</td>
                  <td className="py-4 px-4 font-mono text-[#070707]/70">{p.sellerName}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(p.id)}
                      className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white furniture-subtitle text-[10px] transition-colors"
                    >
                      REMOVE LISTING
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
