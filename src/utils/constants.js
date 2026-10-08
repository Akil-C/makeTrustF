// ── Demo notice ───────────────────────────────────────────────────────────────
export const DEMO_DISCLAIMER =
  'Nexora Marketplace Credits (MC) are demo virtual credits with no real-world monetary value. ' +
  'They exist solely for demonstration and testing purposes.'

// ── App info ──────────────────────────────────────────────────────────────────
export const APP_NAME    = import.meta.env.VITE_APP_NAME ?? 'Nexora'
export const APP_TAGLINE = 'Compare Smarter. Buy With Confidence.'

// ── Platform fees ─────────────────────────────────────────────────────────────
export const PLATFORM_FEE_PERCENT = 5      // 5 % taken from each sale
export const MINIMUM_PRODUCT_PRICE = 10   // 10 MC minimum listing price
export const MAXIMUM_PRODUCT_PRICE = 10_000_000

// ── Pagination defaults ───────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12
export const ADMIN_PAGE_SIZE   = 20

// ── Search ────────────────────────────────────────────────────────────────────
export const DEFAULT_SEARCH_RADIUS_KM = 25
export const MAX_SEARCH_RADIUS_KM     = 200

// ── Order statuses ────────────────────────────────────────────────────────────
export const ORDER_STATUSES = {
  PENDING:   'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED:   'SHIPPED',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  DISPUTED:  'DISPUTED',
  REFUNDED:  'REFUNDED',
}

// ── Product conditions ────────────────────────────────────────────────────────
export const PRODUCT_CONDITIONS = [
  { value: 'NEW',          label: 'Brand New' },
  { value: 'LIKE_NEW',     label: 'Like New' },
  { value: 'GOOD',         label: 'Good' },
  { value: 'FAIR',         label: 'Fair' },
  { value: 'POOR',         label: 'For Parts / Not Working' },
]

// ── Product categories ────────────────────────────────────────────────────────
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing & Apparel',
  'Home & Garden',
  'Sports & Outdoors',
  'Toys & Games',
  'Books & Media',
  'Vehicles & Parts',
  'Tools & Equipment',
  'Furniture',
  'Food & Beverage',
  'Health & Beauty',
  'Collectibles & Art',
  'Baby & Kids',
  'Pet Supplies',
  'Other',
]

// ── Seller levels ─────────────────────────────────────────────────────────────
export const SELLER_LEVELS = {
  BRONZE:   { label: 'Bronze',   minSales: 0,    minRating: 0,   icon: '🥉', color: 'amber'   },
  SILVER:   { label: 'Silver',   minSales: 10,   minRating: 3.5, icon: '🥈', color: 'gray'    },
  GOLD:     { label: 'Gold',     minSales: 50,   minRating: 4.0, icon: '🥇', color: 'yellow'  },
  PLATINUM: { label: 'Platinum', minSales: 200,  minRating: 4.5, icon: '💎', color: 'blue'    },
}

// ── KYC statuses ──────────────────────────────────────────────────────────────
export const KYC_STATUSES = {
  NOT_SUBMITTED: 'NOT_SUBMITTED',
  PENDING:       'PENDING',
  APPROVED:      'APPROVED',
  REJECTED:      'REJECTED',
}

// ── Report reasons ────────────────────────────────────────────────────────────
export const REPORT_REASONS = [
  { value: 'FAKE_LISTING',        label: 'Fake / Misleading listing' },
  { value: 'PROHIBITED_ITEM',     label: 'Prohibited item' },
  { value: 'SCAM',                label: 'Scam or fraud' },
  { value: 'SPAM',                label: 'Spam' },
  { value: 'INAPPROPRIATE',       label: 'Inappropriate content' },
  { value: 'WRONG_CATEGORY',      label: 'Wrong category' },
  { value: 'DUPLICATE',           label: 'Duplicate listing' },
  { value: 'OTHER',               label: 'Other' },
]

// ── Upload limits ─────────────────────────────────────────────────────────────
export const MAX_PRODUCT_IMAGES   = 8
export const MAX_IMAGE_SIZE_MB    = 5
export const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png':  ['.png'],
  'image/webp': ['.webp'],
}

// ── Wallet ────────────────────────────────────────────────────────────────────
export const MAX_TRANSFER_AMOUNT = 100_000
export const MIN_TRANSFER_AMOUNT = 1

// ── Chat ──────────────────────────────────────────────────────────────────────
export const MAX_MESSAGE_LENGTH     = 1000
export const CHAT_MESSAGES_PER_PAGE = 30

// ── Roles ─────────────────────────────────────────────────────────────────────
export const ROLES = {
  BUYER:  'BUYER',
  SELLER: 'SELLER',
  ADMIN:  'ADMIN',
}
