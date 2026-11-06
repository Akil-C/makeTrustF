import toast from 'react-hot-toast'
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Info,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

/**
 * Extracts initials from a user's full name (e.g. "Alex Johnson" -> "AJ")
 */
function getInitials(name = '') {
  if (!name) return 'NX'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Formats user role into a clean display title and color badge
 */
function getRoleBadge(role = '') {
  const normalized = String(role).toUpperCase().replace(/^ROLE_/, '')
  if (normalized.includes('ADMIN')) {
    return {
      label: 'SYSTEM OPERATOR',
      dotColor: 'bg-purple-400',
      badgeClass: 'bg-purple-950/70 text-purple-300 border-purple-500/30',
      gradient: 'from-purple-600 to-indigo-600',
      accentGlow: 'rgba(168, 85, 247, 0.25)',
    }
  }
  if (normalized.includes('SELLER')) {
    return {
      label: 'VERIFIED MERCHANT',
      dotColor: 'bg-cyan-400',
      badgeClass: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30',
      gradient: 'from-cyan-600 to-blue-600',
      accentGlow: 'rgba(6, 182, 212, 0.25)',
    }
  }
  return {
    label: 'BUYER PORTAL',
    dotColor: 'bg-emerald-400',
    badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30',
    gradient: 'from-emerald-600 to-teal-600',
    accentGlow: 'rgba(16, 185, 129, 0.25)',
  }
}

/**
 * Flexible parameter resolver: handles (message), (title, message), or (title, options)
 */
function resolveArgs(titleOrMessage, messageOrOptions, rawOptions = {}) {
  let title = 'Notification'
  let message = ''
  let options = rawOptions

  if (typeof messageOrOptions === 'string') {
    title = titleOrMessage
    message = messageOrOptions
  } else if (typeof messageOrOptions === 'object' && messageOrOptions !== null) {
    message = titleOrMessage
    options = { ...messageOrOptions, ...rawOptions }
  } else {
    message = titleOrMessage
  }

  return { title, message, options }
}

/**
 * Custom High-End Theme-Matched Notification System for Nexora
 */
export const customToast = {
  /**
   * Personalized Welcome Notification
   * Example: customToast.welcome({ name: 'Alex Johnson', role: 'BUYER' })
   * or:      customToast.welcome('Alex Johnson')
   */
  welcome: (userOrName, options = {}) => {
    let name = 'Trader'
    let role = 'BUYER'
    let email = ''
    let avatarUrl = ''

    if (typeof userOrName === 'string') {
      name = userOrName
      role = options.role || 'BUYER'
    } else if (userOrName && typeof userOrName === 'object') {
      name = userOrName.name || userOrName.displayName || userOrName.email?.split('@')[0] || 'Trader'
      role = userOrName.role || (Array.isArray(userOrName.roles) ? userOrName.roles[0] : 'BUYER')
      email = userOrName.email || ''
      avatarUrl = userOrName.avatarUrl || ''
    }

    const initials = getInitials(name)
    const roleConfig = getRoleBadge(role)
    const duration = options.duration || 4500

    return toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 ease-out ${
            t.visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-2 opacity-0 scale-95'
          }`}
          style={{
            boxShadow: `0 20px 45px -10px ${roleConfig.accentGlow}, 0 0 0 1px rgba(255, 255, 255, 0.08)`,
          }}
        >
          {/* Top subtle highlight gradient bar */}
          <div className={`h-1 w-full bg-gradient-to-r ${roleConfig.gradient}`} />

          <div className="p-4 sm:p-4.5 flex items-start gap-3.5">
            {/* Avatar / Badge Circle */}
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/10"
                />
              ) : (
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white font-black text-sm tracking-wider shadow-inner ring-2 ring-white/10`}
                >
                  {initials}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            </div>

            {/* Notification Copy */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                  Welcome back, {name}!
                </h4>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wider uppercase ${roleConfig.badgeClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${roleConfig.dotColor} animate-pulse`} />
                  {roleConfig.label}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Session authenticated securely. Escrow protection and instant trading active.
              </p>

              {email && (
                <div className="mt-1.5 text-[11px] text-slate-400 font-mono truncate">
                  {email}
                </div>
              )}
            </div>

            {/* Dismiss X button */}
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ),
      { duration }
    )
  },

  /**
   * Theme-Matched Error Notification
   * Example: customToast.error('Transaction Failed', 'Wallet balance insufficient for escrow lock.')
   */
  error: (titleOrMessage, messageOrOptions, rawOptions = {}) => {
    const { title, message, options } = resolveArgs(
      titleOrMessage,
      messageOrOptions,
      rawOptions
    )
    const duration = options.duration || 5000
    const code = options.code
    const onRetry = options.onRetry

    return toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-rose-500/40 rounded-2xl shadow-[0_20px_50px_rgba(225,29,72,0.18)] overflow-hidden transition-all duration-300 ease-out ${
            t.visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-2 opacity-0 scale-95'
          }`}
          style={{
            boxShadow: '0 20px 45px -10px rgba(225, 29, 72, 0.25), 0 0 0 1px rgba(244, 63, 94, 0.15)',
          }}
        >
          {/* Top rose accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-rose-600 via-rose-500 to-red-600" />

          <div className="p-4 sm:p-4.5 flex items-start gap-3.5">
            {/* Warning Icon Container */}
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
              <ShieldAlert className="w-5 h-5" />
            </div>

            {/* Error Message Details */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                  {title || 'Action Failed'}
                </h4>
                {code && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/30">
                    {code}
                  </span>
                )}
              </div>

              <p className="text-xs text-rose-100/90 leading-relaxed break-words">
                {message || 'An unexpected issue occurred. Please check and try again.'}
              </p>

              {onRetry && (
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      toast.dismiss(t.id)
                      onRetry()
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry Action</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dismiss X button */}
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ),
      { duration }
    )
  },

  /**
   * Theme-Matched Success Notification
   * Example: customToast.success('Escrow Authorized', 'Funds locked in contract #NX-9821.')
   */
  success: (titleOrMessage, messageOrOptions, rawOptions = {}) => {
    const { title, message, options } = resolveArgs(
      titleOrMessage,
      messageOrOptions,
      rawOptions
    )
    const duration = options.duration || 4000
    const actionLabel = options.actionLabel
    const onAction = options.onAction

    return toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.18)] overflow-hidden transition-all duration-300 ease-out ${
            t.visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-2 opacity-0 scale-95'
          }`}
          style={{
            boxShadow: '0 20px 45px -10px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.15)',
          }}
        >
          {/* Emerald accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500" />

          <div className="p-4 sm:p-4.5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-sm font-bold text-white tracking-tight leading-snug mb-1">
                {title || 'Operation Successful'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed break-words">
                {message || 'The requested action completed with verified execution.'}
              </p>

              {actionLabel && onAction && (
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      toast.dismiss(t.id)
                      onAction()
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>{actionLabel}</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ),
      { duration }
    )
  },

  /**
   * Dedicated Escrow Guarantee Notification
   * Example: customToast.escrow('Escrow Secured', '1,200 MC safely locked in milestone contract.')
   */
  escrow: (titleOrMessage, messageOrOptions, rawOptions = {}) => {
    const { title, message, options } = resolveArgs(
      titleOrMessage || 'Escrow Vault Protected',
      messageOrOptions || 'Funds held in smart contract until delivery confirmation.',
      rawOptions
    )
    const duration = options.duration || 4500

    return toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl shadow-[0_20px_50px_rgba(245,158,11,0.18)] overflow-hidden transition-all duration-300 ease-out ${
            t.visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-2 opacity-0 scale-95'
          }`}
          style={{
            boxShadow: '0 20px 45px -10px rgba(245, 158, 11, 0.25), 0 0 0 1px rgba(245, 158, 11, 0.15)',
          }}
        >
          <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400" />

          <div className="p-4 sm:p-4.5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                  {title}
                </h4>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30 tracking-wider uppercase">
                  ESCROW
                </span>
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                {message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ),
      { duration }
    )
  },

  /**
   * Theme-Matched Info Notification
   */
  info: (titleOrMessage, messageOrOptions, rawOptions = {}) => {
    const { title, message, options } = resolveArgs(
      titleOrMessage,
      messageOrOptions,
      rawOptions
    )
    const duration = options.duration || 4000

    return toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-sky-500/40 rounded-2xl shadow-[0_20px_50px_rgba(14,165,233,0.18)] overflow-hidden transition-all duration-300 ease-out ${
            t.visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-2 opacity-0 scale-95'
          }`}
        >
          <div className="h-1 w-full bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-500" />
          <div className="p-4 sm:p-4.5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-sm font-bold text-white tracking-tight leading-snug mb-1">
                {title || 'Marketplace Update'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
            </div>
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ),
      { duration }
    )
  },

  /**
   * Theme-Matched Warning Notification
   */
  warning: (titleOrMessage, messageOrOptions, rawOptions = {}) => {
    const { title, message, options } = resolveArgs(
      titleOrMessage,
      messageOrOptions,
      rawOptions
    )
    const duration = options.duration || 4500

    return toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl shadow-[0_20px_50px_rgba(245,158,11,0.18)] overflow-hidden transition-all duration-300 ease-out ${
            t.visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-2 opacity-0 scale-95'
          }`}
        >
          <div className="h-1 w-full bg-gradient-to-r from-amber-600 to-yellow-500" />
          <div className="p-4 sm:p-4.5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-sm font-bold text-white tracking-tight leading-snug mb-1">
                {title || 'Attention Required'}
              </h4>
              <p className="text-xs text-amber-100/90 leading-relaxed">{message}</p>
            </div>
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ),
      { duration }
    )
  },

  // Direct pass-throughs
  dismiss: (id) => toast.dismiss(id),
  loading: (message, options) => toast.loading(message, options),
  promise: (promise, msgs, options) => toast.promise(promise, msgs, options),
}

export { toast }
export default customToast
