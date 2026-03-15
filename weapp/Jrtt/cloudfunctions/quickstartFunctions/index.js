const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const crypto = require('crypto')

// 密码加密函数
const hashPassword = password => {
  return crypto.createHash('md5').update(password).digest('hex')
}

// 生成用户ID
const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}
// 获取openid
const getOpenId = async () => {
  // 获取基础信息
  const wxContext = cloud.getWXContext()
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
}

// 获取小程序二维码
const getMiniProgramCode = async () => {
  // 获取小程序二维码的buffer
  const resp = await cloud.openapi.wxacode.get({
    path: 'pages/index/index'
  })
  const { buffer } = resp
  // 将图片上传云存储空间
  const upload = await cloud.uploadFile({
    cloudPath: 'code.png',
    fileContent: buffer
  })
  return upload.fileID
}

// 创建集合
const createCollection = async () => {
  try {
    // 创建集合
    await db.createCollection('sales')
    await db.collection('sales').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: '华东',
        city: '上海',
        sales: 11
      }
    })
    await db.collection('sales').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: '华东',
        city: '南京',
        sales: 11
      }
    })
    await db.collection('sales').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: '华南',
        city: '广州',
        sales: 22
      }
    })
    await db.collection('sales').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: '华南',
        city: '深圳',
        sales: 22
      }
    })
    return {
      success: true
    }
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: true,
      data: 'create collection success'
    }
  }
}

// 查询数据
const selectRecord = async () => {
  // 返回数据库查询结果
  return await db.collection('sales').get()
}

// 更新数据
const updateRecord = async event => {
  try {
    // 遍历修改数据库信息
    for (let i = 0; i < event.data.length; i++) {
      await db
        .collection('sales')
        .where({
          _id: event.data[i]._id
        })
        .update({
          data: {
            sales: event.data[i].sales
          }
        })
    }
    return {
      success: true,
      data: event.data
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    }
  }
}

// 新增数据
const insertRecord = async event => {
  try {
    const insertRecord = event.data
    // 插入数据
    await db.collection('sales').add({
      data: {
        region: insertRecord.region,
        city: insertRecord.city,
        sales: Number(insertRecord.sales)
      }
    })
    return {
      success: true,
      data: event.data
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    }
  }
}

// 删除数据
const deleteRecord = async event => {
  try {
    await db
      .collection('sales')
      .where({
        _id: event.data._id
      })
      .remove()
    return {
      success: true
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    }
  }
}

// 用户注册
const registerUser = async event => {
  try {
    const { username, phone, password } = event

    // 1. 参数校验
    if (!username || !phone || !password) {
      return { success: false, message: '参数不完整' }
    }

    // 2. 格式校验 (Backend double check)
    // Username: 2-20 chars, allow Chinese/Alphanumeric/Underscore/Hyphen
    if (!/^[a-zA-Z0-9_\-\u4e00-\u9fa5]{2,20}$/.test(username)) {
      return { success: false, message: '用户名格式不正确' }
    }
    // Phone
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { success: false, message: '手机号格式不正确' }
    }
    // Password
    if (password.length < 8) {
      // Basic length check
      return { success: false, message: '密码长度不足' }
    }

    // 3. 敏感词过滤 (Mock)
    const sensitiveWords = ['admin', 'root', 'test', '敏感词']
    for (const word of sensitiveWords) {
      if (username.includes(word)) {
        return { success: false, message: '用户名包含敏感词' }
      }
    }

    // 4. 唯一性检查
    const usernameCheck = await db
      .collection('users')
      .where({ username })
      .count()
    if (usernameCheck.total > 0) {
      return { success: false, message: '用户名已存在' }
    }

    const phoneCheck = await db.collection('users').where({ phone }).count()
    if (phoneCheck.total > 0) {
      return { success: false, message: '手机号已被注册' }
    }

    // 5. 插入数据
    const userId = generateUserId()
    const hashedPassword = hashPassword(password)
    const createTime = new Date()

    await db.collection('users').add({
      data: {
        _id: userId,
        username,
        phone,
        password: hashedPassword,
        createTime: db.serverDate(),
        avatar: '',
        nickname: username,
        status: 1
      }
    })

    return {
      success: true,
      message: '注册成功',
      userInfo: {
        _id: userId,
        username,
        phone,
        nickname: username,
        avatar: '',
        createTime: createTime,
        status: 1
      }
    }
  } catch (e) {
    console.error('注册失败:', e)
    return {
      success: false,
      message: '注册失败，请稍后重试',
      error: e.message
    }
  }
}

