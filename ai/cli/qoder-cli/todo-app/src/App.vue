<script setup>
import { ref } from 'vue'

const todos = ref([])
const newTodo = ref('')

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value,
      completed: false
    })
    newTodo.value = ''
  }
}

const toggleComplete = (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

const deleteTodo = (id) => {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<template>
  <div class="app-container">
    <div class="todo-card">
      <h1>Todo List</h1>
      
      <div class="input-section">
        <input 
          v-model="newTodo" 
          @keyup.enter="addTodo"
          type="text" 
          placeholder="添加新的待办事项..."
          class="todo-input"
        />
        <button @click="addTodo" class="add-button">添加</button>
      </div>

      <div class="todo-list">
        <div 
          v-for="todo in todos" 
          :key="todo.id" 
          class="todo-item"
        >
          <span 
            @click="toggleComplete(todo.id)"
            :class="{ completed: todo.completed }"
            class="todo-text"
          >
            {{ todo.text }}
          </span>
          <button @click="deleteTodo(todo.id)" class="delete-button">删除</button>
        </div>
        <div v-if="todos.length === 0" class="empty-state">
          暂无待办事项
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.todo-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 600;
}

.input-section {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}

.todo-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.todo-input:focus {
  border-color: #667eea;
}

.add-button {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.add-button:hover {
  background: #5568d3;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.todo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.todo-text {
  flex: 1;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  user-select: none;
}

.todo-text.completed {
  text-decoration: line-through;
  color: #999;
}

.delete-button {
  padding: 8px 16px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.delete-button:hover {
  background: #ee5a6f;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 40px;
  font-size: 16px;
}
</style>