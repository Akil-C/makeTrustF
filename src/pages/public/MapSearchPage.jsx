import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Search,
  Filter,
  Layers,
  ShoppingBag,
  Star,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  LocateFixed,
} from 'lucide-react'
import productService from '../../services/productService'
import { formatCredits } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import SellerLevelBadge from '../../components/common/SellerLevelBadge'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const CITY_COORDINATES = {
  Bengaluru: { lat: 12.9716, lng: 77.5946, label: 'Bengaluru (Hub Catalog)' },
  Mumbai: { lat: 19.076, lng: 72.8777, label: 'Mumbai' },
  Delhi: { lat: 28.7041, lng: 77.1025, label: 'New Delhi' },
  SanFrancisco: { lat: 37.7749, lng: -122.4194, label: 'San Francisco' },
}

export default function MapSearchPage() {
  const [selectedCity, setSelectedCity] = useState('Bengaluru')
  const [radiusKm, setRadiusKm] = useState(25)
  const [mapProducts, setMapProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadNearby = async (coords) => {
    setLoading(true)
    try {
      const res = await productService.getNearbyProducts(coords.lat, coords.lng, radiusKm)
      let list = res.data?.content || res.data || []

      // If nearby query yields 0 for unseeded city, fall back to active catalog
      if (list.length === 0) {
        const catalogRes = await productService.searchProducts({ size: 15 })
        list = catalogRes.data?.content || []
      }

      const formatted = list.map((p, idx) => ({
        ...p,
        x: 20 + ((idx * 27) % 60),
        y: 25 + ((idx * 19) % 55),
        distanceKm: p.distance ? Number(p.distance).toFixed(1) : (1.2 + (idx * 0.8)).toFixed(1),
      }))

      setMapProducts(formatted)
      if (formatted.length > 0) {
        setSelectedProduct(formatted[0])
      }
    } catch {
      setMapProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const coords = CITY_COORDINATES[selectedCity] || CITY_COORDINATES.Bengaluru
    loadNearby(coords)
  }, [selectedCity, radiusKm])

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        toast.success(`Located GPS coordinates: ${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}`)
        loadNearby(coords)
      },
      () => {
        toast.error('Location permission denied. Showing Bengaluru Hub catalog.')
      }
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        <DemoDisclaimer />

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Geospatial Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <Compass className="w-7 h-7 text-rose-600" />
              <span>Interactive Local Marketplace Map</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Locate verified sellers and products in your immediate neighborhood for convenient local safe-point pickup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs"
            >
              {Object.entries(CITY_COORDINATES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>

            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs"
            >
              <option value={5}>Radius: 5 KM</option>
              <option value={10}>Radius: 10 KM</option>
              <option value={25}>Radius: 25 KM</option>
              <option value={50}>Radius: 50 KM</option>
            </select>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
              title="Use current GPS location"
            >
              <LocateFixed className="w-4 h-4" />
              <span>My GPS</span>
            </button>
          </div>
        </div>

        {/* Map Grid Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Map Area */}
          <div className="lg:col-span-2 relative aspect-[16/10] bg-slate-900 rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-6 text-white">
            {/* Map Grid Lines */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Radar center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-rose-500/30 animate-pulse pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-rose-500/20 pointer-events-none" />

            {/* Pins */}
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 z-30">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              mapProducts.map((p) => {
                const isSelected = selectedProduct?.id === p.id
                const price = p.priceInCredits ?? p.price ?? 0

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  >
                    <div
                      className={`px-2.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-md ${
                        isSelected
                          ? 'bg-rose-600 text-white scale-110 ring-4 ring-rose-400/30 z-30'
                          : 'bg-white text-slate-900 hover:scale-105'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-mono text-xs font-bold">
                        {formatCredits(price)}
                      </span>
                    </div>
                  </button>
                )
              })
            )}

            {/* Geo Hub Badge */}
            <div className="absolute bottom-4 left-4 text-[11px] font-bold text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-700/80 backdrop-blur-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>RADAR ACTIVE: {CITY_COORDINATES[selectedCity]?.label || 'LOCAL'} • {radiusKm} KM RADIUS</span>
            </div>
          </div>

          {/* Selected Product Card */}
          {selectedProduct ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Selected Nearby Listing</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {selectedProduct.distanceKm || '1.4'} km away
                </span>
              </div>

              <div className="aspect-4/3 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={selectedProduct.primaryImageUrl || selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop'}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>{selectedProduct.categoryName || selectedProduct.category || 'Classified'}</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {selectedProduct.city || 'Bengaluru'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {selectedProduct.title}
                </h3>

                <div className="pt-1 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price</span>
                    <span className="text-2xl font-mono font-extrabold text-slate-900">
                      {formatCredits(selectedProduct.priceInCredits || selectedProduct.price)}
                    </span>
                  </div>
                  <SellerLevelBadge level={selectedProduct.seller?.sellerLevel || 'PLATINUM'} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to={`/products/${selectedProduct.id}`}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                >
                  <span>Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/checkout/${selectedProduct.id}`}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Escrow Buy</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center text-slate-500 text-xs">
              Click any pin on the map to inspect the listing details.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
