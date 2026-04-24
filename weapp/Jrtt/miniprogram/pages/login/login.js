// pages/login/login.js
const validate = require('../../utils/validate.js')

Page({
  data: {
    currentTab: 'login', // 'login' or 'register'
    loading: false,
    showLoginPassword: false,
    showRegisterPassword: false,
    showRegisterConfirmPassword: false,
    loginForm: {
      username: '',
      password: ''
    },
    registerForm: {
      username: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  },

  onLoad (options) {
    // 检查是否已登录
    const app = getApp()
    if (app.globalData.isLoggedIn) {
      wx.switchTab({
        url: '/pages/index/index'
      })
      return
    }
    
    // 尝试自动登录
    // this.checkAutoLogin()
  },

  // 检查自动登录
  checkAutoLogin () {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      }
    }).then(res => {
      const openid = res.result.openid
      if (openid) {
        // 尝试用 openid 登录 (不带用户信息)
        this.performWechatLogin(openid, {})
      }
    }).catch(err => {
      console.error('自动登录检查失败:', err)
    })
  },

  // 处理微信登录点击
  handleWechatLogin () {
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const userInfo = res.userInfo
        
        // 获取 OpenID 并登录
        wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'getOpenId'
          }
        }).then(cloudRes => {
          const openid = cloudRes.result.openid
          this.performWechatLogin(openid, userInfo)
        }).catch(err => {
          console.error('获取OpenID失败:', err)
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
        })
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err)
        wx.showToast({
          title: '需要授权才能登录',
          icon: 'none'
        })
      }
    })
  },

  // 执行微信登录逻辑
  performWechatLogin (openid, userInfo) {
    if (!openid) return

    // 如果是手动点击登录，显示加载中
    if (userInfo.nickName) {
      this.setData({ loading: true })
    }

    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'wechatLogin',
        openid: openid,
        userInfo: userInfo
      }
    }).then(res => {
      this.setData({ loading: false })
      
      if (res.result && res.result.success) {
        // 登录成功
        const app = getApp()
        app.globalData.isLoggedIn = true
        app.globalData.userInfo = res.result.userInfo
        app.globalData.userId = res.result.userInfo._id
        app.globalData.openid = openid

        // 保存登录状态到本地存储
        wx.setStorageSync('isLoggedIn', true)
        wx.setStorageSync('userInfo', res.result.userInfo)

        // 只有手动登录才显示提示
        if (userInfo.nickName) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          })
        }

        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      } else {
        // 如果是自动登录失败，不提示错误，停留在登录页
        if (userInfo.nickName) {
          wx.showToast({
            title: res.result?.message || '登录失败',
            icon: 'none'
          })
        }
      }
    }).catch(err => {
      console.error('登录调用失败:', err)
      this.setData({ loading: false })
      if (userInfo.nickName) {
        wx.showToast({
          title: '登录失败，请稍后重试',
          icon: 'none'
        })
      }
    })
  },

  // 切换登录/注册标签
  switchTab (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab,
      showLoginPassword: false,
      showRegisterPassword: false,
      showRegisterConfirmPassword: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        phone: '',
        password: '',
        confirmPassword: ''
      }
    })
  },

  // 切换登录密码显示/隐藏
  toggleLoginPassword () {
    this.setData({
      showLoginPassword: !this.data.showLoginPassword
    })
  },

  // 切换注册密码显示/隐藏
  toggleRegisterPassword () {
    this.setData({
      showRegisterPassword: !this.data.showRegisterPassword
    })
  },

  // 切换注册确认密码显示/隐藏
  toggleRegisterConfirmPassword () {
    this.setData({
      showRegisterConfirmPassword: !this.data.showRegisterConfirmPassword
    })
  },

  // 统一的密码显示切换方法
  togglePasswordVisibility (e) {
    const form = e.currentTarget.dataset.form
    const field = e.currentTarget.dataset.field

    if (form === 'login') {
      const newValue = !this.data.showLoginPassword
      console.log('切换登录密码显示:', newValue)
      this.setData({
        showLoginPassword: newValue
      })
    } else if (form === 'register') {
      if (field === 'password') {
        const newValue = !this.data.showRegisterPassword
        console.log('切换注册密码显示:', newValue)
        this.setData({
          showRegisterPassword: newValue
        })
      } else if (field === 'confirmPassword') {
        const newValue = !this.data.showRegisterConfirmPassword
        console.log('切换确认密码显示:', newValue)
        this.setData({
          showRegisterConfirmPassword: newValue
        })
      }
    }
  },

  // 登录表单输入变化
  onInputChange (e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`loginForm.${field}`]: value
    })
  },

  // 注册表单输入变化
  onRegisterInputChange (e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`registerForm.${field}`]: value
    })
  },

  // 登录
  onLogin () {
    const { username, password } = this.data.loginForm

    if (!username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    if (!password.trim()) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    // 调用云函数进行登录验证
    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'login',
          username: username.trim(),
          password: password.trim()
        }
      })
      .then(res => {
        this.setData({ loading: false })

        if (res.result && res.result.success) {
          // 登录成功
          const app = getApp()
          app.globalData.isLoggedIn = true
          app.globalData.userInfo = res.result.userInfo
          app.globalData.userId = res.result.userInfo._id

          // 保存登录状态到本地存储
          wx.setStorageSync('isLoggedIn', true)
          wx.setStorageSync('userInfo', res.result.userInfo)

          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          })

          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }, 1500)
        } else {
          wx.showToast({
            title: res.result?.message || '登录失败',
            icon: 'none'
          })
        }
      })
      .catch(err => {
        console.error('登录失败:', err)
        this.setData({ loading: false })
        wx.showToast({
          title: '登录失败，请稍后重试',
          icon: 'none'
        })
      })
  },

  // 注册
  onRegister () {
    const { username, phone, password, confirmPassword } =
      this.data.registerForm

    // 1. 必填项校验
    if (!validate.required(username)) {
      wx.showToast({ title: '请输入用户名', icon: 'none' })
      return
    }
    if (!validate.required(phone)) {
      wx.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!validate.required(password)) {
      wx.showToast({ title: '请输入密码', icon: 'none' })
      return
    }
    if (!validate.required(confirmPassword)) {
      wx.showToast({ title: '请确认密码', icon: 'none' })
      return
    }

    // 2. 格式校验
    if (!validate.username(username)) {
      wx.showToast({ title: '用户名需为2-20位字母/数字/下划线', icon: 'none' })
      return
    }
    if (!validate.phone(phone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' })
      return
    }
    if (!validate.passwordStrength(password)) {
      wx.showToast({ title: '密码需8-20位且包含字母和数字', icon: 'none' })
      return
    }

    // 3. 确认密码校验
    if (password !== confirmPassword) {
      wx.showToast({ title: '两次输入的密码不一致', icon: 'none' })
      return
    }

    // 4. 防抖动/重复提交
    if (this.data.loading) return
    this.setData({ loading: true })

    // 调用云函数进行注册
    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'register', // Corrected to match backend
          username: username.trim(),
          phone: phone.trim(),
          password: password.trim()
        }
      })
      .then(res => {
        this.setData({ loading: false })
        if (res.result && res.result.success) {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1500
          })
          // 自动切换到登录 tab
          setTimeout(() => {
            this.setData({
              currentTab: 'login',
              'loginForm.username': username // Auto-fill username
            })
          }, 1500)
        } else {
          wx.showToast({
            title: res.result?.message || '注册失败',
            icon: 'none'
          })
        }
      })
      .catch(err => {
        console.error('注册失败:', err)
        this.setData({ loading: false })
        
        // 错误码处理
        if (err.errCode === -501000) {
          wx.showModal({
            title: '系统错误',
            content: '云函数未找到 (Error -501000)。\n请确保已在微信开发者工具中上传并部署 quickstartFunctions 云函数。',
            showCancel: false
          })
        } else {
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none'
          })
        }
      })
  },

  // 微信快速登录
  onWechatLogin (e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      this.setData({ loading: true })

      // 获取用户信息
      const app = getApp()
      app
        .getUserInfo()
        .then(userInfo => {
          // 调用云函数进行微信登录
          return wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
              type: 'wechatLogin',
              userInfo: userInfo,
              openid: app.globalData.openid
            }
          })
        })
        .then(res => {
          this.setData({ loading: false })

          if (res.result && res.result.success) {
            // 微信登录成功
            const app = getApp()
            app.globalData.isLoggedIn = true
            app.globalData.userInfo = res.result.userInfo
            app.globalData.userId = res.result.userInfo._id

            // 保存登录状态到本地存储
            wx.setStorageSync('isLoggedIn', true)
            wx.setStorageSync('userInfo', res.result.userInfo)

            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1500
            })

            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }, 1500)
          } else {
            wx.showToast({
              title: res.result?.message || '登录失败',
              icon: 'none'
            })
          }
        })
        .catch(err => {
          console.error('微信登录失败:', err)
          this.setData({ loading: false })
          wx.showToast({
            title: '登录失败，请稍后重试',
            icon: 'none'
          })
        })
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      })
    }
  },

  // 显示用户协议
  showUserAgreement () {
    wx.showModal({
      title: '用户协议',
      content:
        '欢迎使用仿头条资讯小程序！\n\n1. 用户应当遵守国家法律法规\n2. 不得发布违法不良信息\n3. 尊重他人知识产权\n4. 保护个人隐私信息\n\n使用本小程序即表示您同意以上协议。',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  // 显示隐私政策
  showPrivacyPolicy () {
    wx.showModal({
      title: '隐私政策',
      content:
        '我们重视您的隐私保护：\n\n1. 仅收集必要的服务信息\n2. 不会泄露您的个人信息\n3. 使用加密技术保护数据安全\n4. 您可以随时删除账户信息\n\n我们承诺保护您的隐私安全。',
      showCancel: false,
      confirmText: '我知道了'
    })
  }
})
