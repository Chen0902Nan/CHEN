// app.js
App({
  onLaunch: function () {
    this.globalData = {
      // env 参数说明：
      // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会请求到哪个云环境的资源
      // 此处请填入环境 ID, 环境 ID 可在微信开发者工具右上顶部工具栏点击云开发按钮打开获取
      env: "cloud1-0ge140rx686caef3",
      openid: '',
      userInfo: {},
      isLoggedIn: false,
      userId: '',
      publishEditRequest: null
    };

    // 检查本地登录状态
    this.checkLoginStatus();
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
    }

    // 应用启动时自动获取OpenID
    this.getUserOpenId();
  },

  // 检查登录状态
  checkLoginStatus() {
    try {
      const isLoggedIn = wx.getStorageSync('isLoggedIn');
      const userInfo = wx.getStorageSync('userInfo');

      if (isLoggedIn && userInfo) {
        this.globalData.isLoggedIn = true;
        this.globalData.userInfo = userInfo;
        this.globalData.userId = userInfo._id;
      }
    } catch (e) {
      console.error('检查登录状态失败:', e);
    }
  },

  // 用户登录
  userLogin(userInfo) {
    this.globalData.isLoggedIn = true;
    this.globalData.userInfo = userInfo;
    this.globalData.userId = userInfo._id;

    // 保存到本地存储
    wx.setStorageSync('isLoggedIn', true);
    wx.setStorageSync('userInfo', userInfo);
  },

  // 用户登出
  userLogout() {
    this.globalData.isLoggedIn = false;
    this.globalData.userInfo = {};
    this.globalData.userId = '';

    // 清除本地存储
    wx.removeStorageSync('isLoggedIn');
    wx.removeStorageSync('userInfo');
  },

  // 检查登录状态，未登录则跳转到登录页
  requireLogin() {
    if (!this.globalData.isLoggedIn) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return false;
    }
    return true;
  },

  // 获取用户OpenID
  getUserOpenId() {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      }
    }).then(res => {
      if (res.result && res.result.openid) {
        this.globalData.openid = res.result.openid;
        console.log('获取OpenID成功:', res.result.openid);
      }
    }).catch(err => {
      console.error('获取OpenID失败:', err);
    });
  },

  // 获取用户信息
  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '获取用户信息用于完善个人资料',
        success: (res) => {
          this.globalData.userInfo = res.userInfo;
          resolve(res.userInfo);
        },
        fail: (err) => {
          console.error('获取用户信息失败:', err);
          reject(err);
        }
      });
    });
  },
});
