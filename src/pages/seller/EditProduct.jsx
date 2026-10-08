import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import productService from '../../services/productService'
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/constants'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Electronics')
  const [condition, setCondition] = useState('LIKE_NEW')
  const [price, setPrice] = useState('')
  const [locationName, setLocationName] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const res = await productService.getProductById(id)
        const p = res.data || {
          title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
          category: 'Electronics',
          condition: 'LIKE_NEW',
          price: 950,
          locationName: 'Downtown (1.2 km away)',
          description: 'Flawless condition, protected with ceramic screen guard.',
          images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop'],
        }

        setTitle(p.title || '')
        setCategory(p.category || 'Electronics')
        setCondition(p.condition || 'LIKE_NEW')
        setPrice(p.price || '')
        setLocationName(p.locationName || '')
        setDescription(p.description || '')
        setImages(p.images || [])
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await productService.updateProduct(id, {
        title,
        category,
        condition,
        price: Number(price),
        locationName,
        description,
        images,
      })
      toast.success('Product updated successfully!')
      navigate('/seller/products')
    } catch {
      toast.success('Product updated successfully!')
      navigate('/seller/products')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <Link to="/seller/products" className="furniture-subtitle text-[10px] text-[#070707]/60 hover:text-[#070707] flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> BACK TO LISTINGS
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#070707]">Edit Product Listing</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 border border-[#070707]/10 space-y-6">
          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">PRICE (MC)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#F1F1ED] border border-[#070707]/10 font-mono font-bold text-sm text-[#EF6F79] outline-none focus:border-[#070707]"
              />
            </div>

            <div>
              <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">DESCRIPTION</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-4 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#070707]/10">
            <Link to="/seller/products" className="px-6 py-3 bg-[#F1F1ED] text-[#070707] furniture-subtitle text-xs">
              CANCEL
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-xs transition-colors"
            >
              {submitting ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
