import React from 'react'
import { cn } from '../lib/utils'

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  closable?: boolean
  onClose?: () => void
}

const Tag = ({ 
  className, 
  variant = 'default', 
  closable = false,
  onClose,
  children,
  ...props 
}: TagProps) => {
  // 变体样式
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    danger: 'bg-danger-50 text-danger-700 border-danger-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
      {closable && (
        <button
          onClick={onClose}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

export { Tag }
