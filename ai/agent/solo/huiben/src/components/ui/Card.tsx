import React from 'react'
import { cn } from '../../utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'gentle' | 'outline'
  hover?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  hover = true,
  onClick
}) => {
  const baseClasses = 'rounded-3xl border transition-all duration-300'
  
  const variantClasses = {
    default: 'bg-white shadow-lg border-primary-100',
    gentle: 'bg-gradient-to-br from-primary-50 to-secondary-50 shadow-lg border-primary-100',
    outline: 'bg-transparent border-2 border-primary-200',
  }
  
  const hoverClasses = hover ? 'hover:shadow-xl transform hover:-translate-y-1' : ''
  
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    hoverClasses,
    className
  )
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className, level = 'h3' }) => {
  const HeadingTag = level
  
  return (
    <HeadingTag className={cn('text-xl font-bold text-primary-900 mb-2', className)}>
      {children}
    </HeadingTag>
  )
}

interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  return (
    <p className={cn('text-primary-600 text-sm', className)}>
      {children}
    </p>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={cn('p-6 pt-0 flex items-center gap-2', className)}>
      {children}
    </div>
  )
}