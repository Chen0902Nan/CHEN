// 变量提升 js 中函数是一等公民，在编译阶段就会进行函数提升
// 和 var 相同的地方是都会提升，不同的地方在于var 只会提升变量声明
// 而函数不只是提升声明，连赋值也一起提升 不只是可以访问，还可以调用
setWidth()
// 全局作用域
function setWidth () {
  // 函数作用域 局部
  var width = 100
  // {
  //   //块级作用域
  //   let a = 1
  // }
  // console.log(a)
  console.log(width)
}

// console.log(width)
