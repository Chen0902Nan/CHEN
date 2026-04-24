import { supabase } from './supabase'
import type { Book, PaginatedResponse, SearchParams, ApiResponse } from '../types'

/**
 * 绘本相关服务
 */
export const bookService = {
  // 获取绘本列表
  async getBooks(params: SearchParams = {}): Promise<ApiResponse<PaginatedResponse<Book>>> {
    try {
      let query = supabase
        .from('books')
        .select('*', { count: 'exact' })
      
      // 关键词搜索
      if (params.keyword) {
        query = query.or(`title.ilike.%${params.keyword}%,author.ilike.%${params.keyword}%,description.ilike.%${params.keyword}%`)
      }
      
      // 分类筛选
      if (params.category) {
        query = query.eq('category', params.category)
      }
      
      // 年龄段筛选
      if (params.age_range) {
        const [minAge, maxAge] = params.age_range.split('-').map(Number)
        query = query.gte('min_age', minAge).lte('max_age', maxAge)
      }
      
      // 排序
      const sortBy = params.sort_by || 'created_at'
      const sortOrder = params.sort_order || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      
      // 分页
      const page = params.page || 1
      const pageSize = params.page_size || 20
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      
      query = query.range(from, to)
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      const totalPages = count ? Math.ceil(count / pageSize) : 0
      
      return {
        success: true,
        data: {
          items: data || [],
          total: count || 0,
          page,
          page_size: pageSize,
          total_pages: totalPages,
        },
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 获取绘本详情
  async getBookById(id: string): Promise<ApiResponse<Book>> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 获取热门绘本
  async getPopularBooks(limit: number = 10): Promise<ApiResponse<Book[]>> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('rating', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      
      return { success: true, data: data || [] }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 获取推荐绘本
  async getRecommendedBooks(userId?: string, limit: number = 10): Promise<ApiResponse<Book[]>> {
    try {
      // 如果有用户ID，基于用户偏好推荐
      if (userId) {
        // 获取用户的阅读记录和孩子信息
        const { data: readingRecords } = await supabase
          .from('reading_records')
          .select('book_id')
          .eq('user_id', userId)
          .limit(20)
        
        if (readingRecords && readingRecords.length > 0) {
          const readBookIds = readingRecords.map(record => record.book_id)
          
          // 基于已读绘本的分类和标签推荐相似绘本
          const { data: readBooks } = await supabase
            .from('books')
            .select('category, tags')
            .in('id', readBookIds)
          
          if (readBooks && readBooks.length > 0) {
            const categories = [...new Set(readBooks.map(book => book.category).filter(Boolean))]
            const tags = [...new Set(readBooks.flatMap(book => book.tags || []).filter(Boolean))]
            
            let recommendedQuery = supabase
              .from('books')
              .select('*')
              .not('id', 'in', `(${readBookIds.join(',')})`)
            
            if (categories.length > 0) {
              recommendedQuery = recommendedQuery.in('category', categories)
            }
            
            const { data: recommendedBooks, error } = await recommendedQuery.limit(limit)
            
            if (error) throw error
            
            return { success: true, data: recommendedBooks || [] }
          }
        }
      }
      
      // 默认返回热门绘本
      return await this.getPopularBooks(limit)
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 获取分类列表
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('category')
        .not('category', 'is', null)
      
      if (error) throw error
      
      const categories = [...new Set(data?.map(book => book.category).filter(Boolean) || [])] as string[]
      
      return { success: true, data: categories }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 获取年龄段列表
  async getAgeRanges(): Promise<ApiResponse<string[]>> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('min_age, max_age')
      
      if (error) throw error
      
      const ageRanges = new Set<string>()
      data?.forEach(book => {
        if (book.min_age !== undefined && book.max_age !== undefined) {
          ageRanges.add(`${book.min_age}-${book.max_age}`)
        }
      })
      
      return { success: true, data: Array.from(ageRanges).sort() }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 搜索绘本
  async searchBooks(keyword: string): Promise<ApiResponse<Book[]>> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${keyword}%,author.ilike.%${keyword}%,description.ilike.%${keyword}%`)
        .limit(20)
      
      if (error) throw error
      
      return { success: true, data: data || [] }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 获取用户的收藏绘本
  async getUserFavorites(userId: string): Promise<ApiResponse<Book[]>> {
    try {
      // 这里假设有一个favorites表，需要根据实际需求调整
      const { data: favoriteIds } = await supabase
        .from('favorites')
        .select('book_id')
        .eq('user_id', userId)
      
      if (!favoriteIds || favoriteIds.length === 0) {
        return { success: true, data: [] }
      }
      
      const bookIds = favoriteIds.map(fav => fav.book_id)
      
      const { data: books, error } = await supabase
        .from('books')
        .select('*')
        .in('id', bookIds)
      
      if (error) throw error
      
      return { success: true, data: books || [] }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 添加收藏
  async addToFavorites(userId: string, bookId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, book_id: bookId }])
      
      if (error) throw error
      
      return { success: true, message: '收藏成功' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 移除收藏
  async removeFromFavorites(userId: string, bookId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', bookId)
      
      if (error) throw error
      
      return { success: true, message: '取消收藏成功' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
}