import React from 'react'
import { cn } from '../lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

const Card = ({ className, hoverable = false, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-sm',
        hoverable && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className
      )}
      {...props}
    />
  )
}

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('p-6 border-b border-gray-100', className)}
      {...props}
    />
  )
}

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={cn('text-xl font-semibold text-gray-900', className)}
      {...props}
    />
  )
}

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={cn('text-sm text-gray-500 mt-1', className)}
      {...props}
    />
  )
}

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('p-6', className)}
      {...props}
    />
  )
}

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('p-6 border-t border-gray-100 flex items-center gap-2', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
