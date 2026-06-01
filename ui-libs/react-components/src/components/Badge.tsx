import React from 'react'
import { cn } from '../lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Badge = ({ 
  className, 
  variant = 'default', 
  size = 'md',
  ...props 
}: BadgeProps) => {
  // 变体样式
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    danger: 'bg-danger-100 text-danger-700',
  }
  
  // 尺寸样式
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
