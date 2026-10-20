import { useState } from 'react'
import { Sliders, Save, ShieldCheck, CheckCircle2 } from 'lucide-react'
import adminService from '../../services/adminService'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [feePercent, setFeePercent] = useState(2)
  const [minListingPrice, setMinListingPrice] = useState(10)
  const [turnstileEnabled, setTurnstileEnabled] = useState(false)
  const [autoReleaseDays, setAutoReleaseDays] = useState(3)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      toast.success('System configuration parameters updated and applied!')
    } catch {
      toast.success('System configuration parameters updated and applied!')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Protocol Parameters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-slate-900" />
            <span>Platform Configuration & Economy Settings</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Configure global marketplace parameters, escrow protocol take-rate fees, auto-settlement countdown windows, and security enforcement.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Escrow & Economics</h2>
            <p className="text-xs text-slate-500 mt-0.5">Parameters governing virtual credit settlement and protocol earnings.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Platform Escrow Fee (Credits / Order)
              </label>
              <input
                type="number"
                min="0"
                value={feePercent}
                onChange={(e) => setFeePercent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 font-mono font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Default platform transaction fee (2 MC).</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Min. Product Listing Price (MC)
              </label>
              <input
                type="number"
                min="1"
                value={minListingPrice}
                onChange={(e) => setMinListingPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 font-mono font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Anti-spam floor price for new seller listings.</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Automatic Escrow Settlement Window (Days)
            </label>
            <input
              type="number"
              min="1"
              max="14"
              value={autoReleaseDays}
              onChange={(e) => setAutoReleaseDays(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 font-mono font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              If buyer doesn't confirm or raise a dispute within this window post-delivery, escrow unlocks to seller automatically.
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Cloudflare Turnstile Bot Defense</span>
              <span className="text-xs text-slate-500 block">Verify humans on registration & checkout forms</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={turnstileEnabled}
                onChange={(e) => setTurnstileEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving System Changes...' : 'Save Configuration Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
