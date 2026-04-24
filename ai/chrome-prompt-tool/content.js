// 创建悬浮球
function createFloatingBall() {
  const ball = document.createElement('div');
  ball.id = 'prompt-floating-ball';
  ball.innerHTML = '💬';
  document.body.appendChild(ball);

  // 创建面板
  const panel = document.createElement('div');
  panel.id = 'prompt-panel';
  document.body.appendChild(panel);

  // 拖拽相关变量
  let isDragging = false;
  let hasMoved = false;
  let startX, startY;
  let initialTop, initialRight;
  let dragStartTime = 0;

  // 鼠标按下
  ball.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasMoved = false;
    dragStartTime = Date.now();
    startX = e.clientX;
    startY = e.clientY;

    // 获取当前位置
    const rect = ball.getBoundingClientRect();
    initialTop = rect.top;
    initialRight = window.innerWidth - rect.right;

    ball.classList.add('dragging');
    e.stopPropagation();
  }, { passive: false });

  // 鼠标移动
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const moveX = Math.abs(e.clientX - startX);
    const moveY = Math.abs(e.clientY - startY);

    // 移动超过5px才算拖拽
    if (moveX > 5 || moveY > 5) {
      hasMoved = true;
      e.preventDefault();
      e.stopPropagation();

      // 计算新位置
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newTop = initialTop + deltaY;
      let newRight = initialRight - deltaX;

      // 限制在窗口范围内
      const minTop = 10;
      const maxTop = window.innerHeight - ball.offsetHeight - 10;
      const minRight = 10;
      const maxRight = window.innerWidth - ball.offsetWidth - 10;

      newTop = Math.max(minTop, Math.min(newTop, maxTop));
      newRight = Math.max(minRight, Math.min(newRight, maxRight));

      // 使用 setProperty 和 important 来覆盖 CSS
      ball.style.setProperty('top', newTop + 'px', 'important');
      ball.style.setProperty('right', newRight + 'px', 'important');
      ball.style.setProperty('bottom', 'auto', 'important');
      ball.style.setProperty('left', 'auto', 'important');
    }
  };

  document.addEventListener('mousemove', handleMouseMove, { passive: false });

  // 鼠标释放
  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;

    isDragging = false;
    ball.classList.remove('dragging');

    const clickDuration = Date.now() - dragStartTime;

    // 如果没有移动且时间很短，则切换面板显示
    if (!hasMoved && clickDuration < 300) {
      e.preventDefault();
      e.stopPropagation();
      togglePanel(ball, panel);
    }
  }, { passive: false });

  // 触摸支持（移动端）
  ball.addEventListener('touchstart', (e) => {
    isDragging = true;
    hasMoved = false;
    dragStartTime = Date.now();
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;

    const rect = ball.getBoundingClientRect();
    initialTop = rect.top;
    initialRight = window.innerWidth - rect.right;

    ball.classList.add('dragging');
  }, { passive: false });

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const moveX = Math.abs(touch.clientX - startX);
    const moveY = Math.abs(touch.clientY - startY);

    if (moveX > 5 || moveY > 5) {
      hasMoved = true;
      e.preventDefault();

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      let newTop = initialTop + deltaY;
      let newRight = initialRight - deltaX;

      const minTop = 10;
      const maxTop = window.innerHeight - ball.offsetHeight - 10;
      const minRight = 10;
      const maxRight = window.innerWidth - ball.offsetWidth - 10;

      newTop = Math.max(minTop, Math.min(newTop, maxTop));
      newRight = Math.max(minRight, Math.min(newRight, maxRight));

      // 使用 setProperty 和 important 来覆盖 CSS
      ball.style.setProperty('top', newTop + 'px', 'important');
      ball.style.setProperty('right', newRight + 'px', 'important');
      ball.style.setProperty('bottom', 'auto', 'important');
      ball.style.setProperty('left', 'auto', 'important');
    }
  };

  document.addEventListener('touchmove', handleTouchMove, { passive: false });

  document.addEventListener('touchend', (e) => {
    if (!isDragging) return;

    isDragging = false;
    ball.classList.remove('dragging');

    const clickDuration = Date.now() - dragStartTime;

    if (!hasMoved && clickDuration < 300) {
      e.preventDefault();
      togglePanel(ball, panel);
    }
  }, { passive: false });
}

