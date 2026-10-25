import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Upload,
  Sparkles,
  ArrowLeft,
  X,
  Bot,
  Package,
  MapPin,
  Crosshair,
} from 'lucide-react'
import productService from '../../services/productService'
import aiService from '../../services/aiService'
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/constants'
import Modal from '../../components/common/Modal'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const CITY_COORDINATES = {
  Bengaluru: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  Mumbai: { lat: 19.076, lng: 72.8777, state: 'Maharashtra' },
  Delhi: { lat: 28.6139, lng: 77.209, state: 'Delhi' },
  Hyderabad: { lat: 17.385, lng: 78.4867, state: 'Telangana' },
  Chennai: { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  Pune: { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  'San Francisco': { lat: 37.7749, lng: -122.4194, state: 'California' },
}

export default function CreateProduct() {
  const navigate = useNavigate()

  // Form State
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('1')
  const [condition, setCondition] = useState('LIKE_NEW')
  const [price, setPrice] = useState('')
  const [brand, setBrand] = useState('')
  const [city, setCity] = useState('Bengaluru')
  const [stateName, setStateName] = useState('Karnataka')
  const [latitude, setLatitude] = useState(12.9716)
  const [longitude, setLongitude] = useState(77.5946)
  const [description, setDescription] = useState('')
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop',
  ])
  const [submitting, setSubmitting] = useState(false)

  // AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [generatingAi, setGeneratingAi] = useState(false)

  const handleCityChange = (cityName) => {
    setCity(cityName)
    const match = CITY_COORDINATES[cityName]
    if (match) {
      setLatitude(match.lat)
      setLongitude(match.lng)
      setStateName(match.state)
    }
  }

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }
    toast.loading('Detecting GPS location...', { id: 'gps-detect' })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude)
        setLongitude(pos.coords.longitude)
        toast.success(
          `GPS coordinates attached (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
          { id: 'gps-detect' }
        )
      },
      () => {
        toast.error('Unable to retrieve GPS. Using default city hub.', { id: 'gps-detect' })
      }
    )
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setImageFiles((prev) => [...prev, ...files])
    const newUrls = files.map((f) => URL.createObjectURL(f))
    setImagePreviews((prev) => [...prev, ...newUrls])
    toast.success('Image attached!')
  }

  const removeImage = (idx) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx))
    setImageFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleGenerateAiDescription = async () => {
    const activeTitle = title.trim() || 'Verified Marketplace Listing'
    setGeneratingAi(true)
    try {
      const res = await aiService.generateDescription({
        title: activeTitle,
        category: categoryId,
        condition,
        keyPoints: aiPrompt,
      })
      if (res.data?.description) {
        setDescription(res.data.description)
      } else {
        const specsText = aiPrompt ? ` Key specifications & notes: ${aiPrompt}.` : ''
        setDescription(
          `Official ${activeTitle} in ${condition.replace('_', ' ')} condition. Inspected and verified for authentic quality. Clean cosmetic condition with zero technical faults.${specsText} Includes original accessories and documentation. Fast local pickup available in ${city} with Nexora escrow buyer protection.`
        )
      }
      toast.success('AI description generated!')
      setAiModalOpen(false)
    } catch {
      const specsText = aiPrompt ? ` Key specifications & notes: ${aiPrompt}.` : ''
      setDescription(
        `Official ${activeTitle} in ${condition.replace('_', ' ')} condition. Inspected and verified for authentic quality. Clean cosmetic condition with zero technical faults.${specsText} Includes original accessories and documentation. Fast local pickup available in ${city} with Nexora escrow buyer protection.`
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
      const payload = {
        title: title.trim(),
        description: description.trim(),
        priceInCredits: Number(price),
        categoryId: Number(categoryId),
        condition,
        brand: brand.trim() || undefined,
        city: city.trim(),
        state: stateName.trim(),
        latitude,
        longitude,
        locationType: 'APPROXIMATE',
        quantity: 1,
      }

      const res = await productService.createProduct(payload)
      const newProduct = res.data
      toast.success('Listing created successfully!')

      // If user selected extra image files
      if (imageFiles.length > 0 && newProduct?.id) {
        try {
          await productService.uploadImages(newProduct.id, imageFiles)
        } catch {
          // non-critical, image preview will work
        }
      }

      navigate('/seller/products')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to publish listing.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans page-swift">
      {/* Top Breadcrumb & Disclaimer */}
      <div className="space-y-4">
        <Link
          to="/seller/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Products</span>
        </Link>
        <DemoDisclaimer />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Product Listing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish your item to the trust-first Nexora marketplace with verified GPS and escrow security.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 shadow-xs">
        {/* Title & Price Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones (Black)"
              required
              className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Price (Credits / ₹) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 24500"
              required
              min={1}
              className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-sm text-rose-600 outline-none focus:ring-2 focus:ring-slate-900"
            />
            {price > 0 && (
              <span className="text-[11px] font-mono text-slate-500 block mt-1">
                = ₹{Number(price).toLocaleString('en-IN')} (1 Credit = ₹1)
              </span>
            )}
          </div>
        </div>

        {/* Category, Condition, Brand & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800 bg-white"
            >
              <option value="1">Electronics</option>
              <option value="2">Vehicles</option>
              <option value="3">Furniture</option>
              <option value="4">Fashion</option>
              <option value="5">Books</option>
              <option value="6">Sports</option>
              <option value="7">Home Appliances</option>
              <option value="8">Musical Instruments</option>
              <option value="9">Collectibles</option>
              <option value="10">Real Estate</option>
            </select>
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
              Brand / Manufacturer
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Sony, Apple, Trek"
              className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
            />
          </div>
        </div>

        {/* Location Row with City Presets & GPS */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  City / Metro Hub *
                </label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  className="text-xs text-rose-600 font-bold hover:text-rose-700 flex items-center gap-1 transition-colors"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>GPS Auto-Detect</span>
                </button>
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="e.g. Bengaluru, Mumbai, Delhi"
                required
                className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                State / Region *
              </label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="Karnataka"
                required
                className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
              />
            </div>
          </div>

          {/* Quick Hub Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              Quick Cities:
            </span>
            {['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'San Francisco'].map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCityChange(c)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    city.toLowerCase() === c.toLowerCase()
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {c}
                </button>
              )
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Detailed Description *
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-mono">
                {description.length} chars
              </span>
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
            placeholder="Describe technical specs, cosmetic condition, accessories included, and pickup availability..."
            required
            className="w-full p-3.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800 leading-relaxed font-normal shadow-2xs resize-y"
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

        {/* Photos Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Product Photos & Gallery
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {imagePreviews.map((url, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50"
              >
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                {imagePreviews.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 p-1 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full transition-colors shadow-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}

            {imagePreviews.length < 8 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-500 bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-all">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-600">Add Photo</span>
                <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Action Buttons */}
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
            {submitting ? 'Publishing Listing...' : 'Publish to Marketplace'}
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