// 用户登录
const loginUser = async event => {
  try {
    const { username, password } = event
    const hashedPassword = hashPassword(password)

    // 查找用户
    const userResult = await db
      .collection('users')
      .where({
        $or: [{ username: username }, { phone: username }],
        password: hashedPassword,
        status: 1
      })
      .get()

    if (userResult.data.length === 0) {
      return {
        success: false,
        message: '用户名或密码错误'
      }
    }

    const userInfo = userResult.data[0]

    // 不返回密码
    delete userInfo.password

    return {
      success: true,
      message: '登录成功',
      userInfo: userInfo
    }
  } catch (e) {
    console.error('登录失败:', e)
    return {
      success: false,
      message: '登录失败，请稍后重试'
    }
  }
}

// 微信登录
const wechatLogin = async event => {
  try {
    const { userInfo = {}, openid } = event

    // 检查是否已存在该微信用户
    const existingUser = await db
      .collection('users')
      .where({
        openid: openid
      })
      .get()

    let result

    if (existingUser.data.length > 0) {
      // 已存在，更新登录时间并登录
      const user = existingUser.data[0]

      const updateData = {
        lastLoginTime: db.serverDate()
      }

      // 如果提供了新的用户信息，也更新
      if (userInfo.avatarUrl) updateData.avatar = userInfo.avatarUrl
      if (userInfo.nickName) updateData.nickname = userInfo.nickName

      await db.collection('users').doc(user._id).update({
        data: updateData
      })

      result = { ...user, ...updateData }
      delete result.password
    } else {
      // 不存在，创建新用户
      const userId = generateUserId()
      const newUser = {
        _id: userId,
        username: '微信用户_' + Math.random().toString(36).substr(2, 6),
        phone: '',
        password: '',
        openid: openid,
        createTime: db.serverDate(),
        lastLoginTime: db.serverDate(),
        avatar: userInfo.avatarUrl || '',
        nickname: userInfo.nickName || '微信用户',
        status: 1
      }

      await db.collection('users').add({
        data: newUser
      })

      result = {
        ...newUser,
        createTime: new Date(),
        lastLoginTime: new Date()
      }
    }

    return {
      success: true,
      message: '登录成功',
      userInfo: result
    }
  } catch (e) {
    console.error('微信登录失败:', e)
    return {
      success: false,
      message: '登录失败，请稍后重试'
    }
  }
}

// const getOpenId = require('./getOpenId/index');
// const getMiniProgramCode = require('./getMiniProgramCode/index');
// const createCollection = require('./createCollection/index');
// const selectRecord = require('./selectRecord/index');
// const updateRecord = require('./updateRecord/index');
// const fetchGoodsList = require('./fetchGoodsList/index');
// const genMpQrcode = require('./genMpQrcode/index');
// 更新用户信息
const updateUserProfile = async event => {
  try {
    const { avatar, nickname, openid, userId } = event
    const wxContext = cloud.getWXContext()

    let query = {}
    if (userId) {
      query = { _id: userId }
    } else {
      const queryOpenId = openid || wxContext.OPENID
      query = { openid: queryOpenId }
    }

    // 查询用户ID
    const userRes = await db.collection('users').where(query).get()

    if (userRes.data.length === 0) {
      return { success: false, message: '用户不存在' }
    }

    const targetUserId = userRes.data[0]._id
    const updateData = {}
    if (avatar) updateData.avatar = avatar
    if (nickname) updateData.nickname = nickname

    await db.collection('users').doc(targetUserId).update({
      data: updateData
    })

    return {
      success: true,
      message: '更新成功'
    }
  } catch (e) {
    console.error('更新用户信息失败:', e)
    return {
      success: false,
      message: '更新失败，请稍后重试'
    }
  }
}

// 获取用户详细信息
const getUserDetail = async event => {
  try {
    const { openid, userId } = event
    const wxContext = cloud.getWXContext()

    let query = {}
    if (userId) {
      query = { _id: userId }
    } else {
      const queryOpenId = openid || wxContext.OPENID
      query = { openid: queryOpenId }
    }

    const userRes = await db.collection('users').where(query).get()

    if (userRes.data.length === 0) {
      return {
        success: false,
        message: '用户不存在'
      }
    }

    const userInfo = userRes.data[0]
    delete userInfo.password // 不返回密码

    return {
      success: true,
      userInfo
    }
  } catch (e) {
    console.error('获取用户信息失败:', e)
    return {
      success: false,
      message: '获取失败，请重试'
    }
  }
}

