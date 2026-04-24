// 堆内存中，动态性
// 内存需求 弹性
const users = [
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
  // 动态
]
users.push({
  id: 4,
  name: '陈昊',
  hometown: '南昌'
})

// 栈内存中，简单高效  变量的读写操作，不会影响到空间大小
// 连续存储的简单变量 方便管理 快速访问
// 程序 申请一个连续的空间
let a = 1
let b = 2
let c = 3

let d = a // 值拷贝

// 赋值操作没有完成值的拷贝
const data = users // 引用式拷贝 传入的是地址 堆内存开销大，

data[0].hobbies = ['篮球', '看烟花']
console.log(data, users)
