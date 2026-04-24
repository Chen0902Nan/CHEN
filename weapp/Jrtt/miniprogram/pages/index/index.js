// index.js
Page({
  data: {
    categories: [
      { id: 'all', name: '推荐' },
      { id: 'tech', name: '科技' },
      { id: 'sports', name: '体育' },
      { id: 'entertainment', name: '娱乐' },
      { id: 'finance', name: '财经' },
      { id: 'society', name: '社会' },
    ],
    activeCategory: 'all',
    newsList: [],
    loading: false,
    noMoreData: false,
    page: 1,
    pageSize: 10,
  },

  // 页面加载
  onLoad() {
    this.loadNewsList();
  },

  // 切换分类
  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      activeCategory: category,
      newsList: [],
      page: 1,
      noMoreData: false,
    });
    this.loadNewsList();
  },

  // 点击新闻跳转到详情页
  onNewsTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 加载新闻列表
  loadNewsList() {
    if (this.data.loading || this.data.noMoreData) return;

    this.setData({ loading: true });

    const db = wx.cloud.database();
    const { activeCategory, page, pageSize } = this.data;

    let query = db.collection('news_list');

    // 如果选择的不为'all'，则按分类筛选
    if (activeCategory !== 'all') {
      query = query.where({
        category: activeCategory
      });
    }

    query
      .orderBy('publishTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
      .then(res => {
        const newNews = res.data.map(item => ({
          ...item,
          publishTime: this.formatTime(item.publishTime)
        }));

        this.setData({
          newsList: page === 1 ? newNews : [...this.data.newsList, ...newNews],
          loading: false,
          page: page + 1,
          noMoreData: newNews.length < pageSize
        });
      })
      .catch(err => {
        console.error('加载新闻失败:', err);
        this.setData({ loading: false });
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      });
  },

  // 滚动到底部加载更多
  onScrollToLower() {
    this.loadNewsList();
  },

  // 格式化时间
  formatTime(timestamp) {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // 小于1小时
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
    }

    // 小于24小时
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}小时前`;
    }

    // 其他显示日期
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currentYear = now.getFullYear();

    if (year === currentYear) {
      return `${month}月${day}日`;
    } else {
      return `${year}年${month}月${day}日`;
    }
  },
});