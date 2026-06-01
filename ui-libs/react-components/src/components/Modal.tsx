import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md',
  className 
}: ModalProps) => {
  // ESC 键关闭
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  // 点击遮罩层关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  // 尺寸样式
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'bg-white rounded-2xl shadow-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200',
          sizes[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        {(title || true) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* 内容 */}
        <div className="px-6 py-6">
          {children}
        </div>
        
        {/* 底部 */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export { Modal }
