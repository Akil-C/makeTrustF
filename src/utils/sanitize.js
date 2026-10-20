/**
 * Enterprise Security & Sanitization Utilities
 * Defends against Cross-Site Scripting (XSS), URL scheme injection,
 * and off-platform payment evasion schemes.
 */

// Suspicious off-platform transaction keywords
const OFF_PLATFORM_KEYWORDS = [
  'whatsapp',
  'telegram',
  'signal',
  'gpay',
  'google pay',
  'phonepe',
  'paytm',
  'bank transfer',
  'neft',
  'rtgs',
  'imps',
  'upi id',
  'send otp',
  'share otp',
  'pay direct',
  'outside payment',
  'pay outside',
  'direct cash',
  'wire transfer',
  'crypto',
  'usdt',
]

/**
 * Escapes unsafe HTML characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Strips script tags, event handlers, and javascript: pseudo-protocols.
 * @param {string} input
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:\s*/gi, '')
    .trim()
}

/**
 * Detects if user input contains off-platform transaction patterns or scam cues.
 * @param {string} text
 * @returns {{ flagged: boolean, matched: string[] }}
 */
export function detectOffPlatformRisk(text) {
  if (!text || typeof text !== 'string') return { flagged: false, matched: [] }

  const lower = text.toLowerCase()
  const matched = []

  for (const keyword of OFF_PLATFORM_KEYWORDS) {
    if (lower.includes(keyword)) {
      matched.push(keyword)
    }
  }

  // Regex check for 10-digit phone numbers in text (e.g. 9876543210, +91-9876543210)
  const phonePattern = /(?:\+?91[\s-]?)?[6789]\d{9}\b/
  if (phonePattern.test(text)) {
    matched.push('phone-number')
  }

  // Regex check for UPI IDs (e.g. user@oksbi, user@upi, user@paytm)
  const upiPattern = /[\w.-]+@(?:okhdfcbank|okaxis|oksbi|okicici|paytm|ybl|upi|apl)\b/i
  if (upiPattern.test(text)) {
    matched.push('upi-id')
  }

  return {
    flagged: matched.length > 0,
    matched,
  }
}

/**
 * Validates a destination URL against scheme-injection attacks (e.g., javascript:, data:).
 * Only http: and https: protocols are permitted.
 * @param {string} url
 * @returns {boolean}
 */
export function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false
  if (url.startsWith('/')) return true // Relative application URLs are safe

  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}
