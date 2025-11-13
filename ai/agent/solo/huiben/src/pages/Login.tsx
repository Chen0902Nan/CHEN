import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { toast, huibenToast } from '../components/ui/Toast'
import { authService } from '../services/auth'
import { useUserStore } from '../stores/user'
import { cn } from '../utils'
import { 
  Phone, 
  MessageCircle, 
  Lock, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react'

interface LoginForm {
  phone: string
  password: string
  verificationCode: string
}

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { setUser } = useUserStore()
  const [loginMethod, setLoginMethod] = useState<'phone' | 'password' | 'wechat' | 'quick'>('phone')
  const [formData, setFormData] = useState<LoginForm>({
    phone: '',
    password: '',
    verificationCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSendVerificationCode = async () => {
    if (!formData.phone) {
      toast.error('请输入手机号')
      return
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      toast.error('请输入正确的手机号')
      return
    }

    setIsLoading(true)
    try {
      const result = await authService.sendVerificationCode(formData.phone)
      if (result.success) {
        // 检测是否为演示模式
        if (result.message?.includes('演示模式')) {
          setIsDemoMode(true)
          toast.success('验证码已发送（演示模式：123456）')
          // 自动填充验证码
          setFormData(prev => ({ ...prev, verificationCode: '123456' }))
        } else {
          toast.success('验证码已发送')
        }
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        toast.error(result.error || '发送失败')
      }
    } catch (error) {
      toast.error('发送失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!formData.phone) {
      toast.error('请输入手机号')
      return
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      toast.error('请输入正确的手机号')
      return
    }

    setIsLoading(true)
    try {
      let result
      
      if (loginMethod === 'password') {
        // 密码登录
        if (!formData.password) {
          toast.error('请输入密码')
          return
        }
        result = await authService.loginWithPhone(formData.phone, formData.password)
      } else if (loginMethod === 'quick') {
        // 快速登录 - 这里需要创建一个新方法
        result = await authService.loginWithVerificationCode(formData.phone, formData.verificationCode)
      } else {
        // 使用验证码登录
        if (!formData.verificationCode) {
          toast.error('请先获取验证码')
          return
        }
        result = await authService.loginWithVerificationCode(formData.phone, formData.verificationCode)
      }

      if (result.success && result.data) {
        setUser(result.data)
        huibenToast.welcome(result.data.nickname)
        navigate('/')
      } else {
        toast.error(result.error || '登录失败')
      }
    } catch (error) {
      toast.error('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWeChatLogin = () => {
    toast.info('微信登录功能开发中...')
    // TODO: 实现微信登录
  }

  const handleQuickLogin = () => {
    setLoginMethod('quick')
    // 生成随机手机号用于演示
    const demoPhone = '138' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
    setFormData(prev => ({ ...prev, phone: demoPhone }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <Header title="登录" showBack />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* 登录方式选择 */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setLoginMethod('phone')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                loginMethod === 'phone' 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-primary-600 hover:text-primary-700'
              )}
            >
              验证码登录
            </button>
            <button
              onClick={() => setLoginMethod('password')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                loginMethod === 'password' 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-primary-600 hover:text-primary-700'
              )}
            >
              密码登录
            </button>
          </div>
        </div>

        {/* 演示模式提示 */}
        {isDemoMode && loginMethod !== 'quick' && (
          <Card className="mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">演示模式</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                当前为演示环境，验证码已自动填充：123456
              </p>
            </CardContent>
          </Card>
        )}

        {/* 登录表单卡片 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              欢迎回到绘本岛
            </CardTitle>
            <p className="text-center text-primary-600 text-sm mt-2">
              开启亲子阅读的美好时光
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 手机号输入 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-700">
                手机号
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <Input
                  type="tel"
                  placeholder="请输入手机号"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10"
                  maxLength={11}
                />
              </div>
            </div>

            {/* 验证码输入 */}
            {loginMethod === 'phone' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-700">
                  验证码
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="请输入验证码"
                      value={formData.verificationCode}
                      onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                      className="pl-10"
                      maxLength={6}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendVerificationCode}
                    disabled={isLoading || countdown > 0}
                    className="px-4 min-w-[100px]"
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Button>
                </div>
              </div>
            )}

            {/* 密码输入 */}
            {loginMethod === 'password' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-700">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请输入密码"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* 登录按钮 */}
            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </CardContent>
        </Card>

        {/* 其他登录方式 */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 text-primary-500">
                其他登录方式
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleWeChatLogin}
              className="flex items-center gap-2 flex-1"
            >
              <MessageCircle className="w-4 h-4 text-green-500" />
              微信登录
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickLogin}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-500" />
              快速登录
            </Button>
          </div>

          {/* 注册链接 */}
          <div className="text-sm text-primary-600">
            还没有账号？
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-medium ml-1"
            >
              立即注册
            </Link>
          </div>
        </div>

        {/* 快速登录提示 */}
        {loginMethod === 'quick' && (
          <Card className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">快速登录模式</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                已为您生成演示手机号，点击获取验证码即可体验
              </p>
            </CardContent>
          </Card>
        )}

        {/* 演示模式提示 */}
        {isDemoMode && loginMethod !== 'quick' && (
          <Card className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">演示模式</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                当前为演示环境，验证码已自动填充：123456
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}