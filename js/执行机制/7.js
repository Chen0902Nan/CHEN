let str = 'hello' // 简单数据类型
let str2 = str //值的拷贝，复印
str2 = '你好'
console.log(str, str2)

console.log(str.length)
let obj = {
  //复杂数据类型
  name: '郑老板',
  age: '18'
}
let obj2 = obj //引用式拷贝
obj2.age++
console.log(obj.age, obj2.age)

// 变量申请内存空间
// 简单数据类型 内存空间 栈内存  拷贝时把值给你
// 复杂数据类型 内存空间 堆内存  拷贝时把地址给你
