// 早期的 JS 就用来页面交互，有一些缺失甚至设计不合理的地方
// 语言精粹：The Good Parts,The Bad Parts
//es5 只有var声明变量，没有常量
let a = 12 //js 弱类型，由值决定
var gender = '女'
var PI = 3.1415926 //变量大写 约定就不应该改变 编程习惯，约定俗成 -> 常量
console.log(PI)
PI = 3.15
console.log(PI)

//es6 2015年  js像java/c++ 大型语言，企业级开发项目
// 建议不再用var了，直接用 let
let height = 188
height++
console.log(height)
const key = 'abc123'
console.log(key)
key = '234abc'
console.log(key)
