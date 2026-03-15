// pages/publish/publish.js
Page({
  data: {
    isEditMode: false,
    editNewsId: '',
    categories: [
      { id: 'tech', name: '科技' },
      { id: 'sports', name: '体育' },
      { id: 'entertainment', name: '娱乐' },
      { id: 'finance', name: '财经' },
      { id: 'society', name: '社会' }
    ],
    selectedCategoryIndex: 0,
    formData: {
      title: '',
      content: '', // 纯文本内容（用于预览或搜索）
      contentHtml: '', // 富文本HTML内容
      contentDelta: null, // 编辑器delta格式（用于后续编辑恢复）
      category: 'tech'
    },
    imageUrl: '',
    imageFileID: '',
    inlineImageFileIDs: [],
    contentLength: 0, // 内容长度计算
    submitting: false,
    formatStatus: {
      bold: false,
      italic: false,
      underline: false,
      list: '' // 'ordered' | 'bullet' | ''
    }
  },

  // editor 上下文
  editorCtx: null,

  onLoad (options) {
    if (!this.ensureLogin()) return
    if (options.mode === 'edit' && options.id) {
      this.setData({
        isEditMode: true,
        editNewsId: options.id
      })
      this.loadNewsForEdit(options.id)
    }
  },

  onShow () {
    if (!this.ensureLogin()) return
    this.consumeEditRequest()
  },

  ensureLogin () {
    const app = getApp()
    if (app.globalData.isLoggedIn) return true

    wx.showModal({
      title: '提示',
      content: '请先登录后再发布新闻',
      confirmText: '去登录',
      success: res => {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/login/login'
          })
        } else {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
    return false
  },

  consumeEditRequest () {
    const app = getApp()
    const request = app.globalData.publishEditRequest
    if (!request || !request.newsId) return
    app.globalData.publishEditRequest = null

    if (this.data.isEditMode && this.data.editNewsId === request.newsId) return

    this.setData({
      isEditMode: true,
      editNewsId: request.newsId
    })
    this.loadNewsForEdit(request.newsId)
  },

  mergeUniqueFileIDs (fileIDs = []) {
    return Array.from(
      new Set((fileIDs || []).filter(item => typeof item === 'string' && item))
    )
  },

  extractInlineImageFileIDsFromDelta (delta) {
    if (!delta || !Array.isArray(delta.ops)) return []
    const fileIDs = []
    delta.ops.forEach(op => {
      if (!op || typeof op !== 'object') return
      if (op.attributes && typeof op.attributes.fileID === 'string') {
        fileIDs.push(op.attributes.fileID)
      }
      if (
        op.insert &&
        typeof op.insert === 'object' &&
        typeof op.insert.fileID === 'string'
      ) {
        fileIDs.push(op.insert.fileID)
      }
      if (
        op.insert &&
        typeof op.insert === 'object' &&
        typeof op.insert.image === 'string' &&
        op.insert.image.startsWith('cloud://')
      ) {
        fileIDs.push(op.insert.image)
      }
    })
    return this.mergeUniqueFileIDs(fileIDs)
  },

  getFileNameFromPath (path) {
    if (!path || typeof path !== 'string') return ''
    const noQuery = path.split('?')[0]
    const segments = noQuery.split('/')
    return segments[segments.length - 1] || ''
  },

  replaceUrlByFileName (rawUrl, urlMap = {}) {
    if (!rawUrl || typeof rawUrl !== 'string') return rawUrl
    const fileName = this.getFileNameFromPath(rawUrl)
    if (!fileName) return rawUrl
    return urlMap[fileName] || rawUrl
  },

  replaceInlineUrlsInDelta (delta, urlMap = {}) {
    if (!delta || !Array.isArray(delta.ops)) return delta
    const nextDelta = JSON.parse(JSON.stringify(delta))
    nextDelta.ops = nextDelta.ops.map(op => {
      if (
        op &&
        typeof op === 'object' &&
        op.insert &&
        typeof op.insert === 'object' &&
        typeof op.insert.image === 'string'
      ) {
        op.insert.image = this.replaceUrlByFileName(op.insert.image, urlMap)
      }
      return op
    })
    return nextDelta
  },

  replaceInlineUrlsInHtml (html, urlMap = {}) {
    if (!html || typeof html !== 'string') return html
    return html.replace(/https?:\/\/[^\s"'>]+/g, match =>
      this.replaceUrlByFileName(match, urlMap)
    )
  },

  decodeHtmlEntityInUrls (html) {
    if (!html || typeof html !== 'string') return html
    return html.replace(/https?:\/\/[^\s"'>]+/g, match =>
      match.replace(/&amp;/g, '&')
    )
  },

  decodeHtmlEntityInDelta (delta) {
    if (!delta || !Array.isArray(delta.ops)) return delta
    const nextDelta = JSON.parse(JSON.stringify(delta))
    nextDelta.ops = nextDelta.ops.map(op => {
      if (
        op &&
        typeof op === 'object' &&
        op.insert &&
        typeof op.insert === 'object' &&
        typeof op.insert.image === 'string'
      ) {
        op.insert.image = op.insert.image.replace(/&amp;/g, '&')
      }
      return op
    })
    return nextDelta
  },

  extractInlineImageFileIDsFromHtml (html) {
    if (!html || typeof html !== 'string') return []
    const app = getApp()
    const env = app && app.globalData ? app.globalData.env : ''
    const source = this.decodeHtmlEntityInUrls(html)
    const fileIDs = []
    const regex = /\/news_inline_images\/([^?'"<>\s]+)/g
    let matched = regex.exec(source)
    while (matched) {
      const fileName = matched[1]
      if (fileName && env) {
        fileIDs.push(`cloud://${env}.news_inline_images/${fileName}`)
      }
      matched = regex.exec(source)
    }

    const httpsRegex =
      /https:\/\/([^/\s"'<>]+)\.tcb\.qcloud\.la\/([^?'"<>\s]+)/g
    let httpsMatched = httpsRegex.exec(source)
    while (httpsMatched) {
      const host = httpsMatched[1]
      const path = httpsMatched[2]
      if (host && path) {
        fileIDs.push(`cloud://${host}/${path}`)
        if (env) {
          fileIDs.push(`cloud://${env}.${host}/${path}`)
        }
      }
      httpsMatched = httpsRegex.exec(source)
    }
    return this.mergeUniqueFileIDs(fileIDs)
  },

  async normalizeEditorContentForEdit (news) {
    const originHtml = this.decodeHtmlEntityInUrls(
      news.contentHtml || news.content || ''
    )
    const originDelta = this.decodeHtmlEntityInDelta(news.contentDelta || null)
    const inlineImageFileIDs = this.mergeUniqueFileIDs([
      ...(Array.isArray(news.inlineImageFileIDs)
        ? news.inlineImageFileIDs
        : []),
      ...this.extractInlineImageFileIDsFromDelta(originDelta),
      ...this.extractInlineImageFileIDsFromHtml(originHtml)
    ])

    if (!inlineImageFileIDs.length) {
      return {
        html: originHtml,
        delta: originDelta,
        inlineImageFileIDs: []
      }
    }

    try {
      const tempRes = await wx.cloud.getTempFileURL({
        fileList: inlineImageFileIDs
      })
      const fileList = (tempRes && tempRes.fileList) || []
      const urlMap = {}
      fileList.forEach(item => {
        if (item && item.status === 0 && item.tempFileURL && item.fileID) {
          const fileName = this.getFileNameFromPath(item.fileID)
          if (fileName) {
            urlMap[fileName] = item.tempFileURL
          }
        }
      })

      return {
        html: this.replaceInlineUrlsInHtml(originHtml, urlMap),
        delta: this.replaceInlineUrlsInDelta(originDelta, urlMap),
        inlineImageFileIDs
      }
    } catch (error) {
      console.error('刷新正文图片链接失败:', error)
      return {
        html: originHtml,
        delta: originDelta,
        inlineImageFileIDs
      }
    }
  },

  // 加载文章数据用于编辑
  async loadNewsForEdit (newsId) {
    wx.showLoading({ title: '加载中...' })

    try {
      const db = wx.cloud.database()
      const res = await db.collection('news_list').doc(newsId).get()
      const news = res.data

      // 检查是否是作者
      const app = getApp()
      if (news.authorId !== app.globalData.userId) {
        wx.hideLoading()
        wx.showToast({
          title: '无权编辑此文章',
          icon: 'none'
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/me/me'
          })
        }, 1500)
        return
      }

      // 找到分类对应的索引
      const categoryIndex = this.data.categories.findIndex(
        cat => cat.id === news.category
      )
      const normalizedContent = await this.normalizeEditorContentForEdit(news)

      this.setData({
        formData: {
          title: news.title,
          content: news.content,
          contentHtml: normalizedContent.html,
          contentDelta: normalizedContent.delta,
          category: news.category
        },
        selectedCategoryIndex: categoryIndex >= 0 ? categoryIndex : 0,
        imageUrl: news.image || '',
        imageFileID: news.image || '',
        inlineImageFileIDs: normalizedContent.inlineImageFileIDs,
        contentLength: news.content ? news.content.replace(/\s/g, '').length : 0
      })

      if (normalizedContent.html || normalizedContent.delta) {
        setTimeout(() => {
          if (this.editorCtx) {
            const contentPayload = normalizedContent.delta
              ? { delta: normalizedContent.delta }
              : { html: normalizedContent.html }
            this.editorCtx.setContents(contentPayload)
          }
        }, 500)
      }

      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.error('加载文章失败:', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 编辑器初始化完成
  onEditorReady () {
    const that = this
    wx.createSelectorQuery()
      .select('#editor')
      .context(function (res) {
        that.editorCtx = res.context
      })
      .exec()
  },

  // 编辑器输入事件
  onEditorInput (e) {
    const { html, text, delta } = e.detail
    const textLength = text ? text.replace(/\s/g, '').length : 0

    this.setData({
      'formData.contentHtml': html,
      'formData.content': text,
      'formData.contentDelta': delta,
      inlineImageFileIDs: this.mergeUniqueFileIDs([
        ...this.data.inlineImageFileIDs,
        ...this.extractInlineImageFileIDsFromDelta(delta)
      ]),
      contentLength: textLength
    })
  },

  // 编辑器状态变化（格式状态）
  onStatusChange (e) {
    const formats = e.detail
    this.setData({
      formatStatus: {
        bold: formats.bold || false,
        italic: formats.italic || false,
        underline: formats.underline || false,
        list: formats.list || ''
      }
    })
  },

  // 输入框内容变化
  onInputChange (e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value

    this.setData({
      [`formData.${field}`]: value
    })
  },

  // 格式化文本
  formatText (e) {
    if (!this.editorCtx) return

    const { format, value } = e.currentTarget.dataset
    this.editorCtx.format(format, value || true)
  },

  // 撤销
  undo () {
    if (!this.editorCtx) return
    this.editorCtx.undo()
  },

  // 重做
  redo () {
    if (!this.editorCtx) return
    this.editorCtx.redo()
  },

  // 清空编辑器
  clearEditor () {
    if (!this.editorCtx) return

    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有内容吗？',
      confirmColor: '#d43d3d',
      success: res => {
        if (res.confirm) {
          this.editorCtx.clear()
          this.setData({
            'formData.contentHtml': '',
            'formData.content': '',
            'formData.contentDelta': null,
            contentLength: 0
          })
        }
      }
    })
  },

  // 插入图片到编辑器
  insertImage () {
    if (!this.editorCtx) return

    const that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePath = res.tempFiles[0].tempFilePath

        wx.showLoading({
          title: '图片上传中...',
          mask: true
        })

        // 上传图片到云存储
        const cloudPath = `news_inline_images/${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}.jpg`

        // 1. 上传文件到云存储
        wx.cloud
          .uploadFile({
            cloudPath: cloudPath,
            filePath: tempFilePath
          })
          .then(uploadRes => {
            // 2. 获取该文件对应的 HTTPS 临时访问链接
            return wx.cloud.getTempFileURL({
              fileList: [uploadRes.fileID]
            })
          })
          .then(tempRes => {
            wx.hideLoading()
            const fileInfo = tempRes.fileList[0] || {}
            const fileUrl = fileInfo.tempFileURL
            const fileID = fileInfo.fileID

            that.editorCtx.insertImage({
              src: fileUrl,
              alt: '图片',
              width: '100%',
              data: {
                fileID: fileID
              },
              success: () => {
                that.setData({
                  inlineImageFileIDs: that.mergeUniqueFileIDs([
                    ...that.data.inlineImageFileIDs,
                    fileID
                  ])
                })
                wx.showToast({
                  title: '图片插入成功',
                  icon: 'success'
                })
                // 延迟获取最新内容，确保图片被包含
                setTimeout(() => {
                  that.editorCtx.getContents({
                    success: res => {
                      const textLength = res.text
                        ? res.text.replace(/\s/g, '').length
                        : 0
                      that.setData({
                        'formData.contentHtml': res.html,
                        'formData.content': res.text,
                        'formData.contentDelta': res.delta,
                        contentLength: textLength
                      })
                    }
                  })
                }, 300)
              },
              fail: err => {
                console.error('插入图片失败:', err)
                wx.showToast({
                  title: '插入图片失败',
                  icon: 'none'
                })
              }
            })
          })
          .catch(err => {
            wx.hideLoading()
            console.error('图片处理失败:', err)
            wx.showToast({
              title: '图片处理失败',
              icon: 'none'
            })
          })
      },
      fail: err => {
        console.error('选择图片失败:', err)
      }
    })
  },

  // 分类选择变化
  onCategoryChange (e) {
    const index = e.detail.value
    const category = this.data.categories[index]

    this.setData({
      selectedCategoryIndex: index,
      'formData.category': category.id
    })
  },

  // 选择封面图片
  onChooseImage () {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({ imageUrl: tempFilePath })
      },
      fail: err => {
        console.error('选择图片失败:', err)
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    })
  },

  // 移除封面图片
  onRemoveImage () {
    this.setData({
      imageUrl: '',
      imageFileID: ''
    })
  },

  // 表单提交
  async onSubmit (e) {
    const { title } = this.data.formData

    // 表单验证 - 标题
    if (!title.trim()) {
      wx.showToast({
        title: '请输入新闻标题',
        icon: 'none'
      })
      return
    }

    // 获取编辑器最新内容
    const editorContent = await this.getEditorContents()

    if (!editorContent || !editorContent.text || !editorContent.text.trim()) {
      wx.showToast({
        title: '请输入新闻内容',
        icon: 'none'
      })
      return
    }

    // 更新表单数据
    this.setData({
      'formData.contentHtml': editorContent.html,
      'formData.content': editorContent.text,
      'formData.contentDelta': editorContent.delta,
      submitting: true
    })

    // 如果有封面图片，先上传图片
    if (this.data.imageUrl && !this.data.imageUrl.startsWith('cloud://')) {
      this.uploadCoverImageAndSubmit()
    } else {
      this.submitNews(this.data.imageFileID || this.data.imageUrl)
    }
  },

  // 获取编辑器内容
  getEditorContents () {
    return new Promise(resolve => {
      if (!this.editorCtx) {
        // 如果编辑器未初始化，使用缓存的内容
        resolve({
          html: this.data.formData.contentHtml,
          text: this.data.formData.content,
          delta: this.data.formData.contentDelta
        })
        return
      }

      this.editorCtx.getContents({
        success: res => {
          resolve({
            html: res.html,
            text: res.text,
            delta: res.delta
          })
        },
        fail: err => {
          console.error('获取编辑器内容失败:', err)
          // 失败时使用缓存的内容
          resolve({
            html: this.data.formData.contentHtml,
            text: this.data.formData.content,
            delta: this.data.formData.contentDelta
          })
        }
      })
    })
  },

  // 上传封面图片并提交
  uploadCoverImageAndSubmit () {
    wx.cloud.uploadFile({
      cloudPath: `news_images/${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}.jpg`,
      filePath: this.data.imageUrl,
      success: res => {
        this.setData({ imageFileID: res.fileID })
        this.submitNews(res.fileID)
      },
      fail: err => {
        console.error('封面图片上传失败:', err)
        this.setData({ submitting: false })
        wx.showToast({
          title: '封面图片上传失败',
          icon: 'none'
        })
      }
    })
  },

  // 提交新闻到数据库
  submitNews (imageFileID = '') {
    const db = wx.cloud.database()
    const { title, content, category, contentHtml, contentDelta } =
      this.data.formData
    const app = getApp()
    const userInfo = app.globalData.userInfo

    const newsData = {
      title: title.trim(),
      content: content.trim(), // 纯文本（用于预览和搜索）
      contentHtml: contentHtml, // 富文本HTML（用于详情页显示）
      contentDelta: contentDelta,
      inlineImageFileIDs: this.mergeUniqueFileIDs([
        ...this.data.inlineImageFileIDs,
        ...this.extractInlineImageFileIDsFromDelta(contentDelta)
      ]),
      category: category,
      image: imageFileID,
      author: userInfo.nickname || userInfo.username || '匿名用户',
      authorId: app.globalData.userId,
      authorAvatar: userInfo.avatar || ''
    }

    if (this.data.isEditMode) {
      // 编辑模式：更新文章
      newsData.updateTime = db.serverDate()

      db.collection('news_list')
        .doc(this.data.editNewsId)
        .update({
          data: newsData
        })
        .then(res => {
          this.setData({ submitting: false })
          wx.showToast({
            title: '更新成功',
            icon: 'success'
          })

          setTimeout(() => {
            this.setData({
              isEditMode: false,
              editNewsId: ''
            })
            this.resetForm()
            wx.switchTab({
              url: '/pages/me/me'
            })
          }, 1500)
        })
        .catch(err => {
          console.error('更新新闻失败:', err)
          this.setData({ submitting: false })
          wx.showToast({
            title: '更新失败',
            icon: 'none'
          })
        })
    } else {
      // 发布模式：新增文章
      newsData.publishTime = db.serverDate()
      newsData.view_count = 0
      newsData.like_count = 0

      db.collection('news_list')
        .add({
          data: newsData
        })
        .then(res => {
          this.setData({ submitting: false })
          wx.showToast({
            title: '发布成功',
            icon: 'success'
          })

          // 清空表单数据
          this.resetForm()

          // 延迟跳转到首页
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }, 1500)
        })
        .catch(err => {
          console.error('发布新闻失败:', err)
          this.setData({ submitting: false })
          wx.showToast({
            title: '发布失败',
            icon: 'none'
          })
        })
    }
  },

  // 重置表单
  resetForm () {
    // 清空编辑器内容
    if (this.editorCtx) {
      this.editorCtx.clear()
    }

    this.setData({
      'formData.title': '',
      'formData.content': '',
      'formData.contentHtml': '',
      'formData.contentDelta': null,
      'formData.category': 'tech',
      selectedCategoryIndex: 0,
      imageUrl: '',
      imageFileID: '',
      inlineImageFileIDs: [],
      contentLength: 0,
      formatStatus: {
        bold: false,
        italic: false,
        underline: false,
        list: ''
      }
    })
  }
})
