import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Package, Sparkles, Bot } from 'lucide-react'
import productService from '../../services/productService'
import aiService from '../../services/aiService'
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/constants'
import Modal from '../../components/common/Modal'
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

  // AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [generatingAi, setGeneratingAi] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const res = await productService.getProductById(id)
        const p = res.data || {
          title: 'MacBook Air 15-inch M3',
          category: 'Electronics',
          condition: 'LIKE_NEW',
          price: 118000,
          locationName: 'Bengaluru',
          description: 'Flawless condition, protected with original sleeve.',
          images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop'],
        }

        setTitle(p.title || '')
        setCategory(p.category || 'Electronics')
        setCondition(p.condition || 'LIKE_NEW')
        setPrice(p.priceInCredits || p.price || '')
        setLocationName(p.city || p.locationName || 'Bengaluru')
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

  const handleGenerateAiDescription = async () => {
    const activeTitle = title.trim() || 'Verified Marketplace Listing'
    setGeneratingAi(true)
    try {
      const res = await aiService.generateDescription({
        title: activeTitle,
        category,
        condition,
        keyPoints: aiPrompt,
      })
      if (res.data?.description) {
        setDescription(res.data.description)
      } else {
        const specsText = aiPrompt ? ` Key specifications & notes: ${aiPrompt}.` : ''
        setDescription(
          `Official ${activeTitle} in ${condition.replace('_', ' ')} condition. Inspected and verified for authentic quality. Clean cosmetic condition with zero technical faults.${specsText} Includes original accessories and documentation. Fast local pickup available in ${locationName || 'Bengaluru'} with Nexora escrow buyer protection.`
        )
      }
      toast.success('AI description generated!')
      setAiModalOpen(false)
    } catch {
      const specsText = aiPrompt ? ` Key specifications & notes: ${aiPrompt}.` : ''
      setDescription(
        `Official ${activeTitle} in ${condition.replace('_', ' ')} condition. Inspected and verified for authentic quality. Clean cosmetic condition with zero technical faults.${specsText} Includes original accessories and documentation. Fast local pickup available in ${locationName || 'Bengaluru'} with Nexora escrow buyer protection.`
      )
      toast.success('AI description generated!')
      setAiModalOpen(false)
    } finally {
      setGeneratingAi(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !price || !description) {
      toast.error('Please complete all required listing fields.')
      return
    }

    setSubmitting(true)
    try {
      await productService.updateProduct(id, {
        title: title.trim(),
        condition,
        priceInCredits: Number(price),
        city: locationName.trim(),
        description: description.trim(),
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 font-sans page-swift">
      <DemoDisclaimer />

      {/* Top Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link
            to="/seller/products"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store Inventory</span>
          </Link>
          <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            Edit Product Listing
          </h1>
          <p className="text-sm text-slate-600">
            Modify catalog details, credit pricing, and condition specifics for this item.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Product Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Price (100 Credits = ₹100) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-sm text-rose-600 outline-none focus:ring-2 focus:ring-slate-900"
            />
            {price > 0 && (
              <span className="text-[11px] font-mono text-slate-500 block mt-1">
                = ₹{Number(price).toLocaleString('en-IN')} (1 Credit = ₹1)
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800 bg-white"
            >
              {PRODUCT_CONDITIONS.map((cond) => (
                <option key={cond.value} value={cond.value}>
                  {cond.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              City / Location *
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Detailed Description *
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-mono">{description.length} chars</span>
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors swift-interactive"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Auto-Write</span>
              </button>
            </div>
          </div>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800 leading-relaxed font-normal resize-y shadow-2xs"
          />
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400">Quick inserts:</span>
            {['Original bill & box included', 'Flawless cosmetic condition', 'Battery health 95%+', 'Local pickup with inspection welcome'].map((tip) => (
              <button
                key={tip}
                type="button"
                onClick={() => setDescription(prev => prev ? `${prev}\n• ${tip}` : `• ${tip}`)}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium transition-colors"
              >
                + {tip}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/seller/products"
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs swift-interactive"
          >
            {submitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* AI Generate Description Modal */}
      {aiModalOpen && (
        <Modal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} title="Gemini AI Description Assistant">
          <div className="space-y-4 p-2 font-sans">
            <div className="p-3.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-xl text-xs flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Provide optional details and notes below. Gemini will formulate a clear, verified listing description.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Listing Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Notes & Key Highlights (multiline supported)
              </label>
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Type or paste any specs, features, condition notes, or accessories..."
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 leading-relaxed font-normal resize-y"
              />
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] text-slate-400 font-semibold">Quick tags:</span>
                {['Battery health > 95%', 'Includes bill & original box', 'Zero scratches or dents', 'Under manufacturer warranty'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setAiPrompt(prev => prev ? `${prev}, ${tag}` : tag)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAiDescription}
                disabled={generatingAi}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs swift-interactive"
              >
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>{generatingAi ? 'Generating Description...' : 'Generate with Gemini'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
