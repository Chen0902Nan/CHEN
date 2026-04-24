import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Book, CartItem } from '../types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (book: Book, quantity?: number) => void
  removeItem: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (book, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.book.id === book.id)
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.book.id === book.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          } else {
            return {
              items: [...state.items, { book, quantity }],
            }
          }
        })
      },
      
      removeItem: (bookId) => {
        set((state) => ({
          items: state.items.filter(item => item.book.id !== bookId),
        }))
      },
      
      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.book.id === bookId
              ? { ...item, quantity }
              : item
          ),
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },
      
      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.book.price * item.quantity), 0)
      },
      
      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'huiben-cart-store',
      partialize: (state) => ({ items: state.items }),
    }
  )
)