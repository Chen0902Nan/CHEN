//坚持一种风格，遵循公司代码风格
let str1 = 'hello world'
let str2 = 'hello world'

//ES6 模板字符串
// 其他大型语言都有字符串模板功能，js 不再去拼接，使用${{}}

let str4 = 'world'
let str3 = `hello ${str4}`

console.log(str3)

//String 类，string类型
let str5 = new String('abc')
console.log(typeof str3)
console.log(
  str5,
  str5.valueOf(),
  typeof str5,
  Object.prototype.toString.call(str5)
)
//为什么？
console.log(str4.length, str5.length)

//自动装箱原理
let str = 'hello' // 字符串原始值

// 当你访问 str.length 时，JavaScript 内部会：
// 1. 临时创建一个 String 对象
let tempStringObject = new String(str)

// 2. 访问这个临时对象的 length 属性
let length = tempStringObject.length

// 3. 丢弃临时对象，返回原始值
console.log(length) // 5
