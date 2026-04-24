var users // 变量的类型由值决定
var data // undefined 栈内存
// json 数组 在堆内存中 独立于users data之外
// users,data 都是对 json数组的引用
users = [
  {
    id: 1,
    name: '陈俊璋',
    hometown: '南昌'
  },
  {
    id: 2,
    name: '舒俊',
    hometown: '南昌'
  },
  {
    id: 3,
    name: '王静',
    hometown: '进贤'
  }
] // 存的地址 users和data仍然是栈内存 通过地址 访问堆内存

// 如何真正地去拷贝一个对象？ -> 深拷贝
// 向堆内存申请一个新的空间 存储拷贝后的数据

// 对象->序列化: JSON.stringigy()     序列化->对象：JSON.parse

// console.log(
//   JSON.parse(JSON.stringify(users)),
//   typeof JSON.parse(JSON.stringify(users))
// )

var data = JSON.parse(JSON.stringify(users))

data[0].hobbies = ['篮球', '看烟花']
console.log(data, users)
