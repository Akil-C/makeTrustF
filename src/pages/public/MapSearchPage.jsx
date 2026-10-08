import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Search,
  Filter,
  Layers,
  ShoppingBag,
  Star,
  X,
  Compass,
  ArrowUpRight,
} from 'lucide-react'
import productService from '../../services/productService'
import { PRODUCT_CATEGORIES } from '../../utils/constants'
import { formatCredits } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import SellerLevelBadge from '../../components/common/SellerLevelBadge'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const MOCK_MAP_PRODUCTS = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max 256GB — Natural Titanium',
    priceInCredits: 950,
    category: 'Electronics',
    condition: 'LIKE_NEW',
    primaryImageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop',
    distance: 1.2,
    city: 'Downtown',
    x: 45,
    y: 35,
    seller: { displayName: 'TechHub Deals', sellerLevel: 'PLATINUM', averageRating: 4.9 },
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5 Headphones',
    priceInCredits: 280,
    category: 'Electronics',
    condition: 'NEW',
    primaryImageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop',
    distance: 3.5,
    city: 'North Beach',
    x: 55,
    y: 20,
    seller: { displayName: 'AudioFile Studio', sellerLevel: 'GOLD', averageRating: 4.8 },
  },
  {
    id: 3,
    title: 'Trek Marlin 7 Mountain Bike',
    priceInCredits: 620,
    category: 'Sports & Outdoors',
    condition: 'GOOD',
    primaryImageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop',
    distance: 1.8,
    city: 'Mission District',
    x: 35,
    y: 60,
    seller: { displayName: 'Alex Rivera', sellerLevel: 'SILVER', averageRating: 4.7 },
  },
]

export default function MapSearchPage() {
  const [radiusKm, setRadiusKm] = useState(10)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(MOCK_MAP_PRODUCTS[0])
  const [mapProducts, setMapProducts] = useState(MOCK_MAP_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function loadNearby() {
      try {
        const res = await productService.getNearbyProducts(37.7749, -122.4194, radiusKm)
        if (res.data?.content?.length > 0) {
          const formatted = res.data.content.map((p, idx) => ({
            ...p,
            x: 25 + (idx * 20) % 60,
            y: 30 + (idx * 15) % 50,
          }))
          setMapProducts(formatted)
          setSelectedProduct(formatted[0])
        }
      } catch {
        // Fallback to mock
      }
    }
    loadNearby()
  }, [radiusKm])

  return (
    <div className="min-h-screen bg-plaster text-near-black flex flex-col justify-between">
      <Navbar />

      <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        <DemoDisclaimer />

        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 hairline-b border-near-black/15 pb-6">
          <div>
            <div className="furniture-text text-accent mb-1">GEOSPATIAL DISCOVERY</div>
            <h1 className="font-bodoni text-3xl font-semibold uppercase tracking-tight">
              LOCAL MARKETPLACE MAP
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="bg-paper border border-near-black/20 text-xs p-2.5 furniture-text outline-none"
            >
              <option value={5}>RADIUS: 5 KM</option>
              <option value={10}>RADIUS: 10 KM</option>
              <option value={25}>RADIUS: 25 KM</option>
              <option value={50}>RADIUS: 50 KM</option>
            </select>
          </div>
        </div>

        {/* Map Grid Canvas Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Map Area */}
          <div className="lg:col-span-2 relative aspect-[16/10] bg-near-black hairline-all overflow-hidden p-6 text-plaster">
            {/* Map Grid Background Lines */}
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Pins */}
            {mapProducts.map((p) => {
              const isSelected = selectedProduct?.id === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <div
                    className={`p-2 transition-all duration-300 flex items-center gap-2 ${
                      isSelected ? 'bg-accent text-white scale-110 z-30 shadow-lg' : 'bg-plaster text-near-black hover:scale-105'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="furniture-text text-[10px] font-bold">
                      {formatCredits(p.priceInCredits || p.price)}
                    </span>
                  </div>
                </button>
              )
            })}

            <div className="absolute bottom-4 left-4 furniture-text text-[10px] text-plaster/50 bg-black/60 p-2 hairline-all">
              GEOLOCATION MODE ACTIVE • SAN FRANCISCO HQ
            </div>
          </div>

          {/* Selected Product Card */}
          {selectedProduct && (
            <div className="bg-paper p-6 hairline-all space-y-6">
              <div className="furniture-text text-accent text-[10px]">SELECTED NEARBY OFFER</div>

              <div className="aspect-square bg-plaster overflow-hidden hairline-all">
                <img
                  src={selectedProduct.primaryImageUrl || selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop'}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-near-black/60 furniture-text">
                  <span>{selectedProduct.category || 'ELECTRONICS'}</span>
                  <span>{selectedProduct.city || 'LOCAL'}</span>
                </div>

                <h3 className="font-bodoni font-bold text-xl text-near-black">
                  {selectedProduct.title}
                </h3>

                <div className="font-bodoni text-2xl font-bold text-accent">
                  {formatCredits(selectedProduct.priceInCredits || selectedProduct.price)}
                </div>
              </div>

              <Link
                to={`/products/${selectedProduct.id}`}
                className="w-full bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text py-3.5 transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <span>VIEW FULL OFFER</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
