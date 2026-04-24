import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Bell, MessageCircle } from 'lucide-react'
import { useUserStore } from '../../stores/user'
import { cn } from '../../utils'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showSearch?: boolean
  showNotifications?: boolean
  showMessages?: boolean
  onBack?: () => void
  onSearch?: () => void
  className?: string
}

export const Header: React.FC<HeaderProps> = ({
  title = '绘本岛',
  showBack = false,
  showSearch = true,
  showNotifications = true,
  showMessages = false,
  onBack,
  onSearch,
  className,
}) => {
  const { user } = useUserStore()

  return (
    <header className={cn(
      'sticky top-0 z-40',
      'bg-gradient-to-r from-primary-50 to-secondary-50',
      'border-b border-primary-200',
      'px-4 py-3',
      className
    )}>
      <div className="flex items-center justify-between">
        {/* 左侧区域 */}
        <div className="flex items-center gap-3 flex-1">
          {showBack ? (
            <button
              onClick={onBack}
              className={cn(
                'p-2 rounded-full',
                'text-primary-600 hover:text-primary-800',
                'hover:bg-primary-100 transition-colors duration-200'
              )}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full',
                'bg-gradient-to-br from-accent-200 to-accent-300',
                'flex items-center justify-center',
                'animate-bounce-gentle'
              )}>
                <span className="text-white font-bold text-sm">绘</span>
              </div>
            </Link>
          )}
          
          <h1 className={cn(
            'text-xl font-bold text-gradient',
            'bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent'
          )}>
            {title}
          </h1>
        </div>

        {/* 中间搜索区域 */}
        {showSearch && (
          <div className="flex-1 max-w-md mx-4">
            <div
              onClick={onSearch}
              className={cn(
                'flex items-center gap-3',
                'bg-white/80 backdrop-blur-sm',
                'rounded-2xl px-4 py-2',
                'border border-primary-200',
                'hover:bg-white hover:shadow-md',
                'transition-all duration-200 cursor-pointer'
              )}
            >
              <Search className="w-4 h-4 text-primary-400" />
              <span className="text-primary-500 text-sm flex-1">搜索绘本、活动...</span>
            </div>
          </div>
        )}

        {/* 右侧操作区域 */}
        <div className="flex items-center gap-2">
          {showMessages && (
            <button
              className={cn(
                'p-2 rounded-full',
                'text-primary-600 hover:text-primary-800',
                'hover:bg-primary-100 transition-colors duration-200'
              )}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          )}
          
          {showNotifications && (
            <button
              className={cn(
                'p-2 rounded-full relative',
                'text-primary-600 hover:text-primary-800',
                'hover:bg-primary-100 transition-colors duration-200'
              )}
            >
              <Bell className="w-5 h-5" />
              {/* 通知红点 */}
              <span className={cn(
                'absolute -top-1 -right-1',
                'w-3 h-3 bg-error rounded-full',
                'animate-pulse'
              )} />
            </button>
          )}
          
          {/* 用户头像 */}
          {user ? (
            <Link
              to="/profile"
              className={cn(
                'w-8 h-8 rounded-full overflow-hidden',
                'border-2 border-accent-200',
                'hover:scale-105 transition-transform duration-200'
              )}
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={cn(
                  'w-full h-full',
                  'bg-gradient-to-br from-accent-200 to-accent-300',
                  'flex items-center justify-center'
                )}>
                  <span className="text-white font-bold text-sm">
                    {user.nickname.charAt(0)}
                  </span>
                </div>
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className={cn(
                'px-4 py-2 rounded-2xl',
                'bg-accent-200 hover:bg-accent-300',
                'text-primary-900 font-medium text-sm',
                'transition-colors duration-200'
              )}
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}