// 切换面板显示
function togglePanel(ball, panel) {
  const isVisible = panel.classList.contains('show');

  console.log('Toggle panel, current visible:', isVisible);

  if (!isVisible) {
    // 显示面板
    console.log('Loading prompts...');
    loadPrompts();

    // 获取悬浮球的位置
    const ballRect = ball.getBoundingClientRect();

    // 面板从悬浮球位置向左展开
    // 面板右边缘对齐悬浮球右边缘
    panel.style.right = (window.innerWidth - ballRect.right) + 'px';
    panel.style.top = ballRect.top + 'px';
    panel.style.left = 'auto';

    // 隐藏悬浮球
    ball.style.opacity = '0';
    ball.style.pointerEvents = 'none';

    // 显示面板
    panel.style.display = 'flex';

    // 使用 setTimeout 确保样式应用后再添加 show 类
    setTimeout(() => {
      panel.classList.add('show');
      console.log('Panel shown');
    }, 10);
  } else {
    // 隐藏面板
    panel.classList.remove('show');

    setTimeout(() => {
      panel.style.display = 'none';
      // 显示悬浮球
      ball.style.opacity = '1';
      ball.style.pointerEvents = 'auto';
    }, 300);

    console.log('Panel hidden');
  }
}

// 加载prompts
async function loadPrompts() {
  const panel = document.getElementById('prompt-panel');

  // 检查 chrome.storage 是否可用
  if (!chrome || !chrome.storage || !chrome.storage.local) {
    console.error('Chrome storage API not available');
    renderPanel(panel, [], ['默认分类']);
    return;
  }

  try {
    chrome.storage.local.get(['prompts', 'categories'], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Storage error:', chrome.runtime.lastError);
        renderPanel(panel, [], ['默认分类']);
        return;
      }

      const prompts = result.prompts || [];
      const categories = result.categories || ['默认分类'];

      renderPanel(panel, prompts, categories);
    });
  } catch (error) {
    console.error('Error loading prompts:', error);
    renderPanel(panel, [], ['默认分类']);
  }
}

// 渲染面板
function renderPanel(panel, prompts, categories) {
  panel.innerHTML = `
    <div class="prompt-panel-header">
      <h3>Prompt 模板</h3>
      <div class="prompt-panel-header-actions">
        <button id="hide-ball-btn" title="隐藏悬浮球">👁️</button>
        <button id="close-panel">✕</button>
      </div>
    </div>
    <div class="prompt-panel-tabs">
      ${categories.map((cat, idx) => `
        <button class="tab-btn ${idx === 0 ? 'active' : ''}" data-category="${cat}">
          ${cat}
        </button>
      `).join('')}
    </div>
    <div class="prompt-panel-content">
      <div id="prompts-list"></div>
    </div>
    <div class="prompt-panel-footer">
      <button id="open-manager">管理 Prompts</button>
    </div>
  `;

  // 关闭按钮
  panel.querySelector('#close-panel').addEventListener('click', () => {
    panel.classList.remove('show');
    setTimeout(() => {
      panel.style.display = 'none';
      const ball = document.getElementById('prompt-floating-ball');
      ball.style.opacity = '1';
      ball.style.pointerEvents = 'auto';
    }, 300);
  });

  // 隐藏悬浮球按钮
  panel.querySelector('#hide-ball-btn').addEventListener('click', () => {
    if (confirm('确定要隐藏悬浮球吗？\n\n隐藏后可以通过以下方式重新显示：\n1. 刷新页面\n2. 点击浏览器工具栏的插件图标，点击"显示悬浮球"按钮')) {
      // 关闭面板
      panel.classList.remove('show');
      setTimeout(() => {
        panel.style.display = 'none';
      }, 300);

      // 隐藏悬浮球
      const ball = document.getElementById('prompt-floating-ball');
      ball.style.display = 'none';

      // 保存隐藏状态到当前页面的 sessionStorage
      sessionStorage.setItem('prompt-ball-hidden', 'true');
    }
  });

  // 打开管理页面
  panel.querySelector('#open-manager').addEventListener('click', () => {
    // 检查 chrome.runtime 是否可用
    if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
      alert('请点击浏览器工具栏的插件图标打开管理界面');
      return;
    }

    try {
      // 打开插件的 popup 页面
      chrome.runtime.sendMessage({ action: 'openPopup' }, (response) => {
        // 如果消息发送失败，尝试直接打开
        if (chrome.runtime.lastError) {
          // 提示用户点击工具栏图标
          alert('请点击浏览器工具栏的插件图标打开管理界面');
        }
      });
    } catch (error) {
      console.error('Error opening manager:', error);
      alert('请点击浏览器工具栏的插件图标打开管理界面');
    }
  });

  // 标签切换
  const tabs = panel.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.category;
      renderPromptsList(prompts.filter(p => p.category === category));
    });
  });

  // 默认显示第一个分类
  if (categories.length > 0) {
    renderPromptsList(prompts.filter(p => p.category === categories[0]));
  }
}

