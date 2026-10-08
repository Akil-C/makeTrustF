import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'

const SIZES = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full mx-4',
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size             = 'md',
  showCloseButton  = true,
  closeOnBackdrop  = true,
  footer,
  className        = '',
}) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const prev = document.activeElement
    dialogRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus()
    }
  }, [isOpen, onClose])

  const handleBackdrop = useCallback(
    (e) => { if (closeOnBackdrop && e.target === e.currentTarget) onClose() },
    [closeOnBackdrop, onClose],
  )

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={clsx(
          'relative w-full bg-white border border-[#070707]/20 shadow-2xl outline-none flex flex-col max-h-[90vh]',
          SIZES[size],
          className,
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#070707]/10 shrink-0">
            {title && (
              <h2
                id="modal-title"
                className="font-serif text-lg font-bold text-[#070707]"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto p-1.5 bg-[#070707] text-white hover:bg-[#EF6F79] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#070707]/10 shrink-0 bg-[#F1F1ED]/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