// 获取用户统计数据（获赞总数）
const getUserStats = async event => {
  try {
    const { userId } = event
    if (!userId) return { success: false, message: '缺少userId' }

    // 1. 获取该用户发布的所有文章ID
    // 注意：如果有分页限制，这里默认取前100条。如果文章非常多，需要分批获取或使用聚合查询。
    // 使用聚合查询 match -> group 可以更高效
    const _ = db.command

    // 方法：查出所有文章的 like_count 并求和
    const newsRes = await db
      .collection('news_list')
      .where({ authorId: userId })
      .field({ _id: true, view_count: true, like_count: true })
      .limit(1000) // 假设用户文章不超过1000篇
      .get()

    if (newsRes.data.length === 0) {
      return { success: true, stats: { likes: 0, viewCount: 0 } }
    }

    // 统计阅读数
    const totalViews = newsRes.data.reduce(
      (sum, item) => sum + (item.view_count || 0),
      0
    )

    // 2. 统计这些文章获得的点赞数 (通过 like_count 字段累加)
    const totalLikes = newsRes.data.reduce(
      (sum, item) => sum + (item.like_count || 0),
      0
    )

    // 3. 统计关注数 (following)
    let followingCount = 0
    try {
      const followingRes = await db
        .collection('user_follows')
        .where({
          followerId: userId
        })
        .count()
      followingCount = followingRes.total
    } catch (err) {
      // 集合不存在时忽略错误
      console.warn('统计关注数失败(可能是集合不存在):', err)
    }

    // 4. 统计粉丝数 (followers)
    let followersCount = 0
    try {
      const followersRes = await db
        .collection('user_follows')
        .where({
          followingId: userId
        })
        .count()
      followersCount = followersRes.total
    } catch (err) {
      // 集合不存在时忽略错误
      console.warn('统计粉丝数失败(可能是集合不存在):', err)
    }

    return {
      success: true,
      stats: {
        likes: totalLikes,
        viewCount: totalViews,
        following: followingCount,
        followers: followersCount
      }
    }
  } catch (e) {
    console.error('获取用户统计失败:', e)
    return { success: false, message: '获取统计失败' }
  }
}

// 获取用户关系列表（关注 / 粉丝）
const getUserRelationList = async event => {
  try {
    const { userId, listType } = event
    if (!userId) return { success: false, message: '缺少userId' }
    if (!['following', 'followers'].includes(listType)) {
      return { success: false, message: '无效的列表类型' }
    }

    const relationField = listType === 'following' ? 'followingId' : 'followerId'
    const relationQuery =
      listType === 'following'
        ? { followerId: userId }
        : { followingId: userId }

    let relationRes
    try {
      relationRes = await db
        .collection('user_follows')
        .where(relationQuery)
        .orderBy('createTime', 'desc')
        .limit(100)
        .get()
    } catch (err) {
      console.warn('获取关系列表失败(可能是集合不存在):', err)
      return { success: true, list: [] }
    }

    if (!relationRes.data.length) {
      return { success: true, list: [] }
    }

    const _ = db.command
    const relationList = relationRes.data
    const userIds = [
      ...new Set(
        relationList.map(item => item[relationField]).filter(id => typeof id === 'string' && id)
      )
    ]

    if (!userIds.length) {
      return { success: true, list: [] }
    }

    const usersRes = await db
      .collection('users')
      .where({
        _id: _.in(userIds)
      })
      .field({
        _id: true,
        username: true,
        nickname: true,
        avatar: true
      })
      .get()

    const userMap = {}
    usersRes.data.forEach(user => {
      userMap[user._id] = user
    })

    let followingIdSet = new Set()
    if (listType === 'followers') {
      const followerIds = userIds
      if (followerIds.length) {
        try {
          const myFollowingRes = await db
            .collection('user_follows')
            .where({
              followerId: userId,
              followingId: _.in(followerIds)
            })
            .get()

          followingIdSet = new Set(
            myFollowingRes.data.map(item => item.followingId).filter(Boolean)
          )
        } catch (err) {
          console.warn('获取粉丝回关状态失败:', err)
        }
      }
    }

    const list = relationList
      .map(item => {
        const user = userMap[item[relationField]]
        if (!user) return null

        return {
          ...user,
          relationTime: item.createTime || null,
          isFollowing:
            listType === 'following'
              ? true
              : followingIdSet.has(user._id)
        }
      })
      .filter(item => item !== null)

    return {
      success: true,
      list
    }
  } catch (e) {
    console.error('获取用户关系列表失败:', e)
    return {
      success: false,
      message: '获取列表失败'
    }
  }
}

