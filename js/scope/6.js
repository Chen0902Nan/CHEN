// var 变量提升，不支持块级作用域 本应该销毁的变量，没有被销毁
function foo () {
  for (var i = 0; i < 7; i++) {}
  console.log(i)
}
foo()
function foo () {
  for (let i = 0; i < 7; i++) {}
  console.log(i)
}
foo()
