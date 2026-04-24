import React from 'react'
import { Book } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { StarRating } from './ui/Badge'
import { formatPrice, cn } from '../utils'
import { Heart, ShoppingCart } from 'lucide-react'

interface BookCardProps {
  book: Book
  onClick?: () => void
  onAddToCart?: () => void
  onToggleFavorite?: () => void
  isFavorite?: boolean
  showPrice?: boolean
  showRating?: boolean
  className?: string
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  showPrice = true,
  showRating = true,
  className,
}) => {
  const handleCardClick = () => {
    onClick?.()
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite?.()
  }

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart?.()
  }

  return (
    <Card 
      className={className}
      hover={true}
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* 封面图片 */}
        <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-primary-100 to-secondary-100">
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-2 bg-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">绘</span>
                </div>
                <p className="text-primary-500 text-sm">暂无封面</p>
              </div>
            </div>
          )}
        </div>

        {/* 收藏按钮 */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={cn(
              'action-button absolute top-3 right-3',
              'p-2 rounded-full bg-white/80 backdrop-blur-sm',
              'shadow-lg hover:shadow-xl transition-all duration-200',
              'hover:scale-110'
            )}
          >
            <Heart
              className={cn(
                'w-4 h-4',
                isFavorite ? 'fill-error text-error' : 'text-primary-400 hover:text-error'
              )}
            />
          </button>
        )}

        {/* 年龄段标签 */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            'bg-accent-200 text-accent-800',
            'shadow-sm'
          )}>
            {book.min_age}-{book.max_age}岁
          </span>
        </div>

        {/* 会员专享标识 */}
        {book.is_premium && (
          <div className="absolute top-3 right-3">
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              'bg-gradient-to-r from-yellow-400 to-orange-400',
              'text-white shadow-sm'
            )}>
              会员
            </span>
          </div>
        )}
      </div>

      <CardHeader className="p-0">
        <CardTitle className="text-lg leading-tight mb-2">
          {book.title}
        </CardTitle>
        
        {book.author && (
          <p className="text-primary-600 text-sm mb-2">
            作者：{book.author}
          </p>
        )}
        
        {book.description && (
          <p className="text-primary-500 text-sm line-clamp-2 mb-3">
            {book.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {/* 评分 */}
        {showRating && book.rating && (
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={book.rating} size="sm" />
            <span className="text-sm text-primary-600">
              {book.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* 分类标签 */}
        {book.category && (
          <div className="mb-3">
            <span className={cn(
              'inline-block px-3 py-1 rounded-full text-xs',
              'bg-primary-100 text-primary-700'
            )}>
              {book.category}
            </span>
          </div>
        )}

        {/* 价格和操作 */}
        <div className="flex items-center justify-between">
          {showPrice && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary-900">
                {formatPrice(book.price)}
              </span>
              {book.is_premium && (
                <span className="text-xs text-primary-500 line-through">
                  {formatPrice(book.price * 1.5)}
                </span>
              )}
            </div>
          )}

          {onAddToCart && (
            <button
              onClick={handleAddToCartClick}
              className={cn(
                'action-button p-2 rounded-full',
                'bg-accent-200 hover:bg-accent-300',
                'text-primary-900 shadow-md hover:shadow-lg',
                'transition-all duration-200 hover:scale-110'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}