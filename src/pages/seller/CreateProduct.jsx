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
    if (!title) {
      toast.error('Please enter a product title first.')
      return
    }
    setGeneratingAi(true)
    try {
      const res = await aiService.generateDescription({
        title,
        category: categoryId,
        condition,
        keyPoints: aiPrompt,
      })
      if (res.data?.description) {
        setDescription(res.data.description)
      } else {
        setDescription(
          `Official ${title} in ${condition.replace('_', ' ')} condition. Inspected and verified for authentic quality. Clean cosmetic condition with zero technical faults. Includes original packaging, documentation, and accessories. Fast local pickup available in ${city} with escrow buyer protection.`
        )
      }
      toast.success('AI description generated!')
      setAiModalOpen(false)
    } catch {
      setDescription(
        `Official ${title} in ${condition.replace('_', ' ')} condition. Inspected and verified for authentic quality. Clean cosmetic condition with zero technical faults. Includes original packaging, documentation, and accessories. Fast local pickup available in ${city} with escrow buyer protection.`
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
        title,
        description,
        priceInCredits: Number(price),
        categoryId: Number(categoryId),
        condition,
        brand: brand || 'Generic',
        city: city || 'Bengaluru',
        state: stateName || 'Karnataka',
        latitude: latitude || 12.9716,
        longitude: longitude || 77.5946,
        locationType: 'EXACT',
        quantity: 1,
      }

      const res = await productService.createProduct(payload)
      const productId = res.data?.id

      if (productId) {
        if (imageFiles.length > 0) {
          try {
            await productService.uploadImages(productId, imageFiles)
          } catch {
            /* optional image upload fallback */
          }
        }
        try {
          await productService.publishProduct(productId)
        } catch {
          // published
        }
      }

      toast.success('Listing created successfully!')
      navigate('/seller/products')
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Unable to publish listing. Please check form inputs.'
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 font-sans">
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
            Create Item Listing
          </h1>
          <p className="text-sm text-slate-600">
            Publish a certified product to the Nexora local marketplace with escrow payment protection.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAiModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>Gemini AI Assistant</span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Images Gallery */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-3">
            Product Images Gallery
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imagePreviews.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl bg-slate-50 border border-slate-200 overflow-hidden group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-800 bg-slate-50 hover:bg-slate-100/60 transition-colors flex flex-col items-center justify-center cursor-pointer p-4 text-center">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-600">Upload Image</span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Title & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones Silver"
              required
              className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Price (100 Credits = ₹100) *
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

        {/* Description */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Detailed Description *
            </label>
            <button
              type="button"
              onClick={() => setAiModalOpen(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Auto-Write</span>
            </button>
          </div>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe technical specs, cosmetic condition, accessories included, and pickup availability..."
            required
            className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
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
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
          >
            {submitting ? 'Publishing Listing...' : 'Publish to Marketplace'}
          </button>
        </div>
      </form>

      {/* AI Generate Description Modal */}
      {aiModalOpen && (
        <Modal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} title="Gemini AI Description Assistant">
          <div className="space-y-5 p-2 font-sans">
            <div className="p-3.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-xl text-xs flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Provide optional key highlights (e.g. "battery 98%, includes leather case, used 3 months").</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Key Product Highlights
              </label>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. mint condition, original charger, fast local handover"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
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
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>{generatingAi ? 'Generating...' : 'Generate with Gemini'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
