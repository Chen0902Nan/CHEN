// 用户类型定义
export interface User {
  id: string;
  email?: string;
  phone?: string;
  nickname: string;
  avatar_url?: string;
  role: 'user' | 'premium' | 'admin';
  created_at: string;
  updated_at: string;
}

// 孩子档案类型
export interface Child {
  id: string;
  user_id: string;
  name: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  avatar_url?: string;
  preferences?: Record<string, any>;
  created_at: string;
}

// 绘本类型
export interface Book {
  id: string;
  title: string;
  author?: string;
  illustrator?: string;
  publisher?: string;
  description?: string;
  cover_image: string;
  preview_images?: string[];
  min_age: number;
  max_age: number;
  category: string;
  tags?: string[];
  price: number;
  is_premium: boolean;
  rating?: number;
  created_at: string;
}

// 活动类型
export interface Activity {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  max_participants?: number;
  price: number;
  images?: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
}

// 订单类型
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  shipping_address?: Record<string, any>;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

// 订单项类型
export interface OrderItem {
  id: string;
  order_id: string;
  book_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

// 阅读记录类型
export interface ReadingRecord {
  id: string;
  user_id: string;
  book_id: string;
  child_id?: string;
  progress: number; // 0-100
  is_completed: boolean;
  notes?: string;
  read_at: string;
}

// 评论类型
export interface Comment {
  id: string;
  user_id: string;
  book_id: string;
  content: string;
  rating?: number; // 1-5
  created_at: string;
  user?: User;
}

// 活动报名类型
export interface ActivityRegistration {
  id: string;
  activity_id: string;
  user_id: string;
  participant_info?: Record<string, any>;
  status: 'pending' | 'confirmed' | 'cancelled';
  amount_paid?: number;
  registered_at: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// 搜索参数类型
export interface SearchParams {
  keyword?: string;
  category?: string;
  age_range?: string;
  sort_by?: 'created_at' | 'price' | 'rating' | 'title';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

// 登录表单类型
export interface LoginForm {
  phone?: string;
  email?: string;
  password?: string;
  verification_code?: string;
  login_type: 'phone' | 'email' | 'wechat' | 'quick';
}

// 注册表单类型
export interface RegisterForm {
  phone: string;
  verification_code: string;
  password: string;
  nickname: string;
  children?: Child[];
}

// 购物车项类型
export interface CartItem {
  book: Book;
  quantity: number;
}

// 地址类型
export interface Address {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  postal_code?: string;
  is_default: boolean;
  created_at: string;
}