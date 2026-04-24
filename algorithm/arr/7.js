for (var i = 0; i < 10; i++) {
  // 函数作用域，共用一个i
  // var 不支持块级作用域
  setTimeout(() => {
    // 函数作用域
    console.log(i)
  }, 1000)
}

for (let i = 0; i < 10; i++) {
  // i 他自己的词法环境
  // 块级作用域
  setTimeout(() => {
    // 函数作用域
    console.log(i)
  }, 1000)
}
