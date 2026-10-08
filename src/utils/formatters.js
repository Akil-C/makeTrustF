import { formatDistanceToNow, format, parseISO, isValid } from 'date-fns'

// ── Credits ────────────────────────────────────────────────────────────────────
/**
 * Format a credit amount as "10,000 MC".
 * @param {number} amount
 * @returns {string}
 */
export function formatCredits(amount) {
  if (amount === null || amount === undefined) return '0 MC'
  return `${Number(amount).toLocaleString()} MC`
}

// ── Distance ──────────────────────────────────────────────────────────────────
/**
 * Format a distance in km.
 * @param {number} km
 * @returns {string}  e.g. "2.4 km" or "800 m"
 */
export function formatDistance(km) {
  if (km === null || km === undefined) return ''
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

// ── Dates ─────────────────────────────────────────────────────────────────────
/**
 * Format an ISO date string into a human-readable date.
 * @param {string|Date} date
 * @returns {string}  e.g. "Oct 6, 2026"
 */
export function formatDate(date) {
  if (!date) return ''
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(d)) return ''
    return format(d, 'MMM d, yyyy')
  } catch {
    return ''
  }
}

/**
 * Format an ISO date string into date + time.
 * @param {string|Date} date
 * @returns {string}  e.g. "Oct 6, 2026 at 3:45 PM"
 */
export function formatDateTime(date) {
  if (!date) return ''
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(d)) return ''
    return format(d, "MMM d, yyyy 'at' h:mm a")
  } catch {
    return ''
  }
}

/**
 * Return a relative time string.
 * @param {string|Date} date
 * @returns {string}  e.g. "2 hours ago"
 */
export function formatRelativeTime(date) {
  if (!date) return ''
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(d)) return ''
    return formatDistanceToNow(d, { addSuffix: true })
  } catch {
    return ''
  }
}

// ── Seller Level ──────────────────────────────────────────────────────────────
const LEVEL_COLORS = {
  BRONZE:   'text-amber-700  bg-amber-50   border-amber-200',
  SILVER:   'text-gray-600   bg-gray-100   border-gray-300',
  GOLD:     'text-yellow-700 bg-yellow-50  border-yellow-200',
  PLATINUM: 'text-blue-700   bg-blue-50    border-blue-200',
}

const LEVEL_ICONS = {
  BRONZE:   '🥉',
  SILVER:   '🥈',
  GOLD:     '🥇',
  PLATINUM: '💎',
}

/**
 * Tailwind classes for a seller level badge.
 * @param {string} level  'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
 * @returns {string}
 */
export function getSellerLevelColor(level) {
  return LEVEL_COLORS[level?.toUpperCase()] ?? LEVEL_COLORS.BRONZE
}

/**
 * Emoji icon for a seller level.
 * @param {string} level
 * @returns {string}
 */
export function getSellerLevelIcon(level) {
  return LEVEL_ICONS[level?.toUpperCase()] ?? '🥉'
}

// ── Star Rating ───────────────────────────────────────────────────────────────
/**
 * Convert a numeric rating to a star string.
 * @param {number} rating  0–5
 * @param {number} [max=5]
 * @returns {string}  e.g. "★★★★☆"
 */
export function getRatingStars(rating, max = 5) {
  const filled = Math.round(rating ?? 0)
  return '★'.repeat(Math.min(filled, max)) + '☆'.repeat(Math.max(max - filled, 0))
}

// ── Text ──────────────────────────────────────────────────────────────────────
/**
 * Truncate text to a max length, appending "…".
 * @param {string} text
 * @param {number} length
 * @returns {string}
 */
export function truncateText(text, length = 100) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '…'
}

// ── Order Status ──────────────────────────────────────────────────────────────
const ORDER_STATUS_LABELS = {
  PENDING:        'Pending',
  CONFIRMED:      'Confirmed',
  SHIPPED:        'Shipped',
  DELIVERED:      'Delivered',
  COMPLETED:      'Completed',
  CANCELLED:      'Cancelled',
  DISPUTED:       'Disputed',
  REFUNDED:       'Refunded',
}

/**
 * Human-readable order status.
 * @param {string} status
 * @returns {string}
 */
export function formatOrderStatus(status) {
  return ORDER_STATUS_LABELS[status?.toUpperCase()] ?? status ?? 'Unknown'
}

/**
 * Tailwind color classes for an order status.
 * @param {string} status
 * @returns {string}
 */
export function getOrderStatusColor(status) {
  const map = {
    PENDING:   'text-yellow-700 bg-yellow-50 border-yellow-200',
    CONFIRMED: 'text-blue-700   bg-blue-50   border-blue-200',
    SHIPPED:   'text-indigo-700 bg-indigo-50 border-indigo-200',
    DELIVERED: 'text-teal-700   bg-teal-50   border-teal-200',
    COMPLETED: 'text-green-700  bg-green-50  border-green-200',
    CANCELLED: 'text-red-700    bg-red-50    border-red-200',
    DISPUTED:  'text-orange-700 bg-orange-50 border-orange-200',
    REFUNDED:  'text-purple-700 bg-purple-50 border-purple-200',
  }
  return map[status?.toUpperCase()] ?? 'text-gray-700 bg-gray-50 border-gray-200'
}

// ── Misc ──────────────────────────────────────────────────────────────────────
/**
 * Format a price number as a currency-style string.
 * @param {number} amount
 * @param {string} [currency='MC']
 * @returns {string}
 */
export function formatPrice(amount, currency = 'MC') {
  if (amount === null || amount === undefined) return `0 ${currency}`
  return `${Number(amount).toLocaleString()} ${currency}`
}

/**
 * Capitalise the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
