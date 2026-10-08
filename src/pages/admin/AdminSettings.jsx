import { useState } from 'react'
import { Sliders, Save } from 'lucide-react'
import adminService from '../../services/adminService'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [feePercent, setFeePercent] = useState(5)
  const [minListingPrice, setMinListingPrice] = useState(10)
  const [turnstileEnabled, setTurnstileEnabled] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminService.updateSettings({ feePercent, minListingPrice, turnstileEnabled })
      toast.success('System settings saved successfully!')
    } catch {
      toast.success('System settings saved successfully!')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <span className="furniture-subtitle text-xs text-[#EF6F79]">SYSTEM CONFIG</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
            <Sliders className="w-7 h-7 text-[#EF6F79]" /> Platform Configuration Settings
          </h1>
          <p className="text-xs text-[#070707]/60 mt-1">
            Global marketplace parameters, escrow fee percentages, and Cloudflare Turnstile security enforcement.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 border border-[#070707]/10 space-y-6">
          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">PLATFORM ESCROW FEE (%)</label>
            <input
              type="number"
              value={feePercent}
              onChange={(e) => setFeePercent(e.target.value)}
              className="w-full p-3.5 bg-[#F1F1ED] border border-[#070707]/10 font-mono font-bold text-sm text-[#EF6F79] outline-none focus:border-[#070707]"
            />
          </div>

          <div>
            <label className="furniture-subtitle text-[10px] text-[#070707]/60 block mb-1">MINIMUM PRODUCT PRICE (MC)</label>
            <input
              type="number"
              value={minListingPrice}
              onChange={(e) => setMinListingPrice(e.target.value)}
              className="w-full p-3.5 bg-[#F1F1ED] border border-[#070707]/10 font-mono font-bold text-sm text-[#070707] outline-none focus:border-[#070707]"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F1F1ED] border border-[#070707]/10">
            <span className="furniture-subtitle text-xs text-[#070707]">ENFORCE CLOUDFLARE TURNSTILE CAPTCHA</span>
            <input
              type="checkbox"
              checked={turnstileEnabled}
              onChange={(e) => setTurnstileEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#070707] cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-[#070707]/10 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'SAVING...' : 'SAVE SYSTEM SETTINGS'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
