const s1 = Symbol('二哈')
const s2 = Symbol('二哈')
console.log(s1 == s2)
const secretKey = Symbol('secret')

// 用于多于协作之中 Why Symbol
// JS 是一门动态的语言 多人协作 数据不太安全?
const a = 'ecut'
const user = {
  // key String 类型| Symbol 类型
  [secretKey]: 123,
  email: '123@qq.com',
  name: '华高俊',
  [a]: 123
}
user.email = '321@qq.com'
console.log(secretKey)
console.log(typeof user[a])
