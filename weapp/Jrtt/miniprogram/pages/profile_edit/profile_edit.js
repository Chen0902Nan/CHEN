const app = getApp()

Page({
  data: {
    userInfo: {
      avatar: '',
      nickname: '',
      phone: ''
    },
    maskedPhone: '',
    loading: false
  },

  onLoad (options) {
    // 先加载本地缓存数据
    const userInfo = app.globalData.userInfo || {}
    this.setData({
      userInfo: {
        avatar: userInfo.avatar || userInfo.avatarUrl || '',
        nickname: userInfo.nickname || userInfo.nickName || '',
        phone: userInfo.phone || ''
      },
      maskedPhone: this.formatPhone(userInfo.phone || '')
    })

    // 异步获取最新数据
    this.fetchUserDetail()
  },

  // 获取用户最新信息
  async fetchUserDetail () {
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

        // 更新页面数据
        const newPhone = remoteUserInfo.phone || ''
        this.setData({
          'userInfo.avatar': remoteUserInfo.avatar || this.data.userInfo.avatar,
          'userInfo.nickname':
            remoteUserInfo.nickname || this.data.userInfo.nickname,
          'userInfo.phone': newPhone,
          maskedPhone: this.formatPhone(newPhone)
        })

        // 同步更新全局数据和缓存
        // 注意：这里需要合并，避免覆盖掉其他字段
        const newUserInfo = { ...app.globalData.userInfo, ...remoteUserInfo }
        app.globalData.userInfo = newUserInfo
        wx.setStorageSync('userInfo', newUserInfo)
      }
    } catch (err) {
      console.error('获取用户详情失败:', err)
    }
  },

  formatPhone (phone) {
    if (!phone) return ''
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  },

  // 选择头像
  onChooseAvatar () {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFile = res.tempFiles[0]
        const tempFilePath = tempFile.tempFilePath
        const size = tempFile.size

        // 限制图片大小不超过2MB
        if (size > 2 * 1024 * 1024) {
          wx.showToast({
            title: '图片大小不能超过2MB',
            icon: 'none'
          })
          return
        }

        // 尝试裁剪
        if (wx.cropImage) {
          wx.cropImage({
            src: tempFilePath,
            cropScale: '1:1',
            success: cropRes => {
              this.uploadAvatar(cropRes.tempFilePath)
            },
            fail: err => {
              console.log('裁剪取消或失败', err)
              // 如果用户取消裁剪，不进行上传
            }
          })
        } else {
          // 不支持裁剪则直接上传
          this.uploadAvatar(tempFilePath)
        }
      },
      fail: err => {
        console.error('选择图片失败', err)
      }
    })
  },

  // 上传头像
  uploadAvatar (filePath) {
    wx.showLoading({
      title: '上传中...',
      mask: true
    })

    const cloudPath = `avatars/${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}.jpg`

    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        this.setData({
          'userInfo.avatar': res.fileID
        })
        wx.showToast({
          title: '头像更换成功',
          icon: 'success'
        })
      },
      fail: err => {
        console.error('上传失败', err)
        wx.showToast({
          title: '头像上传失败',
          icon: 'none'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  // 昵称变更
  onNicknameChange (e) {
    const { value } = e.detail
    this.setData({
      'userInfo.nickname': value
    })
  },

  // 保存资料
  async onSaveProfile () {
    const { avatar, nickname } = this.data.userInfo

    if (!nickname.trim()) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' })
      return
    }

    this.setData({ loading: true })

    try {
      // 调用云函数更新用户信息
      const res = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'updateUserProfile',
          openid: app.globalData.openid,
          userId: app.globalData.userId,
          avatar: avatar,
          nickname: nickname
        }
      })

      if (res.result && res.result.success) {
        // 更新全局数据和本地存储
        if (!app.globalData.userInfo) {
          app.globalData.userInfo = {}
        }
        app.globalData.userInfo.avatar = avatar
        app.globalData.userInfo.nickname = nickname
        wx.setStorageSync('userInfo', app.globalData.userInfo)

        wx.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 1500)
      } else {
        throw new Error((res.result && res.result.message) || '更新失败')
      }
    } catch (err) {
      console.error('保存失败:', err)
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 退出登录
  onLogout () {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: res => {
        if (res.confirm) {
          // 清除本地存储
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('token') // 假设有token

          // 清除全局状态
          app.globalData.userInfo = null
          app.globalData.isLoggedIn = false

          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 1500
          })

          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }, 1500)
        }
      }
    })
  }
})
