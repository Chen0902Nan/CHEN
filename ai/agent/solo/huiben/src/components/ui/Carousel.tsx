import React from 'react'
import { cn } from '../../utils'

interface CarouselProps {
  children: React.ReactNode[]
  autoPlay?: boolean
  interval?: number
  showIndicators?: boolean
  showControls?: boolean
  className?: string
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = true,
  interval = 3000,
  showIndicators = true,
  showControls = true,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  React.useEffect(() => {
    resetTimeout()
    
    if (autoPlay && children.length > 1) {
      timeoutRef.current = setTimeout(
        () => handleNext(),
        interval
      )
    }

    return () => resetTimeout()
  }, [currentIndex, autoPlay, interval, children.length])

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => 
      prevIndex === children.length - 1 ? 0 : prevIndex + 1
    )
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handlePrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    )
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchDown = e.touches[0].clientX
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0].clientX
      const swipeDistance = touchDown - touch
      
      if (swipeDistance > 50) {
        handleNext()
        cleanup()
      } else if (swipeDistance < -50) {
        handlePrev()
        cleanup()
      }
    }

    function handleTouchEnd() {
      cleanup()
    }

    function cleanup() {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }

  if (children.length === 0) return null

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <div 
        className="relative h-full"
        onTouchStart={handleTouchStart}
      >
        <div 
          className={cn(
            'flex transition-transform duration-300 ease-in-out',
            isTransitioning && 'transition-none'
          )}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      {showControls && children.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 z-10',
              'bg-white/80 hover:bg-white text-primary-700 p-2 rounded-full shadow-lg',
              'transition-all duration-200 hover:scale-110'
            )}
            aria-label="上一张"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 z-10',
              'bg-white/80 hover:bg-white text-primary-700 p-2 rounded-full shadow-lg',
              'transition-all duration-200 hover:scale-110'
            )}
            aria-label="下一张"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {showIndicators && children.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-200',
                currentIndex === index 
                  ? 'bg-accent-300 scale-125' 
                  : 'bg-white/60 hover:bg-white/80'
              )}
              aria-label={`前往第 ${index + 1} 张`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CarouselSlideProps {
  children: React.ReactNode
  className?: string
  bgImage?: string
  overlay?: boolean
}

export const CarouselSlide: React.FC<CarouselSlideProps> = ({
  children,
  className,
  bgImage,
  overlay = true,
}) => {
  return (
    <div 
      className={cn(
        'relative w-full h-full flex items-center justify-center',
        'bg-cover bg-center bg-no-repeat',
        className
      )}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      {overlay && bgImage && (
        <div className="absolute inset-0 bg-black/20" />
      )}
      <div className={cn('relative z-10', overlay && bgImage && 'text-white')}> 
        {children}
      </div>
    </div>
  )
}