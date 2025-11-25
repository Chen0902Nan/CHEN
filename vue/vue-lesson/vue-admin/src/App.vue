<script setup>
import { ref } from 'vue'

// 定义计数器状态
const count = ref(0)

// 定义增加和减少的方法
const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}
</script>

<template>
  <div class="app-container">
    <div class="counter-container">
      <h1>计数器</h1>
      
      <!-- 计数器显示 -->
      <div class="count-display">
        <span :style="{ color: count > 0 ? 'green' : count < 0 ? 'red' : 'black' }">
          {{ count }}
        </span>
      </div>
      
      <!-- 条件提示信息 -->
      <div class="count-message">
        <p v-if="count > 0">当前为正数</p>
        <p v-else-if="count < 0">当前为负数</p>
        <p v-else>当前为零</p>
      </div>
      
      <!-- 按钮控制 -->
      <div class="counter-controls">
        <button @click="increment" class="btn btn-increment">+1</button>
        <button @click="decrement" class="btn btn-decrement">-1</button>
      </div>
    </div>
  </div>
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.app-container {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.counter-container {
  max-width: 500px;
  width: 100%;
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.counter-container h1 {
  color: #333;
  margin-bottom: 30px;
  font-size: 32px;
}

.count-display {
  font-size: 72px;
  font-weight: bold;
  margin-bottom: 20px;
  transition: color 0.3s ease;
}

.count-message {
  margin-bottom: 30px;
  font-size: 18px;
  color: #666;
}

.counter-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  padding: 12px 32px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.btn-increment {
  background-color: #42b983;
  color: white;
}

.btn-increment:hover {
  background-color: #35495e;
  transform: translateY(-2px);
}

.btn-decrement {
  background-color: #f06543;
  color: white;
}

.btn-decrement:hover {
  background-color: #e74c3c;
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .counter-container {
    padding: 20px;
  }
  
  .counter-container h1 {
    font-size: 24px;
  }
  
  .count-display {
    font-size: 48px;
  }
  
  .btn {
    padding: 10px 24px;
    font-size: 16px;
  }
}
</style>
