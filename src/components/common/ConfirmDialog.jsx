import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

/**
 * Reusable confirmation dialog.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void,
 *   title?: string,
 *   message?: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   variant?: 'danger'|'warning'|'primary',
 *   isLoading?: boolean,
 * }} props
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title        = 'Are you sure?',
  message      = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  variant      = 'danger',
  isLoading    = false,
}) {
  const variantStyles = {
    danger:  'bg-red-600   hover:bg-red-700',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    primary: 'bg-primary-600 hover:bg-primary-700',
  }

  const iconColors = {
    danger:  'bg-red-100   text-red-600',
    warning: 'bg-yellow-100 text-yellow-600',
    primary: 'bg-primary-100 text-primary-600',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex flex-col items-center text-center py-2">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${iconColors[variant]}`}
        >
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium
                       text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white
                        transition-colors disabled:opacity-50 ${variantStyles[variant]}`}
          >
            {isLoading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
