import { supabase } from './supabase'
import type { User, LoginForm, RegisterForm, ApiResponse } from '../types'

// Supabase环境变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/**
 * 用户认证服务
 */
export const authService = {
  // 手机号登录
  async loginWithPhone(phone: string, password: string): Promise<ApiResponse<User>> {
    try {
      // 演示模式 - 如果没有配置Supabase
      if (!supabaseUrl || !supabaseAnonKey) {
        const demoUser: User = {
          id: 'demo-user-id',
          phone: phone,
          nickname: '演示用户',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        return { success: true, data: demoUser }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      })
      
      if (error) throw error
      
      // 获取用户信息
      const user = await this.getUserProfile(data.user.id)
      return { success: true, data: user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 邮箱登录
  async loginWithEmail(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      const user = await this.getUserProfile(data.user.id)
      return { success: true, data: user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 一键登录（本机号码）
  async quickLogin(phone: string): Promise<ApiResponse<User>> {
    try {
      // 这里需要集成运营商SDK，暂时用验证码登录模拟
      return await this.loginWithPhone(phone, '')
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 验证码登录
  async loginWithVerificationCode(phone: string, verificationCode: string): Promise<ApiResponse<User>> {
    try {
      // 演示模式 - 如果没有配置Supabase
      if (!supabaseUrl || !supabaseAnonKey) {
        const demoUser: User = {
          id: 'demo-user-id',
          phone: phone,
          nickname: '演示用户',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        return { success: true, data: demoUser }
      }

      // 使用验证码登录
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: verificationCode,
        type: 'sms'
      })
      
      if (error) throw error
      
      const user = await this.getUserProfile(data.user.id)
      return { success: true, data: user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 手机号注册
  async registerWithPhone(form: RegisterForm): Promise<ApiResponse<User>> {
    try {
      // 演示模式 - 如果没有配置Supabase
      if (!supabaseUrl || !supabaseAnonKey) {
        const demoUser: User = {
          id: 'demo-user-id',
          phone: form.phone,
          nickname: form.nickname,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        return { success: true, data: demoUser }
      }

      const { data, error } = await supabase.auth.signUp({
        phone: form.phone,
        password: form.password,
        options: {
          data: {
            nickname: form.nickname,
          },
        },
      })
      
      if (error) throw error
      
      // 创建用户档案
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            phone: form.phone,
            nickname: form.nickname,
            role: 'user',
          }])
        
        if (profileError) throw profileError
        
        // 创建孩子档案
        if (form.children && form.children.length > 0) {
          const childrenData = form.children.map(child => ({
            ...child,
            user_id: data.user.id,
          }))
          
          const { error: childrenError } = await supabase
            .from('children')
            .insert(childrenData)
          
          if (childrenError) throw childrenError
        }
      }
      
      return { success: true, data: {
        id: data.user.id,
        email: data.user.email,
        phone: data.user.phone,
        nickname: data.user.user_metadata?.nickname || '用户',
        avatar_url: data.user.user_metadata?.avatar_url,
        role: 'user',
        created_at: data.user.created_at,
        updated_at: data.user.updated_at,
      } as User }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 发送验证码
  async sendVerificationCode(phone: string): Promise<ApiResponse<null>> {
    try {
      // 演示模式 - 如果没有配置Supabase
      if (!supabaseUrl || !supabaseAnonKey) {
        console.log('演示模式：验证码发送成功（123456）')
        return { success: true, message: '验证码已发送（演示模式：123456）' }
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone,
      })
      
      if (error) throw error
      
      return { success: true, message: '验证码已发送' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 获取用户信息
  async getUserProfile(userId: string): Promise<User> {
    // 演示模式 - 如果没有配置Supabase
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        id: userId,
        phone: '13800000000',
        nickname: '演示用户',
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // 更新用户信息
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 登出
  async logout(): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      return { success: true, message: '登出成功' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 获取当前用户
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null
      
      return await this.getUserProfile(user.id)
    } catch (error) {
      return null
    }
  },

  // 监听认证状态变化
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}