<script setup>
const props = defineProps({
  books: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    })
  },
  currentPage: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['edit', 'delete', 'page-change'])

const searchQuery = defineModel('searchQuery', { type: String, default: '' })

function goToPage (page) {
  const totalPages = props.pagination.totalPages || 1
  if (page >= 1 && page <= totalPages) {
    emit('page-change', page)
  }
}

// 生成页码数组（带省略号）
function getPageNumbers () {
  const total = props.pagination.totalPages || 1
  const current = props.currentPage || 1
  const pages = []

  if (total <= 1) {
    return [1]
  }

  if (total <= 7) {
    // 如果总页数少于等于7页，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于7页，显示部分页码和省略号
    if (current <= 4) {
      // 当前页在前4页
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页在后4页
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
}

function handleEdit (book) {
  emit('edit', book)
}

function handleDelete (book) {
  if (confirm(`确定要删除《${book.title}》吗？`)) {
    emit('delete', book.id)
  }
}
</script>

<template>
  <div class="book-list-container">
    <!-- 搜索框 -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        class="input search-input"
        placeholder="搜索书名或作者..."
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 空状态 -->
    <div v-else-if="books.length === 0" class="empty-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
      <p>
        {{ searchQuery ? '未找到匹配的图书' : '暂无图书，点击上方按钮添加' }}
      </p>
    </div>

    <!-- 图书列表 -->
    <div v-else class="book-table-container">
      <table class="book-table">
        <thead class="table-header">
          <tr>
            <th>书名</th>
            <th>作者</th>
            <th>ISBN</th>
            <th>出版日期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="book in books" :key="book.id" class="table-row">
            <td class="table-cell">{{ book.title }}</td>
            <td class="table-cell">{{ book.author }}</td>
            <td class="table-cell">{{ book.isbn || '-' }}</td>
            <td class="table-cell">{{ book.publish_date || '-' }}</td>
            <td class="table-cell">
              <span
                class="status-badge"
                :class="
                  book.status === '在馆'
                    ? 'status-available'
                    : 'status-borrowed'
                "
              >
                {{ book.status }}
              </span>
            </td>
            <td class="table-cell actions-cell">
              <button
                class="btn btn-secondary btn-sm"
                @click="handleEdit(book)"
              >
                编辑
              </button>
              <button class="btn btn-danger btn-sm" @click="handleDelete(book)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页控件 -->
    <div
      v-if="!loading && pagination && pagination.total > 0"
      class="pagination"
    >
      <div class="pagination-info">
        <span class="pagination-text">
          共 {{ pagination.total }} 本图书，第 {{ currentPage }} /
          {{ Math.max(pagination.totalPages || 1, 1) }} 页
          <span class="pagination-hint"
            >（每页 {{ pagination.limit || 10 }} 本）</span
          >
        </span>
      </div>

      <div v-if="(pagination.totalPages || 0) > 1" class="pagination-controls">
        <button
          class="btn btn-secondary pagination-btn"
          :disabled="currentPage === 1"
          @click="goToPage(1)"
          title="首页"
        >
          ««
        </button>

        <button
          class="btn btn-secondary pagination-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          上一页
        </button>

        <!-- 页码按钮 -->
        <div class="pagination-numbers">
          <button
            v-for="page in getPageNumbers()"
            :key="`page-${page}`"
            class="pagination-number"
            :class="{ active: page === currentPage, ellipsis: page === '...' }"
            :disabled="page === '...'"
            @click="page !== '...' && goToPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="btn btn-secondary pagination-btn"
          :disabled="currentPage >= (pagination.totalPages || 1)"
          @click="goToPage(currentPage + 1)"
        >
          下一页
        </button>

        <button
          class="btn btn-secondary pagination-btn"
          :disabled="currentPage >= (pagination.totalPages || 1)"
          @click="goToPage(pagination.totalPages || 1)"
          title="末页"
        >
          »»
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-list-container {
  width: 100%;
}

.search-bar {
  margin-bottom: 24px;
}

.search-input {
  max-width: 400px;
}

.loading,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.book-table-container {
  overflow-x: auto;
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.book-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background-color: var(--bg-secondary);
  border-bottom: 2px solid var(--border-color);
}

.table-header th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: var(--bg-secondary);
}

.table-cell {
  padding: 16px 20px;
  font-size: 14px;
  color: var(--text-primary);
  vertical-align: middle;
}

.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-available {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.status-borrowed {
  background-color: #fff3e0;
  color: #ef6c00;
  border: 1px solid #ffe0b2;
}

.pagination {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 40px;
  padding: 20px;
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.pagination-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-text {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.pagination-hint {
  color: var(--text-secondary);
  font-weight: 400;
  font-size: 12px;
  margin-left: 4px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.pagination-btn {
  min-width: 80px;
  padding: 8px 16px;
}

.pagination-numbers {
  display: flex;
  gap: 4px;
  align-items: center;
}

.pagination-number {
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover:not(:disabled):not(.active):not(.ellipsis) {
  background-color: var(--bg-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.pagination-number.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  font-weight: 600;
}

.pagination-number.ellipsis {
  border: none;
  background: transparent;
  cursor: default;
  color: var(--text-secondary);
}

.pagination-number:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .book-table-container {
    overflow-x: auto;
  }

  .book-table {
    font-size: 13px;
  }

  .table-header th {
    padding: 12px 16px;
  }

  .table-cell {
    padding: 12px 16px;
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 12px;
  }

  .actions-cell {
    flex-direction: column;
    gap: 6px;
  }

  .pagination {
    flex-direction: column;
    gap: 12px;
  }

  .pagination-btn {
    width: 100%;
  }
}
</style>
