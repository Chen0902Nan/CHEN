import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  Calendar, 
  User, 
  ShoppingCart 
} from 'lucide-react'
import { useCartStore } from '../../stores/cart'
import { cn } from '../../utils'

interface BottomNavProps {
  className?: string
}

export const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  const location = useLocation()
  const { getTotalItems } = useCartStore()
  const cartItemCount = getTotalItems()

  const navItems = [
    {
      path: '/',
      label: '首页',
      icon: Home,
    },
    {
      path: '/books',
      label: '绘本馆',
      icon: BookOpen,
    },
    {
      path: '/activities',
      label: '活动',
      icon: Calendar,
    },
    {
      path: '/cart',
      label: '购物车',
      icon: ShoppingCart,
      badge: cartItemCount > 0 ? cartItemCount : undefined,
    },
    {
      path: '/profile',
      label: '我的',
      icon: User,
    },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 bg-white border-t border-primary-200',
      'flex items-center justify-around py-2 px-4',
      'shadow-lg rounded-t-3xl',
      'z-50',
      className
    )}>
      {navItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.path)
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center py-2 px-3',
              'relative transition-colors duration-200',
              'hover:bg-primary-50 rounded-2xl',
              active ? 'text-accent-400' : 'text-primary-600'
            )}
          >
            <div className="relative">
              <Icon className={cn('w-6 h-6', active && 'scale-110')} />
              {item.badge && (
                <span className={cn(
                  'absolute -top-2 -right-2',
                  'bg-error text-white text-xs',
                  'rounded-full w-5 h-5 flex items-center justify-center',
                  'animate-pulse'
                )}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className={cn(
              'text-xs mt-1 font-medium',
              active ? 'text-accent-400' : 'text-primary-600'
            )}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}