import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileCheck,
  UserCheck,
} from 'lucide-react'
import sellerService from '../../services/sellerService'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function SellerKYC() {
  const [kycStatus, setKycStatus] = useState('NOT_SUBMITTED')
  const [idType, setIdType] = useState('AADHAAR')
  const [idNumber, setIdNumber] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [declarationAccepted, setDeclarationAccepted] = useState(false)
  const [idDocumentFile, setIdDocumentFile] = useState(null)
  const [selfieFile, setSelfieFile] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadKyc() {
      setLoading(true)
      try {
        const res = await sellerService.getKYCStatus()
        if (res.data?.status) {
          setKycStatus(res.data.status)
          if (res.data.rejectionReason) setRejectionReason(res.data.rejectionReason)
          if (res.data.idType) setIdType(res.data.idType)
          if (res.data.idNumber) setIdNumber(res.data.idNumber)
          if (res.data.city) setCity(res.data.city)
          if (res.data.state) setState(res.data.state)
          if (res.data.pincode) setPincode(res.data.pincode)
        }
      } catch {
        // Fallback default
      } finally {
        setLoading(false)
      }
    }
    loadKyc()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!idNumber.trim()) {
      toast.error('Please enter your government ID number.')
      return
    }
    if (!addressLine1.trim() || !city.trim() || !pincode.trim()) {
      toast.error('Please complete your address details.')
      return
    }
    if (!declarationAccepted) {
      toast.error('You must accept the legal declaration to submit verification.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      const dataPayload = {
        idType,
        idNumber: idNumber.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        state: state.trim() || 'Karnataka',
        pincode: pincode.trim(),
        declarationAccepted: true,
      }

      formData.append(
        'data',
        new Blob([JSON.stringify(dataPayload)], { type: 'application/json' })
      )

      if (idDocumentFile) {
        formData.append('idDocument', idDocumentFile)
      }
      if (selfieFile) {
        formData.append('selfie', selfieFile)
      }

      await sellerService.submitKYC(formData)
      setKycStatus('PENDING')
      toast.success('KYC application submitted! An admin will review it shortly.')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error submitting KYC'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const isVerified = kycStatus === 'VERIFIED' || kycStatus === 'APPROVED'
  const isPending = kycStatus === 'PENDING' || kycStatus === 'UNDER_REVIEW'
  const isRejected = kycStatus === 'REJECTED' || kycStatus === 'REQUIRES_RESUBMISSION'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Merchant Trust Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            <span>Identity & Business KYC Verification</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Verify your government identity to unlock the Verified Seller badge, boost buyer confidence, and unlock zero transaction delays.
          </p>
        </div>

        {/* Current KYC Status Banner */}
        <div
          className={`p-6 rounded-2xl border shadow-xs transition-all ${
            isVerified
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : isPending
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : isRejected
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {isVerified && <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />}
              {isPending && <Clock className="w-10 h-10 text-amber-600 shrink-0 animate-pulse" />}
              {isRejected && <XCircle className="w-10 h-10 text-rose-600 shrink-0" />}
              {!isVerified && !isPending && !isRejected && <FileText className="w-10 h-10 text-slate-400 shrink-0" />}

              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                  Verification Status
                </span>
                <span className="text-xl font-extrabold tracking-tight block">
                  {isVerified
                    ? 'KYC Verified & Merchant Credentialed'
                    : isPending
                    ? 'Documents Under Review by Admin Moderation'
                    : isRejected
                    ? 'Submission Requires Updates'
                    : 'Unverified Merchant (Action Required)'}
                </span>
                {rejectionReason && (
                  <p className="text-xs text-rose-700 mt-1 font-medium">
                    Moderator Note: {rejectionReason}
                  </p>
                )}
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                isVerified
                  ? 'bg-emerald-200 text-emerald-900'
                  : isPending
                  ? 'bg-amber-200 text-amber-900'
                  : isRejected
                  ? 'bg-rose-200 text-rose-900'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {kycStatus}
            </span>
          </div>
        </div>

        {/* KYC Submission Form */}
        {!isVerified && (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Government Identity Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">Documents are encrypted and reviewed solely by verified marketplace compliance administrators.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Identification Type
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="AADHAAR">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                  <option value="VOTER_ID">Voter ID</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Document Number
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. 1234-5678-9012 or ABCDE1234F"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Official Registered Address
              </label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Address Line 1 (Street, Building, Unit)"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Address Line 2 (Optional landmark, suite)"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode"
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Document Upload Dropzones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="border border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
                <FileCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-800 block">ID Document Front Scan</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">JPG, PNG, PDF up to 10MB</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setIdDocumentFile(e.target.files?.[0] || null)}
                  className="mt-3 text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                />
              </div>

              <div className="border border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
                <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-800 block">Live Selfie / Face Verification</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Clear frontal photo in good lighting</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                  className="mt-3 text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                />
              </div>
            </div>

            {/* Legal Declaration */}
            <div className="pt-2 flex items-start gap-3">
              <input
                type="checkbox"
                id="declaration"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
              />
              <label htmlFor="declaration" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                I hereby declare that all submitted information and identification documents belong to me and are authentic. I agree to platform terms regarding trust and anti-fraud enforcement.
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide"
            >
              <Upload className="w-4 h-4" />
              <span>{submitting ? 'Submitting Verification...' : 'Submit Verification Dossier'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