// 切换点赞状态
const toggleLike = async event => {
  try {
    const { newsId, userId, title } = event
    if (!newsId || !userId) return { success: false, message: '缺少必要参数' }

    const _ = db.command
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    // 1. 检查是否已点赞
    const checkRes = await db
      .collection('user_actions')
      .where({
        newsId: newsId,
        userId: userId,
        type: 'like'
      })
      .get()

    const isLiked = checkRes.data.length > 0
    let actionResult = {}

    if (isLiked) {
      // 已点赞 -> 取消点赞
      // 删除记录
      await db
        .collection('user_actions')
        .where({
          newsId: newsId,
          userId: userId,
          type: 'like'
        })
        .remove()

      // 减少计数
      await db
        .collection('news_list')
        .doc(newsId)
        .update({
          data: {
            like_count: _.inc(-1)
          }
        })

      actionResult = { isLiked: false }
    } else {
      // 未点赞 -> 添加点赞
      await db.collection('user_actions').add({
        data: {
          newsId: newsId,
          type: 'like',
          title: title || '未命名文章',
          userId: userId,
          openid: openid,
          createTime: db.serverDate()
        }
      })

      // 增加计数
      await db
        .collection('news_list')
        .doc(newsId)
        .update({
          data: {
            like_count: _.inc(1)
          }
        })

      actionResult = { isLiked: true }
    }

    // 获取最新点赞数
    const newsDoc = await db.collection('news_list').doc(newsId).get()
    actionResult.likeCount = newsDoc.data.like_count || 0

    return {
      success: true,
      data: actionResult
    }
  } catch (e) {
    console.error('点赞操作失败:', e)
    return { success: false, message: '操作失败', error: e }
  }
}

// 切换关注状态
const toggleFollow = async event => {
  try {
    const { followerId, followingId } = event
    if (!followerId || !followingId)
      return { success: false, message: '缺少必要参数' }

    if (followerId === followingId) {
      return { success: false, message: '不能关注自己' }
    }

    const _ = db.command

    // 1. 检查是否已关注
    let isFollowing = false
    try {
      const checkRes = await db
        .collection('user_follows')
        .where({
          followerId: followerId,
          followingId: followingId
        })
        .get()
      isFollowing = checkRes.data.length > 0
    } catch (err) {
      // 如果查询失败（可能是集合不存在），尝试创建集合
      if (
        err.errMsg &&
        (err.errMsg.includes('Collection not found') ||
          err.errMsg.includes('-502005'))
      ) {
        try {
          await db.createCollection('user_follows')
        } catch (createErr) {
          // 忽略创建已存在的错误
          console.warn('创建集合可能已存在:', createErr)
        }
      } else {
        // 如果是其他错误，可能也需要创建集合（有些环境错误码不同），或者抛出
        // 为了保险起见，这里尝试创建一次
        try {
          await db.createCollection('user_follows')
        } catch (e) {
          // ignore
        }
      }
      // 再次尝试查询（如果还是失败则抛出）
      const retryRes = await db
        .collection('user_follows')
        .where({
          followerId: followerId,
          followingId: followingId
        })
        .get()
      isFollowing = retryRes.data.length > 0
    }

    if (isFollowing) {
      // 已关注 -> 取消关注
      await db
        .collection('user_follows')
        .where({
          followerId: followerId,
          followingId: followingId
        })
        .remove()

      return { success: true, isFollowing: false }
    } else {
      // 未关注 -> 添加关注
      await db.collection('user_follows').add({
        data: {
          followerId: followerId,
          followingId: followingId,
          createTime: db.serverDate()
        }
      })

      return { success: true, isFollowing: true }
    }
  } catch (e) {
    console.error('关注操作失败:', e)
    return {
      success: false,
      message: '操作失败: ' + (e.message || e.errMsg || JSON.stringify(e)),
      error: e
    }
  }
}

// 检查关注状态
const checkFollowStatus = async event => {
  try {
    const { followerId, followingId } = event
    if (!followerId || !followingId)
      return { success: false, message: '缺少必要参数' }

    let isFollowing = false
    try {
      const checkRes = await db
        .collection('user_follows')
        .where({
          followerId: followerId,
          followingId: followingId
        })
        .get()
      isFollowing = checkRes.data.length > 0
    } catch (err) {
      // 集合不存在视为未关注
      console.warn('检查关注状态失败(可能是集合不存在):', err)
      isFollowing = false
    }

    return {
      success: true,
      isFollowing: isFollowing
    }
  } catch (e) {
    console.error('检查关注状态失败:', e)
    return { success: false, message: '检查失败', error: e }
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId()
    case 'getMiniProgramCode':
      return await getMiniProgramCode()
    case 'createCollection':
      return await createCollection()
    case 'selectRecord':
      return await selectRecord()
    case 'updateRecord':
      return await updateRecord(event)
    case 'insertRecord':
      return await insertRecord(event)
    case 'deleteRecord':
      return await deleteRecord(event)
    case 'register':
      return await registerUser(event)
    case 'login':
      return await loginUser(event)
    case 'wechatLogin':
      return await wechatLogin(event)
    case 'updateUserProfile':
      return await updateUserProfile(event)
    case 'getUserDetail':
      return await getUserDetail(event)
    case 'getUserStats':
      return await getUserStats(event)
    case 'getUserRelationList':
      return await getUserRelationList(event)
    case 'toggleLike':
      return await toggleLike(event)
    case 'toggleFollow':
      return await toggleFollow(event)
    case 'checkFollowStatus':
      return await checkFollowStatus(event)
  }
}
