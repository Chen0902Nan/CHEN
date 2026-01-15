import { create } from "zustand";
import type { Todo } from "../types";
import { persist } from "zustand/middleware";

export interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
}

export const useTodoStore = create<TodoState>()(
  // 数据持久化存储
  persist(
    (set, get) => ({
      todos: [],
      addTodo: (text: string) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: +new Date(),
              text,
              completed: false,
            },
          ],
        })),
      toggleTodo: (id: number) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      removeTodo: (id: number) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
    }),
    {
      name: "todos", // 存储的 key
    }
  )
);
