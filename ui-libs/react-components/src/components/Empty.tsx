import React from 'react'
import { cn } from '../lib/utils'

interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  icon?: React.ReactNode
}

const Empty = ({ 
  className, 
  title = '暂无数据', 
  description = '这里什么都没有',
  icon,
  ...props 
}: EmptyProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
      {...props}
    >
      {icon ? (
        <div className="text-gray-300 mb-4">
          {icon}
        </div>
      ) : (
        <div className="w-20 h-20 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  )
}

export { Empty }
