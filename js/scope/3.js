var name = '刘锦苗'
function showName () {
  console.log(name)
  if (true) {
    //  块级作用域
    var name = '大厂的苗子'
  }
  // 变量提升在不被察觉的情况下被覆盖掉
  console.log(name)
}
showName()
