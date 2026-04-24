import React from 'react'
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner'

// 自定义Toast样式和配置
export const Toaster = () => {
  return (
    <SonnerToaster
      position="top-center"
      style={{
        background: 'var(--color-primary-50)',
        color: 'var(--color-primary-900)',
        border: '2px solid var(--color-primary-200)',
        borderRadius: '1rem',
        padding: '1rem',
        fontFamily: 'Noto Sans SC, sans-serif',
      }}
      richColors
      closeButton
      duration={3000}
    />
  )
}

// 自定义Toast方法
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 3000,
    })
  },
  
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 4000,
    })
  },
  
  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 3000,
    })
  },
  
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 3500,
    })
  },
  
  loading: (message: string) => {
    return sonnerToast.loading(message)
  },
  
  promise: (promise: Promise<any>, messages: {
    loading: string
    success: string | ((data: any) => string)
    error: string | ((error: any) => string)
  }): any => {
    return sonnerToast.promise(promise, messages)
  },
  
  custom: (jsx: React.ReactNode, options?: any) => {
    return sonnerToast.custom(() => <>{jsx}</>, options)
  },
  
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId)
  },
}

// 绘本岛特色Toast样式
export const huibenToast = {
  welcome: (nickname: string) => {
    toast.success(`欢迎回来，${nickname}！`, '继续享受亲子阅读时光吧～')
  },
  
  bookAddedToCart: (bookTitle: string) => {
    toast.success('已添加到购物车', `《${bookTitle}》已加入购物车`)
  },
  
  readingCompleted: (bookTitle: string) => {
    toast.success('阅读完成！', `恭喜完成《${bookTitle}》的阅读`)
  },
  
  activityRegistered: (activityTitle: string) => {
    toast.success('报名成功！', `已成功报名${activityTitle}活动`)
  },
  
  orderPlaced: (orderNumber: string) => {
    toast.success('订单提交成功', `订单号：${orderNumber}`)
  },
  
  childProfileUpdated: (childName: string) => {
    toast.success('档案更新成功', `${childName}的档案已更新`)
  },
  
  reviewSubmitted: (bookTitle: string) => {
    toast.success('评价提交成功', `感谢您对《${bookTitle}》的评价`)
  },
  
  checkInSuccess: (day: number) => {
    toast.success('打卡成功！', `已连续打卡${day}天，继续加油！`)
  },
}