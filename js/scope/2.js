var globaVar = '我是全局变量'
function myFunctin () {
  var localVar = '我是局部变量'
  console.log(globaVar)
  console.log(localVar)
}
myFunctin()
console.log(localVar)
