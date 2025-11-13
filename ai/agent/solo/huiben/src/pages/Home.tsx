import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { BottomNav } from '../components/layout/BottomNav'
import { BookCard } from '../components/BookCard'
import { ActivityCard } from '../components/ActivityCard'
import { Carousel, CarouselSlide } from '../components/ui/Carousel'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useBookStore } from '../stores/books'
import { cn } from '../utils'
import { useUserStore } from '../stores/user'
import { bookService } from '../services/books'
import { Book, Activity as ActivityType } from '../types'
import { usePageTitle } from '../hooks'
import { BookOpen, Calendar, Sparkles, Heart, TrendingUp } from 'lucide-react'

// 模拟轮播图数据
const bannerSlides = [
  {
    id: 1,
    title: '六一儿童节精选绘本',
    subtitle: '陪伴孩子快乐成长',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Children%27s%20book%20illustration%2C%20colorful%20and%20warm%2C%20kids%20reading%20together%2C%20gentle%20pastel%20colors%2C%20storybook%20style&image_size=landscape_16_9',
    link: '/books?category=节日专题',
  },
  {
    id: 2,
    title: '亲子共读时光',
    subtitle: '每天十分钟，绘出成长的奇妙旅程',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Parent%20and%20child%20reading%20together%2C%20cozy%20bedroom%20setting%2C%20soft%20lighting%2C%20warm%20and%20loving%20atmosphere%2C%20illustration%20style&image_size=landscape_16_9',
    link: '/activities',
  },
  {
    id: 3,
    title: '新用户专享',
    subtitle: '注册即享精选绘本免费读',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Welcome%20gift%20box%20with%20books%2C%20colorful%20and%20festive%2C%20children%27s%20illustration%20style%2C%20bright%20and%20cheerful&image_size=landscape_16_9',
    link: '/auth/register',
  },
]

// 模拟分类数据
const categories = [
  { id: 'story', name: '故事绘本', icon: BookOpen, color: 'from-accent-200 to-accent-300' },
  { id: 'science', name: '科普知识', icon: Sparkles, color: 'from-secondary-200 to-secondary-300' },
  { id: 'emotion', name: '情绪管理', icon: Heart, color: 'from-pink-200 to-pink-300' },
  { id: 'habit', name: '习惯养成', icon: TrendingUp, color: 'from-green-200 to-green-300' },
]

export const Home: React.FC = () => {
  usePageTitle('首页')
  
  const { user } = useUserStore()
  const { 
    popularBooks, 
    recommendedBooks, 
    setPopularBooks, 
    setRecommendedBooks 
  } = useBookStore()
  
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 加载首页数据
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true)
        
        // 加载热门绘本
        const popularResult = await bookService.getPopularBooks(6)
        if (popularResult.success && popularResult.data) {
          setPopularBooks(popularResult.data)
        }
        
        // 加载推荐绘本
        const recommendedResult = await bookService.getRecommendedBooks(user?.id, 6)
        if (recommendedResult.success && recommendedResult.data) {
          setRecommendedBooks(recommendedResult.data)
        }
        
        // 模拟加载活动数据
        setActivities([
          {
            id: '1',
            title: '周末亲子故事会',
            description: '专业老师带领，一起阅读经典绘本故事',
            location: '绘本岛体验中心',
            start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
            max_participants: 15,
            price: 0,
            images: ['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Children%20storytelling%20session%2C%20kids%20sitting%20in%20circle%2C%20teacher%20reading%20book%2C%20warm%20and%20colorful%20illustration&image_size=square'],
            status: 'upcoming',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: '亲子手工绘本制作',
            description: '和孩子一起动手制作属于自己的绘本',
            location: '创意手工坊',
            start_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
            max_participants: 12,
            price: 128,
            images: ['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Parent%20and%20child%20making%20handmade%20book%2C%20craft%20materials%20on%20table%2C%20creative%20and%20fun%20atmosphere%2C%20illustration%20style&image_size=square'],
            status: 'upcoming',
            created_at: new Date().toISOString(),
          },
        ])
        
      } catch (error) {
        console.error('加载首页数据失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHomeData()
  }, [user?.id, setPopularBooks, setRecommendedBooks])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Header />
      
      <main className="pb-20">
        {/* 轮播图区域 */}
        <section className="mb-8">
          <Carousel 
            autoPlay={true}
            interval={4000}
            showIndicators={true}
            showControls={true}
            className="h-64 rounded-3xl overflow-hidden mx-4"
          >
            {bannerSlides.map((slide) => (
              <CarouselSlide 
                key={slide.id}
                bgImage={slide.image}
                overlay={true}
              >
                <div className="text-center px-6">
                  <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-white/90 mb-4 drop-shadow-md">
                    {slide.subtitle}
                  </p>
                  <Link to={slide.link}>
                    <Button variant="secondary" size="sm">
                      立即查看
                    </Button>
                  </Link>
                </div>
              </CarouselSlide>
            ))}
          </Carousel>
        </section>

        {/* 分类快捷入口 */}
        <section className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary-900">绘本分类</h3>
            <Link to="/books" className="text-accent-400 hover:text-accent-500 text-sm">
              查看全部
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.id}
                  to={`/books?category=${category.name}`}
                  className={cn(
                    'p-4 rounded-3xl',
                    'bg-gradient-to-br',
                    category.color,
                    'hover:shadow-xl transition-all duration-300',
                    'transform hover:-translate-y-1'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/80 rounded-2xl">
                      <Icon className="w-6 h-6 text-primary-700" />
                    </div>
                    <span className="font-bold text-primary-900">
                      {category.name}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 热门绘本推荐 */}
        <section className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary-900">热门绘本</h3>
            <Link to="/books?sort_by=rating" className="text-accent-400 hover:text-accent-500 text-sm">
              查看更多
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-primary-200 rounded-3xl mb-3"></div>
                  <div className="h-4 bg-primary-200 rounded-full mb-2"></div>
                  <div className="h-3 bg-primary-100 rounded-full w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {popularBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => {/* 跳转到绘本详情 */}}
                  onAddToCart={() => {/* 添加到购物车 */}}
                  showPrice={true}
                  showRating={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* 亲子活动推荐 */}
        <section className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary-900">亲子活动</h3>
            <Link to="/activities" className="text-accent-400 hover:text-accent-500 text-sm">
              查看全部
            </Link>
          </div>
          
          <div className="space-y-4">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => {/* 跳转到活动详情 */}}
                onRegister={() => {/* 报名活动 */}}
              />
            ))}
          </div>
        </section>

        {/* 个性化推荐 */}
        {user && recommendedBooks.length > 0 && (
          <section className="px-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-primary-900">为您推荐</h3>
              <Link to="/books" className="text-accent-400 hover:text-accent-500 text-sm">
                更多推荐
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {recommendedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => {/* 跳转到绘本详情 */}}
                  onAddToCart={() => {/* 添加到购物车 */}}
                  showPrice={true}
                  showRating={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* 新用户引导 */}
        {!user && (
          <section className="px-4 mb-8">
            <div className={cn(
              'p-6 rounded-3xl',
              'bg-gradient-to-r from-accent-100 to-secondary-100',
              'border border-accent-200'
            )}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-accent-400" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-2">
                  开启亲子阅读之旅
                </h3>
                <p className="text-primary-600 mb-4">
                  注册即享精选绘本免费读，让阅读成为亲子间最美好的时光
                </p>
                <div className="flex gap-3 justify-center">
                  <Link to="/auth/register">
                    <Button variant="primary">
                      立即注册
                    </Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button variant="outline">
                      已有账号
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  )
}