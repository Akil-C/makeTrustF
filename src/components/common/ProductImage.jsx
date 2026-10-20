import React, { useState } from 'react'
import { getProductImage } from '../../utils/productsData'

/**
 * Resilient Product Image component.
 * Automatically resolves verified photography and recovers from network errors
 * or broken URLs by falling back to category-relevant imagery.
 */
export default function ProductImage({
  src,
  alt = 'Product image',
  product,
  className = 'w-full h-full object-cover',
  aspectRatio = 'aspect-square',
}) {
  const initialUrl = src || (product ? getProductImage(product) : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80')
  const [imgSrc, setImgSrc] = useState(initialUrl)
  const [hasError, setHasError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      const fallback = getProductImage(product)
      if (fallback !== imgSrc) {
        setImgSrc(fallback)
      } else {
        setImgSrc('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80')
      }
    }
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${aspectRatio}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
    </div>
  )
}
