import { createClient } from '@supabase/supabase-js'

// 临时数据库类型定义
type Database = any

// Supabase配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// 如果环境变量缺失，创建模拟客户端
let supabaseClient: any

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'huiben-supabase-auth-token',
    },
    global: {
      headers: {
        'x-application-name': 'huiben-app',
      },
    },
    db: {
      schema: 'public',
    },
  })
} else {
  // 模拟客户端用于演示
  console.warn('Supabase环境变量缺失，使用演示模式')
  supabaseClient = {
    auth: {
      signInWithPassword: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: { user: null }, error: null }),
      signInWithOtp: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      verifyOtp: async () => ({ data: { user: null }, error: null })
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) })
    })
  }
}

export const supabase = supabaseClient

// 错误处理工具函数
export const handleSupabaseError = (error: any): string => {
  if (!error) return ''
  
  // 网络错误
  if (error.message?.includes('Network request failed')) {
    return '网络连接失败，请检查网络后重试'
  }
  
  // 认证相关错误
  if (error.message?.includes('Invalid login credentials')) {
    return '用户名或密码错误'
  }
  
  if (error.message?.includes('User already registered')) {
    return '该手机号已被注册'
  }
  
  if (error.message?.includes('Token has expired')) {
    return '登录已过期，请重新登录'
  }
  
  // 权限错误
  if (error.message?.includes('permission denied')) {
    return '权限不足，请联系客服'
  }
  
  // 数据库约束错误
  if (error.message?.includes('duplicate key')) {
    return '数据已存在，请勿重复操作'
  }
  
  if (error.message?.includes('violates foreign key')) {
    return '关联数据不存在'
  }
  
  // 默认错误信息
  return error.message || '操作失败，请稍后重试'
}

// 检查环境变量
export const validateSupabaseConfig = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase配置缺失，请检查环境变量')
    return false
  }
  return true
}

// 数据库连接测试
export const testConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('books').select('id').limit(1)
    return !error && data !== null
  } catch (error) {
    console.error('数据库连接测试失败:', error)
    return false
  }
}