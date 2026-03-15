// 数据管理
class DataManager {
  static async getCategories() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['categories'], (result) => {
        resolve(result.categories || ['默认分类']);
      });
    });
  }

  static async saveCategories(categories) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ categories }, resolve);
    });
  }

  static async getPrompts() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['prompts'], (result) => {
        resolve(result.prompts || []);
      });
    });
  }

  static async savePrompts(prompts) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ prompts }, resolve);
    });
  }
}

// UI管理
class UIManager {
  constructor() {
    this.currentTab = 'prompts';
    this.init();
  }

  init() {
    this.setupTabs();
    this.setupPromptTab();
    this.setupCategoryTab();
    this.loadData();
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        this.switchTab(tab);
      });
    });
  }

  switchTab(tab) {
    this.currentTab = tab;

    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tab}-tab`);
    });
  }

  setupPromptTab() {
    const addBtn = document.getElementById('add-prompt-btn');
    const form = document.getElementById('prompt-form');
    const editForm = document.getElementById('prompt-edit-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const categoryFilter = document.getElementById('category-filter');

    addBtn.addEventListener('click', () => {
      this.showPromptForm();
    });

    cancelBtn.addEventListener('click', () => {
      form.style.display = 'none';
    });

    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.savePrompt();
      form.style.display = 'none';
    });

    categoryFilter.addEventListener('change', () => {
      this.renderPrompts();
    });
  }

  setupCategoryTab() {
    const addBtn = document.getElementById('add-category-btn');
    const form = document.getElementById('category-form');
    const editForm = document.getElementById('category-edit-form');
    const cancelBtn = document.getElementById('cancel-category-btn');
    const showBallBtn = document.getElementById('show-ball-btn');

    addBtn.addEventListener('click', () => {
      form.style.display = 'flex';
      document.getElementById('category-name').value = '';
    });

    cancelBtn.addEventListener('click', () => {
      form.style.display = 'none';
    });

    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.saveCategory();
      form.style.display = 'none';
    });

    // 显示悬浮球按钮
    if (showBallBtn) {
      showBallBtn.addEventListener('click', async () => {
        // 向所有标签页发送消息，显示悬浮球
        const tabs = await chrome.tabs.query({});
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: 'showBall' }).catch(() => {
            // 忽略错误（某些页面可能无法接收消息）
          });
        });
        alert('已向所有页面发送显示悬浮球的指令');
      });
    }
  }

  async loadData() {
    await this.renderCategories();
    await this.renderPrompts();
  }

  async renderCategories() {
    const categories = await DataManager.getCategories();
    const container = document.getElementById('categories-container');
    const categoryFilter = document.getElementById('category-filter');
    const promptCategory = document.getElementById('prompt-category');

    // 渲染分类列表
    if (categories.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>暂无分类</p></div>';
    } else {
      container.innerHTML = categories.map((cat, idx) => `
        <div class="category-card">
          <div class="category-header">
            <span class="category-name">${cat}</span>
            <div class="category-actions">
              ${idx > 0 ? `<button class="btn-delete" data-category="${cat}">删除</button>` : ''}
            </div>
          </div>
        </div>
      `).join('');

      // 删除分类
      container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
          const category = btn.dataset.category;
          if (confirm(`确定要删除分类"${category}"吗？该分类下的所有 Prompt 将被移动到"默认分类"。`)) {
            await this.deleteCategory(category);
          }
        });
      });
    }

    // 更新筛选下拉框
    categoryFilter.innerHTML = '<option value="">所有分类</option>' +
      categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

    // 更新表单下拉框
    promptCategory.innerHTML = categories.map(cat =>
      `<option value="${cat}">${cat}</option>`
    ).join('');
  }

  async renderPrompts() {
    const prompts = await DataManager.getPrompts();
    const container = document.getElementById('prompts-container');
    const categoryFilter = document.getElementById('category-filter').value;

    const filteredPrompts = categoryFilter
      ? prompts.filter(p => p.category === categoryFilter)
      : prompts;

    if (filteredPrompts.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>暂无 Prompt</p></div>';
      return;
    }

    container.innerHTML = filteredPrompts.map(prompt => `
      <div class="prompt-card">
        <div class="prompt-header">
          <div>
            <div class="prompt-title">${prompt.title}</div>
            <span class="prompt-category">${prompt.category}</span>
          </div>
        </div>
        <div class="prompt-content">${prompt.content}</div>
        <div class="prompt-actions">
          <button class="btn-copy" data-id="${prompt.id}">复制</button>
          <button class="btn-edit" data-id="${prompt.id}">编辑</button>
          <button class="btn-delete" data-id="${prompt.id}">删除</button>
        </div>
      </div>
    `).join('');

    // 绑定事件
    container.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = prompts.find(p => p.id === btn.dataset.id);
        this.copyToClipboard(prompt.content, btn);
      });
    });

    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = prompts.find(p => p.id === btn.dataset.id);
        this.showPromptForm(prompt);
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('确定要删除这个 Prompt 吗？')) {
          await this.deletePrompt(btn.dataset.id);
        }
      });
    });
  }

  showPromptForm(prompt = null) {
    const form = document.getElementById('prompt-form');
    const title = document.getElementById('form-title');

    if (prompt) {
      title.textContent = '编辑 Prompt';
      document.getElementById('prompt-id').value = prompt.id;
      document.getElementById('prompt-title').value = prompt.title;
      document.getElementById('prompt-category').value = prompt.category;
      document.getElementById('prompt-content').value = prompt.content;
    } else {
      title.textContent = '新建 Prompt';
      document.getElementById('prompt-id').value = '';
      document.getElementById('prompt-title').value = '';
      document.getElementById('prompt-category').selectedIndex = 0;
      document.getElementById('prompt-content').value = '';
    }

    form.style.display = 'flex';
  }

  async savePrompt() {
    const id = document.getElementById('prompt-id').value;
    const title = document.getElementById('prompt-title').value;
    const category = document.getElementById('prompt-category').value;
    const content = document.getElementById('prompt-content').value;

    const prompts = await DataManager.getPrompts();

    if (id) {
      // 编辑
      const index = prompts.findIndex(p => p.id === id);
      prompts[index] = { id, title, category, content };
    } else {
      // 新建
      prompts.push({
        id: Date.now().toString(),
        title,
        category,
        content
      });
    }

    await DataManager.savePrompts(prompts);
    await this.renderPrompts();
  }

  async deletePrompt(id) {
    const prompts = await DataManager.getPrompts();
    const filtered = prompts.filter(p => p.id !== id);
    await DataManager.savePrompts(filtered);
    await this.renderPrompts();
  }

  async saveCategory() {
    const name = document.getElementById('category-name').value.trim();

    if (!name) {
      alert('请输入分类名称');
      return;
    }

    const categories = await DataManager.getCategories();

    if (categories.includes(name)) {
      alert('该分类已存在');
      return;
    }

    categories.push(name);
    await DataManager.saveCategories(categories);
    await this.renderCategories();
  }

  async deleteCategory(category) {
    const categories = await DataManager.getCategories();
    const filtered = categories.filter(c => c !== category);
    await DataManager.saveCategories(filtered);

    // 将该分类下的 prompts 移动到默认分类
    const prompts = await DataManager.getPrompts();
    const updated = prompts.map(p => {
      if (p.category === category) {
        return { ...p, category: '默认分类' };
      }
      return p;
    });
    await DataManager.savePrompts(updated);

    await this.renderCategories();
    await this.renderPrompts();
  }

  copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.textContent;
      button.textContent = '已复制!';
      button.style.background = '#10b981';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    });
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  new UIManager();
});
