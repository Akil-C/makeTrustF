import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import clsx from 'clsx'

/**
 * Search bar with debounce and clear button.
 *
 * @param {{
 *   value?: string,
 *   onChange?: (value: string) => void,
 *   onSearch?: (value: string) => void,
 *   placeholder?: string,
 *   debounceMs?: number,
 *   autoFocus?: boolean,
 *   className?: string,
 *   inputClassName?: string,
 *   size?: 'sm'|'md'|'lg',
 * }} props
 */
export default function SearchBar({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder  = 'Search…',
  debounceMs   = 300,
  autoFocus    = false,
  className    = '',
  inputClassName = '',
  size         = 'md',
}) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState('')
  const debounceRef = useRef(null)
  const inputRef    = useRef(null)

  const value = isControlled ? controlledValue : internalValue

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const handleChange = useCallback(
    (e) => {
      const v = e.target.value
      if (!isControlled) setInternalValue(v)
      onChange?.(v)

      // Debounced onSearch
      if (onSearch) {
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => onSearch(v), debounceMs)
      }
    },
    [isControlled, onChange, onSearch, debounceMs],
  )

  const handleClear = () => {
    if (!isControlled) setInternalValue('')
    onChange?.('')
    onSearch?.('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      clearTimeout(debounceRef.current)
      onSearch?.(value)
    }
  }

  const heights = { sm: 'h-8', md: 'h-10', lg: 'h-12' }
  const iconSizes = { sm: 'w-4 h-4', md: 'w-4 h-4', lg: 'w-5 h-5' }
  const textSizes = { sm: 'text-sm', md: 'text-sm', lg: 'text-base' }
  const paddings  = { sm: 'pl-8 pr-8', md: 'pl-10 pr-10', lg: 'pl-12 pr-12' }

  return (
    <div className={clsx('relative', className)}>
      <Search
        className={clsx(
          'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
          iconSizes[size],
        )}
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-xl border border-gray-200 bg-white outline-none transition-shadow',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'placeholder:text-gray-400',
          heights[size],
          textSizes[size],
          paddings[size],
          inputClassName,
        )}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className={iconSizes[size]} />
        </button>
      )}
    </div>
  )
}
