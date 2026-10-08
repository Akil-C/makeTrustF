import { useState, useCallback, useEffect } from 'react'

const CACHE_KEY = 'mt_geolocation'
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

function loadCached() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { location, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY)
      return null
    }
    return location
  } catch {
    return null
  }
}

function saveCache(location) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ location, timestamp: Date.now() }),
    )
  } catch { /* storage might be full */ }
}

/**
 * Custom hook for browser geolocation with sessionStorage caching.
 *
 * @returns {{
 *   location: { lat: number, lng: number } | null,
 *   error: string | null,
 *   loading: boolean,
 *   requestLocation: () => void,
 * }}
 */
export function useGeolocation() {
  const cached = loadCached()
  const [location, setLocation] = useState(cached)
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    // Return cached immediately if fresh
    const fresh = loadCached()
    if (fresh) {
      setLocation(fresh)
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }
        setLocation(loc)
        saveCache(loc)
        setLoading(false)
      },
      (err) => {
        const messages = {
          1: 'Location access denied. Please allow location in your browser settings.',
          2: 'Unable to determine your location. Please try again.',
          3: 'Location request timed out. Please try again.',
        }
        setError(messages[err.code] || 'An unknown location error occurred.')
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: CACHE_TTL,
      },
    )
  }, [])

  // Auto-request on mount if no cached location
  useEffect(() => {
    if (!cached) {
      requestLocation()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { location, error, loading, requestLocation }
}

export default useGeolocation
