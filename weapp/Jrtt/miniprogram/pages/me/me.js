// pages/me/me.js
Page({
  data: {
    userInfo: {},
    openid: '',
    userId: '',
    stats: {
      following: 0,
      followers: 0,
      likes: 0
    },
    // Bottom Tabs
    currentTab: 0,
    tabs: ['作品', '收藏', '赞过'],

    // List Data
    myWorks: [],
    likedNews: [],
    favoritedNews: [],

    // Loading states
    loading: false,
    activeStatType: '',
    statDetailTitle: '',
    statDetailSubtitle: '',
    statDetailList: [],
    statDetailLoading: false,
    statDetailEmptyTitle: '',
    statDetailEmptyDesc: '',
    pendingRelationUserId: ''
  },

  // 点击头像跳转
  onAvatarTap () {
    if (
      !this.data.userInfo ||
      (!this.data.userInfo.username && !this.data.userInfo.nickname)
    ) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    wx.navigateTo({
      url: '/pages/profile_edit/profile_edit',
      success: () => {
        // Success feedback if needed
      },
      fail: err => {
        console.error('Navigation failed:', err)
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        })
      }
    })
  },

  // 切换底部Tab
  switchTab (e) {
    const index = e.currentTarget.dataset.index
    // 立即切换Tab，利用hidden属性实现无缝切换
    // 数据已在onShow中预加载或保持上次状态
    this.setData({ currentTab: index })
  },

  // Mock function for grid items
  onGridTap (e) {
    const item = e.currentTarget.dataset.item
    wx.showToast({
      title: '点击了: ' + item.title,
      icon: 'none'
    })
  },

  // Mock function for creating headline
  onCreateHeadline () {
    wx.switchTab({
      url: '/pages/publish/publish'
    })
  },

  getStatDetailConfig (type) {
    const configMap = {
      following: {
        title: '我的关注',
        subtitle: '查看你正在关注的创作者',
        emptyTitle: '还没有关注任何人',
        emptyDesc: '在资讯详情页点击关注，喜欢的作者会出现在这里。'
      },
      followers: {
        title: '我的粉丝',
        subtitle: '关注你的用户会显示在这里',
        emptyTitle: '暂时还没有粉丝',
        emptyDesc: '持续发布优质内容，更多人会看到并关注你。'
      },
      likes: {
        title: '获赞内容',
        subtitle: '看看哪些作品最受欢迎',
        emptyTitle: '还没有获赞内容',
        emptyDesc: '继续发布内容并参与互动，你的作品点赞会累积在这里。'
      }
    }

    return configMap[type] || configMap.likes
  },

  getRelationActionText (type, isFollowing) {
    if (type === 'following') {
      return '取消关注'
    }

    return isFollowing ? '已关注' : '回关'
  },

  formatRelationDetailList (type, list) {
    return list.map(item => {
      const isFollowing = !!item.isFollowing
      return {
        ...item,
        displayName: item.nickname || item.username || '头条用户',
        usernameText:
          item.username && item.nickname !== item.username
            ? `账号：${item.username}`
            : '',
        relationTimeText: item.relationTime ? this.formatTime(item.relationTime) : '',
        isFollowing,
        followActionText: this.getRelationActionText(type, isFollowing)
      }
    })
  },

  ensureLoginForStat () {
    const app = getApp()
    const userId = this.data.userId || app.globalData.userId
    if (app.globalData.isLoggedIn && userId) {
      return true
    }

    wx.showToast({
      title: '请先登录后查看',
      icon: 'none'
    })

    setTimeout(() => {
      this.onLoginTap()
    }, 500)

    return false
  },

  onStatTap (e) {
    const { type } = e.currentTarget.dataset
    if (!type) return
    if (!this.ensureLoginForStat()) return

    if (this.data.activeStatType === type) {
      this.closeStatDetail()
      return
    }

    const config = this.getStatDetailConfig(type)
    this.setData({
      activeStatType: type,
      statDetailTitle: config.title,
      statDetailSubtitle: config.subtitle,
      statDetailEmptyTitle: config.emptyTitle,
      statDetailEmptyDesc: config.emptyDesc,
      statDetailList: [],
      statDetailLoading: true
    })

    if (type === 'likes') {
      this.loadReceivedLikesDetail()
    } else {
      this.loadUserRelationDetail(type)
    }
  },

  closeStatDetail () {
    this.setData({
      activeStatType: '',
      statDetailTitle: '',
      statDetailSubtitle: '',
      statDetailList: [],
      statDetailLoading: false,
      statDetailEmptyTitle: '',
      statDetailEmptyDesc: '',
      pendingRelationUserId: ''
    })
  },

  refreshActiveStatDetail () {
    if (!this.data.activeStatType) return

    if (this.data.activeStatType === 'likes') {
      this.loadReceivedLikesDetail()
    } else {
      this.loadUserRelationDetail(this.data.activeStatType)
    }
  },

  // Existing methods...
  onLoad (options) {
    this.getUserOpenId()
  },

  onShow () {
    // 页面显示时刷新数据
    this.refreshData()
  },

  // 刷新页面数据
  refreshData () {
    // 更新全局用户信息
    const app = getApp()
    const userId = app.globalData.userId || ''

    this.setData({
      userInfo: app.globalData.userInfo || {},
      openid: app.globalData.openid || '',
      userId: userId
    })

    // 如果已登录，加载统计数据和当前Tab数据
    if (app.globalData.isLoggedIn && userId) {
      // 主动拉取最新的用户信息（头像、昵称等）
      this.fetchUserDetail()

      this.loadUserStats(userId)

      // 并行加载所有Tab数据，确保切换时内容立即可用
      this.loadMyWorks()
      this.loadMyFavorites()
      this.loadMyLikes()
      this.refreshActiveStatDetail()
    } else {
      this.closeStatDetail()
    }
  },

  // 获取用户最新信息 (同步 profile_edit.js 的逻辑)
  async fetchUserDetail () {
    const app = getApp()
    if (!app.globalData.userId) return

    try {
      const res = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getUserDetail',
          openid: app.globalData.openid,
          userId: app.globalData.userId
        }
      })

      if (res.result && res.result.success) {
        const remoteUserInfo = res.result.userInfo

        // 同步更新全局数据和本地存储
        const newUserInfo = { ...app.globalData.userInfo, ...remoteUserInfo }
        app.globalData.userInfo = newUserInfo
        wx.setStorageSync('userInfo', newUserInfo)

        // 更新当前页面数据
        this.setData({
          userInfo: newUserInfo
        })
      }
    } catch (err) {
      console.error('获取用户详情失败:', err)
    }
  },

  // 获取用户OpenID
  getUserOpenId () {
    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getOpenId'
        }
      })
      .then(res => {
        if (res.result.openid) {
          this.setData({ openid: res.result.openid })
          getApp().globalData.openid = res.result.openid
          this.loadUserStats()
        }
      })
      .catch(err => {
        console.error('获取OpenID失败:', err)
      })
  },

  // 跳转到登录页面
  onLoginTap () {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 退出登录
  onLogout () {
    const app = getApp()

    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: res => {
        if (res.confirm) {
          // 清除登录状态
          app.userLogout()

          this.setData({
            userInfo: {},
            openid: '',
            stats: {
              following: 0,
              followers: 0,
              likes: 0
            },
            myWorks: [],
            likedNews: [],
            favoritedNews: [],
            activeStatType: '',
            statDetailTitle: '',
            statDetailSubtitle: '',
            statDetailList: [],
            statDetailLoading: false,
            statDetailEmptyTitle: '',
            statDetailEmptyDesc: ''
          })

          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })

          // 延迟跳转到登录页
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }, 1500)
        }
      }
    })
  },

  // 加载用户统计数据
  loadUserStats (userId) {
    const targetUserId = userId || this.data.userId
    if (!targetUserId) return

    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getUserStats',
          userId: targetUserId
        }
      })
      .then(res => {
        if (res.result && res.result.success) {
          this.setData({
            'stats.likes': res.result.stats.likes,
            'stats.viewCount': res.result.stats.viewCount || 0,
            'stats.following': res.result.stats.following || 0,
            'stats.followers': res.result.stats.followers || 0
          })
        }
      })
      .catch(err => {
        console.error('统计获赞/阅读数失败:', err)
      })
  },

  loadUserRelationDetail (type) {
    const userId = this.data.userId || getApp().globalData.userId
    if (!userId) return

    const config = this.getStatDetailConfig(type)

    this.setData({
      statDetailTitle: config.title,
      statDetailSubtitle: config.subtitle,
      statDetailEmptyTitle: config.emptyTitle,
      statDetailEmptyDesc: config.emptyDesc,
      statDetailLoading: true
    })

    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getUserRelationList',
          userId,
          listType: type
        }
      })
      .then(res => {
        const list = this.formatRelationDetailList(
          type,
          (res.result && res.result.list) || []
        )

        this.setData({
          statDetailList: list,
          statDetailLoading: false
        })
      })
      .catch(err => {
        console.error(`加载${type}列表失败:`, err)
        this.setData({
          statDetailList: [],
          statDetailLoading: false
        })
        wx.showToast({
          title: '加载失败，请稍后重试',
          icon: 'none'
        })
      })
  },

  onToggleRelationFollow (e) {
    const targetUserId = e.currentTarget.dataset.userid
    const viewerUserId = this.data.userId || getApp().globalData.userId
    const activeType = this.data.activeStatType

    if (!targetUserId || !viewerUserId || !activeType || activeType === 'likes') {
      return
    }

    if (this.data.pendingRelationUserId === targetUserId) {
      return
    }

    this.setData({
      pendingRelationUserId: targetUserId
    })

    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'toggleFollow',
          followerId: viewerUserId,
          followingId: targetUserId
        }
      })
      .then(res => {
        if (res.result && res.result.success) {
          wx.showToast({
            title: res.result.isFollowing ? '已关注' : '已取消关注',
            icon: 'success'
          })

          this.loadUserStats(viewerUserId)
          this.refreshActiveStatDetail()
        } else {
          wx.showToast({
            title: res.result?.message || '操作失败',
            icon: 'none'
          })
        }
      })
      .catch(err => {
        console.error('切换关注状态失败:', err)
        wx.showToast({
          title: '操作失败，请稍后重试',
          icon: 'none'
        })
      })
      .finally(() => {
        this.setData({
          pendingRelationUserId: ''
        })
      })
  },

  loadReceivedLikesDetail () {
    const db = wx.cloud.database()
    const userId = this.data.userId || getApp().globalData.userId
    if (!userId) return

    const config = this.getStatDetailConfig('likes')
    this.setData({
      statDetailTitle: config.title,
      statDetailSubtitle: config.subtitle,
      statDetailEmptyTitle: config.emptyTitle,
      statDetailEmptyDesc: config.emptyDesc,
      statDetailLoading: true
    })

    db.collection('news_list')
      .where({
        authorId: userId
      })
      .orderBy('like_count', 'desc')
      .limit(100)
      .get()
      .then(res => {
        const list = res.data
          .filter(item => (item.like_count || 0) > 0)
          .map(item => ({
            ...item,
            publishTimeText: this.formatTime(item.publishTime),
            metricText: `${item.like_count || 0} 赞 · ${item.view_count || 0} 阅读`
          }))

        this.setData({
          statDetailList: list,
          statDetailLoading: false
        })
      })
      .catch(err => {
        console.error('加载获赞内容失败:', err)
        this.setData({
          statDetailList: [],
          statDetailLoading: false
        })
        wx.showToast({
          title: '加载失败，请稍后重试',
          icon: 'none'
        })
      })
  },

  // 加载我的作品
  loadMyWorks () {
    const db = wx.cloud.database()
    const userId = this.data.userId || getApp().globalData.userId

    if (!userId) return

    // 移除 loading 状态设置，避免页面闪烁
    // this.setData({ loading: true })

    db.collection('news_list')
      .where({
        authorId: userId
      })
      .orderBy('publishTime', 'desc')
      .get()
      .then(res => {
        const myWorks = res.data.map(item => ({
          ...item,
          publishTime: this.formatTime(item.publishTime)
        }))
        this.setData({
          myWorks: myWorks
        })
      })
      .catch(err => {
        console.error('加载我的作品失败:', err)
      })
  },

  // 加载我的收藏
  loadMyFavorites () {
    this.loadUserActions('favorite', 'favoritedNews')
  },

  // 加载我的点赞
  loadMyLikes () {
    this.loadUserActions('like', 'likedNews')
  },

  // 加载用户行为列表通用方法
  loadUserActions (type, dataKey) {
    const db = wx.cloud.database()
    const userId = this.data.userId || getApp().globalData.userId

    if (!userId) return

    // 移除 loading 状态设置，避免页面闪烁
    // this.setData({ loading: true })

    // 1. 获取行为记录
    db.collection('user_actions')
      .where({
        userId: userId,
        type: type
      })
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        const actions = res.data
        if (actions.length === 0) {
          this.setData({
            [dataKey]: []
          })
          return
        }

        const newsIds = actions.map(item => item.newsId)

        // 2. 批量查询新闻详情
        const _ = db.command
        return db
          .collection('news_list')
          .where({
            _id: _.in(newsIds)
          })
          .get()
          .then(newsRes => {
            // 3. 合并数据（保持行为发生的时间顺序）
            const newsMap = {}
            newsRes.data.forEach(news => {
              newsMap[news._id] = news
            })

            const list = actions
              .map(action => {
                const news = newsMap[action.newsId]
                if (!news) return null // 可能新闻已被删除
                return {
                  ...news,
                  actionTime: this.formatTime(action.createTime),
                  publishTime: this.formatTime(news.publishTime)
                }
              })
              .filter(item => item !== null)

            this.setData({
              [dataKey]: list
            })
          })
      })
      .catch(err => {
        console.error(`加载${type}失败:`, err)
      })
  },

  // 兼容旧方法名（如果wxml中还有引用）
  onMyLikes () {
    this.loadMyLikes()
  },
  onMyFavorites () {
    this.loadMyFavorites()
  },

  // 关于页面
  onAbout () {
    wx.showModal({
      title: '关于我们',
      content:
        '仿今日头条小程序 v1.0\n基于微信云开发\n为您提供优质的新闻阅读体验',
      showCancel: false
    })
  },

  // 关闭弹窗
  onCloseModal () {
    this.closeStatDetail()
  },

  // 点击新闻跳转到详情页
  onNewsTap (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  onEditMyWork (e) {
    const id = e.currentTarget.dataset.id
    if (!id) return

    const app = getApp()
    app.globalData.publishEditRequest = { newsId: id }

    wx.switchTab({
      url: '/pages/publish/publish'
    })
  },

  onDeleteMyWork (e) {
    const id = e.currentTarget.dataset.id
    if (!id) return

    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，确认删除该文章吗？',
      confirmColor: '#f04142',
      success: res => {
        if (res.confirm) {
          this.doDeleteMyWork(id)
        }
      }
    })
  },

  async doDeleteMyWork (newsId) {
    const db = wx.cloud.database()
    const userId = this.data.userId || getApp().globalData.userId
    if (!userId) return

    wx.showLoading({ title: '删除中...' })

    try {
      const targetNews = await db
        .collection('news_list')
        .where({
          _id: newsId,
          authorId: userId
        })
        .get()

      if (!targetNews.data.length) {
        wx.hideLoading()
        wx.showToast({
          title: '无权删除该文章',
          icon: 'none'
        })
        return
      }

      await db.collection('news_list').doc(newsId).remove()
      await db.collection('comments').where({ newsId }).remove()
      await db.collection('user_actions').where({ newsId }).remove()

      this.setData({
        myWorks: this.data.myWorks.filter(item => item._id !== newsId),
        favoritedNews: this.data.favoritedNews.filter(
          item => item._id !== newsId
        ),
        likedNews: this.data.likedNews.filter(item => item._id !== newsId)
      })
      this.loadUserStats(userId)
      this.refreshActiveStatDetail()

      wx.hideLoading()
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      })
    } catch (err) {
      wx.hideLoading()
      console.error('删除文章失败:', err)
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  },

  // 格式化时间
  formatTime (timestamp) {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    // 小于1小时
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return minutes <= 0 ? '刚刚' : `${minutes}分钟前`
    }

    // 小于24小时
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `${hours}小时前`
    }

    // 其他显示日期
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const currentYear = now.getFullYear()

    if (year === currentYear) {
      return `${month}月${day}日`
    } else {
      return `${year}年${month}月${day}日`
    }
  }
})
