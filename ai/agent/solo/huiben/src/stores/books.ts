import { create } from 'zustand'
import type { Book } from '../types'

interface BookState {
  books: Book[]
  popularBooks: Book[]
  recommendedBooks: Book[]
  currentBook: Book | null
  isLoading: boolean
  searchKeyword: string
  selectedCategory: string
  selectedAgeRange: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  
  setBooks: (books: Book[]) => void
  setPopularBooks: (books: Book[]) => void
  setRecommendedBooks: (books: Book[]) => void
  setCurrentBook: (book: Book | null) => void
  setLoading: (loading: boolean) => void
  setSearchKeyword: (keyword: string) => void
  setSelectedCategory: (category: string) => void
  setSelectedAgeRange: (ageRange: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  clearFilters: () => void
}

export const useBookStore = create<BookState>()((set) => ({
  books: [],
  popularBooks: [],
  recommendedBooks: [],
  currentBook: null,
  isLoading: false,
  searchKeyword: '',
  selectedCategory: '',
  selectedAgeRange: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
  
  setBooks: (books) => set({ books }),
  setPopularBooks: (books) => set({ popularBooks: books }),
  setRecommendedBooks: (books) => set({ recommendedBooks: books }),
  setCurrentBook: (book) => set({ currentBook: book }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedAgeRange: (ageRange) => set({ selectedAgeRange: ageRange }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),
  clearFilters: () => set({
    searchKeyword: '',
    selectedCategory: '',
    selectedAgeRange: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  }),
}))