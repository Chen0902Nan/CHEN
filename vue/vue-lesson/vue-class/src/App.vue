<script setup>
import { ref } from 'vue'

// 菜单项数据
const menuItems = [
  {
    id: 1,
    name: '课程管理',
    icon: '📚',
    submenu: [
      { id: 11, name: '课程列表', path: '/courses' },
      { id: 12, name: '添加课程', path: '/courses/add' },
      { id: 13, name: '课程分类', path: '/courses/categories' }
    ]
  },
  {
    id: 2,
    name: '成绩管理',
    icon: '📊',
    submenu: [
      { id: 21, name: '成绩录入', path: '/grades/input' },
      { id: 22, name: '成绩查询', path: '/grades/search' },
      { id: 23, name: '成绩统计', path: '/grades/statistics' }
    ]
  }
]

// 当前激活的菜单项
const activeMenu = ref(null)

// 切换菜单展开/收起
const toggleMenu = menuId => {
  activeMenu.value = activeMenu.value === menuId ? null : menuId
}

// 点击菜单项
const handleMenuItemClick = item => {
  console.log('点击菜单项:', item)
  // 这里可以添加路由跳转逻辑
}
</script>

<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="top-header">
      <div class="header-content">
        <h1 class="system-title">🏫 学校管理系统</h1>
        <div class="header-actions">
          <div class="user-info">
            <span class="user-icon">👤</span>
            <span class="user-name">管理员</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 左侧菜单 -->
    <aside class="side-menu">
      <nav class="menu-nav">
        <ul class="menu-list">
          <li v-for="menu in menuItems" :key="menu.id" class="menu-item">
            <div class="menu-item-header" @click="toggleMenu(menu.id)">
              <span class="menu-icon">{{ menu.icon }}</span>
              <span class="menu-name">{{ menu.name }}</span>
              <span class="menu-arrow">
                {{ activeMenu === menu.id ? '▼' : '▶' }}
              </span>
            </div>

            <!-- 子菜单 -->
            <ul v-if="activeMenu === menu.id" class="submenu-list">
              <li
                v-for="subitem in menu.submenu"
                :key="subitem.id"
                class="submenu-item"
                @click="handleMenuItemClick(subitem)"
              >
                <span class="submenu-icon">•</span>
                <span class="submenu-name">{{ subitem.name }}</span>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <!-- 底部信息 -->
      <div class="menu-footer">
        <div class="version-info">v1.0.0</div>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 简化的主内容区域，仅保留基本结构 -->
    </main>
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f0f2f5;
}

/* 应用容器 */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 顶部导航栏 */
.top-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  height: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 2rem;
}

.system-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.user-icon {
  font-size: 1.2rem;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 500;
}

/* 主内容布局 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧菜单 */
.side-menu {
  width: 260px;
  background-color: white;
  color: #333;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.side-menu:hover {
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
}

.menu-nav {
  flex: 1;
  padding: 1rem 0;
}

.menu-list {
  list-style: none;
}

.menu-item {
  margin-bottom: 0.125rem;
}

.menu-item-header {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  position: relative;
  overflow: hidden;
}

.menu-item-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(79, 172, 254, 0.1), transparent);
  transition: width 0.3s ease;
}

.menu-item-header:hover::before {
  width: 100%;
}

.menu-item-header:hover {
  background-color: #f8f9fa;
  border-left-color: #4facfe;
  transform: translateX(4px);
}

.menu-icon {
  font-size: 1.25rem;
  margin-right: 0.875rem;
  width: 24px;
  text-align: center;
  color: #4facfe;
}

.menu-name {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
  color: #495057;
}

.menu-arrow {
  font-size: 0.75rem;
  color: #adb5bd;
  transition: all 0.3s ease;
  font-weight: bold;
}

/* 子菜单 */
.submenu-list {
  list-style: none;
  background-color: #f8f9fa;
  padding-left: 0;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem 0.75rem 3.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.submenu-item::before {
  content: '';
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background-color: #4facfe;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s ease;
}

.submenu-item:hover {
  background-color: #e9ecef;
  padding-left: 3.75rem;
}

.submenu-item:hover::before {
  opacity: 1;
  left: 2.25rem;
}

.submenu-icon {
  margin-right: 0.75rem;
  color: #4facfe;
  font-size: 0.625rem;
}

.submenu-name {
  font-size: 0.9rem;
  color: #6c757d;
  transition: color 0.3s ease;
}

.submenu-item:hover .submenu-name {
  color: #495057;
}

/* 菜单底部 */
.menu-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.version-info {
  font-size: 0.8rem;
  color: #adb5bd;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: #f0f2f5;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .side-menu {
    width: 100%;
    height: auto;
    max-height: 300px;
  }

  .main-content {
    padding: 1rem;
  }

  .header-content {
    padding: 0 1rem;
  }

  .system-title {
    font-size: 1.25rem;
  }
}
</style>
