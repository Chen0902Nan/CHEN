<script setup>
const users = [
  {
    name: '陈炳南',
    studentId: '2023213101',
    age: 20,
    major: '软件工程',
    class: '2321804'
  }
]
</script>

<template>
  <div class="app-container">
    <div class="user-list-container">
      <h1>用户信息列表</h1>
      <div class="user-list">
        <div v-for="user in users" :key="user.studentId" class="user-info">
          <h2>{{ user.name }}</h2>
          <p><strong>学号：</strong>{{ user.studentId }}</p>
          <p><strong>年龄：</strong>{{ user.age }}</p>
          <p><strong>专业：</strong>{{ user.major }}</p>
          <p><strong>班级：</strong>{{ user.class }}</p>
        </div>
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
}

.user-list-container {
  max-width: 1200px;
  margin: 0 auto;
}

.user-list-container h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 32px;
}

.user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.user-info {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.user-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.user-info h2 {
  margin-top: 0;
  color: #333;
  font-size: 24px;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
}

.user-info p {
  margin: 10px 0;
  color: #666;
  font-size: 16px;
}

.user-info strong {
  color: #333;
}

@media (max-width: 768px) {
  .user-list {
    grid-template-columns: 1fr;
  }

  .user-list-container h1 {
    font-size: 24px;
  }
}
</style>
