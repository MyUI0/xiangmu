import React, { forwardRef } from 'react'
import { cn } from '../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    error = false, 
    leftIcon, 
    rightIcon,
    ...props 
  }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full h-10 px-4 rounded-lg border bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error 
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' 
              : 'border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-primary-500',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
