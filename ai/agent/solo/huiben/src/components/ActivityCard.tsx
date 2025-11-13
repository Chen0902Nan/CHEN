import React from 'react'
import { Activity } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { formatDateTime } from '../utils'
import { cn } from '../utils'

interface ActivityCardProps {
  activity: Activity
  onClick?: () => void
  onRegister?: () => void
  className?: string
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onClick,
  onRegister,
  className,
}) => {
  const isUpcoming = activity.status === 'upcoming'
  const isOngoing = activity.status === 'ongoing'
  const isCompleted = activity.status === 'completed'
  const isCancelled = activity.status === 'cancelled'

  const getStatusBadge = () => {
    const statusConfig = {
      upcoming: { text: '即将开始', className: 'bg-accent-200 text-accent-800' },
      ongoing: { text: '进行中', className: 'bg-success text-white' },
      completed: { text: '已结束', className: 'bg-primary-300 text-primary-700' },
      cancelled: { text: '已取消', className: 'bg-error text-white' },
    }

    const config = statusConfig[activity.status]
    return (
      <span className={cn(
        'px-2 py-1 rounded-full text-xs font-medium',
        config.className
      )}>
        {config.text}
      </span>
    )
  }

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRegister?.()
  }

  return (
    <Card 
      className={className}
      hover={true}
      onClick={onClick}
    >
      <div className="relative">
        {/* 活动图片 */}
        <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-secondary-100 to-accent-100">
          {activity.images && activity.images.length > 0 ? (
            <img
              src={activity.images[0]}
              alt={activity.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-2 bg-secondary-200 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-secondary-600" />
                </div>
                <p className="text-secondary-500 text-sm">活动图片</p>
              </div>
            </div>
          )}
        </div>

        {/* 状态标签 */}
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
      </div>

      <CardHeader className="p-0">
        <CardTitle className="text-lg leading-tight mb-2">
          {activity.title}
        </CardTitle>
        
        {activity.description && (
          <p className="text-primary-600 text-sm line-clamp-2 mb-3">
            {activity.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {/* 活动信息 */}
        <div className="space-y-2 mb-4">
          {/* 时间 */}
          {activity.start_time && (
            <div className="flex items-center gap-2 text-sm text-primary-600">
              <Clock className="w-4 h-4 text-accent-400" />
              <span>{formatDateTime(activity.start_time)}</span>
              {activity.end_time && (
                <span> - {formatDateTime(activity.end_time)}</span>
              )}
            </div>
          )}

          {/* 地点 */}
          {activity.location && (
            <div className="flex items-center gap-2 text-sm text-primary-600">
              <MapPin className="w-4 h-4 text-accent-400" />
              <span>{activity.location}</span>
            </div>
          )}

          {/* 人数限制 */}
          {activity.max_participants && activity.max_participants > 0 && (
            <div className="flex items-center gap-2 text-sm text-primary-600">
              <Users className="w-4 h-4 text-accent-400" />
              <span>限 {activity.max_participants} 人</span>
            </div>
          )}
        </div>

        {/* 价格和报名 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-900">
              {activity.price === 0 ? '免费' : `¥${activity.price}`}
            </span>
          </div>

          {isUpcoming && onRegister && (
            <button
              onClick={handleRegisterClick}
              className={cn(
                'px-4 py-2 rounded-2xl',
                'bg-accent-200 hover:bg-accent-300',
                'text-primary-900 font-medium text-sm',
                'shadow-md hover:shadow-lg',
                'transition-all duration-200 hover:scale-105'
              )}
            >
              立即报名
            </button>
          )}

          {isOngoing && (
            <span className={cn(
              'px-4 py-2 rounded-2xl',
              'bg-success text-white font-medium text-sm'
            )}>
              进行中
            </span>
          )}

          {isCompleted && (
            <span className={cn(
              'px-4 py-2 rounded-2xl',
              'bg-primary-300 text-primary-700 font-medium text-sm'
            )}>
              已结束
            </span>
          )}

          {isCancelled && (
            <span className={cn(
              'px-4 py-2 rounded-2xl',
              'bg-error text-white font-medium text-sm'
            )}>
              已取消
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}