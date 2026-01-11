<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  book: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({
  title: '',
  author: '',
  isbn: '',
  publish_date: '',
  status: '在馆'
});

const errors = ref({});

// 监听 book 变化，填充表单
watch(() => props.book, (newBook) => {
  if (newBook) {
    formData.value = {
      title: newBook.title || '',
      author: newBook.author || '',
      isbn: newBook.isbn || '',
      publish_date: newBook.publish_date || '',
      status: newBook.status || '在馆'
    };
  } else {
    resetForm();
  }
}, { immediate: true });

// 监听 show 变化，重置表单
watch(() => props.show, (newShow) => {
  if (!newShow) {
    resetForm();
    errors.value = {};
  }
});

function resetForm() {
  formData.value = {
    title: '',
    author: '',
    isbn: '',
    publish_date: '',
    status: '在馆'
  };
}

function validate() {
  errors.value = {};
  let isValid = true;

  if (!formData.value.title.trim()) {
    errors.value.title = '书名不能为空';
    isValid = false;
  }

  if (!formData.value.author.trim()) {
    errors.value.author = '作者不能为空';
    isValid = false;
  }

  return isValid;
}

function handleSubmit() {
  if (validate()) {
    emit('submit', { ...formData.value });
  }
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ book ? '编辑图书' : '新增图书' }}</h2>
        <button class="btn-close" @click="handleClose">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="title">书名 <span class="required">*</span></label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            class="input"
            :class="{ 'input-error': errors.title }"
            placeholder="请输入书名"
          />
          <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label for="author">作者 <span class="required">*</span></label>
          <input
            id="author"
            v-model="formData.author"
            type="text"
            class="input"
            :class="{ 'input-error': errors.author }"
            placeholder="请输入作者"
          />
          <span v-if="errors.author" class="error-text">{{ errors.author }}</span>
        </div>

        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input
            id="isbn"
            v-model="formData.isbn"
            type="text"
            class="input"
            placeholder="请输入ISBN（可选）"
          />
        </div>

        <div class="form-group">
          <label for="publish_date">出版日期</label>
          <input
            id="publish_date"
            v-model="formData.publish_date"
            type="date"
            class="input"
          />
        </div>

        <div class="form-group">
          <label for="status">状态</label>
          <select id="status" v-model="formData.status" class="input">
            <option value="在馆">在馆</option>
            <option value="借出">借出</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="handleClose">
            取消
          </button>
          <button type="submit" class="btn btn-primary">
            {{ book ? '更新' : '添加' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-content {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-close {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--text-secondary);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.btn-close:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.form {
  padding: 0 24px 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.required {
  color: var(--status-borrowed);
}

.input-error {
  border-color: var(--status-borrowed);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-text {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--status-borrowed);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.form-actions .btn {
  min-width: 80px;
}
</style>

