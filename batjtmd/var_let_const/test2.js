// 会有歧义？
// 在大型语言中 变量应该先声明 再使用
console.log(age) //undefined
var age
age = 18
console.log(age)

// JS 是一门脚本语言，它的编译阶段和执行阶段不像 java/c++ 一样分开的那么清晰
// 编译阶段 在代码执行的一刹那，var 声明的变量就变量提升了
// 接下来代码就进入到了执行阶段，赋值发生在执行阶段
// 变量提升 不利于代码的可读性，应该废弃的糟粕
console.log(height)
console.log(PI)
// ES6 -> 暂时性死区
// 在编译阶段的变量提升是为了编译阶段就知道有哪些变量和常量
// let/const + 暂时性死区 解决了变量提升的问题
const PI = 3.1415

let height = 180
