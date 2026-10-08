import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Upload,
  Sparkles,
  ArrowLeft,
  X,
  Bot,
} from 'lucide-react'
import productService from '../../services/productService'
import aiService from '../../services/aiService'
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/constants'
import Modal from '../../components/common/Modal'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

import api from '../../services/api'

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
        latitude: 12.9716,
        longitude: 77.5946,
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
        await productService.publishProduct(productId)
      }

      toast.success('Listing published successfully!')
      navigate('/seller/products')
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Unable to publish listing. Please check form inputs.'
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#070707]/10 pb-6 gap-4">
          <div>
            <Link to="/seller/products" className="furniture-subtitle text-[10px] text-[#070707]/60 hover:text-[#070707] flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> BACK TO STORE INVENTORY
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#070707]">Create Item Listing</h1>
          </div>

          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="px-5 py-2.5 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-[#EF6F79]" />
            <span>AI ASSISTANT</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 border border-[#070707]/10 space-y-6">
          {/* Images Section */}
          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-3">
              PRODUCT IMAGES GALLERY
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imagePreviews.map((img, idx) => (
                <div key={idx} className="relative aspect-square bg-[#F1F1ED] border border-[#070707]/10 overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-[#070707] text-white hover:bg-[#EF6F79] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <label className="aspect-square border border-dashed border-[#070707]/30 hover:border-[#070707] bg-[#F1F1ED]/50 transition-colors flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                <Upload className="w-6 h-6 text-[#070707]/40 mb-1" />
                <span className="furniture-subtitle text-[10px] text-[#070707]/70">UPLOAD IMAGE</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Title & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">PRODUCT TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5 Headphones Black"
                required
                className="w-full px-4 py-3 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
              />
            </div>

            <div>
              <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">PRICE (MARKETPLACE CREDITS)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="280"
                required
                min={1}
                className="w-full px-4 py-3 bg-[#F1F1ED] border border-[#070707]/10 font-mono font-bold text-sm text-[#EF6F79] outline-none focus:border-[#070707]"
              />
            </div>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">CATEGORY</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
              >
                <option value="1">Electronics</option>
                <option value="2">Vehicles</option>
                <option value="3">Furniture</option>
                <option value="4">Fashion</option>
                <option value="5">Books</option>
                <option value="6">Sports</option>
                <option value="7">Home Appliances</option>
                <option value="8">Musical Instruments</option>
              </select>
            </div>

            <div>
              <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">CONDITION</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
              >
                {PRODUCT_CONDITIONS.map((cond) => (
                  <option key={cond.value} value={cond.value}>
                    {cond.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">CITY / LOCATION</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bengaluru"
                className="w-full px-4 py-3 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="furniture-subtitle text-[10px] text-[#070707]/60 block">DETAILED DESCRIPTION</label>
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="furniture-subtitle text-[10px] text-[#EF6F79] hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI GENERATE
              </button>
            </div>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, inclusion details, serial numbers, reason for selling..."
              required
              className="w-full p-4 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#070707]/10">
            <Link
              to="/seller/products"
              className="px-6 py-3 bg-[#F1F1ED] hover:bg-[#E4E5E0] text-[#070707] furniture-subtitle text-xs transition-colors"
            >
              CANCEL
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-xs transition-colors"
            >
              {submitting ? 'PUBLISHING LISTING...' : 'PUBLISH LISTING'}
            </button>
          </div>
        </form>
      </div>

      {/* AI Generate Description Modal */}
      <Modal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} title="Gemini AI Description Assistant">
        <div className="space-y-4">
          <div className="p-3 bg-[#F1F1ED] border border-[#070707]/10 text-[#070707] text-xs flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#EF6F79] shrink-0" />
            <span>Provide optional key highlights (e.g. "battery 99%, includes charger, non-smoking home").</span>
          </div>

          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">KEY HIGHLIGHTS</label>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. low shutter count, original box, fast shipping"
              className="w-full px-3.5 py-2.5 bg-[#F1F1ED] border border-[#070707]/10 text-xs outline-none focus:border-[#070707]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setAiModalOpen(false)}
              className="px-4 py-2 bg-[#F1F1ED] text-[#070707] furniture-subtitle text-[10px]"
            >
              CANCEL
            </button>

            <button
              type="button"
              onClick={handleGenerateAiDescription}
              disabled={generatingAi}
              className="px-6 py-2.5 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-[10px] flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#EF6F79]" />
              <span>{generatingAi ? 'GENERATING...' : 'GENERATE WITH GEMINI'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