// 渲染prompts列表
function renderPromptsList(prompts) {
  const list = document.getElementById('prompts-list');

  if (prompts.length === 0) {
    list.innerHTML = '<div class="empty-state">暂无 Prompt</div>';
    return;
  }

  list.innerHTML = prompts.map((prompt, idx) => `
    <div class="prompt-item" data-content="${encodeURIComponent(prompt.content)}">
      <div class="prompt-title">
        ${prompt.title}
        <span class="copy-indicator">✓</span>
      </div>
      <div class="prompt-content">${prompt.content}</div>
    </div>
  `).join('');

  // 点击卡片复制功能
  list.querySelectorAll('.prompt-item').forEach(item => {
    item.addEventListener('click', () => {
      const content = decodeURIComponent(item.dataset.content);

      // 检查 clipboard API 是否可用
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content).then(() => {
          // 添加复制成功样式
          item.classList.add('copied');

          // 2秒后移除样式
          setTimeout(() => {
            item.classList.remove('copied');
          }, 2000);
        }).catch(err => {
          console.error('Copy failed:', err);
          // 降级方案：使用传统方法复制
          fallbackCopy(content, item);
        });
      } else {
        // 降级方案
        fallbackCopy(content, item);
      }
    });
  });
}

// 降级复制方案
function fallbackCopy(text, item) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
    item.classList.add('copied');
    setTimeout(() => {
      item.classList.remove('copied');
    }, 2000);
  } catch (err) {
    console.error('Fallback copy failed:', err);
    alert('复制失败，请手动复制');
  }

  document.body.removeChild(textarea);
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showBall') {
    // 清除隐藏状态
    sessionStorage.removeItem('prompt-ball-hidden');

    // 显示悬浮球
    const ball = document.getElementById('prompt-floating-ball');
    if (ball) {
      ball.style.display = 'flex';
      ball.style.opacity = '1';
      ball.style.pointerEvents = 'auto';
    } else {
      // 如果不存在，重新创建
      init();
    }

    sendResponse({ success: true });
  }
  return true;
});

// 初始化 - 确保在所有页面都能加载
function init() {
  // 检查是否已经创建过悬浮球
  if (document.getElementById('prompt-floating-ball')) {
    return;
  }

  // 等待 body 元素存在
  if (!document.body) {
    setTimeout(init, 100);
    return;
  }

  // 检查是否在当前页面隐藏了悬浮球
  if (sessionStorage.getItem('prompt-ball-hidden') === 'true') {
    console.log('Floating ball is hidden for this page');
    return;
  }

  createFloatingBall();
}

// 多种方式确保初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 监听页面变化（适用于 SPA 应用）
if (window.MutationObserver) {
  const observer = new MutationObserver(() => {
    if (!document.getElementById('prompt-floating-ball') && document.body) {
      init();
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: false });
  }
}
