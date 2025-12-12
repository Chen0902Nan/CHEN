<!-- App.vue -->
<script setup>
import { ref, computed } from 'vue'

// 1. 响应式数据：所有 UI 都靠它们驱动
const title = ref('')                     // 输入框内容
const todos = ref([
  { id: 1, title: '睡觉', done: true },
  { id: 2, title: '吃饭', done: true }
])

// 添加任务
function addTodo() {
  if (!title.value.trim()) return
  todos.value.push({
    id: Math.random(),
    title: title.value.trim(),
    done: false
  })
  title.value = ''                         // 清空输入框
}

// 2. 计算属性：派生数据，自动更新
// 统计未完成的数量
const active = computed(() => {
  return todos.value.filter(t => !t.done).length
})

// 全选/全不选的高级玩法
const allDone = computed({
  get() {
    return todos.value.length > 0 && todos.value.every(t => t.done)
  },
  set(val) {
    todos.value.forEach(t => t.done = val)
  }
})
</script>

<template>
  <div class="container">
    <h2>我的 Todos 任务清单</h2>

    <!-- 双向绑定 + 回车添加 -->
    <input type="text" placeholder="今天还要干啥？回车添加" v-model="title" @keydown.enter="addTodo" />

    <!-- 任务列表 -->
    <ul v-if="todos.length">
      <li v-for="todo in todos" :key="todo.id">
        <input type="checkbox" v-model="todo.done">
        <span :class="{ done: todo.done }">{{ todo.title }}</span>
      </li>
    </ul>
    <div v-else class="empty">暂无计划，摸鱼去吧～</div>

    <!-- 统计 + 全选 -->
    <div class="footer">
      <label>
        <input type="checkbox" v-model="allDone" />
        全选
      </label>
      <span>未完成 {{ active }} / 共 {{ todos.length }} 条</span>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: 40px auto;
  font-family: sans-serif;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  font-size: 16px;
}

ul {
  padding-left: 0;
  list-style: none;
}

li {
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.done {
  color: #999;
  text-decoration: line-through;
}

.empty {
  color: #999;
  text-align: center;
  padding: 20px;
}

.footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>