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
  User, 
  Lock, 
  Eye, 
  EyeOff,
  Baby,
  Calendar,
  Heart,
  Sparkles
} from 'lucide-react'

interface RegisterForm {
  phone: string
  verificationCode: string
  password: string
  confirmPassword: string
  nickname: string
  childName: string
  childBirthDate: string
  childGender: 'male' | 'female' | ''
}

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const { setUser } = useUserStore()
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<RegisterForm>({
    phone: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    childName: '',
    childBirthDate: '',
    childGender: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const handleInputChange = (field: keyof RegisterForm, value: string) => {
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

  const validateStep1 = () => {
    if (!formData.phone) {
      toast.error('请输入手机号')
      return false
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      toast.error('请输入正确的手机号')
      return false
    }

    if (!formData.verificationCode) {
      toast.error('请输入验证码')
      return false
    }

    if (!formData.password) {
      toast.error('请输入密码')
      return false
    }

    if (formData.password.length < 6) {
      toast.error('密码长度至少6位')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('两次输入的密码不一致')
      return false
    }

    return true
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleRegister = async () => {
    if (!formData.nickname) {
      toast.error('请输入您的昵称')
      return
    }

    if (!formData.childName) {
      toast.error('请输入孩子姓名')
      return
    }

    if (!formData.childBirthDate) {
      toast.error('请选择孩子出生日期')
      return
    }

    if (!formData.childGender) {
      toast.error('请选择孩子性别')
      return
    }

    setIsLoading(true)
    try {
      const result = await authService.registerWithPhone({
        phone: formData.phone,
        password: formData.password,
        nickname: formData.nickname,
        verification_code: formData.verificationCode,
        children: [{
          name: formData.childName,
          birth_date: formData.childBirthDate,
          gender: formData.childGender as 'male' | 'female',
          // 这些字段会在服务端自动生成
          id: '',
          user_id: '',
          created_at: ''
        }]
      })

      if (result.success && result.data) {
        setUser(result.data)
        huibenToast.welcome(result.data.nickname)
        toast.success('注册成功！欢迎加入绘本岛')
        navigate('/')
      } else {
        toast.error(result.error || '注册失败')
      }
    } catch (error) {
      toast.error('注册失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <Header title="注册" showBack />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
              currentStep === 1 
                ? 'bg-primary-500 text-white' 
                : 'bg-primary-200 text-primary-600'
            )}>
              1
            </div>
            <div className={cn(
              'h-1 w-12 rounded transition-all',
              currentStep === 2 ? 'bg-primary-500' : 'bg-primary-200'
            )} />
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
              currentStep === 2 
                ? 'bg-primary-500 text-white' 
                : 'bg-primary-200 text-primary-600'
            )}>
              2
            </div>
          </div>
        </div>

        {/* 步骤标题 */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-primary-900 mb-2">
            {currentStep === 1 ? '账号信息' : '完善资料'}
          </h2>
          <p className="text-primary-600 text-sm">
            {currentStep === 1 
              ? '创建您的绘本岛账号' 
              : '为孩子创建阅读档案'
            }
          </p>
        </div>

        {/* 演示模式提示 */}
        {isDemoMode && (
          <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
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

        {/* 注册表单 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              欢迎加入绘本岛
            </CardTitle>
            <p className="text-center text-primary-600 text-sm mt-2">
              开启亲子阅读的美好时光
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {currentStep === 1 ? (
              <>
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

                {/* 密码输入 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-700">
                    设置密码
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="请设置6位以上密码"
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

                {/* 确认密码 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-700">
                    确认密码
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="请再次输入密码"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 下一步按钮 */}
                <Button
                  onClick={handleNextStep}
                  loading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  下一步
                </Button>
              </>
            ) : (
              <>
                {/* 用户昵称 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-700">
                    您的昵称
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="请输入您的昵称"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* 孩子姓名 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-700">
                    孩子姓名
                  </label>
                  <div className="relative">
                    <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="请输入孩子姓名"
                      value={formData.childName}
                      onChange={(e) => handleInputChange('childName', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* 孩子出生日期 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-700">
                    孩子出生日期
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                    <Input
                      type="date"
                      value={formData.childBirthDate}
                      onChange={(e) => handleInputChange('childBirthDate', e.target.value)}
                      className="pl-10"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* 孩子性别 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-700">
                    孩子性别
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="childGender"
                        value="male"
                        checked={formData.childGender === 'male'}
                        onChange={(e) => handleInputChange('childGender', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">男孩</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="childGender"
                        value="female"
                        checked={formData.childGender === 'female'}
                        onChange={(e) => handleInputChange('childGender', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">女孩</span>
                    </label>
                  </div>
                </div>

                {/* 返回上一步 */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    上一步
                  </Button>
                  <Button
                    onClick={handleRegister}
                    loading={isLoading}
                    className="flex-1"
                  >
                    完成注册
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 登录链接 */}
        <div className="text-center text-sm text-primary-600">
          已有账号？
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium ml-1"
          >
            立即登录
          </Link>
        </div>

        {/* 注册协议 */}
        <div className="text-center text-xs text-primary-500 mt-6">
          注册即表示您同意我们的
          <Link to="/terms" className="text-primary-600 hover:text-primary-700 mx-1">
            用户协议
          </Link>
          和
          <Link to="/privacy" className="text-primary-600 hover:text-primary-700 mx-1">
            隐私政策
          </Link>
        </div>
      </div>
    </div>
  )
}