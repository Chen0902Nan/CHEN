// pages/detail/detail.js
Page({
  data: {
    newsId: '',
    news: {},
    comments: [],
    commentText: '',
    isLiked: false,
    isFavorited: false,
    likeCount: 0,
    favoriteCount: 0,
    commentCount: 0,
    isFollowing: false,
    isAuthor: false
  },

  onLoad (options) {
    if (options.id) {
      this.setData({ newsId: options.id })
      this.loadNewsDetail()
      this.loadUserActions()
      this.loadComments()
      this.getActionCounts() // 无论是否登录都获取统计数据
    }
  },

  // 加载新闻详情
  async loadNewsDetail () {
    const db = wx.cloud.database()
    const app = getApp()

    try {
      const res = await db.collection('news_list')
        .doc(this.data.newsId)
        .get()

      let news = res.data
      news.publishTime = this.formatTime(news.publishTime)

      // 转换富文本中的云存储 fileID 为临时 URL
      if (news.contentHtml) {
        news.contentHtml = await this.convertCloudFileIDsToURLs(news.contentHtml)
      }

      const isAuthor = app.globalData.userId === news.authorId

      this.setData({
        news,
        isAuthor
      })

      // 增加阅读量
      this.updateViewCount()

      // 检查关注状态
      if (!isAuthor) {
        this.checkFollowStatus()
      }
    } catch (err) {
      console.error('加载新闻详情失败:', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 将 contentHtml 中的图片链接转换为有效的临时 HTTPS URL
  // 处理两种情况：
  // 1. cloud:// fileID - 直接转换为临时 URL
  // 2. https:// 过期链接 - 提取 fileID 后重新获取临时 URL
  async convertCloudFileIDsToURLs(contentHtml) {
    if (!contentHtml) return contentHtml

    let processedContent = contentHtml
    const fileIDMap = new Map() // 用于存储 fileID -> tempURL 的映射

    // 第一步：匹配 cloud:// 开头的 fileID
    const cloudFileRegex = /cloud:\/\/[^\s"'<>]+/g
    const cloudFileIDs = contentHtml.match(cloudFileRegex)

    if (cloudFileIDs && cloudFileIDs.length > 0) {
      // 去重
      const uniqueCloudFileIDs = [...new Set(cloudFileIDs)]

      try {
        const result = await wx.cloud.getTempFileURL({
          fileList: uniqueCloudFileIDs
        })

        result.fileList.forEach(item => {
          if (item.tempFileURL) {
            fileIDMap.set(item.fileID, item.tempFileURL)
          }
        })
      } catch (err) {
        console.error('获取 cloud:// 临时文件 URL 失败:', err)
      }
    }

    // 第二步：匹配已有的 https:// 云存储链接（可能已过期）
    // 云存储链接格式: https://636c-cloud1-xxx.tcb.qcloud.la/news_inline_images/xxx.jpg?sign=xxx&t=xxx
    const httpsFileRegex = /https:\/\/[^\s"'<>]*\.tcb\.qcloud\.la\/[^\s"'<>]+/g
    const httpsUrls = contentHtml.match(httpsFileRegex)

    if (httpsUrls && httpsUrls.length > 0) {
      // 从 HTTPS URL 中提取 fileID
      // 格式: https://xxx.tcb.qcloud.la/news_inline_images/xxx.jpg?sign=xxx
      // 对应的 fileID: cloud://xxx.tcb.qcloud.la/news_inline_images/xxx.jpg
      const envIdMatch = contentHtml.match(/cloud:\/\/([^/]+)/)
      const envId = envIdMatch ? envIdMatch[1] : null

      if (envId) {
        const fileIDsFromHttps = httpsUrls.map(url => {
          // 从 URL 中提取路径部分
          const pathMatch = url.match(/\.tcb\.qcloud\.la\/([^?]+)/)
          if (pathMatch) {
            return `cloud://${envId}/${pathMatch[1]}`
          }
          return null
        }).filter(id => id !== null)

        if (fileIDsFromHttps.length > 0) {
          // 去重
          const uniqueHttpsFileIDs = [...new Set(fileIDsFromHttps)]

          try {
            const result = await wx.cloud.getTempFileURL({
              fileList: uniqueHttpsFileIDs
            })

            result.fileList.forEach(item => {
              if (item.tempFileURL) {
                // 存储过期 HTTPS URL -> 新临时 URL 的映射
                httpsUrls.forEach(oldUrl => {
                  if (oldUrl.includes(item.fileID.replace(`cloud://${envId}/`, ''))) {
                    fileIDMap.set(oldUrl, item.tempFileURL)
                  }
                })
              }
            })
          } catch (err) {
            console.error('刷新 https:// 临时文件 URL 失败:', err)
          }
        }
      }
    }

    // 执行替换
    fileIDMap.forEach((tempURL, original) => {
      // 转义特殊字符以用于正则表达式
      const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(escapedOriginal, 'g')
      processedContent = processedContent.replace(regex, tempURL)
    })

    return processedContent
  },

  // 检查关注状态
  checkFollowStatus () {
    const app = getApp()
    const userId = app.globalData.userId
    const authorId = this.data.news.authorId

    if (!userId || !authorId || userId === authorId) return

    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'checkFollowStatus',
          followerId: userId,
          followingId: authorId
        }
      })
      .then(res => {
        if (res.result && res.result.success) {
          this.setData({ isFollowing: res.result.isFollowing })
        }
      })
      .catch(err => {
        console.error('检查关注状态失败:', err)
      })
  },

  // 关注/取消关注
  onFollow () {
    const app = getApp()
    const userId = app.globalData.userId
    const authorId = this.data.news.authorId

    if (!userId) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    if (!authorId) return

    // 乐观更新
    const newStatus = !this.data.isFollowing
    this.setData({ isFollowing: newStatus })

    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'toggleFollow',
          followerId: userId,
          followingId: authorId
        }
      })
      .then(res => {
        if (res.result && res.result.success) {
          this.setData({ isFollowing: res.result.isFollowing })

          wx.showToast({
            title: res.result.isFollowing ? '已关注' : '已取消关注',
            icon: 'none'
          })
        } else {
          // 失败回滚
          this.setData({ isFollowing: !newStatus })
          wx.showToast({
            title: res.result.message || '操作失败',
            icon: 'none'
          })
        }
      })
      .catch(err => {
        console.error('关注操作失败:', err)
        // 失败回滚
        this.setData({ isFollowing: !newStatus })
        wx.showToast({ title: '网络错误', icon: 'none' })
      })
  },

  // 更新阅读量
  updateViewCount () {
    const db = wx.cloud.database()
    db.collection('news_list')
      .doc(this.data.newsId)
      .update({
        data: {
          view_count: db.command.inc(1)
        }
      })
  },

  // 加载用户行为（点赞、收藏）
  loadUserActions () {
    const app = getApp()
    const userId = app.globalData.userId

    if (!userId) return

    const db = wx.cloud.database()
    db.collection('user_actions')
      .where({
        newsId: this.data.newsId,
        userId: userId
      })
      .get()
      .then(res => {
        const actions = res.data
        const isLiked = actions.some(action => action.type === 'like')
        const isFavorited = actions.some(action => action.type === 'favorite')

        this.setData({ isLiked, isFavorited })
      })
  },

  // 获取点赞、收藏、评论数量
  getActionCounts () {
    const db = wx.cloud.database()

    // 获取点赞数
    db.collection('user_actions')
      .where({
        newsId: this.data.newsId,
        type: 'like'
      })
      .count()
      .then(res => {
        this.setData({ likeCount: res.total })
      })

    // 获取收藏数
    db.collection('user_actions')
      .where({
        newsId: this.data.newsId,
        type: 'favorite'
      })
      .count()
      .then(res => {
        this.setData({ favoriteCount: res.total })
      })

    // 获取评论数
    db.collection('comments')
      .where({
        newsId: this.data.newsId
      })
      .count()
      .then(res => {
        this.setData({ commentCount: res.total })
      })
  },

  // 加载评论
  loadComments () {
    const db = wx.cloud.database()
    db.collection('comments')
      .where({
        newsId: this.data.newsId
      })
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        const comments = res.data.map(comment => ({
          ...comment,
          createTime: this.formatTime(comment.createTime)
        }))
        this.setData({ comments })
      })
  },

  // 点赞/取消点赞
  onLike () {
    const app = getApp()
    const userId = app.globalData.userId

    if (!userId) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再进行操作',
        confirmText: '去登录',
        success: res => {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return
    }

    const { newsId, news, isLiked, likeCount } = this.data

    // 乐观更新 (Optimistic UI Update)
    const newIsLiked = !isLiked
    const newLikeCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1)

    this.setData({
      isLiked: newIsLiked,
      likeCount: newLikeCount
    })

    // 调用云函数处理数据
    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'toggleLike',
          newsId: newsId,
          userId: userId,
          title: news.title
        }
      })
      .then(res => {
        if (res.result && res.result.success) {
          // 再次确认最终状态 (Optional, but good for consistency)
          // If the server returns the authoritative count, use it.
          if (
            res.result.data &&
            typeof res.result.data.likeCount === 'number'
          ) {
            this.setData({
              likeCount: res.result.data.likeCount
            })
          }
        } else {
          // 失败回滚
          console.error('点赞失败:', res)
          wx.showToast({ title: '操作失败', icon: 'none' })
          this.setData({
            isLiked: isLiked,
            likeCount: likeCount
          })
        }
      })
      .catch(err => {
        console.error('调用点赞云函数失败:', err)
        wx.showToast({ title: '网络错误', icon: 'none' })
        // 失败回滚
        this.setData({
          isLiked: isLiked,
          likeCount: likeCount
        })
      })
  },

  // 收藏/取消收藏
  onFavorite () {
    const db = wx.cloud.database()
    const app = getApp()
    const userId = app.globalData.userId
    const openid = app.globalData.openid

    if (!userId) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再进行操作',
        confirmText: '去登录',
        success: res => {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return
    }

    const { isFavorited, newsId, news } = this.data

    if (isFavorited) {
      // 取消收藏
      db.collection('user_actions')
        .where({
          newsId: newsId,
          userId: userId,
          type: 'favorite'
        })
        .remove()
        .then(() => {
          this.setData({ isFavorited: false })
          this.getActionCounts()
        })
    } else {
      // 添加收藏
      db.collection('user_actions')
        .add({
          data: {
            newsId: newsId,
            type: 'favorite',
            title: news.title,
            userId: userId,
            openid: openid, // 仍保留openid作为系统记录
            createTime: db.serverDate()
          }
        })
        .then(() => {
          this.setData({ isFavorited: true })
          this.getActionCounts()
        })
    }
  },

  // 编辑文章
  onEditNews () {
    const app = getApp()
    app.globalData.publishEditRequest = { newsId: this.data.newsId }
    wx.switchTab({
      url: '/pages/publish/publish'
    })
  },

  // 删除文章
  onDeleteNews () {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这篇文章吗？删除后不可恢复',
      confirmColor: '#f04142',
      success: (res) => {
        if (res.confirm) {
          this.doDeleteNews()
        }
      }
    })
  },

  // 执行删除
  async doDeleteNews () {
    wx.showLoading({ title: '删除中...' })

    try {
      const db = wx.cloud.database()

      // 删除文章
      await db.collection('news_list')
        .doc(this.data.newsId)
        .remove()

      // 删除相关评论
      const commentsRes = await db.collection('comments')
        .where({ newsId: this.data.newsId })
        .get()

      for (const comment of commentsRes.data) {
        await db.collection('comments').doc(comment._id).remove()
      }

      // 删除用户行为记录
      const actionsRes = await db.collection('user_actions')
        .where({ newsId: this.data.newsId })
        .get()

      for (const action of actionsRes.data) {
        await db.collection('user_actions').doc(action._id).remove()
      }

      wx.hideLoading()
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      })

      // 延迟返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      wx.hideLoading()
      console.error('删除文章失败:', err)
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  },

  // 评论点击事件
  onComment () {
    // 滚动到评论区或聚焦输入框
    wx.createSelectorQuery()
      .select('.comment-input')
      .boundingClientRect(rect => {
        wx.pageScrollTo({
          scrollTop: rect.top,
          duration: 300
        })
      })
      .exec()
  },

  // 评论输入
  onCommentInput (e) {
    this.setData({ commentText: e.detail.value })
  },

  // 提交评论
  onSubmitComment () {
    const { commentText, newsId, news } = this.data

    if (!commentText.trim()) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      })
      return
    }

    const db = wx.cloud.database()
    const app = getApp()
    const openid = app.globalData.openid
    const userId = app.globalData.userId

    if (!openid) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再进行操作',
        confirmText: '去登录',
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/me/me'
            })
          }
        }
      })
      return
    }

    db.collection('comments')
      .add({
        data: {
          newsId: newsId,
          content: commentText.trim(),
          openid: openid,
          userId: userId,
          userNickname:
            getApp().globalData.userInfo.nickname ||
            getApp().globalData.userInfo.username ||
            '匿名用户',
          userAvatar: getApp().globalData.userInfo.avatar || '',
          createTime: db.serverDate()
        }
      })
      .then(() => {
        this.setData({ commentText: '' })
        this.loadComments()
        this.getActionCounts()
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
      })
      .catch(err => {
        console.error('评论失败:', err)
        wx.showToast({
          title: '评论失败',
          icon: 'none'
        })
      })
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
